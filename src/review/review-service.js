const xss = require('xss');
const Treeize = require('treeize');
const atob = require('atob');
const path = require('path');
const fs = require('fs');
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
                    'r.game_type'
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
                    'r.game_type'
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
                    'r.game_type'
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
                    'r.game_type'
                )
                .orderBy('r.title', 'asc')
                .where('r.game_type', '=', 'video');
        }
    },
    serializeReviews(reviews) {
        return reviews.map(this.serializeReview);
    },
    serializeReview(review) {
        console.log(review)
        const reviewTree = new Treeize();

        // Some light hackiness to allow for the fact that `treeize`
        // only accepts arrays of objects, and we want to use a single
        // object.
        const reviewData = reviewTree.grow([review]).getData()[0];
        // const parsed = {
        //     id: review.id,
        //     title: JSON.parse(reviewData.title),
        //     picture: reviewData.picture,
        //     review: JSON.parse(reviewData.review),
        //     link: JSON.parse(reviewData.link),
        //     game_type: JSON.parse(review.game_type)
        // };
        const r = {
            title: xss(reviewData.title),
            picture: reviewData.picture,
            review: xss(reviewData.review),
            link: xss(reviewData.link),
            game_type: xss(reviewData.game_type)
        };


        return r;
    },

    insertReview(db, newReview) {
        const { title, review, id, link, game_type, picture } = newReview;
        const parsedReview = {
            id: id,
            title: JSON.parse(title),
            review: JSON.parse(review),
            link: JSON.parse(link),
            game_type: JSON.parse(game_type),
            picture: picture
        };
        return db.insert(parsedReview)
            .into('cgc_game_reviews')
            .returning('*')
            .then(rows => {
                return rows[0];
            });
    },
    updateReview(db, id, newReviewFields) {
        if (newReviewFields.picture !== undefined) {
            JSON.stringify(newReviewFields.picture)
        }
        console.log(id, newReviewFields)
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
    walk(dir, done) {
        var results = [];
        fs.readdir(dir, function(err, list) {
            if (err) return console.log(err);
            var pending = list.length;
            if (!pending) return console.log(null, results);
            list.forEach(function(file) {
                file = path.resolve(dir, file);
                fs.stat(file, function(err, stat) {
                    if (stat && stat.isDirectory()) {
                        walk(file, function(err, res) {
                            results = results.concat(res);
                            if (!--pending) console.log(null, results);
                        });
                    } else {
                        results.push(file);
                        if (!--pending) console.log(null, results);
                    }
                });
            });
        });
    }
};
module.exports = ReviewService;