<template>
  <div class="suggestion-container">
    <div class="suggestion-wrapper">
      <div class="suggestion-title">
        <text>投诉建议</text>
      </div>
      <div class="suggestion-content">
        <textarea v-model="content" maxlength="-1" placeholder="请填写你的建议" @input="handleInputChange"></textarea>
        <div class="button-group">
          <div class="button" @touchstart.stop="handleCancel">取消</div>
          <div class="button" :class="!content ? 'btn-submit' : ''" @touchstart.stop="handleSubmit">
            提交
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Api from "@/common/api.js";
import { dateFormat } from "@/common/utils/util.js";
import { mapState, mapMutations } from "vuex";

export default {
  name: "suggestion",
  components: {},
  data () {
    return {
      // 建议内容
      content: "",
    };
  },
  computed: {
    ...mapState({
      // 登录人员信息
      personInfo: (state) => state.app.personInfo,
    })
  },
  created () {
    // 开启倒计时
    this.$parent.countTimer();
  },
  methods: {
    ...mapMutations({
      // 设置当前页面
      setCurrentTab: "app/SET_CURRENTTAB",
    }),
    // 建议内容
    handleInputChange (e) {
      this.content = e.target.value;
    },
    handleCancel () {
      this.setCurrentTab(2);
    },
    // 提交建议
    handleSubmit () {
      if (!this.content) {
        this.$parent.handleShowToast("请先填写投诉建议内容", "center");
        return;
      }
      this.saveSuggestion();
    },
    // 保存投诉建议
    async saveSuggestion () {
      let content = this.content;
      let recordTime = dateFormat("YYYY-MM-DD hh:mm:ss", new Date());
      let rybh = this.personInfo.rybh;
      let params = {
        content,
        recordTime,
        rybh,
      };
      let res = await Api.apiCall("post", Api.prisoner.saveSuggestion, params);
      if (res.state.code == 200) {
        this.$parent.handleShowToast("保存成功");
        this.setCurrentTab(2);
      }
    }
  },
};
</script>

<style lang="less">
@import '../../../common/less/index.less';
</style>
