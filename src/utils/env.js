import config from '../config'

function isProduction() {
  return process.env.NODE_ENV === config.env.production
}

function isDevelopment() {
  return process.env.NODE_ENV === config.env.development
}

export default {
  isDevelopment,
  isProduction
}
