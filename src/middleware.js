/**
 * API middleware
 */

import { parallel } from 'async'
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
    return callback(false)
  }

  User.count({
    _id: new ObjectId(user._id),
    role: config.user.roles.admin
  }, (error, c) => {
    callback(c)
  })
}

function isCashier(user, callback) {
  if (!validation.isObjectId(user._id)) {
    return callback(false)
  }

  parallel({
    admin: (cb) => {
      isAdmin(user, value => cb(null, value))
    },
    cashier: (cb) => {
      User.count({
        _id: new ObjectId(user._id),
        role: config.user.roles.cashier
      }, (error, c) => {
        cb(null, c)
      })
    }
  }, (error, results) => {
    callback(results.admin || results.cashier)
  })
}

function isStaff(user, callback) {
  if (!validation.isObjectId(user._id)) {
    return callback(false)
  }

  parallel({
    admin: (cb) => {
      isAdmin(user, value => cb(null, value))
    },
    staff: (cb) => {
      User.count({
        _id: new ObjectId(user._id),
        role: config.user.roles.staff
      }, (error, c) => {
        cb(null, c)
      })
    }
  }, (error, results) => {
    callback(results.admin || results.staff)
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

/**
 * Require cashier role to do next action
 */
function requiresCashier(req, res, next) {
  isCashier(req.user, (isAuthorized) => {
    if (!isAuthenticated(req.user) || !isAuthorized) {
      return res.status(401).jsonp(response(false, {}, locales.NoPermission, 401))
    }
    next()
  })
}

/**
 * Require staff role to do next action
 */
function requiresStaff(req, res, next) {
  isStaff(req.user, (isAuthorized) => {
    if (!isAuthenticated(req.user) || !isAuthorized) {
      return res.status(401).jsonp(response(false, {}, locales.NoPermission, 401))
    }
    next()
  })
}

// Export
export default {
  requiresLogin,
  requiresAdmin,
  requiresCashier,
  requiresStaff
}
