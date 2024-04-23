### **Table props**

|    **属性**     |                             **说明**                             | **类型** | **默认值** |
| :-------------: | :--------------------------------------------------------------: | :------: | :--------: |
|      data       |                         显示的结构化数据                         |  Array   |    [ ]     |
|     columns     |                  表格列的配置描述，具体项见后文                  |  Array   |    [ ]     |
|     border      |                         是否显示纵向边框                         | Boolean  |   false    |
|     height      | 表格高度，无需设置单位，设置后，如果表格内容大于此值，会固定表头 |  Number  |     --     |
| headbBackground |                          表头的背景颜色                          |  String  |  #C8C7CC   |
|   noDataText    |                       数据为空时显示的文字                       |  String  |  暂无数据  |
|                 |                                                                  |          |            |

### **Table events**

| **属性**      | **说明**                           | **返回值**                                                        |     |
| :------------ | :--------------------------------- | :---------------------------------------------------------------- | :-: |
| on-row-click  | 单击某一行时触发                   | 返回一个对象，其中： row：当前行的数据 index：下标                |     |
| on-select-all | 在多选模式下有效，点击全选时触发   | selection：已选项数据                                             |     |
| on-select     | 在多选模式下有效，选中某一项时触发 | 返回一个对象，其中： allChecked：已选项数据 checked：刚选择项数据 |     |

### **column\*\*** \*\*

### **列描述数据对象，是 columns 中的一项**

| **属性** | **说明**                                                                                                                                           | **类型** | **默认值** |
| :------- | :------------------------------------------------------------------------------------------------------------------------------------------------- | :------- | :--------- |
| type     | 列类型，可选值为 index（序号）、checkbox（多选）、html（默认）                                                                                     | String   | html       |
| title    | 列头显示文字                                                                                                                                       | String   | --         |
| key      | 对应列内容字段名                                                                                                                                   | String   | --         |
| width    | 列宽，单位为 upx                                                                                                                                   | number   | 200        |
| align    | 对齐方式，可选值为 left、center、right                                                                                                             | String   | left       |
| render   | 自定义渲染列，使用 Vue 的 Render 函数。传入两个参数，第一个是 h，第二个为对象，包含 row、column 和 index，分别指当前行数据，当前列数据，当前行索引 | Function | --         |

### 示例：

```
<template>
	<view>
       <wTable
       :columns="columns"
       :data="tableData"
       @on-row-click="clickrow"
       border
       @on-select-all="selectAll"
       @on-select="selectO"/>
	</view>
</template>


<script>
	import wTable from '@/components/z-table/wTable.vue';
	export default {
		components:{wTable},
		data() {
			return {
				tableData:[],
				columns:[
					{ type:'checkbox',width:80,align:"center" },
					{ type:'index',width:70,align:"center" },
					{ title:'姓名',key:'name' },
					{ title:'年龄',key:'age' },
					{ title:'居住地址',key:'address' },
					{ title:'月薪', key:'money'}
				]
			}
		},
		methods: {
			 getTableData(){
				this.tableData=[
                  { name:'大锤',age:'17',address:'郑州',money:'1200' },
                  { name:'张三',age:'21',address:'成都',money:'2400' },
                  { name:'李四',age:'16',address:'南京',money:'4800' },
                  ]
			},
			clickrow({ row,index }){
			},
			selectAll(val){
			},
			selectO({ allChecked,checked }){
			}
		},
		mounted(){
			this.getTableData()
		},
	}
```

</script>
