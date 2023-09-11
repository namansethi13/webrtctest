let peerConnections =[];
let localStream;
let remoteStream;

let servers = {
    iceServers: [
        {
            urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
        }
    ]
}

let init = async () => {
    // localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    localStream = new MediaStream();
    // document.getElementById('user-1').srcObject = localStream;
}



let createAnswer = async () => {

    peerConnection = new RTCPeerConnection(servers);
    peerConnections.push(peerConnection);
    remoteStream = new MediaStream();
    // document.getElementById('user-2').srcObject = remoteStream;
    const videoElement = document.createElement('video');
    videoElement.autoplay = true;
    videoElement.srcObject = remoteStream;
    const videoContainer = document.getElementById('video-container');
    videoContainer.appendChild(videoElement);


    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));
    peerConnection.ontrack = async (event) => {
        console.log("track added");
        event.streams[0].getTracks().forEach(track => remoteStream.addTrack(track));
        console.log(remoteStream);
        console.log("track done");
    }

    peerConnection.onicecandidate = async (event) => {
        if (event.candidate) {
            document.getElementById('answer-sdp').value = JSON.stringify(peerConnection.localDescription);
        }
    }

    let offer = document.getElementById('offer-sdp').value;
    if (!offer) return;
    offer = JSON.parse(offer);
    await peerConnection.setRemoteDescription(offer);
    let answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);   
    document.getElementById('answer-sdp').value = JSON.stringify(answer);
}


let addAnswer = async () => {
    let answer = document.getElementById('answer-sdp').value 
    if (!answer) return;

    answer = JSON.parse(answer);

    if(!peerConnection.setRemoteDescription){
        peerConnection.setRemoteDescription(answer)
    }

}

init()

// document.getElementById('create-offer').addEventListener('click', createOffer) 
document.getElementById('create-answer').addEventListener('click', createAnswer) 
document.getElementById('add-answer').addEventListener('click', addAnswer) 