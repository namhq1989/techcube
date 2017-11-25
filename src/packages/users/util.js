/**
 * Helper functions
 */

import { format } from '../../utils'
import { User } from '../../models'

/**
 * Check that new email address is already existed or not
 *
 * @param  {String}   email
 * @param  {Function} callback
 * @return {Boolean}
 */
function checkUniqueEmail(email, callback) {
  email = email.toLocaleLowerCase()
  // Find in db
  User.count({
    email
  }, (error, c) => {
    callback(!c)
  })
}

/**
 * Check that new email address is already existed or not
 *
 * @param  {String}   phone
 * @param  {Function} callback
 * @return {Boolean}
 */
function checkUniquePhone(phone, callback) {
  phone = format.phone(phone)

  console.log('phone', phone)
  // Find in db
  User.count({
    phone
  }, (error, c) => {
    callback(!c)
  })
}

// Export
export {
  checkUniqueEmail,
  checkUniquePhone
}
