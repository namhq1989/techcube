import { parallel } from 'async'
import config from '../../config'
import { sendMail } from '../../utils'

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
          sendMail({
            user: doc
          }, config.mailTemplates.invitation)
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
