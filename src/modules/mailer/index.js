/**
 * Send email to user, using config account
 */

import nodemailer from 'nodemailer'
import config from '../../config'
import locales from '../../locales'
import templates from './template'

console.log(config.mailer)

// Setup transport
const transport = nodemailer.createTransport(config.mailer)

/**
 * @param  {Object} data
 * @param  {String} template
 *
 */
export default function (data, template, callback) {
  // Return if mail template not found
  if (!templates[template]) {
    return callback(true, locales.NotFound.MailTemplate)
  }

  // Setup email
  const options = {
    to: data.email,
    from: config.mailer.from
  }

  templates[template](data, options, (mailOptions) => {
    transport.sendMail(mailOptions, (error) => {
      if (error) {
        console.log(error)
        callback(true, locales.SendMailError)
      } else {
        callback()
      }
    })
  })
}
