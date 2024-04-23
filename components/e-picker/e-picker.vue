<template>
	<div id="multi-selector-picker-view" @click="isShowSelector = !isShowSelector">
		<slot></slot>
		<div class="picker-view-box" :class="{ 'picker-in-box': !isInFullPage }" v-show="isShowSelector">
			<div class="picker-view-warrper keyboard-img">
				<picker-view v-for="(items, index) in range" :key="index" :value="[value[index]]" :data-index="index" @change="change" class="picker-view" indicator-style="height: 50upx;" :mask-style="maskStyle" :style="pickerViewStyle">
					<picker-view-column>
						<view class="item" v-for="(item, indey) in items" :key="indey">{{item}}</view>
					</picker-view-column>
				</picker-view>
			</div>
		</div>
		<span v-if="clearable" class="right-arrow" @click.stop="onClear">
			<span class="iconfont iconshanchu1 clear"></span>
		</span>
	</div>
</template>

<script>
import * as utils from "./e-picker.js";
let defaultValue;
export default {
	data () {
		return {
			range: [],
			value: [],
			isShowSelector: false,
			maskStyle: `background: transparent;`,
			pickerViewStyle: 'width:',
			curPickerTime: ''
		};
	},
	props: {
		mode: {
			type: String,
			default: "date"
		},
		showValue: String,
		startYear: {
			type: [Number, String],
			default: 1949
		},
		endYear: {
			type: [String, Number],
			default: new Date().getFullYear()
		},
		clearable: {
			type: Boolean,
			default: false
		},
		isInFullPage: {
			type: Boolean,
			default: true
		}
	},
	watch: {
		showValue (v) {
			this.init();
		},
		isShowSelector (state) {
			if (state) {
				this.$emit("change", this.curPickerTime);
			}
		}
	},
	created () {
		this.init();
	},
	methods: {
		init () {
			this.range = [];
			this.value = [];
			let l;
			defaultValue = utils.getLocalTime(this.mode);
			if (this.showValue) {
				defaultValue = this.showValue;
			}
			this.curPickerTime = defaultValue;
			utils.checkShowValue(this.mode, defaultValue);
			this.mode == "dateTime" ? (l = 5) : (this.mode == "date" ? (l = 3) : (l = 2));
			this.pickerViewStyle += `${750 / l}upx;`;
			for (let i = 0; i < l; i++) {
				this.range.push([]);
				this.value.push(0);
				this.setColumns(i);
			}
		},
		setColumns (index) {
			const m = this.mode;
			if (m != "time") {
				const showYear = defaultValue.substring(0, 4),
					showMonth = defaultValue.substring(5, 7),
					showDay = defaultValue.substring(8, 10);
				switch (index) {
					case 0:
						const s = +this.startYear,
							e = this.endYear === new Date().getFullYear() ? +this.endYear : +new Date().getFullYear();
						for (let i = s; i < e + 1; i++) {
							this.range[index].push(i + "年");
						}
						this.value[index] = this.range[index].indexOf(showYear + "年");
						break;
					case 1:
						this.range[index] = utils.getArr(1);
						this.value[index] = this.range[index].indexOf(showMonth + "月");
						break;
					case 2:
						this.range[index] = utils.getDayArr(+showYear, +showMonth);
						this.value[index] = this.range[index].indexOf(showDay + "日");
						break;
					case 3:
						const show_h = defaultValue.substring(11, 13);
						this.range[index] = utils.getArr(3);
						this.value[index] = this.range[index].indexOf(show_h + "时");
						break;
					case 4:
						const show_m = defaultValue.substring(14, 16);
						this.range[index] = utils.getArr(4);
						this.value[index] = this.range[index].indexOf(show_m + "分");
						break;
					case 5:
						const show_s = defaultValue.substring(17, 19);
						this.range[index] = utils.getArr(5);
						this.value[index] = this.range[index].indexOf(show_s + "秒");
						break;
				}
			} else {
				switch (index) {
					case 0:
						const show_h = defaultValue.substring(0, 2);
						this.range[index] = utils.getArr(3);
						this.value[index] = this.range[index].indexOf(show_h + "时");
						break;
					case 1:
						const show_m = defaultValue.substring(3, 5);
						this.range[index] = utils.getArr(4);
						this.value[index] = this.range[index].indexOf(show_m + "分");
						break;
					case 2:
						const show_s = defaultValue.substring(6, 8);
						this.range[index] = utils.getArr(5);
						this.value[index] = this.range[index].indexOf(show_s + "秒");
						break;
				}
			}
			this.$forceUpdate();
		},
		columnchange () {
			if (this.mode == "time") return;
			const y = parseInt(this.range[0][this.value[0]]),
				m = parseInt(this.range[1][this.value[1]]);
			this.range[2] = utils.getDayArr(y, m);
			this.$forceUpdate();
		},
		change (e) {
			var index = Number(e.currentTarget.dataset.index);
			const value = e.detail.value[0];
			this.value[index] = value;
			this.columnchange();
			const timeArr = this.value.map((v, i) => {
				return this.range[i][v];
			});
			let curTime = utils.getDateTimeValue(timeArr, this.mode);
			this.curPickerTime = curTime;
			this.$emit("change", curTime);
		},
		onClear () {
			this.$emit('change', '');
		}
	}
};
</script>
<style lang="less">
@hover-color: #c0c4cc;
@arrowWidth: 12%;
@font-face {
	font-family: 'iconfont';
	src: url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAAM8AAsAAAAAB1gAAALvAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCDHAqCEIFsATYCJAMQCwoABCAFhG0HSxthBhEVlKdkPwvsmHgLNqmwEc2pDxvYjI1gkX0f4uFrv9dz3+772RAqQJV8FbKANj5RiB1f1q0ioyorK1THs2Qj0gAJVYn///3mxT27TKyJJ63gD/KkYhr/9woe4ghtLxKJk5AWd7icc+CiJuQLU5SVQ48+ST+l0H2/pM2sm89zOb2VZYHMb1luYy3a0496AWYLKLA9sQ0UaAEFxC2yi7gTF3GaQJtRTbFxcfcIRYYmBeKyjDJQCiFZNrJFaDSszOI11Ep1IQZeRd+P/zAXcip1gmbuHJ/nYeWX9redqtuqPU6AYj4vjHUkNJGJ08bUviQMXtL2m2wJRVHxS/sz/N1+2CZOdizDemP/eBXRgCo7wIKcTvzSUnlmGMoSgt/tChX8EEOBlNvCLsQdpgv8HuNG8wuia9YA1Tfni5TZR1QthTxh8ZM2VCAHtiBtzfWtz1RtObA8IXowr5rzRK4/sRYpfjm1FBA9nrPl/qNAJRZLKJNsUumMKdb3dkIlkqjEtt8VrbNjZgnB48fG1XqNHax98/uI4xs768DFXVceFql2do6594N/t9vl/tw+ZlhKP6ngFjorHQq/AOmpcAlI98L7Pz/KG7P0OqU7+SuqQ7d8OXhYRvZsnLHcTCD4zwpgXfZVyJGzq6byIJiNgyZUaNOGv5ujz885jIPgWkIxOCLYYiRDUkyTmdNErd0CGopltJm1vb5dv3tJ5DDjpYTQ4wMqXT4h6fGZzJwfqA2R/SGlDxGUnsO0o4onyuKUUDLWoDbodPCGuFjE1U9sJispr4r4X6Sxi0IRiZWzD/RIc8wZ56ZkNmAoOLhL56G1ASKFHjWnLXOssmix6UWpDm4nnCJIYqgGlA3oaIFneHMmKp9/Qo2JJVEHqyf9hcio6x0UUjmAfOg9iHUvl4xmjRJjBjBI4IC7NAxZVgBi87Ae0liqHZGIKhluZKD6dH2j+8Jd0AY9MUcVKXLU5I9a6XU7FUcUppMkCss5MAeXmM7a3Q4A')
			format('woff2'),
		url('data:application/x-font-woff;charset=utf-8;base64,d09GMgABAAAAAAM8AAsAAAAAB1gAAALvAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCDHAqCEIFsATYCJAMQCwoABCAFhG0HSxthBhEVlKdkPwvsmHgLNqmwEc2pDxvYjI1gkX0f4uFrv9dz3+772RAqQJV8FbKANj5RiB1f1q0ioyorK1THs2Qj0gAJVYn///3mxT27TKyJJ63gD/KkYhr/9woe4ghtLxKJk5AWd7icc+CiJuQLU5SVQ48+ST+l0H2/pM2sm89zOb2VZYHMb1luYy3a0496AWYLKLA9sQ0UaAEFxC2yi7gTF3GaQJtRTbFxcfcIRYYmBeKyjDJQCiFZNrJFaDSszOI11Ep1IQZeRd+P/zAXcip1gmbuHJ/nYeWX9redqtuqPU6AYj4vjHUkNJGJ08bUviQMXtL2m2wJRVHxS/sz/N1+2CZOdizDemP/eBXRgCo7wIKcTvzSUnlmGMoSgt/tChX8EEOBlNvCLsQdpgv8HuNG8wuia9YA1Tfni5TZR1QthTxh8ZM2VCAHtiBtzfWtz1RtObA8IXowr5rzRK4/sRYpfjm1FBA9nrPl/qNAJRZLKJNsUumMKdb3dkIlkqjEtt8VrbNjZgnB48fG1XqNHax98/uI4xs768DFXVceFql2do6594N/t9vl/tw+ZlhKP6ngFjorHQq/AOmpcAlI98L7Pz/KG7P0OqU7+SuqQ7d8OXhYRvZsnLHcTCD4zwpgXfZVyJGzq6byIJiNgyZUaNOGv5ujz885jIPgWkIxOCLYYiRDUkyTmdNErd0CGopltJm1vb5dv3tJ5DDjpYTQ4wMqXT4h6fGZzJwfqA2R/SGlDxGUnsO0o4onyuKUUDLWoDbodPCGuFjE1U9sJispr4r4X6Sxi0IRiZWzD/RIc8wZ56ZkNmAoOLhL56G1ASKFHjWnLXOssmix6UWpDm4nnCJIYqgGlA3oaIFneHMmKp9/Qo2JJVEHqyf9hcio6x0UUjmAfOg9iHUvl4xmjRJjBjBI4IC7NAxZVgBi87Ae0liqHZGIKhluZKD6dH2j+8Jd0AY9MUcVKXLU5I9a6XU7FUcUppMkCss5MAeXmM7a3Q4A')
			format('woff');
}

.iconfont {
	font-family: 'iconfont' !important;
	font-size: 18.05upx;
	font-style: normal;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}

.iconshanchu1:before {
	content: '\e68c';
}

#multi-selector-picker-view {
	position: relative;
	.picker-view-box {
		z-index: 999;
		width: 100vw;
		height: 100vh;
		position: fixed;
		left: 0;
		top: 0;
		background-color: rgba(0, 0, 0, 0.3);
		&.picker-in-box {
			width: 100%;
			height: 100%;
		}
		.picker-view-warrper {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate3d(-50%, -50%, 0);
			display: flex;
			justify-content: center;
			align-items: center;
			width: 850upx;
			height: 417upx;
			.picker-view {
				height: 50upx;
				line-height: 50upx;
				.item {
					height: 50upx;
					align-items: center;
					justify-content: center;
					text-align: center;
				}
			}
		}
	}
	.right-arrow {
		transition: transform 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
		position: absolute;
		font-size: 1em;
		right: 35upx;
		top: 0;
		display: flex;
		align-items: center;
		color: @hover-color;
		height: 100%;
		font-weight: 100;
		width: @arrowWidth;
		justify-content: center;
	}
	.clear {
		color: #fff;
		line-height: 1;
		background-color: @hover-color;
		border-radius: 50%;
		padding: 1.38upx;
	}
}
</style>