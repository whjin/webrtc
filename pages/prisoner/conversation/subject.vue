<template>
	<div class="subject-container">
		<div class="subject-wrapper">
			<header class="subject-header">
				<div class="time-slot">
					谈话时间段：<span>{{ `${startTime} - ${endTime}` }}</span>
				</div>
				<div class="time-left">
					剩余时间：<span>{{ countTime }}</span>
				</div>
			</header>
			<main class="subject-content">
				<div class="content-name">
					当前在押人员：<span>{{ personInfo.name }}</span>
				</div>
				<div class="content-title">
					管教谈话
					<section>
						共<span>{{ subjectList.length }}</span>项，当前第<span>{{
              subjectList.length ? currentIndex + 1 : 0
            }}</span>项
					</section>
				</div>
				<div class="content-box">
					<div class="content-list" v-for="(list, idx) in subjectList" :key="idx">
						<div class="content-item" v-show="currentIndex == idx">
							<div class="list-title">
								{{
                  `${idx + 1}、${list.title}（${
                    list.isCheckbox == 0 ? "单选题" : "多选题"
                  }）`
                }}
							</div>
							<radio-group v-if="list.isCheckbox == 0" @change="onSelectChange">
								<label class="list-option" v-for="(item, index) in list.option" :key="index">
									<radio :value="item"></radio>
									<span>{{ `${item.option}、${item.describe}` }}</span>
								</label>
							</radio-group>
							<checkbox-group v-if="list.isCheckbox == 1" @change="onCheckChange">
								<label class="list-option" v-for="(item, index) in list.option" :key="index">
									<checkbox :value="item"></checkbox>
									<span>{{ `${item.option}、${item.describe}` }}</span>
								</label>
							</checkbox-group>
						</div>
					</div>
				</div>
				<div class="button-group">
					<div class="button" @click="prevSubject">上一题</div>
					<div class="button" @click="nextSubject">下一题</div>
					<div class="button" :class="!answerIds.length ? 'btn-submit' : ''" @click="submitConfirm">
						提交
					</div>
				</div>
			</main>
		</div>
	</div>
</template>

<script>
import Api from "@/common/api.js";
import { countDown } from "@/common/utils/util.js";
import { mapState, mapMutations } from "vuex";

export default {
	name: "subject",
	components: {},
	data () {
		return {
			// 开始时间
			startTime: "00:00",
			// 结束时间
			endTime: "00:00",
			// 剩余时间
			countTime: "00:00:00",
			// 倒计时定时器
			countdownTimer: null,
			// 在押人员姓名
			name: "李四",
			// 题目列表
			subjectList: [],
			// 当前项索引
			currentIndex: 0,
			// 已答题ID
			answerIds: [],
			// 已答题选项
			answerOptions: [],
			// 总分列表
			scoreList: [],
			// 禁止重复提交
			isRepeatState: false,
		};
	},
	computed: {
		...mapState({
			// 谈话计划ID
			taskId: (state) => state.app.taskId,
			// 登录人员信息
			personInfo: (state) => state.app.personInfo,
		}),
	},
	created () {
		this.getSubjectList(this.taskId);
	},
	beforeDestroy () {
		clearInterval(this.countdownTimer);
	},
	methods: {
		...mapMutations({
			// 设置当前页面
			setCurrentTab: "app/SET_CURRENTTAB",
		}),
		// 获取题目
		async getSubjectList (id) {
			let res = await Api.apiCall("get", Api.index.getAnswerDetails + id, null);
			if (res.state.code == 200) {
				this.subjectList = res.data.questionnaire;
				this.startTime = res.data.talkBeginTime;
				this.endTime = res.data.talkEndTime;
				this.countTime = countDown(res.data.limitTime);
				this.countDownTimer(res.data.limitTime);
			}
		},
		// 剩余时间倒计时
		countDownTimer (sec) {
			this.countdownTimer = setInterval(() => {
				if (sec <= 0) {
					clearInterval(this.countdownTimer);
					this.setCurrentTab(19);
				} else {
					sec--;
					this.countTime = countDown(sec);
				}
			}, 1000);
		},
		// 单选题
		onSelectChange (e) {
			let { id, option, grade } = e.detail.value;
			if (this.answerIds.includes(id)) {
				let index = this.answerIds.findIndex((index) => index == id);
				this.answerOptions.splice(index, 1, option);
				this.scoreList.splice(index, 1, grade);
			} else {
				this.answerIds.push(id);
				this.answerOptions.push(option);
				this.scoreList.push(grade);
			}
		},
		// 多选题
		onCheckChange (e) {
			if (!this.isRepeatState) {
				this.isRepeatState = true;
				setTimeout(() => {
					this.isRepeatState = false;
				}, 1500);
				let result = e.detail.value;
				let id = "";
				let options = "";
				let index = 0;
				let grades = [];
				if (result.length) {
					id = result[0].id;
					result.forEach((item) => {
						options += item.option;
						grades.push(item.grade);
					});
					if (this.answerIds.includes(id)) {
						index = this.answerIds.findIndex((item) => item == id);
						this.answerOptions.splice(index, 1, options);
						if (grades.includes(0)) {
							this.scoreList.splice(index, 1, 0);
						} else {
							this.scoreList.splice(index, 1, grades[0]);
						}
					} else {
						this.answerIds.push(id);
						this.answerOptions.push(options);
						if (grades.includes(0)) {
							this.scoreList.push(0);
						} else {
							this.scoreList.push(grades[0]);
						}
					}
				} else {
					index = this.answerIds.findIndex((item) => item == id);
					this.answerIds.splice(index, 1);
					this.answerOptions.splice(index, 1);
					this.scoreList.splice(index, 1);
				}
			}
		},
		// 上一题
		prevSubject () {
			this.currentIndex--;
			if (this.currentIndex < 0) {
				this.currentIndex = 0;
				this.$parent.handleShowToast("当前已是第一题", "center");
				return;
			}
		},
		// 下一题
		nextSubject () {
			let lastIndex = this.subjectList.length - 1;
			this.currentIndex++;
			if (this.currentIndex > lastIndex) {
				this.currentIndex = lastIndex;
				this.$parent.handleShowToast("当前已是最后一题", "center");
				return;
			}
		},
		// 提交
		async submitConfirm () {
			let libraryIds = this.answerIds.toString();
			let answerOptions = this.answerOptions.toString();
			let answerStatus = this.answerIds.length ? "1" : "0";
			let questionId = this.taskId;
			let ryName = this.personInfo.name;
			let rybh = this.personInfo.rybh;
			let score = this.scoreList.reduce((sum, cur) => {
				return sum + cur;
			});
			let params = {
				libraryIds,
				answerOptions,
				answerStatus,
				questionId,
				ryName,
				rybh,
				score,
			};
			let res = await Api.apiCall("post", Api.index.saveAnswerInfo, params);
			if (res.state.code == 200) {
				this.$parent.handleShowToast("保存成功");
				this.setCurrentTab(19);
			}
		},
	},
};
</script>

<style lang="less">
@import '../../../common/less/index.less';
</style>
