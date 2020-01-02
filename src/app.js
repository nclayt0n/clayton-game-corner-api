require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const app = express();
const usersRouter = require('./users/users-router');
const authRouter = require('./auth/auth-router');
const upcomingRouter = require('./upcoming/upcoming-router');
const reviewRouter = require('./review/review-router');
const morganOptions = (NODE_ENV === 'production') ? 'tiny' : 'dev';

app.use(morgan(morganOptions));
app.use(helmet());
app.use(cors());
app.use(usersRouter);
app.use(authRouter);
app.use(upcomingRouter);
app.use(reviewRouter);
app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = { error: { message: 'Server Error' } };
    } else {
        response = { message: error.message, error };
    }
    res.status(500).json(response);
});
module.exports = app;