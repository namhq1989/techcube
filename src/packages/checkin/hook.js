import { parallel } from 'async'
import { Customer, Event } from '../../models'

/**
 * Do something after checkin saved
 * - If new:
 *    1. Update customer statistic
 *    2. Update event statistic
 *
 * @param {Object} doc
 */
const postSave = (doc) => {
  if (doc._isNew) {
    parallel({
      customer: (cb) => {
        Customer.newCheckin(doc)
        cb()
      },
      event: (cb) => {
        Event.newCheckin(doc)
        cb()
      }
    })
  }
}

// Export
export default {
  postSave
}
