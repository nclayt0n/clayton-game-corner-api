const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');
const xss = require('xss');
const moment = require('moment');

describe('Upcoming Game Endpoints', function() {
    let db;

    const { testUpcomings } = helpers.makeCGCFixtures();
    const testUpcoming = testUpcomings[0];
    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        });
        app.set('db', db);
    });

    after('disconnect from db', () => db.destroy());

    before('cleanup', () => helpers.cleanTables(db));

    afterEach('cleanup', () => helpers.cleanTables(db));

    describe('GET ALL Upcoming Games', () => {
        context('Happy Path', () => {
            beforeEach('insert upcoming games', () =>
                helpers.seedUpcomingTable(
                    db,
                    testUpcomings,
                )
            );
            it('responds 200 with all reviews', () => {
                return supertest(app)
                    .get('/api/admin/game/upcoming')
                    .expect(200);
            });
        });
    });
    describe('GET Upcoming Games where date is today or greater', () => {
        context('Happy Path', () => {
            beforeEach('insert upcoming games', () =>
                helpers.seedUpcomingTable(
                    db,
                    testUpcomings,
                )
            );
            it('responds 200 with all reviews', () => {
                return supertest(app)
                    .get('/api/game/upcoming')
                    .expect(200);
            });
        });
    });
    describe(`POST /api/game/upcoming`, () => {
        context(`Happy path`, () => {
            beforeEach('insert upcoming games', () =>
                helpers.seedUpcomingTable(
                    db,
                    testUpcomings,
                )
            );

            it(`responds 201 ,seralized Upcoming Game`, () => {
                return supertest(app)
                    .post('/api/game/upcoming')
                    .send(testUpcoming)
                    .expect(201)
                    .expect(res => {
                        expect(res.body).to.have.property('id');
                        expect(xss(res.body.title)).to.eql(testUpcoming.title);
                        expect(xss(res.body.date)).to.eql(testUpcoming.date);
                        expect(xss(res.body.game_type)).to.eql(testUpcoming.game_type);
                        expect(res.body.game_type).to.eql(testUpcoming.game_type);
                        expect(res.headers.location).to.eql(`/api/game/upcoming/${res.body.id}`);
                    })
                    .expect(res =>
                        db
                        .from('cgc_upcoming_games AS u')
                        .select(['u.id',
                            'u.title',
                            db.raw(
                                `to_char(u.date,'MM/DD/YYYY') as date`
                            ),
                            'u.game_type'
                        ])
                        .where({ id: res.body.id })
                        .first()
                        .then(row => {
                            expect(row.title).to.eql(testUpcoming.title);
                            expect(row.date).to.eql(testUpcoming.date);
                            expect(row.game_type).to.eql(testUpcoming.game_type);
                            expect(row.picture).to.eql(testUpcoming.picture);
                        })
                    );

            });

        });
    });

});