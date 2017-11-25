/**
 * Connect to multi cores based on number of cpus
 * @param  {Object} app
 */

import http from 'http'
import net from 'net'
import cluster from 'cluster'
import publicIp from 'public-ip'
import ipTool from 'ip'
import os from 'os'
import CliTable from 'cli-table'
import config from './config'

const NUMCPUS = os.cpus().length
const debug = require('debug')('App')

export default function (app) {
  // Set port
  const port = normalizePort(config.port || '3000')
  app.set('port', port)

  // Create HTTP server
  let server = http.createServer(app)

  if (process.env.NODE_ENV !== 'production') {
    server.listen(port)
    // Get ip
    publicIp.v4().then((v4ip) => {
      const table = new CliTable({
        head: ['#', 'Local IP', 'Public IP', 'Num of CPUs'],
        colWidths: [5, 20, 20, 20]
      })
      table.push(['', ipTool.address(), v4ip, NUMCPUS])
      console.log(table.toString())
    })
    debug(`Server started on port ${port}`)
    return
  }

  // #!/usr/bin/env node

  // Set cluster
  if (cluster.isMaster) {
    debug(`Listening on ${port}`)
    const workers = []

    // Helper function, spawn worker when it died
    const spawn = (i) => {
      workers[i] = cluster.fork()

      // Optional: Restart worker on exit
      workers[i].on('exit', () => {
        debug(`worker pid ${workers[i].process.pid} died, restarting...`)
        spawn(i)
      })
    }

    // Spawn workers.
    for (let i = 0; i < NUMCPUS; i += 1) {
      spawn(i)
    }

    // Helper function, get worker index base on ip
    const workerIndex = (ip, len) => {
      const extractedIp = ip.split(/['.'|':']/)
      const arr = []

      for (const el in extractedIp) {
        if (extractedIp[el] === '') {
          arr.push(0)
        } else {
          arr.push(parseInt(extractedIp[el], 16))
        }

        return Number(arr.join('')) % len
      }
    }

    // Create the outside facing server listening on our port.
    server = net.createServer({
      pauseOnConnect: true
    }, (connection) => {
      // We received a connection and need to pass it to the appropriate
      // worker. Get the worker for this connection's source IP and pass
      // it the connection.
      const worker = workers[workerIndex(connection.remoteAddress, NUMCPUS)]
      worker.send('sticky-session:connection', connection)
    }).listen(app.get('port'))
  } else {
    server = app.listen(0, () => {
      // Get ip
      publicIp.v4().then((v4ip) => {
        const table = new CliTable({
          head: ['#', 'Local IP', 'Public IP', 'Num of CPUs', 'Worker id', 'Port'],
          colWidths: [5, 20, 20, 20, 20, 20]
        })
        table.push(['', ipTool.address(), v4ip, NUMCPUS, process.pid, server.address().port])
        console.log(table.toString())
      })
      // debug(`Worker is working with process id ${process.pid}`)
    })

    // Listen to messages sent from the master. Ignore everything else.
    process.on('message', (message, connection) => {
      if (message !== 'sticky-session:connection') {
        return
      }

      // Emulate a connection event on the server by emitting the
      // event with the connection the master sent us.
      server.emit('connection', connection)

      connection.resume()
    })
  }


  // server.listen(port)
  server.on('error', onError)
  // server.on('listening', onListening)

  /**
   * Normalize a port into a number, string, or false.
   */

  function normalizePort(val) {
    const selfPort = parseInt(val, 10)

    if (Number.isNaN(selfPort)) {
      // named pipe
      return val
    }

    if (selfPort >= 0) {
      // port number
      return selfPort
    }

    return false
  }

  /**
   * Event listener for HTTP server "error" event.
   */

  function onError(error) {
    if (error.syscall !== 'listen') {
      throw error
    }

    const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(`${bind} requires elevated privileges`)
        process.exit(1)
        break
      case 'EADDRINUSE':
        console.error(`${bind} is already in use`)
        process.exit(1)
        break
      default:
        throw error
    }
  }

  /**
   * Event listener for HTTP server "listening" event.
   */

  // function onListening() {
  //   const addr = server.address()
  //   const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`
  //   debug(`Listening on ${bind}`)
  // }
}
