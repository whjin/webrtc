<!--
	更新时间：2020年1月10日
	版本号：2.63
	各位可以按需求更改兼容阿里云、七牛云、腾讯云以及其它(从老项目抽取导入一些JavaScript即可) - 有时间就进行迭代以前的版本
 -->

<template name="sunui-upimg">
	<view class="sunui-uploader-bd">
		<view class="sunui-uploader-files">
			<block v-for="(item, index) in upload_before_list" :key="index" v-show="upload_before_list.length > 0">
				<view class="sunui-uploader-file" :class="[
            item.upload_percent < 100 ? 'sunui-uploader-file-status' : '',
          ]" @click="previewImage(index)">
					<image class="sunui-uploader-img" :style="
              'width:' + upload_img_wh + 'rpx;height:' + upload_img_wh + 'rpx;'
            " :src="item.path" mode="aspectFill" />
					<!-- <view class="sunui-img-removeicon right" @click.stop="removeImage(index)" v-show="upimg_move">x</view> -->
					<!-- <view class="sunui-loader-filecontent" v-if="item.upload_percent<100">{{item.upload_percent}}%</view> -->
				</view>
			</block>
			<view v-show="upload_before_list.length < upload_count" hover-class="sunui-uploader-hover" class="sunui-uploader-inputbox" @click="chooseImage" :style="
          'width:' + upload_icon_wh + 'rpx;height:' + upload_icon_wh + 'rpx;'
        ">
				<view :style="'line-height:' + upload_icon_wh + 'rpx;'"><text class="iconfont icon-mn_shangchuantupian" style="color: white"></text></view>
			</view>
		</view>
	</view>
</template>

<script>
// var _self;
export default {
	data () {
		return {
			// 上传图片格式限制
			upload_format: ["jpg", "jpeg", "png"],
			// 选择图片tempFile
			upload_cache: [],
			// 预览数组->支持从服务器拉取
			upload_cache_list: [],
			// 上传数组
			upload_before_list: [],
			// 图片大小
			upload_img_size: [],
			// 超出限制数组
			upload_exceeded_list: [],
			// 上传数量
			upload_count: 9,
			// 最大上传容量(M)
			upload_max: 1,
			//// 上传图标宽高
			upload_icon_wh: 81,
			// 图片/选择宽高
			upload_img_wh: 162,
			// 测试接口(建议七牛、阿里云、腾讯云都采用后端对接，直接调用后端上传)
			url: "https://a3.dns06.net.cn/app/index.php?i=2&c=entry&a=wxapp&do=Upload_qiniu_b&m=jzwx_a",
		};
	},
	name: "sunui-upimg",
	props: {
		upload_auto: {
			type: Boolean,
			default: true,
		},
		upimg_move: {
			type: Boolean,
			default: true,
		},
	},
	created () {
		// _self = this;
	},
	mounted () {
		let _self = this;
		_self.$nextTick(function () {
			_self.upload_before_list.map(function (item) {
				_self.upload_cache_list.push(item.path);
			});
			// _self.upimg_move = true;
			_self.emit();
		});
	},
	methods: {
		upImage (paths) {
			let _self = this;
			const promises = paths.map((path) => {
				return promisify(upload)({
					url: _self.url,
					path: path,
					name: "file",
					extra: {},
				});
			});
			Promise.all(promises)
				.then((data) => {
					uni.hideLoading();
					_self.upload_cache_list.push(...data);
					_self.emit();
				})
				.catch((res) => {
					uni.hideLoading();
				});
		},
		chooseImage () {
			let _self = this;
			uni.chooseImage({
				count: _self.upload_count - _self.upload_before_list.length,
				sizeType: ["compressed", "original"],
				sourceType: ["album", "camera"],
				success: async (res) => {
					for (let i = 0, len = res.tempFiles.length; i < len; i++) {
						res.tempFiles[i]["upload_percent"] = 0;
						// h5暂时不能获取图片格式,只支持其它平台
						// #ifdef H5
						await uni.getImageInfo({
							src: res.tempFilePaths[i],
							success: async function (image) {
								if (Math.ceil(res.tempFiles[i].size / 1024) < _self.upload_max * 1024) {
									await _self.upload_before_list.push(res.tempFiles[i]);
								} else {
									uni.showToast({
										title: "已过滤超出限制的图片",
										position: "bottom",
										duration: 1500,
										icon: "none",
									});
								}
							},
						});
						// #endif
						// #ifndef H5
						await uni.getImageInfo({
							src: res.tempFilePaths[i],
							success: async function (image) {
								let reg = new RegExp("" + image.type);
								let formart = _self.upload_format.join(",");
								if (Math.ceil(res.tempFiles[i].size / 1024) < _self.upload_max * 1024 && reg.test(formart)) {
									await _self.upload_before_list.push(res.tempFiles[i]);
								} else {
									uni.showToast({
										title: "已过滤超出限制的图片",
										position: "bottom",
										duration: 1500,
										icon: "none",
									});
								}
							},
						});
						// #endif
					}
					// TODO.暂未解决文件格式过滤
					_self.upload_cache = await res.tempFilePaths;
					_self.upload(_self.upload_auto);
				}
			});
		},
		async upload (upload_auto) {
			let _self = this;
			upload_auto
				? await _self.upImage(_self.upload_cache)
				: console.warn(`传输参数:this.$refs.xx.upload(true)才可上传,默认false`);
		},
		previewImage (idx) {
			let _self = this;
			uni.previewImage({
				current: idx,
				urls: _self.upload_cache_list,
			});
		},
		removeImage (idx) {
			let _self = this;
			_self.upload_before_list.splice(idx, 1);
			_self.upload_cache_list.splice(idx, 1);
			_self.emit();
		},
		emit () {
			let _self = this;
			_self.$emit("change", _self.upload_cache_list);
		},
	},
};
const promisify = (api) => {
	return (options, ...params) => {
		return new Promise((resolve, reject) => {
			api(
				Object.assign({}, options, {
					success: resolve,
					fail: reject,
				}),
				...params
			);
		});
	};
};
const upload = (options) => {
	var url = options.url,
		path = options.path,
		name = options.name,
		// data = options.data,
		extra = options.extra,
		success = options.success,
		progress = options.progress,
		fail = options.fail;

	const uploadTask = uni.uploadFile({
		url: url,
		filePath: path,
		name: name,
		formData: extra,
		success: function (res) {
			var data = res.data;
			try {
				//Tip : 切记->主要修改这里图片的返回值为真实返回路径!!! 详情见示例
				data = JSON.parse(res.data).info;
			} catch (e) {
				throw (e, data);
			}
			// 根据自己的返回数据做相应判断,服务器返回200即代表成功请求
			if (res.statusCode == 200) {
				if (success) {
					success(data);
				}
			} else {
				if (fail) {
					fail(data);
				}
			}
		},
		fail: function (res) {
			if (fail) {
				fail(res);
			}
		},
	});
	uploadTask.onProgressUpdate(async (res) => {
		let _self = this;
		for (let i = 0, len = _self.upload_before_list.length; i < len; i++) {
			_self.upload_before_list[i]["upload_percent"] = await res.progress;
		}
		_self.upload_before_list = _self.upload_before_list;
	});
};
</script>

<style lang="scss">
@font-face {
	font-family: 'iconfont';
	src: url('//at.alicdn.com/iconfont.eot?t=1574391686418');
}

.iconfont {
	font-family: 'iconfont' !important;
	font-size: 16px;
	font-style: normal;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}

.icon-mn_shangchuantupian:before {
	content: '\e559';
}

.icon-mn_shangchuantupian {
	font-size: 2.5em;
}

.sunui-uploader-img {
	display: block;
}

.sunui-uploader-input {
	position: absolute;
	z-index: 1;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	opacity: 0;
}

.sunui-uploader-inputbox {
	margin-bottom: 16rpx;
	box-sizing: border-box;
	background-color: #073b70;
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: center;
}

.sunui-img-removeicon {
	position: absolute;
	color: #fff;
	width: 40upx;
	height: 40upx;
	line-height: 20upx;
	z-index: 2;
	text-align: center;
	background-color: #e54d42;

	&.right {
		top: 0;
		right: 0;
	}
}

.sunui-uploader-file {
	margin-left: 8rpx;
	margin-bottom: 8rpx;
}

.sunui-uploader-file-status:before {
	content: ' ';
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background-color: rgba(0, 0, 0, 0.5);
}

.sunui-loader-filecontent {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	color: #fff;
	z-index: 4;
}

.sunui-uploader-bd {
	margin: 0;
}

.sunui-uploader-files {
	display: flex;
	flex-wrap: wrap;
}

.sunui-uploader-file:nth-child(4n + 0) {
	margin-right: 0;
}

.sunui-uploader-inputbox {
	& > view {
		text-align: center;
	}
}

.sunui-uploader-file-status:after {
	content: ' ';
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background-color: #073b70;
}

.sunui-uploader-hover {
	box-shadow: 0 0 0 #073b70;
	background: #073b70;
}
</style>
