const Treeize = require('treeize');
const xss = require('xss');
const bcrypt = require('bcryptjs');
const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/

const UsersService = {
    validatePassword(password) {
        if (password.length < 8) {
            return 'Password must be longer than 8 characters';
        }
        if (password.length > 72) {
            return 'Password must be less than 72 characters';
        }
        if (password.startsWith(' ') || password.endsWith(' ')) {
            return 'Password must not start or end with empty spaces';
        }
        if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
            return 'Password must contain 1 upper case, lower case, number and special character';
        }
        return null;
    },
    hasUserWithEmail(db, email) {
        return db('cgc_users')
            .where({ email })
            .first()
            .then(email => !!email);
    },
    hashPassword(password) {
        return bcrypt.hash(password, 12);
    },
    updateBio(db, id, newUserFields) {
        return db('cgc_users').where({ id }).update(newUserFields);
    },
    insertUser(db, newUser) {
        return db
            .insert(newUser)
            .into('cgc_users')
            .returning('*')
            .then(([user]) => user);

    },
    getBio(db, id) {
        return db('cgc_users AS u').where({ id })
            .select(
                'u.bio'
            );
    },
    serializeUserBios(users) {
        return users.map(this.serializeUserBio);
    },
    serializeUserBio(user) {
        const userBioTree = new Treeize();

        // Some light hackiness to allow for the fact that `treeize`
        // only accepts arrays of objects, and we want to use a single
        // object.
        const userBioData = userBioTree.grow([user]).getData()[0];

        return {
            bio: userBioData.bio,

        };
    },
    serializeUser(user) {
        return {
            id: user.id,
            full_name: xss(user.full_name),
            email: xss(user.email),
            date_created: new Date(user.date_created),
            bio: xss(user.bio)
        };
    },
    deleteUser(db, id) {
        return db('cgc_users AS u').where({ id }).delete();
    }
};
module.exports = UsersService;