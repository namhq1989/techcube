/**
 * User model
 */

import crypto from 'crypto'
import diacritics from 'diacritics'
import config from '../../config'
import locales from '../../locales'
import { format } from '../../utils'
import { mongoose, Schema } from '../../utils/mongoose'
import Statics from './static'
import { checkUniqueEmail, checkUniquePhone } from './util'

const removeDiacritics = diacritics.remove

const UserSchema = new Schema({
  name: {
    type: String,
    required: locales.Validation.User.NameRequired,
    trim: true,
    minlength: [config.user.validate.nameMinLength, locales.Validation.User.NameMinLength],
    maxlength: [config.user.validate.nameMaxLength, locales.Validation.User.NameMaxLength]
  },
  searchString: String,
  locale: {
    type: String,
    enum: {
      values: config.locales.list.split(' '),
      message: locales.Validation.Common.InvalidLocale
    },
    default: config.locales.vi
  },
  phone: {
    type: String,
    validate: [checkUniquePhone, locales.Validation.User.PhoneExisted]
  },
  email: {
    type: String,
    isEmail: {
      message: locales.Validation.Common.InvalidEmail
    },
    validate: [checkUniqueEmail, locales.Validation.User.EmailExisted]
  },
  role: {
    type: String,
    default: [config.user.roles.staff]
  },
  hashed_password: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  salt: String,
  statuses: {
    banned: {
      type: Boolean,
      default: false
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
UserSchema.index({ phone: 1 }).index({ email: 1 })

/**
 * Virtual
 */
UserSchema.virtual('password').set(function (password) {
  this._password = password
  this.salt = this.makeSalt()
  this.hashed_password = this.hashPassword(password)
}).get(function () {
  return this._password
})

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function (plainText) {
    return this.hashPassword(plainText) === this.hashed_password
  },
  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt: function () {
    return crypto.randomBytes(16).toString('base64')
  },

  /**
   * Hash password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  hashPassword: function (password) {
    if (!password || !this.salt) return ''
    const salt = Buffer.from(this.salt, 'base64')
    return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha1').toString('base64')
  }
}

/**
 * Static functions
 */
UserSchema.statics = Statics

/**
 * Pre-save hook
 */
UserSchema.pre('save', function (next) {
  if (this.isNew) {
    this._isNew = true
  }

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

// Export
export default mongoose.model('User', UserSchema)
