import { series, parallel } from 'async'
import locales from '../../locales'
import { response, getError, env, helper } from '../../utils'
import { ObjectId } from '../../utils/mongoose'
import { User, Customer, Event } from '../../models'

/**
 * Login with email
 *
 * @param  {String} email
 * @param  {String} password
 */
const login = (req, res) => {
  // Fetch params
  let { email } = req.body
  const { password } = req.body

  // Prepare data
  let user

  // Lowercase email string
  if (email) {
    email = email.toLowerCase()
  }

  series({
    findUser: (cb) => {
      User.findOne({ email }, (error, u) => {
        if (error) {
          cb(true, getError.message(error))
        } else if (!u) {
          cb(true, locales.NotFound.User)
        } else {
          user = u
          cb()
        }
      })
    },
    auth: (cb) => {
      // Dont check for development
      if (env.isDevelopment()) {
        return cb()
      }

      cb(!user.authenticate(password), locales.LoginFailed)
    },
    info: (cb) => {
      User.info(user, (data) => {
        user = data
        cb()
      })
    }
  }, (error, results) => {
    if (error) {
      return res.jsonp(response(false, {}, getError.last(results)))
    }

    res.jsonp(response(true, {
      user,
      token: helper.token(user)
    }))
  })
}

/**
 * Get app data
 *
 */
const data = (req, res) => {
  parallel({
    events: (cb) => {
      cb(null, [{
        _id: new ObjectId(),
        name: 'Sample event 1',
        plans: [{
          _id: new ObjectId(),
          name: 'Plan 1',
          fee: 0
        }, {
          _id: new ObjectId(),
          name: 'Plan 2',
          fee: 20000
        }, {
          _id: new ObjectId(),
          name: 'Plan 3',
          fee: 500000
        }]
      }, {
        _id: new ObjectId(),
        name: 'Sample event 2',
        plans: [{
          _id: new ObjectId(),
          name: 'Plan 1',
          fee: 0
        }, {
          _id: new ObjectId(),
          name: 'Plan 2',
          fee: 10000
        }, {
          _id: new ObjectId(),
          name: 'Plan 3',
          fee: 100000
        }]
      }])
    }
  }, (error, results) => {
    res.jsonp(response(true, results))
  })
}

/**
 * Get page dashboard data
 *
 */
const dashboard = (req, res) => {
  parallel({
    totalCustomers: (cb) => {
      Customer.count((error, c) => cb(null, c))
    },
    totalEvents: (cb) => {
      Event.count((error, c) => cb(null, c))
    },
    recentCustomer: (cb) => {
      Customer.findOne().sort('-createdAt').lean().exec((error, customer) => cb(null, customer))
    },
    recentEvent: (cb) => {
      Event.findOne().sort('-createdAt').lean().exec((error, event) => cb(null, event))
    }
  }, (error, results) => {
    res.jsonp(response(true, results))
  })
}

// Export
export default {
  login,
  dashboard,
  data
}
