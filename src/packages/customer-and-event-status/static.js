import { CustomerAndEventStatus, Plan } from '../../models'

/**
 * Create customer and event status
 *
 * @param {ObjectId}  customerId
 * @param {ObjectId}  eventId
 * @param {ObjectId}  planId
 * @param {Function}  callback
 */
const newDoc = (customerId, eventId, planId, callback) => {
  CustomerAndEventStatus.update({
    customer: customerId,
    event: eventId
  }, {
    $set: {
      plan: planId,
      updatedAt: Date.now()
    }
  }, {
    upsert: true
  }).exec(() => callback())
}

/**
 * Get customer current plan
 *
 * @param {ObjectId}  customerId
 * @param {ObjectId}  eventId
 * @param {Function}  callback
 */
const getCurrentPlan = (customerId, eventId, callback) => {
  CustomerAndEventStatus.findOne({
    customer: customerId,
    event: eventId
  }).populate('plan', 'name areas').lean().exec((error, obj) => {
    // If not found, find and create lowest price plan
    if (error || !obj) {
      Plan.findLowestPlanAndCreateStatus(customerId, eventId, callback)
    } else {
      callback(obj.plan)
    }
  })
}

// Export
export default {
  newDoc,
  getCurrentPlan
}
