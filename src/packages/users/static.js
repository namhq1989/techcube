import lodash from 'lodash'

/**
 * Get user common info
 *
 * @param {Object}   data
 * @param {Function} callback
 */
const info = (data, callback) => {
  data = lodash.pick(data, ['_id', 'name', 'phone', 'email', 'statuses', 'role', 'locale'])
  callback(data)
}

// Export
export default {
  info
}
