<template>
  <div class="message-container">
    <div class="message-wrapper">
      <div class="message-content">
        <div class="message-title">
          <text>消息通知</text>
        </div>
        <div class="message-box">
          <div class="message-menu-list">
            <div
              class="message-menu-item"
              :class="currentPage == 1 ? 'message-menu-active' : ''"
              @click="switchPage(1)"
            >
              <common-icons iconType="iconmessage" size="40" color="#fff" />
              <text>即时消息</text>
            </div>
            <div
              class="message-menu-item"
              :class="currentPage == 2 ? 'message-menu-active' : ''"
              @click="switchPage(2)"
            >
              <common-icons iconType="iconclock" size="43" color="#fff" />
              <text>提讯会见预告</text>
            </div>
            <div
              class="message-menu-item"
              :class="currentPage == 3 ? 'message-menu-active' : ''"
              @click="switchPage(3)"
            >
              <common-icons iconType="iconwarning" size="40" color="#fff" />
              <text>违规通报</text>
            </div>
          </div>
          <div class="message-vertical-divider"></div>
          <div v-if="currentPage == page" class="message-list-box">
            <scroll-view
              scroll-y="true"
              class="message-list-scroll"
              @scrolltolower="scrollToLower"
            >
              <div
                class="message-list"
                v-for="(item, index) in messageList"
                :key="index"
              >
                <div class="list-left">
                  <div class="list-title">{{ `【${item.fieldName}】` }}</div>
                  <div class="list-content">{{ item.msgContent }}</div>
                </div>
                <div class="list-right">{{ item.msgTime }}</div>
              </div>
            </scroll-view>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Api from "@/common/api.js";
import { dateFormat } from "@/common/utils/util.js";

export default {
  name: "message",
  data() {
    return {
      currentPage: 1,
      page: 1,
      // 消息通知列表
      messageList: [],
      // 页面索引
      pageIndex: 1,
      // 页面总数
      totalPage: 1,
    };
  },
  created() {
    // 开启倒计时
    this.$parent.countTimer();
    // 获取即时消息
    this.getNotificationInfo(1, this.pageIndex);
  },
  methods: {
    // 切换菜单
    switchPage(index) {
      this.currentPage = index;
      this.pageIndex = 1;
      this.messageList = [];
      switch (index) {
        case 1:
          this.page = 1;
          this.getNotificationInfo(1, this.pageIndex);
          break;
        case 2:
          this.page = 2;
          this.getNotificationInfo(2, this.pageIndex);
          break;
        case 3:
          this.page = 3;
          this.getNotificationInfo(3, this.pageIndex);
          break;
      }
    },
    // 获取即时消息
    async getNotificationInfo(type, index) {
      let params = {
        data: {
          id: uni.getStorageSync("terminalInfo").roomId,
          type: type,
        },
        pageParam: {
          pageIndex: index,
          pageSize: 15,
        },
      };
      let res = await Api.apiCall(
        "post",
        Api.index.getNotificationInfo,
        params
      );
      if (res.state.code == 200) {
        this.totalPage = res.page.totalPage;
        let result = res.data;
        result.map((item) => {
          item.msgTime = dateFormat(
            "YYY-MM-DD hh:mm:ss",
            new Date(item.msgTime)
          );
        });
        this.messageList = this.messageList.concat(result);
      }
    },
    // 下拉刷新
    scrollToLower(e) {
      if (this.pageIndex < this.totalPage) {
        this.pageIndex++;
        switch (this.currentPage) {
          case 1:
            this.getNotificationInfo(1, this.pageIndex);
            break;
          case 2:
            this.getNotificationInfo(2, this.pageIndex);
            break;
          case 3:
            this.getNotificationInfo(3, this.pageIndex);
            break;
        }
      }
    },
  },
};
</script>

<style lang="less">
@import "../../../common/less/index.less";
</style>
