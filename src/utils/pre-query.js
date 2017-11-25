import validation from './validation'
import response from './response'
import format from './format'
import { ObjectId } from './mongoose'
import locales from '../locales'
import { User } from '../models'

function query(req, res, next, id, Model, message) {
  // Validate id first
  if (!validation.isObjectId(id)) {
    return res.status(400).jsonp(response(false, {}, locales.InvalidRequestData, 400))
  }

  // Find
  Model.findOne({
    _id: new ObjectId(id)
  }, (error, doc) => {
    if (error || !doc) {
      res.status(404).jsonp(response(false, {}, message, 404))
    } else {
      req[`${format.lowerCaseFirstLetter(Model.modelName)}Data`] = doc
      next()
    }
  })
}

const user = (req, res, next, id) => {
  query(req, res, next, id, User, locales.NotFound.User)
}

// Export
export default {
  user
}
