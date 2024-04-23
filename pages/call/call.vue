<template>
	<div class="call-container">
		<div class="call-wrapper">
			<div class="call-left">
				<div class="call-left-box">
					<div class="left-tab">
						<div :class="page == 0 ? 'tab-active' : 'tab'" @click="handleTabChange(0)">
							分机列表
						</div>
						<div v-if="currentPage == 0" :class="page == 1 ? 'tab-active' : 'tab'" @click="handleTabChange(1)">
							分组列表
						</div>
					</div>
					<div class="left-content">
						<div v-show="page == 0" class="terminal-list">
							<div class="terminal-search rectangle-img">
								<input class="input-search" v-model="searchTerminal" @input="searchTerminalChange" />
								<common-icons type="iconsearch" color="#fff" size="20"
									@click="searchTerminalRoom"></common-icons>
							</div>
							<div class="terminal-room-box">
								<scroll-view scroll-y="true">
									<!-- 点名任务 -->
									<v-tree v-if="currentPage == 0" showCheckbox :root="terminalList"
										:changeHandler="terminalSelect"></v-tree>
									<!-- 点名记录 -->
									<v-tree v-else showRadio leaf-only :root="terminalList"
										:changeHandler="terminalRadioSelect"></v-tree>
								</scroll-view>
							</div>
						</div>
						<div v-show="currentPage == 0 && page == 1" class="groups-list">
							<div class="terminal-search rectangle-img">
								<input class="input-search" v-model="searchGroup" @input="searchGroupChange" />
								<div class="search-btn" @click="searchGroupRoom">
									<common-icons type="iconsearch" color="#fff" size="20"></common-icons>
								</div>
							</div>
							<div class="terminal-room-box">
								<scroll-view scroll-y="true">
									<v-tree ref="vTree" showCheckbox :showGroup="true" :root="groupList"
										:changeHandler="groupSelect" @group-change="openModifyGroup"
										@group-delete="openDeleteGroup"></v-tree>
								</scroll-view>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="call-center">
				<div class="call-center-head">
					<div class="center-head-box">
						<div class="head-tabs">
							<div :class="currentPage == 0 ? 'tab-active' : 'tab'" @click="handlePageChange(0)">
								点名任务
							</div>
							<div :class="currentPage == 1 ? 'tab-active' : 'tab'" @click="handlePageChange(1)">
								点名记录
							</div>
						</div>
						<div class="head-content" v-if="currentPage == 0">
							<div>
								已选中:<text style="color: #21cdc5">{{ selectedNum }}</text>个监室
							</div>
							<div>
								已连接:<text style="color: #0267df">{{ connectedNum }}</text>个监室
							</div>
							<div>
								未连接:<text style="color: #e30c12">{{ disconnectNum }}</text>个监室
							</div>
						</div>
					</div>
				</div>
				<div class="call-center-table">
					<div class="call-center-content">
						<div class="center-btn-box" v-if="currentPage == 0">
							<div class="center-btn-left">
								<div class="btn-left" v-if="!callState" :class="isRoomAll ? 'btn-active-img' : 'btn-img'"
									@click="handleSelectAll">
									<text>全选</text>
								</div>
								<div class="btn-left btn-img" v-if="!callState" @click="handleRemoveAll">
									<text>移除</text>
								</div>
								<div class="btn-left btn-img" @click="handleAddGroup">
									<text>添加分组</text>
								</div>
							</div>
							<div class="center-btn-right">
								<div class="btn-right btn-img" @click="handleCallModal">
									<text>开始点名</text>
								</div>
							</div>
						</div>
						<div class="center-record-box" v-if="currentPage == 1">
							<div class="record-head-left" v-if="callRecordList.length">
								<section>
									日期:<text style="color: #21cdc5">{{ callRecordInfo.callDate }}</text>
								</section>
								<section>
									时间:<text style="color: #21cdc5">{{ callRecordInfo.callTime }}</text>
								</section>
							</div>
							<div class="record-head-right">
								<section>
									总人数:<text style="color: #21cdc5">{{ callRecordInfo.allCount || 0 }}</text>人
								</section>
								<section>
									已签到:<text style="color: #0267df">{{ callRecordInfo.calledCount || 0 }}</text>人
								</section>
								<section>
									未签到:<text style="color: #e30c12">{{ callRecordInfo.unCallCount || 0 }}</text>人
								</section>
							</div>
						</div>
						<div class="center-table-container">
							<div v-if="currentPage == 0">
								<div class="call-table-box">
									<div class="table-head">
										<div class="head-checkbox" @click="checkRoomAll">
											<common-icons :type="isRoomAll ? 'iconcheckbox' : 'iconcheck-unselect'
												" color="#2a4273" size="24"></common-icons>
										</div>
										<div class="call-head-item" v-for="(item, index) in callColumns" :key="index">
											{{ item.title }}
										</div>
									</div>
									<scroll-view scroll-y="true" class="center-table-scroll">
										<div class="call-table-main" v-for="(item, index) in roomTableList" :key="index">
											<div class="table-content">
												<div class="content-checkbox" @click="checkRoomChange(item, index)">
													<common-icons :type="item.isSelectRoom
														? 'iconcheckbox'
														: 'iconcheck-unselect'
														" color="#2a4273" size="24"></common-icons>
												</div>
												<div class="call-table-item" style="flex: 1">
													{{ item.name }}
												</div>
												<div class="call-table-item" style="flex: 1">
													{{ item.status == "0" ? "已连接" : "未连接" }}
												</div>
												<div class="call-table-item" style="flex: 1">
													{{ item.rcStatus == "start" ? "点名中" : "未开始" }}
												</div>
											</div>
											<image class="table-line" src="@/static/images/table/bottom.png"></image>
										</div>
									</scroll-view>
								</div>
							</div>
							<div v-else>
								<div class="record-table-box">
									<div class="table-head">
										<div class="call-head-item" v-for="(item, index) in callRecordColumns" :key="index">
											{{ item.title }}
										</div>
									</div>
									<scroll-view scroll-y="true" class="center-table-scroll" v-if="callRecordList.length">
										<div class="call-table-main" v-for="(item) in callRecordList" :key="item.rybh">
											<div class="table-content">
												<div class="call-table-item" style="flex: 1">
													{{ item.xm }}
												</div>
												<div class="call-table-item" style="flex: 1" :style="{
													color: item.status == '1' ? '#02e605' : '#fff',
												}">
													{{ item.status == "1" ? "已签到" : "未签到" }}
												</div>
												<div class="call-table-item" style="flex: 1" :style="{
													color:
														item.isAbnormalTemperature == '1'
															? '#e30c12'
															: '#fff',
												}">
													{{ item.temperature }}
												</div>
												<div class="call-table-item" style="flex: 1">
													{{ item.remark }}
												</div>
											</div>
											<image class="table-line" src="@/static/images/table/bottom.png"></image>
										</div>
									</scroll-view>
									<div class="no-content" v-else>暂无数据</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="call-right">
				<scroll-view scroll-y="true" class="right-dynamic-scroll">
					<vtimeLine title="点名动态信息" :messageList="messageList"></vtimeLine>
				</scroll-view>
			</div>
		</div>
		<div class="neil-modal-container">
			<!-- 点名配置弹框 -->
			<neil-modal :show="showCallConfirm">
				<div class="call-modal-container">
					<div class="modal-header">
						<div class="modal-title">
							<text>点名配置</text>
						</div>
						<div class="modal-close" @click="closeModal('CallConfirm')">
							<image src="/static/images/common/close.png"></image>
						</div>
					</div>
					<div class="page-horizontal-divider"></div>
					<div class="call-config-box">
						<div class="config-section">
							<div class="config-label">选择时长(分)</div>
							<div class="config-content rectangle-img">
								<input class="config-input" v-model="duration" @input="durationChange" />
							</div>
						</div>
						<div class="duration-tips" v-if="duration < 30">
							点名时长至少30分钟
						</div>
						<div class="config-section">
							<div class="config-label">点名间隔</div>
							<div class="config-content">
								<xfl-select :list="spaceList" :initValue="0" :clearable="false" @change="selectSpaceChange"
									:widthStyle="150"></xfl-select>
							</div>
						</div>
						<div class="config-button">
							<div class="button btn-img" @click="startCall">提交</div>
						</div>
					</div>
				</div>
			</neil-modal>
			<!-- 添加分组弹框 -->
			<neil-modal :show="showAddGroup" @close="closeModal('AddGroup')">
				<div class="group-modal-container">
					<div class="group-name-box">
						<div class="group-modal-label">请输入添加分组名称：</div>
						<div class="group-content rectangle-img">
							<input class="group-name" v-model="addGroupName" @input="addGroupChange" />
						</div>
					</div>
					<div class="group-modal-btn">
						<div class="cancel-btn" @click="closeModal('AddGroup')">
							<span>取消</span>
						</div>
						<div class="confirm-btn" @click="addGroupConfirm">
							<span>确定</span>
						</div>
					</div>
				</div>
			</neil-modal>
			<!-- 修改分组弹框 -->
			<neil-modal :show="showModifyGroup" @close="closeModal('ModifyGroup')">
				<div class="group-modal-container">
					<div class="group-name-box">
						<div class="group-modal-label">请输入修改分组名称：</div>
						<div class="group-content rectangle-img">
							<input class="group-name" v-model="modifyGroupName" @input="modifyGroupChange" />
						</div>
					</div>
					<div class="group-modal-btn">
						<div class="cancel-btn" @click="closeModal('ModifyGroup')">
							<span>取消</span>
						</div>
						<div class="confirm-btn" @click="modifyGroupConfirm">
							<span>确定</span>
						</div>
					</div>
				</div>
			</neil-modal>
			<!-- 删除分组弹框 -->
			<neil-modal :show="showDeleteGroup" @close="closeModal('DeleteGroup')">
				<div class="group-modal-container">
					<div class="neil-modal-label">确认删除分组？</div>
					<div class="neil-modal-btn">
						<div class="cancel-btn" @click="closeModal('DeleteGroup')">
							<span>取消</span>
						</div>
						<div class="confirm-btn" @click="handleDeleteConfirm">
							<span>确定</span>
						</div>
					</div>
				</div>
			</neil-modal>
		</div>
	</div>
</template>

<script>
import vtimeLine from "@/components/v-timeLine/v-timeLine.vue";
import vTree from "@/components/v-tree/v-tree.vue";
import xflSelect from "@/components/xfl-select/xfl-select.vue";
import Api from "@/common/api.js";
import { hasKey, unique, uniqueArr, dateFormat, currentPages } from "@/common/utils/util.js";
import callColumns from "@/static/mock/callColumns.json";
import callRecordColumns from "@/static/mock/callRecordColumns.json";
import spaceList from "@/static/mock/spaceList.json";

export default {
	name: "control-call",
	components: {
		vtimeLine,
		vTree,
		xflSelect,
	},
	data() {
		return {
			// 0分机列表，1分组列表
			page: 0,
			// 切换点名任务|记录列表
			currentPage: 0,
			// 分机列表
			terminalList: {},
			// 分组列表
			groupList: {},
			messageList: [],
			// 搜索分机监室
			searchTerminal: "",
			// 搜索分组监室
			searchGroup: "",
			// 已选监室
			selectedNum: 0,
			// 已连接
			connectedNum: 0,
			// 未连接
			disconnectNum: 0,
			// 任务表头信息
			callColumns: callColumns,
			// 记录表头信息
			callRecordColumns: callRecordColumns,
			// 分机监室列表
			roomTableList: [],
			// 已选监室列表
			roomSelectList: [],
			// 已选分机信息
			checked: {},
			// 点名记录信息
			callRecordInfo: {},
			// 点名记录列表
			callRecordList: [],
			// 点名确认弹框
			showCallConfirm: false,
			// 点名状态
			callState: false,
			// 全选监室
			isRoomAll: false,
			// 监区名称
			rootName: "",
			// 监室名称
			prisonName: "",
			// 点名时长
			duration: 30,
			// 点名间隔
			callSpace: 30,
			// 点名间隔
			spaceList: spaceList,
			// 添加分组弹框
			showAddGroup: false,
			// 添加分组名称
			addGroupName: "",
			// 修改分组弹框
			showModifyGroup: false,
			// 修改分组名称
			modifyGroupName: "",
			// 修改|删除分组ID
			groupId: "",
			// 删除分组弹框
			showDeleteGroup: false,
			// 禁止重复操作
			isRepeatState: false,
		};
	},
	created() {
		// 获取分机列表
		this.getTerminalInfo();
		// 获取分组列表信息
		this.getGroupList();
		// 获取动态信息
		this.getDynamicInfo();
	},
	mounted() {
		// 获取点名状态信息
		this.getCallStatusInfo("600");
	},
	methods: {
		// 切换分机、分组列表
		handleTabChange(tab) {
			this.page = tab;
			this.$nextTick(() => {
				// 获取点名状态信息
				this.getCallStatusInfo("600");
			});
		},
		// 获取分机列表
		async getTerminalInfo() {
			const { areaId } = uni.getStorageSync("controlInfo");
			let res = await Api.apiCall("get", Api.index.getRoomByAreaId, {
				id: areaId,
			});
			if (res.state.code == "200") {
				let result = [];
				res.data.map((item) => {
					if (!!item) {
						// 清除null数据
						result.push(item);
					}
				});
				this.terminalList = { children: result };
			}
		},
		// 获取分组列表
		async getGroupList() {
			let controlId = uni.getStorageSync("controlInfo").id;
			let res = await Api.apiCall("get", Api.index.getGroupList, {
				controlId: controlId,
			});
			if (res.state.code == "200") {
				let result = [];
				res.data.map((item) => {
					if (!!item) {
						// 清除null数据
						result.push(item);
					}
				});
				this.groupList = { children: result };
			}
		},
		// 获取点名动态列表
		async getDynamicInfo() {
			let controlId = uni.getStorageSync("controlInfo").id;
			let params = {
				controlId: controlId,
				type: "600",
			};
			let res = await Api.apiCall("get", Api.index.getDynamicInfo, params);
			if (res.state.code == "200") {
				this.messageList = res.data;
			}
		},
		// 选择分机列表-点名记录
		terminalRadioSelect(item) {
			this.searchTerminal = "";
			this.getCheckedTerminal(item);
		},
		// 选择主分机列表
		getCheckedTerminal(selected) {
			selected.forEach((item) => {
				if (hasKey(item, "children")) {
					this.getCheckedTerminal(item.children);
				} else {
					this.checked = item;
				}
			});
			this.getRollCallDetail(this.checked.roomId);
		},
		// 获取点名记录列表
		async getRollCallDetail(roomId) {
			this.callRecordList = [];
			let params = {
				data: {
					type: "1",
					configName: "临时点名",
					roomId,
				},
			};
			let res = await Api.apiCall("post", Api.index.findRollCallDetail, params);
			if (res.state.code == 200) {
				this.callRecordList = res.data;
				if (this.callRecordList.length) {
					const {
						callTime: callDate,
						startTime,
						endTime,
						allCount,
						calledCount,
						unCallCount,
					} = this.callRecordList[0];
					this.callRecordInfo = {
						callDate,
						callTime: `${startTime}-${endTime}`,
						allCount,
						calledCount,
						unCallCount,
					};
					this.callRecordList = this.callRecordList[0].ryList;
					this.callRecordList.map((item) => {
						item.temperature =
							Number(item.temperature) > 0 ? `${item.temperature}℃` : "/";
					});
				}
			}
		},
		// 切换监室|音频列表
		handlePageChange(page) {
			this.currentPage = page;
			this.$nextTick(() => {
				if (page == 0) {
					// 获取点名状态信息
					this.getCallStatusInfo("600");
				} else {
					this.page = 0;
					uni.$emit("init-select");
					this.checked = {};
					this.callRecordInfo = {};
					this.callRecordList = [];
				}
			});
		},
		// 搜索分机监室
		searchTerminalChange(e) {
			this.searchTerminal = e.detail.value;
		},
		// 搜索分机监室
		searchTerminalRoom() {
			if (!this.searchTerminal) {
				currentPages().handleShowToast("请输入搜索内容", "center");
				return;
			}
			let reg = new RegExp(this.searchTerminal);
			let roomItem = {};
			let repeatNum = 0;
			this.terminalList.children.map((list) => {
				// 监区名称
				this.rootName = list.name;
				list.children.map((item) => {
					if (reg.test(item.name) && !Object.keys(roomItem).length) {
						list._expand = true;
						item._checked = true;
						// 监区名称
						item.rootName = this.rootName;
						// 监室名称
						this.prisonName = item.name;
						// 连接状态
						item.status = "1";
						roomItem = item;
					}
				});
			});
			if (!!Object.keys(roomItem).length) {
				this.roomTableList.push(roomItem);
				this.roomTableList = unique(this.roomTableList);
				this.roomTableList.map((item, index) => {
					if (item.name == roomItem.name) {
						repeatNum++;
						if (repeatNum == 2) {
							this.roomTableList.splice(index, 1);
						}
					}
				});
			}
			this.isRoomAll = true;
			this.roomTableList.map((item) => {
				item.isSelectRoom = true;
			});
			this.roomSelectList = this.roomTableList;
			this.selectedNum = this.roomSelectList.length;
		},
		// 搜索分组监室
		searchGroupChange(e) {
			this.searchGroup = e.detail.value;
		},
		// 搜索分组监室
		searchGroupRoom() {
			if (!this.searchGroup) {
				currentPages().handleShowToast("请输入搜索内容", "center");
				return;
			}
			let reg = new RegExp(this.searchGroup);
			let roomItem = {};
			let repeatNum = 0;
			let isSelect = false;
			this.roomTableList.map((item) => {
				isSelect = reg.test(item.name);
			});
			if (isSelect) {
				this.groupList.children.map((list) => {
					list._expand = true;
				});
				return;
			}
			this.groupList.children.map((list) => {
				list.children.map((item) => {
					if (reg.test(item.name) && !Object.keys(roomItem).length) {
						list._expand = true;
						// 监区名称
						this.rootName = list.name;
						item._checked = true;
						// 监区名称
						item.rootName = this.rootName;
						// 监室名称
						this.prisonName = item.name;
						// 连接状态
						item.status = "1";
						roomItem = item;
					}
				});
			});
			if (!!Object.keys(roomItem).length) {
				this.roomTableList.push(roomItem);
				this.roomTableList = unique(this.roomTableList);
				this.roomTableList.map((item, index) => {
					if (item.name == roomItem.name) {
						repeatNum++;
						if (repeatNum == 2) {
							this.roomTableList.splice(index, 1);
						}
					}
				});
			}
			this.isRoomAll = true;
			this.roomTableList.map((item) => {
				item.isSelectRoom = true;
			});
			this.roomSelectList = this.roomTableList;
			this.selectedNum = this.roomSelectList.length;
		},
		// 选择分机列表-点名任务
		terminalSelect(list) {
			if (this.callState) {
				list.map((item, index) => {
					item.status = "1";
					this.roomTableList.map((room) => {
						if (item.terminalCode == room.terminalCode) {
							list.splice(index, 1, room);
						}
					});
				});
			} else {
				list.map((item) => {
					item.status = "1";
				});
			}
			this.roomTableList = list;
			this.roomTableList = unique(this.roomTableList);
			if (this.roomTableList.length) {
				this.isRoomAll = true;
			} else {
				this.isRoomAll = false;
			}
			this.connectedNum = 0;
			this.disconnectNum = 0;
			this.roomTableList.map((room) => {
				room.isSelectRoom = true;
				if (room.status == "0") {
					this.connectedNum++;
				} else {
					this.disconnectNum++;
				}
			});
			this.roomSelectList = this.roomTableList;
			this.selectedNum = this.roomSelectList.length;
		},
		// 选择分组列表-点名任务
		groupSelect(list) {
			if (this.callState) {
				list.map((item, index) => {
					item.status = "1";
					this.roomTableList.map((room) => {
						if (item.terminalCode == room.terminalCode) {
							list.splice(index, 1, room);
						}
					});
				});
			} else {
				list.map((item) => {
					item.status = "1";
				});
			}
			this.roomTableList = list;
			this.roomTableList = uniqueArr(this.roomTableList, "name");
			if (this.roomTableList.length) {
				this.isRoomAll = true;
			} else {
				this.isRoomAll = false;
			}
			this.connectedNum = 0;
			this.disconnectNum = 0;
			this.roomTableList.map((room) => {
				room.isSelectRoom = true;
				if (room.status == "0") {
					this.connectedNum++;
				} else {
					this.disconnectNum++;
				}
			});
			this.roomSelectList = this.roomTableList;
			this.selectedNum = this.roomSelectList.length;
		},
		// 全选监室
		handleSelectAll() {
			if (!this.roomTableList.length) {
				return;
			}
			this.isRoomAll = !this.isRoomAll;
			if (this.isRoomAll) {
				this.roomTableList.map((item) => {
					item.isSelectRoom = true;
				});
				this.roomSelectList = this.roomTableList;
			} else {
				this.roomTableList.map((item) => {
					item.isSelectRoom = false;
				});
				this.roomSelectList = [];
			}
			this.selectedNum = this.roomSelectList.length;
		},
		// 移除已选择监室
		handleRemoveAll() {
			this.isRoomAll = false;
			this.roomTableList = [];
			this.roomSelectList = [];
			this.selectedNum = 0;
			this.connectedNum = 0;
			this.disconnectNum = 0;
			if (this.page == 0) {
				this.terminalList.children.map((list) => {
					list._checked = false;
					list.children.map((item) => {
						item._checked = false;
						item._expand = false;
					});
				});
			} else {
				this.groupList.children.map((list) => {
					list._checked = false;
					list.children.map((item) => {
						item._checked = false;
					});
				});
			}
		},
		// 全选监室表格行
		checkRoomAll() {
			if (!this.roomTableList.length) {
				return;
			}
			this.isRoomAll = !this.isRoomAll;
			if (this.isRoomAll) {
				this.roomTableList.map((item) => {
					item.isSelectRoom = true;
				});
				this.roomSelectList = this.roomTableList;
			} else {
				this.roomTableList.map((item) => {
					item.isSelectRoom = false;
				});
				this.roomSelectList = [];
			}
			this.selectedNum = this.roomSelectList.length;
		},
		// 选择监室表格行
		checkRoomChange(room, index) {
			this.roomSelectList = [];
			if (room.isSelectRoom) {
				room.isSelectRoom = false;
				this.roomTableList.splice(index, 1, room);
			} else {
				room.isSelectRoom = true;
				this.roomTableList.splice(index, 1, room);
			}
			this.roomTableList.map((item) => {
				if (item.isSelectRoom) {
					this.roomSelectList.push(item);
				}
			});
			if (this.roomSelectList.length == this.roomTableList.length) {
				this.isRoomAll = true;
			} else {
				this.isRoomAll = false;
			}
			this.selectedNum = this.roomSelectList.length;
		},
		// 打开点名弹框
		handleCallModal() {
			if (!this.roomSelectList.length) {
				currentPages().handleShowToast("请先选择监室", "center");
				return;
			}
			this.showCallConfirm = true;
		},
		// 开始点名
		startCall() {
			if (this.duration < 30) {
				currentPages().handleShowToast("点名时长至少30分钟", "center");
				return;
			}
			if (!this.isRepeatState) {
				this.isRepeatState = true;
				setTimeout(() => {
					this.isRepeatState = false;
				}, 1500);
				this.startTempRollCall();
			}
		},
		async startTempRollCall() {
			let controlId = uni.getStorageSync("controlInfo").id;
			let ids = this.roomSelectList.map((item) => item.roomId).toString();
			let params = {
				data: {
					ids,
					callSpace: this.callSpace,
					duration: this.duration * 60,
					createType: 1,
					createBy: controlId,
				},
			};
			let res = await Api.apiCall("post", Api.index.tempRollCall, params);
			if (res.state.code == 200) {
				this.callState = true;
				this.prisonName = this.roomSelectList
					.map((item) => item.name)
					.toString();
				this.setDynamicInfo("600", `开始${this.prisonName}点名`);
				setTimeout(() => {
					// 保存点名状态
					this.saveCallPlayStatus("start");
				}, 1500);
			} else {
				currentPages().handleShowToast(res.state.msg || "临时点名发起失败", "center");
			}
			this.showCallConfirm = false;
		},
		// 保存点名状态
		async saveCallPlayStatus(status) {
			const { controlCode } = uni.getStorageSync("controlInfo");
			let params = {
				data: {
					controlCode,
					type: "600",
					status,
					roomList: this.roomSelectList,
					startTime: dateFormat("YYYY-MM-DD hh:mm", new Date()),
				},
			};
			let res = await Api.apiCall(
				"post",
				Api.index.saveMediaPlayStatus,
				params
			);
			if (res.state.code == 200) {
				currentPages().handleShowToast("保存状态成功");
			}
		},
		// 获取点名状态信息
		async getCallStatusInfo(type) {
			const { controlCode } = uni.getStorageSync("controlInfo");
			let params = {
				controlCode,
				type,
			};
			let res = await Api.apiCall("get", Api.index.getMediaStatusInfo, params);
			if (res.state.code == 200) {
				if (res.data.roomList.length) {
					this.connectedNum = 0;
					this.disconnectNum = 0;
					this.callState = true;
					this.roomTableList = res.data.roomList;
					this.roomTableList.map((room) => {
						if (room.status == "0") {
							this.connectedNum++;
						} else {
							this.disconnectNum++;
						}
					});
					this.isRoomAll = true;
					this.roomSelectList = this.roomTableList;
					this.selectedNum = this.roomSelectList.length;
				} else {
					if (this.callState) {
						this.callState = false;
						this.handleRemoveAll();
					}
				}
				if (this.page == 0) {
					this.terminalList.children.map((list) => {
						list.children.map((item) => {
							item._checked = false;
							this.roomTableList.map((room) => {
								if (item.terminalCode == room.terminalCode) {
									item._checked = true;
								}
							});
						});
						list._checked = list.children.every((item) => item._checked);
					});
				} else {
					this.groupList.children.map((list) => {
						list.children.map((item) => {
							item._checked = false;
							this.roomTableList.map((room) => {
								if (item.terminalCode == room.terminalCode) {
									item._checked = true;
								}
							});
						});
						list._checked = list.children.every((item) => item._checked);
					});
				}
			}
		},
		// 分机连接状态
		getConnectInfo(data) {
			this.connectedNum = 0;
			this.disconnectNum = 0;
			this.roomTableList.map((item, index) => {
				data.map((res) => {
					if (res.name == item.name) {
						if (res.status == "0") {
							this.connectedNum++;
						}
						if (res.status == "1") {
							this.disconnectNum++;
						}
						item.status = res.status;
						this.roomTableList.splice(index, 1, item);
					}
				});
			});
			setTimeout(() => {
				// 获取点名状态信息
				this.getCallStatusInfo("600");
			}, 3000);
		},
		// 点名时长
		durationChange(e) {
			this.duration = e.detail.value;
		},
		// 选择点名间隔
		selectSpaceChange(e) {
			this.callSpace = e.originItem.spacing;
		},
		// 新增点名操作动态
		async setDynamicInfo(type, content) {
			let controlId = uni.getStorageSync("controlInfo").id;
			let operationTime = dateFormat("YYYY-MM-DD", new Date());
			let params = { controlId, type, content, operationTime };
			let res = await Api.apiCall(
				"post",
				Api.index.saveDynamicInfo,
				JSON.stringify(params)
			);
			if (res.state.code == "200") {
				// 刷新动态信息
				this.getDynamicInfo();
			} else {
				currentPages().handleShowToast("请求错误", "center");
			}
		},
		// 添加分组弹框
		handleAddGroup() {
			if (!this.roomSelectList.length) {
				currentPages().handleShowToast("请先选择监室", "center");
				return;
			}
			this.addGroupName = "";
			this.showAddGroup = true;
		},
		// 获取添加分组名称
		addGroupChange(e) {
			this.addGroupName = e.detail.value;
		},
		// 确认添加分组
		addGroupConfirm() {
			if (!this.addGroupName) {
				currentPages().handleShowToast("请输入分组名称", "center");
				return;
			}
			this.addGroup();
			this.closeModal("AddGroup");
		},
		// 添加分组
		async addGroup() {
			let controlId = uni.getStorageSync("controlInfo").id;
			let children = [];
			this.roomSelectList.map((item) => {
				let selectItem = {
					name: item.name,
					id: item.id,
					terminalCode: item.terminalCode,
				};
				children.push(selectItem);
			});
			let params = {
				name: this.addGroupName,
				id: controlId,
				children: children,
			};
			let res = await Api.apiCall("post", Api.index.addGroup, params);
			if (res.state.code == "200") {
				// 获取分组列表信息
				this.getGroupList();
			}
		},
		// 修改分组弹框
		openModifyGroup(list) {
			this.groupId = list.id;
			this.modifyGroupName = list.name;
			this.showModifyGroup = true;
		},
		// 获取修改分组名称
		modifyGroupChange(e) {
			this.modifyGroupName = e.detail.value;
		},
		// 确认修改分组名称
		modifyGroupConfirm() {
			if (!this.modifyGroupName) {
				currentPages().handleShowToast("请输入分组名称", "center");
				return;
			}
			this.$refs.vTree.groupChange = false;
			this.updateGroup();
			this.closeModal("ModifyGroup");
		},
		// 修改分组名称
		async updateGroup() {
			let params = {
				name: this.modifyGroupName,
				id: this.groupId,
			};
			let res = await Api.apiCall("post", Api.index.updateGroup, params);
			if (res.state.code == "200") {
				// 获取分组列表信息
				this.getGroupList();
			}
		},
		// 删除分组弹框
		openDeleteGroup(list) {
			this.groupId = list.id;
			this.showDeleteGroup = true;
		},
		// 确认删除分组
		handleDeleteConfirm() {
			this.$refs.vTree.groupChange = false;
			this.deleteGroup();
			this.closeModal("DeleteGroup");
		},
		// 删除分组
		async deleteGroup() {
			let params = {
				data: {
					id: this.groupId,
				},
			};
			let res = await Api.apiCall("post", Api.index.deleteGroup, params);
			if (res.state.code == "200") {
				// 获取分组列表信息
				this.getGroupList();
			}
		},
		openModal(type) {
			this[`show${type}`] = true;
		},
		closeModal(type) {
			this[`show${type}`] = false;
			if (type == "ModifyGroup") {
				this.$refs.vTree.groupChange = false;
			}
			if (type == "DeleteGroup") {
				this.$refs.vTree.groupChange = false;
			}
		},
	},
};
</script>

<style lang="less">
@import '../../common/less/index.less';
</style>
