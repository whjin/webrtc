export default {
    controlType: {
        HEARTBEAT: "000",
        INTERCOM: "100",
        RADIO: "200",
        AUDIO: "300",
        VIDEO: "400",
        ALARM: "500",
        CALL: "600",
        DEVICE: "700",
        WEBRTC: "1100",
        FACE: "1200",
    },

    iceServerConfig: {
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
    },
};