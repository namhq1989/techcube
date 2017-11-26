import { parallel } from 'async'
import lodash from 'lodash'
import config from '../../config'
import { format } from '../../utils'
import { Customer } from '../../models'

/**
 * Get list customers
 *
 * @param {Number}   page
 * @param {String}   keyword
 * @param {String}   sort
 * @param {Function} callback
 */
const all = (page = 0, keyword = '', sort = '-createdAt', callback) => {
  const limit = config.limit.customers.all

  const condition = {}
  if (keyword) {
    condition.$or = [{
      email: keyword.toLowerCase()
    }, {
      searchString: format.searchString(keyword)
    }, {
      phone: format.phone(keyword)
    }]
  }

  parallel({
    total: (cb) => {
      Customer.count(condition, (error, c) => cb(null, c))
    },
    customers: (cb) => {
      Customer.find(condition).sort(sort).skip(page * limit).limit(limit).lean().exec((error, customers) => {
        if (!customers) {
          customers = config.conventions.array
        }
        cb(null, customers)
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
 * Get customer information
 *
 * @param {Object}    data
 * @param {Function}  callback
 */
const info = (data, callback) => {
  parallel({
    checkin: (cb) => {
      cb(null, [])
    }
  }, (error, results) => {
    data = lodash.pick(results, ['_id', 'name', 'phone', 'email', 'company', 'createdAt', 'note', 'statistic'])
    callback(Object.assign(data, results))
  })
}

// Export
export default {
  all,
  info
}
