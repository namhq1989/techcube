/**
 * API authentication
 */

import express from 'express'
import { verify } from 'jsonwebtoken'
import { response } from './utils'
import locales from './locales'
import config from './config'

const router = express.Router()

// List fields will cast to number by default
const numericFields = ['page']
const booleanFields = []

router.use((req, res, next) => {
  // Cast all number in query data to number type instead of string
  for (const key in req.query) {
    if (numericFields.indexOf(key) !== -1 && req.query[key] === Number(req.query[key])) {
      req.query[key] = Number(req.query[key])
    } else if (booleanFields.indexOf(key) !== -1) {
      switch (req.query[key].toLowerCase()) {
        case '0':
        case 'false':
          req.query[key] = false
          break
        default:
          req.query[key] = true
      }
    }
  }

  // Check header for token
  const token = req.headers.authorization

  // Decode token
  if (token) {
    // Verifies secret and checks exp
    verify(token.split(' ')[1], config.secret, (error, decoded) => {
      if (error) {
        return res.status(401).jsonp(response(false, {}, locales.Unauthorized, 401))
      }

      // If everything is good, save to request for use in other stuffs
      if (typeof decoded === 'string') {
        decoded = JSON.parse(decodeURIComponent(decoded))
      }

      req.user = decoded

      // Set default locale
      if (!req.user.locale) {
        req.user.locale = config.locales.vi
      }
      next()
    })
  } else {
    // If no token found, user is consider as not authenticated
    req.user = {
      locale: config.locales.vi
    }
    next()
  }
})

export default router
