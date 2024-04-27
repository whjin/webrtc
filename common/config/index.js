export default {
  // pro
  baseUrl: "http://192.168.20.214:8100/",
  // dev
  // baseUrl: "http://192.168.20.187:8100/",

  controlIP: "192.168.20.103",

  // socket连接地址
  socketUrl: "https://192.168.20.222:3000/",

  controlType: {
    HEARTBEAT: "000",
    INTERCOM: "100",
    RADIO: "200",
    AUDIO: "300",
    VIDEO: "400",
    ALARM: "500",
    CALL: "600",
    DEVICE: "700",
    WEBRTC: "1100"
  },
};
