/**
 * App router bootstrap
 */

import { Router } from 'express'

export default function () {
  const api = Router()

  // Authenticate with token
  // api.use('*', require('./authenticate'))

  // Mount components
  api.use('/users', require('./packages/users/route').default)

  return api
}
