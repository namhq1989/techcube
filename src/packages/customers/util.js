/**
 * Helper functions
 */

import { Customer } from '../../models'

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
  Customer.count({
    email
  }, (error, c) => {
    callback(!c)
  })
}

// Export
export {
  checkUniqueEmail
}
