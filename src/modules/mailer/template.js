import QRCode from 'qrcode'

/**
 * Invitation
 *
 */
function invitation(data = {}, options, callback) {
  QRCode.toDataURL(data.user.qrCode, (error, url) => {
    options.html = `
      Hi ${data.user.name},
      <br>
      Đây là email tự động gửi bởi hệ thống! Mã QR để tham gia sự kiện của bạn là:
      <br>
      <div style="text-align: center">
        <img src="cid:qrcode_attachment" alt="" width="250" height="250" />
      </div>
      <br>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
      Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      <br>
      Thanks!
    `

    options.attachments = [{
      path: url,
      cid: 'qrcode_attachment'
    }]

    options.subject = 'Techcube - Đăng ký thành công'
    callback(options)
  })
}

// Export
export default {
  invitation
}
