import lodash from 'lodash'
import config from '../../config'
import locales from '../../locales'
import { response, getError } from '../../utils'
import { ObjectId } from '../../utils/mongoose'
import { User } from '../../models'

const RAW_FIELDS = ['name', 'email', 'role', 'password']

/**
 * Get list
 *
 */
const all = (req, res) => {
  // Fetch params
  const { page, role, keyword, sort } = req.query

  User.all(page, role, keyword, sort, (data) => {
    res.jsonp(response(true, data))
  })
}

/**
 * Get current user data
 *
 */
const me = (req, res) => {
  const userId = new ObjectId(req.user._id)
  User.findOne({
    _id: userId
  }).lean().exec((error, user) => {
    if (error || !user) {
      return res.jsonp(response(false, {}, locales.NotFound.User))
    }
    User.info(user, (data) => {
      res.jsonp(response(true, { user: data }))
    })
  })
}

/**
 * Get user by id
 *
 */
const show = (req, res) => {
  res.jsonp(response(true, req.userData.toJSON()))
}

/**
 * Create new user
 *
 */
const create = (req, res) => {
  // Fetch params
  const body = lodash.pick(req.body, RAW_FIELDS)
  const user = new User(body)
  user.save((error) => {
    if (error) {
      return res.jsonp(response(false, {}, getError.message(error)))
    }
    res.jsonp(response(true, {
      _id: user._id
    }))
  })
}

/**
 * Update user
 *
 */
const update = (req, res) => {
  // Fetch params
  const body = lodash.pick(req.body, RAW_FIELDS)
  const user = req.userData

  if (body.password && body.password.length >= config.user.validate.passwordMinLength) {
    body.hashed_password = user.hashPassword(body.password)
  }

  user.update(body, (error) => {
    if (error) {
      return res.jsonp(response(false, {}, getError.message(error)))
    }
    res.jsonp(response(true, {
      _id: user._id
    }))
  })
}

/**
 * Change status
 *
 */
const changeStatus = (req, res) => {
  // Fetch params
  const user = req.userData
  user.active = !user.active
  user.save((error) => {
    if (error) {
      return res.jsonp(response(false, {}, getError.message(error)))
    }
    res.jsonp(response(true, {
      active: user.active
    }))
  })
}

// Export
export default {
  all,
  me,
  show,
  create,
  update,
  changeStatus
}
