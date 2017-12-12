import { series, parallel, eachSeries } from 'async'
import lodash from 'lodash'
import config from '../../config'
import { response, helper, getError } from '../../utils'
import locales from '../../locales'
import { Customer, Checkin, Event, CustomerAndEventStatus, Plan, Area } from '../../models'

/**
 * Get list checkin area
 *
 */
const getListArea = (req, res) => {
  // Fetch params
  const { code } = req.params
  let customer = null
  let event = null
  let plan = null
  let areas = []
  let currentArea = ''
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
    findActiveEvent: (cb) => {
      const now = new Date()

      Event.findOne({
        startAt: {
          $lte: now
        },
        endAt: {
          $gte: now
        },
        active: true
      }, (error, obj) => {
        if (error || !obj) {
          cb(true, locales.NotFound.Event)
        } else {
          event = obj
          cb()
        }
      })
    },
    getCurrentPlan: (cb) => {
      CustomerAndEventStatus.getCurrentPlan(customer._id, event._id, (obj) => {
        plan = obj
        cb(!plan, locales.NotFound.Plan)
      })
    },
    getAreas: (cb) => {
      Plan.getAreas(plan._id, (arr) => {
        areas = arr
        cb()
      })
    },
    getCurrentArea: (cb) => {
      const now = Date.now()
      eachSeries(areas, (area, cb1) => {
        if (helper.isInTimeRange(now, area.startAt, area.endAt)) {
          currentArea = area._id
        }
        cb1()
      }, () => {
        cb()
      })
    }
  }, (error, results) => {
    if (error) {
      return res.jsonp(response(false, {}, getError.last(results)))
    }

    res.jsonp(response(true, {
      areas,
      currentArea,
      plan: lodash.pick(plan, ['_id', 'name']),
      customer: lodash.pick(customer, ['_id', 'name']),
      event: lodash.pick(event, ['_id', 'name'])
    }))
  })
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
  let event
  let plan
  let area

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
        },
        active: true
      }, (error, obj) => {
        if (error || !obj) {
          cb(true, locales.NotFound.Event)
        } else {
          event = obj
          cb()
        }
      })
    },
    getPlan: (cb) => {
      CustomerAndEventStatus.getCurrentPlan(customer._id, event._id, (obj) => {
        plan = obj
        cb(!plan, locales.NotFound.Plan)
      })
    },
    findArea: (cb) => {
      Area.findOne({
        _id: areaId
      }).lean().exec((error, obj) => {
        if (error || !obj) {
          return cb(true, locales.NotFound.Area)
        }
        area = obj

        cb(helper.indexFromObjectIds(plan.areas, area._id) === -1, locales.CannotCheckinArea)
      })
    },
    canContinueCheckin: (cb) => {
      Checkin.count({
        customer: customer._id,
        event: event._id,
        area: area._id
      }, (error, c) => {
        cb(c >= area.numOfCheckin, `Không thể checkin vì đã đạt số lượng tối đa: ${area.numOfCheckin}`)
      })
    },
    create: (cb) => {
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
        cb()
      })
    }
  }, (error, results) => {
    Checkin.allByCustomer(customer._id, 0, '-date', (histories) => {
      if (error) {
        res.jsonp(response(false, {
          customer: lodash.pick(customer, ['_id', 'name']),
          histories: histories.checkin
        }, getError.last(results)))
      } else {
        res.jsonp(response(true, {
          customer: lodash.pick(customer, ['_id', 'name']),
          histories: histories.checkin
        }, locales.CheckinSuccess))
      }
    })
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
