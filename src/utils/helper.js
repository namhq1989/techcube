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

/**
 * Get device information
 *
 * @param  {String} ua
 * @return {Object}
 */
const getDeviceInfo = (ua) => {
  const info = {
    isMobile: false
  }

  if (!ua) {
    return info
  }

  /* eslint prefer-destructuring: 0 */
  /* eslint no-useless-escape: 0 */
  try {
    if (/like Mac OS X/.test(ua)) {
      info.version = /CPU( iPhone)? OS ([0-9\._]+) like Mac OS X/.exec(ua)[2].replace(/_/g, '.')
      info.os = config.deviceOS.ios
      info.isMobile = true
    } else if (/Android/.test(ua)) {
      info.version = /Android ([0-9.]+)[);]/.exec(ua)[1]
      info.os = config.deviceOS.android
      info.isMobile = true
    } else if (/webOS\//.test(ua)) {
      info.version = /webOS\/([0-9\.]+)[\);]/.exec(ua)[1]
      info.os = config.deviceOS.web
    } else if (/(Intel|PPC) Mac OS X/.test(ua)) {
      info.version = /(Intel|PPC) Mac OS X ?([0-9\._]*)[\)\;]/.exec(ua)[2].replace(/_/g, '.') || true
      info.os = config.deviceOS.mac
    } else if (/Windows NT/.test(ua)) {
      info.version = /Windows NT ([0-9\._]+)[\);]/.exec(ua)[1]
      info.os = config.deviceOS.windows
    }

    return info
  } catch (error) {
    return info
  }
}

/**
 * Check that given time is between start and end time or not
 *
 * @param  {Date}     givenTime
 * @param  {Date}     beginTime
 * @param  {Date}     endTime
 * @return {Boolean}
 */
const isInTimeRange = (givenTime, beginTime, endTime) => {
  givenTime = new Date(givenTime)
  beginTime = new Date(beginTime)
  endTime = new Date(endTime)
  let isIn = false
  givenTime = givenTime.getTime()

  if (beginTime) {
    beginTime = (new Date(beginTime)).getTime()
  }
  if (endTime) {
    endTime = (new Date(endTime)).getTime()
  }

  if (!beginTime && !endTime) {
    isIn = true
  } else if (beginTime && !endTime) {
    isIn = (givenTime >= beginTime)
  } else if (!beginTime && endTime) {
    isIn = (givenTime <= endTime)
  } else {
    isIn = ((givenTime >= beginTime) && (givenTime <= endTime))
  }

  return isIn
}

/**
 * Get index of string from array of object ids
 *
 * @param  {Array}  array
 * @param  {String} id
 * @return {Number}
 */
const indexFromObjectIds = (array, id) => {
  let index = -1

  if (!array || !Array.isArray(array)) {
    return index
  }

  id = id.toString()
  for (const i in array) {
    if (array[i] && array[i].toString() === id) {
      index = i
      break
    }
  }
  return index
}

// Export
export default {
  token,
  customerQRCode,
  getFileType,
  getDeviceInfo,
  isInTimeRange,
  indexFromObjectIds
}
