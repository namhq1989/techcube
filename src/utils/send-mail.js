import Mailer from '../modules/mailer'

/**
 * Define response data to client
 *
 * @param  {Object}   data
 * @param  {String}   template
 */
export default (data = {}, template) => {
  Mailer(data, template, () => {})
}
