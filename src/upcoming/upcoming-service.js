const xss = require('xss');
const Treeize = require('treeize');
const atob = require('atob');

const UpcomingService = {
    decodeAuthToken(header) {
        let token = header.authorization;
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        let user_id = JSON.parse(jsonPayload).user_id;

        return user_id;
    },
    getAllUpcomingGames(db) {
        return db.from('cgc_upcoming_games AS u')
            .select(
                'u.id',
                'u.title',
                'u.date',
                'u.game_type'
            ).where('u.date', '>=', new Date());
    },
    adminGetAllUpcomingGames(db) {
        return db.from('cgc_upcoming_games AS u')
            .select(
                'u.id',
                'u.title',
                'u.date',
                'u.game_type'
            );
    },
    getAllUpcomingGames(db) {
        return db.from('cgc_upcoming_games AS u')
            .select(
                'u.id',
                'u.title',
                'u.date',
                'u.game_type'
            )
            .where('u.date', '>=', new Date());
    },
    serializeUpcomingGames(upcomingGames) {
        return upcomingGames.map(this.serializeUpcomingGame);
    },
    serializeUpcomingGame(upcomingGame) {
        const upcomingGameTree = new Treeize();

        // Some light hackiness to allow for the fact that `treeize`
        // only accepts arrays of objects, and we want to use a single
        // object.
        const upcomingGameData = upcomingGameTree.grow([upcomingGame]).getData()[0];

        return {
            id: upcomingGameData.id,
            title: xss(upcomingGameData.title),
            date: xss(upcomingGameData.date),
            game_type: xss(upcomingGameData.game_type)
        };
    },
    insertGame(db, newUpcomingGame) {
        return db.insert(newUpcomingGame)
            .into('cgc_upcoming_games')
            .returning('*')
            .then(rows => {
                return rows[0];
            });
    },
    deleteGame(db, id) {
        return db('cgc_upcoming_games').where({ id }).delete();
    },
    updateGame(db, id, newGameFields) {
        console.log(id)
        return db('cgc_upcoming_games').where({ id }).update(newGameFields);
    },
    getById(db, id) {
        let gameId = parseInt(id);
        return UpcomingService.adminGetAllUpcomingGames(db)
            .where('u.id', gameId)
            .first();
    },
};
module.exports = UpcomingService;