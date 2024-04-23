<template>
	<view class="uni-flex nav-bar-area">
		<view class="uni-flex nav-bar-title">
			<text @click="onClickInit" id="tdClick">{{title}}</text>
		</view>
    <div @click="onCenterDblclick" class="nav-bar-app-info">
      <template v-if="isShowCenter">
        <span v-if="authIP !== curIP" class="text red-color">认证IP：{{ authIP || '无' }}</span>
        <span class="text">当前IP：{{ curIP || '无' }}</span>
        <span class="text">版本号：{{ version ? 'V' + version : '无' }}</span>
      </template>
    </div>
	</view>
</template>

<script>
	export default {
		name: 'NavBar',
		props: {
			// 标题内容
			title: {
				type: String,
				default: "监室智能管理终端系统"
			}
		},
    data() {
      return {
        isShowCenter: false,
        clickCount: 0,
        startTime: 0,
        endTime: 0,
        version: '',
        curIP: '',
        authIP: ''
      }
    },
		methods: {
			onClickInit() {
				this.$emit('click-init')
			},
      onCenterDblclick () {
        if (this.isShowCenter) return;
        this.clickCount = this.clickCount == 0 ? 1 : this.clickCount + 1;
        if (this.clickCount == 1) {
          this.startTime = new Date().getTime();
          setTimeout(() => {
            this.clickCount = this.startTime = this.endTime = 0;
          }, 200);
        } else if (this.clickCount == 2) {
          this.endTime = new Date().getTime();
          if (this.endTime - this.startTime < 300) {
            this.getAppInfo();
            this.isShowCenter = !this.isShowCenter;
            setTimeout(() => {
              this.isShowCenter = !this.isShowCenter;
            }, 3000);
          }
          this.clickCount = this.startTime = this.endTime = 0;
        }
      },
      getAppInfo () {
        this.version = plus.runtime.version;
        this.curIP = getApp().globalData.Base.getIpAddress().ip;
        this.authIP = uni.getStorageSync('authControlIP');
      }
		}
	}
</script>

<style>

</style>
