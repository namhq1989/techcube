/**
 * Checkin routes
 * Prefix: /checkin
 */

import express from 'express'
import CheckinCtrl from './controller'

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
router.post('/', CheckinCtrl.checkin)

export default router
