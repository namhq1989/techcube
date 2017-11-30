import { parallel } from 'async'
import Statics from './static'

/**
 * Do something after customer saved
 * - If new:
 *    1. Send customer an email with prepared template
 *
 * @param {Object} doc
 */
const postSave = (doc) => {
  if (doc._isNew) {
    parallel({
      sendEmail: (cb) => {
        if (doc.email) {
          Statics.sendInvitationEmail(doc)
        }
        cb()
      }
    })
  }
}

// Export
export default {
  postSave
}
