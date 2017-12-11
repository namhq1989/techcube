import config from '../../config'
import { Plan } from '../../models'

/**
 * Get all
 *
 * @param {ObjectId} eventId
 * @param {Function} callback
 */
const all = (eventId, callback) => {
  const condition = {
    event: eventId
  }

  Plan.find(condition).sort('-createdAt').lean().exec((error, plans) => {
    if (!plans) {
      plans = config.conventions.array
    }
    callback(plans)
  })
}

// Export
export default {
  all
}
