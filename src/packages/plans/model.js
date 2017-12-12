/**
 * Plan model
 */

import config from '../../config'
import locales from '../../locales'
import { mongoose, Schema } from '../../utils/mongoose'
import Statics from './static'

const PlanSchema = new Schema({
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event'
  },
  name: {
    type: String,
    required: locales.Validation.Plan.NameRequired,
    trim: true,
    minlength: [config.plan.validate.nameMinLength, locales.Validation.Plan.NameMinLength],
    maxlength: [config.plan.validate.nameMaxLength, locales.Validation.Plan.NameMaxLength]
  },
  areas: [{
    type: Schema.Types.ObjectId,
    ref: 'Area'
  }],
  fee: {
    type: Number,
    default: 0
  },
  active: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  versionKey: false
})

// Index
PlanSchema.index({ event: 1 })

/**
 * Static functions
 */
PlanSchema.statics = Statics

/**
 * Pre-save hook
 */
PlanSchema.pre('save', function (next) {
  if (this.isNew) {
    this._isNew = true
  }

  next()
})

// Export
export default mongoose.model('Plan', PlanSchema)
