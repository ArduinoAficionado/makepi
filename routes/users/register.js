/**
* [POST] Register new user
* @param { String } username
* @param { String } password
*/

const models = require('../../models');
const UserItem = require('../../models/users/item');
const config = require('../../config');
const { uuid } = require('../../utils');

module.exports = {
    method: 'POST',
    endpoint: '/register',
    validate: {
        body: models.users.schema.register.body
    },
    middleware: [async (req, res, next) => {
        let user;
        try {
            // Create user in db
            user = new UserItem(req.body);

            // Set to inactive
            user.set('active', models.users.config.active.FALSE);

            // Generate Verification Code
            user.set('verificationCode', uuid());
        } catch (err) { return req.fail(err); }

        try {
            // PUT to db
            await user.create();

            // Send verification email

            // Generate token
            const token = user.getToken(config.EXPIRY);

            // Return token
            req.data = { status: 200, response: { token } };
            next();
        } catch (err) {
            req.data = { status: 400 || err.status, response: { message: err.message } };
            next();
        }
    }]
};
