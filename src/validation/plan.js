import Joi from 'joi'
import lodash from 'lodash'
import config from '../config'
import text from './default-text'

const validateObject = {
  name: Joi.string().min(config.plan.validate.nameMinLength).max(config.plan.validate.nameMaxLength).required().options({
    language: {
      key: '{{!name}}',
      any: {
        required: `Tên ${text.IS_REQUIRED}`,
        empty: `Tên ${text.IS_EMPTY}`
      },
      string: {
        min: `Tên không được dưới ${config.plan.validate.nameMinLength} ký tự`,
        max: `Tên không được quá ${config.plan.validate.nameMaxLength} ký tự`
      }
    }
  }),
  eventId: Joi.string().regex(config.regex.objectId).required().options({
    language: {
      key: '{{!eventId}}',
      any: {
        required: `Event ID ${text.IS_REQUIRED}`,
        empty: `Event ID ${text.IS_EMPTY}`
      },
      string: {
        regex: `Event ID ${text.NOT_VALID}`
      }
    }
  }),
  areas: Joi.array().items(Joi.string().regex(config.regex.objectId)).required().options({
    language: {
      key: '{{!areas}}',
      any: {
        required: `Khu vực ${text.IS_REQUIRED}`,
        empty: `Khu vực ${text.IS_EMPTY}`
      }
    }
  }),
  fee: Joi.number().min(0).required().options({
    language: {
      key: '{{!fee}}',
      any: {
        required: `Phí ${text.IS_REQUIRED}`,
        empty: `Phí ${text.IS_EMPTY}`
      },
      number: {
        min: 'Phí không được dưới 0đ'
      }
    }
  })
}

export default {
  // POST /plans
  create: {
    body: lodash.pick(validateObject, ['name', 'eventId', 'areas', 'fee'])
  },

  // PUT /plans/:planId
  update: {
    body: lodash.pick(validateObject, ['name', 'areas', 'fee'])
  }
}
