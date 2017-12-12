import config from '../../config'
import { Plan, CustomerAndEventStatus } from '../../models'

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

  Plan.find(condition).sort('-createdAt').populate('areas', 'name').lean().exec((error, plans) => {
    if (!plans) {
      plans = config.conventions.array
    }
    callback(plans)
  })
}

/**
 * Find lowest active plan of event, and create status
 *
 * @param {ObjectId} customerId
 * @param {ObjectId} eventId
 * @param {Function} callback
 */
const findLowestPlanAndCreateStatus = (customerId, eventId, callback) => {
  Plan.findOne({
    event: eventId,
    active: true
  }).sort('fee').select('name areas').lean().exec((error, plan) => {
    if (error || !plan) {
      return callback(config.conventions.object)
    }

    CustomerAndEventStatus.newDoc(customerId, eventId, plan._id, () => callback(plan))
  })
}

/**
 * Get active areas of plan
 *
 * @param {ObjectId} planId
 * @param {Function} callback
 */
const getAreas = (planId, callback) => {
  Plan.findOne({
    _id: planId
  }).select('areas').populate('areas', 'name startAt endAt numOfCheckin').lean().exec((error, plan) => {
    if (!plan || !plan.areas) {
      callback(config.conventions.array)
    } else {
      callback(plan.areas)
    }
  })
}

// Export
export default {
  all,
  findLowestPlanAndCreateStatus,
  getAreas
}
