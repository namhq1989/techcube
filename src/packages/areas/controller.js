import lodash from 'lodash'
import { response, getError } from '../../utils'
import { Area } from '../../models'

const RAW_FIELDS = ['name', 'eventId', 'startAt', 'endAt', 'numOfCheckin']

/**
 * Get list
 *
 */
const all = (req, res) => {
  // Fetch params
  const { eventId } = req.params

  Area.all(eventId, (data) => {
    res.jsonp(response(true, data))
  })
}

/**
 * Show
 *
 */
const show = (req, res) => {
  res.jsonp(response(true, { area: req.areaData.toJSON() }))
}

/**
 * Create new
 *
 */
const create = (req, res) => {
  // Fetch params
  const body = lodash.pick(req.body, RAW_FIELDS)
  const area = new Area(body)
  area.event = body.eventId

  area.save((error) => {
    if (error) {
      return res.jsonp(response(false, {}, getError.message(error)))
    }
    res.jsonp(response(true, {
      _id: area._id
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
  const area = req.areaData

  area.update(body, (error) => {
    if (error) {
      return res.jsonp(response(false, {}, getError.message(error)))
    }
    res.jsonp(response(true, {
      _id: area._id
    }))
  })
}

/**
 * Change status
 *
 */
const changeStatus = (req, res) => {
  // Fetch params
  const area = req.areaData
  area.active = !area.active
  area.save((error) => {
    if (error) {
      return res.jsonp(response(false, {}, getError.message(error)))
    }
    res.jsonp(response(true, {
      active: area.active
    }))
  })
}

// Export
export default {
  all,
  show,
  create,
  update,
  changeStatus
}
