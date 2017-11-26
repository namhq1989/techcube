import { eachSeries } from 'async'
import { response, getError } from '../../utils'
import locales from '../../locales'
import { Customer } from '../../models'

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
 * Update customer
 *
 */
const update = (req, res) => {
  // Fetch params
  const { body } = req
  let customer = req.customerData

  customer = Object.assign(customer, body)
  customer.save((error) => {
    if (error) {
      return res.jsonp(response(false, {}, getError.message(error)))
    }
    res.jsonp(response(true))
  })
}

/**
 * Update customer
 *
 */
const createByExcel = (req, res) => {
  // Fetch params
  const { excelData } = req

  if (!excelData.length) {
    return res.jsonp(response(false, {}, locales.Customer.ExcelFileNoData))
  }

  eachSeries(excelData, (record, cb) => {
    const [name, phone, email, company, city, gender, note] = record
    const customer = new Customer({
      name, phone, email, company, city, gender, note
    })
    customer.save(() => cb())
  }, () => {
    res.jsonp(response(true))
  })
}

// Export
export default {
  all,
  show,
  create,
  update,
  createByExcel
}
