import http from 'http'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import xmlparser from 'express-xml-bodyparser'
import helmet from 'helmet'
import compress from 'compression'
import methodOverride from 'method-override'
import initializeDb from './db'
import multiCores from './multi-cores'
import locales from './locales'
import route from './route'
import { env, response } from './utils'

const app = express()
app.server = http.createServer(app)

// models
require('./models')

// set multi cores
multiCores(app)

// logger
if (env.isProduction()) {
  // app.use(morgan('combined'))
  app.use(morgan('dev'))
} else if (env.isDevelopment()) {
  app.use(morgan('dev'))
}

// 3rd party middleware
app.use(cors())
app.use(compress())
app.use(methodOverride())
app.use(helmet())

app.use(bodyParser.json({
  limit: '100kb'
}))

app.use(xmlparser({
  trim: true,
  normalizeTags: false
}))

// connect to db
initializeDb(() => {
  // Init
  require('./init')

  // Routes
  app.use(route())

  // Catch 404 and forward to error handler
  app.use((req, res) => {
    console.log(`*** Path not found: ${req.method} ${req.path}`)
    res.status(404).jsonp(response(false, {}, locales.PathNotFound, 404))
  })

  // Response error to client
  app.use((error, req, res) => {
    console.log('error', error)
    // Token or permission
    if (error.constructor.name === 'UnauthorizedError') {
      res.status(401).jsonp(response(false, {}, locales.Unauthorized, 401))
    } else if (error.message === 'validation error') {
      res.status(400).jsonp(response(false, {}, error.errors[0].messages[0].split('"').join(''), 400))
    } else {
      res.status(error.status || 500).jsonp(response(false, {}, locales.ServerError, error.status || 500))
    }
  })
})

export default app
