const models = require('../../models');
const config = require('../../config');

module.exports = {
    method: 'GET',
    endpoint: '/settings/:settingId',
    access: [config.access.level.admin],
    validate: {
        params: models.settings.schema.get.params
    },
    middleware: [async (req, res, next) => {
        try {
            const setting = await models.settings.table.get(req.params.settingId);
            if (!setting) req.data = { status: 404, response: { message: 'Not Found' } };
            else req.data = { status: 200, response: setting };
            next();
        } catch (err) { req.fail(err); }
    }]
};
