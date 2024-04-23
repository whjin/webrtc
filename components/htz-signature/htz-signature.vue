<template>
	<view class="htz-signature-body">
		<canvas :canvas-id="cid" :id="cid" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend"></canvas>
		<view class="htz-signature-fixed-bottom">
			<view class="htz-signature-fixed-bottom-item htz-signature-tools">
				<!-- <view class="htz-signature-tools-item" @click="lineWidth">
					<image src="../../static/htz-signature/bicuxi.png"></image>
					<text>线条</text>
				</view>
				<view class="htz-signature-tools-item" @click="color">
					<image src="../../static/htz-signature/color-plate-fill.png"></image>
					<text>颜色</text>
				</view> -->
				<view class="htz-signature-tools-item" @click="revoke">
					<image src="../../static/htz-signature/chehuinormal.png"></image>
					<text>撤回</text>
				</view>
				<view class="htz-signature-tools-item" @click="clear">
					<image src="../../static/htz-signature/qingkong_1.png"></image>
					<text>清空</text>
				</view>
			</view>
			<view class="htz-signature-fixed-bottom-item submit" @click="submit">{{ btnText }}</view>
		</view>

		<!-- #ifdef APP-PLUS -->
		<view class="htz-signature-color-main" v-if="colorShow">
			<view @click="selColor(index)" :class="index == colorIndex
				? 'htz-signature-color-item on '
				: 'htz-signature-color-item '
				" :style="'background-color:' + item.value" v-for="(item, index) in colorData" :key="index">
				<image class="htz-signature-color-item-icon" src="../../static/htz-signature/on.png"></image>
			</view>
		</view>
		<view class="htz-signature-color-main" v-if="lineWidthShow">
			<view @click="selLineWidth(index)" :class="index == lineWidthIndex
				? 'htz-signature-lineWidth-item on'
				: 'htz-signature-lineWidth-item'
				" v-for="(item, index) in lineWidthData" :key="index">
				<view :style="'width:60%;height:' +
					item +
					'px;background-color:#000000;position: absolute;top: 50%;left: 20%;margin-top:-' +
					item / 2 +
					'px'
					">
				</view>
			</view>
		</view>
		<!-- #endif -->
		<!-- #ifndef APP-PLUS -->
		<cover-view class="htz-signature-color-main" v-if="colorShow">
			<cover-view @click="selColor(index)" :class="index == colorIndex
				? 'htz-signature-color-item on '
				: 'htz-signature-color-item '
				" :style="'background-color:' + item.value" v-for="(item, index) in colorData" :key="index">
				<cover-image class="htz-signature-color-item-icon" src="../../static/htz-signature/on.png">
				</cover-image>
			</cover-view>
		</cover-view>
		<cover-view class="htz-signature-color-main" v-if="lineWidthShow">
			<cover-view @click="selLineWidth(index)" :class="index == lineWidthIndex
				? 'htz-signature-lineWidth-item on'
				: 'htz-signature-lineWidth-item'
				" v-for="(item, index) in lineWidthData" :key="index">
				<cover-view :style="'width:60%;height:' +
					item +
					'px;background-color:#000000;position: absolute;top: 50%;left: 20%;margin-top:-' +
					item / 2 +
					'px'
					">
				</cover-view>
			</cover-view>
		</cover-view>
		<!-- #endif -->
	</view>
</template>

<script>
export default {
	name: "htz-signature",
	props: {
		cid: {
			type: String,
			default: "",
		},
		btnText: {
			type: String,
			default: "提交"
		}
	},
	data() {
		return {
			id: "",
			Strokes: [],
			dom: null,
			width: 0,
			height: 0,
			colorShow: false,
			colorIndex: 0,
			colorData: [
				{
					name: "black",
					value: "#000000",
				},
				{
					name: "red",
					value: "#f34336",
				},
				{
					name: "blue",
					value: "#0238d0",
				},
				{
					name: "green",
					value: "#8bc24b",
				},
				{
					name: "yellow",
					value: "#ffeb3c",
				},
				{
					name: "purple",
					value: "#a603d0",
				},
				{
					name: "grey",
					value: "#a5a5a5",
				},
			],
			lineWidthShow: false,
			lineWidthIndex: 2,
			lineWidthData: ["3", "6", "9", "12", "15", "18"],
		};
	},
	mounted() {
		this.$nextTick(() => {
			// #ifdef H5
			document.body.addEventListener("touchmove", this.touchmoveEnd, {
				passive: false,
			});
			// #endif

			uni.getSystemInfo({
				success: (res) => {
					this.width = res.windowWidth;
					this.height = res.windowHeight;
				},
			});

			this.dom = uni.createCanvasContext(this.cid, this);
		});
	},
	beforeDestroy() {
		// #ifdef H5
		document.body.removeEventListener("touchmove", this.touchmoveEnd, {
			passive: false,
		});
		// #endif
	},
	methods: {
		touchmoveEnd(e) {
			e.preventDefault();
			e.stopPropagation();
		},
		submit() {
			if (this.Strokes.length) {
				uni.canvasToTempFilePath(
					{
						canvasId: this.cid,
						success: (res) => {
							this.$emit("submit", res);
						},
						fail: (err) => {
							this.$emit("fail", err);
						},
					},
					this
				);
			} else {
				uni.showToast({
					title: "签名不能为空",
					position: "center",
					duration: 5000,
					icon: "none",
				});
			}
		},
		clear() {
			//清空
			this.Strokes = [];
			this.dom.clearRect(0, 0, this.width, this.height);
			this.dom.draw();
		},
		lineWidth() {
			this.lineWidthShow = !this.lineWidthShow;
			this.colorShow = false;
		},
		selLineWidth(index) {
			this.lineWidthIndex = index;
			this.lineWidthShow = false;
		},
		color() {
			this.colorShow = !this.colorShow;
			this.lineWidthShow = false;
		},
		selColor(index) {
			this.colorIndex = index;
			this.colorShow = false;
		},
		revoke() {
			//撤销上一步
			this.Strokes.pop();
			this.drawCanves();
		},
		drawCanves() {
			this.Strokes.forEach((item) => {
				let StrokesItem = item;
				if (StrokesItem.points.length > 1) {
					this.dom.beginPath();
					this.dom.setLineCap("round");
					this.dom.setStrokeStyle(item.style.color);
					this.dom.setLineWidth(item.style.lineWidth);
					StrokesItem.points.forEach((sitem, sindex) => {
						if (sitem.type == "touchstart") {
							this.dom.moveTo(sitem.x, sitem.y);
						} else {
							this.dom.lineTo(sitem.x, sitem.y);
						}
					});
					this.dom.stroke();
				}
			});
			this.dom.draw();
		},
		createId() {
			var d = new Date();
			return "can" + d.getTime();
		},
		touchstart(e) {
			this.Strokes.push({
				imageData: null,
				style: {
					color: this.colorData[this.colorIndex].value,
					lineWidth: this.lineWidthData[this.lineWidthIndex],
				},
				points: [
					{
						x: e.touches[0].x,
						y: e.touches[0].y,
						type: e.type,
					},
				],
			});
			this.drawLine(this.Strokes[this.Strokes.length - 1], e.type);
		},
		touchmove(e) {
			this.Strokes[this.Strokes.length - 1].points.push({
				x: e.touches[0].x,
				y: e.touches[0].y,
				type: e.type,
			});
			this.drawLine(this.Strokes[this.Strokes.length - 1], e.type);
		},
		touchend(e) {
			if (this.Strokes[this.Strokes.length - 1].points.length < 2) {
				//当此路径只有一个点的时候
				this.Strokes.pop();
			}
		},
		drawLine(StrokesItem, type) {
			if (StrokesItem.points.length > 1) {
				this.dom.beginPath();
				this.dom.setLineCap("round");
				this.dom.setStrokeStyle(StrokesItem.style.color);
				this.dom.setLineWidth(StrokesItem.style.lineWidth);
				this.dom.moveTo(
					StrokesItem.points[StrokesItem.points.length - 2].x,
					StrokesItem.points[StrokesItem.points.length - 2].y
				);
				this.dom.lineTo(
					StrokesItem.points[StrokesItem.points.length - 1].x,
					StrokesItem.points[StrokesItem.points.length - 1].y
				);
				this.dom.stroke();
				this.dom.draw(true);
			}
		},
	},
};
</script>

<style lang="less" scoped>
.htz-signature-body {
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	background: #fff;

	canvas {
		width: 100%;
		height: 85%;
	}

	.htz-signature-fixed-bottom {
		width: 100%;
		height: 15%;
		box-sizing: border-box;
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		color: #000;
		z-index: 11;
		display: flex;
		align-items: center;
		background-color: #fff;

		.htz-signature-fixed-bottom-item {
			display: flex;
			align-items: center;
			justify-content: center;
			color: rgba(0, 122, 255, 0.9);
			border-top: 1upx solid rgba(0, 122, 255, 0.9);

			.htz-signature-tools-item {
				width: 78upx;
				box-sizing: border-box;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				margin: 0 13.88upx;

				image {
					width: 36upx;
					height: 36upx;
				}

				text {
					font-size: 18.05upx;
					font-weight: bold;
					color: rgba(0, 122, 255, 0.9);
				}
			}
		}

		.htz-signature-tools {
			height: 100%;
			display: flex;
			flex: 1;
			box-sizing: border-box;
		}

		.submit {
			width: 112upx;
			height: 100%;
			background-color: rgba(0, 122, 255, 0.9);
			color: #fff;
			font-size: 18.05upx;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.submit:hover {
			opacity: 0.65;
		}
	}

	.htz-signature-color-main {
		position: absolute;
		bottom: 72upx;
		left: 0;
		right: 0;
		z-index: 11;
		display: flex;
		flex-wrap: wrap;
		background-color: #fff;
		border-top: 1upx solid rgba(0, 122, 255, 0.9);
		transition: display 2s;

		.htz-signature-color-item {
			width: 64upx;
			height: 64upx;
			background-color: #000000;
			border-radius: 100px;
			margin: 5px;
			position: relative;

			.htz-signature-color-item-icon {
				display: none;
			}
		}

		.htz-signature-lineWidth-item {
			width: 64upx;
			height: 64upx;
			background-color: #fff;
			border-radius: 100px;
			margin: 5px;
			position: relative;

			.on {
				border: 1px solid #d4a39e;

				.htz-signature-color-item-icon {
					display: block;
					position: absolute;
					top: 50%;
					left: 50%;
					width: 28upx;
					height: 28upx;
					margin-top: -14upx;
					margin-left: -14upx;
				}
			}
		}
	}
}
</style>
