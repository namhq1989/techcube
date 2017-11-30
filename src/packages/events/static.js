import { parallel } from 'async'
import config from '../../config'
import { format } from '../../utils'
import { Event, Checkin } from '../../models'

/**
 * Get list
 *
 * @param {Number}   page
 * @param {String}   keyword
 * @param {String}   sort
 * @param {Function} callback
 */
const all = (page = 0, keyword = '', sort = '-createdAt', callback) => {
  const limit = config.limit.events.all

  const condition = {}
  if (keyword) {
    condition.searchString = format.searchString(keyword)
  }

  parallel({
    total: (cb) => {
      Event.count(condition, (error, c) => cb(null, c))
    },
    events: (cb) => {
      Event.find(condition).sort(sort).skip(page * limit).limit(limit).lean().exec((error, events) => {
        if (!events) {
          events = config.conventions.array
        }
        cb(null, events)
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
 * Customer checked in
 *
 * @param {Object} checkin
 */
const newCheckin = (checkin) => {
  Checkin.aggregate([
    { $match: { event: checkin.event } },
    { $group: { _id: '$customer', total: { $sum: 1 } } }
  ], (error, data) => {
    let totalCheckin = 0
    let totalCustomer = 0
    if (data && data.length) {
      totalCheckin = data.reduce((prev, next) => prev + next.total, 0)
      totalCustomer = data.length
    }

    updateStatistic(checkin.event, ['checkin', 'customer'], [totalCheckin, totalCustomer])
  })
}

/**
 * Update event statistic by keys/values
 *
 * @param {ObjectId}  eventId
 * @param {Array}     keys
 * @param {Array}     values
 */
const updateStatistic = (eventId, keys, values) => {
  if (!keys || !keys.length || !values || !values.length || keys.length !== values.length) {
    return
  }

  const statisticCondition = {}
  keys.map((key, index) => {
    statisticCondition[`statistic.${key}`] = values[index]
    return 1
  })

  Event.update({
    _id: eventId
  }, {
    $set: statisticCondition
  }).exec()
}


// Export
export default {
  all,
  newCheckin,
  updateStatistic
}
