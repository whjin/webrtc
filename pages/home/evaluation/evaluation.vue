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
              'content-item-select': selectId == item.rybh,
              'content-item-done': item.answer_status == '1',
            }" v-for="(item, index) in talkList" :key="index" @click="selectTalk(item)">
            <span>{{ item.ry_name }}</span>
            <span>{{ item.rybh }}</span>
            <span>{{ item.answer_status == "0" ? "未测评" : "已测评" }}</span>
          </div>
        </div>
        <div class="content-button" :class="!selectId ? 'button-disabled' : ''" @click="startRecognition">
          验证身份，开始测评
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import Api from "@/common/api.js";
import { mapState } from "vuex";
import { currentPage } from "@/common/utils/util.js";

export default {
  name: "evaluation",
  components: {},
  data () {
    return {
      // 开始时间
      startTime: "",
      // 结束时间
      endTime: "",
      // 选择人员ID
      selectId: "",
      // 测评列表
      talkList: [],
    };
  },
  computed: {
    ...mapState({
      // 测评ID
      talkId: (state) => state.app.talkId,
    }),
    // 已测评人数
    talkedNum () {
      if (this.talkList.length) {
        return this.talkList.filter((item) => item.answer_status == "1").length;
      } else {
        return this.talkList.length;
      }
    },
    // 未测评人数
    unTalkNum () {
      if (this.talkList.length) {
        return this.talkList.filter((item) => item.answer_status == "0").length;
      } else {
        return this.talkList.length;
      }
    },
  },
  created () {
    this.getSelfTalkInfo(this.talkId);
  },
  methods: {
    // 获取测评人员信息
    async getSelfTalkInfo (id) {
      let res = await Api.apiCall("post", Api.index.getTalkInfo + id, null);
      if (res.state.code == "200") {
        this.talkList = res.data.answerRyList;
        this.startTime = res.data.talkBeginTime;
        this.endTime = res.data.talkEndTime;
      }
    },
    // 选择测评人员
    selectTalk (item) {
      if (item.answer_status == "1") {
        this.selectId = "";
        currentPage().handleShowToast("该人员已答题", "center");
        return;
      }
      this.selectId = item.rybh;
    },
    // 开始认证
    startRecognition () {
      if (!this.selectId) {
        currentPage().handleShowToast("请先选择测评人员", "center");
        return;
      }
      currentPage().openModal("RecognitionDialogs");
      this.$nextTick(() => {
        this.$refs.recognitionDialogs &&
          this.$refs.recognitionDialogs.startRecognition();
      });
    },
  },
};
</script>

<style lang="less">
@import '../../../common/less/index.less';
</style>
