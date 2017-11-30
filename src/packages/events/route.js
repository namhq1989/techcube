/**
 * Event routes
 * Prefix: /events
 */

import express from 'express'
import EventCtrl from './controller'
import middleware from '../../middleware'
import validation from '../../validation'
import { preQuery } from '../../utils'

const router = express.Router()

/**
 * @apiDefine EventAPI
 * @apiHeader {String} Authorization User Access token
 */

/**
 * @api {get} /events Get all events
 * @apiUse EventAPI
 *
 * @apiGroup Event
 * @apiName All
 * @apiVersion 1.0.0
 *
 * @apiParam {Number}                             page=0
 * @apiParam {String}                             keyword
 * @apiParam {String="createdAt","-createdAt"}    sort=-createdAt
 */
router.get('/', validation.event.all, middleware.requiresAdmin, EventCtrl.all)

/**
 * @api {get} /events/:eventId Get event by id
 * @apiUse EventAPI
 *
 * @apiGroup Event
 * @apiName Show
 * @apiVersion 1.0.0
 */
router.get('/:eventId', middleware.requiresAdmin, EventCtrl.show)

/**
 * @api {post} /events Create new event
 * @apiUse EventAPI
 *
 * @apiGroup Event
 * @apiName Create
 * @apiVersion 1.0.0
 *
 * @apiParam {String}   name
 * @apiParam {String}   desc
 * @apiParam {String}   address
 * @apiParam {Date}     startAt
 * @apiParam {Date}     endAt
 */
router.post('/', validation.event.create, middleware.requiresAdmin, EventCtrl.create)

/**
 * @api {put} /events/:eventId Update event
 * @apiUse EventAPI
 *
 * @apiGroup Event
 * @apiName Update
 * @apiVersion 1.0.0
 *
 * @apiParam {String}   name
 * @apiParam {String}   desc
 * @apiParam {String}   address
 * @apiParam {Date}     startAt
 * @apiParam {Date}     endAt
 */
router.put('/:eventId', validation.event.update, middleware.requiresAdmin, EventCtrl.update)

/**
 * @api {patch} /events/:eventId Change status
 * @apiUse EventAPI
 *
 * @apiGroup Event
 * @apiName ChangeStatus
 * @apiVersion 1.0.0
 */
router.patch('/:eventId', middleware.requiresAdmin, EventCtrl.changeStatus)

/**
 * @api {get} /events/:eventId/checkin Checkin histories
 * @apiUse EventAPI
 *
 * @apiGroup Event
 * @apiName CheckinHistories
 * @apiVersion 1.0.0
 *
 * @apiParam {Number}                   page=0
 * @apiParam {String="date","-date"}    sort=-date
 */
router.get('/:eventId/checkin', middleware.requiresAdmin, EventCtrl.checkinHistories)

/* Pre-query */
router.param('eventId', preQuery.event)

export default router
