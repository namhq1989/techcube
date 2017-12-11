import Joi from 'joi'
import lodash from 'lodash'
import config from '../config'
import text from './default-text'

const validateObject = {
  name: Joi.string().min(config.area.validate.nameMinLength).max(config.area.validate.nameMaxLength).required().options({
    language: {
      key: '{{!name}}',
      any: {
        required: `Tên ${text.IS_REQUIRED}`,
        empty: `Tên ${text.IS_EMPTY}`
      },
      string: {
        min: `Tên không được dưới ${config.area.validate.nameMinLength} ký tự`,
        max: `Tên không được quá ${config.area.validate.nameMaxLength} ký tự`
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
  startAt: Joi.date().required().options({
    language: {
      key: '{{!startAt}}',
      any: {
        required: `Ngày bắt đầu ${text.IS_REQUIRED}`,
        empty: `Ngày bắt đầu ${text.IS_EMPTY}`
      },
      date: {
        base: `Ngày bắt đầu ${text.MUST_BE_A_DATE}`
      }
    }
  }),
  endAt: Joi.date().required().options({
    language: {
      key: '{{!startAt}}',
      any: {
        required: `Ngày kết thúc ${text.IS_REQUIRED}`,
        empty: `Ngày kết thúc ${text.IS_EMPTY}`
      },
      date: {
        base: `Ngày kết thúc ${text.MUST_BE_A_DATE}`
      }
    }
  })
}

export default {
  // POST /areas
  create: {
    body: lodash.pick(validateObject, ['name', 'eventId', 'startAt', 'endAt'])
  },

  // PUT /areas/:areaId
  update: {
    body: lodash.pick(validateObject, ['name', 'startAt', 'endAt'])
  }
}
