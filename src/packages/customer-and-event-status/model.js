/**
 * CustomerAndEventStatus model
 */

import { mongoose, Schema } from '../../utils/mongoose'
import Statics from './static'

const CustomerAndEventStatusSchema = new Schema({
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'Customer'
  },
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event'
  },
  plan: {
    type: Schema.Types.ObjectId,
    ref: 'Plan'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  versionKey: false
})

// Index
CustomerAndEventStatusSchema.index({ event: 1 }).index({ customer: 1 }).index({ event: 1, customer: 1 })

/**
 * Static functions
 */
CustomerAndEventStatusSchema.statics = Statics

/**
 * Pre-save hook
 */
CustomerAndEventStatusSchema.pre('save', function (next) {
  if (this.isNew) {
    this._isNew = true
  }

  next()
})

// Export
export default mongoose.model('CustomerAndEventStatus', CustomerAndEventStatusSchema)
