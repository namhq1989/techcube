import { sign } from 'jsonwebtoken'
import config from '../config'

/**
 * Generate user token
 *
 * @param  {Object} data
 * @return {String}
 */
const token = (data) => {
  // Sending the payload inside the token, expire in 1 year
  return sign(data, config.secret, { expiresIn: '1y' });
}

/**
 * Generate customer QR code based on info
 *
 * @param {Object} data
 */
const customerQRCode = (data) => {
  const string = data._id + data.name + data.createdAt
  return Buffer.from(string).toString('base64')
}

/**
 * Get file type
 *
 * @param {String} filename
 */
const getFileType = (filename) => {
  const ext = filename.split('.').pop();
  switch (ext.toLowerCase()) {
    // Photo
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return 'photo'

      // Video
    case 'm4v':
    case 'avi':
    case 'mpg':
    case 'mp4':
      return 'video'
    case 'xls':
    case 'xlsx':
      return 'excel'
    default:
      return ''
  }
}

// Export
export default {
  token,
  customerQRCode,
  getFileType
}
