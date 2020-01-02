const knex = require('knex')
const bcrpyt = require('bcryptjs')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Users Endpoints', function() {
    let db;

    const { testUsers } = helpers.makeCGCFixtures();
    const testUser = testUsers[0];
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

    describe(`POST /api/users`, () => {
        context(`User Validation`, () => {
            beforeEach('insert users', () =>
                helpers.seedUsers(
                    db,
                    testUsers,
                )
            );
            context('Happy path', () => {
                it(`responds 201,seralized user,storing bcryped password`, () => {
                    const newUser = {
                        email: 'testemail@sol.com',
                        password: '11AAaa!!',
                        full_name: 'test full_name',
                        bio: 'User bio'
                    };
                    return supertest(app)
                        .post('/api/users')
                        .send(newUser)
                        .expect(201);
                });
            });
        });
    });
});