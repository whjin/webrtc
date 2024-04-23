<template>
  <div class="life-container">
    <div class="life-wrapper">
      <div class="life-title">
        <text>一日生活</text>
      </div>
      <scroll-view scroll-y="true" class="life-scroll">
        <div v-for="(item, index) in lifeList" :key="index" class="life-box">
          <div class="life-list">
            <image :src="getCurrentStauts(item.startTime, item.endTime, index, 'icon')
              "></image>
            <div class="life-date">
              <div class="content timeline" :style="{
                color: getCurrentStauts(
                  item.startTime,
                  item.endTime,
                  '',
                  'font'
                ),
              }">
                {{ item.startTime }}—{{ item.endTime }}
              </div>
            </div>
            <div class="content detail" :style="{
              color: getCurrentStauts(
                item.startTime,
                item.endTime,
                '',
                'font'
              ),
            }">
              {{ item.livingContent }}
            </div>
          </div>
          <image :src="rectangle" v-show="index != lifeList.length - 1" class="life-progress"></image>
        </div>
      </scroll-view>
    </div>
  </div>
</template>

<script>
import Api from "@/common/api.js";

export default {
  data() {
    return {
      lifeList: [],
      green: "/static/images/life/green.png",
      red: "/static/images/life/red.png",
      blue: "/static/images/life/blue.png",
      gray: "/static/images/life/gray.png",
      rectangle: "/static/images/life/rectangle.png",
      past: "#fff",
      progressive: "#35FFFA",
      future: "#bbb",
    };
  },
  created() {
    this.getLifeList();
    // 开启倒计时
    this.$parent.countTimer();
  },
  methods: {
    getCurrentStauts(beginTime, endTime, index, type) {
      let currentTime = new Date();
      let currentYear = currentTime.getUTCFullYear();
      let currentMonth = currentTime.getMonth();
      let currentDate = currentTime.getDate();
      beginTime = beginTime.split(":");
      endTime = endTime.split(":");
      beginTime = new Date(
        currentYear,
        currentMonth,
        currentDate,
        beginTime[0],
        beginTime[1]
      );
      endTime = new Date(
        currentYear,
        currentMonth,
        currentDate,
        endTime[0],
        endTime[1]
      );
      let lastTime = new Date(
        currentYear,
        currentMonth,
        currentDate,
        "22",
        "00"
      );
      if (currentTime > endTime && currentTime > beginTime) {
        if (type == "icon") {
          if (!index % 2) {
            return this.green;
          } else {
            return this.red;
          }
        }
        return this.past;
      } else if (currentTime < beginTime) {
        if (type == "icon") {
          return this.gray;
        }
        return this.future;
      } else if (
        (currentTime >= beginTime && currentTime <= endTime) ||
        currentTime >= lastTime
      ) {
        if (type == "icon") {
          return this.blue;
        }
        return this.progressive;
      }
    },
    async getLifeList() {
      let res = await Api.apiCall("get", Api.index.getLifeList, null, true);
      if (res.state.code == 200) {
        this.lifeList = res.data;
      }
    },
  },
};
</script>

<style lang="less">
@import "../../../common/less/index.less";
</style>
