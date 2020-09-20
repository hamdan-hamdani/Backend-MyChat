const express = require('express')
const http = require('http')
const { env } = require('process')
const socket = require('socket.io')
const app = express()
const server = http.createServer(app)
const io = socket(server)
const router = require('./src/routes/index')


const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

// use module
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}))
// parse application/json
app.use(bodyParser.json())
// use morga
app.use(morgan('dev'))
// use cors
app.use(cors())

// make router
app.use('/api/v1', router)
app.use('/uploads', express.static('./uploads'))
app.use((err, res) => {
  res.json({
    status: 404,
    message: 'URL Not Found'
  })
  console.log(err)
})


io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('welcomeMessage', user => {
      console.log(user)
      socket.emit('message', 'selamat menggunakan aplikasi Chat ' + user.username +' ' +user.id)
      // socket.join(user.id)
      // socket.join(user.username)
      // socket.broadcast.to(user.username).emit('message', 'user join ' + user.username)
      // socket.broadcast.to('arka1').emit('notif', 'user join ' + user.username)
    })
    socket.on('sendMessage', ({value, id, idfriend, username, room}) => {
      console.log(value)
      console.log(id)
      console.log(idfriend)

      socket.join(id)
      // socket.join(idfriend)
      // socket.emit('message', value)
      // io.to(id).emit('message', value)
      io.to(idfriend).emit('message', value)
    })
    socket.on('disconnect', () => {
        console.log('a user disconnect')
    })
  });

// app.use('/user', router)

const port = 4000
server.listen(port, () => console.log('running in PORT '+ port))