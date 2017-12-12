/**
 * Plan routes
 * Prefix: /plans
 */

import express from 'express'
import PlanCtrl from './controller'
import middleware from '../../middleware'
import validation from '../../validation'
import { preQuery } from '../../utils'

const router = express.Router()

/**
 * @apiDefine PlanAPI
 * @apiHeader {String} Authorization User Access token
 */

/**
 * @api {get} /plans/:planId Get plan
 * @apiUse PlanAPI
 *
 * @apiGroup Plan
 * @apiName Show
 * @apiVersion 1.0.0
 *
 */
router.get('/:planId', middleware.requiresAdmin, PlanCtrl.show)

/**
 * @api {post} /plans Create
 * @apiUse PlanAPI
 *
 * @apiGroup Plan
 * @apiName Create
 * @apiVersion 1.0.0
 *
 * @apiParam {String}     name
 * @apiParam {String}     eventId
 * @apiParam {String[]}   areas
 * @apiParam {Number}     fee
 */
router.post('/', validation.plan.create, middleware.requiresAdmin, PlanCtrl.create)

/**
 * @api {post} /plans/:planId Update
 * @apiUse PlanAPI
 *
 * @apiGroup Plan
 * @apiName Update
 * @apiVersion 1.0.0
 *
 * @apiParam {String}     name
 * @apiParam {String[]}   areas
 * @apiParam {Number}     fee
 */
router.put('/:planId', validation.plan.update, middleware.requiresAdmin, PlanCtrl.update)

/**
 * @api {patch} /plans/:planId Change status
 * @apiUse PlanAPI
 *
 * @apiGroup Plan
 * @apiName ChangeStatus
 * @apiVersion 1.0.0
 */
router.patch('/:planId', middleware.requiresAdmin, PlanCtrl.changeStatus)

/* Pre-query */
router.param('eventId', preQuery.event)
router.param('planId', preQuery.plan)

export default router
