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
            jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: 5000 }, function (err, token) {
              if (err) return console.log(err)
              user.token = token
              delete user.password
              helper.responseGetAll(res, user, 201)
            })
          })
      })
      .catch(err => console.log(err))
  },
  forgotPassword: (req, res) => {
    var nodemailer = require('nodemailer')
    var fs = require('fs')
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'mychat709@gmail.com',
        pass: 'Konsisten1!'
      }
    })

    // var template = fs.readFileSync('index.html', 'utf-8')

    const { email } = req.body
    console.log (email)
    userModel.cekUserByEmail(email)
      .then(result => {
        if (result.length === 0) return helper.responseGetAll(res, { message: 'Email tidak terdaftar' }, 401)
        const user = result[0]
            const payload = {
              id: user.id,
              email: user.email,
              name: user.name
            }
            jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: 5000 }, function (err, token) {
              if (err) return console.log(err)
              user.token = token
              delete user.password
              
              
              

          // var mailOptions = {
          //   from: 'mychat709',
          //   to: email,
          //   subject: 'Ubah kata sandi',
          //   // html: template
          //   html: `<h1> Silahkan klik link di bawah</h1> <p>Silahkan klik tautan dibawah untuk mengubah kata sandi</p> <a href="http://localhost:8080/changepassword">Klik ${token}</a>`
          // }
          // console.log(mailOptions.html)

          // transporter.sendMail(mailOptions, (err, info) => {
          //   if (err) throw err
          //   console.log('Email sent: ' + info.response)
          // })

              helper.responseGetAll(res, user, 200)
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
  cekUserbyid: (req, res) => {
    // const { email, password } = req.body
    const id = req.params.id
    userModel.cekUserById(req.userId)
      .then(result => {
        if (result.length === 0) return helper.responseGetAll(res, { message: 'Email Not Found' }, 401)
        const user = result[0]
        delete user.password
        helper.responseGetAll(res, user, 200)
      })
      .catch(err => console.log(err))
  },
  updateUserbyid: (req, res) => {
    // const { email, password } = req.body
    const id = req.params.id
    const {
      name,
      noHp,
      bio
    } = req.body
    const data = {
      name,
      image: `${process.env.INSERT_PRODUCT}${req.file.filename}`,
      noHp,
      bio
    }
    userModel.updateUser(req.userId, data)
      .then(result => {
        if (result.length === 0) return helper.responseGetAll(res, { message: 'Email Not Found' }, 401)
        const user = result
        // delete user.password
        helper.responseGetAll(res, user, 200)
      })
      .catch(err => console.log(err))
  },
  addFriend: (req, res) => {
    // const { idUser, idFriend } = req.body
    const { idFriend } = req.body
    const data = {
      // idUser,
      idUser: req.userId,
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
  removeFriend: (req, res) => {
    const idUser = req.params.idUser
    const idFriend = req.params.idFriend
    userModel.removeFriend(req.userId, idFriend)
    .then(result => {
      // if (result.length === 0) return helper.responseGetAll(res, { message: 'Email Not Found' }, 401)
      const user = result
      helper.responseGetAll(res, user, 200)
    })
    .catch(err => console.log(err))
  },
  getaddFriend: (req, res) => {
    const idUser = req.params.idUser
    userModel.getAddFriend(req.userId)
      .then(result => {
        // if (result.length === 0) return helper.responseGetAll(res, { message: 'Email Not Found' }, 401)
        const user = result
        helper.responseGetAll(res, user, 200)
      })
      .catch(err => console.log(err))
  },
  getUser: (req, res) => {
    console.log('gagag')
    console.log(req.userId)
    console.log('gahsg')
    const idUser = req.params.idUser
    userModel.getUser(req.userId)
      .then(result => {
        if (result.length === 0) return helper.responseGetAll(res, { message: 'Email Not Found' }, 401)
        const user = result
        helper.responseGetAll(res, user, 200)
      })
      .catch(err => console.log(err))
  },
  getFriend: (req, res) => {
    const idUser = req.params.idUser
    const idFriend = req.params.idFriend
    userModel.getFriend(req.userId,idFriend)
      .then(result => {
        // if (result.length === 0) return helper.responseGetAll(res, { message: 'Email Not Found' }, 401)
        const user = result
        helper.responseGetAll(res, user, 200)
      })
      .catch(err => console.log(err))
  },
  addMessage: (req, res) => {
    const {
      id,
      idfriend,
      value,
      tgl
    } = req.body
    const data = {
      message: value,
      idFriend: req.userId,
      idUser: idfriend
      // tgl
    }
    userModel.addMessage(data)
      .then(result => {
        // if (result.length === 0) return helper.responseGetAll(res, { message: 'Email Not Found' }, 401)
        const user = result
        helper.responseGetAll(res, user, 200)
      })
      .catch(err => console.log(err))
  },
  notifMsg: (req, res) => {
    // const idUser = req.params.idUser
    const idFriend = req.params.idFriend
    // const data = {
    //   idUser: req.userId,
    //   idFriend: idfriend
    // }
    userModel.notifMsg(req.userId, idFriend)
      .then(result => {
        // if (result.length === 0) return helper.responseGetAll(res, { message: 'Email Not Found' }, 401)
        const user = result
        helper.responseGetAll(res, user, 200)
      })
      .catch(err => console.log(err))
  },
  postNotifMsg: (req, res) => {
    const {
      idfriend
    } = req.body
    const data = {
      idUser: req.userId,
      idFriend: idfriend,
      noMsg: 1
    }
    userModel.postNotifMsg(data)
      .then(result => {
        // if (result.length === 0) return helper.responseGetAll(res, { message: 'Email Not Found' }, 401)
        const user = result
        helper.responseGetAll(res, user, 200)
      })
      .catch(err => console.log(err))
  },
  updateNotifMsg: (req, res) => {
    const idUser = parseInt(req.params.idUser)
    const idFriend = parseInt(req.params.idFriend)
    const noMsg = parseInt(req.params.noMsg)
    console.log('iniiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii')
    console.log(noMsg)
    console.log(typeof(noMsg))
    const data = {
      idUser,
      idFriend,
      noMsg
    }
    console.log(data.noMsg)
    console.log(data.idUser)
    console.log(data.idFriend)
    console.log(typeof(data.noMsg))
    console.log(typeof(data.idUser))
    console.log(typeof(data.idFriend))
    console.log('iniiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiijjjjjjj')
    // return
    userModel.updateNotifMsg(data)
      .then(result => {
        // if (result.length === 0) return helper.responseGetAll(res, { message: 'Email Not Found' }, 401)
        const user = result
        helper.responseGetAll(res, user, 200)
      })
      .catch(err => console.log(err))
  },
  getMessage: (req, res) => {
    const idUser = req.params.idUser
    const idFriend = req.params.idFriend
    userModel.getMessage(req.userId,idFriend)
      .then(result => {
        // if (result.length === 0) return helper.responseGetAll(res, { message: 'Email Not Found' }, 401)
        const user = result
        helper.responseGetAll(res, user, 200)
      })
      .catch(err => console.log(err))
  }
}
