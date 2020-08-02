const socket = io('/');

let peers = {};

let video_grid;
const myVideo = document.createElement('video');
myVideo.muted = true;

video_grid = document.querySelector('.video-grid');

const peer = new Peer(undefined, {
    host:'/',
    port: 8081
})


navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then((stream) => {
    addVideo(myVideo, stream);

    peer.on('call', (call) => {
        console.log('Someone is calling');
        call.answer(myVideo.srcObject);
        const video = document.createElement('video');
        call.on('stream', (userStream) => {
            addVideo(video, userStream);
        })
    })
    
}).catch((err) => console.log(err)); 


peer.on('open', (peerId) => {
    console.log(`Own ID: ${peerId}`);
    socket.emit('user-connection', id, peerId);
    socket.on('new-peer', (newId) => {
        console.log('New user ' + newId);
        addNewUser(newId, myVideo.srcObject);
    })
})

peer.on('error', (err) => console.log(err.type))

function addNewUser(userId, stream) {
    const call = peer.call(userId, stream);
    const video = document.createElement('video');
    call.on('stream', (user_stream) => {
        console.log('jijiajaja')
        addVideo(video, user_stream);
    })
    
    peers[userId] = call;
    
}

function addVideo(video, stream) {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    video_grid.append(video);
}