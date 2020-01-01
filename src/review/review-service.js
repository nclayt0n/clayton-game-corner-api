const xss = require('xss');
const Treeize = require('treeize');
const atob = require('atob');
const ReviewService = {
    getAllReviews(db) {
        return db.from('cgc_game_reviews AS r')
            .select(
                'r.id',
                'r.title',
                'r.picture',
                'r.review',
                'r.link',
                'r.game_type'
            );
    },
    getAllTabletopReviews(db) {
        return db.from('cgc_game_reviews AS r')
            .select(
                'r.id',
                'r.title',
                'r.picture',
                'r.review',
                'r.link',
                'r.game_type'
            ).where('r.game_type', '=', 'tabletop');
    },
    getAllVideoReviews(db) {
        return db.from('cgc_game_reviews AS r')
            .select(
                'r.id',
                'r.title',
                'r.picture',
                'r.review',
                'r.link',
                'r.game_type'
            ).where('r.game_type', '=', 'video');
    },
    serializeReviews(reviews) {
        return reviews.map(this.serializeReview);
    },
    serializeReview(review) {
        const reviewTree = new Treeize();

        // Some light hackiness to allow for the fact that `treeize`
        // only accepts arrays of objects, and we want to use a single
        // object.
        const reviewData = reviewTree.grow([review]).getData()[0];

        const r = {
            id: reviewData.id,
            title: xss(reviewData.title),
            picture: xss(reviewData.picture),
            review: xss(reviewData.review),
            link: xss(reviewData.link),
            game_type: xss(review.game_type)
        };

        return r;
    },
    insertReview(db, newReview) {
        return db.insert(newReview)
            .into('cgc_game_reviews')
            .returning('*')
            .then(rows => {
                return rows[0];
            });
    },
    updateReview(db, id, newReviewFields) {
        return db('cgc_game_reviews').where({ id }).update(newReviewFields);
    },
    deleteReview(db, id) {
        return db('cgc_game_reviews').where({ id }).delete();
    },
    getById(db, id) {
        let reviewId = parseInt(id);
        return ReviewService.getAllReviews(db)
            .where('r.id', reviewId)
            .first();
    },
};
module.exports = ReviewService;