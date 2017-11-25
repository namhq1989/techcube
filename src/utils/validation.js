import { mongoose } from './mongoose'

/**
 * Check string is ObjectId or not
 */
const isObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id)
}

// Export
export default {
  isObjectId
}
