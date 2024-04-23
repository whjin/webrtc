<template>
  <div class="kitchen-container">
    <div class="kitchen-wrapper">
      <div class="kitchen-content">
        <div class="kitchen-title">
          <text>一周菜谱</text>
        </div>
        <div class="kitchen-box">
          <div class="kitchen-menu-list">
            <div class="kitchen-menu-item" :class="currentPage == 1 ? 'kitchen-menu-active' : ''" @click="switchPage(1)">
              <common-icons iconType="iconmenu" size="38" color="#fff" />
              <text>普通餐</text>
            </div>
            <div class="kitchen-menu-item" :class="currentPage == 2 ? 'kitchen-menu-active' : ''" @click="switchPage(2)">
              <common-icons iconType="iconmenu" size="38" color="#fff" />
              <text>病号餐</text>
            </div>
            <div class="kitchen-menu-item" :class="currentPage == 3 ? 'kitchen-menu-active' : ''" @click="switchPage(3)">
              <common-icons iconType="iconmenu" size="38" color="#fff" />
              <text>回族餐</text>
            </div>
          </div>
          <div class="kitchen-vertical-divider"></div>
          <div class="kitchen-table-container">
            <div class="table-box">
              <div class="table-head">
                <div class="weekmenu-head-item" v-for="(item, index) in weekDateColumns" :key="index"
                  :class="{ 'current-date': item == currentDate }">
                  {{ item }}
                </div>
              </div>
              <scroll-view scroll-y="true" class="kitchen-table-scroll">
                <div class="weekmenu-table-content">
                  <div class="weekmenu-table-item">上午</div>
                  <div class="weekmenu-table-item kitchen-img" v-for="(item, index) in morningMenuList" :key="index"
                    :class="{ 'current-date': item.weekDate == currentDate }">
                    <span class="item-text">{{ item.breakfast }}</span>
                  </div>
                </div>
                <div class="weekmenu-table-content">
                  <div class="weekmenu-table-item">中午</div>
                  <div class="weekmenu-table-item kitchen-img" v-for="(item, index) in noonMenuList" :key="index"
                    :class="{ 'current-date': item.weekDate == currentDate }">
                    <span class="item-text">{{ item.lunch }}</span>
                  </div>
                </div>
                <div class="weekmenu-table-content">
                  <div class="weekmenu-table-item">晚上</div>
                  <div class="weekmenu-table-item kitchen-img" v-for="(item, index) in nightMenuList" :key="index"
                    :class="{ 'current-date': item.weekDate == currentDate }">
                    <span class="item-text">{{ item.dinner }}</span>
                  </div>
                </div>
              </scroll-view>
            </div>
          </div>
        </div>
        <div class="kitchen-tips">
          温馨提示：菜谱因季节、市场供应等特殊情况而临时变动，以实际菜谱为准。
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Api from "@/common/api.js";
import { dateFormat, formatFloat, currentPage } from "@/common/utils/util.js";

export default {
  data() {
    return {
      currentPage: 1,
      // 一周表头
      weekDateColumns: [],
      // 一周菜谱列表
      weekMenuList: [],
      // 伙食供应标准列表
      foodTableList: [],
      // 开始日期(周一)
      startDate: "",
      // 结束日期(周日)
      endDate: "",
      // 普通餐上午菜谱列表
      morningMenuList1: [],
      // 普通餐中午菜谱列表
      noonMenuList1: [],
      // 普通餐晚上菜谱列表
      nightMenuList1: [],
      // 病号餐上午菜谱列表
      morningMenuList2: [],
      // 病号餐中午菜谱列表
      noonMenuList2: [],
      // 病号餐晚上菜谱列表
      nightMenuList2: [],
      // 回族餐上午菜谱列表
      morningMenuList3: [],
      // 回族餐中午菜谱列表
      noonMenuList3: [],
      // 回族餐晚上菜谱列表
      nightMenuList3: [],
      // 最低合计
      totalS: 0,
      // 最高合计
      totalE: 0,
      // 当前时间戳
      nowTimestamp: new Date().getTime(),
    };
  },
  computed: {
    // 当前日期
    currentDate() {
      let weeks = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
      let date = new Date(this.nowTimestamp);
      let index = date.getDay();
      let week = weeks[index];
      let formatDate = dateFormat("MM-DD", new Date(this.nowTimestamp));
      let nowDate = `${formatDate}(${week})`;
      return nowDate;
    },
    // 早餐列表
    morningMenuList() {
      switch (this.currentPage) {
        case 1:
          return this.morningMenuList1;
        case 2:
          return this.morningMenuList2;
        case 3:
          return this.morningMenuList3;
      }
    },
    // 午餐列表
    noonMenuList() {
      switch (this.currentPage) {
        case 1:
          return this.noonMenuList1;
        case 2:
          return this.noonMenuList2;
        case 3:
          return this.noonMenuList3;
      }
    },
    // 晚餐列表
    nightMenuList() {
      switch (this.currentPage) {
        case 1:
          return this.nightMenuList1;
        case 2:
          return this.nightMenuList2;
        case 3:
          return this.nightMenuList3;
      }
    },
  },
  created() {
    // 获取服务器时间
    this.getCurrentTime();
    // 获取伙食供应标准
    // this.getFoodStandardInfo();
    // 开启倒计时
    currentPage().countTimer();
  },
  methods: {
    // 切换菜单
    switchPage(index) {
      this.currentPage = index;
      switch (index) {
        case 1:
          // 获取普通餐菜谱列表
          this.getWeekMenuList(1);
          break;
        case 2:
          // 获取病号餐菜谱列表
          this.getWeekMenuList(2);
          break;
        case 3:
          // 获取回族餐菜谱列表
          this.getWeekMenuList(3);
          break;
      }
    },
    // 获取服务器时间
    async getCurrentTime() {
      let params = {
        data: {
          type: 1,
          startDate: this.startDate,
          endDate: this.endDate,
        },
      };
      let res = await Api.apiCall("post", Api.index.getWeekMenuInfo, params);
      if (res.state.code == 200) {
        this.nowTimestamp = res.date || new Date().getTime();
        // 获取一周日期
        this.getTableColumns();
      }
    },
    // 获取一周日期
    getTableColumns() {
      this.weekDateColumns = [];
      let weekDateList = [];
      let weeks = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
      for (let i = 0; i < 7; i++) {
        let date = new Date(this.nowTimestamp);
        let index = date.getDay() ? date.getDay() - 1 : 6;
        let nowDate = date.setDate(date.getDate() - index + i);
        let formatDate = dateFormat("MM-DD", new Date(nowDate));
        let dateRes = dateFormat("YYYY-MM-DD", new Date(nowDate));
        let week = weeks[i];
        let weekDate = `${formatDate}(${week})`;
        this.weekDateColumns.push(weekDate);
        weekDateList.push(dateRes);
      }
      this.startDate = weekDateList[0];
      this.endDate = weekDateList[6];
      this.weekDateColumns.unshift("");
      // 获取普通餐菜谱列表
      this.getWeekMenuList(1);
    },
    // 获取一周菜谱信息
    async getWeekMenuList(type) {
      let params = {
        data: {
          type,
          startDate: this.startDate,
          endDate: this.endDate,
        },
      };
      let res = await Api.apiCall("post", Api.index.getWeekMenuInfo, params);
      if (res.state.code == 200) {
        switch (type) {
          case 1:
            this.morningMenuList1 = res.data.morning;
            this.noonMenuList1 = res.data.noon;
            this.nightMenuList1 = res.data.night;
            break;
          case 2:
            this.morningMenuList2 = res.data.morning;
            this.noonMenuList2 = res.data.noon;
            this.nightMenuList2 = res.data.night;
            break;
          case 3:
            this.morningMenuList3 = res.data.morning;
            this.noonMenuList3 = res.data.noon;
            this.nightMenuList3 = res.data.night;
            break;
        }
      }
    },
    // 获取伙食供应标准信息
    async getFoodStandardInfo() {
      let res = await Api.apiCall("get", Api.index.getFoodStandardInfo, null);
      if (res.state.code == 200) {
        this.foodTableList = res.data;
        this.foodTableList.map((item) => {
          this.totalS = formatFloat(this.totalS + item.monthMoneyS, 2);
          this.totalE = formatFloat(this.totalE + item.monthMoneyE, 2);
        });
      }
    },
  },
};
</script>

<style lang="less">
@import "../../../common/less/index.less";
</style>
