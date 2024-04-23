<template>
  <view class="out-room-register main-area">
    <view class="uni-flex page-title">
      <text>进出监室登记</text>
    </view>
    <view class="uni-flex uni-flex-item" style="height: 85%">
      <!-- 页面Tab -->
      <view class="uni-flex uni-column page-menu-area">
        <view
          v-for="tab in tabConfig"
          :key="tab.key"
          class="uni-flex uni-column page-menu"
          :class="{ 'page-menu-activate': currentPage == tab.page }"
          @click="switchPage(tab.page)"
        >
          <image
            :src="`/static/images/room/${tab.key}.png`"
            style="width: 35.41upx; height: 42.36upx; margin-top: 9.72upx"
          ></image>
          <text style="line-height: 20.83upx; margin-top: 13.19upx">{{
            tab.title
          }}</text>
        </view>
      </view>
      <!-- 进出监室记录 -->
      <view v-if="currentPage == 3" class="out-room-record uni-flex-item">
        <view class="search-param-toolbar">
          <view class="param-list">
            <view
              v-for="params in searchParamConfig"
              :key="params.param"
              class="param-item"
            >
              <text class="param-title">{{ params.title }}：</text>
              <!-- 在押人员 -->
              <input
                v-if="params.param == 'name'"
                type="text"
                class="param-name"
                :placeholder="params.placeholder"
                @input="handlePrisonerNameInput"
              />
              <!-- 时间选择器 外出 -->
              <e-picker
                v-else-if="params.param == 'outTime'"
                mode="dateTime"
                @change="pickeOutTime"
              >
                <div class="value had-border date">
                  {{ searchParams.data[params.param] }}
                </div>
              </e-picker>
              <!-- 时间选择器 返回 -->
              <e-picker
                v-else-if="params.param == 'backTime'"
                mode="dateTime"
                @change="pickeBackTime"
              >
                <div class="value had-border date">
                  {{ searchParams.data[params.param] }}
                </div>
              </e-picker>
              <!-- 下拉选择 外出原因 -->
              <xfl-select
                v-else-if="params.param == 'outType'"
                :list="searchParamList[params.list]"
                :clearable="false"
                :placeholder="params.placeholder"
                @change="selectOutType"
              ></xfl-select>
              <!-- 下拉选择 负责民警 -->
              <xfl-select
                v-else
                :list="searchParamList[params.list]"
                :clearable="false"
                :placeholder="params.placeholder"
                @change="selectDutyPolice"
              ></xfl-select>
            </view>
          </view>
          <view class="search-btn-box">
            <view class="search-btn" @touchstart.stop="handleSearchRecord"
              >查询</view
            >
          </view>
        </view>
        <view class="record-list">
          <view class="uni-flex">
            <view
              v-for="item in recordListTitleConfig"
              :key="item.code"
              class="uni-flex-item table-th"
              :class="{ 'table-th-radius-tl': item.code == 'index' }"
              :style="
                item.code == 'outTime' || item.code == 'backTime'
                  ? 'flex: 2;'
                  : ''
              "
              >{{ item.title }}</view
            >
          </view>
          <view class="uni-flex table-td-divider" v-if="!recordList.length">
            <view class="uni-flex-item table-td" style="text-align: center"
              >暂无记录</view
            >
          </view>
          <scroll-view
            v-else
            scroll-y="true"
            style="height: 378upx; width: 100%"
            @scrolltolower="handleSearchDataToLower"
          >
            <view
              v-for="(record, index) in recordList"
              :key="record.id"
              class="uni-flex table-td-divider"
            >
              <view
                v-for="item in recordListTitleConfig"
                :key="item.code"
                class="uni-flex-item table-td"
                :style="
                  item.code == 'outTime' || item.code == 'backTime'
                    ? 'flex: 2;'
                    : ''
                "
              >
                {{ record[item.code] | dateFormatFilter(item.code, index) }}
              </view>
            </view>
          </scroll-view>
        </view>
      </view>
      <!-- 人员列表 -->
      <view v-else class="person-list-warrper uni-flex-item">
        <view class="uni-flex overall-situation">
          <view class="uni-flex room-person-info">
            <text class="room-name">
              {{ roomName }}
            </text>
            <text class="total-person-num">
              总人数：{{ prisonerList.length }}人
            </text>
            <text class="out-person-num">
              外出人数：{{ outPrisonerList.length }}人
            </text>
          </view>
          <text class="duty-police"> 负责民警：{{ personInfo.name }} </text>
        </view>
        <scroll-view scroll-y>
          <view class="person-list">
            <view
              v-for="item in displayedPersonList"
              :key="item.rybh"
              class="person-list-item uni-flex uni-column inner-glow-box"
            >
              <!-- 头像 -->
              <view class="img-warrper">
                <image class="img" :src="item.imgUrl"></image>
              </view>
              <!-- 个人信息 -->
              <view class="person-info">
                <view class="name text-scroll-warrper">
                  <text class="val">姓名：</text>
                  <scroll-view scroll-x class="text-scroll">{{
                    item.name
                  }}</scroll-view>
                </view>
                <view class="serial-num text-scroll-warrper">
                  <text class="val">编号：</text>
                  <scroll-view scroll-x class="text-scroll">{{
                    item.dabh
                  }}</scroll-view>
                </view>
              </view>
              <!-- 操作按钮 带出/带回 -->
              <text
                class="operate-btn"
                :class="{
                  'red-btn': currentPage == 1,
                  'take-btn': currentPage == 1 && item.waitForTakeState,
                  'blue-btn': currentPage == 2,
                  'process-btn': currentPage == 2 && item.processState,
                }"
                @click="handleOperate(item)"
              >
                {{
                  currentPage == 1
                    ? item.waitForTakeState
                      ? `待${item.waitForTakeType}`
                      : "带出"
                    : item.processState
                    ? `${item.waitForTakeType}带回`
                    : "带回"
                }}
              </text>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
    <recognition-dialogs
      ref="recognitionDialogs"
      useFor="outroom"
      isConfirm
      confirmText="人工核对无误"
      :regConfig="regConfig"
      :isShow="showRecognitionDialogs"
      @faceRecognitionSuccess="faceRecognitionSuccess"
      @fingerRecognitionSuccess="fingerRecognitionSuccess"
      @close="recognitionDialogsClose"
      @confirm="confirmHandler"
    ></recognition-dialogs>
    <neil-modal
      :show="showComfirmDialog"
      :autoClose="true"
      @close="closeComfirmDialog"
    >
      <view class="modal-header">
        <view class="modal-title"
          >{{ currentPage == 1 ? "外出" : "返回" }}监室</view
        >
        <div class="modal-close" @touchstart.stop="closeComfirmDialog">
          <image src="/static/images/common/close.png"></image>
        </div>
      </view>
      <view class="page-horizontal-divider" style="margin-bottom: 28upx"></view>
      <view class="comfirm-dialog-content">
        <view v-if="currentPage == 1" class="out-type-select param-item">
          <text class="out-type-title">外出原因：</text>
          <xfl-select
            ref="outTypeRef"
            :list="searchParamList.outTypeList"
            :class="{ 'disabled-select': !!selectedPrisoner.waitForTake }"
            :clearable="false"
            placeholder="请选择外出原因"
            @change="selectConfirmOutType"
          ></xfl-select>
        </view>
        <!-- 头像 -->
        <view class="selected-prisoner-img-box inner-glow-box">
          <view class="img-warrper">
            <image class="img" :src="selectedPrisoner.imgUrl"></image>
          </view>
        </view>
        <!-- 人员信息 -->
        <view class="selected-prisoner-info">
          <view class="info-name text-scroll-warrper">
            <text class="val">姓名：</text>
            <scroll-view scroll-x class="text-scroll">{{
              selectedPrisoner.name
            }}</scroll-view>
          </view>
          <view class="info-dabh text-scroll-warrper">
            <text class="val">编号：</text>
            <scroll-view scroll-x class="text-scroll">{{
              selectedPrisoner.dabh
            }}</scroll-view>
          </view>
          <view class="info-user-name text-scroll-warrper">
            <text class="val">负责民警：</text>
            <scroll-view scroll-x class="text-scroll">{{
              personInfo.name
            }}</scroll-view>
          </view>
          <view
            v-if="currentPage == 2"
            class="info-out-type text-scroll-warrper"
          >
            <text class="val">外出原因：</text>
            <scroll-view scroll-x class="text-scroll">{{
              selectedPrisoner.outType
            }}</scroll-view>
          </view>
        </view>
        <!-- 操作按钮 带出/带回 -->
        <text
          class="operate-btn"
          :class="{
            'red-btn': currentPage == 1,
            'blue-btn': currentPage == 2,
          }"
          @touchstart.stop="submit"
        >
          {{ currentPage == 1 ? "带出" : "带回" }}
        </text>
      </view>
    </neil-modal>
    <!-- 带回提示弹框 -->
    <neil-modal :show="showTakeBackTips">
      <div class="takeback-modal-container">
        <div class="modal-header">
          <div class="modal-title">温馨提示</div>
          <div class="modal-close" @click="closeModal('TakeBackTips')">
            <image src="/static/images/common/close.png"></image>
          </div>
        </div>
        <div class="page-horizontal-divider"></div>
        <div class="takeback-modal-box">
          <common-icons
            iconType="iconfail"
            size="100"
            color="#fff"
          ></common-icons>
          <text class="takeback-content">{{ takeBackTips }}</text>
        </div>
      </div>
    </neil-modal>
  </view>
</template>

<script>
import Api from "@/common/api.js";
import { mapState } from "vuex";
import ePicker from "@/components/e-picker/e-picker.vue";
import xflSelect from "@/components/xfl-select/xfl-select.vue";
import { dateFormat } from "@/common/utils/util.js";

export default {
  name: "outRoomRegister",
  component: {
    ePicker,
    xflSelect,
  },
  data() {
    return {
      // 认证弹框
      showRecognitionDialogs: false,
      regConfig: {
        regName: "",
        rybh: "",
      },
      // 当前页面
      currentPage: 1,
      // 弹框
      showComfirmDialog: false,
      // 带回提示弹框
      showTakeBackTips: false,
      // 带回提示信息
      takeBackTips: "",
      // 带出 带回 被选中的人员
      selectedPrisoner: {},
      // 外出原因
      takeOutType: "",
      // 页面tab配置
      tabConfig: [
        {
          title: "外出监室\n登记",
          page: 1,
          key: "out",
        },
        {
          title: "返回监室\n登记",
          page: 2,
          key: "in",
        },
        {
          title: "进出监室\n记录",
          page: 3,
          key: "record",
        },
      ],
      // 查询参数配置
      searchParamConfig: [
        {
          title: "在押人员",
          param: "name",
          placeholder: "请输入在押人员",
        },
        {
          title: "外出原因",
          param: "outType",
          placeholder: "请选择外出原因",
          list: "outTypeList",
        },
        {
          title: "外出时间",
          param: "outTime",
        },
        {
          title: "返回时间",
          param: "backTime",
        },
        {
          title: "带出民警",
          param: "takeOutPolice",
          placeholder: "请选择负责民警",
          list: "policeList",
        },
      ],
      // 外出原因/负责民警 可选列表
      searchParamList: {
        // 外出类型
        outTypeList: [],
        // 管教民警
        policeList: [],
      },
      // 在押人员列表
      prisonerList: [],
      // 记录列表头部标题
      recordListTitleConfig: [
        {
          title: "序号",
          code: "index",
        },
        {
          title: "在押人员",
          code: "name",
        },
        {
          title: "编号",
          code: "dabh",
        },
        {
          title: "外出原因",
          code: "outType",
        },
        {
          title: "外出时间",
          code: "outTime",
        },
        {
          title: "带出民警",
          code: "takeOutPolice",
        },
        {
          title: "返回时间",
          code: "backTime",
        },
        {
          title: "带回民警",
          code: "takeBackPolice",
        },
      ],
      // 记录列表
      recordList: [],
      // 记录列表总数
      recordTotal: 0,
      // 监室号
      roomNo: uni.getStorageSync("terminalInfo").roomNo,
      // 监室ID
      roomId: uni.getStorageSync("terminalInfo").roomId,
      // 监室名称
      roomName: uni.getStorageSync("terminalInfo").roomName,
      // 查询参数
      searchParams: {
        data: {
          roomId: uni.getStorageSync("terminalInfo").roomId,
          name: "",
          outType: "",
          outTime: "",
          backTime: "",
          dutyPolice: "",
        },
        page: {
          pageIndex: 1,
          pageSize: 10,
        },
      },
    };
  },
  computed: {
    ...mapState({
      // 登录人员信息
      personInfo: (state) => state.app.personInfo,
    }),
    // 带回 or 带出
    isBringOut() {
      return this.currentPage == 1;
    },
    // 监室人员列表
    inPrisonerList() {
      return this.prisonerList.filter((item) => item.status == "0") || [];
    },
    // 外出人员列表
    outPrisonerList() {
      return this.prisonerList.filter((item) => item.status == "1") || [];
    },
    // 页面显示的人员列表
    displayedPersonList() {
      return this.currentPage == 1 ? this.inPrisonerList : this.outPrisonerList;
    },
  },
  filters: {
    dateFormatFilter(value, code, index) {
      if (!value && code !== "index") return "无";
      if (code == "outTime" || code == "backTime") {
        return dateFormat("YYYY-MM-DD hh:mm", new Date(value));
      } else if (code == "index") {
        return index + 1;
      } else {
        return value;
      }
    },
  },
  created() {
    this.getOutTypeInfo();
    this.getRoomPolices();
  },
  mounted() {
    this.getPrisonerInfo();
    // 开启倒计时
    this.$parent.countTimer();
  },
  destroyed() {
    this.showComfirmDialog = false;
  },
  methods: {
    // 切换页面
    switchPage(currentPage) {
      this.currentPage = currentPage;
      if (currentPage == 3) {
        this.resetSearchParams();
        this.searchRecord();
      } else {
        this.getPrisonerInfo();
      }
    },
    // 获取外出类型
    async getOutTypeInfo() {
      let res = await Api.apiCall("get", Api.police.getOutTypeList, null, true);
      if (res.state.code == "200") {
        this.searchParamList.outTypeList = res.data.data;
      }
    },
    // 获取管教民警
    async getRoomPolices() {
      let res = await Api.apiCall(
        "get",
        Api.police.getRoomPolices + this.roomId,
        null,
        true
      );
      if (res.state.code == 200) {
        let list = [];
        let data = res.data;
        // 主管民警
        let roomSupervisor = data.roomSupervisor;
        list.push(roomSupervisor);
        // 协管民警
        let coordinatingPolice = data.coordinatingPolice;
        if (coordinatingPolice && coordinatingPolice.length) {
          coordinatingPolice.forEach((item) => {
            list.push(item);
          });
        }
        this.searchParamList.policeList =
          (list.length &&
            list.map((item) => {
              item.value = item.name;
              return item;
            })) ||
          [];
      }
    },
    // 获取监室人员列表
    async getPrisonerInfo() {
      let params = {
        roomNo: this.roomNo,
      };
      let res = await Api.apiCall("get", Api.police.getPrisonerList, params);
      if (res.state.code == "200") {
        this.prisonerList = res.data;
        this.prisonerList.map((item) => {
          item.waitForTakeState = Reflect.has(item, "waitForTake");
          item.processState = Reflect.has(item, "processCode");
          if (Reflect.has(item, "waitForTake")) {
            item.waitForTakeType =
              item.waitForTake == "01"
                ? "家属会见"
                : item.waitForTake == "02"
                ? "律师会见"
                : "提讯";
          }
        });
      }
    },
    // 带出弹框 外出原因 下拉选择
    selectConfirmOutType(outType) {
      this.takeOutType = outType.originItem.code;
    },
    // 人工核对确认
    confirmHandler() {
      this.handleTakePrisoner();
    },
    // 点击带回/带出按钮
    handleOperate(item) {
      this.selectedPrisoner = item;
      const { name, rybh } = item;
      this.regConfig = {
        rybh,
        regName: name,
      };
      this.showComfirmDialog = true;
      if (this.currentPage == 1) {
        this.takeOutType = item.waitForTake ? item.waitForTake : "";
        let outType = this.selectedPrisoner.waitForTakeType
          ? this.selectedPrisoner.waitForTakeType
          : "请选择外出原因";
        this.$refs.outTypeRef && this.$refs.outTypeRef.setInput(outType);
      }
    },
    // 带出/带回提交
    submit() {
      if (this.currentPage == 1 && !this.takeOutType) {
        return this.$parent.handleShowToast("请选择外出原因！", "center");
      }
      this.showComfirmDialog = false;
      // 人脸验证开关
      let faceIdVerify = uni.getStorageSync("faceIdVerify");
      if (faceIdVerify == "1") {
        this.showRecognitionDialogs = true;
        this.$nextTick(() => {
          this.$refs.recognitionDialogs &&
            this.$refs.recognitionDialogs.startRecognition(27);
        });
      } else {
        this.handleTakePrisoner();
      }
    },
    // 人脸认证成功回调
    faceRecognitionSuccess() {
      this.verifySuccess();
    },
    // 指纹认证成功回调
    fingerRecognitionSuccess(res) {
      const { mKey, mKey2 } = this.selectedPrisoner;
      if ([mKey, mKey2].includes(res.mKey)) {
        this.verifySuccess();
      } else {
        this.$parent.voiceBroadcast("验证不通过，请确认在押人员信息");
      }
    },
    // 验证成功
    verifySuccess() {
      this.$parent.voiceBroadcast("验证通过");
      setTimeout(() => {
        this.recognitionDialogsClose();
        this.handleTakePrisoner();
      }, 2000);
    },
    // 关闭认证弹框
    recognitionDialogsClose() {
      this.showRecognitionDialogs = false;
      this.regConfig = {
        rybh: "",
        regName: "",
      };
    },
    // 带出 / 带回
    async handleTakePrisoner() {
      let params = {};
      let api = "";
      if (this.currentPage == 1) {
        params = {
          roomId: this.roomId,
          personCode: this.selectedPrisoner.rybh,
          outType: this.takeOutType,
          takeOutPolice: this.personInfo.code,
        };
        api = Api.police.takeOut;
      } else {
        params = {
          roomId: this.roomId,
          outType: this.selectedPrisoner.outTypeCode,
          personCode: this.selectedPrisoner.rybh,
          takeBackPolice: this.personInfo.code,
        };
        api = Api.police.takeBack;
      }
      let res = await Api.apiCall("post", api, params);
      if (res.state.code == 200) {
        this.changePrisonerStatus();
        this.closeComfirmDialog();
      } else {
        if (this.currentPage == 1) {
          this.$parent.handleShowToast("操作失败！", "center");
        } else {
          this.takeBackTips = res.state.msg || "操作失败";
          this.openModal("TakeBackTips");
        }
      }
    },
    // 前端渲染
    changePrisonerStatus() {
      this.prisonerList.map((item) => {
        if (item.rybh == this.selectedPrisoner.rybh) {
          item.status = item.status == "0" ? "1" : "0";
          item.outTypeCode = this.takeOutType;
        }
        return item;
      });
      this.$parent.handleShowToast("操作成功！", "center");
    },
    // 关闭弹框
    closeComfirmDialog() {
      this.takeOutType = "";
      if (this.$refs.outTypeRef) {
        this.$refs.outTypeRef.activeIndex = -1;
        this.$refs.outTypeRef && this.$refs.outTypeRef.clearInput();
        this.$refs.outTypeRef && this.$refs.outTypeRef.onListHide();
      }
      this.showComfirmDialog = false;
    },
    // 输入在押人员
    handlePrisonerNameInput(event) {
      this.searchParams.data.name = event.detail.value;
    },
    // 外出时间选择
    pickeOutTime(outTime) {
      this.searchParams.data.outTime = outTime;
    },
    // 返回时间选择
    pickeBackTime(backTime) {
      this.searchParams.data.backTime = backTime;
    },
    // 外出原因 下拉选择
    selectOutType(outType) {
      this.searchParams.data.outType = outType.orignItem.code;
    },
    // 负责民警 下拉选择
    selectDutyPolice(dutyPolice) {
      this.searchParams.data.dutyPolice = dutyPolice.orignItem.accountName;
    },
    // 查询记录
    async searchRecord() {
      let res = await Api.apiCall(
        "post",
        Api.police.searchRecord,
        this.searchParams
      );
      if (res.state.code == 200) {
        this.recordTotal = (res.page && res.page.total) || 0;
        if (this.searchParams.page.pageIndex == 1) {
          this.recordList = res.data || [];
        } else {
          this.recordList = this.recordList.concat(res.data || []);
        }
      }
    },
    // 点击查询按钮
    handleSearchRecord() {
      this.searchParams.page.pageIndex = 1;
      this.searchRecord();
    },
    // 滑动加载
    handleSearchDataToLower() {
      if (this.recordList.length >= this.recordTotal) {
        return this.$parent.handleShowToast("暂无更多数据", "center");
      }
      this.searchParams.page.pageIndex += 1;
      this.searchRecord();
    },
    // 重置查询参数
    resetSearchParams() {
      this.searchParams = {
        data: {
          roomId: uni.getStorageSync("managerInfo").roomId,
          name: "",
          outType: "",
          outTime: "",
          backTime: "",
          dutyPolice: "",
        },
        page: {
          pageIndex: 1,
          pageSize: 10,
        },
      };
    },
    // 打开弹框
    openModal(type) {
      this[`show${type}`] = true;
    },
    // 关闭弹框
    closeModal(type) {
      this[`show${type}`] = false;
    },
  },
};
</script>

<style lang="less" scoped>
.out-room-register {
  position: relative;
  // 头像
  .img-warrper {
    padding: 0 15.3upx;
    width: 151upx;
    height: 118.75upx;
    box-sizing: border-box;
    background-color: #fff;
    .img {
      width: 100%;
      height: 100%;
    }
  }
  // 内边光
  .inner-glow-box {
    background: rgba(42, 66, 115, 0.65);
    box-sizing: border-box;
    border: 1px solid #00c6ff;
    box-shadow: inset 0upx 0upx 5upx 5upx rgba(25, 106, 190, 0.5);
    border-radius: 2px;
  }
  // 滑动文本
  .text-scroll-warrper {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    font-size: 16upx;
    .text-scroll {
      width: 100upx;
      white-space: nowrap;
    }
  }
  // 操作按钮
  .operate-btn {
    width: 128upx;
    height: 38upx;
    line-height: 38upx;
    border-radius: 2px;
    font-size: 18upx;
    text-align: center;
    &.red-btn {
      background-color: #d22d2d;
    }
    &.take-btn {
      background-color: #ff9900;
    }
    &.blue-btn {
      background-color: #007aff;
    }
    &.process-btn {
      background-color: #ff9900;
    }
  }
  .show-box {
    position: relative;
  }
  // input/下拉框
  .param-item {
    margin-bottom: 15.3upx;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 20.83upx;
    .param-name {
      padding: 0 6.25upx;
      width: 235upx;
      height: 36.11upx;
      background: rgba(27, 146, 239, 0.25);
      border: #1b92ef 0.69upx solid;
      box-shadow: 0upx 0upx 4.86upx 2.08upx rgba(27, 146, 239, 0.45) inset;
      border-radius: 1.38upx;
      font-size: 18.05upx;
      font-weight: 400;
      line-height: 34.72upx;
      color: #ffffff;
    }
    .value {
      padding: 0 6.25upx;
      width: 235upx;
      height: 36.2upx;
      line-height: 36.2upx;
      font-size: 18.06upx;
      &.had-border {
        box-shadow: 0px 0px 6px 0px rgb(27, 146, 239) inset;
        background: rgba(27, 146, 239, 0.25);
        border: #1b92ef 1px solid;
        border-radius: 1px;
      }
    }
    .date {
      position: relative;
      &::after {
        position: absolute;
        right: 10.4upx;
        bottom: 6.95upx;
        content: "";
        display: inline-block;
        width: 20.83upx;
        height: 20.83upx;
        background-image: url("/static/images/check/calendar.png");
        background-size: cover;
      }
    }
  }
  .page-menu-area {
    box-sizing: border-box;
    border-right: 1px solid #00c6ff;
  }
  .out-room-record {
    padding: 0 32upx;
    .search-param-toolbar {
      height: 156.25upx;
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      .param-list {
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        flex-wrap: wrap;
      }
      .search-btn-box {
        height: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .search-btn {
          margin-left: 62.5upx;
          width: 111upx;
          height: 43upx;
          line-height: 43upx;
          text-align: center;
          background-color: #0475f2;
          border-radius: 4px;
          font-size: 18.06upx;
          &.disabled {
            background-color: #666;
            pointer-events: none;
          }
        }
      }
    }
  }
  .person-list-warrper {
    padding: 0 32upx;
    .overall-situation {
      padding-bottom: 12upx;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      border-bottom: 1px solid rgba(255, 255, 255, 0.16);
      font-size: 20.83upx;
      .room-person-info {
        width: 50%;
        justify-content: space-between;
        align-items: center;
        font-size: 20.83upx;
      }
    }
    .person-list {
      height: 434upx;
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      flex-wrap: wrap;
      .person-list-item {
        margin: 31.25upx 23.5upx 0;
        padding: 5upx 10upx 10upx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: column;
        width: 171upx;
        height: 236upx;
        color: #fff;
        .person-info {
          width: 100%;
          display: flex;
          justify-content: flex-start;
          align-items: flex-start;
          flex-direction: column;
          font-size: 16upx;
          text-align: left;
        }
      }
    }
  }
  .modal-header {
    padding: 0 27.77upx;
    height: 61.11upx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .modal-title {
      height: 100%;
      display: flex;
      align-items: center;
      font-size: 22.22upx;
      font-weight: 500;
      color: #35fffa;
    }
    .modal-close {
      height: 100%;
      width: 22upx;
      display: flex;
      justify-content: center;
      align-items: center;
      image {
        height: 22upx;
        width: 22upx;
      }
    }
  }
  .comfirm-dialog-content {
    padding-bottom: 67upx;
    width: 720upx;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    box-sizing: border-box;
    .out-type-select {
      margin-bottom: 28upx;
    }
    .selected-prisoner-img-box {
      padding: 5upx 10.5upx;
      box-sizing: border-box;
    }
    .selected-prisoner-info {
      margin: 17.5upx 0 45upx;
    }
  }
}
.takeback-modal-container {
  width: 556upx;
  height: 332upx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .modal-header {
    height: 61.11upx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 27.77upx;
    .modal-title {
      height: 100%;
      display: flex;
      align-items: center;
      font-size: 22.22upx;
      font-weight: 500;
      color: #35fffa;
    }
    .modal-close {
      height: 100%;
      width: 22upx;
      display: flex;
      justify-content: center;
      align-items: center;
      image {
        height: 22upx;
        width: 22upx;
      }
    }
  }
  .takeback-modal-box {
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .takeback-content {
      font-size: 20upx;
      color: #35fffa;
    }
  }
}
</style>