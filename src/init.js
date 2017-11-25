/**
 * Init some data when server start
 */
import { parallel } from 'async'
import moment from 'moment'
import { env } from './utils'

const init = () => {
  parallel({
    traceLogs: (cb) => {
      ['log', 'warn'].forEach((method) => {
        const old = console[method]
        console[method] = function () {
          let stack = (new Error()).stack.split(/\n/)
          if (stack[0].indexOf('Error') === 0) {
            stack = stack.slice(1)
          }
          /* eslint prefer-rest-params: 0 */
          const localArgs = [].slice.apply(arguments).concat(`${[stack[1].trim()]} - ${moment().format('DD/MM/YYYY, HH:mm:ss')}`)
          return old.apply(console, localArgs)
        }
      })

      cb()
    },
    admin: (cb) => {
      if (env.isProduction()) {
        global.adminId = process.env.ADMIN_ID
      } else {
        global.adminId = '573fe5f870a07c52085dba15'
      }
      if (!global.adminId) {
        console.log('*** Please setup a SUPPORT ACCOUNT before run server'.red)
        process.exit(1)
      }
      cb()
    }
  })
}

init()
