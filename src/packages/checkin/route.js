/**
 * Checkin routes
 * Prefix: /checkin
 */

import express from 'express'
// import CheckinCtrl from './controller'
import { response } from '../../utils'
import { ObjectId } from '../../utils/mongoose'

const router = express.Router()

/**
 * @apiDefine CheckinAPI
 */

/**
 * @api {post} /checkin Checkin
 * @apiUse CheckinAPI
 *
 * @apiGroup Checkin
 * @apiName Checkin
 * @apiVersion 1.0.0
 *
 * @apiParam {String}   code
 * @apiParam {Number}   latitude
 * @apiParam {Number}   longitude
 * @apiParam {String}   deviceInfo
 */
// router.post('/', CheckinCtrl.checkin)
router.post('/', (req, res) => {
  res.jsonp(response(true, {
    customer: {
      _id: new ObjectId(),
      name: 'John Doe'
    },
    histories: [{
      _id: new ObjectId(),
      date: '2017-11-20T04:16:43.228Z',
      event: {
        _id: new ObjectId(),
        name: 'Sample event'
      }
    }, {
      _id: new ObjectId(),
      date: '2017-11-20T04:16:43.228Z',
      event: {
        _id: new ObjectId(),
        name: 'Sample event'
      }
    }, {
      _id: new ObjectId(),
      date: '2017-11-20T04:16:43.228Z',
      event: {
        _id: new ObjectId(),
        name: 'Sample event'
      }
    }, {
      _id: new ObjectId(),
      date: '2017-11-20T04:16:43.228Z',
      event: {
        _id: new ObjectId(),
        name: 'Sample event'
      }
    }, {
      _id: new ObjectId(),
      date: '2017-11-20T04:16:43.228Z',
      event: {
        _id: new ObjectId(),
        name: 'Sample event'
      }
    }]
  }))
})

export default router
