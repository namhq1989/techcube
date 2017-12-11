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
  CheckinSuccess: 'Quét mã thành công!',

  // Not found document
  NotFound: {
    User: notFoundText('Tài khoản'),
    Customer: notFoundText('Khách hàng'),
    File: notFoundText('File'),
    MailTemplate: notFoundText('Mail template'),
    Event: notFoundText('Sự kiện'),
    Plan: notFoundText('Gói dịch vụ'),
    Area: notFoundText('Khu vực')
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
    },
    Event: {
      NameRequired: 'Tên không được trống',
      NameMinLength: `Tên không được ít hơn ${config.event.validate.nameMinLength} ký tự`,
      NameMaxLength: `Tên không được quá ${config.event.validate.nameMaxLength} ký tự`,
      StartAtRequired: 'Thời gian bắt đầu sự kiện không được trống',
      EndAtRequired: 'Thời gian kết thúc sự kiện không được trống',
      NoActiveEvent: 'Không tìm thấy sự kiện nào đang diễn ra trong thời gian này'
    },
    Area: {
      NameRequired: 'Tên không được trống',
      NameMinLength: `Tên không được ít hơn ${config.area.validate.nameMinLength} ký tự`,
      NameMaxLength: `Tên không được quá ${config.area.validate.nameMaxLength} ký tự`,
      StartAtRequired: 'Giờ bắt đầu không được trống',
      EndAtRequired: 'Giờ kết thúc không được trống'
    },
    Plan: {
      NameRequired: 'Tên không được trống',
      NameMinLength: `Tên không được ít hơn ${config.plan.validate.nameMinLength} ký tự`,
      NameMaxLength: `Tên không được quá ${config.plan.validate.nameMaxLength} ký tự`
    }
  },

  // Customer
  Customer: {
    ExcelFileNoData: 'File excel không có dữ liệu nào'
  }
}
