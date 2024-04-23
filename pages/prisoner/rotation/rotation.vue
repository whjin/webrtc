<template>
	<div class="rotation-container">
		<div class="rotation-wrapper">
			<div class="rotation-content">
				<div class="rotation-title">
					<text>值班签到</text>
				</div>
				<div class="rotation-box">
					<div class="rotation-menu-list">
						<div class="rotation-menu-item rotation-menu-active">
							<common-icons iconType="iconweekdate" size="38" color="#fff" />
							<text>监室值班登记</text>
						</div>
					</div>
					<div class="page-vertical-divider"></div>
					<div class="register-container">
						<div class="register-item">
							<label>值班人员：</label>
							<text>{{ dutyPerson }}</text>
						</div>
						<div class="register-item">
							<label>值班情况：</label>
							<xfl-select :list="dutyStatusList" :clearable="false" :placeholder="'请选择值班情况'"
								@change="dutyStatusChange"></xfl-select>
						</div>
						<div class="register-item register-remark">
							<label>备注：</label>
							<textarea v-model="remark" maxlength="-1" @input="onInputChange"></textarea>
						</div>
						<div class="register-button">
							<div class="btn-cancel" @click="handleRegCancel">取消</div>
							<div class="btn-submit" :class="{ 'btn-disabled': !isDuty }" @click="handleRegSubmit">提交</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import xflSelect from "@/components/xfl-select/xfl-select.vue";
import Api from "@/common/api.js";
import { mapState } from "vuex";

export default {
	name: "rotation",
	components: {
		xflSelect,
	},
	data() {
		return {
			// 值班状态
			isDuty: false,
			// 值班人员
			dutyPerson: "",
			// 值班情况列表
			dutyStatusList: ["无异常", "发生异常"],
			// 选择值班情况
			dutyStatus: "",
			// 值班情况备注
			remark: "",
		};
	},
	computed: {
		...mapState({
			// 登录人员
			personInfo: (state) => state.app.personInfo,
		}),
	},
	mounted() {
		// 获取值班信息
		this.getDutyInfo();
		// 开启倒计时
		this.$parent.countTimer();
	},
	beforeDestroy() {
	},
	methods: {
		// 切换菜单
		switchPage(index) {
			this.currentPage = index;
			if (index == 3) {
				let date = new Date();
				let lastMonthDate = date.setMonth(date.getMonth() - 1);
				this.dutyStartDate = dateFormat("YYYY-MM-DD", new Date(lastMonthDate));
				this.handleRecordQuery();
			} else {
				this.setPageParam(1, 10);
				this.dutyStatus = "";
				this.dutyShift = "";
				this.dutyRecordList = [];
			}
		},
		// 获取值班列表详情
		async getDutyWeekPlan() {
			let params = {
				roomNo: uni.getStorageSync("terminalInfo").roomNo,
			};
			let res = await Api.apiCall(
				"get",
				Api.prisoner.rotation.getDutyWeekPlan,
				params
			);
			if (res.state.code == 200) {
				this.isDuty = res.data;
				if (this.isDuty) {
					this.dutyPerson = this.personInfo.name;
				} else {
					this.$parent.handleShowToast("当前人员没有值班任务", "center");
				}
			}
		},
		// 选择值班情况
		dutyStatusChange(e) {
			this.dutyStatus = e.newVal;
		},
		// 监听键盘事件
		onInputChange(e) {
			this.$parent.initCountTimeout();
		},
		// 取消值班登记
		handleRegCancel() {
			this.remark = "";
		},
		// 选择值班情况
		dutyStatusChange(e) {
			this.dutyStatus = e.newVal;
		},
		// 选择值班开始日期
		handleSelectStartDate(e) {
			this.dutyStartDate = e;
		},
		// 选择值班结束日期
		handleSelectEndDate(e) {
			this.dutyEndtDate = e;
		},
		// 选择班次
		handleShiftChange(e) {
			this.dutyShift = e.newVal == "全部" ? "" : e.newVal;
		},
		// 监听键盘事件
		handleInputChange(e) {
			this.$parent.initCountTimeout();
		},
		// 签到记录查询
		handleRecordQuery() {
			this.dutyRecordList = [];
			this.setPageParam(1, 10);
			this.signRecordSearch();
		},
		// 滑动到底部触发加载
		recorListScrolltolower() {
			if (this.dutyRecordList.length >= this.dutyRecordTotal) {
				return this.$parent.handleShowToast("暂无更多数据", "center");
			}
			this.dutyRecordPageParam.pageIndex += 1;
			this.signRecordSearch();
		},
		// 查询值班签到记录
		async signRecordSearch() {
			let params = {
				data: {
					roomNo: uni.getStorageSync("terminalInfo").roomNo,
					startDate: this.dutyStartDate,
					endDate: this.dutyEndtDate,
					period: this.dutyShift,
				},
				pageParam: this.dutyRecordPageParam,
			};
			let res = await Api.apiCall(
				"post",
				Api.prisoner.rotation.findSignRecord,
				params
			);
			if (res.state.code == 200) {
				this.$parent.handleShowToast("保存值班登记信息成功");
				this.remark = "";
			}
		},
	},
};
</script>

<style lang="less">
@import "../../../common/less/index.less";
</style>
