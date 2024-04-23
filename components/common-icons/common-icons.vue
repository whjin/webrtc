<template>
	<icon type="iconfont" :class="type" :style="{ color: color, 'font-size': size + 'upx' }" class="iconfont" @click="_onClick" />
</template>

<script>
	export default {
		name: 'CommonIcons',
		props: {
			type: {
				type: String,
				default: ''
			},
			color: {
				type: String,
				default: '#333333'
			},
			size: {
				type: [Number, String],
				default: 16
			}
		},
		methods: {
			_onClick() {
				this.$emit('click')
			}
		}
	}
</script>

<style>

</style>
