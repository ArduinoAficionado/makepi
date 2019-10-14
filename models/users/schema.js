const DB = require('dynamodb-wrapper');
const config = require('../../config');

const Schema = DB.schema(config.awsConfig);
const { joi } = DB;

const id = joi.string()
  .description('User ID');

const key = joi.string()
  .description('Table key');

const username = joi.string()
  .description('Username');

const password = joi.string()
  .min(8)
  .max(255)
  .regex(/[a-zA-Z]/)
  .regex(/[0-9]/)
  .description('New password in plain-text');

const passwordHash = joi.string()
  .description('Salted and Hashed Password');

const remember = joi.boolean()
  .description('Conditional: expiration set on token');

const token = joi.string()
  .description('JWT Auth token');

module.exports = {
  elements: {
    username,
    password,
    token,
    remember
  },
  register: {
    body: joi.object({
      username: username.required(),
      password
    })
  },
  login: {
    body: joi.object({
      username: username.required(),
      password: joi.string().required(),
      remember: remember.required()
    })
  },
  dynamo: new Schema({
    tableName: config.tableNames.users,
    key: {
      hash: 'id',
      range: 'key'
    },
    timestamps: true,
    tableDefinition: require('./tableDefinition'),
    schema: {
      id: id.required(),
      key: key.required(),
      username: username.required(),
      passwordHash: passwordHash.optional()
    }
  })
};
