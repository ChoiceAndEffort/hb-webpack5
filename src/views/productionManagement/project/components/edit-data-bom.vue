<!-- bom修改/新增组件 -->
<template>
    <el-dialog title="修改组件编码" :visible="bomAddFlag" width="510px" @close="handleCancel">
        <el-form v-if="form" ref="form" :model="form" label-width="100px">
            <el-form-item>
                <el-table :data="getTableData" border stripe>
                    <el-table-column label="组件编码">
                        <template slot-scope="{ row, $index }">
                            <el-form-item
                                :prop="`filterTableData.${$index}.subassemblyCode`"
                                :rules="addBomRules.subassemblyCode"
                            >
                                <el-input
                                    v-model="row.subassemblyCode"
                                ></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column label="组件数量">
                        <template slot-scope="{ row, $index }">
                            <el-form-item
                                :prop="`filterTableData.${$index}.subassemblyAmount`"
                                :rules="addBomRules.subassemblyAmount"
                            >
                                <el-input
                                    v-model="row.subassemblyAmount"
                                ></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item>
                <el-button class="add" @click="add">+ 添加</el-button>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="handleCancel">取 消</el-button>
            <el-button type="primary" @click="handleConfirm"
                >确 定</el-button
            >
        </span>
    </el-dialog>
</template>

<script>
import { addBomRules } from "@/utils/productionManagement/valid.js";
import { editBomDetail } from "@/api/productionManagement/project.js"
export default {
    name: "editDataBom",
    props: {
        form: {
            type: Object,
            default: () => {},
        },
        // bom模态框状态
        bomAddFlag: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            addBomRules,
        };
    },
    created() {},
    computed: {
        getTableData() {
            // 过滤数据
            const { data } = this.form.tableData;
            if (data) {
                this.form.filterTableData = data.filter(
                    (item) =>
                        item.materialCode ===
                        this.form.tableData.curRow.materialCode
                );
                return this.form.filterTableData;
            }
        },
    },
    methods: {
        // 添加bom组件事件
        add() {
            const { engineeringProjectId, materialCode, couplingId, procedureId } = this.form.tableData.curRow;
            this.form.filterTableData.push({
                engineeringProjectId,
                materialCode,
                couplingId,
                procedureId,
                subassemblyAmount: "",
                subassemblyCode: "",
            });
        },
        // 取消按钮事件
        handleCancel() {
            this.$emit('update:bomAddFlag', false)
        },
        // 确定按钮事件
        handleConfirm() {
            this.$refs.form.validate(async valid => {
                if (valid) {
                    const res = await editBomDetail({bomList: this.form.filterTableData})
                    if (res.success) {
                        this.$emit('addBom')
                        this.$message({
                            type: 'success',
                            message: '修改成功'
                        })
                        this.handleCancel()
                    }
                }
            })
        }
    },
};
</script>

<style lang="scss" scoped>
::v-deep .el-form-item {
    .el-form-item__content {
        margin-left: 0 !important;
    }
    .el-form-item,
    .is-error,
    .is-required {
        padding: 20px 0;
        margin-bottom: 0;
    }
}
.add {
    width: 100%;
}
</style>
