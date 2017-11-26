import { response, getError } from '../../utils'
import { Event, Checkin } from '../../models'

/**
 * Get list
 *
 */
const all = (req, res) => {
  // Fetch params
  const { page, keyword, sort } = req.query

  Event.all(page, keyword, sort, (data) => {
    res.jsonp(response(true, data))
  })
}

/**
 * Get by id
 *
 */
const show = (req, res) => {
  res.jsonp(response(true, { event: req.eventData.toJSON() }))
}

/**
 * Create new
 *
 */
const create = (req, res) => {
  const event = new Event(req.body)
  event.save((error) => {
    if (error) {
      return res.jsonp(response(false, {}, getError.message(error)))
    }
    res.jsonp(response(true, {
      _id: event._id
    }))
  })
}

/**
 * Update
 *
 */
const update = (req, res) => {
  // Fetch params
  const { body } = req
  let event = req.eventData

  event = Object.assign(event, body)
  event.save((error) => {
    if (error) {
      return res.jsonp(response(false, {}, getError.message(error)))
    }
    res.jsonp(response(true))
  })
}

/**
 * Change status
 *
 */
const changeStatus = (req, res) => {
  // Fetch params
  const event = req.eventData
  event.active = !event.active
  event.save((error) => {
    if (error) {
      return res.jsonp(response(false, {}, getError.message(error)))
    }
    res.jsonp(response(true, {
      active: event.active
    }))
  })
}

/**
 * Checkin histories
 *
 */
const checkinHistories = (req, res) => {
  // Fetch params
  const { page, sort } = req.query
  const eventId = req.eventData._id

  Checkin.allByEvent(eventId, page, sort, (data) => {
    res.jsonp(response(true, data))
  })
}

// Export
export default {
  all,
  show,
  create,
  update,
  changeStatus,
  checkinHistories
}
