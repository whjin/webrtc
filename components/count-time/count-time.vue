<template>
  <view>
    <text :style="timeStyle">{{ str }}</text>
  </view>
</template>

<script>
export default {
  name: "CountTime",
  data() {
    return {
      h: 0, //定义时，分，秒，毫秒并初始化为0；
      m: 0,
      ms: 0,
      s: 0,
      time: 0,
      str: "00:00:00",
      mytime: "",
    };
  },
  props: {
    // 时间
    timeStyle: {
      type: String,
      default: "font-size: 32upx;font-weight: 400;",
    },
  },
  onUnload() {
    if (this.time) {
      clearInterval(this.time);
    }
  },
  methods: {
    timer() {
      //定义计时函数
      this.ms = this.ms + 50; //毫秒
      if (this.ms >= 1000) {
        this.ms = 0;
        this.s = this.s + 1; //秒
      }
      if (this.s >= 60) {
        this.s = 0;
        this.m = this.m + 1; //分钟
      }
      if (this.m >= 60) {
        this.m = 0;
        this.h = this.h + 1; //小时
      }
      this.str =
        this.toDub(this.h) +
        ":" +
        this.toDub(this.m) +
        ":" +
        this.toDub(this.s) +
        "" /*+this.toDubms(this.ms)+"毫秒"*/;
      // document.getElementById('mytime').innerHTML=h+"时"+m+"分"+s+"秒"+ms+"毫秒";
    },
    reset() {
      //重置
      clearInterval(this.time);
      this.h = 0;
      this.m = 0;
      this.ms = 0;
      this.s = 0;
      this.str = "00:00:00";
    },
    start() {
      //开始
      this.time = setInterval(this.timer, 50);
    },
    stop() {
      //暂停
      clearInterval(this.time);
    },
    toDub(n) {
      //补0操作
      if (n < 10) {
        return "0" + n;
      } else {
        return "" + n;
      }
    },
    toDubms(n) {
      //给毫秒补0操作
      if (n < 10) {
        return "00" + n;
      } else {
        return "0" + n;
      }
    },
  },
};
</script>

<style></style>
