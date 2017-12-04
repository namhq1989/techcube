import QRCode from 'qrcode'

/**
 * Invitation
 *
 */
function invitation(data = {}, options, callback) {
  QRCode.toDataURL(data.customer.qrCode, (error, url) => {
    options.html = `
      Hi ${data.customer.name},
      <br>
      Đây là mã QR để bạn tham gia vào các sự kiện của iMED:
      <br>
      <div style="text-align: center">
        <img src="cid:qrcode_attachment" alt="" width="250" height="250" />
      </div>
      <br>
      Trân trọng cảm ơn!
    `

    options.attachments = [{
      path: url,
      cid: 'qrcode_attachment'
    }]

    options.subject = 'iMED - Mã tham gia sự kiện'
    callback(options)
  })
}

// Export
export default {
  invitation
}
