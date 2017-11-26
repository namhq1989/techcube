/**
 * App router bootstrap
 */

import { Router } from 'express'

export default function () {
  const api = Router()

  // Authenticate with token
  api.use('*', require('./authentication').default)

  // Mount components
  api.use('/', require('./packages/common/route').default)
  api.use('/users', require('./packages/users/route').default)
  api.use('/customers', require('./packages/customers/route').default)
  api.use('/checkin', require('./packages/checkin/route').default)
  api.use('/events', require('./packages/events/route').default)

  return api
}
