<template>
  <div class="call-container">
    <div class="call-wrapper">
      <div class="call-table-container">
        <div class="call-table-title">
          <text>在线点名</text>
        </div>
        <div class="call-table-body">
          <div class="table-box">
            <div class="table-head">
              <div class="table-head-item" v-for="(item, index) in callColumns" :key="index" :style="{ flex: item.flex }">
              <div class="table-head-item" v-for="(item, index) in callColumns" :key="index" :style="{ flex: item.flex }">
                {{ item.title }}
              </div>
            </div>
            <scroll-view scroll-y="true" :scroll-into-view="scrollToView" :scroll-with-animation="true"
              class="call-table-scroll">
              <div class="table-content" v-for="(item, index) in rollCallList" :key="item.rybh" :id="`id${item.rybh}`"
            <scroll-view scroll-y="true" :scroll-into-view="scrollToView" :scroll-with-animation="true"
              class="call-table-scroll">
              <div class="table-content" v-for="(item, index) in rollCallList" :key="item.rybh" :id="`id${item.rybh}`"
                :class="{
                  'current-content': item.rybh == callId,
                  'signed-content': item.status == '1',
                }">
                }">
                <div class="table-content-item" style="flex: 1">
                  {{ index + 1 }}
                </div>
                <div class="table-content-item" style="flex: 1">
                  {{ item.name }}
                </div>
                <div class="table-content-item" style="flex: 2">
                  {{ item.startDate }}
                </div>
                <div class="table-content-item" style="flex: 2">
                  {{ item.endDate }}
                </div>
                <div class="table-content-item" style="flex: 2">
                  {{ item.signDate }}
                </div>
                <div class="table-content-item" style="flex: 1">
                  {{ item.statusText }}
                </div>
                <div class="table-content-item" style="flex: 2">
                  {{ item.location }}
                </div>
              </div>
            </scroll-view>
          </div>
        </div>
      </div>
    </div>
    <recognition-dialogs ref="recognitionDialogs" useFor="call" :regConfig="regConfig" :isShow="showRecognitionDialogs"
      @fingerRecognitionSuccess="fingerRecognitionSuccess" @faceRecognitionSuccess="faceRecognitionSuccess"
      @close="closeRecognitionDialogs"></recognition-dialogs>
  </div>
</template>

<script>
import neilModal from "@/components/neil-modal/neil-modal.vue";
import Api from "@/common/api.js";
import { dateFormat, currentPage } from "@/common/utils/util.js";
import { mapState, mapMutations } from "vuex";
import callColumns from "@/static/mock/callColumns.json";
import recognitionDialogs from "@/components/recognition-dialogs/recognition-dialogs.vue";

export default {
  components: {
    neilModal,
    recognitionDialogs,
  },
  data() {
    return {
      // 认证弹框
      showRecognitionDialogs: false,
      // 表头信息
      callColumns: callColumns,
      // 在线点名人员列表
      rollCallList: [],
      // 签到成功人员信息
      regName: "",
      // 第一次点名计时器
      rollCallTimer: null,
      // 当前点名ID
      callId: "",
      // 点名索引
      callIndex: 0,
      // 当前点名索引
      curIndex: 0,
      // 点名轮次
      callRound: 1,
      // 点名间隔时间
      timeSpace: 0,
      // 已签到人员列表
      signedList: [],
      // 未签到人员列表
      unSignCallList: [],
      // 点名认证弹框配置
      regConfig: {
        regName: "", // 当前被点名人员
        isRecognitionSuccess: false, // 是否点名认证成功
        rybh: "",
      },
      // 自动滚动
      scrollToView: "",
      temperature: 0,
    };
  },
  computed: {
    ...mapState({
      // 是否正在点名
      isCalling: (state) => state.app.isCalling,
      // 点名信息
      rollInfo: (state) => state.app.rollInfo,
    }),
  },
  created() {
    if (!this.isCalling) {
      this.setIsCalling(true);
      // 开始点名
      currentPage().receiveTask("rollCall", "start");
      // 获取在线点名人员列表
      this.getRollCallInfo();
    }
  },
  beforeDestroy() {
    this.discontinueCall(false);
  },
  methods: {
    ...mapMutations({
      // 设置当前页面
      setCurrentTab: "app/SET_CURRENTTAB",
      // 设置点名状态
      setIsCalling: "app/SET_ISCALLING",
    }),
    // 获取在线点名人员列表
    async getRollCallInfo() {
      const { rollId, rollDetailId } = this.rollInfo;
      const { roomId } = uni.getStorageSync("terminalInfo");
      let params = { rollId, rollDetailId, roomId };
      let res = await Api.apiCall("get", Api.index.getRollCallRyList, params);
      if (res.state.code == 200 && Reflect.has(res, "data")) {
        this.rollCallInfoHanlder(res);
      } else {
        this.stopRollCall();
      }
    },
    // 处理点名人员信息
    rollCallInfoHanlder(res) {
      this.callSpace = res.data.rollCall.callSpace || 30;
      this.rollCallList = res.data.rollCallRyList;
      let roundState =
        this.rollCallList.some((item) => item.round == 2) ||
        this.rollCallList.every((item) => item.round == 1);
      this.callRound = roundState ? 2 : 1;
      this.rollCallList.map((item, index) => {
        item.index = index;
        item.statusText = item.status == "1" ? "已签到" : "未签到";
      });
      this.unSignCallList = this.rollCallList.filter(
        (item) => item.status == "0"
      );
      if (this.unSignCallList.length) {
        let round1State = this.unSignCallList.every((item) => item.round == 1);
        let round2State = this.unSignCallList.some((item) => item.round == 1);
        if (this.callRound == 2) {
          // 第二轮
          if (round1State) {
            this.curIndex = 0;
          }
          if (round2State) {
            this.curIndex = this.unSignCallList.findIndex((item) => {
              return item.round == this.callRound - 1;
            });
          }
        } else {
          // 第一轮
          this.curIndex = this.unSignCallList.findIndex((item) => {
            return item.round == this.callRound - 1;
          });
        }
      }
      this.handleRollCall();
    },
    // 在线点名
    handleRollCall() {
      if (!this.unSignCallList.length) {
        this.stopRollCall();
        return;
      }
      this.rollCallHandler();
      clearInterval(this.rollCallTimer);
      this.rollCallTimer = setInterval(() => {
        let round = this.rollCallList[this.callIndex].round;
        this.rollCallList[this.callIndex].round = round + 1 > 1 ? 2 : 1;
        this.updateRollCall(this.rollCallList[this.callIndex]);
        this.nextSignHandler(this.rollCallHandler);
      }, this.callSpace * 1000);
    },
    rollCallHandler() {
      this.showRecognitionDialogs = false;
      this.voiceBroadcast(
        `请${this.unSignCallList[this.curIndex].name}进行签到`
      );
      this.callIndex = this.unSignCallList[this.curIndex].index;
      this.callId = this.unSignCallList[this.curIndex].rybh;
      this.scrollToView = `id${this.callId}`;
      this.regConfig.rybh = this.callId;
      this.regConfig.regName = `${this.unSignCallList[this.curIndex].name}`;
      this.rollCallList[this.callIndex].called = true;
      setTimeout(() => {
        this.showRecognitionDialogs = true;
        this.$nextTick(() => {
          this.$refs.recognitionDialogs &&
            this.$refs.recognitionDialogs.startRecognition();
        });
      }, 3000);
    },
    unSignCallHandler() {
      this.showRecognitionDialogs = false;
      clearInterval(this.rollCallTimer);
      this.curIndex = 0;
      if (this.callRound == 2) {
        this.stopRollCall();
        return;
      }
      this.callRound = 2;
      this.unSignCallList = [];
      this.rollCallList.map((item, index) => {
        if (item.status == "0") {
          item.index = index;
          this.unSignCallList.push(item);
        }
      });
      if (this.unSignCallList.length) {
        // 开始第二轮点名
        this.handleRollCall();
      } else {
        this.stopRollCall();
      }
    },
    // 签到成功
    signSuccess(temperature) {
      this.temperature = temperature;
      this.rollCallList[this.callIndex].signDate = dateFormat(
        "YYYY-MM-DD hh:mm",
        new Date()
      );
      this.rollCallList[this.callIndex].status = "1";
      this.rollCallList[this.callIndex].statusText = "已签到";
      this.rollCallList[this.callIndex].temperature = temperature;
      this.rollCallList[this.callIndex].called = true;
      let round = this.rollCallList[this.callIndex].round;
      this.rollCallList[this.callIndex].round = round + 1 > 1 ? 2 : 1;
      this.updateRollCall(this.rollCallList[this.callIndex]);
      this.regConfig.isRecognitionSuccess = true;
      this.voiceBroadcast(`${this.rollCallList[this.callIndex].name}签到成功`);
      let params = {
        rybh: this.rollCallList[this.callIndex].rybh,
        temperature,
      };
      if (temperature > uni.getStorageSync("normalTemperature")) {
        this.saveWarningTemperature(params);
      }
      setTimeout(() => {
        this.showRecognitionDialogs = false;
      }, 2000);
      setTimeout(() => {
        this.regConfig.isRecognitionSuccess = false;
        this.nextSignHandler(this.handleRollCall);
      }, 5000);
    },
    // 执行下一个点名
    nextSignHandler(Func) {
      this.curIndex++;
      if (this.curIndex < this.unSignCallList.length) {
        Func();
      } else {
        this.unSignCallHandler();
      }
    },
    // 更新已签到人员信息
    async updateRollCall(curCallInfo) {
      const { rollId, rollDetailId } = this.rollInfo;
      const { roomId } = uni.getStorageSync("terminalInfo");
      const { rybh, name, location, called, round, temperature, status } =
        curCallInfo;
      let params = {
        data: {
          rollId,
          rollDetailId,
          roomId,
          rybh,
          name,
          location,
          called,
          round,
          temperature,
          status,
        },
      };
      let res = await Api.apiCall(
        "post",
        Api.prisoner.call.updateRollCallRes,
        params
      );
      if (res.state.code == 200) {
        currentPage().handleShowToast("签到信息保存成功");
      }
    },
    // 点名结束
    stopRollCall() {
      this.showRecognitionDialogs = false;
      clearInterval(this.rollCallTimer);
      this.setIsCalling(false);
      setTimeout(() => {
        this.voiceBroadcast("点名结束");
      }, 0);
      setTimeout(() => {
        this.setCurrentTab(1);
      }, 1500);
    },
    // 对讲中止点名
    discontinueCall(state) {
      clearInterval(this.rollCallTimer);
      this.showRecognitionDialogs = false;
      this.setIsCalling(false);
      if (state) {
        currentPage().receiveTask("rollCall", "0");
      }
      setTimeout(() => {
        this.setCurrentTab(1);
      });
    },
    // 保存体温超出预警值的人员
    async saveWarningTemperature(params) {
      await Api.apiCall(
        "post",
        Api.prisoner.call.saveWarningTemperature,
        params
      );
    },
    // 指纹认证成功回调
    fingerRecognitionSuccess(res) {
      if (this.rollCallList[this.callIndex].mKeys.includes(String(res.mKey))) {
        this.signSuccess(res.temperature);
      } else {
        this.voiceBroadcast(
          `识别失败，请${this.rollCallList[this.callIndex].name}进行签到`
        );
      }
    },
    // 人脸认证成功回调
    faceRecognitionSuccess(res) {
      this.signSuccess(res.temperature);
    },
    // 登录弹框关闭回调
    closeRecognitionDialogs() {
      this.showRecognitionDialogs = false;
    },
    // 测温回调方法
    setTemperature(temperature) {
      this.$refs.recognitionDialogs &&
        this.$refs.recognitionDialogs.setTemperature(temperature);
    },
    // 语音播放
    voiceBroadcast(voiceText) {
      // 语音播放时段
      let messagePlayTime =
        uni.getStorageSync("messagePlayTime") || "05:00,22:00";
      let interval = messagePlayTime.split(",");
      let now = dateFormat("hh:mm", new Date());
      if (now >= interval[0] && now <= interval[1]) {
        let options = {
          content: voiceText,
        };
        getApp().globalData.Base.speech(options);
        getApp().globalData.Base.speech(options);
      }
    },
  },
};
</script>

<style lang="less">
@import "../../../common/less/index.less";
</style>
