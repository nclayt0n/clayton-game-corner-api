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
                    .location(path.posix.join(req.originalUrl, `/${game.id}`))
                    .json(UpcomingService.serializeUpcomingGame(game));
            })
            .catch(next);
    });
upcomingRouter
    .route('/api/game/upcoming/:upcoming_id')
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
    FoldersService.deleteFolder(req.app.get('db'), req.params.folder_id)
        .then(numRowsAffected => {
            res.status(204).end();
        })
        .catch(next);
});
async function checkFolderExists(req, res, next) {
    try {
        const folder = await FoldersService.getById(
            req.app.get('db'),
            req.params.folder_id
        );
        if (!folder) {
            return res.status(404).json({
                error: `Folder doesn't exist`
            });
        }
        res.folder = folder;
        next();
    } catch (error) {
        next(error);
    }
}
module.exports = upcomingRouter;