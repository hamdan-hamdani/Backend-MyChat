const connection = require('../config/db')

module.exports = {
  notifMsg: (idUser, idFriend) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT noMsg FROM notifikasi WHERE idUser = ? && idFriend = ?', [idUser, idFriend], (err, result) => {
        if (!err) {
          resolve(result)
        } else {
          reject(new Error(err))
        }
      })
    })
  },
  postNotifMsg: (data) => {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO notifikasi SET ? ', data, (err, result) => {
        if (!err) {
          resolve(result)
        } else {
          reject(new Error(err))
        }
      })
    })
  },
  updateNotifMsg: (data) => {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE notifikasi SET ? WHERE idUser = ? && idFriend = ?', [data, data.idUser, data.idFriend], (err, result) => {
        if (!err) {
          resolve(result)
        } else {
          reject(new Error(err))
        }
      })
    })
  },
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
  cekUserById: (id) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM users WHERE id = ?', id, (err, result) => {
        if (!err) {
          resolve(result)
        } else {
          reject(new Error(err))
        }
      })
    })
  },
  updateUser: (id, data) => {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE users SET ? WHERE id = ?', [data, id], (err, result) => {
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
  removeFriend: (idUser, idFriend) => {
    return new Promise((resolve, reject) => {
      connection.query('DELETE FROM friend WHERE idUser = ? && idFriend = ? ', [idUser, idFriend], (err, result) => {
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
      connection.query('SELECT * FROM friend WHERE idUser = ? ', [idUser], (err, result) => {
        if (!err) {
          // || idFriend = ? , idUser
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
      connection.query('SELECT friend.idFriend, users.email, users.name, users.image, users.noHp FROM friend JOIN users ON friend.idFriend = users.id WHERE friend.idUser = ? && friend.idFriend = ? ', [idUser,idFriend], (err, result) => {
        // WHERE friend.idUser = ? || friend.idFriend = ? ', [idUser, idUser]
        if (!err) {
          resolve(result)
        } else {
          reject(new Error(err))
        }
      })
    })
  },
  addMessage: (data) => {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO message SET ? ', data, (err, result) => {
        if (!err) {
          resolve(result)
        } else {
          reject(new Error(err))
        }
      })
    })
  },
  getMessage: (idUser,idFriend) => {
    return new Promise((resolve, reject) => {
      connection.query('SELECT message.*, users.email, users.name, users.image, users.noHp FROM message JOIN users ON message.idFriend = users.id WHERE (message.idFriend = ? && message.idUser = ?) || (message.idUser = ? && message.idFriend = ?) ORDER BY message.tgl ASC' , [idUser, idFriend, idUser, idFriend], (err, result) => {
        // 'SELECT message.* ,users.email, users.name, users.image, users.noHp FROM message JOIN users ON message.idFriend = users.id JOIN friend ON message.idFriend = friend.id WHERE (friend.idUser = ? && friend.idFriend = ? ) || (friend.idUser = ? && friend.idFriend = ? )', [idUser,idFriend,idFriend,idUser]
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
