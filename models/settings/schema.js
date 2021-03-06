const DB = require('dynamodb-wrapper');
const config = require('../../config');
const modelConfig = require('./config');

const Schema = DB.schema(config.awsConfig);
const { joi } = DB;

const settingId = joi.string()
    .description('Settings ID');

const itemKey = joi.string()
    .description('Settings Key');

const value = joi.string()
    .description('Setting Value');

const label = joi.string()
    .description('Setting label');

const type = joi.number()
    .allow(Object.values(modelConfig.types))
    .description('Setting type');

module.exports = {
    elements: {
        settingId,
        itemKey,
        value,
        label,
        type
    },
    post: {
        body: joi.object({
            settingId: settingId.required(),
            value: value.optional()
        })
    },
    get: {
        params: joi.object({
            settingId: settingId.required()
        })
    },
    dynamo: new Schema({
        tableName: config.tableNames.settings,
        key: {
            hash: 'settingId',
            range: 'itemKey'
        },
        timestamps: true,
        tableDefinition: require('./tableDefinition'),
        schema: {
            settingId: settingId.required(),
            itemKey: itemKey.required(),
            value: value.optional(),
            type: type.required(),
            label: label.required()
        }
    })
};
