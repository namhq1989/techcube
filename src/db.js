/**
 * Connect to database
 */

import { mongoose } from './utils/mongoose'
import config from './config'

// Debug
// mongoose.set('debug', true)

export default function (callback) {
  mongoose.Promise = global.Promise
  mongoose.connect(config.db, (error) => {
    if (error) {
      console.log('Error on connecting to db: ', error)
      console.log('\x1b[31m', '*** PLEASE CONNECT TO DATABASE BEFORE RUN SERVER', '\x1b[0m')
      process.exit(1)
    }
    callback()
  })
}
