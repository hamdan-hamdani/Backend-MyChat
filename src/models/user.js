const connection = require('../config/db')

module.exports = {
  register: (data) => {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO users SET ? ', data, (err, result) => {
        if (!err) {
          resolve(result)
        } else {
          reject(new Error(err))
        }
      })
    })
  },
  cekUser: () => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT email FROM users ', (err, result) => {
        if (!err) {
          resolve(result)
        } else {
          reject(new Error(err))
        }
      })
    })
  },
  cekUserByEmail: (email) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM users WHERE email = ?', email, (err, result) => {
        if (!err) {
          resolve(result)
        } else {
          reject(new Error(err))
        }
      })
    })
  },
  addFriend: (data) => {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO friend SET ? ', data, (err, result) => {
        if (!err) {
          resolve(result)
        } else {
          reject(new Error(err))
        }
      })
    })
  },
  getAddFriend: (idUser) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM friend WHERE idUser = ? || idFriend = ? ', [idUser, idUser], (err, result) => {
        if (!err) {
          resolve(result)
        } else {
          reject(new Error(err))
        }
      })
    })
  },
  getUser: (idUser) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT friend.idUser, friend.idFriend, users.email, users.name FROM friend JOIN users ON friend.idUser = users.id WHERE friend.idUser = ? ', idUser, (err, result) => {
        // WHERE friend.idUser = ? || friend.idFriend = ? ', [idUser, idUser]
        if (!err) {
          resolve(result)
        } else {
          reject(new Error(err))
        }
      })
    })
  },
  getFriend: (idUser,idFriend) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT friend.idFriend, users.email, users.name FROM friend JOIN users ON friend.idFriend = users.id WHERE friend.idUser = ? && friend.idFriend = ? ', [idUser,idFriend], (err, result) => {
        // WHERE friend.idUser = ? || friend.idFriend = ? ', [idUser, idUser]
        if (!err) {
          resolve(result)
        } else {
          reject(new Error(err))
        }
      })
    })
  }
}
