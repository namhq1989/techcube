/**
 * Area routes
 * Prefix: /areas
 */

import express from 'express'
import AreaCtrl from './controller'
import middleware from '../../middleware'
import validation from '../../validation'
import { preQuery } from '../../utils'

const router = express.Router()

/**
 * @apiDefine AreaAPI
 * @apiHeader {String} Authorization User Access token
 */

/**
 * @api {get} /areas/event/:eventId Get all areas
 * @apiUse AreaAPI
 *
 * @apiGroup Area
 * @apiName All
 * @apiVersion 1.0.0
 *
 */
router.get('/event/:eventId', middleware.requiresAdmin, AreaCtrl.all)

/**
 * @api {get} /areas/:areaId Get by id
 * @apiUse AreaAPI
 *
 * @apiGroup Area
 * @apiName Show
 * @apiVersion 1.0.0
 *
 */
router.get('/:areaId', middleware.requiresAdmin, AreaCtrl.show)

/**
 * @api {post} /areas Create
 * @apiUse AreaAPI
 *
 * @apiGroup Area
 * @apiName Create
 * @apiVersion 1.0.0
 *
 * @apiParam {String}     name
 * @apiParam {String}     eventId
 * @apiParam {Date}       startAt
 * @apiParam {Date}       endAt
 */
router.post('/', validation.area.create, middleware.requiresAdmin, AreaCtrl.create)

/**
 * @api {post} /areas/:areaId Update
 * @apiUse AreaAPI
 *
 * @apiGroup Area
 * @apiName Update
 * @apiVersion 1.0.0
 *
 * @apiParam {String}     name
 * @apiParam {Date}       startAt
 * @apiParam {Date}       endAt
 */
router.put('/:areaId', validation.area.update, middleware.requiresAdmin, AreaCtrl.update)

/**
 * @api {patch} /areas/:areaId Change status
 * @apiUse AreaAPI
 *
 * @apiGroup Area
 * @apiName ChangeStatus
 * @apiVersion 1.0.0
 */
router.patch('/:areaId', middleware.requiresAdmin, AreaCtrl.changeStatus)

/* Pre-query */
router.param('eventId', preQuery.event)
router.param('areaId', preQuery.area)

export default router
