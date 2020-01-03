const express = require('express');
const path = require('path');
const jsonParser = express.json();
const UpcomingService = require('./upcoming-service');
const upcomingRouter = express.Router();


upcomingRouter
    .route('/api/game/upcoming')
    .get((req, res, next) => {
        UpcomingService.getAllUpcomingGames(req.app.get('db'), req.query)
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
                    .location(path.posix.join(req.originalUrl, `/${game.id}`))
                    .json(UpcomingService.serializeUpcomingGame(game));
            })
            .catch(next);
    });
upcomingRouter
    .route('/api/admin/game/upcoming')
    .get((req, res, next) => {

        UpcomingService.adminGetAllUpcomingGames(req.app.get('db'), req.query)
            .then(upcomingGame => {
                res.status(200).json(UpcomingService.serializeUpcomingGames(upcomingGame));
            });
    });
upcomingRouter
    .route('/api/game/upcoming/:upcoming_id')
    .all(checkGameExists)
    .get((req, res) => {
        res.json(UpcomingService.serializeUpcomingGame(res.game));
    })
    .patch(jsonParser, (req, res, next) => {
        const { title, date, game_type } = req.body;
        const gameToUpdate = { title, date, game_type }
        const numberOfValues = Object.values(gameToUpdate).filter(Boolean).length;
        if (numberOfValues === 0) {
            return res.status(400).json({ error: { message: `Request body must contain name, instructions, and ingredients` } });
        }
        UpcomingService.updateGame(req.app.get('db'), req.params.upcoming_id, gameToUpdate)
            .then(numRowsAffected => {
                res.status(204).end();
            })
            .catch(next);
    })

.delete((req, res, next) => {
    UpcomingService.deleteGame(req.app.get('db'), req.params.upcoming_id)
        .then(numRowsAffected => {
            res.status(204).end();
        })
        .catch(next);
});
async function checkGameExists(req, res, next) {
    try {
        const game = await UpcomingService.getById(
            req.app.get('db'),
            req.params.upcoming_id,
            req.query
        );
        if (!game) {
            return res.status(404).json({
                error: `Game doesn't exist`
            });
        }
        res.game = game;
        next();
    } catch (error) {
        next(error);
    }
}
module.exports = upcomingRouter;