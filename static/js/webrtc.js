import config from "@/common/config";
const io = require("./socket.io");

let controlInfo = uni.getStorageSync("controlInfo");
let localVideo = null;
let peer = null;

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

const socket = io.connect(config.socketUrl);

socket.on("connect", () => {
  socket.emit("join", controlInfo.controlCode);

  socket.on("answer", (answer) => {
    if (answer) {
      peer.setRemoteDescription(answer);
    }
  });

  socket.on("icecandidate", (candidate) => {
    if (offerState && candidate) {
      peer.addIceCandidate(candidate);
    }
  });
});

function createRtcConnect(cb) {
  peer = new RTCPeerConnection(iceServerConfig);

  peer.ontrack = e => {
    if (e && e.streams) {
      localVideo.srcObject = e.streams[0];
    }
  };

  peer.onicecandidate = e => {
    if (e && e.candidate) {
      socket.emit("icecandidate", e.candidate, controlInfo.terminalCode);
    }
  };

  peer.oniceconnectionstatechange = (e) => {
    let state = peer.iceConnectionState;
    if (state == "disconnected") {
      if (!!localVideo.srcObject) {
        localVideo.srcObject.getTracks().map((track) => track.stop());
      }
    }
  };

  cb && cb();
}

function startLive(type = 1) {
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

      const options = {
        "intercom": {
          video: {
            deviceId: videoId
          },
          audio: true,
        },
        "monitor": {
          video: false,
          audio: true
        },
      };
      const constraints = type == 1 ? options.intercom : options.monitor;
      stream = await navigator.mediaDevices.getUserMedia(constraints);
      resolve(stream);
    } catch (err) {
      reject("Failed to get the stream", err);
    }
  });
}

// 开始视频对讲，type: 0-监室监听 1-视频对讲
function startRtcVideo(selector, controlCode, terminalCode, type) {
  localVideo = selector;
  controlInfo = Object.assign({}, controlInfo, { controlCode, terminalCode });
  createRtcConnect(() => {
    startLive(type).then((stream) => {
      stream.getTracks().map(track => {
        peer.addTrack(track, stream);
      });
      peer.createOffer({
        offerToReceiveAudio: 1,
        offerToReceiveVideo: 1,
      }).then((offer) => {
        if (offer) {
          peer.setLocalDescription(offer);
          offerState = true;
          let room = controlInfo.terminalCode;
          socket.emit("offer", offer, room, type);
        }
      });
    });
  });
}

function stopRtcVideo() {
  if (!!localVideo.srcObject) {
    localVideo.srcObject.getTracks().map((track) => {
      track.stop();
    });
    peer.close();
  }
  offerState = false;
  socket.emit("hangup", controlInfo.terminalCode);
}

export { startLive, startRtcVideo, stopRtcVideo };