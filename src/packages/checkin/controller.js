import { series, parallel, eachSeries } from 'async'
import config from '../../config'
import { response, helper } from '../../utils'
import locales from '../../locales'
import { ObjectId } from '../../utils/mongoose'
import { Customer, Checkin, Event } from '../../models'

/**
 * Get list checkin area
 *
 */
const getListArea = (req, res) => {
  // Fetch params
  // const { code } = req.query
  const id = '5a24d186561931eea092e3e3'
  res.jsonp(response(true, {
    areas: [{
      _id: new ObjectId(),
      name: 'Area 1'
    }, {
      _id: id,
      name: 'Area 2'
    }, {
      _id: new ObjectId(),
      name: 'Area 3'
    }],
    currentArea: id,
    plan: {
      _id: new ObjectId(),
      name: 'Plan 1'
    }
  }))
}

/**
 * Checkin
 *
 */
const checkin = (req, res) => {
  // Fetch params
  const { code, latitude, longitude, device, areaId } = req.body
  const staffId = req.user._id

  let customer
  let events = []

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

      Event.find({
        startAt: {
          $lte: now
        },
        endAt: {
          $gte: now
        },
        active: true
      }, (error, docs) => {
        events = docs
        cb()
      })
    },
    create: (cb) => {
      // Return if event not found
      if (!events || !events.length) {
        return cb()
      }

      eachSeries(events, (event, cb1) => {
        const doc = new Checkin({
          customer: customer._id,
          event: event._id,
          area: areaId,
          latitude,
          longitude,
          byStaff: staffId
        })

        if (device && device.info && device.name) {
          doc.device = helper.getDeviceInfo(device.info)
          doc.device.name = device.name
        }

        doc.save(() => {
          cb1()
        })
      }, () => {
        cb()
      })
    },
    histories: (cb) => {
      Checkin.allByCustomer(customer._id, 0, '-date', (data) => {
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

    if (error || !customer || !events || !events.length) {
      const message = !customer ? locales.NotFound.User : locales.Validation.Event.NoActiveEvent
      res.jsonp(response(false, {
        customer,
        histories: results.histories || config.conventions.array
      }, message))
    } else {
      res.jsonp(response(true, {
        customer,
        histories: results.histories
      }, locales.CheckinSuccess))
    }
  })
}

/**
 * Recent checkin
 *
 */
const recent = (req, res) => {
  const { page = 0, start, end, sort = '-date' } = req.query
  const limit = config.limit.checkin.all

  const condition = {
    date: {
      $gte: new Date(start),
      $lte: new Date(end)
    }
  }

  parallel({
    total: (cb) => {
      Checkin.count(condition, (error, c) => cb(null, c))
    },
    checkin: (cb) => {
      Checkin.find(condition).sort(sort).skip(page * limit).limit(limit)
        .populate('event', 'name').populate('customer', 'name company').lean().exec((error, checkins) => {
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
    res.jsonp(response(true, results))
  })
}

// Export
export default {
  getListArea,
  checkin,
  recent
}
