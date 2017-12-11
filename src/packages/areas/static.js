import config from '../../config'
import { Area } from '../../models'

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

  Area.find(condition).sort('-createdAt').lean().exec((error, areas) => {
    if (!areas) {
      areas = config.conventions.array
    }
    callback(areas)
  })
}

// Export
export default {
  all
}
