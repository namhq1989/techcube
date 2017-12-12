import { eachSeries, series } from 'async'
import { response, getError, format } from '../../utils'
import locales from '../../locales'
import { Customer, Checkin, Event, Plan, CustomerAndEventStatus } from '../../models'

/**
 * Get list customers
 *
 */
const all = (req, res) => {
  // Fetch params
  const { page, keyword, sort } = req.query

  Customer.all(page, keyword, sort, (data) => {
    res.jsonp(response(true, data))
  })
}

/**
 * Get customer by id
 *
 */
const show = (req, res) => {
  Customer.info(req.customerData.toJSON(), (customer) => {
    res.jsonp(response(true, { customer }))
  })
}

/**
 * Create new customer
 *
 */
const create = (req, res) => {
  const customer = new Customer(req.body)
  customer.save((error) => {
    if (error) {
      return res.jsonp(response(false, {}, getError.message(error)))
    }
    res.jsonp(response(true))
  })
}

/**
 * Upgrade plan
 *
 */
const upgradePlan = (req, res) => {
  // Fetch params
  const { email, phone, eventId, planId } = req.body

  const condition = {}
  if (email) {
    condition.email = email.split(' ').join('').toLowerCase()
  } else if (phone) {
    condition.phone = format.phone(phone)
  }

  let customer
  series({
    findCustomer: (cb) => {
      Customer.findOne(condition).lean().exec((error, obj) => {
        if (error || !customer) {
          cb(true, locales.NotFound.Customer)
        }

        customer = obj
        cb()
      })
    },
    findEvent: (cb) => {
      Event.findOne({
        _id: eventId
      }).lean().exec((error, obj) => {
        cb(error || !obj, locales.NotFound.Event)
      })
    },
    findPlan: (cb) => {
      Plan.findOne({
        _id: planId
      }).lean().exec((error, obj) => {
        cb(error || !obj, locales.NotFound.Plan)
      })
    },
    upgrade: (cb) => {
      CustomerAndEventStatus.newDoc(customer._id, eventId, planId, () => cb())
    }
  }, (error, results) => {
    if (error) {
      return res.jsonp(response(false, {}, getError.last(results)))
    }

    res.jsonp(response(true, {}, `Nâng cáp gói thành viên cho khách ${customer.name} thành công`))
  })
}

/**
 * Update customer
 *
 */
const update = (req, res) => {
  // Fetch params
  const { body } = req
  let customer = req.customerData

  customer = Object.assign(customer, body)

  // Check exist email first
  Customer.count({
    email: body.email,
    _id: {
      $ne: customer._id
    }
  }, (error, c) => {
    if (error || c) {
      return res.jsonp(response(false, {}, locales.Validation.User.EmailExisted))
    }

    customer.update(customer.toJSON(), (error) => {
      if (error) {
        return res.jsonp(response(false, {}, getError.message(error)))
      }
      res.jsonp(response(true))
    })
  })
}

/**
 * Create by excel file
 *
 */
const createByExcel = (req, res) => {
  // Fetch params
  const { excelData } = req

  if (!excelData.length) {
    return res.jsonp(response(false, {}, locales.Customer.ExcelFileNoData))
  }

  const failed = []
  eachSeries(excelData, (record, cb) => {
    const [name, phone, email, company, note] = record
    const customer = new Customer({
      name,
      phone,
      email,
      company,
      note
    })
    customer.save((error) => {
      if (error) {
        failed.push(email)
      }
      cb()
    })
  }, () => {
    res.jsonp(response(true, { failed }))
  })
}

/**
 * Checkin histories
 *
 */
const checkinHistories = (req, res) => {
  // Fetch params
  const { page, sort } = req.query
  const customerId = req.customerData._id

  Checkin.allByCustomer(customerId, page, sort, (data) => {
    res.jsonp(response(true, data))
  })
}

/**
 * Resend email
 *
 */
const resendEmail = (req, res) => {
  Customer.sendInvitationEmail(req.customerData.toJSON())
  res.jsonp(response(true))
}

// Export
export default {
  all,
  show,
  create,
  upgradePlan,
  update,
  createByExcel,
  checkinHistories,
  resendEmail
}
