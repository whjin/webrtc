<template>
  <div class="illness-container">
    <div class="illness-wrapper">
      <div class="illness-content">
        <div class="illness-title">
          <text>预约就医</text>
        </div>
        <div class="illness-box">
          <div class="illness-menu-list">
            <div
              class="illness-menu-item"
              :class="currentPage == 1 ? 'illness-menu-active' : ''"
              @click="switchPage(1)"
            >
              <common-icons iconType="iconyuyuejiuyi" size="38" color="#fff" />
              <text>预约就医</text>
            </div>
            <div
              class="illness-menu-item"
              :class="currentPage == 2 ? 'illness-menu-active' : ''"
              @click="switchPage(2)"
            >
              <common-icons iconType="iconrecord" size="46" color="#fff" />
              <text>预约记录</text>
            </div>
          </div>
          <div class="illness-vertical-divider"></div>
          <div v-if="currentPage == 1" class="illness-reserve-container">
            <scroll-view scroll-y="true" class="illness-reserve-scroll">
              <div
                class="illness-symptom"
                v-for="(list, index) in symptomList"
                :key="index"
              >
                <div class="title">{{ list.name }}</div>
                <div class="illness-symptom-list">
                  <div
                    class="symptom-item mood-img"
                    :class="{
                      'mood-select-img':
                        item.value == commonSymptom ||
                        item.value == emergencyDisease ||
                        item.value == otherSymptom,
                    }"
                    v-for="(item, index) in list.data"
                    :key="index"
                    @click="selectSymptom(item, list.typeCode)"
                  >
                    <text>{{ item.name }}</text>
                  </div>
                </div>
              </div>
              <div class="illness-symptom">
                <div class="title">体温： {{ foreheadTemperature }}℃</div>
                <div class="illness-bottom">
                  <div class="illness-tips">
                    （温馨提示：请将手掌移至屏幕正上方测温仪进行测温）
                  </div>
                  <div class="btn-submit" @click="reMeasureTemperature">
                    重测
                  </div>
                </div>
              </div>
              <div class="illness-symptom">
                <div class="title">
                  开始时间：
                  <e-picker
                    mode="date"
                    class="picker-img"
                    @change="selectSymptomTime"
                  >
                    <div class="illness-date">{{ symptomTime }}</div>
                  </e-picker>
                </div>
              </div>
              <div class="illness-symptom">
                <div class="title">备注：</div>
                <div class="illness-bottom">
                  <div class="illness-remark">
                    <textarea
                      v-model="remark"
                      maxlength="-1"
                      @input="handleInputChange"
                    ></textarea>
                  </div>
                  <div class="btn-submit" @click="reserveSubmit">提交</div>
                </div>
              </div>
            </scroll-view>
          </div>
          <div v-if="currentPage == 2" class="illness-record-container">
            <div class="record-form-box">
              <div class="record-select">
                <label>上报时间：</label>
                <e-picker
                  mode="date"
                  class="picker-img"
                  :showValue="startDate"
                  @change="selectStartDate"
                >
                  <div class="illness-date">{{ startDate }}</div>
                </e-picker>
                <div class="divider-line">-</div>
                <e-picker
                  mode="date"
                  class="picker-img"
                  :showValue="endDate"
                  @change="selectEndDate"
                >
                  <div class="illness-date">{{ endDate }}</div>
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
                  v-for="(item, index) in illnessColumns"
                  :key="index"
                  :style="{ flex: item.flex }"
                >
                  {{ item.title }}
                </div>
              </div>
              <scroll-view
                scroll-y="true"
                class="record-table-scroll"
                @scrolltolower="scrollToLower"
              >
                <div
                  class="table-content"
                  v-for="(item, index) in recordList"
                  :key="index"
                >
                  <div class="record-table-item" style="flex: 1">
                    {{ item.date | dateFormatFilter }}
                  </div>
                  <div class="record-table-item" style="flex: 1">
                    {{ item.name }}
                  </div>
                  <div class="record-table-item" style="flex: 1">
                    {{ item.status }}
                  </div>
                  <div class="record-table-item" style="flex: 1">
                    <div
                      class="btn-query"
                      :class="{
                        disabled: !(
                          nowTimestamp > item.date + 3600000 &&
                          item.statusCode == 1
                        ),
                      }"
                      @click="handleIllnessUrge(item)"
                    >
                      催办
                    </div>
                  </div>
                </div>
              </scroll-view>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="neil-modal-container">
      <neil-modal :show="showIllnessInit" @close="closeModal('IllnessInit')">
        <div class="illness-modal-box">
          <view class="modal-header">
            <view class="modal-title">温馨提示</view>
            <div class="modal-close" @click="closeModal('IllnessInit')">
              <image src="/static/images/common/close.png"></image>
            </div>
          </view>
          <view class="modal-horizontal-divider"></view>
          <div class="illness-modal-content">
            <div v-if="showSuccess" class="modal-talkInit">
              <common-icons iconType="iconsuccess" size="100" color="#fff" />
              <text class="illness-tip">预约成功</text>
            </div>
            <div v-if="!showSuccess" class="modal-talkInit">
              <common-icons iconType="iconfail" size="100" color="#fff" />
              <text class="illness-tip">{{ failInfo }}</text>
            </div>
          </div>
        </div>
      </neil-modal>
    </div>
  </div>
</template>

<script>
import neilModal from "@/components/neil-modal/neil-modal.vue";
import { dateFormat, uniqueArr } from "@/common/utils/util.js";
import Api from "@/common/api.js";
import { mapState } from "vuex";
import ePicker from "@/components/e-picker/e-picker.vue";
import illnessColumns from "@/static/mock/illnessColumns.json";

export default {
  components: {
    neilModal,
    ePicker,
  },
  data() {
    return {
      currentPage: 1,
      // 备注
      remark: "",
      // 症状列表
      symptomList: [],
      // 常见症状
      commonSymptom: "",
      // 紧急疾病
      emergencyDisease: "",
      // 其他症状
      otherSymptom: "",
      // 症状类型
      typeCode: "",
      // 预约开始时间
      startDate: "",
      // 预约结束时间
      endDate: "",
      // 预约记录表头
      illnessColumns: illnessColumns,
      // 预约记录列表
      recordList: [],
      // 预约就医弹框
      showIllnessInit: false,
      // 预约成功弹框
      showSuccess: true,
      // 提交失败提示
      failInfo: "",
      // 页面索引
      pageIndex: 1,
      // 页面总数
      totalPage: 1,
      foreheadTemperature: 0, // 额头温度
      foreheadTemperatureList: [], // 测温数组
      lowTemperature: uni.getStorageSync("lowTemperature"), // 最低温度
      nowTimestamp: new Date().getTime(),
      // 禁止重复操作
      isRepeatState: false,
      symptomTime: "",
      symptomContinuedTime: 1,
    };
  },
  computed: {
    ...mapState({
      // 登录人员信息
      personInfo: (state) => state.app.personInfo,
    }),
  },
  filters: {
    dateFormatFilter(val) {
      if (!val) return "-";
      return dateFormat("YYYY-MM-DD", new Date(val));
    },
  },
  mounted() {
    // 开启倒计时
    this.$parent.countTimer();
    this.$parent.voiceBroadcast("请将手掌移至屏幕正上方测温仪进行测温");
    // 预约就医类型
    this.getIllnessTypeInfo();
  },
  destroyed() {
    // 停止测温
    this.$parent.closeThermometryModule();
  },
  methods: {
    // 菜单切换
    switchPage(index) {
      this.currentPage = index;
      this.pageIndex = 1;
      this.recordList = [];
      if (index == 2) {
        this.endDate = dateFormat("YYYY-MM-DD", new Date(this.nowTimestamp));
        let date = new Date(this.endDate);
        let lastMonthDate = date.setMonth(date.getMonth() - 1);
        this.startDate = dateFormat("YYYY-MM-DD", new Date(lastMonthDate));
        this.getIllnessRecordInfo(this.pageIndex);
        this.$parent.closeThermometryModule();
      }
    },
    // 预约就医类型
    async getIllnessTypeInfo() {
      this.$parent.openThermometryModule();
      let res = await Api.apiCall("get", Api.index.getIllnessTypeInfo, null);
      if (res.state.code == 200) {
        this.nowTimestamp = res.date || new Date().getTime();
        this.symptomTime = dateFormat(
          "YYYY-MM-DD",
          new Date(res.date || Date.now())
        );
        this.symptomList = res.data;
      }
    },
    // 选择常见症状
    selectSymptom(item, typeCode) {
      switch (typeCode) {
        case "SYS_COMMON_SYMPTOM":
          this.commonSymptom = item.value;
          break;
        case "SYS_URGENT_DISEASE":
          this.emergencyDisease = item.value;
          break;
        case "SYS_OTHER_SYMPTOM":
          this.otherSymptom = item.value;
          break;
      }
    },
    // 提交预约就医
    reserveSubmit() {
      if (
        this.commonSymptom == "" &&
        this.emergencyDisease == "" &&
        this.otherSymptom == ""
      ) {
        this.$parent.handleShowToast("请选择就医类型", "center");
        return;
      }
      if (this.foreheadTemperature < this.lowTemperature) {
        this.$parent.handleShowToast("请先进行测温", "center");
        return;
      }
      let params = {
        rybh: this.personInfo.rybh,
        commonSymptom: this.commonSymptom,
        emergencyDisease: this.emergencyDisease,
        otherSymptom: this.otherSymptom,
        selfCondition: this.remark,
        temperature: this.foreheadTemperature,
        symptomTime: this.symptomTime,
        symptomContinuedTime: this.symptomContinuedTime,
      };
      this.saveIllnessInfo(params);
    },
    // 提交预约就医
    async saveIllnessInfo(params) {
      let res = await Api.apiCall("post", Api.index.saveIllnessInfo, params);
      this.showIllnessInit = true;
      if (res.state.code == 200) {
        this.showSuccess = true;
      } else {
        this.failInfo = res.state.msg;
        this.showSuccess = false;
      }
    },
    // 重测
    reMeasureTemperature() {
      this.$parent.openThermometryModule();
    },
    // 催办
    async handleIllnessUrge(item) {
      if (!this.isRepeatState) {
        this.isRepeatState = true;
        setTimeout(() => {
          this.isRepeatState = false;
        }, 1500);
        let params = {
          data: {
            id: item.id,
          },
        };
        let res = await Api.apiCall("post", Api.index.illnessUrge, params);
        if (res.state.code == 200) {
          this.$parent.handleShowToast("催办成功", "center");
        }
      }
    },
    // 选择症状开始时间
    selectSymptomTime(e) {
      this.symptomTime = e;
      const day1 = new Date(this.symptomTime);
      const day2 = new Date(this.nowTimestamp);
      this.symptomContinuedTime =
        Math.floor((day2 - day1) / (1000 * 60 * 60 * 24)) + 1;
    },
    // 选择预约开始时间
    selectStartDate(e) {
      this.startDate = e;
    },
    // 选择预约结束时间
    selectEndDate(e) {
      this.endDate = e;
    },
    // 监听键盘事件
    handleInputChange(e) {
      this.$parent.initCountTimeout();
    },
    // 查询预约记录
    handleRecordQuery() {
      let selectDateList = [this.startDate, this.endDate];
      if (selectDateList.includes("")) {
        this.$parent.handleShowToast("请选择上报时间", "center");
        return;
      }
      this.pageIndex = 1;
      this.recordList = [];
      this.getIllnessRecordInfo(this.pageIndex);
    },
    // 查询预约记录
    async getIllnessRecordInfo(index) {
      let params = {
        data: {
          rybh: this.personInfo.rybh,
          startDate: this.startDate,
          endDate: this.endDate,
        },
        pageParam: {
          pageIndex: index,
          pageSize: 8,
        },
      };
      let res = await Api.apiCall(
        "post",
        Api.index.getIllnessRecordInfo,
        params
      );
      if (res.state.code == 200) {
        this.totalPage = res.page.totalPage;
        this.recordList = uniqueArr(this.recordList.concat(res.data), "id");
        if (!res.data.length) {
          this.$parent.handleShowToast("暂无数据", "center");
        }
      }
    },
    // 下拉刷新
    scrollToLower(e) {
      if (this.pageIndex < this.totalPage) {
        this.pageIndex++;
        this.getIllnessRecordInfo(this.pageIndex);
      }
    },
    setTemperature(tem) {
      this.foreheadTemperature = tem;
      // 当温度大于最低有效值，进行记录
      if (tem > this.lowTemperature) {
        this.foreheadTemperatureList.push(tem);
      }
      // 当存在两个有效值，关闭实时测温，取第二个做完当前体温
      let len = this.foreheadTemperatureList.length;
      if (len == 2) {
        this.$parent.closeThermometryModule();
        this.foreheadTemperature = this.foreheadTemperatureList[len - 1];
      }
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
