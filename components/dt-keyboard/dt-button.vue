<template>
	<view :class="['btn',hover]" @touchstart="handleStart" @touchend="handleEnd" :style="{'color': color}">
		<slot />
	</view>
</template>

<script>
export default {
	externalClasses: ['btn-class'], 
	props: {
		color: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			hover: ''
		};
	},
	methods: {
		handleStart() {
			this.hover = 'hover';
		},
		handleEnd() {
			this.hover = ''
		}
	}
};
</script>

<style scoped>
.btn {
	vertical-align: middle;
	position: relative;
	border: 0rpx;
	padding: 0;
	margin: 0;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
	text-decoration: none;
	overflow: hidden;
	font-weight: normal;
	width: 100%;
	height: 100%;
	color: #333;
}

.hover::after {
  content: " ";
  width: 200%;
  height: 200%;
  position: absolute;
  top: 0;
  left: 0;
  -webkit-transform: scale(.5);
  transform: scale(.5);
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  box-sizing: border-box;
}
</style>
