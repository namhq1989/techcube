/**
 * User routes
 * Prefix: /users
 */

import express from 'express'
import UserCtrl from './controller'
import { preQuery } from '../../utils'

const router = express.Router()

/**
 * @apiDefine UserAPI
 * @apiHeader {String} Authorization User Access token
 */

/**
 * @api {get} /users/:userId Get by id
 * @apiUse UserApi
 *
 * @apiGroup User
 * @apiName Show
 * @apiVersion 1.0.0
 */
router.get('/:userId', preQuery.user, UserCtrl.show)

/* Pre-query */
router.param('userId', preQuery.user)

export default router
