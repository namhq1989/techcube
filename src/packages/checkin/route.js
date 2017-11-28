/**
 * Checkin routes
 * Prefix: /checkin
 */

import express from 'express'
import middleware from '../../middleware'
import CheckinCtrl from './controller'

const router = express.Router()

/**
 * @apiDefine CheckinAPI
 * @apiHeader {String} Authorization User Access token
 */

/**
 * @api {post} /checkin Checkin
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

/**
 * @api {get} /checkin Recent checkin
 * @apiUse CheckinAPI
 *
 * @apiGroup Checkin
 * @apiName RecentCheckin
 * @apiVersion 1.0.0
 *
 * @apiParam {Number}                   page=0
 * @apiParam {Date}                     start
 * @apiParam {Date}                     end
 * @apiParam {String="date","-date"}    sort=date
 */
router.get('/', middleware.requiresAdmin, CheckinCtrl.recent)

export default router
