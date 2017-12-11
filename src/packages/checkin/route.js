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
 * @api {get} /checkin Get customer checkin areas list
 *
 * @apiGroup Checkin
 * @apiName ListCheckinAreas
 * @apiVersion 1.0.0
 *
 * @apiParam {String}   code
 */
router.get('/', middleware.requiresStaff, CheckinCtrl.getListArea)

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
 * @apiParam {Object}   device
 * @apiParam {String}   device.info
 * @apiParam {String}   device.name
 * @apiParam {String}   eventId
 * @apiParam {String}   areaId
 */
router.post('/', middleware.requiresStaff, CheckinCtrl.checkin)

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
