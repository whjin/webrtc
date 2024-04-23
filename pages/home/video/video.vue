<template>
  <div class="video-container">
    <div class="video-wrapper">
      <div class="video-content">
        <div class="video-left">
          <scroll-view
            scroll-y="true"
            class="video-left-scroll"
            @scrolltolower="scrollToLower"
          >
            <div class="video-list">
              <div
                class="video-item"
                :class="
                  videoId == item.videoId ? 'media-select-img' : 'media-img'
                "
                v-for="(item, index) in videoList"
                :key="index"
                @click="selectVideoChange(item)"
              >
                <image :src="item.imgUrl" lazy-load></image>
                <text>{{ item.name }}</text>
              </div>
            </div>
          </scroll-view>
          <div v-if="isPlay" class="video-control">
            <video
              id="myVideo"
              class="my-video"
              :src="videoUrl"
              codec="software"
              object-fit="fill"
              autoplay
              @ended="videoPlayEnded"
              @error="videoPlayError"
            ></video>
          </div>
        </div>
        <div class="video-vertical-divider"></div>
        <div class="video-right">
          <div class="video-title">视频简介</div>
          <scroll-view class="video-right-scroll" scroll-y show-scrollbar>
            <div class="right-info-list">
              <div class="info-item">
                <common-icons iconType="iconname" size="25" color="#00C6FF" />
                <text>名称：{{ videoInfo.name }}</text>
              </div>
              <div class="info-item">
                <common-icons iconType="iconsinger" size="25" color="#00C6FF" />
                <text>主演：{{ videoInfo.starring }}</text>
              </div>
              <div class="info-item">
                <common-icons iconType="icontype" size="25" color="#00C6FF" />
                <text>类型：{{ videoInfo.type }}</text>
              </div>
              <div class="info-item">
                <common-icons
                  iconType="iconduration"
                  size="25"
                  color="#00C6FF"
                />
                <text>时长：{{ videoInfo.duration }}</text>
              </div>
              <div class="info-item">
                <common-icons
                  iconType="iconduration"
                  size="25"
                  color="#00C6FF"
                />
                <text>可播放开始时间：{{ videoInfo.startTime }}</text>
              </div>
              <div class="info-item">
                <common-icons
                  iconType="iconduration"
                  size="25"
                  color="#00C6FF"
                />
                <text>可播放结束时间：{{ videoInfo.endTime }}</text>
              </div>
            </div>
          </scroll-view>
          <div class="video-right-btn" v-show="!videoInfo.status">
            <div
              class="video-btn"
              :class="isPlay ? 'btn-active-img' : 'btn-img'"
              @click="handlePlayVideo"
            >
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
import { dateFormat, timeFormat } from "@/common/utils/util.js";

export default {
  name: "terminal-video",
  data() {
    return {
      // 视频列表
      videoList: [],
      // 选择视频ID
      videoId: "",
      // 视频地址
      videoUrl: "",
      // 视频播放状态
      isPlay: false,
      // 视频详情
      videoInfo: {},
      // 页面索引
      pageIndex: 1,
      // 页面总数
      totalPage: 1,
      // 视频播放定时器
      playTimer: null,
      // 视频可播放时长
      videoPlayTime: 0,
    };
  },
  created() {
    // 开启倒计时
    this.$parent.countTimer();
    // 获取视频信息
    this.getVideoInfo(this.pageIndex);
  },
  destroyed() {
    clearInterval(this.playTimer);
    if (this.isPlay) {
      this.setDynamicInfo("停止");
    }
    this.stopPlayVideo(false);
  },
  methods: {
    // 获取视频信息
    async getVideoInfo(index) {
      const { roomNo } = uni.getStorageSync("terminalInfo");
      let params = {
        data: {
          roomNo,
        },
        pageParam: {
          pageIndex: index,
          pageSize: 16,
        },
      };
      let res = await Api.apiCall("post", Api.index.getVideoList, params);
      if (res.state.code == 200) {
        this.totalPage = res.page.totalPage;
        let result = res.data;
        if (result.length) {
          result.map((item) => {
            item.duration = timeFormat(item.duration);
            item.startTime = dateFormat(
              "YYYY-MM-DD hh:mm:ss",
              new Date(item.startTime)
            );
            item.endTime = dateFormat(
              "YYYY-MM-DD hh:mm:ss",
              new Date(item.endTime)
            );
          });
        }
        this.videoList = [...this.videoList, ...result];
        if (this.videoList.length) {
          this.videoInfo = this.videoList[0];
          this.videoId = this.videoInfo.videoId;
        }
      }
    },
    // 下拉刷新
    scrollToLower(e) {
      if (this.pageIndex < this.totalPage) {
        this.pageIndex++;
        // 获取视频信息
        this.getVideoInfo(this.pageIndex);
      }
    },
    // 新增视频点播操作动态
    async setDynamicInfo(state) {
      const { controlId, terminalName } = uni.getStorageSync("terminalInfo");
      let params = {
        controlId,
        type: "401",
        content: `${state}点播${terminalName}视频`,
        operationTime: dateFormat("YYYY-MM-DD", new Date()),
      };
      let res = await Api.apiCall(
        "post",
        Api.index.setDynamicInfo,
        JSON.stringify(params)
      );
      if (res.state.code == 200) {
        this.$parent.handleShowToast("保存视频点播动态成功！");
      } else {
        this.$parent.handleShowToast("请求错误！");
      }
    },
    // 选择视频
    selectVideoChange(item) {
      this.videoId = item.videoId;
      this.videoInfo = item;
    },
    // 播放视频
    handlePlayVideo(e) {
      if (!Object.keys(this.videoInfo).length) {
        this.$parent.handleShowToast("请先选择视频！", "center");
        return;
      }
      this.isPlay = !this.isPlay;
      if (this.isPlay) {
        // 开始播放视频
        this.videoUrl = this.videoInfo.videoUrl;
        // 获取视频点播信息
        this.getVideoPlayInfo();
      } else {
        this.stopPlayVideo(true);
        this.setDynamicInfo("停止");
      }
    },
    // 获取视频点播信息
    async getVideoPlayInfo() {
      let vId = this.videoInfo.videoId;
      const { roomNo } = uni.getStorageSync("terminalInfo");
      let res = await Api.apiCall(
        "get",
        Api.index.getByVideoPlayTime + `?vId=${vId}&roomNo=${roomNo}`,
        null
      );
      if (res.state.code == 200) {
        if (Object.keys(res.data).length) {
          // 停止倒计时
          clearInterval(this.$parent.timer);
          // 开启视频播放定时器
          this.videoPlayTimer(res.data.playTime);
          this.setDynamicInfo("开始");
        }
      }
    },
    // 视频播放定时器
    videoPlayTimer(playTime) {
      this.videoPlayTime = playTime;
      this.playTimer = setInterval(() => {
        this.videoPlayTime--;
        if (this.videoPlayTime <= 0) {
          clearInterval(this.playTimer);
          this.videoPlayTime = playTime;
          this.stopPlayVideo(true);
        }
      }, 1000);
    },
    // 停止播放视频
    stopPlayVideo(state) {
      let videoContext = uni.createVideoContext("myVideo");
      videoContext.exitFullScreen();
      this.isPlay = false;
      this.videoUrl = "";
      clearInterval(this.playTimer);
      if (state) {
        clearInterval(this.$parent.timer);
        this.$parent.countTimer();
      }
    },
    // 视频播放结束
    videoPlayEnded(e) {
      this.stopPlayVideo(true);
      this.setDynamicInfo("停止");
    },
    // 视频播放出错
    videoPlayError(e) {
      this.stopPlayVideo(true);
      this.$parent.handleShowToast(
        "视频播放错误，请联系管教！",
        "bottom",
        10000
      );
    },
  },
};
</script>

<style lang="less">
@import "../../../common/less/index.less";
</style>
