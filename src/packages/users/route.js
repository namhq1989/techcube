/**
 * User routes
 * Prefix: /users
 */

import express from 'express'
import UserCtrl from './controller'
import middleware from '../../middleware'
import validation from '../../validation'
import { preQuery } from '../../utils'

const router = express.Router()

/**
 * @apiDefine UserAPI
 * @apiHeader {String} Authorization User Access token
 */

/**
 * @api {get} /users Get all users
 * @apiUse UserAPI
 *
 * @apiGroup User
 * @apiName All
 * @apiVersion 1.0.0
 *
 * @apiParam {Number}                             page=0
 * @apiParam {String}                             keyword
 * @apiParam {String="all","staff","cashier"}     role
 * @apiParam {String="createdAt","-createdAt"}    sort=-createdAt
 */
router.get('/', validation.user.all, middleware.requiresAdmin, UserCtrl.all)

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
 * @apiName ShowById
 * @apiVersion 1.0.0
 */
router.get('/:userId', preQuery.user, UserCtrl.show)

/**
 * @api {post} /users Create new user
 * @apiUse UserAPI
 *
 * @apiGroup User
 * @apiName Create
 * @apiVersion 1.0.0
 *
 * @apiParam {String}                       name
 * @apiParam {String}                       email
 * @apiParam {String}                       password
 * @apiParam {String="cashier","staff"}     role
 */
router.post('/', validation.user.create, middleware.requiresAdmin, UserCtrl.create)

/**
 * @api {post} /users/:userId Update user info
 * @apiUse UserAPI
 *
 * @apiGroup User
 * @apiName Update
 * @apiVersion 1.0.0
 *
 * @apiParam {String}                       name
 * @apiParam {String}                       email
 * @apiParam {String}                       password
 * @apiParam {String="cashier","staff"}     role
 */
router.put('/:userId', validation.user.update, middleware.requiresAdmin, UserCtrl.update)

/**
 * @api {patch} /users/:userId Change user status
 * @apiUse UserAPI
 *
 * @apiGroup User
 * @apiName ChangeStatus
 * @apiVersion 1.0.0
 */
router.patch('/:userId', middleware.requiresAdmin, UserCtrl.changeStatus)

/* Pre-query */
router.param('userId', preQuery.user)

export default router
