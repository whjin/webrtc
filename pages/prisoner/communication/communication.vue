<template>
  <div class="communication-container">
    <div class="communication-wrapper">
      <div class="communication-content">
        <div class="communication-left">
          <scroll-view scroll-y="true" class="communication-left-scroll">
            <div class="communication-list">
              <div class="communication-item" :class="selectId == item.id ? 'media-select-img' : 'media-img'" v-for="(item, index) in fileList" :key="item.id" @click="selectMediaChange(item)">
                <text>{{ item.xm }}</text>
                <text>{{
                  item.type == "1"
                    ? "家属视频"
                    : item.type == "2"
                    ? "语音留言"
                    : "电子信件"
                }}</text>
                <text>{{ item.name }}</text>
              </div>
            </div>
          </scroll-view>
          <div v-if="isPlay && mediaInfo.type == '1'" class="communication-control">
            <video :src="mediaUrl" codec="software" object-fit="fill" autoplay></video>
          </div>
          <div v-if="isPlay && mediaInfo.type == '2'" class="communication-control">
            <video :src="mediaUrl" autoplay></video>
          </div>
          <div v-if="isPlay && mediaInfo.type == '3'" class="communication-control">
            <image :src="mediaUrl" mode="widthFix"></image>
          </div>
        </div>
        <div class="communication-vertical-divider"></div>
        <div class="communication-right">
          <div class="communication-title">文件详情</div>
          <scroll-view class="communication-right-scroll" scroll-y show-scrollbar>
            <div class="right-info-list">
              <div class="info-item">
                <common-icons iconType="iconsinger" size="25" color="#00C6FF" />
                <text>人员姓名：{{ mediaInfo.xm }}</text>
              </div>
              <div class="info-item">
                <common-icons iconType="icontype" size="25" color="#00C6FF" />
                <text>文件类型：{{fileType}}</text>
              </div>
              <div class="info-item">
                <common-icons iconType="iconname" size="25" color="#00C6FF" />
                <text>文件名称：{{ mediaInfo.name }}</text>
              </div>
            </div>
          </scroll-view>
          <div class="communication-right-btn">
            <div class="communication-btn" :class="isPlay ? 'btn-active-img' : 'btn-img'" @click="playMediaHanlder">
              <text>{{ isPlay ? "关闭" : "播放" }}</text>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Api from "@/common/api.js";
import { mapState } from "vuex";

export default {
  name: "communication",
  components: {},
  data () {
    return {
      // 通信文件列表
      fileList: [],
      // 选择文件ID
      selectId: "",
      // 播放状态
      isPlay: false,
      // 媒体详情
      mediaInfo: {},
      // 媒体URL
      mediaUrl: "",
    };
  },
  computed: {
    ...mapState({
      // 登录人员信息
      personInfo: (state) => state.app.personInfo,
    }),
    // 文件类型
    fileType () {
      switch (this.mediaInfo.type) {
        case "1":
          return "家属视频";
        case "2":
          return "语音留言";
        case "3":
          return "电子信件";
      }
    }
  },
  created () {
    // 开启倒计时
    this.$parent.countTimer();
    this.getCommucationInfo(this.personInfo.rybh);
  },
  methods: {
    // 获取通信信息
    async getCommucationInfo (rybh) {
      let params = {
        data: { rybh },
      };
      let res = await Api.apiCall(
        "post",
        Api.prisoner.getCommunication,
        params
      );
      if (res.state.code == 200) {
        this.fileList = res.data;
      }
    },
    // 选择视频
    selectMediaChange (item) {
      this.selectId = item.id;
      this.mediaInfo = item;
    },
    // 播放视频
    playMediaHanlder (e) {
      if (!this.fileList.length) {
        this.$parent.handleShowToast("当前文件为空", "center");
        return;
      }
      if (!Object.keys(this.mediaInfo).length) {
        this.$parent.handleShowToast("请先选择文件", "center");
        return;
      }
      this.isPlay = !this.isPlay;
      this.mediaUrl = this.mediaInfo.url;
    },
  },
};
</script>

<style lang="less">
@import '../../../common/less/index.less';
</style>
