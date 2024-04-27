<template>
  <div class="control-container">
    <video id="controlVideo" autoplay playsinline poster="../assets/images/poster.jpg"></video>
  </div>
</template>

<script>
import global from "@/assets/js/global.js";
import { ElMessage } from "element-plus";
import { isValidJSON } from "@/assets/js/utils.js";
import config from "@/assets/js/comlib.js";

export default {
  name: "Control",
  components: {
    ElMessage,
  },
  data() {
    return {
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
      localVideo: null,
      controlVideo: null,
      peer: null,
      controlInfo: {},
      offerState: false,
      // 拦截重复动作
      isRepeatState: false,
      options: {
        intercom: {
          video: true,
          audio: true
        },
        monitor: {
          video: false,
          audio: true
        }
      }
    };
  },
  created() {
    if (!this.webSocketConnected) {
      this.controlInfo = JSON.parse(JSON.parse(result.getData()).data);
      const { controlCode, terminalCode, controlIp } = this.controlInfo;
      this.controlInfo = Object.assign(this.controlInfo, {
        webControlCode: `web_${controlCode}`,
        webTerminalCode: `web_${terminalCode}`,
        webControlIp: `web_${controlIp}`,
      });
      this.connectWebSocketInit(this.controlInfo.webControlCode);
    }
  },
  mounted() {
    this.controlVideo = document.getElementById("controlVideo");
    window.isDomFinish = this.isDomFinish;
    window.hangupControlVideo = this.hangupControlVideo;
  },
  beforeDestroy() { },
  methods: {
    isDomFinish() {
      this.startRtcVideo(this.controlInfo.type);
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
    // 向APP发送数据
    sendAppData(data) {
      const { controlCode, terminalCode } = this.controlInfo;
      let socketObj = {
        maindevno: controlCode,
        devno: terminalCode,
        type: global.controlType.WEBRTC,
        msg: "9",
        extend: data
      };
      this.sendWebsocket(JSON.stringify(socketObj));
    },
    // websocket心跳检测
    socketHeartbeatCheck() {
      if (!this.heartbeatTimer) {
        this.heartbeatTimer = setInterval(() => {
          if (!this.isHeartbeat) {
            this.websocketReconnect();
          }
          this.isHeartbeat = false;
        }, this.heartbeatTimeOut * 1000);
      }
    },
    // socket重连
    websocketReconnect() {
      this.websocketOff();
      this.reconnectCount++;
      this.connectWebSocketInit(this.controlInfo.webControlCode);
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
        console.log("WebSocket已关闭");
      };
      this.socketTask.addEventListener("error", e => {
      });

      // 获取主机websocket数据
      this.socketTask.addEventListener("message", res => {
        let info = JSON.parse(res.data);
        console.log(info);
        if (info.type == global.controlType.HEARTBEAT) {
          // 收到心跳包
          this.isHeartbeat = true;
          const { webControlCode, webControlIp } = this.controlInfo;
          let socketObj = {
            maindevno: webControlCode,
            devno: "",
            type: global.controlType.HEARTBEAT,
            msg: "1",
            extend: { ip: webControlIp },
          };
          this.sendWebsocket(JSON.stringify(socketObj));
        } else if (info.type == global.controlType.WEBRTC) {
          if (info.msg == "31" || info.msg == "33") {
            if (Reflect.has(info, "extend") && isValidJSON(info.extend)) {
              let extend = JSON.parse(info.extend);
              if (info.msg = "31") {
                // 主机接收分机answer
                if (extend.answer) {
                  this.peer.setRemoteDescription(extend.answer);
                }
              }
              if (info.msg = "33") {
                // 主机接收分机candidate
                if (this.offerState && extend.candidate) {
                  this.peer.addIceCandidate(extend.candidate);
                }
              }
            } else {
              this.showMessage("数据格式错误", "error");
            }
          }
        }
      });
    },
    createRtcConnect(cb) {
      this.peer = new RTCPeerConnection(global.iceServerConfig);

      this.peer.ontrack = e => {
        if (e && e.streams) {
          this.controlVideo.srcObject = e.streams[0];
          if (!this.isRepeatState) {
            this.isRepeatState = true;
            setTimeout(() => {
              this.isRepeatState = false;
            }, 1000);
            const { controlCode, terminalCode } = this.controlInfo;
            let socketObj = {
              maindevno: controlCode,
              devno: terminalCode,
              type: global.controlType.WEBRTC,
              msg: "36",
            };
            this.sendWebsocket(JSON.stringify(socketObj));
          }
        }
      };

      this.peer.onicecandidate = e => {
        if (e && e.candidate) {
          const { webControlCode, webTerminalCode } = this.controlInfo;
          let socketObj = {
            maindevno: webControlCode,
            devno: webTerminalCode,
            type: global.controlType.WEBRTC,
            msg: "32",
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
          if (!!this.controlVideo.srcObject) {
            this.controlVideo.srcObject.getTracks().map(track => track.stop());
          }
        }
      };

      cb && cb();
    },
    startLive(type) {
      return new Promise(async (resolve, reject) => {
        let stream;
        try {
          this.showMessage(this.options[type]);
          stream = await navigator.mediaDevices.getUserMedia(this.options[type]);
          resolve(stream);
        } catch (err) {
          this.showMessage(`Failed to get the stream ${err}`, "error");
          reject(`Failed to get the stream ${err}`);
        }
      });
    },
    // 开始视频对讲
    startRtcVideo(type = "intercom") {
      this.createRtcConnect(() => {
        this.startLive(type).then(stream => {
          stream.getTracks().map(track => {
            this.peer.addTrack(track, stream);
          });
          this.callRemoteVideo();
        });
      });
    },
    callRemoteVideo() {
      this.peer.createOffer({
        offerToReceiveAudio: 1,
        offerToReceiveVideo: 1,
      }).then(offer => {
        if (offer) {
          this.peer.setLocalDescription(offer);
          this.offerState = true;
          const { webControlCode, webTerminalCode } = this.controlInfo;
          let socketObj = {
            maindevno: webControlCode,
            devno: webTerminalCode,
            type: global.controlType.WEBRTC,
            msg: "30",
            extend: { offer },
          };
          this.sendWebsocket(JSON.stringify(socketObj));
        }
      }).catch(err => {
        this.showMessage(`Failed to create the offer ${err}`, "error");
      });
    },
    // 挂断视屏对讲
    hangupControlVideo() {
      if (!!this.controlVideo.srcObject) {
        this.controlVideo.srcObject.getTracks().map(track => {
          track.stop();
        });
        this.peer && this.peer.close();
      }
      this.offerState = false;
      const { webControlCode, webTerminalCode } = this.controlInfo;
      let socketObj = {
        maindevno: webControlCode,
        devno: webTerminalCode,
        type: global.controlType.WEBRTC,
        msg: "34",
      };
      this.sendWebsocket(JSON.stringify(socketObj));
    },
    showMessage(message, type = "success", plain = true) {
      ElMessage({ message, type, plain });
    },
  },
};
</script>

<style lang="less"></style>