const express = require('express');
const app = express();
const server = require('http').Server(app)
const io = require('socket.io')(server);
const {makeId} = require('./id_gen');

const id_used = {}


app.set('view engine', 'ejs');
app.use(express.static('public'));


app.get('/', (req, res) => {
    res.render('index');
});

app.post('/', (req, res) => {
    const id = makeId();
    id_used[id] = true;
    res.send(`${id}`)
})

app.get('/room/:id', (req, res) => {
    const id = req.params.id;
    console.log(id_used)
    if(id_used[id]) {
        res.render('room', {roomId: req.params.id});
    } else {
        res.render('notfound');
    }
})

io.on('connection', (socket) => {
    socket.on('user-connection', (roomId, peerId) => {
        console.log(`Id: ${peerId} has joined room: ${roomId}`);
        socket.broadcast.emit('new-peer', peerId)
    });
    socket.on('disconnect')
})

server.listen(8080, () => console.log('Example app listening on port 8080!'));

