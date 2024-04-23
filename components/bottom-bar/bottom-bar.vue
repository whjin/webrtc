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
		<div v-if="showClock" class="bottom-bar-right">
			<div class="nowDate">
				<span class="week">{{ week }}</span>
				<span class="date">{{ date }}</span>
			</div>
			<div class="time">
				{{ time }}
			</div>
		</div>
	</div>
</template>

<script>
import { mapState } from "vuex";
import { dateFormat, getWeek, timing } from "@/common/utils/util.js";

export default {
	name: "bottom-bar",
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
	data() {
		return {
			// 设备信息状态
			deviceState: false,
			version: "",
			curIP: "",
			authIP: uni.getStorageSync("authTerminalIP") || "",
			// 点击设置栏次数
			clickNums: 0,
			date: "",
			week: "",
			time: "",
			clockTimer: null
		};
	},
	computed: {
		...mapState({
			// 当前页面
			currentTab: (state) => state.app.currentTab,
		}),
		showCountDown() {
			return this.currentTab > 1 && this.currentTab != 6;
		},
		showClock() {
			return this.currentTab == 1;
		},
	},
	watch: {
		showClock() {
			if (this.showClock) {
				this.startClockTimer();
			} else {
				clearInterval(this.clockTimer);
			}
		}
	},
	mounted() {
		this.startClockTimer();
	},
	methods: {
		onClickLogout() {
			this.$emit("click-logout");
		},
		onClickSet() {
			this.$emit("click-set");
		},
		onClickLogin() {
			this.$emit("click-login");
		},
		onDeviceClick() {
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
		startClockTimer() {
			this.clockTimer = setInterval(() => {
				this.getDate();
			}, 1000);
		},
		getDate() {
			this.date = dateFormat("YYYY-MM-DD", new Date());
			this.week = getWeek();
			this.time = timing();
		},
	},
};
</script>

<style lang="less">
@import '../../common/less/index.less';
</style>
