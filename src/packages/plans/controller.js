import { parallel } from 'async'
import lodash from 'lodash'
import { response, getError } from '../../utils'
import { Plan, Area } from '../../models'

const RAW_FIELDS = ['name', 'eventId', 'areas', 'fee']

/**
 * Show
 *
 */
const show = (req, res) => {
  parallel({
    plan: (cb) => {
      cb(null, req.planData.toJSON())
    },
    areas: (cb) => {
      Area.all(req.planData.event, areas => cb(null, areas))
    }
  }, (error, results) => {
    res.jsonp(response(true, results))
  })
}

/**
 * Create new
 *
 */
const create = (req, res) => {
  // Fetch params
  const body = lodash.pick(req.body, RAW_FIELDS)
  const plan = new Plan(body)
  plan.event = body.eventId

  plan.save((error) => {
    if (error) {
      return res.jsonp(response(false, {}, getError.message(error)))
    }
    res.jsonp(response(true, {
      _id: plan._id
    }))
  })
}

/**
 * Update
 *
 */
const update = (req, res) => {
  // Fetch params
  const body = lodash.pick(req.body, RAW_FIELDS)
  const plan = req.planData

  plan.update(body, (error) => {
    if (error) {
      return res.jsonp(response(false, {}, getError.message(error)))
    }
    res.jsonp(response(true, {
      _id: plan._id
    }))
  })
}

/**
 * Change status
 *
 */
const changeStatus = (req, res) => {
  // Fetch params
  const plan = req.planData
  plan.active = !plan.active
  plan.save((error) => {
    if (error) {
      return res.jsonp(response(false, {}, getError.message(error)))
    }
    res.jsonp(response(true, {
      active: plan.active
    }))
  })
}

// Export
export default {
  show,
  create,
  update,
  changeStatus
}
