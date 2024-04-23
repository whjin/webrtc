<script>
// 基础模块
// const Base = uni.requireNativePlugin("GK-Base");
// 升级APP
// const UpdateApp = uni.requireNativePlugin("GK-UpdateApp");
// 看门狗
// const CrashHandle = uni.requireNativePlugin("CrashHandle");
// 来邦对讲模块
// const FloatUniModule = uni.requireNativePlugin("FloatUniModule");

export default {
  onLaunch() {
    // #ifdef APP-PLUS
    if (process.env.NODE_ENV == "production") {
      // FloatUniModule.openGuard(1);
    }
    // 初始化语音播报
    // Base.speechInit();
    // 设置媒体音量
    // FloatUniModule.setStreamVolumeTypeMusic(
    //   Number(uni.getStorageSync("mediaDefaultVolume"))
    // );
    // // 设置通话音量
    // FloatUniModule.setStreamVolumeTypeVoiceCall(
    //   Number(uni.getStorageSync("mediaDefaultVolume"))
    // );
    CrashHandle.startGather(0); //开启日志，参数无效，默认保存着
    // 添加week自定义字体规则
    let domModule = weex.requireModule("dom");
    domModule.addRule("fontFace", {
      fontFamily: "uniicons",
      src: "url('./static/uni.ttf')",
    });
    // #endif
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
@import "./common/css/images/page-img.css";
@import "./common/css/images/neilModal-img.css";
@import "./common/css/images/prisoner-img.css";
@import "./common/css/images/rectangle-img.css";
@import "./common/css/images/btn-img.css";
@import "./common/css/images/single-play-img.css";
@import "./common/css/images/random-play-img.css";
@import "./common/css/images/loop-play-img.css";
@import "./common/css/images/bgRoll-img.css";
@import "./common/css/images/bottom-img.css";
@import "./common/css/images/bgStyle-img.css";
@import "./common/css/images/soundwave-img.css";
@import "./common/css/images/video-img.css";
@import "./common/css/images/keyboard-img.css";
@import "./common/css/images/picker-img.css";
@import "./common/css/images/input-img.css";
/* #endif*/
</style>
