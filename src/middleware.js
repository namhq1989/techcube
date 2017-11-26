/**
 * API middleware
 */

import config from './config'
import locales from './locales'
import { response, validation } from './utils'
import { ObjectId } from './utils/mongoose'
import { User } from './models'

function isAuthenticated(user) {
  return (user && user._id)
}

function isAdmin(user, callback) {
  if (!validation.isObjectId(user._id)) {
    return false
  }

  User.count({
    _id: new ObjectId(user._id),
    role: config.user.roles.admin
  }, (error, c) => {
    callback(c)
  })
}

/**
 * Require user logged in to do next action
 */
function requiresLogin(req, res, next) {
  if (!isAuthenticated(req.user)) {
    return res.status(401).jsonp(response(false, {}, locales.RequireLogin, 401))
  }
  next()
}

/**
 * Require admin role to do next action
 */
function requiresAdmin(req, res, next) {
  isAdmin(req.user, (isAuthorized) => {
    if (!isAuthenticated(req.user) || !isAuthorized) {
      return res.status(401).jsonp(response(false, {}, locales.NoPermission, 401))
    }
    next()
  })
}

// Export
export default {
  requiresLogin,
  requiresAdmin
}
