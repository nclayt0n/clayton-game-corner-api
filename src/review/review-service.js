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
                'r.game_type',
                db.raw(
                    `to_char(r.date_created,'MM/DD/YYYY') as date_created`
                )
            )
            .orderBy('r.title', 'asc');
    },
    getAllTabletopReviews(db, query) {
        if (query.limit !== undefined && query.offset !== undefined) {
            return db.from('cgc_game_reviews AS r')
                .select(
                    'r.id',
                    'r.title',
                    'r.picture',
                    'r.review',
                    'r.link',
                    'r.game_type',
                    db.raw(
                        `to_char(r.date_created,'MM/DD/YYYY') as date_created`
                    )
                )
                .orderBy('r.title', 'asc')
                .where('r.game_type', '=', 'tabletop')
                .limit(parseInt(query.limit))
                .offset(parseInt(query.offset));
        } else {
            return db.from('cgc_game_reviews AS r')
                .select(
                    'r.id',
                    'r.title',
                    'r.picture',
                    'r.review',
                    'r.link',
                    'r.game_type',
                    db.raw(
                        `to_char(r.date_created,'MM/DD/YYYY') as date_created`
                    )
                )
                .orderBy('r.title', 'asc')
                .where('r.game_type', '=', 'tabletop');
        }

    },
    getAllVideoReviews(db, query) {
        if (query.limit !== undefined && query.offset !== undefined) {
            return db.from('cgc_game_reviews AS r')
                .select(
                    'r.id',
                    'r.title',
                    'r.picture',
                    'r.review',
                    'r.link',
                    'r.game_type',
                    db.raw(
                        `to_char(r.date_created,'MM/DD/YYYY') as date_created`
                    )
                )
                .orderBy('r.title', 'asc')
                .where('r.game_type', '=', 'video')
                .limit(parseInt(query.limit))
                .offset(parseInt(query.offset));
        } else {
            return db.from('cgc_game_reviews AS r')
                .select(
                    'r.id',
                    'r.title',
                    'r.picture',
                    'r.review',
                    'r.link',
                    'r.game_type',
                    db.raw(
                        `to_char(r.date_created,'MM/DD/YYYY') as date_created`
                    )
                )
                .orderBy('r.title', 'asc')
                .where('r.game_type', '=', 'video');
        }
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
            picture: reviewData.picture,
            review: xss(reviewData.review),
            link: xss(reviewData.link),
            game_type: xss(review.game_type),
            date_created: review.date_created
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
    getById(db, id, query) {
        let reviewId = parseInt(id);
        return ReviewService.getAllReviews(db, query)
            .where('r.id', reviewId)
            .first();
    },
};
module.exports = ReviewService;