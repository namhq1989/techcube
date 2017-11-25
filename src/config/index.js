/**
 * Load app config
 */
import defaults from './env'

const env = process.env.NODE_ENV || 'development'
let config

switch (env) {
  case 'production':
    config = require('./env/production')
    break
  case 'development':
    config = require('./env/development')
    break
  default:
    break
}

export default Object.assign(defaults, config)
