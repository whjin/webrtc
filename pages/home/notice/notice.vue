<template>
	<div class="notice-container">
		<div class="notice-wrapper" v-if="noticeList.length">
			<div class="notice-left">
				<scroll-view scroll-y="true" class="notice-left-scroll" @scrolltolower="scrollToLower">
					<div v-for="(item, index) in noticeList" :key="index" class="notice-menu-item" :class="selectInfo.id == item.id ? 'notice-selected-img' : 'notice-img'
						" @click="selectMenuItem(item)">
						<text :class="selectInfo.id == item.id ? 'select-item' : ''">{{
							item.title
						}}</text>
					</div>
				</scroll-view>
			</div>
			<div class="notice-vertical-divider"></div>
			<div class="notice-right">
				<div class="notice-head">
					<div class="notice-title">{{ selectInfo.title }}</div>
					<div class="notice-date">
						发布时间：<span>{{ selectInfo.date }}</span>
					</div>
				</div>
				<scroll-view scroll-y="true" class="notice-right-scroll">
					<div class="ql-container ql-snow">
						<rich-text class="ql-editor rich-text" :data-nodes="content" :nodes="content"
							@dblclick.stop="showPreviewImg"></rich-text>
					</div>
				</scroll-view>
			</div>
		</div>
	</div>
</template>
  
<script>
import Api from "@/common/api.js";
import { isNullStr, dateFormat, currentPage } from "@/common/utils/util.js";

export default {
	name: "notice",
	data() {
		return {
			// 通知公告列表
			noticeList: [],
			// 已选菜单项
			selectInfo: {},
			// 页面索引
			pageIndex: 1,
			// 页面总数
			totalPage: 1,
		};
	},
	computed: {
		// 通知公告详情
		content() {
			return this.selectInfo.details != undefined
				? this.selectInfo.details
				: "";
		},
	},
	created() {
		// 获取通知公告信息
		this.getNoticeInfo(this.pageIndex);
		// 开启倒计时
		currentPage().countTimer();
	},
	methods: {
		// 选择菜单
		selectMenuItem(item) {
			this.selectInfo = item;
		},
		// 获取仓内通知公告信息
		async getNoticeInfo(index) {
			const { roomNo } = uni.getStorageSync("terminalInfo");
			let params = {
				data: {
					type: 6,
					roomNo
				},
				pageParam: {
					pageIndex: index,
					pageSize: 8,
				},
			};
			let res = await Api.apiCall("post", Api.index.getAllNotice, params);
			if (res.state.code == 200) {
				if (!isNullStr(res.data)) {
					this.totalPage = res.page.totalPage;
					let result = res.data;
					result.map((item) => {
						item.date = dateFormat("YYYY-MM-DD hh:mm", new Date(item.date));
					});
					this.noticeList = this.noticeList.concat(result);
					this.selectInfo = this.noticeList[0];
				}
			}
		},
		// 点击预览图片
		showPreviewImg(e) {
			let nodes = e.target.dataset.nodes;
			let imgNode = nodes.match(/<img[^>]+>/g);
			if (!!imgNode) {
				let imgList = [];
				for (let i = 0; i < imgNode.length; i++) {
					imgNode[i].replace(/<img[^>]*src=['"]([^'"]+)[^>]*>/gi, (match, capture) => {
						imgList.push(capture);
					});
				}
				uni.previewImage({
					urls: imgList,
				});
			}
		},
		// 下拉刷新
		scrollToLower(e) {
			if (this.pageIndex < this.totalPage) {
				this.pageIndex++;
				this.getNoticeInfo(this.pageIndex);
			}
		},
	},
};
</script>
  
<style lang="less" scoped>
@import "@/static/quill/quill.core.css";
@import "@/static/quill/quill.snow.css";
@import "@/static/quill/quill.bubble.css";
@import "@/static/quill/quill.font.css";
@import "../../../common/less/index.less";
</style>
  