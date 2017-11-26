import { parallel } from 'async'
import config from '../../config'
import { format } from '../../utils'
import { Event } from '../../models'

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
    customers: (cb) => {
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
  updateStatistic(checkin.event, ['checkin'], [1])
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
    $inc: statisticCondition
  }).exec()
}


// Export
export default {
  all,
  newCheckin,
  updateStatistic
}
