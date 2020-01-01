const uuidv4 = require('uuid/v4');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function makeUsersArray() {
    return [{
            email: 'test-user-1@aol.com',
            full_name: 'TU1',
            password: '$2a$12$3JY0O7bXmhkizMdVwBQd5uVVKNVi4TYTjClJyFgBs/ZJyNVoIzM76',
        },
        {
            email: 'test-user-2@gm.com',
            full_name: 'Test user 2',
            password: '$2a$12$3JY0O7bXmhkizMdVwBQd5uVVKNVi4TYTjClJyFgBs/ZJyNVoIzM76',
        },
        {
            email: 'test-user-3@out.com',
            full_name: 'Test user 3',
            password: '$2a$12$3JY0O7bXmhkizMdVwBQd5uVVKNVi4TYTjClJyFgBs/ZJyNVoIzM76',
        },
        {
            email: 'test-user-4@out.com',
            full_name: 'Test user 4',
            password: '$2a$12$3JY0O7bXmhkizMdVwBQd5uVVKNVi4TYTjClJyFgBs/ZJyNVoIzM76',
        },
    ];
}

function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
        ...user,
        password: bcrypt.hashSync(user.password, 1)
    }));
    return db.into('cgc_users').insert(preppedUsers);
    // .then(() =>
    //     //update the auto sequence to stay in sync
    //     db.raw(
    //         `SELECT setval('recipebox_users_id_seq',?)`, [users[users.length - 1].id],
    //     ));
}

function makeReviewsArray() {
    let reviews = [{
            "title": "Test Review 1",
            "review": "This was the best game ever!",
            "picture": "['http://ecx.images-amazon.com/images/I/51l4YWeAEvL._SY300_.jpg']",
            "link": "http://www.notArealSite.com",
            "game_type": "video"
        },
        {
            "title": "Test Review 2",
            "review": "This was an ok game.",
            "picture": "['http://ecx.images-amazon.com/images/I/51l4YWeAEvL._SY300_.jpg']",
            "link": "http://www.notArealSite.com",
            "game_type": "tabletop"
        },
        {
            "title": "Test Review 3",
            "review": "This game was good and bad.",
            "picture": "['http://ecx.images-amazon.com/images/I/51l4YWeAEvL._SY300_.jpg']",
            "link": "http://www.notArealSite.com",
            "game_type": "video"
        },
        {
            "title": "Test Review 4",
            "review": "This was an ok game.",
            "picture": "['http://ecx.images-amazon.com/images/I/51l4YWeAEvL._SY300_.jpg']",
            "link": "http://www.notArealSite.com",
            "game_type": "tabletop"
        }
    ];

    return reviews;
}

function makeUpcomingsArray() {
    return [{
            "title": "Upcoming test Game 1",
            "date": "02/01/2020",
            "game_type": "video"
        },
        {
            "title": "Upcoming test Game 2",
            "date": "03/01/2020",
            "game_type": "tabletop"

        },
        {
            "title": "Upcoming test Game 3",
            "date": "04/01/2020",
            "game_type": "tabletop"

        },
        {
            "title": "Upcoming test Game 4",
            "date": "05/01/2020",
            "game_type": "video"
        }
    ];
}

function cleanTables(db) {
    return db.raw(
        `TRUNCATE
        cgc_game_reviews,
        cgc_users,
        cgc_upcoming_games
        RESTART IDENTITY CASCADE`
    );
}

function makeExpectedReview() {
    return {
        id: 1,
        "title": "Test Review 1",
        "review": "This was the best game ever!",
        "picture": "['http://ecx.images-amazon.com/images/I/51l4YWeAEvL._SY300_.jpg']",
        "link": "http://www.notArealSite.com",
        "game_type": "video"
    };
}

function seedUpcomingGames(db, upcomingGames) {
    return db.into('cgc_upcoming_games').insert(upcomingGames);
}

function makeExpectedUpcoming() {
    return {
        id: 1,
        "title": "Upcoming test Game 3",
        "date": "04/01/2020",
        "game_type": "tabletop"
    };
}

function makeCGCFixtures() {
    const testUsers = makeUsersArray();
    const testUpcomings = makeUpcomingsArray();
    const testReviews = makeReviewsArray();
    return { testUsers, testReviews, testUpcomings };
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({ user_id: 1 }, secret, {
        subject: user.email,
        algorithm: 'HS256',
    });
    return `Bearer ${token}`;
}

function seedUpcomingTable(db, upcomingGames) {
    return db.transaction(async trx => {
        await trx.into('cgc_upcoming_games').insert(upcomingGames);
        // await trx.raw(
        //     `SELECT setval('recipebox_recipes_id_seq',?)`, [recipes[recipes.length - 1].id]
        // );
    });
}


function seedReviewsTables(db, reviews) {
    return db.transaction(async trx => {
        await trx.into('cgc_game_reviews').insert(reviews);
        // await trx.raw(
        //     `SELECT setval('cgc_game_reviews_id_seq',?)`, [reviews[reviews.length - 1].id]
        // );
    });
}


module.exports = {
    makeUsersArray,
    seedUsers,
    makeReviewsArray,
    cleanTables,
    makeExpectedReview,
    makeUpcomingsArray,
    seedUpcomingGames,
    makeExpectedUpcoming,
    makeAuthHeader,
    makeCGCFixtures,
    seedReviewsTables,
    seedUpcomingTable
};