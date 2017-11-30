import { parallel } from 'async'
import config from '../../config'
import { ObjectId } from '../../utils/mongoose'
import { Checkin } from '../../models'

/**
 * Get list
 *
 * @param {ObjectId}  eventId
 * @param {Number}    page
 * @param {String}    sort
 * @param {Function}  callback
 */
const allByEvent = (eventId, page = 0, sort = '-date', callback) => {
  eventId = new ObjectId(eventId)
  const limit = config.limit.checkin.all

  const condition = {
    event: eventId
  }

  parallel({
    total: (cb) => {
      Checkin.count(condition, (error, c) => cb(null, c))
    },
    checkin: (cb) => {
      Checkin.find(condition).sort(sort).skip(page * limit).limit(limit)
        .populate('customer', 'name').lean().exec((error, checkins) => {
          if (!checkins) {
            checkins = config.conventions.array
          }
          cb(null, checkins)
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
 * Get list
 *
 * @param {ObjectId}  customerId
 * @param {Number}    page
 * @param {String}    sort
 * @param {Function}  callback
 */
const allByCustomer = (customerId, page = 0, sort = '-date', callback) => {
  customerId = new ObjectId(customerId)
  const limit = config.limit.checkin.all

  const condition = {
    customer: customerId
  }

  parallel({
    total: (cb) => {
      Checkin.count(condition, (error, c) => cb(null, c))
    },
    checkin: (cb) => {
      Checkin.find(condition).sort(sort).skip(page * limit).limit(limit)
        .populate('event', 'name').lean().exec((error, checkins) => {
          if (!checkins) {
            checkins = config.conventions.array
          }
          cb(null, checkins)
        })
    },
    limitPerPage: (cb) => {
      cb(null, limit)
    }
  }, (error, results) => {
    callback(results)
  })
}

// Export
export default {
  allByEvent,
  allByCustomer
}
