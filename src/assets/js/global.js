export default {
    controlType: {
        HEARTBEAT: "000",
        WEBRTC: "1100",
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