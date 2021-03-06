/**
 * Customer routes
 * Prefix: /customers
 */

import express from 'express'
import multer from 'multer'
import CustomerCtrl from './controller'
import config from '../../config'
import middleware from '../../middleware'
import validation from '../../validation'
import { preQuery } from '../../utils'

const upload = multer({ dest: config.path.upload })
const router = express.Router()

/**
 * @apiDefine CustomerAPI
 * @apiHeader {String} Authorization User Access token
 */

/**
 * @api {get} /customers Get all customers
 * @apiUse CustomerAPI
 *
 * @apiGroup Customer
 * @apiName All
 * @apiVersion 1.0.0
 *
 * @apiParam {Number}                             page=0
 * @apiParam {String}                             keyword
 * @apiParam {String="createdAt","-createdAt"}    sort=-createdAt
 */
router.get('/', validation.customer.all, middleware.requiresAdmin, CustomerCtrl.all)

/**
 * @api {get} /customers/:customerId Get customer by id
 * @apiUse CustomerAPI
 *
 * @apiGroup Customer
 * @apiName Show
 * @apiVersion 1.0.0
 */
router.get('/:customerId', middleware.requiresAdmin, CustomerCtrl.show)

/**
 * @api {post} /customers/upgradePlan Upgrade customer plan
 *
 * @apiGroup Customer
 * @apiName UpgradePlan
 * @apiVersion 1.0.0
 *
 * @apiParam {String}   email
 * @apiParam {String}   phone
 * @apiParam {String}   eventId
 * @apiParam {String}   planId
 */
router.post('/upgradePlan', validation.customer.upgradePlan, middleware.requiresCashier, CustomerCtrl.upgradePlan)

/**
 * @api {post} /customers Create new customer
 *
 * @apiGroup Customer
 * @apiName Create
 * @apiVersion 1.0.0
 *
 * @apiParam {String}   name
 * @apiParam {String}   company
 * @apiParam {String}   city
 * @apiParam {String}   gender
 * @apiParam {String}   phone
 * @apiParam {String}   email
 * @apiParam {String}   note
 * @apiParam {String}   eventId
 * @apiParam {String}   planId
 */
router.post('/', validation.customer.create, middleware.requiresCashier, CustomerCtrl.create)

/**
 * @api {put} /customers/:customerId Update customer
 * @apiUse CustomerAPI
 *
 * @apiGroup Customer
 * @apiName Update
 * @apiVersion 1.0.0
 *
 * @apiParam {String}   name
 * @apiParam {String}   company
 * @apiParam {String}   city
 * @apiParam {String}   gender
 * @apiParam {String}   phone
 * @apiParam {String}   email
 * @apiParam {String}   note
 */
router.put('/:customerId', validation.customer.update, middleware.requiresAdmin, CustomerCtrl.update)

/**
 * @api {post} /customers/customersByExcel Create a set of customers by excel file
 * @apiUse CustomerAPI
 *
 * @apiGroup Customer
 * @apiName CreateByExcel
 * @apiVersion 1.0.0
 *
 * @apiParam {File}   file
 */
router.post('/customersByExcel', upload.single('file'), preQuery.uploadExcel, middleware.requiresAdmin, CustomerCtrl.createByExcel)

/**
 * @api {get} /customers/:customerId/checkin Checkin histories
 * @apiUse CustomerAPI
 *
 * @apiGroup Customer
 * @apiName CheckinHistories
 * @apiVersion 1.0.0
 *
 * @apiParam {Number}                   page=0
 * @apiParam {String="date","-date"}    sort=-date
 */
router.get('/:customerId/checkin', middleware.requiresAdmin, CustomerCtrl.checkinHistories)

/**
 * @api {post} /customers/:customerId/resendEmail Resend email
 * @apiUse CustomerAPI
 *
 * @apiGroup Customer
 * @apiName ResendEmail
 * @apiVersion 1.0.0
 *
 */
router.post('/:customerId/resendEmail', middleware.requiresAdmin, CustomerCtrl.resendEmail)

/* Pre-query */
router.param('customerId', preQuery.customer)

export default router
