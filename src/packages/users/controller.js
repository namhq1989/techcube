import locales from '../../locales'
import { response } from '../../utils'
import { ObjectId } from '../../utils/mongoose'
import { User } from '../../models'

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
      res.jsonp(response(true, data))
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

// Export
export default {
  me,
  show
}
