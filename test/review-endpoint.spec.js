const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');
const xss = require('xss');

describe.only('Review Endpoints', function() {
    let db;

    const { testReviews } = helpers.makeCGCFixtures();
    const testReview = testReviews[0];
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

    describe('GET reviews', () => {
        context('Happy Path', () => {
            beforeEach('insert reviews', () =>
                helpers.seedReviewsTables(
                    db,
                    testReviews,
                )
            );
            it('responds 200 with all reviews', () => {
                return supertest(app)
                    .get('/api/game/review')
                    .expect(200);
            });
        });
    });
    describe(`POST /api/game/review`, () => {
        context(`Happy path`, () => {
            beforeEach('insert reviews', () =>
                helpers.seedReviewsTables(
                    db,
                    testReviews,
                )
            );

            it(`responds 201 ,seralized review`, () => {
                let formData = new FormData();
                const newReview = {
                    "title": "new Review Test",
                    "review": "This was the best game ever!",
                    "picture": "uoloads/ecx.images-amazon.com/images/I/51l4YWeAEvL._SY300_.jpg",
                    "link": "http://www.notArealSite.com",
                    "game_type": "video"
                };
                formData.append("title", "new Review Test")
                formData.append("review", "This was the best game ever!")
                formData.append("picture", "BoardGameSplendorLogoFairUse.jpg")
                formData.append("link", "http://www.notArealSite.com")
                formData.append("game_type", "video")
                return supertest(app)
                    .post('/api/game/review')
                    .send(newReview)
                    .expect(201)
                    // .expect(res => {
                    //     expect(res.body).to.have.property('id');
                    //     expect(xss(res.body.title)).to.eql(newReview.title);
                    //     expect(xss(res.body.review)).to.eql(newReview.review);
                    //     expect(xss(res.body.picture)).to.eql(newReview.picture);
                    //     expect(res.body.game_type).to.eql(newReview.game_type);
                    //     expect(res.headers.location).to.eql(`/api/game/review/${res.body.id}`);
                    // })
                    .expect(res =>
                        db
                        .from('cgc_game_reviews')
                        .select('*')
                        .where({ id: res.body.id })
                        .first()
                        .then(row => {
                            expect(row.title).to.eql(newReview.title);
                            expect(row.review).to.eql(newReview.review);
                            expect(row.game_type).to.eql(newReview.game_type);
                            expect(row.picture).to.eql(newReview.picture);
                        })
                    );

            });

        });
    });
    describe(`GET /api/game/review/:review_id`, () => {
        context(`Given no reviews`, () => {
            it(`responds with 404`, () => {
                const reviewId = 123456;
                return supertest(app)
                    .get(`/api/game/review/${reviewId}`)
                    .expect(404);
            });
        });
        context('Given there are reviews in the database', () => {
            const testReviews = helpers.makeReviewsArray();
            beforeEach(() => helpers.seedReviewsTables(
                db,
                testReviews
            ));

            it('removes the review by ID', () => {
                const idToRemove = 1;
                return supertest(app)
                    .get(`/api/game/review/${idToRemove}`)
                    .expect(200);
            });
        });
    });
    describe(`DELETE /api/game/review/:review_id`, () => {
        context('Given there are reviews in the database', () => {
            const testReviews = helpers.makeReviewsArray();
            beforeEach(() => helpers.seedReviewsTables(
                db,
                testReviews
            ));

            it('removes the review by ID', () => {
                const idToRemove = 1;
                return supertest(app)
                    .delete(`/api/game/review/${idToRemove}`)
                    .expect(204);
            });
        });
    });
    describe(`PATCH /api/game/review/:review_id`, () => {
        context(`With reviews`, () => {
            const testReviews = helpers.makeReviewsArray();
            beforeEach(() => helpers.seedReviewsTables(
                db,
                testReviews
            ));
            it(`responds with 200`, () => {
                const reviewId = 1;
                const updatedReview = {
                    "title": "updated Review Test",
                    "review": "This was an ok game ever!",
                    "picture": "['http://ecx.images-amazon.com/images/I/51l4YWeAEvL._SY300_.jpg']",
                    "link": "http://www.notArealSite.com",
                    "game_type": "video"
                };

                return supertest(app)
                    .patch(`/api/game/review/${reviewId}`)
                    .send('updated')
                    .expect(200);
            });
        });
    });
    describe('GET reviews with game_type video', () => {
        context('Happy Path', () => {
            beforeEach('insert reviews', () =>
                helpers.seedReviewsTables(
                    db,
                    testReviews,
                )
            );
            it('responds 200 with all reviews', () => {
                return supertest(app)
                    .get('/api/game/review/video')
                    .expect(200)
                    .expect(res =>
                        db
                        .from('cgc_game_reviews')
                        .select('*')
                        .where({ id: res.body[0].id })
                        .first()
                        .then(row => {
                            expect(row.game_type).to.eql('video');
                        })
                    );
            });
        });
    });
    describe('GET reviews with game_type tabletop', () => {
        context('Happy Path', () => {
            beforeEach('insert reviews', () =>
                helpers.seedReviewsTables(
                    db,
                    testReviews,
                )
            );
            it('responds 200 with all reviews', () => {
                return supertest(app)
                    .get('/api/game/review/tabletop')
                    .expect(200)
                    .expect(res =>
                        db
                        .from('cgc_game_reviews')
                        .select('*')
                        .first()
                        .then(row => {
                            expect(row.game_type).to.eql('tabletop');
                        })
                    );
            });
        });
    });
});