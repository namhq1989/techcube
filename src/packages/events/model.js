/**
 * Event model
 */

import diacritics from 'diacritics'
import config from '../../config'
import locales from '../../locales'
import { mongoose, Schema } from '../../utils/mongoose'
import Statics from './static'

const removeDiacritics = diacritics.remove

const EventSchema = new Schema({
  name: {
    type: String,
    required: locales.Validation.Event.NameRequired,
    trim: true,
    minlength: [config.event.validate.nameMinLength, locales.Validation.Event.NameMinLength],
    maxlength: [config.event.validate.nameMaxLength, locales.Validation.Event.NameMaxLength]
  },
  searchString: String,
  desc: String,
  address: String,
  startAt: {
    type: Date,
    required: locales.Validation.Event.NameRequired,
    default: Date.now
  },
  endAt: {
    type: Date,
    required: locales.Validation.Event.NameRequired,
    default: Date.now
  },
  statistic: {
    checkin: {
      type: Number,
      default: 0
    }
  },
  active: {
    type: Boolean,
    default: false
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
EventSchema.index({ searchString: 1 }).index({ startAt: 1 }).index({ endAt: 1 })

/**
 * Static functions
 */
EventSchema.statics = Statics

/**
 * Pre-save hook
 */
EventSchema.pre('save', function (next) {
  if (this.isNew) {
    this._isNew = true
  }

  this.updatedAt = new Date()

  // Set search string
  this.searchString = removeDiacritics(this.name).toLowerCase()

  next()
})

// Export
export default mongoose.model('Event', EventSchema)
