const express = require('express');
const path = require('path');
const UsersService = require('./users-service');
const usersRouter = express.Router();
const jsonBodyParser = express.json();


usersRouter
    .post('/', jsonBodyParser, (req, res, next) => {
        const { password, email, full_name, bio } = req.body;
        for (const field of['full_name', 'email', 'password']) {
            if (!req.body[field]) {
                return res.status(400).json({
                    error: `Missing '${field}' in request body`
                });
            }
        }
        const passwordError = UsersService.validatePassword(password);
        if (passwordError) {
            return res.status(400).json({ error: passwordError });
        }
        UsersService.hasUserWithEmail(
                req.app.get('db'),
                email
            )
            .then(hasUserwithEmail => {
                if (hasUserwithEmail) {
                    return res.status(400).json({ error: `Email is already in use` });
                }
                return UsersService.hashPassword(password)
                    .then(hashedPassword => {
                        const newUser = {
                            password: hashedPassword,
                            email,
                            full_name,
                            date_created: 'now()',
                            bio
                        };

                        return UsersService.insertUser(
                                req.app.get('db'),
                                newUser
                            )
                            .then(user => {
                                res.status(201)
                                    .location(path.posix.join(req.originalUrl, `${user.id}`))
                                    .end();
                            });
                    });
            })
            .catch(next);
    })
    .get('/:user_id', (req, res, next) => {
        UsersService.getBio(req.app.get('db'), parseInt(req.params.user_id))
            .then(users => {
                res.status(200).json(UsersService.serializeUserBios(users));
            });
    })
    .patch('/:user_id', jsonBodyParser, (req, res, next) => {
        const { bio } = req.body;
        const bioToUpdate = { bio };
        UsersService.updateBio(req.app.get('db'), parseInt(req.params.user_id), bioToUpdate)
            .then(numRowsAffected => {
                res.status(204).end();
            })
            .catch(next);
    })
    .delete('/:user_id', (req, res, next) => {
        UsersService.deleteUser(req.app.get('db'), req.params.user_id)
            .then(numRowsAffected => {
                res.status(204).end();
            })
            .catch(next);
    });
module.exports = usersRouter;