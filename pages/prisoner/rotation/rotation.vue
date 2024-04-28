<template>
	<div class="rotation-container">
		<div class="rotation-wrapper">
			<div class="rotation-content">
				<div class="rotation-title">
					<text>值班签到</text>
					<div class="button" v-if="currentPage == 1 && dutyPersonList.length" @click="startRotation">
						开始签到
					</div>
				</div>
				<div class="rotation-box">
					<div class="rotation-menu-list">
						<div class="rotation-menu-item" :class="currentPage == 1 ? 'rotation-menu-active' : ''"
							@click="switchPage(1)">
							<common-icons iconType="iconweekdate" size="38" color="#fff" />
							<text>一周值班表</text>
						</div>
						<div class="rotation-menu-item" :class="currentPage == 2 ? 'rotation-menu-active' : ''"
							@click="switchPage(2)">
							<common-icons iconType="iconregister" size="42" color="#fff" />
							<text>监室值班登记</text>
						</div>
						<div class="rotation-menu-item" :class="currentPage == 3 ? 'rotation-menu-active' : ''"
							@click="switchPage(3)">
							<common-icons iconType="iconrecord" size="48" color="#fff" />
							<text>值班签到记录</text>
						</div>
					</div>
					<div class="rotation-vertical-divider"></div>
					<div v-if="currentPage == 1" class="rotation-table-container">
						<div class="table-box">
							<div class="table-head">
								<div class="table-head-item" v-for="(item, index) in dateList" :key="index">
									{{ item }}
								</div>
							</div>
							<scroll-view scroll-y="true" class="rotation-table-scroll">
								<div class="table-content" v-for="item in dutyWeekPlanList" :key="item.timeQuantum">
									<div class="table-content-item" style="flex: 1">
										{{ item.timeQuantum }}
									</div>
									<div class="table-content-item" :class="{ 'current-date': person.highlight == 1 }"
										style="flex: 1" v-for="(person, index) in item.dutyList" :key="index">
										{{ person.names }}
									</div>
								</div>
							</scroll-view>
						</div>
					</div>
					<div v-if="currentPage == 2" class="rotation-register-container">
						<div class="register-person">
							<div class="register-title">
								值班人员：<text>{{ onDutyPerson }}</text>
							</div>
						</div>
						<div class="register-select">
							<label>值班情况：</label>
							<xfl-select :list="dutyStatusList" :clearable="false" :placeholder="'请选择值班情况'"
								@change="dutyStatusChange"></xfl-select>
						</div>
						<div class="register-remark">
							<label>备注：</label>
							<textarea v-model="remark" maxlength="-1" @input="handleInputChange"></textarea>
						</div>
						<div class="register-button">
							<div class="btn-cancel" @click="handleRegCancel">取消</div>
							<div class="btn-submit" @click="handleRegSubmit">提交</div>
						</div>
					</div>
					<div v-if="currentPage == 3" class="rotation-record-container">
						<div class="record-form-box">
							<div class="record-form-left">
								<div class="form-duty-date">
									<label class="form-label">值班时间：</label>
									<e-picker mode="date" class="picker-img" :showValue="dutyStartDate"
										@change="handleSelectStartDate">
										<div class="duty-date">{{ dutyStartDate }}</div>
									</e-picker>
									<div class="divider-line">-</div>
									<e-picker mode="date" class="picker-img" :showValue="dutyEndtDate"
										@change="handleSelectEndDate">
										<div class="duty-date">{{ dutyEndtDate }}</div>
									</e-picker>
								</div>
								<div class="form-duty-schedule">
									<label class="form-label">班次：</label>
									<xfl-select :list="timeQuantumList" :clearable="false" :placeholder="'请选择班次'"
										@change="handleShiftChange"></xfl-select>
								</div>
							</div>
							<div class="record-form-right">
								<div class="btn-query" @click="handleRecordQuery">查询</div>
							</div>
						</div>
						<div class="record-table-box">
							<div class="table-head">
								<div class="table-head-item" v-for="(item, index) in recordColumns" :key="index"
									:style="{ flex: item.flex }">
									{{ item.title }}
								</div>
							</div>
							<scroll-view scroll-y="true" class="record-table-scroll"
								@scrolltolower="recorListScrolltolower">
								<div class="table-content" v-for="(item, index) in dutyRecordList" :key="index">
									<div class="record-table-item" style="flex: 1">
										{{ item.roomNo }}
									</div>
									<div class="record-table-item" style="flex: 2">
										{{ item.dutyDate }}
									</div>
									<div class="record-table-item" style="flex: 1">
										{{ item.period }}
									</div>
									<div class="record-table-item" style="flex: 1">
										{{ item.name }}
									</div>
									<div class="record-table-item" style="flex: 2">
										{{ item.signTime }}
									</div>
								</div>
							</scroll-view>
						</div>
					</div>
				</div>
			</div>
		</div>
		<recognition-dialogs ref="recognitionDialogs" useFor="rotation" :callConfig="callConfig"
			:isShow="showRecognitionDialogs" @close="recognitionDialogsClose"
			@fingerRecognitionSuccess="fingerRecognitionSuccess"
			@faceRecognitionSuccess="faceRecognitionSuccess"></recognition-dialogs>
	</div>
</template>

<script>
import neilModal from "@/components/neil-modal/neil-modal.vue";
import xflSelect from "@/components/xfl-select/xfl-select.vue";
import ePicker from "@/components/e-picker/e-picker.vue";
import { dateFormat } from "@/common/utils/util.js";
import Api from "@/common/api.js";
import { mapState } from "vuex";
import recordColumns from "@/static/mock/recordColumns.json";

export default {
	name: "rotation",
	components: {
		neilModal,
		xflSelect,
		ePicker,
	},
	data() {
		return {
			currentPage: 1,
			// 初始值班数据
			originDutyData: {},
			// 当值人员列表
			dutyPersonList: [],
			// 点名认证弹框配置
			callConfig: {
				callName: "",
				rybh: "",
				isRecognitionSuccess: false,
			},
			// 签到记录表头
			recordColumns: recordColumns,
			// 值班情况列表
			dutyStatusList: ["无异常", "发生异常"],
			// 选择值班情况
			dutyStatus: "",
			// 值班情况备注
			remark: "",
			// 值班签到查询列表
			dutyRecordList: [],
			// 选择值班开始日期
			dutyStartDate: "",
			// 选择值班结束日期
			dutyEndtDate: dateFormat("YYYY-MM-DD", new Date()),
			// 选择班次
			dutyShift: "",
			// 认证弹框状态
			showRecognitionDialogs: false,
			// 值班时间段列表
			timeQuantumList: ["全部"],
			// 日期列表
			dateList: [""],
			dutyWeekPlanList: [],
			// 值班记录分页参数
			dutyRecordPageParam: {
				pageIndex: 1,
				pageSize: 10,
			},
			// 值班记录列表总数
			dutyRecordTotal: 999,
		};
	},
	computed: {
		...mapState({
			// 登录人员
			personInfo: (state) => state.app.personInfo,
			// 值班人员列表
			dutyList: (state) => state.app.dutyList,
		}),
		// 当值人员名称
		onDutyPerson() {
			return this.dutyList.length
				? this.dutyList.map((item) => item.names).toString()
				: "";
		},
	},
	mounted() {
		// 获取一周值班计划
		this.getDutyWeekPlan();
		// 开启倒计时
		this.$parent.countTimer();
	},
	beforeDestroy() {
		this.recognitionDialogsClose();
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
				this.originDutyData = res.data;
				this.initData();
			}
		},
		// 数据初始化
		initData() {
			let data = this.originDutyData;
			for (const key in data) {
				if (Object.hasOwnProperty.call(data, key)) {
					this.dutyWeekPlanList.push({
						timeQuantum: key,
					});
					// 设置值班时间段列表
					let hasTimeQuantum = this.timeQuantumList.some((time) => time == key);
					if (!hasTimeQuantum) {
						this.timeQuantumList.push(key);
					}
					const item = data[key];
					let dutyList = [];
					for (const i in item) {
						if (Object.hasOwnProperty.call(item, i)) {
							// 设置日期列表
							let hasDate = this.dateList.some((date) => date == i);
							if (!hasDate) {
								this.dateList.push(i);
							}
							const value = item[i];
							if (value.length) {
								let arr = [];
								let highlight = 0;
								value.forEach((element) => {
									arr.push(element.name);
									highlight = element.highlight;
									if (Number(highlight)) {
										this.dutyPersonList.push(element);
									}
								});
								dutyList.push({
									names: arr.join("、"),
									highlight,
								});
							} else {
								dutyList.push("");
							}
						}
					}
					this.dutyWeekPlanList.forEach((e) => {
						if (e.timeQuantum == key) {
							e.dutyList = dutyList;
						}
					});
				}
			}
		},
		// 开始签到
		startRotation() {
			if (this.dutyList.length) {
				this.callConfig = {
					callName: this.onDutyPerson,
					rybh: "",
					isRecognitionSuccess: false,
				};
				this.showRecognitionDialogs = true;
				this.$nextTick(() => {
					this.$refs.recognitionDialogs &&
						this.$refs.recognitionDialogs.startRecognition();
				});
			} else {
				this.$parent.handleShowToast("当前没有值班任务");
			}
		},
		// 指纹认证成功回调
		fingerRecognitionSuccess(res) {
			this.checkCurSignStatus("mKeys", res.mKey);
		},
		// 人脸认证成功回调
		faceRecognitionSuccess(res) {
			this.checkCurSignStatus("rybhs", res.rybh);
		},
		// 当前人员是否为值班人员
		checkCurSignStatus(type, checkItem) {
			this.dutyList.forEach((item) => {
				let rybhs = [];
				rybhs.push(item.rybh);
				item.rybhs = rybhs;
				if (item[type].includes(String(checkItem))) {
					this.callConfig = {
						callName: item.name,
						rybh: "",
						isRecognitionSuccess: true,
					};
					this.saveDutySignRecord(item);
				}
			});
		},
		// 保存签到记录
		async saveDutySignRecord(item) {
			let params = {
				data: {
					ondutyLayoutDateId: item.ondutyLayoutDateId,
				},
			};
			let res = await Api.apiCall(
				"post",
				Api.prisoner.rotation.saveSignRecord,
				params,
				true
			);
			if (res.state.code == 200) {
				this.voiceBroadcast(`${item.name}签到成功`);
				setTimeout(() => {
					this.recognitionDialogsClose();
				}, 2000);
			} else {
				this.showRecognitionDialogs = false;
				this.voiceBroadcast(res.state.msg || "签到失败");
			}
		},
		// 提交保存值班登记
		handleRegSubmit() {
			let hadAuth = this.dutyList.some(
				(item) => item.rybh == this.personInfo.rybh
			);
			if (!hadAuth) {
				this.$parent.handleShowToast("没有提交权限");
				return;
			}
			if (!this.dutyStatus) {
				this.$parent.handleShowToast("请选择值班情况");
				return;
			}
			this.updateSituation();
		},
		// 保存值班登记信息
		async updateSituation() {
			let ondutyLayoutDateId = this.dutyList.find(
				(item) => item.rybh == this.personInfo.rybh
			).ondutyLayoutDateId;
			let params = {
				data: {
					ondutyLayoutDateId,
					rybh: this.personInfo.rybh,
					situation: `${this.dutyStatus}，${this.remark}`,
				},
			};
			let res = await Api.apiCall(
				"post",
				Api.prisoner.rotation.updateSituation,
				params,
				true
			);
			if (res.state.code == 200) {
				this.$parent.handleShowToast("提交成功");
			}
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
				if (this.dutyRecordPageParam.pageIndex == 1 && !res.data.length) {
					this.$parent.handleShowToast("暂无更多数据", "center");
				}
				if (this.dutyRecordPageParam.pageIndex == 1) {
					this.dutyRecordList = res.data;
				} else {
					this.dutyRecordList = this.dutyRecordList.concat(res.data);
				}
				this.dutyRecordTotal = (res.page && res.page.total) || 0;
			}
		},
		// 设置值班记录列表分页参数
		setPageParam(pageIndex, pageSize) {
			this.dutyRecordPageParam = {
				pageIndex,
				pageSize,
			};
		},
		// 关闭认证弹框
		recognitionDialogsClose() {
			this.showRecognitionDialogs = false;
			this.callConfig = {
				callName: this.onDutyPerson,
				rybh: "",
				isRecognitionSuccess: false,
			};
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
			}
		},
	},
};
</script>

<style lang="less">
@import '../../../common/less/index.less';
</style>
