<template>
	<div class="uni-tree-container">
		<div v-for="(item, index) in treeDataList">
			<div class="uni-tree-item" :key="getId(item.id)">
				<div class="item-wrapper">
					<div class="item-name-box" :class="
              level == 0 && titleIndex == index
                ? 'rectangle-active-img'
                : level == 0
                ? 'rectangle-img'
                : ''
            ">
						<common-icons class="item-icon" v-if="item._hasChildren" :type="item._expand ? `iconarrowup` : `iconarrowdown`" color="#35FFFA" size="26" @click="toggleExpand(index)"></common-icons>
						<div class="select-box" :class="{ 'select-box-disabled': disabledSelect }" v-if="isShowCheckbox(item)" @click="toggleCheck(currentLevelData[index])">
							<common-icons :type="item._checked ? 'iconcheckbox' : 'iconcheck-unselect'" color="#2A4273" size="24"></common-icons>
						</div>
						<div class="select-box" :class="{ 'select-box-disabled': disabledSelect }" v-if="isShowRadio(item)" @click="toggleSelect(currentLevelData[index])">
							<common-icons :type="item._selected ? 'iconcheckbox' : 'iconcheck-unselect'" color="#2A4273" size="24"></common-icons>
						</div>
						<div class="item-title" :class="[
                level == 0 ? 'item-name-active' : 'item-title',
                { 'select-box-disabled': disabledSelect && level != 0 },
              ]" @click="selectLabel(currentLevelData[index], index)">
							{{ item.name }}
						</div>
						<div class="group-control" v-if="showRadio ? false : showGroup ? true : false">
							<common-icons v-if="item._hasChildren" type="iconedit" color="#fff" size="20" @click="onGroupChange(item)"></common-icons>
							<common-icons v-if="item._hasChildren" type="icondelete" color="#f00" size="20" @click="onGroupDelete(item)"></common-icons>
						</div>
					</div>
				</div>
				<div class="item-children" v-if="hasChildren(item)">
					<v-tree v-if="item._expand" :root="root" :parent="item" :level="level + 1" :has-children="hasChildren" :get-children="getChildren" :get-id="getId" :get-name="getName" :show-radio="showRadio" :leaf-only="leafOnly" :show-checkbox="showCheckbox" :disabled-select="disabledSelect" @on-change="onSelectChange" @on-toggle-expand="onToggleExpand"></v-tree>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import commonIcons from "../common-icons/common-icons.vue";

export default {
	name: "v-tree",
	components: {
		commonIcons,
	},
	props: {
		// 根数据 (required)
		root: {
			type: Object,
		},
		parent: {
			type: Object,
		},
		// 是否显示复选框，默认不显示
		showCheckbox: {
			type: Boolean,
			default: false,
		},
		// 是否显示单选框, 默认不显示
		showRadio: {
			type: Boolean,
			default: false,
		},
		// 是否禁止选择, 默认不禁止
		disabledSelect: {
			type: Boolean,
			default: false,
		},
		// checkbox 或 radio 是否只显示叶子节点
		leafOnly: {
			type: Boolean,
			default: false,
		},
		// 是否显示分组控件
		showGroup: {
			type: Boolean,
			default: false,
		},
		// #ifndef H5
		hasChildren: {
			type: Function,
			default: function (data) {
				return data.children;
			},
		},
		getChildren: {
			type: Function,
			default: function (data) {
				return data.children;
			},
		},
		getId: {
			type: Function,
			default: function (data) {
				return data.id;
			},
		},
		getName: {
			type: Function,
			default: function (data) {
				return data.name;
			},
		},
		changeHandler: {
			type: Function,
			default: function () { },
		},
		clickHandler: {
			type: Function,
			default: function () { },
		},
		// #endif
		// #ifdef H5
		// 判断是否有子节点，默认判断节点数据的[children]属性是否是True值。
		// 注意如果children为[]也会判断为有子节点。可通过传递自定义判断函数满足不同需求
		hasChildren: {
			type: Function,
			default: function (data) {
				return data.children;
			},
		},
		// 获取子节点，默认返回节点数据的[children]值
		getChildren: {
			type: Function,
			default: function (data) {
				return data.children;
			},
		},
		// 获取节点唯一标识符，默认为id
		getId: {
			type: Function,
			default: function (data) {
				return data.id;
			},
		},
		// 获取节点展示名称，默认为name
		getName: {
			type: Function,
			default: function (data) {
				return data.name;
			},
		},
		// 选中状态发生变化时执行的函数, 多选时 checked 为选中的节点数组,
		// 单选时 checked 为只包含一个选中节点的数组
		changeHandler: {
			type: Function,
			default: function () { },
		},
		// 点击节点时，执行的函数
		clickHandler: {
			type: Function,
			default: function () { },
		},
		// #endif
		// 单选时,初始化选中的节点
		selected: {
			type: Object,
		},
		// 多选时,初始化选中节点数组
		checked: {
			type: Array,
			default: function () {
				return [];
			},
		},
		// 初始化展开节点
		expand: {
			type: Array,
			default: function () {
				return [];
			},
		},
		// 展开tree使得传入的 checked 可见，此配置会让 expand 失效
		autoExpand: {
			type: Boolean,
			default: false,
		},
		level: {
			type: Number,
			default: 0,
		},
		getRoot: {
			type: Function,
		},
	},
	data () {
		return {
			currentLevelData: [],
			innerExpand: [],
			titleIndex: 0,
			rootName: "",
			// 修改分组名称
			groupChange: false,
		};
	},
	computed: {
		treeDataList () {
			return this.getChildren(this.parent || this.root);
		},
	},
	created () {
		if (this.level == 0) {
			this.$on("on-change", ({ item, handler }) => {
				handler.call(this, item);
				this.$nextTick(() => {
					this.setCurrentLevelData();
					this.changeHandler(this.getChecked());
				});
			});
			this.$on("on-toggle-expand", ({ item, handler }) => {
				handler.call(this, item);
				this.$nextTick(() => {
					this.setCurrentLevelData();
					this.clickHandler(item);
				});
			});
			uni.$on("init-select", () => {
				this.clearSelect();
			});
		}
	},
	onUnload () {
		if (this.level == 0) {
			this.$off("on-change");
			this.$off("on-toggle-expand");
			this.$off("init-select");
		}
	},
	methods: {
		initTree ({ expand, checked, selected }) {
			if (this.level == 0) {
				this.syncState({
					checked,
					expand,
					selected,
				});
			}
			this.setCurrentLevelData();
		},
		// 保存当前数据
		setCurrentLevelData () {
			this.currentLevelData = this.treeDataList;
		},
		selectLabel (item, index) {
			if (item.children) {
				// 选择父级
				this.toggleExpand(index);
				if (this.showGroup) {
					this.rootName = item.name;
				}
			} else {
				// 选择子级
				this.toggleCheck(item);
			}
		},
		onSelectChange (args) {
			let item = args.item;
			let handler = args.handler;
			if (this.level == 0) {
				let id = this.getId(item);
				let target = this.getItemById(id);
				handler.call(this, target);
				this.toggleSelect(item);
			} else {
				this.$emit("on-change", {
					item,
					handler,
				});
			}
		},
		// 选择父级
		toggleExpand (index) {
			let item = this.currentLevelData[index];
			let self = this;
			this.titleIndex = index;
			if (!this.groupChange) {
				this.$emit("on-toggle-expand", {
					item,
					handler: function (item) {
						this.$set(item, "_expand", !item._expand);
						this.$nextTick(() => {
							this.setCurrentLevelData.call(self);
						});
					},
				});
			}
		},
		onToggleExpand (args) {
			let item = args.item;
			let handler = args.handler;
			if (this.level == 0) {
				let id = this.getId(item);
				let target = this.getItemById(id);
				handler.call(this, target);
				this.clickHandler(target);
			} else {
				this.$emit("on-toggle-expand", {
					item,
					handler,
				});
			}
		},
		syncState ({ expand, checked, selected }) {
			if (checked) {
				this.syncStateChecked();
			}
			if (selected) {
				this.syncStateSelected();
			}
			if (expand) {
				this.syncStateExpand();
			}
		},
		syncStateChecked () {
			if (!this.checked) {
				return;
			}
			let parent = this.root;
			this.forEachTree(parent, (item, parent) => {
				this.$set(item, "_checked", this.isChecked(item));
				this.$set(item, "_expand", false);
				this.$set(item, "_indeterminate", false);
				this.$set(item, "_parent", this.getId(parent));
				this.$set(item, "_hasChildren", this.hasChildren(item));
			});
			this.forEachTree(parent, (item, parent) => {
				if (item._checked) {
					this.upStreamCheck(item);
					this.downStreamCheck(item);
					return true;
				}
			});
			return parent;
		},
		syncStateSelected () {
			if (!this.selected) {
				return;
			}
			let parent = this.root;
			this.forEachTree(parent, (item, parent) => {
				this.$set(item, "_selected", this.isSelected(item));
				this.$set(item, "_expand", false);
				this.$set(item, "_indeterminate", false);
				this.$set(item, "_parent", this.getId(parent));
				this.$set(item, "_hasChildren", this.hasChildren(item));
			});
			this.forEachTree(parent, (item, parent) => {
				if (item._selected) {
					this.upStreamSelect(item);
					return true;
				}
			});
			return parent;
		},
		syncStateExpand () {
			this.setInnerExpand();
			this.forEachTree(this.root, (item, parent) => {
				this.$set(item, "_expand", this.isExpand(item));
			});
		},
		setInnerExpand () {
			if (this.autoExpand) {
				this.forEachTree(this.root, (item, parent) => {
					if (!this.hasChildren(item)) {
						return true;
					}
					if (item._indeterminate) {
						this.innerExpand.push(item);
					}
				});
			} else {
				this.innerExpand = this.expand;
			}
		},
		forEachTree (tree, handler) {
			if (!tree) {
				return;
			}
			if (this.hasChildren(tree)) {
				let children = this.getChildren(tree);
				for (let item of children) {
					let stopForEach = handler(item, tree);
					if (!stopForEach) {
						this.forEachTree(item, handler);
					}
				}
			}
		},
		clearSelect () {
			this.forEachTree(this.root, (item) => {
				this.$set(item, "_indeterminate", false);
				this.$set(item, "_selected", false);
			});
		},
		upStreamSelect (node) {
			if (node) {
				let parent = this.getItemById(node._parent);
				if (!parent) {
					return;
				}
				this.$set(parent, "_indeterminate", true);
				this.upStreamCheck(parent);
			}
		},
		upStreamCheck (node) {
			if (node) {
				let parent = this.getItemById(node._parent);
				if (!parent) {
					return;
				}
				let children = this.getChildren(parent);
				let checked = children.filter((it) => it._checked);
				let indeterminated = children.filter((it) => it._indeterminate);
				this.$set(parent, "_checked", checked.length == children.length);
				this.$set(
					parent,
					"_indeterminate",
					!parent._checked && (indeterminated.length > 0 || checked.length > 0)
				);
				this.upStreamCheck(parent);
			}
		},
		downStreamCheck (node) {
			if (this.hasChildren(node)) {
				for (let item of this.getChildren(node)) {
					this.$set(item, "_checked", node._checked);
					this.$set(item, "_indeterminate", false);
					this.downStreamCheck(item);
				}
			}
		},
		isChecked (item) {
			return !!this.checked.find((it) => this.isSame(item, it));
		},
		isSelected (item) {
			return this.isSame(item, this.selected);
		},
		isExpand (item) {
			return !!this.innerExpand.find((it) => this.isSame(item, it));
		},
		isChildrenAllCheck (item) {
			if (this.hasChildren(item)) {
				let children = this.getChildren(item);
				return children.every((it) => it._checked);
			}
			return item._checked;
		},
		isSame (itemA, itemB) {
			return this.getId(itemA) == this.getId(itemB);
		},
		isShowCheckbox (item) {
			if (this.showCheckbox) {
				if (this.leafOnly) {
					return !this.hasChildren(item);
				}
				return true;
			}
		},
		isShowRadio (item) {
			if (this.showRadio) {
				if (this.leafOnly) {
					return !this.hasChildren(item);
				}
				return true;
			}
		},
		getItemById (id) {
			let target = null;
			this.forEachTree(this.root, (item) => {
				if (this.getId(item) == id) {
					target = item;
					return true;
				}
			});
			return target;
		},
		// 修改分组名称
		onGroupChange (item) {
			this.groupChange = true;
			this.$emit("group-change", item);
		},
		// 删除分组
		onGroupDelete (item) {
			this.groupChange = true;
			this.$emit("group-delete", item);
		},
		// 复选框
		toggleCheck (item) {
			let self = this;
			this.$emit("on-change", {
				item,
				handler: function (item) {
					this.clearSelect();
					this.$set(item, "_checked", !item._checked);
					this.$set(item, "_indeterminate", false);
					this.upStreamCheck(item);
					this.downStreamCheck(item);
					this.$nextTick(() => {
						this.setCurrentLevelData.call(self);
					});
				},
			});
		},
		// 单选框
		toggleSelect (item) {
			let self = this;
			this.$emit("on-change", {
				item,
				handler: function (item) {
					this.clearSelect();
					this.$set(item, "_selected", true);
					this.upStreamSelect(item);
					this.downStreamCheck(item);
					this.$nextTick(() => {
						this.setCurrentLevelData.call(self);
					});
				},
			});
		},
		// 返回选中的节点数组, 单选时返回只包含一个选中节点的数组
		getChecked (all = false) {
			let checked = [];
			if (this.showCheckbox) {
				this.forEachTree(this.root, (item) => {
					if (this.leafOnly) {
						if (item._hasChildren) {
							this.rootName = item.name;
						}
						if (item._checked && !item._hasChildren) {
							if (this.showGroup) {
								item.rootName = this.rootName;
							}
							checked.push(item);
						}
					} else {
						if (item._checked) {
							if (item._hasChildren) {
								this.rootName = item.name;
								item.children.map((data) => {
									checked.push(data);
								});
							} else {
								checked.push(item);
							}
							return !all;
						}
					}
				});
			} else if (this.showRadio) {
				this.forEachTree(this.root, (item) => {
					if (item._hasChildren) {
						this.rootName = item.name;
					}
					if (item._selected) {
						checked.push(item);
						return !all;
					}
				});
			}
			checked.map((item, index) => {
				if (!this.showGroup) {
					item.rootName = this.rootName;
				}
			});
			return checked;
		},
	},
	watch: {
		root: {
			handler () {
				this.initTree({
					checked: true,
					selected: true,
					expand: true,
				});
			},
			immediate: true,
		},
		checked: {
			handler () {
				this.initTree({
					checked: true,
					expand: true,
				});
			},
			immediate: true,
		},
		expand: {
			handler () {
				this.initTree({
					expand: true,
				});
			},
			immediate: true,
		},
		selected: {
			handler () {
				this.initTree({
					selected: true,
					expand: true,
				});
			},
			immediate: true,
		},
	},
};
</script>

<style lang="less">
.uni-tree-container {
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	.uni-tree-item {
		margin-bottom: 6.88upx;
		box-sizing: border-box;
		.item-wrapper {
			display: flex;
			justify-content: center;
			align-items: center;
			.item-name-box {
				width: 216.72upx;
				height: 41.66upx;
				line-height: 41.66upx;
				box-sizing: border-box;
				display: flex;
				align-items: center;
				.item-icon {
					display: flex;
					width: 24upx;
					margin: 0 8.36upx;
					color: #fff;
				}
				.item-title {
					width: 155upx;
					height: 100%;
					box-sizing: border-box;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					font-size: 16.88upx;
					color: #fff;
					padding: 0 6.88upx;
				}
				.item-name-active {
					width: 200upx;
					box-sizing: border-box;
					color: #35fffa;
					font-size: 19.44upx;
				}
				.select-box-disabled {
					pointer-events: none;
				}
				.group-control {
					width: 120upx;
					margin-right: 6.88upx;
					display: flex;
					align-items: center;
					justify-content: space-around;
				}
			}
		}
		.item-children {
			width: 216.72upx;
			box-sizing: border-box;
			padding-left: 80upx;
		}
	}
}
</style>
