import { parallel, mapSeries } from 'async'
import lodash from 'lodash'
import config from '../../config'
import { format } from '../../utils'
import { User } from '../../models'

/**
 * Get all users
 *
 * @param {Number}   page
 * @param {String}   sort
 * @param {String}   keyword
 * @param {String}   role
 * @param {Function} callback
 */
const all = (page = 0, sort = '-createdAt', keyword = '', role = 'all', callback) => {
  const limit = config.limit.users.all

  const condition = {}
  if (keyword) {
    condition.searchString = format.searchString(keyword)
  }

  if (role && role !== 'all') {
    condition.role = role
  }

  parallel({
    total: (cb) => {
      User.count(condition, (error, c) => cb(null, c))
    },
    users: (cb) => {
      User.find(condition).sort(sort).skip(page * limit).limit(limit).lean().exec((error, users) => {
        if (!users) {
          users = config.conventions.array
        }
        mapSeries(users, (user, cb1) => {
          info(user, data => cb1(null, data))
        }, (error, list) => {
          cb(null, list)
        })
      })
    },
    limitPerPage: (cb) => {
      cb(null, limit)
    }
  }, (error, results) => {
    callback(results)
  })
}

/**
 * Get user common info
 *
 * @param {Object}   data
 * @param {Function} callback
 */
const info = (data, callback) => {
  data = lodash.pick(data, ['_id', 'name', 'phone', 'email', 'statuses', 'role', 'locale', 'createdAt'])
  callback(data)
}

// Export
export default {
  all,
  info
}
