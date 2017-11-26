import Joi from 'joi'
import lodash from 'lodash'
import config from '../config'
import text from './default-text'

const validateObject = {
  name: Joi.string().min(config.event.validate.nameMinLength).max(config.event.validate.nameMaxLength).required().options({
    language: {
      key: '{{!name}}',
      any: {
        required: `Tên sự kiện ${text.IS_REQUIRED}`,
        empty: `Tên sự kiện ${text.IS_EMPTY}`
      },
      string: {
        min: `Tên sự kiện không được dưới ${config.event.validate.nameMinLength} ký tự`,
        max: `Tên sự kiện không được quá ${config.event.validate.nameMaxLength} ký tự`
      }
    }
  }),
  startAt: Joi.date().required().options({
    language: {
      key: '{{!startAt}}',
      any: {
        required: `Thời gian bắt đầu ${text.IS_REQUIRED}`,
        empty: `Thời gian bắt đầu ${text.IS_EMPTY}`
      },
      date: {
        base: `Thời gian bắt đầu ${text.NOT_VALID}`
      }
    }
  }),
  endAt: Joi.date().required().options({
    language: {
      key: '{{!endAt}}',
      any: {
        required: `Thời gian kết thúc ${text.IS_REQUIRED}`,
        empty: `Thời gian kết thúc ${text.IS_EMPTY}`
      },
      date: {
        base: `Thời gian kết thúc ${text.NOT_VALID}`
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
  }),
  keyword: Joi.string().label('Keyword')
}

export default {
  // POST /events
  create: {
    body: lodash.pick(validateObject, ['name', 'startAt', 'endAt'])
  },

  // PUT /events/:eventId
  update: {
    body: lodash.pick(validateObject, ['name', 'startAt', 'endAt'])
  },

  // GET /events
  all: {
    query: lodash.pick(validateObject, ['page', 'keyword'])
  }
}
