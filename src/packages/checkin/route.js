/**
 * Checkin routes
 * Prefix: /checkins
 */

import express from 'express'
// import UserCtrl from './controller'
import { response } from '../../utils'
import { ObjectId } from '../../utils/mongoose'

const router = express.Router()

/**
 * @apiDefine CheckinAPI
 */

/**
 * @api {post} /checkins Checkin
 * @apiUse CheckinAPI
 *
 * @apiGroup Checkin
 * @apiName Checkin
 * @apiVersion 1.0.0
 */
router.post('/', (req, res) => {
  res.jsonp(response(true, {
    event: {
      _id: new ObjectId(),
      name: 'Current event'
    },
    histories: [{
      _id: new ObjectId(),
      date: '2017-11-25T17:48:03.629Z',
      event: {
        _id: new ObjectId(),
        name: 'Sample event'
      }
    }, {
      _id: new ObjectId(),
      date: '2017-11-25T17:48:03.629Z',
      event: {
        _id: new ObjectId(),
        name: 'Sample event'
      }
    }, {
      _id: new ObjectId(),
      date: '2017-11-25T17:48:03.629Z',
      event: {
        _id: new ObjectId(),
        name: 'Sample event'
      }
    }, {
      _id: new ObjectId(),
      date: '2017-11-25T17:48:03.629Z',
      event: {
        _id: new ObjectId(),
        name: 'Sample event'
      }
    }]
  }))
})

export default router
