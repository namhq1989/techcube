/**
 * Validate params from client
 */

import validate from 'express-validation'

// Validate components
import customer from './customer'
import event from './event'
import user from './user'
import plan from './plan'
import area from './area'


// Apply validate function to object
const parse = (object) => {
  const data = {}
  for (const key of Object.keys(object)) {
    data[key] = validate(object[key])
  }
  return data
}

// Export
export default {
  customer: parse(customer),
  event: parse(event),
  user: parse(user),
  plan: parse(plan),
  area: parse(area)
}
