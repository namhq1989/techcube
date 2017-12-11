import xlsx from 'node-xlsx'
import fs from 'fs'
import config from '../config'
import validation from './validation'
import response from './response'
import format from './format'
import helper from './helper'
import { ObjectId } from './mongoose'
import locales from '../locales'
import { Customer, User, Event, Plan, Area } from '../models'

function query(req, res, next, id, Model, message) {
  // Validate id first
  if (!validation.isObjectId(id)) {
    return res.status(400).jsonp(response(false, {}, locales.InvalidRequestData, 400))
  }

  // Find
  Model.findOne({
    _id: new ObjectId(id)
  }, (error, doc) => {
    if (error || !doc) {
      res.status(404).jsonp(response(false, {}, message, 404))
    } else {
      req[`${format.lowerCaseFirstLetter(Model.modelName)}Data`] = doc
      next()
    }
  })
}

const uploadExcel = (req, res, next) => {
  if (!req.file) {
    return res.status(404).jsonp(response(false, {}, locales.NotFound.File, 404))
  }

  if (helper.getFileType(req.file.originalname) !== config.file.types.excel) {
    return res.jsonp(response(false, {}, locales.Validation.Common.InvalidExcel))
  }

  // Read and assign to req
  const filePath = config.path.upload + req.file.filename
  const workSheetsFromFile = xlsx.parse(filePath)
  const { data } = workSheetsFromFile[0]
  data.splice(0, 1)
  req.excelData = data
  fs.unlink(filePath, () => {})

  next()
}

const user = (req, res, next, id) => {
  query(req, res, next, id, User, locales.NotFound.User)
}

const customer = (req, res, next, id) => {
  query(req, res, next, id, Customer, locales.NotFound.Customer)
}

const event = (req, res, next, id) => {
  query(req, res, next, id, Event, locales.NotFound.Event)
}

const plan = (req, res, next, id) => {
  query(req, res, next, id, Plan, locales.NotFound.Plan)
}

const area = (req, res, next, id) => {
  query(req, res, next, id, Area, locales.NotFound.Area)
}

// Export
export default {
  uploadExcel,
  user,
  customer,
  event,
  plan,
  area
}
