import Joi from 'joi'
import lodash from 'lodash'
import config from '../config'
import text from './default-text'

const validateObject = {
  name: Joi.string().min(config.user.validate.nameMinLength).max(config.user.validate.nameMaxLength).required().options({
    language: {
      key: '{{!name}}',
      any: {
        required: `Tên ${text.IS_REQUIRED}`,
        empty: `Tên ${text.IS_EMPTY}`
      },
      string: {
        min: `Tên không được dưới ${config.user.validate.nameMinLength} ký tự`,
        max: `Tên không được quá ${config.user.validate.nameMaxLength} ký tự`
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
  role: Joi.string().valid(config.user.roles.list.split(' ')).allow('').options({
    language: {
      key: '{{!role}}',
      any: {
        required: `Quyền ${text.IS_REQUIRED}`,
        empty: `Quyền ${text.IS_EMPTY}`,
        allowOnly: `Quyền ${text.IS_ALLOW_ONLY}: ${config.user.roles.list.split(' ')}`,
      }
    }
  }),
  password: Joi.string().min(config.user.validate.passwordMinLength).max(config.user.validate.passwordMaxLength).required().options({
    language: {
      key: '{{!name}}',
      any: {
        required: `Mật khẩu ${text.IS_REQUIRED}`,
        empty: `Mật khẩu ${text.IS_EMPTY}`
      },
      string: {
        min: `Mật khẩu không được dưới ${config.user.validate.passwordMinLength} ký tự`,
        max: `Mật khẩu không được quá ${config.user.validate.passwordMaxLength} ký tự`
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
  // POST /users
  create: {
    body: lodash.pick(validateObject, ['name', 'email', 'password', 'role'])
  },

  // PUT /users/:userId
  update: {
    body: lodash.pick(validateObject, ['name', 'email', 'password', 'role'])
  },

  // GET /users
  all: {
    query: lodash.pick(validateObject, ['page'])
  }
}
