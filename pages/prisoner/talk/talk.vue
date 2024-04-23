<template>
  <div class="talk-container">
    <div class="talk-wrapper">
      <div class="talk-content">
        <div class="talk-title">
          <text>预约申请</text>
        </div>
        <div class="talk-box">
          <div class="talk-menu-list">
            <div
              class="talk-menu-item"
              :class="currentPage == 1 ? 'talk-menu-active' : ''"
              @click="switchPage(1)"
            >
              <common-icons iconType="icondispose" size="38" color="#fff" />
              <text>预约登记</text>
            </div>
            <div
              class="talk-menu-item"
              :class="currentPage == 2 ? 'talk-menu-active' : ''"
              @click="switchPage(2)"
            >
              <common-icons iconType="iconrecord" size="46" color="#fff" />
              <text>预约记录</text>
            </div>
          </div>
          <div class="talk-vertical-divider"></div>
          <div v-if="currentPage == 1" class="talk-register-container">
            <div class="register-select register-item">
              <label>在押人员：</label>
              <div class="register-person">
                <text>{{ personInfo.name }}</text>
              </div>
            </div>
            <div class="register-select register-item">
              <label>预约时间：</label>
              <div class="talk-date">{{ regDate }}</div>
            </div>
            <div class="register-select">
              <label>最近外出类型：</label>
              <div class="register-person">{{ outTypeInfo.name || "无" }}</div>
            </div>
            <div class="register-select register-item">
              <label>预约类型：</label>
              <xfl-select
                :list="appointmentTypeList"
                :clearable="false"
                :placeholder="'请选择预约类型'"
                @change="selectAppointmentType"
              ></xfl-select>
            </div>
            <div class="register-mood register-item">
              <label>今日心情：</label>
              <div
                class="today-mood"
                v-for="(item, index) in todayMoodList"
                :key="index"
              >
                <div class="today-mood-item">
                  <div
                    class="mood-image mood-img"
                    :class="{ 'mood-select-img': item.code == moodCode }"
                    @click="selectTodayMood(item)"
                  >
                    <image :src="moodImgList[index]"></image>
                  </div>
                  <text>{{ item.value }}</text>
                </div>
              </div>
            </div>
            <div class="register-button">
              <div class="btn-submit" @click="handleRegSubmit">预约登记</div>
            </div>
          </div>
          <div v-if="currentPage == 2" class="talk-record-container">
            <div class="record-form-box">
              <div class="record-select">
                <label>预约时间：</label>
                <e-picker
                  mode="date"
                  class="picker-img"
                  :showValue="startDate"
                  @change="selectStartDate"
                >
                  <div class="talk-date">{{ startDate }}</div>
                </e-picker>
                <div class="divider-line">-</div>
                <e-picker
                  mode="date"
                  class="picker-img"
                  :showValue="endDate"
                  @change="selectEndDate"
                >
                  <div class="talk-date">{{ endDate }}</div>
                </e-picker>
              </div>
              <div class="record-button">
                <div class="btn-query" @click="handleRecordQuery">查询</div>
              </div>
            </div>
            <div class="record-table-box">
              <div class="table-head">
                <div
                  class="table-head-item"
                  v-for="(item, index) in talkColumns"
                  :key="index"
                  :style="{ flex: item.flex }"
                >
                  {{ item.title }}
                </div>
              </div>
              <scroll-view
                scroll-y="true"
                class="record-table-scroll"
                @scrolltolower="handleRecorListScrolltolower"
              >
                <div
                  class="table-content"
                  v-for="(item, index) in talkRecordList"
                  :key="index"
                >
                  <div class="record-table-item" style="flex: 1">
                    {{ item.name }}
                  </div>
                  <div class="record-table-item" style="flex: 2">
                    {{ item.outType }}
                  </div>
                  <div class="record-table-item" style="flex: 2">
                    {{ item.appointmentTime }}
                  </div>
                  <div class="record-table-item" style="flex: 2">
                    {{ item.appointment }}
                  </div>
                  <div class="record-table-item" style="flex: 1">
                    {{ item.mood }}
                  </div>
                  <div class="record-table-item" style="flex: 2">
                    {{ item.acceptanceTime }}
                  </div>
                  <div class="record-table-item" style="flex: 2">
                    {{ item.talkTime }}
                  </div>
                  <div
                    class="record-table-item"
                    style="flex: 1"
                    :class="{
                      'verify-status': item.statusCode == '01',
                      'success-status': item.statusCode == '02',
                      'refuse-status': item.statusCode == '03',
                    }"
                  >
                    {{ item.status }}
                  </div>
                </div>
              </scroll-view>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="neil-modal-container">
      <neil-modal :show="showTalkInit" @close="closeModal('TalkInit')">
        <div class="talk-modal-box">
          <div class="modal-header">
            <div class="modal-title">温馨提示</div>
            <div class="modal-close" @click="closeModal('TalkInit')">
              <image src="/static/images/common/close.png"></image>
            </div>
          </div>
          <div class="modal-horizontal-divider"></div>
          <div class="talk-modal-content">
            <div v-if="showSuccess" class="modal-talkInit">
              <common-icons iconType="iconsuccess" size="100" color="#fff" />
              <text class="talk-tip">预约成功</text>
            </div>
            <div v-if="!showSuccess" class="modal-talkInit">
              <common-icons iconType="iconfail" size="100" color="#fff" />
              <text class="talk-tip">预约失败，请重新预约</text>
            </div>
          </div>
        </div>
      </neil-modal>
    </div>
  </div>
</template>

<script>
import neilModal from "@/components/neil-modal/neil-modal.vue";
import ePicker from "@/components/e-picker/e-picker.vue";
import xflSelect from "@/components/xfl-select/xfl-select.vue";
import { dateFormat } from "@/common/utils/util.js";
import Api from "@/common/api";
import { mapState } from "vuex";
import moodImgList from "@/static/mock/moodImgList.json";
import prisonerTalkColumns from "@/static/mock/prisonerTalkColumns.json";

export default {
  components: {
    neilModal,
    ePicker,
    xflSelect,
  },
  data() {
    return {
      currentPage: 1,
      // 预约时间
      regDate: dateFormat("YYYY-MM-DD", new Date()),
      // 外出类型列表
      outTypeList: [],
      // 预约类型列表
      appointmentTypeList: [],
      // 今日心情列表
      todayMoodList: [],
      // 心情图片列表
      moodImgList: moodImgList,
      // 外出类型
      outTypeInfo: {},
      // 预约类型
      appointmentType: "",
      // 今日心情ID
      moodCode: "",
      // 预约开始时间
      startDate: "",
      // 预约结束时间
      endDate: "",
      // 预约记录表头
      talkColumns: prisonerTalkColumns,
      // 预约记录列表
      talkRecordList: [],
      // 谈话预约弹框
      showTalkInit: false,
      // 预约成功弹框
      showSuccess: true,
      // 预约记录分页参数
      talkRecordPageParam: {
        pageIndex: 1,
        pageSize: 10,
      },
      // 预约记录列表总数
      talkRecordTotal: 999,
    };
  },
  computed: {
    ...mapState({
      // 登录人员信息
      personInfo: (state) => state.app.personInfo,
    }),
  },
  created() {
    // 获取最近外出类型
    this.getRecentOutType();
    // 获取预约类型
    this.getAppointmentTypeInfo();
    // 获取今日心情
    this.getTodayMoodInfo();
    // 开启倒计时
    this.$parent.countTimer();
  },
  methods: {
    // 菜单切换
    switchPage(index) {
      this.currentPage = index;
      if (index == 2) {
        this.outType = "";
        this.appointmentType = "";
        this.talkRecordList = [];
        this.setTalkRecordPageParam(1, 10);
        this.endDate = dateFormat("YYYY-MM-DD", new Date());
        let date = new Date(this.endDate);
        let lastMonthDate = date.setMonth(date.getMonth() - 1);
        this.startDate = dateFormat("YYYY-MM-DD", new Date(lastMonthDate));
        this.getTalkRecordInfo();
      }
    },
    // 获取最近外出类型
    async getRecentOutType() {
      let res = await Api.apiCall(
        "get",
        Api.index.getRecentOutType + this.personInfo.rybh,
        null
      );
      if (res.state.code == 200) {
        this.outTypeInfo = res.data || {};
        this.regDate = res.date
          ? dateFormat("YYYY-MM-DD", new Date(res.date))
          : dateFormat("YYYY-MM-DD", new Date());
      }
    },
    // 获取预约类型
    async getAppointmentTypeInfo() {
      let res = await Api.apiCall(
        "get",
        Api.index.getAppointmentTypeInfo,
        null
      );
      if (res.state.code == 200) {
        this.appointmentTypeList = (res.data && res.data.data) || [];
      }
    },
    // 获取今日心情信息
    async getTodayMoodInfo() {
      let res = await Api.apiCall("get", Api.index.getTodayMoodInfo, null);
      if (res.state.code == 200) {
        this.todayMoodList = (res.data && res.data.data) || [];
      }
    },
    // 选择预约类型
    selectAppointmentType(e) {
      this.appointmentType = e.originItem.code;
    },
    // 选择今日心情
    selectTodayMood(item) {
      this.moodCode = item.code;
    },
    // 提交谈话预约
    handleRegSubmit() {
      let talkRegList = [this.regDate, this.moodCode, this.appointmentType];
      if (talkRegList.includes("")) {
        this.$parent.handleShowToast("选择内容不完整", "center");
        return;
      }
      let params = {
        rybh: this.personInfo.rybh,
        appointmentTime: this.regDate,
        outType: this.outTypeInfo.code,
        todayMood: this.moodCode,
        appointmentType: this.appointmentType,
      };
      this.saveTalkInfo(params);
    },
    // 提交谈话预约
    async saveTalkInfo(params) {
      let res = await Api.apiCall("post", Api.index.saveTalkInfo, params);
      if (res.state.code == 200) {
        this.showSuccess = true;
      } else {
        this.showSuccess = false;
      }
      this.showTalkInit = true;
    },
    // 选择预约开始时间
    selectStartDate(e) {
      this.startDate = e;
    },
    // 选择预约结束时间
    selectEndDate(e) {
      this.endDate = e;
    },
    // 查询预约记录
    handleRecordQuery() {
      let selectDateList = [this.startDate, this.endDate];
      if (selectDateList.includes("")) {
        this.$parent.handleShowToast("请选择预约时间", "center");
        return;
      }
      this.setTalkRecordPageParam(1, 10);
      this.getTalkRecordInfo();
    },
    // 滑动到底部触发加载
    handleRecorListScrolltolower() {
      // 已获取所有数据
      if (this.talkRecordList.length >= this.talkRecordTotal) {
        return this.$parent.handleShowToast("暂无更多数据", "center");
      }
      this.talkRecordPageParam.pageIndex += 1;
      this.getTalkRecordInfo();
    },
    // 获取谈话记录信息
    async getTalkRecordInfo() {
      let params = {
        data: {
          rybh: this.personInfo.rybh,
          startDate: this.startDate,
          endDate: this.endDate,
        },
        pageParam: this.talkRecordPageParam,
      };
      let res = await Api.apiCall("post", Api.index.getTalkRecordInfo, params);
      if (res.state.code == 200) {
        if (this.talkRecordPageParam.pageIndex == 1 && !res.data.length) {
          this.$parent.handleShowToast("暂无数据", "center");
        }
        if (this.talkRecordPageParam.pageIndex == 1) {
          this.talkRecordList = res.data;
        } else {
          this.talkRecordList = this.talkRecordList.concat(res.data);
        }
        this.talkRecordTotal = (res.page && res.page.total) || 0;
      }
    },
    // 设置预约记录列表分页参数
    setTalkRecordPageParam(pageIndex, pageSize) {
      this.talkRecordPageParam = {
        pageIndex,
        pageSize,
      };
    },
    openModal(type) {
      this[`show${type}`] = true;
    },
    closeModal(type) {
      this[`show${type}`] = false;
    },
  },
};
</script>

<style lang="less">
@import "../../../common/less/index.less";
</style>
