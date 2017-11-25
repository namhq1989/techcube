import locales from '../locales'

/**
 * Get message from error object
 * @param {Object}   error
 * @return {String}
 */
function message(error) {
  console.log('getErrorMessage', error)
  if (!error) {
    return locales.ServerError
  }

  let code = ''
  if (error.name === 'MongoError') {
    if (error.code === 11000) {
      code = locales.DuplicateData
    } else {
      code = locales.ServerError
    }
  } else if (error.errors) {
    code = error.errors[Object.keys(error.errors)[0]] ? error.errors[Object.keys(error.errors)[0]].message : locales.ServerError
  } else {
    code = -1
  }

  return code
}

/**
 * Get last error from error object
 * @param {Object}  errors
 * @return {String}
 */
function last(errors) {
  const keys = Object.keys(errors)
  return errors[keys[keys.length - 1]]
}

export default {
  message,
  last
}
