const express = require('express');
const path = require('path');
const jsonParser = express.json();
const UpcomingService = require('./upcoming-service');
const upcomingRouter = express.Router();


upcomingRouter
    .route('/api/game/upcoming')
    .get((req, res, next) => {
        // let user_id = UpcomingService.decodeAuthToken(req.headers);
        UpcomingService.getAllUpcomingGames(req.app.get('db'))
            .then(upcomingGame => {
                res.status(200).json(UpcomingService.serializeUpcomingGames(upcomingGame));
            });
    });
module.exports = upcomingRouter;