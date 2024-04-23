<template>
	<view class="check main-area" @click.stop="handleCloseLdSelect">
		<view class="uni-flex page-title">
			<text>安全检查</text>
		</view>
		<view class="uni-flex uni-flex-item" style="height: 85%">
			<view class="uni-flex uni-column page-menu-area">
				<view class="uni-flex uni-column page-menu" :class="currentPage == 1 ? 'page-menu-activate' : ''"
					@click="switchPage(1)">
					<image src="/static/images/room/record.png"
						style="width: 35.41upx; height: 42.36upx; margin-top: 9.72upx">
					</image>
					<text style="line-height: 20.83upx; margin-top: 13.19upx">安全检查\n录入</text>
				</view>
				<view class="uni-flex uni-column page-menu" :class="currentPage == 2 ? 'page-menu-activate' : ''"
					@click="switchPage(2)">
					<image src="/static/images/room/record.png"
						style="width: 35.41upx; height: 42.36upx; margin-top: 9.72upx">
					</image>
					<text style="line-height: 20.83upx; margin-top: 13.19upx">安全检查\n记录</text>
				</view>
			</view>
			<view v-if="currentPage == 1" class="uni-flex uni-column record-registration" style="width: 945upx;">
				<scroll-view scroll-y="true" class="uni-flex-item uni-flex uni-column" style="height: 100%; width: 100%">
					<view class="basic-content">
						<view class="basic-content-item" v-for="item in basicConfig" :key="item.title">
							<text class="title">{{ item.title }}：</text>
							<e-picker v-if="item.inputType == 'date-picker'" mode="dateTime" @change="setStartTime">
								<div class="value had-border date">{{ saveCheckParams[item.value] }}</div>
							</e-picker>
							<xfl-select v-else-if="item.inputType == 'picker'" ref="xflSelect" :clearable="false" :list="checkTypeList"
								@change="setCheckType" :placeholder="'请选择检查类型'" class="xfl-select"></xfl-select>
							<input v-else class="value" :class="{ 'had-border': item.inputType == 'input' }"
								:type="item.value == 'participantsNum' ? 'number' : 'text'" v-model="saveCheckParams[item.value]"
								:disabled="item.inputType == 'text'" @input="handleInputChange" />
						</view>
					</view>
					<view class="primary-content">
						<text class="title">检查内容：</text>
						<ld-select ref="ldSelect" :multiple="true" :list="checkContentList" label-key="value" value-key="code"
							:placeholder="checkContentList.length ? '请选择检查内容' : '请先选择检查类型'" :widthStyle="721" clearable
							v-model="checkContentValue" :disabled="checkContentList.length ? false : true"
							@change="setCheckContent"></ld-select>
					</view>
					<view class="primary-content">
						<text class="title">检查违禁物品：</text>
						<input class="value" v-model="saveCheckParams.checkContraband" type='text'
							@input="handleInputChange" />
					</view>
					<view class="primary-content violate-goods">
						<text class="title">违禁品现场截图：</text>
						<view class="upload-img-box">
							<view class="add-img" @click.stop="startTakePicture">
								<common-icons iconType="iconcamera" size="26" color="#FFFFFF" />
								<text class="text">照片上传</text>
							</view>
							<view class="image-list">
								<view class="goods" v-for="(item, index) in addImgList" :key="item.uri">
									<image class="goods-img" :src="item.uri" @click.stop="previewImg(item.uri)"></image>
									<common-icons iconType="icondelete" size="35" color="#FFFFFF" @click="deleteImg(index)" :iconStyle="{
										'position': 'absolute',
										'top': '5px',
										'right': '5px'
									}" />
								</view>
							</view>
						</view>
					</view>
					<view class="primary-content">
						<text class="title">安全隐患及漏洞：</text>
						<input class="value" v-model="saveCheckParams.remarks" type="text" @input="handleInputChange" />
					</view>
				</scroll-view>
				<view class="btn-box" style="margin-left: 800upx; margin-bottom: 10upx">
					<view @click.stop="save" class="page-button">保存登记</view>
					<view @click.stop="cancel" class="page-button-empty" style="margin-right: 14.58upx">取消登记</view>
				</view>
			</view>
			<view v-if="currentPage == 2" class="uni-flex uni-column" style="width: 1039.58upx; padding-left: 20upx;">
				<view class="search-area">
					<view class="search-params">
						<view class="search-params-item">
							<view class="params-title" style="margin-right: 16.7upx;">监室号：</view>
							<input class="value" type="text" v-model="saveCheckParams.roomName" disabled />
						</view>
						<view class="search-params-item">
							<view class="params-title">记录民警：</view>
							<input class="value" type="text" v-model="personInfo.name" disabled />
						</view>
						<view class="search-params-item">
							<view class="params-title">检查类型：</view>
							<xfl-select :clearable="true" :list="checkTypeList" @change="setSearchType" :placeholder="'请选择检查类型'"
								class="xfl-select"></xfl-select>
						</view>
						<view class="search-params-item">
							<view class="params-title">检查时间：</view>
							<e-picker mode="date" @change="setSearchTime" :clearable="true">
								<div class="value had-border date">{{ searchParams.startTime }}</div>
							</e-picker>
						</view>
					</view>
					<view class="button" @click.stop="searchByParams">
						<view class="buttonText">查询</view>
					</view>
				</view>
				<view class="uni-flex">
					<view class="uni-flex-item table-th table-th-radius-tl">监室号</view>
					<view class="uni-flex-item table-th">检查类型</view>
					<view class="uni-flex-item table-th">检查时间</view>
					<view class="uni-flex-item table-th">检查内容</view>
					<view class="uni-flex-item table-th">违规物品</view>
					<view class="uni-flex-item table-th">检查详情</view>
				</view>
				<view class="uni-flex table-td-divider" v-if="!checkRecordList.length">
					<view class="uni-flex-item table-td" style="text-align: center;">暂无记录</view>
				</view>
				<scroll-view v-else scroll-y="true" style="height: 347upx; width: 100%"
					@scrolltolower="handleSearchDataToLower">
					<view class="uni-flex table-td-divider" v-for="(item, index) in checkRecordList" :key="index">
						<view class="uni-flex-item table-td">{{ saveCheckParams.roomName }}</view>
						<view class="uni-flex-item table-td">{{ item.checkType }}</view>
						<view class="uni-flex-item table-td">{{ item.checkStartTime }}</view>
						<view class="uni-flex-item table-td">{{ item.checkContentValue }}</view>
						<view class="uni-flex-item table-td">{{ item.checkContraband }}</view>
						<view class="uni-flex-item table-td"><a class="check-btn" @click.stop="checkDetail(item)">查看</a>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<div class="neil-modal-container">
			<neil-modal :show="isShowCheckDetail" :autoClose="true" @close="handleCloseCheckDetail">
				<view class="modal-header">
					<view class="modal-title">检查详情</view>
					<div class="modal-close" @click.stop="handleCloseCheckDetail">
						<image src="/static/images/common/close.png"></image>
					</div>
				</view>
				<view class="page-horizontal-divider" style="margin-bottom: 28upx;"></view>
				<scroll-view class="check-detail" scroll-y>
					<view class="basic-content">
						<view class="basic-content-item" v-for="item in detailConfig" :key="item.value">
							<text class="title">{{ item.title }}：</text>
							<input v-if="item.value == 'roomName' || item.value == 'registerPolice'" class="value had-border"
								v-model="saveCheckParams[item.value]" disabled />
							<input v-else class="value had-border" v-model="selectRecord[item.value]" disabled />
						</view>
					</view>
					<view class="primary-content violate-goods">
						<text class="title">检查内容：</text>
						<scroll-view class="value" style="height: 72.4upx;" scroll-y="true">
							<textarea :value="selectRecord.checkContentValue" disabled auto-height :maxlength="-1"
								style="width: 100%; font-size: 18.06upx; line-height: 36.2upx" />
						</scroll-view>
					</view>
					<view class="primary-content">
						<text class="title">查出违禁物品：</text>
						<input class="value" v-model="selectRecord.checkContraband" disabled />
					</view>
					<view class="primary-content violate-goods">
						<text class="title">违禁品现场截图：</text>
						<view class="upload-img-box">
							<view class="image-list">
								<view class="goods" v-for="url in selectRecord.urls" :key="url">
									<image class="goods-img" :src="url" @click.stop="previewImg(url)"></image>
								</view>
							</view>
						</view>
					</view>
					<view class="primary-content">
						<text class="title">安全隐患及漏洞：</text>
						<uni-tooltip :content="selectRecord.remarks">
							<input class="value" v-model="selectRecord.remarks" disabled />
						</uni-tooltip>
					</view>
				</scroll-view>
			</neil-modal>
			<!-- 照片预览弹框 -->
			<neil-modal :show="isShowPreviewModal" :autoClose="true" @close="handleClosePreviewModal">
				<view class="modal-header">
					<view class="modal-title">照片预览</view>
					<div class="modal-close" @click.stop="handleClosePreviewModal">
						<image src="/static/images/common/close.png"></image>
					</div>
				</view>
				<image class="preview-img" :src="previewImgUrl" @click.stop="handleClosePreviewModal"></image>
			</neil-modal>
			<!-- 拍照弹框 -->
			<neil-modal :show="showTakePicture" :autoClose="true" @close="stopFacePreview">
				<div class="common-modal-container  picture-modal-container">
					<div class="common-modal-content"></div>
					<div class="common-modal-button">
						<div class="btn-cancel" @click="stopFacePreview">取消</div>
						<div class="btn-confirm" @click.stop="handleTakePicture">
							拍照
						</div>
					</div>
				</div>
			</neil-modal>
		</div>
	</view>
</template>

<script>
import Api from '@/common/api.js';
import navBar from "@/components/nav-bar/nav-bar.vue";
import { mapState, mapMutations } from "vuex";
import neilModal from "@/components/neil-modal/neil-modal.vue";
import xflSelect from "@/components/xfl-select/xfl-select.vue";
import ldSelect from "@/components/ld-select/ld-select.vue";
import sunuiUpimg from "@/components/sunui-upimg/sunui-upimg.vue";
import ePicker from "@/components/e-picker/e-picker.vue";
import hTimePicker from "@/components/h-timePicker/h-timePicker.vue";
import commonIcons from "@/components/common-icons/common-icons.vue";
import { getDate } from '@/common/utils/util.js';
import uniTooltip from "@/components/uni/uni-tooltip/uni-tooltip.vue";
import { base64ToPath } from "@/common/utils/imageTools.js";

export default {
	components: {
		commonIcons,
		navBar,
		neilModal,
		xflSelect,
		ldSelect,
		sunuiUpimg,
		ePicker,
		hTimePicker,
		uniTooltip
	},
	data() {
		return {
			// 提交记录基础内容展示配置
			basicConfig: [
				{
					title: '监室号',
					value: 'roomName',
					inputType: 'text'
				},
				{
					title: '开始检查时间',
					value: 'startTime',
					inputType: 'date-picker'
				},
				{
					title: '登记时间',
					value: 'registerTime',
					inputType: 'text'
				},
				{
					title: '检查类型',
					value: 'inspectionType',
					inputType: 'picker'
				},
				{
					title: '记录民警',
					value: 'registerPolice',
					inputType: 'text'
				},
				{
					title: '参加人数',
					value: 'participantsNum',
					inputType: 'input'
				}
			],
			// 详情弹框信息配置
			detailConfig: [
				{
					title: '监室号',
					value: 'roomName'
				},
				{
					title: '开始检查时间',
					value: 'checkStartTime'
				},
				{
					title: '登记时间',
					value: 'checkRegisterTime'
				},
				{
					title: '检查类型',
					value: 'checkType'
				},
				{
					title: '记录民警',
					value: 'registerPolice'
				},
				{
					title: '参加人数',
					value: 'num'
				}
			],
			// 当前页面 1：提交记录 2：查询记录
			currentPage: 1,
			// 查看详情弹框
			isShowCheckDetail: false,
			// 照片预览弹框
			isShowPreviewModal: false,
			// 检查类型列表
			checkTypeList: [],
			// 提交记录时已选择的检查内容
			checkContentValue: [],
			checkContentConfig: {},
			// 添加图片列表
			addImgList: [],
			// 提交记录参数
			saveCheckParams: {
				roomName: uni.getStorageSync("terminalInfo").roomName,
				registerPolice: '', // 登记民警名称
				imgUrl: '', // 违规图片
				roomNo: uni.getStorageSync("terminalInfo").roomNo,
				inspectionType: '', // 检查类型
				participantsNum: '', // 参加人数
				checkContent: [], // 检查内容
				checkContraband: '', // 违禁物品
				accountName: '', // 记录民警
				startTime: getDate(new Date().getTime(), 'minutes'), // 开始检查时间
				registerTime: getDate(new Date().getTime(), 'minutes'),
				remarks: '', // 安全隐患
				status: 1
			},
			// 检查记录列表
			checkRecordList: [],
			// 查询参数
			searchParams: {
				roomNo: uni.getStorageSync("terminalInfo").roomNo,
				accountName: '',
				inspectionType: '',
				startTime: '',
			},
			// 查询分页参数
			pageParam: {
				pageIndex: 1,
				pageSize: 10
			},
			// 数据总量
			searchDataTotal: 0,
			// 被选中记录
			selectRecord: {},
			// 被预览图片url
			previewImgUrl: '',
			// 当前时间戳
			nowTimestamp: 0,
			// 拍照弹框
			showTakePicture: false,
			// 禁止重复操作
			isRepeatState: false,
		};
	},
	computed: {
		...mapState({
			// 登录人员信息
			personInfo: (state) => state.app.personInfo
		}),
		// 检查内容列表
		checkContentList() {
			let curContentList = (this.checkTypeList && this.checkTypeList.find(item => item.code == this.saveCheckParams.inspectionType)) || null;
			if (curContentList) {
				return curContentList.content;
			} else {
				return [];
			}
		}
	},
	created() {
		this.saveCheckParams.accountName = this.personInfo.code;
		this.saveCheckParams.registerPolice = this.personInfo.name;
		this.searchParams.accountName = this.personInfo.code;
		this.setBottomBar(false);
		// 获取检查类型、内容
		this.getCheckTypeAndContent();
		// 开启倒计时
		this.$parent.countTimer();
	},
	beforeDestroy() {
		this.stopFacePreview();
	},
	methods: {
		...mapMutations({
			// 设置状态栏显隐
			setBottomBar: "app/SET_BOTTOMBAR",
		}),
		// 点击页面,重置倒计时
		handleCloseLdSelect () {
			this.$refs.ldSelect && this.$refs.ldSelect.hideModal();
		},
		// 监听键盘事件
		handleInputChange (e) {
			this.$parent.initCountTimeout();
		},
		// 时间戳转换
		getDate(timestamp, type) {
			return getDate(timestamp, type);
		},
		// 照片预览
		previewImg(url) {
			this.previewImgUrl = url;
			this.isShowPreviewModal = true;
		},
		// 获取检查类型、内容
		async getCheckTypeAndContent() {
			let res = await Api.apiCall('get', Api.police.getCheckTypeAndContent, null, true);
			if (res.state.code == 200) {
				let data = res.data;
				// 检查类型
				this.checkTypeList = data;
				// 检查内容配置列表
				let checkContentConfig = {};
				this.checkTypeList.forEach(item => {
					item.content.forEach(i => {
						checkContentConfig[i.code] = i.value;
					});
				});
				this.checkContentConfig = checkContentConfig;

				this.nowTimestamp = res.date || new Date().getTime();
				this.saveCheckParams.registerTime = getDate(this.nowTimestamp, 'minutes');
			}
		},
		// 保存检查类型
		setCheckType(params) {
			this.checkContentValue = [];
			this.saveCheckParams.inspectionType = params.originItem.code;
		},
		// 保存检查内容
		setCheckContent(params) {
			if (!params.length) {
				this.checkContentValue = [];
			}
			this.saveCheckParams.checkContent = params.join(',');
		},
		// 保存检查时间
		setStartTime(time) {
			this.saveCheckParams.startTime = time;
		},
		// 拍照
		handleTakePicture() {
			if (!this.isRepeatState) {
				this.isRepeatState = true;
				setTimeout(() => {
					this.isRepeatState = false;
				}, 1500);
				getApp().globalData.FloatUniModule.takePicture();
			}
		},
		// 开始拍照
		startTakePicture() {
			this.showTakePicture = true;
			this.$nextTick(() => {
				getApp().globalData.FloatUniModule.initFrame();
				getApp().globalData.FloatUniModule.setLocalVideoViewPosition(420, 210, 440, 268);
				getApp().globalData.FloatUniModule.hideLocalPreView(false);
				getApp().globalData.FloatUniModule.setViewWidthHeight(440, 268);
				getApp().globalData.FloatUniModule.startTakeFrame();
				getApp().globalData.FloatUniModule.takePictureCallBack((res) => {
					let base64Str = res.bytes.replace(/[\r\n]/g, "");
					base64ToPath(`data:image/jpeg;base64,${base64Str}`).then(uri => {
						this.stopFacePreview();
						if (this.addImgList.length < 4) {
							this.addImgList.push({ uri });
						} else {
							this.$parent.handleShowToast("最多上传4张照片", "center");
						}
					});
				});
			});
		},
		// 关闭相机
		stopFacePreview() {
			this.showTakePicture = false;
			getApp().globalData.FloatUniModule.stopTakeFrame();
			getApp().globalData.FloatUniModule.hideLocalPreView(true);
		},
		// 删除照片
		deleteImg(index) {
			this.addImgList.splice(index, 1);
		},
		// 上传图片
		uploadImg() {
			this.$parent.handleShowToast("提交保存登记中...", "center");
			if (!this.addImgList.length) {
				this.saveCheckParams.imgUrl = '';
				this.saveCheck();
				return;
			}
			this.addImgList.map((item, index) => {
				item.name = 'image' + index;
			});
			const baseUrl = uni.getStorageSync("baseUrl");
			uni.uploadFile({
				url: baseUrl + Api.index.upload,     // 后端api接口
				files: this.addImgList, // 图片路径
				formData: {
					fileType: 'SECURITY_CHECK_IMAGE'
				},
				header: {
					'Content-Type': 'multipart/form-data'
				},
				success: (res) => {
					let data = JSON.parse(res.data);
					if (data.state.code == 200) {
						let imgIdList = data.data;
						this.saveCheckParams.imgUrl = imgIdList.toString();
						this.saveCheck();
					}
				}
			});
		},
		// 点击保存登记
		save() {
			if (!this.saveCheckParams.startTime) {
				return this.$parent.handleShowToast("请选择开始检查时间！", "center");
			}
			if (!this.saveCheckParams.inspectionType) {
				return this.$parent.handleShowToast("请选择检查类型！", "center");
			}
			if (!this.saveCheckParams.participantsNum) {
				return this.$parent.handleShowToast("参加人数请输入数字！", "center");
			}
			if (!this.saveCheckParams.checkContent.length) {
				return this.$parent.handleShowToast("请添加检查内容！", "center");
			}
			this.uploadImg();
		},
		// 保存登记
		async saveCheck() {
			let res = await Api.apiCall('post', Api.police.saveCheck, this.saveCheckParams, true);
			if (res.state.code == 200) {
				this.$parent.handleShowToast(res.data, "center");
				this.resetSaveCheckParams();
			}
		},
		cancel() {
			this.$parent.onClickBack();
		},
		// 重置提交参数
		resetSaveCheckParams() {
			this.addImgList = [];
			this.checkContentValue = [];
			this.saveCheckParams = Object.assign({}, this.saveCheckParams, {
				roomName: uni.getStorageSync("terminalInfo").roomName,
				registerPolice: this.personInfo.name, // 登记民警名称
				imgUrl: '', // 违规图片
				roomNo: uni.getStorageSync("terminalInfo").roomNo,
				participantsNum: '', // 参加人数
				checkContent: [], // 检查内容
				checkContraband: '', // 违禁物品
				accountName: this.personInfo.code, // 记录民警
				startTime: '', // 开始检查时间
				registerTime: getDate(this.nowTimestamp, 'minutes'),
				remarks: '', // 安全隐患
				status: 1
			});
		},
		// 切换页面
		switchPage(page) {
			if (page == 1) {
				this.saveCheckParams.inspectionType = '';
				this.checkContentValue = [];
			}
			if (page == 2) {
				this.resetSearchData();
			}
			this.currentPage = page;
		},
		// 查询检查类型
		setSearchType(params) {
			this.searchParams.inspectionType = params.originItem.code;
		},
		// 查询检查时间
		setSearchTime(time) {
			this.searchParams.startTime = time;
		},
		// 查询记录
		searchByParams() {
			this.pageParam.pageIndex = 1;
			this.getCheckRecord();
		},
		// 查询
		async getCheckRecord() {
			let params = Object.assign({}, {
				data: this.searchParams
			}, {
				pageParam: this.pageParam
			});
			let res = await Api.apiCall('post', Api.police.getCheckRecord, params, true);
			if (res.state.code == 200) {
				let data = res.data || [];
				let total = (res.page && res.page.total) || 0;
				if (this.pageParam.pageIndex == 1) {
					this.checkRecordList = data;
				} else {
					this.checkRecordList = this.checkRecordList.concat(data);
				}
				this.searchDataTotal = total;
				this.checkRecordList.forEach(item => {
					let checkContent = [];
					item.checkContent.forEach(i => {
						checkContent.push(this.checkContentConfig[i]);
					});
					item.checkContentValue = checkContent.join('\n');
					item.checkStartTime = getDate(item.startTime, 'minutes');
					item.checkRegisterTime = getDate(item.registerTime, 'minutes');
				});
			}
		},
		// 查看详情
		checkDetail(item) {
			this.selectRecord = item;
			this.isShowCheckDetail = true;
		},
		handleSearchDataToLower() {
			if (this.checkRecordList.length >= this.searchDataTotal) {
				return this.$parent.handleShowToast("暂无更多数据", "center");
			}
			this.pageParam.pageIndex += 1;
			this.getCheckRecord();
		},
		// 重置查询信息
		resetSearchData() {
			const { roomNo } = uni.getStorageSync("terminalInfo");
			this.searchParams = {
				roomNo,
				accountName: this.personInfo.code,
				inspectionType: '',
				startTime: '',
			};
			this.pageParam = {
				pageIndex: 1,
				pageSize: 10
			};
			this.checkRecordList = [];
		},
		// 关闭详情弹框
		handleCloseCheckDetail() {
			this.isShowCheckDetail = false;
		},
		// 关闭照片预览弹框
		handleClosePreviewModal() {
			this.isShowPreviewModal = false;
		},
		isNumber(val) {
			let regPos = /^\d+(\.\d+)?$/; // 非负浮点数
			let regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; // 负浮点数
			if (regPos.test(val) && regNeg.test(val)) {
				return true;
			} else {
				return false;
			}
		}
	},
};
</script>

<style scoped lang="less">
.check {
	.page-menu-area {
		box-sizing: border-box;
		border-right: 1px solid #00c6ff;
	}

	.title {
		flex: 1;
		text-align: end;
		font-size: 20.83upx;
	}

	.value {
		padding-left: 12upx;
		height: 36.2upx;
		line-height: 36.2upx;
		box-sizing: border-box;
		font-size: 18.06upx;

		&.had-border {
			box-shadow: 0px 0px 6px 0px rgb(27, 146, 239) inset;
			background: rgba(27, 146, 239, 0.25);
			border: #1b92ef 1px solid;
			border-radius: 1px;
		}
	}

	.table-td {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 17upx;
	}

	.check-btn {
		font-weight: bold;
		text-decoration: underline;
		color: #35fffa;
	}

	.date {
		position: relative;

		&::after {
			position: absolute;
			right: 10.4upx;
			bottom: 6.95upx;
			content: '';
			display: inline-block;
			width: 20.83upx;
			height: 20.83upx;
			background-image: url('../../../static/images/check/calendar.png');
			background-size: cover;
		}
	}
}

.basic-content {
	width: 100%;
	display: flex;
	justify-content: flex-start;
	align-items: flex-start;
	flex-wrap: wrap;

	.basic-content-item {
		margin-bottom: 15.28upx;
		width: 50%;
		display: flex;
		justify-content: flex-end;
		align-items: center;

		.value {
			width: 250upx;
		}
	}
}

.show-box {
	position: relative;
	margin-left: 3.88upx;
}

.primary-content {
	margin-bottom: 15.28upx;
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;

	&.violate-goods {
		align-items: flex-start;
	}

	.value {
		width: 721upx;
		box-shadow: 0px 0px 6px 0px rgb(27, 146, 239) inset;
		background: rgba(27, 146, 239, 0.25);
		border: #1b92ef 1px solid;
		border-radius: 1px;
	}

	.upload-img-box {
		padding: 14upx;
		display: flex;
		justify-content: flex-start;
		align-items: flex-start;
		width: 721upx;
		height: 160upx;
		box-sizing: border-box;
		box-shadow: 0px 0px 6px 0px rgb(27, 146, 239) inset;
		background: rgba(42, 66, 115, 0.3);
		border: #1b92ef 1px solid;
		border-radius: 1px;

		.add-img {
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;
			width: 89upx;
			height: 76.39upx;
			border: 1px dashed #fff;

			.text {
				margin-top: 5upx;
				color: #fff;
				font-size: 18.06upx;
			}
		}

		.image-list {
			height: 100%;
			box-sizing: border-box;
			display: flex;
			flex: 1;
			flex-wrap: wrap;
			overflow: auto;

			.goods {
				position: relative;
				margin: 0 0 10.88upx 10.88upx;
				width: 136upx;
				height: 122upx;
				box-sizing: border-box;
				border: 1px solid #2a4273;
				border-radius: 3.88upx;

				.goods-img {
					width: 100%;
					height: 100%;
				}
			}
		}
	}
}

.search-area {
	display: flex;
	justify-content: flex-start;
	align-items: center;
	width: 100%;

	.search-params {
		flex: 1;
		display: flex;
		justify-content: flex-start;
		align-items: flex-start;
		flex-wrap: wrap;

		.search-params-item {
			margin-bottom: 13.9upx;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			width: 50%;

			.params-title {
				font-size: 18.06upx;
			}

			.value {
				width: 250upx;
			}
		}
	}
}

.record-registration {
	position: relative;

	.btn-box {
		position: absolute;
		right: -167upx;
		bottom: 0;

		.page-button-empty {
			margin-top: 14upx;
		}
	}
}

.xfl-select {
	position: relative;
	font-size: 18.06upx;
}

.button {
	margin-right: 69.5upx;
	padding: 13.9upx 37.5upx;
	border: 1px solid rgba(0, 122, 255, 1);
	border-radius: 2.77upx;
	display: flex;
	justify-content: center;
	align-items: center;
	background: rgba(0, 122, 255, 1);
}

.buttonText {
	font-size: 18.06upx;
}

.check-detail {
	padding: 0 27.77upx;
	width: 902.8upx;
	height: 535upx;
}

.modal-header {
	padding: 0 27.77upx;
	height: 61.11upx;
	display: flex;
	align-items: center;
	justify-content: space-between;

	.modal-title {
		height: 100%;
		display: flex;
		align-items: center;
		font-size: 22.22upx;
		font-weight: 500;
		color: #35fffa;
	}

	.modal-close {
		height: 100%;
		width: 22upx;
		display: flex;
		justify-content: center;
		align-items: center;

		image {
			height: 22upx;
			width: 22upx;
		}
	}
}

.preview-img {
	width: 902.8upx;
	height: 577.3upx;
}

.picture-modal-container {
	height: 500upx;
}</style>
