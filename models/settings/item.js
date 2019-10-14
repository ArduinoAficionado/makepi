/*
 * Settings model item class:
 * Promisified Item with History
 */
const { ItemWithHistory } = require('dynamodb-wrapper');
const config = require('../../config');
const utils = require('../../utils');

class Settings extends ItemWithHistory {
  /**
   * @param  {} params={}
   * @param { String } params.key
   * @param { String } params.id
   */
  constructor(params = {}) {
    const attrs = { ...params };
    // If key not provided use default
    if (typeof params.key === 'undefined') {
      attrs.key = config.keyPrefixes.settings;
    }
    // If id not provided generate new UUID
    if (typeof params.id === 'undefined') {
      attrs.id = utils.uuid();
    }
    // Attach params and schema to item
    super({
      attrs,
      schema: require('./schema').dynamo
    });
  }
}

module.exports = Settings;
