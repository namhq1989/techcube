/**
 * Customer model
 */

import diacritics from 'diacritics'
import config from '../../config'
import locales from '../../locales'
import { format, helper } from '../../utils'
import { mongoose, Schema } from '../../utils/mongoose'
import Statics from './static'
import Hooks from './hook'

const removeDiacritics = diacritics.remove

const CustomerSchema = new Schema({
  name: {
    type: String,
    required: locales.Validation.User.NameRequired,
    trim: true,
    minlength: [config.user.validate.nameMinLength, locales.Validation.User.NameMinLength],
    maxlength: [config.user.validate.nameMaxLength, locales.Validation.User.NameMaxLength]
  },
  searchString: String,
  qrCode: String,
  city: String,
  gender: {
    type: String,
    enum: {
      values: config.genders.list.split(' '),
      message: locales.Validation.Common.InvalidGender
    },
    default: config.genders.male
  },
  company: String,
  phone: String,
  email: String,
  note: String,
  statistic: {
    checkin: {
      type: Number,
      default: 0
    },
    event: {
      type: Number,
      default: 0
    }
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
CustomerSchema.index({ searchString: 1 }).index({ phone: 1 }).index({ email: 1 })

/**
 * Static functions
 */
CustomerSchema.statics = Statics

/**
 * Pre-save hook
 */
CustomerSchema.pre('save', function (next) {
  if (this.isNew) {
    this._isNew = true
    this.qrCode = helper.customerQRCode(this)
  }

  this.updatedAt = new Date()

  // Set search string
  this.searchString = removeDiacritics(this.name).toLowerCase()

  // Format phone number
  this.phone = format.phone(this.phone)

  // Lowercase email
  if (this.email) {
    this.email = this.email.toLowerCase()
  }

  next()
})

/**
 * Post save hook
 */
CustomerSchema.post('save', (doc) => {
  Hooks.postSave(doc)
})

// Export
export default mongoose.model('Customer', CustomerSchema)
