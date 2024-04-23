import config from "@/common/config";
const io = require("socket.io-client");

let terminalInfo = uni.getStorageSync("terminalInfo");
let localVideo = null;
let remoteVideo = null;
let peer = null;
let muted = true;

let offerState = false;

const iceServerConfig = {
  iceServers: [
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

const socket = io.connect(config.socketUrl, { query: { code: terminalInfo.terminalCode } });

socket.on("connect", () => {
  socket.on("offer", (offer, type) => {
    muted = type == 1 ? false : true;
    startRtcVideo(() => {
      if (offer) {
        peer.setRemoteDescription(offer);
        peer
          .createAnswer({
            offerToReceiveAudio: 1,
            offerToReceiveVideo: 1,
          })
          .then((answer) => {
            if (answer) {
              peer.setLocalDescription(answer);
              offerState = true;
              socket.emit("answer", answer, terminalInfo.controlCode);
            }
          });
      }
    });
  });

  socket.on("icecandidate", (candidate) => {
    if (offerState && candidate) {
      peer.addIceCandidate(candidate);
    }
  });

  socket.on("hangup", () => {
    stopRtcVideo();
  });
});

function createRtcConnect(cb) {
  peer = new RTCPeerConnection(iceServerConfig);

  peer.ontrack = e => {
    if (e && e.streams) {
      remoteVideo.muted = muted;
      remoteVideo.srcObject = e.streams[0];
    }
  };

  peer.onicecandidate = e => {
    if (e && e.candidate) {
      socket.emit("icecandidate", e.candidate, terminalInfo.controlCode);
    }
  };

  peer.oniceconnectionstatechange = (e) => {
    let state = peer.iceConnectionState;
    if (state == "disconnected") {
      if (!!remoteVideo.srcObject) {
        remoteVideo.srcObject.getTracks().map((track) => track.stop());
      }
    }
  };

  cb && cb();
}

function startLive(audioState = true) {
  return new Promise(async (resolve, reject) => {
    let stream;
    let videoId = "";
    let deviceList = [];
    try {
      await navigator.mediaDevices.enumerateDevices().then(deviceInfos => {
        deviceInfos.map(deviceInfo => {
          if (deviceInfo.kind == "videoinput") {
            videoId = deviceInfo.deviceId;
            deviceList.push(deviceInfo);
          }
        });
        deviceList.map(item => {
          if (item.label.includes("USB Camera")) {
            videoId = item.deviceId;
          }
        });
        deviceList.map(item => {
          if (item.label.includes("USB Camera")) {
            videoId = item.deviceId;
          }
        });
        deviceList.map(item => {
          if (item.label.includes("罗技高清网络摄像机")) {
            videoId = item.deviceId;
          }
        });
      });
      stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: videoId
        },
        audio: audioState,
      });
      resolve(stream);
    } catch (err) {
      reject("Failed to get the stream", err);
    }
  });
}

function initRtcVideo(selector, controlCode, terminalCode) {
  remoteVideo = selector;
  terminalInfo = Object.assign({}, terminalInfo, { controlCode, terminalCode });
  startRtcVideo();
}

function startRtcVideo(cb) {
  createRtcConnect(() => {
    startLive().then((stream) => {
      stream.getTracks().map(track => {
        peer.addTrack(track, stream);
      });
      cb && cb();
    });
  });
}

// 人脸识别
function startFaceVideo(selector, audioState) {
  return new Promise(async (resolve, reject) => {
    try {
      startLive(audioState).then(stream => {
        localVideo = selector;
        localVideo.srcObject = stream;
        resolve(localVideo);
      });
    } catch (err) {
      reject(err);
    }
  });
}

function stopRtcVideo() {
  if (!!remoteVideo.srcObject) {
    remoteVideo.srcObject.getTracks().map(track => {
      track.stop();
    });
    peer.close();
  }
  muted = true;
  offerState = false;
}

function stopFaceVideo() {
  if (!!localVideo.srcObject) {
    localVideo.srcObject.getTracks().map(track => {
      track.stop();
    });
  }
}

export { initRtcVideo, startFaceVideo, stopRtcVideo, stopFaceVideo };
