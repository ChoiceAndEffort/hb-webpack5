<template>
    <div>
        <el-table        :data="renderDynamic"
                         ref="product"
                         border
                         :row-class-name="rowClassNameFun"
                         :header-row-class-name="headerRowClassName"
                         size="mini"
                         max-height="500px"
                         style="width: 100%"
                         @select="selectFun"
                         @select-all="selectAllFun"
                         :header-cell-style="{ background: '#fafafa' }">
            <el-table-column
                type="selection"
                width="55">
            </el-table-column>
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <el-card shadow="always">
                        <label class="el-checkbox" v-for="(item,index) in scope.row.children" :key="index" :class="{ 'is-checkeds': item.isSelect==1 }" @click="selectFun($event,item)">
                            <span class="el-checkbox__input">
                                <span class="el-checkbox__inner"></span>
                            </span>
                            <span class="el-checkbox__label" v-if="selectName"> {{item[selectName]}}</span>
                        </label>
                    </el-card>
                </template>
            </el-table-column>
            <slot></slot>
        </el-table>
    </div>
</template>

<script>
export default {
    name: "selectTable",
    props:['parentIds', 'compareId', 'selectName'],
    data() {
        return {
         /*   parentIds: 'pid', 子级的parentIds和父级的compareId做对比
            compareId: 'workingProcedureId',
            selectName: 'name',*/
            checkedCities: [],
            changest: 0,
            renderDynamic: [
         /*       {
                    processQuotaTemplateId: "21112473KR0MW6FW",
                    workingProcedureCode: "GX_JG",
                    proportion: 0,
                    name: "加工",
                    sort: 3,
                    workingProcedureId: "2111249ZZ1TCC8SW",
                    pid: "0",
                    isSelect: 1,
                    children: [
                        {
                            processQuotaTemplateId: "21112473KR0MW6FW",
                            workingProcedureCode: "GX_ZK",
                            proportion: 0,
                            name: "钻空",
                            sort: 1,
                            isSelect: 1,
                            workingProcedureId: "2123249ZZ2X45RYG",
                            pid: "2111249ZZ1TCC8SW"
                        },
                        {
                            processQuotaTemplateId: "21112473KR0MW6FW",
                            workingProcedureCode: "GX_ZW",
                            proportion: 0,
                            name: "折弯",
                            sort: 2,
                            isSelect: 1,
                            workingProcedureId: "23212463KR1CW6HT",
                            pid: "2111249ZZ1TCC8SW"
                        },
                        {
                            processQuotaTemplateId: "21112473KR0MW6FW",
                            workingProcedureCode: "GX_XM",
                            proportion: 0,
                            name: "铣面",
                            sort: 3,
                            isSelect: 1,
                            workingProcedureId: "22411373KR0MW7YS",
                            pid: "2111249ZZ1TCC8SW"
                        },
                        {
                            processQuotaTemplateId: "21112473KR0MW6FW",
                            workingProcedureCode: "GX_TK",
                            proportion: 0,
                            name: "镗空",
                            sort: 4,
                            isSelect: 1,
                            workingProcedureId: "21233284KR1EW8KH",
                            pid: "2111249ZZ1TCC8SW"
                        },
                        {
                            processQuotaTemplateId: "21112473KR0MW6FW",
                            workingProcedureCode: "GX_JLD",
                            proportion: 0,
                            name: "剪力钉",
                            sort: 5,
                            isSelect: 1,
                            workingProcedureId: "21613135KR2MS9JK",
                            pid: "2111249ZZ1TCC8SW"
                        }
                    ]
                },{
                    processQuotaTemplateId: "21112473KR0MW6FW",
                    workingProcedureCode: "GX_DYJ",
                    proportion: 0,
                    name: "单元件",
                    sort: 6,
                    isSelect: 1,
                    workingProcedureId: "2111249ZZ1W1DZF8",
                    pid: "0",
                    children: [
                        {
                            processQuotaTemplateId: "21112473KR0MW6FW",
                            workingProcedureCode: "GX_GBDYJ",
                            proportion: 0,
                            name: "隔板单元件",
                            sort: 1,
                            isSelect: 0,
                            workingProcedureId: "2235269VZLTMSSG",
                            pid: "2111249ZZ1W1DZF8"
                        },
                        {
                            processQuotaTemplateId: "21112473KR0MW6FW",
                            workingProcedureCode: "GX_BDYJ",
                            proportion: 0,
                            name: "板单元件",
                            sort: 2,
                            isSelect: 0,
                            workingProcedureId: "2873265VAJTPCQG",
                            pid: "2111249ZZ1W1DZF8"
                        }
                    ]
                }*/
            ]
        };
    },
    mounted() {
        /**0:未选中； 1：选中； 2：半选状态*/
    },
    methods: {
        initData(data) {
            if (!data) return false;
     /*       data.forEach((item) => {
                item.isSelect = 0; //默认为不选中
                if (item.children && item.children.length) {
                    this.initData(item.children);
                }
            });*/
            this.$set(this,'renderDynamic',[...data])
        },
        selectFun(selection, row) {
            this.setRowIsSelect(row);
        },
        checkIsAllSelect() {
            this.oneProductIsSelect = [];
            this.renderDynamic.forEach((item) => {
                this.oneProductIsSelect.push(item.isSelect);
            });
            //判断一级产品是否是全选.如果一级产品全为true，则设置为取消全选，否则全选
            let isAllSelect = this.oneProductIsSelect.every((selectStatusItem) => {
                return 1 == selectStatusItem;
            });
            return isAllSelect;
        },
        selectAllFun(selection) {
            let isAllSelect = this.checkIsAllSelect();
            this.renderDynamic.forEach((item) => {
                item.isSelect = isAllSelect;
                this.$refs.product.toggleRowSelection(item, !isAllSelect);
                this.selectFun(selection, item);
            });
        },
        rowClassNameFun({ row }) {
            if (row.isSelect === 2) {
                return "indeterminate";
            }else if(row.isSelect === 1){
                return "is-checkeds";
            }
        },
        headerRowClassName() {
            let oneProductIsSelect = [];
            this.renderDynamic.forEach((item) => {
                oneProductIsSelect.push(item.isSelect);
            });
            if (oneProductIsSelect.includes(2)) {
                return "indeterminate";
            }
            return "";
        },
        setRowIsSelect(row) {
            // 涂装特殊情况 涂装选中后默认勾上运输
            if (row.workingProcedureCode === 'GX_TZ') {
                let YSItem = this.renderDynamic.find(item => item.workingProcedureCode === 'GX_YS')
                this.setRowIsSelect(YSItem)
            }

            //当点击父级点复选框时，当前的状态可能为未知状态，所以当前行状态设为false并选中，即可实现子级点全选效果
            if (row.isSelect === 2) {
                row.isSelect = 0;
                this.$refs.product.toggleRowSelection(row, true);
            }
            row.isSelect = row.isSelect==0?1:0;
            let that = this;

            function selectAllChildrens(data) {
                data.forEach((item) => {
                    item.isSelect = row.isSelect;
                    that.$refs.product.toggleRowSelection(item, row.isSelect);
                    if (item.children && item.children.length) {
                        selectAllChildrens(item.children);
                    }
                });
            }

            function getSelectStatus(selectStatuaArr, data) {
                console.log(data)
                data.forEach((childrenItem) => {
                    selectStatuaArr.push(childrenItem.isSelect);
                    if (childrenItem.children && childrenItem.children.length) {
                        getSelectStatus(selectStatuaArr, childrenItem.children);
                    }
                });
                return selectStatuaArr;
            }
            function getLevelStatus(row) {
                //如果当前节点的parantId =0 并且有子节点，则为1
                //如果当前节点的parantId !=0 并且子节点没有子节点 则为3
                if (row[that.parentIds] == 0) {
                    if (row.children && row.children.length) {
                        return 1;
                    }else{
                        return 4;
                    }
                } else {
                    if (!row.children || !row.children.length) {
                        return 3;
                    } else {
                        return 2;
                    }
                }
            }
            let result = {};
            //获取明确的节点
            function getExplicitNode(data,parentIds) {
                data.forEach((item) => {
                    if(item[that.compareId] == parentIds) {
                        result = item;
                    }
                    if(item.children && item.children.length) {
                        getExplicitNode(item.children,parentIds);
                    }
                })
                return result;
            }
            function operateLastLeve(row) {
                //操作的是子节点  1、获取父节点  2、判断子节点选中个数，如果全部选中则父节点设为选中状态，如果都不选中，则为不选中状态，如果部分选择，则设为不明确状态
                let selectStatuaArr = [];
                let item = getExplicitNode(that.renderDynamic,row[that.parentIds]);
                selectStatuaArr = getSelectStatus(selectStatuaArr, item.children);
                if (
                    selectStatuaArr.every((selectItem) => {
                        return 1 == selectItem;
                    })
                ) {
                    // item.isSelect = true;
                    that.$set(item,'isSelect',1)
                    that.$refs.product.toggleRowSelection(item, true);
                } else if (
                    selectStatuaArr.every((selectItem) => {
                        return 0 == selectItem;
                    })
                ) {
                    that.$set(item,'isSelect',0)
                    // item.isSelect = false;
                    that.$refs.product.toggleRowSelection(item, false);
                } else {
                    item.isSelect = 2;
                }
                // that.changest = ++that.changest
                //则还有父级
                if(item[that.parentIds]!=0) {
                    operateLastLeve(item)
                }
            }
            //判断操作的是子级点复选框还是父级点复选框，如果是父级点，则控制子级点的全选和不全选

            //1、只是父级 2、既是子集，又是父级 3、只是子级
            let levelSataus = getLevelStatus(row);
            if (levelSataus == 1) {
                selectAllChildrens(row.children);
            } else if (levelSataus == 2) {
                selectAllChildrens(row.children);
                operateLastLeve(row);
            } else if(levelSataus == 3) {
                operateLastLeve(row);
            }
        },
    },
}
</script>

<style>
.is-checkeds .el-checkbox__inner {
    background-color: #409eff;
    border-color: #409eff;
}
.is-checkeds .el-checkbox__inner:after {
    transform: rotate(
        45deg) scaleY(1);
}

.indeterminate .el-checkbox__input .el-checkbox__inner {
    background-color: #409eff !important;
    border-color: #409eff !important;
    color: #fff !important;
}

.indeterminate .el-checkbox__input.is-checked .el-checkbox__inner::after {
    transform: scale(0.5);
}

.indeterminate .el-checkbox__input .el-checkbox__inner {
    background-color: #f2f6fc;
    border-color: #dcdfe6;
}
.indeterminate .el-checkbox__input .el-checkbox__inner::after {
    border-color: #c0c4cc !important;
    background-color: #c0c4cc;
}
.product-show th .el-checkbox__inner {
    display: none !important;
}

.indeterminate .el-checkbox__input .el-checkbox__inner::after {
    content: "";
    position: absolute;
    display: block;
    background-color: #fff;
    height: 2px;
    transform: scale(0.5);
    left: 0;
    right: 0;
    top: 5px;
    width: auto !important;
}
.product-show .el-checkbox__inner {
    display: block !important;
}

.product-show .el-checkbox {
    display: block !important;
}
</style>
