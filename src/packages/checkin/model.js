/**
 * Checkin model
 */

import { mongoose, Schema } from '../../utils/mongoose'
import Statics from './static'
import Hooks from './hook'

const CheckinSchema = new Schema({
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'Customer'
  },
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event'
  },
  latitude: Number,
  longitude: Number,
  device: Schema.Types.Mixed,
  date: {
    type: Date,
    default: Date.now
  }
}, {
  versionKey: false
})

// Index
CheckinSchema.index({ event: 1 }).index({ customer: 1 }).index({ event: 1, customer: 1 })

/**
 * Static functions
 */
CheckinSchema.statics = Statics

/**
 * Post save hook
 */
CheckinSchema.post('save', (doc) => {
  Hooks.postSave(doc)
})

// Export
export default mongoose.model('Checkin', CheckinSchema)
