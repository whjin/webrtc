<template>
  <div class="container" :style="rtcVideoStyle">
    <video ref="rtcVideo" id="rtcVideo" playsinline autoplay object-fit="fill" :controls="false" codec="software"
      :enable-progress-gesture="false" :show-center-play-btn="false"></video>
  </div>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  name: "rtcVideo",
  props: {
    rtcVideoStyle: {
      type: Object,
      default() {
        return {
          width: "1px",
          heigth: "1px"
        };
      }
    },
  },
  data() {
    return {

    };
  },
  mounted() {
    this.setRtcVideoRef(this.$refs.rtcVideo.$refs.video);
  },
  methods: {
    ...mapMutations({
      // 设置rtcVideo对讲组件Ref
      setRtcVideoRef: "app/SET_RTCVIDEOREF"
    })
  }
};
</script>

<style lang="less" scoped>
.container {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 9;
  background: transparent;

  video {
    width: 100%;
    height: 100%;
  }
}
</style>
