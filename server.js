const express = require('express')
const path = require('path')

const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const port = 3000

app.use(express.static(path.join(__dirname, 'dist')))
app.set('views', path.join(__dirname, 'dist'))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')

app.use('/', (req, res) => {
    res.render('index.html')
})

let messageHistory = []

io.on('connection' , socket => {
    console.log('socket ons' + socket.id)
    socket.emit('previousMessage', messageHistory)
    socket.on('sendMessage', data => {
        messageHistory.push(data)
        socket.broadcast.emit('receivedMessage', data)
    })
})

server.listen(3000, _=> console.log(`server is running on port ${port}`))