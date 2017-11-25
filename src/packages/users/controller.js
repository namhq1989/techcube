import { response } from '../../utils'
// import { ObjectId } from '../../utils/mongoose'
// import { User } from '../../models'

const show = (req, res) => {
  res.jsonp(response(true, req.userData.toJSON()))
}

// Export
export default {
  show
}
