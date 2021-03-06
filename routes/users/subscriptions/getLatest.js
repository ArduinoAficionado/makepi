const models = require('../../../models');
const config = require('../../../config');

module.exports = {
    method: 'GET',
    endpoint: '/subscriptions/latest',
    access: [config.access.level.onboarding, config.access.level.member],
    validate: {
        response: models.subscriptions.schema.get.response
    },
    middleware: [async (req, res, next) => {
        try {
            const subscription = await models.subscriptions.table.getLatest(req.user.sub);
            if (!subscription) req.data = { status: 404, response: { message: 'NOT FOUND' } };
            else req.data = { status: 200, response: subscription.get() };
            next();
        } catch (err) { req.fail(err); }
    }]
};
