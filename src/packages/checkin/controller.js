import { series } from 'async'
import config from '../../config'
import { response, getError, helper } from '../../utils'
import locales from '../../locales'
import { ObjectId } from '../../utils/mongoose'
import { Customer, Checkin, Event } from '../../models'

/**
 * Checkin
 *
 */
const checkin = (req, res) => {
  // Fetch params
  const { code, latitude, longitude, deviceInfo } = req.body

  let customer
  let event

  series({
    findCustomer: (cb) => {
      Customer.findOne({
        qrCode: code
      }, (error, doc) => {
        if (error || !doc) {
          cb(true, locales.NotFound.Customer)
        } else {
          customer = doc
          cb()
        }
      })
    },
    findEvent: (cb) => {
      const now = new Date()

      Event.findOne({
        startAt: {
          $lte: now
        },
        endAt: {
          $gte: now
        }
      }, (error, doc) => {
        event = doc
        cb()
      })
    },
    create: (cb) => {
      // Return if event not found
      if (!event) {
        return cb()
      }

      const doc = new Checkin({
        customer: customer._id,
        event: event._id,
        latitude,
        longitude
      })
      doc.device = helper.getDeviceInfo(deviceInfo)

      doc.save((error) => {
        if (error) {
          cb(true, getError.message(error))
        } else {
          cb()
        }
      })
    },
    histories: (cb) => {
      Checkin.allByCustomer(customer._id, 0, '', (data) => {
        cb(null, data.checkin)
      })
    }
  }, (error, results) => {
    if (!customer) {
      customer = {
        _id: new ObjectId(),
        name: 'N/A'
      }
    }

    if (error) {
      const message = !customer ? locales.NotFound.User : locales.Validation.Event.NoActiveEvent
      res.jsonp(response(false, {
        customer,
        histories: results.histories || config.conventions.array
      }, message))
    } else {
      res.jsonp(response(true, {
        customer,
        histories: results.histories
      }))
    }
  })
}

// Export
export default {
  checkin
}
