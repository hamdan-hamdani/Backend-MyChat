const jwt = require('jsonwebtoken')
const helper = require('../helpers/helpers')
const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    console.log('ini file midlewares b')
    console.log(file)
    cb(null, file.fieldname + '-' + Date.now() + file.originalname)
  }
})
const fileFilter = function (req, file, cb) {
  console.log('ini reqq ')
  // console.log(req)
  console.log(file)
  const allowedTypes = ['image/jpg', 'image/png', 'image/jpeg', 'image/gif']
  if (!allowedTypes.includes(file.mimetype)) {
    const error = new Error('Wrong file type')
    error.code = 'LIMITS_FILE_TYPES'
    // const accFilter = (req, res, next) => {
    //   helper.responseGetAll(res, {message: 'Wrong file type'}, 500)

    // } 
    return cb(error, false)       
  }
  cb(null, true)
}
// const fileFilter = (req, file, cb) => {
  
  // The function should call `cb` with a boolean
  // to indicate if the file should be accepted
 
  // To reject this file pass `false`, like so:
  // cb(null, false)
 
  // To accept the file pass `true`, like so:
  // cb(null, true)
 
  // You can always pass an error if something goes wrong:
  // cb(new Error('I don\'t have a clue!'))
 
// }

const upload = multer({     
  storage: storage,
  fileFilter
  // fileFilter: fileFilter2()
})

console.log('ini midleware')

module.exports = {
  verifyAccess: (req, res, next) => {
    let token = req.headers.authorization
    if (token !== undefined) {
      token = token.split(' ')[1]
      jwt.verify(token, process.env.SECRET_KEY, function (err, decode) {
        // console.log('dexi')
        // console.log(decode)        
        if (err) {
          console.log(err)
          if(err.name === "JsonWebTokenError"){
            return helper.responseGetAll(res, { message: 'token invalid' }, 401)
          } else if (err.name === "TokenExpiredError") {
            return helper.responseGetAll(res, { message: 'token expired' }, 401)
          }
          
          
        }
        req.userId = decode.id
        // if (!decode.exp) return helper.responseGetAll(res, { message: 'token expired' }, 401)
        // console.log('ini decode')
        // console.log(decode)
        next()
      })
    } else {
      return helper.responseGetAll(res, { message: 'token has not been entered' }, 401)
    }
  },
  chacheGetAllProduct: (req, res, next) => {
    client.get('getallproduct', (err, data) => {
      if (err) throw err
      if (data !== null) {
        if (req.query.search) {
          const search = (req.query.search).toLowerCase()
          const map = JSON.parse(data)

          console.log(result)
        }

        // const page = req.query.page
        // const limit = req.query.limit

        // const resultLength = result.length
        // console.log('data ')
        const result = data
        // console.log(typeof(Array.from(data)))
        return helper.responsePagination(res, JSON.parse(result), 200, null)
        // helper.responseGetAll(res, result, 200)
        // helper.responseGetAll(res, JSON.parse(data), 200)
      } else {
        next()
      }
    })
  },
  clearCache: (req, res, next) => {
    client.del('getallproduct')
    next()
  },
  upload: upload
}
