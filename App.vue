<script>
import Api from "@/common/api.js";

// 基础模块
// const Base = uni.requireNativePlugin("GK-Base");
// 升级APP
// const UpdateApp = uni.requireNativePlugin("GK-UpdateApp");
// 看门狗
// const CrashHandle = uni.requireNativePlugin("CrashHandle");
// 来邦对讲模块
// const FloatUniModule = uni.requireNativePlugin("FloatUniModule");

export default {
  onLaunch: function () {
    // #ifdef APP-PLUS
    if (process.env.NODE_ENV == "production") {
      // FloatUniModule.openGuard(1);
    }
    // 设置媒体音量+
    // FloatUniModule.setStreamVolumeTypeMusic(
    //   Number(uni.getStorageSync("mediaDefaultVolume"))
    // );
    // 设置通话音量
    // FloatUniModule.setStreamVolumeTypeVoiceCall(
    //   Number(uni.getStorageSync("mediaDefaultVolume"))
    // );
    // CrashHandle.startGather(0); //开启日志，参数无效，默认保存着
    // 设置全屏
    // plus.navigator.setFullscreen(true);
    // 添加week自定义字体规则
    let domModule = weex.requireModule("dom");
    domModule.addRule("fontFace", {
      fontFamily: "uniicons",
      src: "url('./static/uni.ttf')",
    });
    if (!!uni.getStorageSync("baseUrl")) {
      // 开启防拆监听
      // SystemModule.listen(69);
      // 初始化语音播报
      // Base.speechInit();
      // 修改分机信息
      this.setTerminalInfo();
    }
    // #endif
    this.createElementScript();
  },
  methods: {
    createElementScript () {
      const URL = ["/static/js/qwebchannel.js", "/static/js/kydevmonit.js"];
      for (let i = 0; i < URL.length; i++) {
        const script = document.createElement('script');
        script.setAttribute("charset", "utf-8");
        script.src = URL[i];
        document.head.appendChild(script);
      }
    },
    // 修改分机信息
    async setTerminalInfo() {
      const { terminalId: id, terminalCode: code } =
        uni.getStorageSync("terminalInfo");
      let params = {
        data: { id, code, version: plus.runtime.version },
      };
      let res = await Api.apiCall("post", Api.index.updateTerminal, params);
      if (res.state.code == 200) {
        console.log("修改信息成功");
      }
    },
  },
  globalData: {
    // Base,
    // UpdateApp,
    // FloatUniModule,
    webSocketConnected: false,
  },
};
</script>

<style>
/* #ifndef APP-PLUS-NVUE */
@import "./static/icons/iconfont.css";
@import "./common/css/uni.css";
@import "./common/css/images/home-img.css";
@import "./common/css/images/header-img.css";
@import "./common/css/images/navbar-img.css";
@import "./common/css/images/police-img.css";
@import "./common/css/images/prisoner-img.css";
@import "./common/css/images/bgStyle-img.css";
@import "./common/css/images/alarm-img.css";
@import "./common/css/images/shopping-img.css";
@import "./common/css/images/kitchen-img.css";
@import "./common/css/images/notice-img.css";
@import "./common/css/images/neilModal-img.css";
@import "./common/css/images/picker-img.css";
@import "./common/css/images/mood-img.css";
@import "./common/css/images/keyboard-img.css";
@import "./common/css/images/input-img.css";
@import "./common/css/images/media-img.css";
@import "./common/css/images/btn-img.css";
/* #endif*/
</style>
