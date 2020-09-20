const userModel = require('../models/user')
const helper = require('../helpers/helpers')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

module.exports = {
  register: (req, res) => {
    const {
      email,
      password,
      username
    } = req.body
    const data = {
      email,
      password,
      name: username
    }
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(data.password, salt, async function (err, hash) {
        const hsl = await userModel.cekUser()
        const hsl2 = hsl.find((item) => {
          if (item.email === data.email) return true
          return false
        })
        if (hsl2 !== undefined) {
          const message = 'data sudah ada'
          helper.responseGetAll(res, {message}, 401)
        } else {
          data.password = hash
          userModel.register(data)
            .then(result => {
              const historyResult = result
              helper.responseGetAll(res, historyResult, 200)
            })
            .catch(err => console.log(err))
        }
      })
    })
  },
  login: (req, res) => {
    const { email, password } = req.body
    userModel.cekUserByEmail(email)
      .then(result => {
        if (result.length === 0) return helper.responseGetAll(res, { message: 'Email Or Password Wrong' }, 401)
        const user = result[0]
        const hash = user.password
        bcrypt.compare(password, hash)
          .then(resCompare => {
            if (!resCompare) return helper.responseGetAll(res, { message: 'Email Or Password Wrong' }, 401)
            const payload = {
              id: user.id,
              email: user.email,
              name: user.name
            }
            jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: 1200 }, function (err, token) {
              if (err) return console.log(err)
              user.token = token
              delete user.password
              helper.responseGetAll(res, user, 201)
            })
          })
      })
      .catch(err => console.log(err))
  },
  cekUser: (req, res) => {
    // const { email, password } = req.body
    const email = req.params.email
    userModel.cekUserByEmail(email)
      .then(result => {
        if (result.length === 0) return helper.responseGetAll(res, { message: 'Email Not Found' }, 401)
        const user = result[0]
        delete user.password
        helper.responseGetAll(res, user, 200)
      })
      .catch(err => console.log(err))
  },
  addFriend: (req, res) => {
    const { idUser, idFriend } = req.body
    const data = {
      idUser,
      idFriend
    }
    userModel.addFriend(data)
      .then(result => {
        // if (result.length === 0) return helper.responseGetAll(res, { message: 'Email Not Found' }, 401)
        const user = result
        helper.responseGetAll(res, user, 200)
      })
      .catch(err => console.log(err))
  },
  getaddFriend: (req, res) => {
    const idUser = req.params.idUser
    userModel.getAddFriend(idUser)
      .then(result => {
        // if (result.length === 0) return helper.responseGetAll(res, { message: 'Email Not Found' }, 401)
        const user = result
        helper.responseGetAll(res, user, 200)
      })
      .catch(err => console.log(err))
  },
  getUser: (req, res) => {
    const idUser = req.params.idUser
    userModel.getUser(idUser)
      .then(result => {
        // if (result.length === 0) return helper.responseGetAll(res, { message: 'Email Not Found' }, 401)
        const user = result
        helper.responseGetAll(res, user, 200)
      })
      .catch(err => console.log(err))
  },
  getFriend: (req, res) => {
    const idUser = req.params.idUser
    const idFriend = req.params.idFriend
    userModel.getFriend(idUser,idFriend)
      .then(result => {
        // if (result.length === 0) return helper.responseGetAll(res, { message: 'Email Not Found' }, 401)
        const user = result
        helper.responseGetAll(res, user, 200)
      })
      .catch(err => console.log(err))
  }
}
