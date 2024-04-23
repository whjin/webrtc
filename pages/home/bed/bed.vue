<template>
	<view class="bed-container">
		<view class="main-area">
			<view class="uni-flex page-title">
				<text>床位安排表</text>
			</view>
			<view class="content">
				<view class="left-box">
					<view class="tv inner-glow-box">
						<common-icons iconType="icondianshiji" size="45" :iconStyle="gradientsStyle" />
						<text>电视机</text>
					</view>
					<view class="door inner-glow-box">
						<common-icons iconType="iconmen" size="37" :iconStyle="gradientsStyle" />
						<text>门口</text>
					</view>
				</view>
				<view class="beds-details">
					<view class="board-beds-list" v-if="boardBedsList.length">
						<view class="bed-item board-beds" v-for="item in boardBedsList" :key="item.bedNo">
							<text class="name">{{ item.xm || '' }}</text>
						</view>
					</view>
					<view class="floor-beds-list" v-if="floorBedsList.length">
						<view class="bed-item floor-beds" v-for="item in floorBedsList" :key="item.bedNo">
							<text class="name">{{ item.xm || '' }}</text>
						</view>
					</view>
				</view>
				<view class="toilet inner-glow-box">
					<common-icons iconType="iconcesuo" size="33.33" :iconStyle="gradientsStyle" />
					<text>厕所</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import Api from '@/common/api.js';
export default {
	data () {
		return {
			gradientsStyle: {
				'background-image': 'linear-gradient(0deg, #77FFFF, #007AFF)',
				'-webkit-background-clip': 'text',
				'-webkit-text-fill-color': 'transparent'
			},
			boardBedsList: [],
			floorBedsList: [],
		};
	},
	created () {
		// 获取床位安排列表
		this.getBedsList();
		// 开启倒计时
		this.$parent.countTimer();
	},
	methods: {
		async getBedsList () {
			let roomId = uni.getStorageSync("terminalInfo").roomId;
			let params = {
				roomId
			};
			let res = await Api.apiCall('get', Api.prisoner.bed.getBedsList, params, true);
			if (res.state.code == 200) {
				if (Object.keys(res.data).length) {
					const listPerson = res.data.listPerson;
					this.boardBedsList = listPerson.filter(item => item.position == '0');
					this.floorBedsList = listPerson.filter(item => item.position == '1');
					if (this.boardBedsList.length < res.data.maxNumber) {
						const bedNoList = this.boardBedsList.map(item => item.bedNo);
						for (let i = 1; i <= res.data.maxNumber; i++) {
							let flag = bedNoList.includes(i);
							if (!flag) {
								this.boardBedsList.push({ bedNo: i });
							}
						}
						this.boardBedsList.sort((a, b) => {
							return a.bedNo - b.bedNo;
						});
					}
				}
			}
		},
	},
};
</script>

<style lang="less" scoped>
.bed-container {
	width: 100%;
	height: 100%;
	box-sizing: border-box;
}
.inner-glow-box {
	background: rgba(42, 66, 115, 0.51);
	box-sizing: border-box;
	border: 2px solid #00c6ff;
	box-shadow: inset 0upx 0upx 5upx 5upx rgba(25, 106, 190, 0.5);
}

.content {
	position: relative;
	margin: 0 69.44upx;
	padding: 13.89upx 13.89upx 13.89upx 0;
	height: 500upx;
	display: flex;
	border: 2px dashed #35fffa;
	box-sizing: border-box;
	font-size: 0;

	&::before {
		content: '大板';
		display: inline-block;
		position: absolute;
		left: 50%;
		top: 37.5upx;
		transform: translate3d(-50%, 0, 0);
		font-size: 28.33upx;
	}

	&::after {
		content: '通道';
		display: inline-block;
		position: absolute;
		left: 50%;
		bottom: 37.5upx;
		transform: translate3d(-50%, 0, 0);
		font-size: 28.33upx;
	}

	.left-box {
		width: 56.95upx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: flex-start;

		text {
			font-size: 13.89upx;
		}

		.tv,
		.door {
			width: 100%;
			height: 194.45upx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}
	}

	.beds-details {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;

		.board-beds-list,
		.floor-beds-list {
			margin-bottom: 13.89upx;
			display: flex;
			justify-content: flex-start;
			align-items: flex-start;
			.bed-item {
				height: 194.45upx;
				display: flex;
				justify-content: center;
				align-items: center;
				background: rgba(36, 145, 255, 0.2);
				box-sizing: border-box;
				border: 1px solid #2491ff;
				border-left: none;
				.name {
					writing-mode: vertical-lr;
					font-size: 13.89upx;
				}
			}
		}

		.board-beds-list {
			width: 100%;
			.bed-item {
				flex: 1;
			}
		}

		.floor-beds-list {
			margin-bottom: 0;
			.bed-item {
				width: 56.95upx;
				&:first-child {
					border-left: 1px solid #2491ff;
				}
			}
		}
	}

	.toilet {
		position: absolute;
		bottom: 13.89upx;
		right: 13.89upx;
		width: 56.95upx;
		height: 194.45upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		text {
			margin-top: 6upx;
			font-size: 13.89upx;
		}
	}
}
</style>
