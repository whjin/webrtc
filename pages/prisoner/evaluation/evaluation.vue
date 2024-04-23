<template>
  <div class="evaluation-container">
    <div class="evaluation-wrapper">
      <header class="evaluation-header">
        <div class="time-slot">
          测评时间段：<span>{{ `${startTime} - ${endTime}` }}</span>
        </div>
        <div>测评在押人员列表</div>
      </header>
      <main class="evaluation-content">
        <div class="content-title">
          <section>
            测评人数：<span>{{ talkList.length }}</span>人
          </section>
          <section>
            已测评数：<span>{{ talkedNum }}</span>人
          </section>
          <section>
            未测评数：<span>{{ unTalkNum }}</span>人
          </section>
        </div>
        <div class="content-box">
          <div class="content-item" :class="{
            'content-item-select': regConfig.rybh == item.rybh,
            'content-item-done': item.answer_status == '1',
          }" v-for="(item, index) in talkList" :key="index" @click="selectTalk(item)">
            <span>{{ item.ry_name }}</span>
            <span>{{ item.rybh }}</span>
            <span>{{ item.answer_status == "0" ? "未测评" : "已测评" }}</span>
          </div>
        </div>
        <div class="content-button" :class="!regConfig.rybh ? 'button-disabled' : ''" @click="recognitionHandle">
          验证身份，开始测评
        </div>
      </main>
    </div>
    <recognition-dialogs ref="recognitionDialogs" useFor="evaluation" :regConfig="regConfig"
      :isShow="showRecognitionDialogs" @fingerRecognitionSuccess="fingerRecognitionSuccess"
      @faceRecognitionSuccess="faceRecognitionSuccess" @close="closeRecognitionDialogs"></recognition-dialogs>
  </div>
</template>

<script>
import Api from "@/common/api.js";
import { mapState, mapMutations } from "vuex";
import recognitionDialogs from "@/components/recognition-dialogs/recognition-dialogs.vue";
import { currentPage } from "@/common/utils/util.js";

export default {
  name: "evaluation",
  components: { recognitionDialogs },
  data() {
    return {
      // 开始时间
      startTime: "00:00",
      // 结束时间
      endTime: "00:00",
      // 测评列表
      talkList: [],
      // 认证弹框
      showRecognitionDialogs: false,
      regConfig: {
        regName: "",
        isRecognitionSuccess: false,
        rybh: "",
      },
    };
  },
  computed: {
    ...mapState({
      // 测评ID
      taskId: (state) => state.app.taskId,
    }),
    // 已测评人数
    talkedNum() {
      if (this.talkList.length) {
        return this.talkList.filter((item) => item.answer_status == "1").length;
      } else {
        return this.talkList.length;
      }
    },
    // 未测评人数
    unTalkNum() {
      if (this.talkList.length) {
        return this.talkList.filter((item) => item.answer_status == "0").length;
      } else {
        return this.talkList.length;
      }
    },
  },
  created() {
    this.setIsEvaluation(true);
    this.getSelfTalkInfo();
  },
  methods: {
    ...mapMutations({
      // 设置心理测评状态
      setIsEvaluation: "app/SET_ISEVALUATION",
    }),
    // 获取测评人员信息
    async getSelfTalkInfo() {
      const { roomNo } = uni.getStorageSync("terminalInfo");
      let res = await Api.apiCall(
        "post",
        Api.index.getTalkInfo + `?id=${this.taskId}&roomNo=${roomNo}`,
        null
      );
      if (res.state.code == 200) {
        this.startTime = res.data.talkBeginTime;
        this.endTime = res.data.talkEndTime;
        this.talkList = res.data.answerRyList;
        if (!this.talkList.length) {
          setTimeout(() => {
            currentPage().onClickHome();
          }, 3000);
        }
      }
    },
    // 选择测评人员
    selectTalk(item) {
      if (item.answer_status == "1") {
        this.regConfig.rybh = "";
        currentPage().handleShowToast("该人员已答题", "center");
        return;
      }
      this.regConfig.rybh = item.rybh;
    },
    // 开始认证
    recognitionHandle() {
      if (!this.regConfig.rybh) {
        currentPage().handleShowToast("请先选择测评人员", "center");
        return;
      }
      this.showRecognitionDialogs = true;
      this.$nextTick(() => {
        this.$refs.recognitionDialogs &&
          this.$refs.recognitionDialogs.startRecognition();
      });
    },
    // 指纹认证成功回调
    fingerRecognitionSuccess(res) {
      this.showRecognitionDialogs = false;
      this.getLoginPersonInfo(res.mKey);
    },
    // 人脸认证成功回调
    faceRecognitionSuccess(res) {
      this.showRecognitionDialogs = false;
      currentPage().recognitionHanlder(res);
    },
    // 获取认证登录人员信息
    async getLoginPersonInfo(mKey) {
      const { roomNo } = uni.getStorageSync("terminalInfo");
      let params = {
        mKey,
        roomNo,
      };
      let res = await Api.apiCall(
        "get",
        Api.index.getOdsPrisonerInfo,
        params,
        true
      );
      if (res.state.code == 200) {
        if (Object.keys(res.data).length) {
          if (res.data.rybh == this.regConfig.rybh) {
            currentPage().voiceBroadcast("指纹识别成功");
            currentPage().recognitionHanlder(res.data);
          } else {
            currentPage().voiceBroadcast("人员不匹配");
            currentPage().handleShowToast("人员不匹配", "center");
          }
        }
      }
    },
    // 登录弹框关闭回调
    closeRecognitionDialogs() {
      this.showRecognitionDialogs = false;
    },
  },
};
</script>

<style lang="less">
@import "../../../common/less/index.less";
</style>
