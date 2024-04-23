let terminalInfo = JSON.parse(result.getData()).data;
let { controlCode, terminalCode } = JSON.parse(terminalInfo);

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
  startTerminalVideo();
}

function createConnection(cb) {
  socket = io.connect(config.socketUrl, { query: { code: terminalCode } });

  peer = new RTCPeerConnection(iceServerConfig);

  peer.ontrack = (e) => {
    remoteVideo.srcObject = e.streams[0];
  };

  peer.onicecandidate = (e) => {
    if (e.candidate) {
      socket.emit("onicecandidate", {
        code: controlCode,
        candidate: e.candidate,
      });
    }
  };

  socket.on("connect", () => {
    socket.on("control_offer", (offer) => {
      peer.setRemoteDescription(offer);
      answerRemoteVideo(controlCode);
    });

    socket.on("onicecandidate", (candidate) => {
      peer.addIceCandidate(candidate);
    });
  });

  cb && cb();
}

function startTerminalVideo() {
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
      })
      .catch((err) => {
        console.error("Failed to get the stream", err);
      });
  });
}

function answerRemoteVideo(code) {
  remoteVideo = document.getElementById("terminalVideo");
  peer
    .createAnswer({
      offerToReceiveVideo: 1,
      offerToReceiveAudio: 1,
    })
    .then((answer) => {
      peer.setLocalDescription(answer);
      socket.emit("control_answer", { code, answer });
    })
    .catch((err) => {
      console.error("Failed to create answer", err);
    });
}

function hangupTerminalVideo() {
  if (!!remoteVideo.srcObject) {
    remoteVideo.srcObject.getTracks().forEach(track => {
      track.stop();
    });
    remoteVideo.srcObject = null;
  }
  peer && peer.close();
  remoteVideo = null;
  peer = null;
  socket.emit("hangup", terminalCode);
}