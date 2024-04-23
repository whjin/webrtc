export default {
  // pro
  // baseUrl: "http://192.168.1.214:8100/",
  // dev
  baseUrl: "http://192.168.20.214:8100/",

  terminalIP: "192.168.20.103",

  // pro
  // socketUrl: "http://192.168.20.214:3000/",
  // dev
  socketUrl: "http://192.168.20.222:3000/",
  // dev
  // socketUrl: "http://localhost:3000/",

  controlType: {
    HEARTBEAT: "000",
    INTERCOM: "100",
    RADIO: "200",
    AUDIO: "300",
    VIDEO: "400",
    ALARM: "500",
    ROLLCALL: "600",
    DEVICE: "700",
    DUTY: "800",
    CONVERSATION: "900",
    EVALUATION: "1000",
  },
  // 管理员账号
  admin: {
    name: "管理员",
    dabh: "099",
    rybh: "0999",
  },
};
