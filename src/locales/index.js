import config from '../config'

const notFoundText = (prefix) => {
  return `${prefix} không tìm thấy`
}

const invalidText = (prefix) => {
  return `${prefix} không hợp lệ`
}

export default {
  Success: 'Thành công',
  ServerError: 'Đã xảy ra lỗi, vui lòng thử lại',
  DuplicateData: 'Dữ liệu này đã tồn tại trong hệ thống, vui lòng thử lại',
  InvalidRequestData: 'Tham số không đúng định dạng, vui lòng kiểm tra lại',
  PathNotFound: 'Api không tìm thấy',
  Unauthorized: 'Xác thực tài khoản thất bại',

  // Not found document
  NotFound: {
    User: notFoundText('Tài khoản')
  },

  // Validation message
  Validation: {
    Common: {
      InvalidCity: invalidText('Thành phố'),
      InvalidLocale: invalidText('Ngôn ngữ'),
      InvalidEmail: invalidText('Email')
    },
    User: {
      NameRequired: 'Tên không được trống',
      NameMinLength: `Tên không được ít hơn ${config.user.validate.nameMinLength} ký tự`,
      NameMaxLength: `Tên không được quá ${config.user.validate.nameMaxLength} ký tự`,
      EmailExisted: 'Email này đã tồn tại trong hệ thống',
      PhoneExisted: 'Số điện thoại này đã tồn tại trong hệ thống'
    }
  }
}
