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
    })
    .post(jsonParser, (req, res, next) => {
        const { title, game_type, date } = req.body;
        const newUpcomingGame = { title, game_type, date };
        for (const [key, value] of Object.entries(newUpcomingGame)) {
            if (value === null) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                });
            }
        }
        UpcomingService.insertGame(req.app.get('db'), newUpcomingGame)
            .then(game => {
                res.status(201)
                    .json(UpcomingService.serializeUpcomingGame(game));
            })
            .catch(next);

    });
module.exports = upcomingRouter;