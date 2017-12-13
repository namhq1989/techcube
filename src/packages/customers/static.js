import { parallel } from 'async'
import lodash from 'lodash'
import config from '../../config'
import { format, sendMail } from '../../utils'
import { Customer, Checkin } from '../../models'

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
      companySearchString: format.searchString(keyword)
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
  callback(lodash.pick(data, ['_id', 'name', 'phone', 'email', 'company', 'createdAt', 'note', 'statistic', 'qrCode']))
}

/**
 * Customer checked in
 *
 * @param {Object} checkin
 */
const newCheckin = (checkin) => {
  Checkin.aggregate([
    { $match: { customer: checkin.customer } },
    { $group: { _id: '$event', total: { $sum: 1 } } }
  ], (error, data) => {
    let totalCheckin = 0
    let totalEvent = 0
    if (data && data.length) {
      totalCheckin = data.reduce((prev, next) => prev + next.total, 0)
      totalEvent = data.length
    }

    updateStatistic(checkin.customer, ['checkin', 'event'], [totalCheckin, totalEvent])
  })
}

/**
 * Update customer statistic by keys/values
 *
 * @param {ObjectId}  customerId
 * @param {Array}     keys
 * @param {Array}     values
 */
const updateStatistic = (customerId, keys, values) => {
  if (!keys || !keys.length || !values || !values.length || keys.length !== values.length) {
    return
  }

  const statisticCondition = {}
  keys.map((key, index) => {
    statisticCondition[`statistic.${key}`] = values[index]
    return 1
  })

  Customer.update({
    _id: customerId
  }, {
    $set: statisticCondition
  }).exec()
}

/**
 * Send invitation email to customer
 *
 * @param {Object} customer
 */
const sendInvitationEmail = (customer) => {
  sendMail({
    email: customer.email,
    customer
  }, config.mailTemplates.invitation)
}

// Export
export default {
  all,
  info,
  newCheckin,
  updateStatistic,
  sendInvitationEmail
}
