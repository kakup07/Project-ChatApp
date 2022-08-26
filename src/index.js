const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { getUser, getRooms , getUsersInRoom, removeUser, addUser } = require('./utils/users')


const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))




io.on('connection', (socket) => {
    console.log('New Web Socket Connection!')

    socket.on('join', ({ username, room }, cb) => {
        const { error, user } = addUser({ id: socket.id, username, room })

        if (error) {
            return cb(error)
        }

        socket.join(user.room)

        socket.emit("message", generateMessage("Admin", "Welcome"))
        socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} has joined.`))
        
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        cb()
    })

    socket.on('sendMessage', (msg, cb) => {
        const user = getUser(socket.id)
        const filter = new Filter()
        if(filter.isProfane(msg)){
            return cb('Language..!!!')
        }

        io.to(user.room).emit('message', generateMessage(user.username, msg))
        cb()
    })

    socket.on('sendLocation', (pos, cb) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMsg', generateLocationMessage(user.username, `https://google.com/maps?q=${pos.lat},${pos.long}`))
        cb()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('message', generateMessage(`${user.username} has left.`))
            io.to(user.room).emit('roomDate', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
})

app.get('/api/rooms', (req, res) => {
    res.send({rooms: getRooms()})
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})


