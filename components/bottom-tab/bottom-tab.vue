<template>
	<div class="bottomtab-container">
		<div class="bottomtab-menu" v-for="(item, index) in menuList" :key="index" :class="curTabId == item.id ? 'bottom-tab-active' : ''" v-show="tabList[index]" @click="onClickMenu(item)">
			<common-icons :type="item.type" size="40" color="#fff" />
			<text>{{ item.name }}</text>
			<div v-if="item.id == 42 && missCallNum > 0" class="miss-call" @click="openCallModal">
				<text>{{ missCallNum }}</text>
			</div>
		</div>
	</div>
</template>

<script>
import commonIcons from "@/components/common-icons/common-icons.vue";
import { mapState, mapMutations } from "vuex";

export default {
	name: "BottomTab",
	components: {
		commonIcons,
	},
	data () {
		return {
			curTabId: 41,
		};
	},
	computed: {
		...mapState({
			// TAB状态列表
			tabList: (state) => state.app.tabList,
			// 菜单列表
			menuList: (state) => state.app.menuList,
			// 监视监听轮巡状态
			isPolling: (state) => state.app.isPolling,
			// 未接来电数
			missCallNum: (state) => state.app.missCallNum,
			// 未接来电状态
			missCallState: (state) => state.app.missCallState,
			// 主机视频通话状态
			controlCallState: (state) => state.app.controlCallState,
		}),
	},
	created () {
		// 获取APP配置菜单
		this.$parent.getAppMenuList();
	},
	methods: {
		...mapMutations({
			// 设置未接来电状态
			setMissCallState: "app/SET_MISSCALLSTATE",
		}),
		onClickMenu (item) {
			if (item != 42) {
				this.$emit("click-change", item);
				if (this.isPolling) {
					this.curTabId = item.id;
				} else {
					this.setMissCallState();
					if (!this.missCallState && !this.controlCallState) {
						this.curTabId = item.id;
					}
				}
			}
		},
		// 打开未接来电弹框
		openCallModal () {
			if (this.curTabId == 42) {
				this.$parent.openMissCallModal();
			}
		},
	},
};
</script>

<style lang="less">
.bottomtab-container {
	width: 100%;
	height: 90.27upx;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: center;
	border-top: rgba(0, 111, 233, 0.48) 1.38upx solid;
	.bottomtab-menu {
		height: 73upx;
		width: 117upx;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
		text {
			font-size: 19upx;
			font-weight: 400;
			color: #fff;
		}
		.miss-call {
			position: absolute;
			top: 0;
			right: 0;
			display: inline-block;
			width: 35upx;
			height: 35upx;
			border-radius: 50%;
			background-color: rgba(255, 51, 51, 1);
			display: flex;
			align-items: center;
			justify-content: center;
			text {
				color: #fff;
				font-size: 18upx;
				font-weight: bold;
			}
		}
	}
}
</style>
