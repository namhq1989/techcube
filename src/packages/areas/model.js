/**
 * Area model
 */

import config from '../../config'
import locales from '../../locales'
import { mongoose, Schema } from '../../utils/mongoose'
import Statics from './static'

const AreaSchema = new Schema({
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event'
  },
  name: {
    type: String,
    required: locales.Validation.Area.NameRequired,
    trim: true,
    minlength: [config.area.validate.nameMinLength, locales.Validation.Area.NameMinLength],
    maxlength: [config.area.validate.nameMaxLength, locales.Validation.Area.NameMaxLength]
  },
  startAt: {
    type: Date,
    required: locales.Validation.Area.StartAtRequired
  },
  endAt: {
    type: Date,
    required: locales.Validation.Area.EndAtRequired
  },
  numOfCheckin: {
    type: Number,
    default: 1
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
AreaSchema.index({ event: 1 })

/**
 * Static functions
 */
AreaSchema.statics = Statics

/**
 * Pre-save hook
 */
AreaSchema.pre('save', function (next) {
  if (this.isNew) {
    this._isNew = true
  }

  next()
})

// Export
export default mongoose.model('Area', AreaSchema)
