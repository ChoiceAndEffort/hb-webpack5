<template>
    <div class="about">
        <TreeChart
            v-if="data"
            style="width: 100%"
            :json="data"
            @click-node="clickNode"
            @click-add="handleAdd"
            @click-edit="handleEdit"
            @change-title="handleChangeTitle"
            @click-del="handleDel"
        />
        <!-- 编辑弹框 -->
        <el-dialog title="编辑" :visible.sync="editDialog" width="1200px">
            <person-index :isSelect="false" @rowClick="handleRowClick" />
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialog = false" size="small">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {
    getProjectOrganizationList,
    editProjectOrganizationList,
    deletePositionOrStaff
} from "@/api/productionManagement/project.js";
import { enterpriseId, enterpriseName } from "@/assets/productionManagement/comjs/login.js";
import { TreeChart } from "gggj_lib";
import personIndex from "../personmanagement/person-index.vue";
export default {
    data() {
        return {
            data: {},
            editDialog: false, // 编辑弹框显示
            editForm: {}, // 编辑数据
            curNode: {}, // 当前点击节点
        };
    },
    components: {
        TreeChart,
        personIndex,
    },
    mounted() {
        this.getList();
    },
    methods: {
        async getList() {
            const res = await getProjectOrganizationList({
                engineeringProjectId: this.$route.query.engineeringProjectId,
                enterpriseId,
                enterpriseName,
            });
            this.data = res.data;
        },
        // 节点点击
        clickNode(node) {
            // 标题获取
            this.curNode = { ...node }
        },
        // 点击添加
        handleAdd(itemData) {
            if (!itemData.children) {
                this.$set(itemData, "children", []);
            }
            this.$confirm("是否添加?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
            })
                .then(async () => {
                    const newData = {
                        name: itemData.name + "下级",
                        sort: itemData.sort + 1,
                        projectOrganizationId: "",
                        pid: itemData.projectOrganizationId,
                        engineeringProjectId: itemData.engineeringProjectId,
                        info: {
                            name: "",
                            mobile: "",
                            avatar: "",
                            staffId: ''
                        },
                    }
                    itemData.children.push(newData);
                    let res = await editProjectOrganizationList({
                        configDetailBoList: [
                            {
                                ...newData,
                                type: 1,
                                isMaster: 1,
                                mappingInfo: '',
                            },
                        ],
                        ...newData,
                        enterpriseId,
                        engineeringProjectId: itemData.engineeringProjectId
                    });
                    this.$nextTick(() => {
                        this.getList()
                        if (res.code === 0) {
                            this.$message({
                                type: "success",
                                message: "添加成功!",
                            });
                        }
                    })
                })
                .catch(err => {
                    if (err !== 'cancel')
                        throw err
                    this.$message({
                        type: "info",
                        message: "已取消添加",
                    });
                });

        },
        // 点击编辑
        handleEdit(itemData) {
            this.editDialog = true;
            this.editForm = itemData;
        },
        // 行点击
        async handleRowClick(payload) {
            this.editDialog = false;
            this.editForm.info = { ...payload.staff };
            this.editForm.info.avatar = payload.staff.idPhotoUrl
            const res = await editProjectOrganizationList({
                configDetailBoList: [
                    {
                        ...this.editForm,
                        type: 1,
                        isMaster: 1,
                        mappingInfo: payload.staff.staffId,
                    },
                ],
                ...this.editForm,
                enterpriseId,
            });
            res.code === 0 && this.getList()
        },
        // 标题切换
        handleChangeTitle(payload) {
            const { name, info } = this.curNode
            if (payload.target.value === name) return;
            this.$confirm("是否编辑标题?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
            })
                .then(async () => {
                    this.$message({
                        type: "success",
                        message: "编辑成功!",
                    });
                    await editProjectOrganizationList({
                        configDetailBoList: [
                            {
                                ...this.curNode,
                                type: 1,
                                isMaster: 1,
                                mappingInfo: info.staffId,
                            },
                        ],
                        ...this.curNode,
                        enterpriseId,
                        name: payload.target.value,
                    });
                })
                .catch(err => {
                    if (err) {
                        throw err
                    }
                    payload.target.value = name;
                    this.$message({
                        type: "info",
                        message: "已取消编辑",
                    });
                });
        },
        // 删除节点
        handleDel(payload) {
            this.$confirm("是否删除?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
            }).then(async () => {
                this.searchNode(this.data,payload)
                const index =this.delEleParentNode.children.findIndex(item => item.projectOrganizationId === payload.projectOrganizationId)
                const res = await deletePositionOrStaff({ ...payload, enterpriseId })
                if (res.success) {
                    this.delEleParentNode.children.splice(index,1)
                    this.$message({type: 'success',message: '删除成功'})
                } else {
                    this.$message({type: 'danger', message: '删除失败'})
                }
            }).catch((res) => {
                res === 'cancel' && this.$message({type: 'info',message: '已取消删除'})
            })
        },
        // 查找结点
        searchNode(node,ser_node) {
            if ( node.projectOrganizationId === ser_node.pid ) {
                // if ( node.projectOrganizationId === ser_node.pid) {
                //     this.delEleParentNode = node
                //     return
                // } else if (Array.isArray(node.children)) {
                //     node.children.forEach(item => this.searchNode(item,ser_node))
                // }
                this.delEleParentNode = node
            } else if (Array.isArray(node.children)) {
                node.children.forEach(item => this.searchNode(item,ser_node))
            } else {
                // 不存在直接返回
                return
            }
        }
    },
};
</script>

<style lang="scss" scoped>
.about {
    .el-input {
        margin-bottom: 20px;
    }
    .edit-confirm {
        margin-top: 50px;
        text-align: center;
        ::v-deep .el-form-item__content {
            margin: 0 auto !important;
        }
    }
}
</style>
