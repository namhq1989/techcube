import locales from '../locales'

/**
 * Define response data to client
 *
 * @param  {Boolean}  success
 * @param  {Object}   data
 * @param  {String}   message
 * @param  {Number}   statusCode
 * @return {Object}
 */
export default (success = true, data = {}, message = '', statusCode = 200) => {
  if (!message) {
    message = success ? locales.Success : locales.ServerError
  }

  return {
    success,
    data,
    message,
    statusCode
  }
}
