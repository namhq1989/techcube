import Joi from 'joi'
import lodash from 'lodash'
import config from '../config'
import text from './default-text'

const validateObject = {
  name: Joi.string().min(config.user.validate.nameMinLength).max(config.user.validate.nameMaxLength).required().options({
    language: {
      key: '{{!name}}',
      any: {
        required: `Tên khách hàng ${text.IS_REQUIRED}`,
        empty: `Tên khách hàng ${text.IS_EMPTY}`
      },
      string: {
        min: `Tên khách hàng không được dưới ${config.user.validate.nameMinLength} ký tự`,
        max: `Tên khách hàng không được quá ${config.user.validate.nameMaxLength} ký tự`
      }
    }
  }),
  gender: Joi.string().valid(config.genders.list.split(' ')).allow('').options({
    language: {
      key: '{{!gender}}',
      any: {
        allowOnly: `Giới tính ${text.IS_ALLOW_ONLY}: ${config.genders.list.split(' ')}`,
      }
    }
  }),
  phone: Joi.string().regex(config.regex.phone).allow('').options({
    language: {
      key: '{{!phone}}',
      string: {
        regex: {
          base: `Số điện thoại ${text.NOT_VALID}`
        }
      }
    }
  }),
  email: Joi.string().email().required().options({
    language: {
      key: '{{!email}}',
      any: {
        required: `Email ${text.IS_REQUIRED}`,
        empty: `Email ${text.IS_EMPTY}`
      },
      string: {
        email: `Email ${text.NOT_VALID}`
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
  planId: Joi.string().regex(config.regex.objectId).required().options({
    language: {
      key: '{{!planId}}',
      any: {
        required: `Plan ID ${text.IS_REQUIRED}`,
        empty: `Plan ID ${text.IS_EMPTY}`
      },
      string: {
        regex: `Plan ID ${text.NOT_VALID}`
      }
    }
  }),
  page: Joi.number().integer().min(0).options({
    language: {
      key: '{{!page}}',
      number: {
        base: `Số phân trang ${text.MUST_BE_AN_INTEGER}`,
        integer: `Số phân trang ${text.MUST_BE_AN_INTEGER}`,
        min: `Số phân trang ${text.MUST_BE_LARGER_THAN_OR_EQUAL_TO} 0`,
      }
    }
  })
}

export default {
  // POST /customers
  create: {
    body: lodash.pick(validateObject, ['name', 'gender', 'phone', 'email'])
  },

  // PUT /customers/:customerId
  update: {
    body: lodash.pick(validateObject, ['name', 'gender', 'phone', 'email'])
  },

  // GET /customers
  all: {
    query: lodash.pick(validateObject, ['page'])
  },

  // POST /customers/upgradePlan
  upgradePlan: {
    body: lodash.pick(validateObject, ['email', 'phone', 'eventId', 'planId'])
  }
}
