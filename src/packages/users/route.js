/**
 * User routes
 * Prefix: /users
 */

import express from 'express'
import UserCtrl from './controller'
import middleware from '../../middleware'
import { preQuery } from '../../utils'

const router = express.Router()

/**
 * @apiDefine UserAPI
 * @apiHeader {String} Authorization User Access token
 */

/**
 * @api {get} /users/me Get current user data
 * @apiUse UserAPI
 *
 * @apiGroup User
 * @apiName Show
 * @apiVersion 1.0.0
 */
router.get('/me', middleware.requiresLogin, UserCtrl.me)

/**
 * @api {get} /users/:userId Get by id
 * @apiUse UserAPI
 *
 * @apiGroup User
 * @apiName Show
 * @apiVersion 1.0.0
 */
router.get('/:userId', preQuery.user, UserCtrl.show)

/* Pre-query */
router.param('userId', preQuery.user)

export default router
