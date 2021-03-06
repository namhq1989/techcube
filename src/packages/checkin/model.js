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
  area: {
    type: Schema.Types.ObjectId,
    ref: 'Area'
  },
  latitude: Number,
  longitude: Number,
  device: Schema.Types.Mixed,
  byStaff: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
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
 * Pre-save hook
 */
CheckinSchema.pre('save', function (next) {
  if (this.isNew) {
    this._isNew = true
  }

  next()
})

/**
 * Post save hook
 */
CheckinSchema.post('save', (doc) => {
  Hooks.postSave(doc)
})

// Export
export default mongoose.model('Checkin', CheckinSchema)
