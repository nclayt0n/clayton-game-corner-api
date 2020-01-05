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

reviewRouter
    .route('/api/game/review')
    .get((req, res, next) => {
        ReviewService.getAllReviews(req.app.get('db'))
            .then(reviews => {
                res.status(200).json(ReviewService.serializeReviews(reviews));
            });
    })
    .post(jsonParser, upload.single('reviewPicture'), (req, res, next) => {
        console.log(req.file);
        const { title, game_type, link, review } = req.body;
        const picture = req.file.path;
        const newReview = { title, game_type, link, picture, review };
        // for (const [key, value] of Object.entries(newReview)) {
        //     if (value === null) {
        //         return res.status(400).json({
        //             error: { message: `Missing '${key}' in request body` }
        //         });
        //     }
        // }
        ReviewService.insertReview(req.app.get('db'), newReview)
            .then(review => {
                res.status(201)
                    .location(path.posix.join(req.originalUrl, `/${review.id}`))
                    .json(review);
                // .json(ReviewService.serializeReview(review));
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
                res.status(200).json(ReviewService.serializeReviews(reviews));
            });
    });
reviewRouter
    .route('/api/game/review/:review_id')
    .all(checkGameExists)
    .get((req, res) => {
        res.json(ReviewService.serializeReview(res.review));
    })
    .patch(jsonParser, (req, res, next) => {
        const { title, game_type, link, picture, review } = req.body;
        const reviewToUpdate = { title, game_type, link, picture, review };
        const numberOfValues = Object.values(reviewToUpdate).filter(Boolean).length;
        if (numberOfValues === 0) {
            return res.status(400).json({ error: { message: `Request body must contain title, game type, review` } });
        }
        ReviewService.updateReview(req.app.get('db'), req.params.review_id, reviewToUpdate)
            .then(numRowsAffected => {
                res.status(204).end();
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