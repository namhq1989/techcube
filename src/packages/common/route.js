/**
 * Common routes
 * Prefix: /users
 */

import express from 'express'
import CommonCtrl from './controller'
import middleware from '../../middleware'

const router = express.Router()

/**
 * @apiDefine CommonAPI
 * @apiHeader {String} Authorization User Access token
 */

/**
 * @api {post} /login Login
 *
 * @apiGroup Common
 * @apiName Login
 * @apiVersion 1.0.0
 */
router.post('/login', CommonCtrl.login)

/**
 * @api {get} /dashboard Dashboard
 * @apiUse CommonAPI
 *
 * @apiGroup Common
 * @apiName Dashboard
 * @apiVersion 1.0.0
 */
router.get('/dashboard', middleware.requiresAdmin, CommonCtrl.dashboard)

export default router
