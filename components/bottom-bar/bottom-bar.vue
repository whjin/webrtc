<template>
	<div class="bottom-bar-container">
		<div class="bottom-bar-left">
			<div class="bottom-bar-user" @click="onClickLogin">
				<image src="/static/images/common/user.png"></image>
			</div>
			<div v-if="loginState" class="login-name">{{ name }}</div>
			<div v-if="loginState" class="bottom-bar-logout" @click="onClickLogout">
				<common-icons iconType="iconlogout" size="28" color="#fff" />
				<text>注销</text>
			</div>
			<div v-if="!loginState" class="login-setup">
				<div class="setting" @click="onClickSet">
				</div>
			</div>
		</div>
		<div @click="onDeviceClick" class="bottom-bar-center">
			<template v-if="deviceState">
				<text v-if="authIP !== curIP" class="text red-color">认证IP：{{ authIP || "无" }}</text>
				<text class="text">当前IP：{{ curIP || "无" }}</text>
				<text class="text">版本号：V{{ version || "无" }}</text>
			</template>
		</div>
		<div v-if="showCountDown" class="bottom-bar-right">
			页面操作倒计时:<text>{{ countdown }}</text>
		</div>
	</div>
</template>

<script>
import { mapState } from "vuex";

export default {
	name: "BottomStatus",
	props: {
		name: {
			type: String,
			default: "未知名",
		},
		loginState: {
			type: Boolean,
			default: true,
		},
		countdown: {
			type: Number | String,
			default: 30,
		},
	},
	data () {
		return {
			// 设备信息状态
			deviceState: false,
			version: "",
			curIP: "",
			authIP: uni.getStorageSync("authTerminalIP") || "",
			// 点击设置栏次数
			clickNums: 0,
		};
	},
	computed: {
		...mapState({
			// 当前页面
			currentTab: (state) => state.app.currentTab,
		}),
		showCountDown () {
			return this.currentTab > 1 && ![6, 19, 20, 21, 22].includes(this.currentTab);
		}
	},
	methods: {
		onClickLogout () {
			this.$emit("click-logout");
		},
		onClickSet () {
			this.$emit("click-set");
		},
		onClickLogin () {
			this.$emit("click-login");
		},
		onDeviceClick () {
			if (this.currentTab == 1) {
				if (this.clickNums == 3) {
					this.clickNums = 0;
					// #ifdef APP-PLUS
					this.version = plus.runtime.version;
					this.curIP = getApp().globalData.Base.getIpAddress().ip;
					// #endif
					this.deviceState = true;
					setTimeout(() => {
						this.deviceState = false;
					}, 3000);
				} else {
					this.clickNums = this.clickNums + 1;
				}
			} else {
				this.clickNums = 0;
			}
		},
	},
};
</script>

<style lang="less">
@import '../../common/less/index.less';
</style>
