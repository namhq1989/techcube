/**
 * Common routes
 * Prefix: /users
 */

import express from 'express'
import CommonCtrl from './controller'

const router = express.Router()

/**
 * @apiDefine CommonAPI
 * @apiHeader {String} Authorization User Access token
 */

/**
 * @api {post} /login Login
 * @apiUse CommonAPI
 *
 * @apiGroup Common
 * @apiName Login
 * @apiVersion 1.0.0
 */
router.post('/login', CommonCtrl.login)

export default router
