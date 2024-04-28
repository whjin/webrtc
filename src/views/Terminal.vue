<template>
  <div class="terminal-container">
    <video id="terminalVideo" v-show="isShow" autoplay playsinline poster="../assets/images/poster.jpg"></video>
    <video id="localVideo" v-show="!isShow" autoplay playsinline poster="../assets/images/poster.jpg"></video>
  </div>
</template>

<script>
import global from "@/assets/js/global.js";
import { ElMessage, ElButton } from "element-plus";
import { isValidJSON, convertVideoToImage } from "@/assets/js/utils";
import config from "@/assets/js/comlib";

export default {
  name: "Terminal",
  components: {
    ElMessage,
    ElButton,
  },
  data() {
    return {
      isShow: true,
      // 网络异常计时
      heartbeatTimeOut: 60,
      // 网络异常定时器
      heartbeatTimer: null,
      // socket会话对象
      socketTask: null,
      // 是否收到心跳
      isHeartbeat: false,
      // socket重连次数
      reconnectCount: 0,
      // socket连接状态
      webSocketConnected: false,
      // 人脸视频
      localVideo: null,
      // 对讲视频
      terminalVideo: null,
      peer: null,
      terminalInfo: {},
      offerState: false,
      muted: true,
    };
  },
  created() {
    if (!this.webSocketConnected) {
      this.terminalInfo = JSON.parse(JSON.parse(result.getData()).data);
      const { controlCode, terminalCode, terminalIp } = this.terminalInfo;
      this.terminalInfo = Object.assign(this.terminalInfo, {
        webControlCode: `web_${controlCode}`,
        webTerminalCode: `web_${terminalCode}`,
        webTerminalIp: `web_${terminalIp}`,
      });

      this.connectWebSocketInit(this.terminalInfo.webTerminalCode);
    }
  },
  mounted() {
    this.terminalVideo = document.getElementById("terminalVideo");
    this.localVideo = document.getElementById("localVideo");
    window.isDomFinish = this.isDomFinish;
    window.hangupTerminalVideo = this.hangupTerminalVideo;
    window.hangupFaceVideo = this.hangupFaceVideo;
  },
  beforeDestroy() {
    if (this.isShow) {
      this.hangupTerminalVideo();
    } else {
      this.hangupFaceVideo();
    }
  },
  methods: {
    isDomFinish() {
      const { type } = this.terminalInfo;
      if (type == "face") {
        this.isShow = false;
        this.startFaceVideo();
      } else {
        this.isShow = true;
        this.startRtcVideo(this.terminalInfo.type);
      }
    },
    // socket上线
    websocketOn() {
      this.webSocketConnected = true;
      this.reconnectCount = 0;
      this.showMessage("WebSocket连接成功！");
    },
    // socket离线
    websocketOff() {
      this.webSocketConnected = false;
      console.log("WebSocket已离线！");
    },
    // 发送websocket数据
    sendWebsocket(data) {
      try {
        this.socketTask.send(data);
        let info = isValidJSON(data) ? JSON.parse(data) : data;
        console.log("消息发送成功：", info);
      } catch (err) {
        console.log("消息发送失败", err);
      }
    },
    // websocket心跳检测
    socketHeartbeatCheck() {
      if (!this.heartbeatTimer) {
        this.heartbeatTimer = setInterval(() => {
          if (!this.isHeartbeat) {
            this.websocketReconnect();
          }
          // 触发一次检测后重置心跳默认状态
          this.isHeartbeat = false;
        }, this.heartbeatTimeOut * 1000);
      }
    },
    // socket重连
    websocketReconnect() {
      this.websocketOff();
      this.reconnectCount++;
      this.connectWebSocketInit(this.terminalInfo.webTerminalCode);
    },
    // 关闭websocket连接
    closeSocket() {
      if (this.socketTask) {
        this.socketTask.close();
        this.socketTask = null;
      }
    },
    connectWebSocketInit(code) {
      // 开启心跳检测
      this.socketHeartbeatCheck();
      if (this.socketTask) {
        this.closeSocket();
      }
      console.log(`${config.websocketUrl}${code}`);
      this.socketTask = new WebSocket(`${config.websocketUrl}${code}`);
      this.socketTask.onopen = e => {
        this.websocketOn();
      };
      this.socketTask.onclose = e => {
        console.log("WebSocket已关闭", e);
      };
      this.socketTask.addEventListener("error", e => {
      });
      // 获取分机websocket数据
      this.socketTask.addEventListener("message", res => {
        let info = JSON.parse(res.data);
        console.log(info);
        if (info.type == global.controlType.HEARTBEAT) {
          // 收到心跳包
          this.isHeartbeat = true;
          const { webTerminalCode, webTerminalIp } = this.terminalInfo;
          let socketObj = {
            maindevno: "",
            devno: webTerminalCode,
            type: global.controlType.HEARTBEAT,
            msg: "1",
            extend: { ip: webTerminalIp },
          };
          this.sendWebsocket(JSON.stringify(socketObj));
        } else if (info.type == global.controlType.WEBRTC) {
          if (info.msg == "30" || info.msg == "32") {
            if (Reflect.has(info, "extend") && isValidJSON(info.extend)) {
              let extend = JSON.parse(info.extend);
              if (info.msg = "30") {
                // 分机接收主机offer
                if (extend.offer) {
                  this.peer.setRemoteDescription(extend.offer);
                  this.peer.createAnswer({
                    offerToReceiveAudio: 1,
                    offerToReceiveVideo: 1,
                  }).then(answer => {
                    if (answer) {
                      this.peer.setLocalDescription(answer);
                      this.offerState = true;
                      const { webControlCode, webTerminalCode } = this.terminalInfo;
                      let socketObj = {
                        maindevno: webControlCode,
                        devno: webTerminalCode,
                        type: global.controlType.WEBRTC,
                        msg: "31",
                        extend: { answer },
                      };
                      this.sendWebsocket(JSON.stringify(socketObj));
                    }
                  });
                }
              }
              if (info.msg = "32") {
                // 分机接收主机candidate
                if (this.offerState && extend.candidate) {
                  this.peer.addIceCandidate(extend.candidate);
                }
              }
            } else {
              this.showMessage("数据格式错误", "error");
            }
          }
          if (info.msg == "34") {
            // 分机接收主机挂断
            this.hangupTerminalVideo();
          }
        } else if (info.type == global.controlType.FACE) {
          if (info.msg == "0") {
            // 获取人脸视频
            this.getLocalVideo(true);
          }
          if (info.msg == "2") {
            // 关闭人脸视频
            this.hangupFaceVideo();
          }
        }
      });
    },
    createRtcConnect(cb) {
      this.peer = new RTCPeerConnection(global.iceServerConfig);

      this.peer.ontrack = e => {
        if (e && e.streams) {
          const { type } = this.terminalInfo;
          let muted = type == "monitor" ? true : false;
          this.terminalVideo.muted = muted;
          this.terminalVideo.srcObject = e.streams[0];
        }
      };

      this.peer.onicecandidate = e => {
        if (e && e.candidate) {
          const { webControlCode, webTerminalCode } = this.terminalInfo;
          let socketObj = {
            maindevno: webControlCode,
            devno: webTerminalCode,
            type: global.controlType.WEBRTC,
            msg: "33",
            extend: {
              candidate: e.candidate
            },
          };
          this.sendWebsocket(JSON.stringify(socketObj));
        }
      };

      this.peer.oniceconnectionstatechange = e => {
        let state = this.peer.iceConnectionState;
        if (state == "disconnected") {
          if (!!this.terminalVideo.srcObject) {
            this.terminalVideo.srcObject.getTracks().map((track) => track.stop());
          }
        }
      };

      cb && cb();
    },
    startLive() {
      return new Promise(async (resolve, reject) => {
        let stream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
          });
          resolve(stream);
        } catch (err) {
          this.showMessage(`Failed to get the stream ${err}`, "error");
          reject(`Failed to get the stream ${err}`);
        }
      });
    },
    startRtcVideo(cb) {
      this.createRtcConnect(() => {
        const { controlCode, terminalCode } = this.terminalInfo;
        this.startLive().then(stream => {
          stream.getTracks().map(track => {
            this.peer.addTrack(track, stream);
          });
          let socketObj = {
            maindevno: controlCode,
            devno: terminalCode,
            type: global.controlType.WEBRTC,
            msg: "35",
          };
          this.sendWebsocket(JSON.stringify(socketObj));
          cb && cb();
        });
      });
    },
    // 挂断webrtc对讲
    hangupTerminalVideo() {
      if (this.terminalVideo && this.terminalVideo.srcObject) {
        this.terminalVideo.srcObject.getTracks().map(track => {
          track.stop();
        });
        this.peer && this.peer.close();
      }
      this.muted = true;
      this.offerState = false;
      this.isShow = true;
      this.startRtcVideo(this.terminalInfo.type);
    },
    // 人脸识别
    startFaceVideo() {
      this.startLive().then(stream => {
        this.localVideo.muted = true;
        this.localVideo.srcObject = stream;
        // 获取人脸视频
        this.getLocalVideo(false);
      });
    },
    // 获取人脸视频
    getLocalVideo(state = false) {
      if (this.localVideo && this.localVideo.srcObject) {
        if (state) {
          this.handleSnapshot();
        } else {
          this.localVideo.onloadedmetadata = e => {
            this.handleSnapshot();
          };
        }
      } else {
        this.showMessage("获取视频流失败", "error");
      }
    },
    // 人脸视频快照
    handleSnapshot() {
      let image = convertVideoToImage(this.localVideo);
      let length = image.length;
      let index = 0;
      while (index <= image.length) {
        let string = image.substring(index, index + 5000);
        this.sendFaceImage({ length, base64: string });
        index += 5000;
      }
    },
    // 停止人脸视频截图
    hangupFaceVideo() {
      if (this.localVideo && this.localVideo.srcObject) {
        this.localVideo.srcObject.getTracks().map(track => {
          track.stop();
        });
      }
    },
    // 向APP发送数据
    sendAppData(data) {
      const { controlCode, terminalCode } = this.terminalInfo;
      let socketObj = {
        maindevno: controlCode,
        devno: terminalCode,
        type: global.controlType.WEBRTC,
        msg: "8",
        extend: data
      };
      this.sendWebsocket(JSON.stringify(socketObj));
    },
    // 向APP发送人脸base64数据
    sendFaceImage(data) {
      const { terminalCode } = this.terminalInfo;
      let socketObj = {
        maindevno: terminalCode,
        type: global.controlType.FACE,
        msg: "1",
        extend: data
      };
      this.sendWebsocket(JSON.stringify(socketObj));
    },
    showMessage(message, type = "success", plain = true) {
      ElMessage({ message, type, plain });
    }
  },
};
</script>

<style lang="less"></style>