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
  LoginFailed: 'Email hoặc mật khẩu không đúng, vui lòng kiểm tra lại',
  RequireLogin: 'Bạn phải đăng nhập để thực hiện hành động này',
  NoPermission: 'Bạn không có quyền thực hiện hành động này',
  SendMailError: 'Gửi mail thất bại',

  // Not found document
  NotFound: {
    User: notFoundText('Tài khoản'),
    Customer: notFoundText('Khách hàng'),
    File: notFoundText('File'),
    MailTemplate: notFoundText('Mail template')
  },

  // Validation message
  Validation: {
    Common: {
      InvalidCity: invalidText('Thành phố'),
      InvalidGender: invalidText('Giới tính'),
      InvalidLocale: invalidText('Ngôn ngữ'),
      InvalidEmail: invalidText('Email'),
      InvalidExcel: invalidText('File excel')
    },
    User: {
      NameRequired: 'Tên không được trống',
      NameMinLength: `Tên không được ít hơn ${config.user.validate.nameMinLength} ký tự`,
      NameMaxLength: `Tên không được quá ${config.user.validate.nameMaxLength} ký tự`,
      EmailExisted: 'Email này đã tồn tại trong hệ thống',
      PhoneExisted: 'Số điện thoại này đã tồn tại trong hệ thống'
    }
  },

  // Customer
  Customer: {
    ExcelFileNoData: 'File excel không có dữ liệu nào'
  }
}
