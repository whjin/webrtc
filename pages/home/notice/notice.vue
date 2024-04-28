<template>
  <div class="schedule-container">
    <div class="schedule-wrapper" v-if="scheduleList.length">
      <div class="schedule-left">
        <scroll-view scroll-y="true" class="schedule-left-scroll">
          <div class="schedule-left-item" v-for="list in scheduleList" :key="list.type"
            :class="selectInfo.type == list.type ? 'schedule-selected-img' : 'schedule-img'"
            @click="selectScheduleItem(list)">
            <text :class="selectInfo.type == list.type ? 'select-item' : ''">{{ list.typeName }}</text>
          </div>
        </scroll-view>
      </div>
      <div class="page-vertical-divider"></div>
      <div class="schedule-right">
        <scroll-view scroll-y="true" class="schedule-right-scroll">
          <div v-if="['1', '3'].includes(selectInfo.type)">
            <div class="schedule-right-item">
              <div class="content">
                <header>{{ selectInfo.info.title }}</header>
                <section v-html="selectInfo.info.content"></section>
              </div>
              <div class="button button-type">
                <span class="btn">确认</span>
              </div>
            </div>
          </div>
          <div v-else>
            <div class="list" v-for="(item, index) in selectInfo.list" :key="index">
              <div class="schedule-right-item">
                <div class="item">{{ item.title }}</div>
                <section v-html="item.content"></section>
                <div class="button">
                  <span class="btn">确认</span>
                </div>
              </div>
            </div>
          </div>
        </scroll-view>
      </div>
    </div>
    <div class="schedule-empty" v-else>暂无数据</div>
  </div>
</template>

<script>
import Api from "@/common/api";
import noticeList from "@/static/mock/noticeList.json";

export default {
  name: "schedule",
  data() {
    return {
      // 事务列表
      scheduleList: [],
      // 已选事务项
      selectInfo: {},
    };
  },
  mounted() {
    // 获取事务列表
    this.getScheduleInfo();
  },
  methods: {
    // 获取事务列表
    async getScheduleInfo() {
      let params = {
        data: {}
      };
      let res = await Api.apiCall("post", Api.police.schedule.findReminder, params);
      if (res.state.code == 200) {
        this.scheduleList = noticeList;
        this.selectInfo = this.scheduleList[0];
      }
    },
    selectScheduleItem(item) {
      this.selectInfo = item;
    },
  },
};
</script>

<style lang="less">
@import '../../../common/less/index.less';
</style>