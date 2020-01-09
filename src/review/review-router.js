const express = require('express');
const path = require('path');
const jsonParser = express.json();
const ReviewService = require('./review-service');
const reviewRouter = express.Router();
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    // reject file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    }
});
var fs = require('fs');
var walk = function(dir, done) {
    var results = [];
    fs.readdir(dir, function(err, list) {
        if (err) return (err);
        var i = 0;
        (function next() {
            var file = list[i++];
            if (!file) return results;
            file = path.resolve(dir, file);
            fs.stat(file, function(err, stat) {
                if (stat && stat.isDirectory()) {
                    walk(file, function(err, res) {
                        results = results.concat(res);
                        next();
                    });
                } else {
                    results.push(file);
                    next();
                }
            });
        })();
    });
};
reviewRouter
    .route('/api/game/review')
    .get((req, res, next) => {
        ReviewService.getAllReviews(req.app.get('db'))
            .then(reviews => {
                res.status(200).json(reviews);
            });
    })
    .post(jsonParser, upload.single('picture'), (req, res, next) => {
        console.log(req)
        const { title, game_type, link, review } = req.body;
        let picture = req.file.path;

        const newReview = { title, game_type, link, picture, review };
        for (const [key, value] of Object.entries(newReview)) {
            if (value === null) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                });
            }
        }
        let serializedReview = ReviewService.serializeReview(newReview);
        ReviewService.insertReview(req.app.get('db'), serializedReview)
            .then(review => {
                res.status(201)
                    .location(path.posix.join(req.originalUrl, `/${review.id}`))
                    .json(review);
            })
            .catch(next);
    });
reviewRouter
    .route('/api/game/review/tabletop')
    .get((req, res, next) => {
        ReviewService.getAllTabletopReviews(req.app.get('db'), req.query)
            .then(reviews => {
                res.status(200).json(ReviewService.serializeReviews(reviews));
            });
    });
reviewRouter
    .route('/api/game/review/video')
    .get((req, res, next) => {
        ReviewService.getAllVideoReviews(req.app.get('db'), req.query)
            .then(reviews => {
                res.status(200).json(reviews);
            });
    });
reviewRouter
    .route('/api/game/review/:review_id')
    .get((req, res) => {
        res.json(ReviewService.serializeReview(res.review));
    })
    .patch(jsonParser, upload.single('picture'), (req, res, next) => {
        console.log(req.body)
        let picture;
        let reviewToUpdate;
        const { title, game_type, link, review } = req.body;
        if (req.file !== undefined) {
            picture = req.file.path;
            reviewToUpdate = { title, game_type, link, picture, review };
        } else {
            reviewToUpdate = { title, game_type, link, review };
        }
        let x = walk('./uploads')
        console.log(x)
        for (const [key, value] of Object.entries(reviewToUpdate)) {
            if (value === null) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                });
            }
        }
        let serializedReview = ReviewService.serializeReview(reviewToUpdate);
        ReviewService.updateReview(req.app.get('db'), parseInt(req.params.review_id), serializedReview)
            .then(numRowsAffected => {
                res.status(200).json('updated').end();
            })
            .catch(next);
    })

.delete((req, res, next) => {
    ReviewService.deleteReview(req.app.get('db'), req.params.review_id)
        .then(numRowsAffected => {
            res.status(204).end();
        })
        .catch(next);
});
async function checkGameExists(req, res, next) {
    try {
        const review = await ReviewService.getById(
            req.app.get('db'),
            req.params.review_id,
            req.query
        );
        if (!review) {
            return res.status(404).json({
                error: `Review doesn't exist`
            });
        }
        res.review = review;
        next();
    } catch (error) {
        next(error);
    }
}




module.exports = reviewRouter;