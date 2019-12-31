const express = require('express');
const path = require('path');
const jsonParser = express.json();
const ReviewService = require('./review-service');
const reviewRouter = express.Router();

reviewRouter
    .route('/api/game/review')



module.exports = reviewRouter;