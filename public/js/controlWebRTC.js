let controlInfo = JSON.parse(result.getData()).data;
let { controlCode, terminalCode } = JSON.parse(controlInfo);

let remoteVideo = null;
let peer = null;
let socket = null;

const iceServerConfig = {
  iceServers: [
    {
      url: "stun:stun.l.google.com:19302",
    },
    {
      url: 'stun:192.168.1.56:3488',
    },
    {
      url: "turn:192.168.1.56:3478",
      username: "admin",
      credential: "gktel12345",
    },
  ],
};

function isDomFinish() {
  startControlVideo();
}

function createConnection(cb) {
  socket = io.connect(config.socketUrl, { query: { code: controlCode } });

  peer = new RTCPeerConnection(iceServerConfig);

  peer.ontrack = (e) => {
    remoteVideo.srcObject = e.streams[0];
  };

  peer.onicecandidate = (e) => {
    if (e.candidate) {
      socket.emit("onicecandidate", {
        code: terminalCode,
        candidate: e.candidate,
      });
    }
  };

  socket.on("connect", () => {
    socket.on("control_answer", (answer) => {
      peer.setRemoteDescription(answer);
    });

    socket.on("onicecandidate", (candidate) => {
      peer.addIceCandidate(candidate);
    });
  });

  cb && cb();
}

function startControlVideo() {
  createConnection(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        stream.getTracks().forEach(track => {
          peer.addTrack(track, stream);
        });
        setTimeout(() => {
          callRemoteVideo(terminalCode);
        }, 1500);
      })
      .catch((err) => {
        console.error("Failed to get the stream", err);
      });
  });
}

function callRemoteVideo(code) {
  remoteVideo = document.getElementById("controlVideo");
  peer
    .createOffer({
      offerToReceiveVideo: 1,
      offerToReceiveAudio: 1,
    })
    .then((offer) => {
      peer.setLocalDescription(offer);
      socket.emit("control_offer", { code, offer });
    })
    .catch((err) => {
      console.error("Failed to create the offer", err);
    });
}

function hangupControlVideo() {
  if (!!remoteVideo.srcObject) {
    remoteVideo.srcObject.getTracks().forEach(track => {
      track.stop();
    });
    remoteVideo.srcObject = null;
  }
  peer && peer.close();
  remoteVideo = null;
  peer = null;
  socket.emit("hangup", controlCode);
}