<template>
	<view class="w_table">
		<view class="w_table_swper">
			<view class="w_table_content">
				<!-- 表头 -->
				<view class="w-table_title">
					<view class="w-table_title_item" v-for="(item,index) in columns"
					 :key="index" :style="{ width:item.width?item.width+'upx':'200upx',textAlign:item.align||'left' }">
						<view class="w_table_title_content" v-if="item.type==='checkbox'">
							<checkbox class="w_table_checkbox" @click.native.stop="checkHeader" :checked="allCheck" />
						</view>
						<view class="w_table_title_content" v-if="item.type==='index'">#</view>
						<text class="w_table_title_content" v-if="item.title">{{ item.title }}</text>
					</view>
				</view>
				<!-- 表体 -->
				<view class="" v-if="data.length" v-for="(item,index) in data" :key="index" >
					<view class="w_table_body">
						<view class="w_table_body_col" v-for="(col,cIndex) in columns" :key="cIndex" :style="{  width:col.width?col.width+'upx':'200upx', textAlign:col.align||'left' }"
						 @click="clickRow(item,index)">
							<view class="col_cell">
								<view class="col_text">
									<checkbox v-if="col.type==='checkbox'" :checked="item._isChecked" @click.native.stop="checkItemCheckbox(item,index)" />
									<view v-if="col.type==='index'">
										{{ index+1 }}
									</view>
									<!-- <tableRender v-if="col.render" :row="item" :column="col" :index="index" :render="col.render" /> -->
									<!-- <text v-else-if="!col.render" v-html="item[col.key]"></text> -->
									<text style="font-size: 18upx;">{{ item[col.key]}}</text>
								</view>
							</view>
						</view>
					</view>
					<image class="col_bottom_line" src="../../static/images/table/bottom.png"></image>
				</view>
			</view>
			<view v-if="data.length == 0" class="w_table_null">
				<view>{{ noDataText }}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			/**
			 * data要传入的饿数据数组
			 */
			data: {
				type: Array,
				default () {
					return []
				},
				required: true
			},
			columns: {
				type: Array,
				default () {
					return []
				}
			},
			border: {
				type: Boolean,
				default: false
			},
			height: {
				type: [Number, String],
				default: 0
			},
			headbBackground: {
				type: String,
				default: "url(../../static/images/table/title-tr.png)"
			},
			noDataText: {
				type: String,
				default: "暂无数据"
			}

		},
		data: () => {
			return {
				allCheck: false
			}
		},
		methods: {
			/** 
			 * 	-- 单击某一行时触发
			 * @param {Object} item为当前行的数据
			 * @param {Object} index为当前行的下标
			 */
			clickRow(row, index) {
				let params = {
					row,
					index
				}
				this.$emit('on-row-click', params)
			},
			/**
			 * 	--	 点击全选
			 */
			checkHeader() {
				this.allCheck = !this.allCheck;
				this.data.forEach(it => {
					it._isChecked = this.allCheck;
				})
				this.$emit('on-select-all', {
					allChecked: this.data.filter(item => item._isChecked)
				})
			},
			/**
			 * 	--	点击单选
			 */
			checkItemCheckbox(item) {
				item._isChecked = !item._isChecked;
				this.data.forEach(it => {
					if(!it._isChecked){
						this.allCheck = false;
					}
				})
				let ary = this.data.filter(item => item._isChecked); //已选择的项
				if(ary.length == this.data.length){
					this.allCheck = true
				}
				this.$emit('on-select', {
					allChecked: ary,
					checked: item
				})
			}
		},
		created() {
			this.columns.forEach(it => {
				it.type = it.type || 'html';
				if (it.render) {
					it.type = "render"
				}
			})
			this.data.forEach(it => {
				it._isChecked = false;
			})
		},
		mounted() {

		},
		computed: {

		}

	}
</script>

<style>
	.w_table {
		width: 100%;
		position: relative;
		display: inline-block;
		height: 100%;
		min-height: 130upx;
		min-width: 100%;
		/* background:rgba(93,166,222,0.12); */
		font-size: 14upx;
		/* box-sizing: border-box; */
		overflow: scroll;
	}

	.w_table_swper {
		width: 100%;
		height: 100%;
		/* box-sizing: border-box; */
	}

	.w_table_content {
		height: 100%;
		width: 100%;
	}

	.w-table_title {
		width: 100%;
		height: 60upx;
		display: flex;
		justify-content: space-between;
		line-height: 60upx;
		position: sticky;
		top: 0;
		left: 0;
		z-index: 1;
		background: url(../../static/images/table/title-tr.png);
		background-size: 100% 100%;
	}

	.w-table_title_item {
		display: inline-block;
	}

	.w_table_title_content {
		padding: 0 10upx;
	}

	.w_table_body {
		display: flex;
		justify-content: space-between;
	}

	.w_table_body_col {
		height: 57upx;
		line-height: 57upx;
		box-sizing: border-box;
		width: 100%;
		/* margin: 0 auto; */
	}

	.w_table_body_col>.col_cell {
		display: inline-block;
		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.w_table_body_col>.col_bottom {
			width:1075upx;
			height:3upx;
			background:rgba(0,198,255,1);
			opacity:0.3;
	}

	.col_cell_last {
		border: none;
	}

	.col_text {
		display: inline-block;
		padding: 0 10upx;
		margin: 0 auto;
	}

	.w_table_null {
		width: 100%;
		height: 57upx;
		position: absolute;
		top: 60upx;
		line-height: 57upx;
		text-align: center;
	}
	
	.col_bottom_line {
		width: 100%; 
		height: 3upx;
		position: absolute;
	}
	
	uni-checkbox .uni-checkbox-input {
		/* background: url(../../static/images/table/selectBox.png); */
		border: 1px solid #346C9B;
	}
</style>
