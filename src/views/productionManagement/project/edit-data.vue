<!--修改资料-->
<template>
    <div class="main">
        <div class="basicData">
            <p>基础资料</p>
            <el-divider></el-divider>
            <el-form
                ref="form"
                :model="form"
                label-width="80px"
                label-position="top"
                :inline="true"
            >
                <div class="flex25">
                    <el-form-item label="套料图名称:">
                        <el-input disabled v-model="form.nestingName"></el-input>
                    </el-form-item>
                    <el-form-item label="套料图页码:">
                        <el-input disabled v-model="form.nestingPage"></el-input>
                    </el-form-item>
                    <el-form-item label="原材料材质:">
                        <el-input disabled v-model="form.rawMaterialTexture"></el-input>
                    </el-form-item>
                    <el-form-item label="原材料高:">
                        <el-input
                            disabled
                            v-model="form.rawMaterialHeight"
                            class="input-with-select"
                        >
                            <el-button class="input-append" slot="append">毫米</el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="原材料宽:">
                        <el-input
                            disabled
                            v-model="form.rawMaterialWidth"
                            class="input-with-select"
                        >
                            <el-button class="input-append" slot="append">毫米</el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="原材料长:">
                        <el-input
                            disabled
                            v-model="form.rawMaterialLength"
                            class="input-with-select"
                        >
                            <el-button class="input-append" slot="append">毫米</el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="原材料数量:">
                        <el-input
                            disabled
                            v-model="form.rawMaterialSize"
                            class="input-with-select"
                        >
                            <el-button class="input-append" slot="append">块</el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="原材料重量(单重):">
                        <el-input
                            disabled
                            v-model="form.rawMaterialWeight"
                            class="input-with-select"
                        >
                            <el-button class="input-append" slot="append">KG</el-button>
                        </el-input>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <div class="projectImg">
            <p>工艺</p>
            <el-divider></el-divider>
            <el-form
                ref="form"
                :model="form"
                label-width="80px"
                label-position="top"
                :inline="true"
            >
                <div class="flex25">
                    <el-form-item label="划线工艺:">
                        <el-select
                            disabled
                            v-model="form.lineation"
                            placeholder="请选择"
                        >
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="划线线长(单块划线):">
                        <el-input
                            disabled
                            v-model="form.lineationLength"
                            class="input-with-select"
                        >
                            <el-button class="input-append" slot="append">米</el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="切割工艺:">
                        <el-select
                            disabled
                            v-model="form.cuttingProcess"
                            placeholder="请选择"
                        >
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="切割线长(单块钢板切割长度):">
                        <el-input
                            disabled
                            v-model="form.cuttingLength"
                            class="input-with-select"
                        >
                            <el-button class="input-append" slot="append">米</el-button>
                        </el-input>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <div class="periodInfo">
            <div class="navBar">
                <p>零件/坡口</p>
                <!-- <el-button @click="addParts(null)"
                    ><i class="el-icon-plus"></i>新增零件</el-button
                > -->
            </div>
            <el-divider></el-divider>
            <TableBody
                :colConfig="colConfig"
                :data="form.nestingPartVoList"
            >
                <template slot="expend" slot-scope="{ scope }">
                        <TableBody
                            :colConfig="colConfigGroove"
                            :data="form.nestingPartVoList[scope.$index].nestingPartGrooveVoList"
                        >
                        </TableBody>
                </template>
                <template slot="btns" slot-scope="{ scope }">
                    <el-button
                        size="mini"
                        type="text"
                        @click="handleEditGroove(scope.row)"
                        >编辑坡口</el-button
                    >
                    <el-button size="mini" type="text" @click="addParts('1',scope.row)"
                        >编辑零件</el-button
                    >
                </template>
            </TableBody>
        </div>
        <bottom-footer
            :isReturn="true"
            @handleEditSave="handleEditSave"
            @resetForm="handleCancel"
        ></bottom-footer>
        <!--新增零件-->
        <part-add ref="partBox"  @parts-add="handleEdit"></part-add>
        <!--编辑坡口-->
        <groove-edit ref="grooveBox" @groove-del="handleGrooveDel" @groove-edit="handleEdit"></groove-edit>
    </div>
</template>

<script>
import { getNestingDetail, operationNesting, deleteNestingPartGroove } from "@/api/productionManagement/project.js";
import { TableBody } from "gggj_lib";
import partAdd from "./components/partsAdd.vue";
import grooveEdit from "./components/grooveEdit.vue";
import bottomFooter from "../components/bottomFooter.vue";
export default {
    components: { TableBody, partAdd, grooveEdit, bottomFooter },
    data() {
        return {
            form: {
                nestingName: "",
                nestingPage: "",
                rawMaterialTexture: "",
                rawMaterialHeight: "",
                rawMaterialWidth: "",
                rawMaterialSize: "",
                rawMaterialWeight: "",
                lineation: "",
                lineationLength: "",
                cuttingProcess: "",
                cuttingLength: "",
                nestingPartVoList: [],
            },
            options: [
                {
                    value: "0",
                    label: "模板一",
                },
                {
                    value: "1",
                    label: "模板二",
                },
            ],
            colConfig: [
                {
                    attrs: {
                        type: "expand"
                    },
                    slot: "expend"
                },
                {
                    attrs: {
                        label: "零件编号",
                        prop: "partNumber",
                        align: "center",
                    },
                },
                {
                    attrs: {
                        label: "零件编码",
                        prop: "partCode",
                        align: "center",
                    },
                },
                {
                    attrs: {
                        label: "零件数量(件)",
                        prop: "partSize",
                        align: "center",
                    },
                },
                {
                    attrs: {
                        label: "零件重量(单重/千克)",
                        prop: "partWeight",
                        align: "center",
                    },
                },
                {
                    attrs: {
                        label: "工艺流向",
                        prop: "partProcessFlow",
                        align: "center",
                    },
                },
                // {
                //     slot: "btns",
                //     attrs: { label: "操作", fixed: "right" },
                // },
            ],
            colConfigGroove: [
                {
                    attrs: {
                        label: "坡口名称",
                        prop: "grooveName",
                        align: "center",
                    },
                },
                {
                    attrs: {
                        label: "坡口类型",
                        prop: "grooveType",
                        align: "center",
                    },
                },
                {
                    attrs: {
                        label: "坡口长度(单个零件坡口长度/米)",
                        prop: "grooveLength",
                        align: "center",
                    },
                }
            ],
            data: {
                total: 0,
                pageSize: 1,
                currentPage: 0,
                lastPage: 0,
                totalPages: 2,
                first: true,
                last: true,
                data: [
                    {
                        name: "张三",
                        age: 11,
                        hobby: "唱歌",
                        education: "本科",
                    },
                ],
            },
            id: "",
        };
    },
    created() {
        if (
            this.$route.query.id ||
            this.$route.query.engineeringProjectId ||
            this.$route.query.couplingId
        ) {
            this.nestingPoolId = this.$route.query.id;
            this.engineeringProjectId = this.$route.query.engineeringProjectId;
            this.couplingId = this.$route.query.couplingId;
        }
        this.getdetails();
    },
    mounted() {},
    methods: {
        addConditions() {
            this.form.couplingList = [];
            for (let i = 0; i < this.form.number; i++) {
                this.form.couplingList.push({
                    number: "", //联段编号
                    name: "", //联段名称
                    totalWeight: "", //联段重量
                });
            }
        },
        //保存
        handleEditSave() {
            this.$message.success('保存成功')
            this.$router.back();
            // operationNesting({ ...this.form, cuttingQuota: 0, grooveQuota: 0, lineationQuota: 0, })
            //     .then((res) => {
            //         this.$message({
            //             message: "保存成功",
            //             type: "success",
            //         });
            //         this.$router.push("data-management");
            //     })
            //     .finally(() => {
            //         this.isLoading = false;
            //     });
        },
        //重置
        handleCancel(formName) {
            this.$router.back();
        },
        //新增零件
        addParts(id,row) {
            row?this.$refs.partBox.initUser(id,row):this.$refs.partBox.initUser(id,this.form)
        },
        //编辑坡口
        handleEditGroove(row) {
            this.$refs.grooveBox.initUser(row);
        },
        getdetails() {
            getNestingDetail(this.nestingPoolId).then((res) => {
                if (res.code === 0) {
                    this.form = res.data;
                } else {
                    this.$message.error(res.message);
                }
            });
        },
        // 编辑保存数据
        async handleEdit(payload) {
            if(payload.type === 'add') {
                this.form.nestingPartVoList.push(payload)
            }
            this.form.nestingPartVoList.forEach(item => {
                item.nestingAreaBoList = item.nestingAreaVoList
                item.nestingPartGrooveBoList = item.nestingPartGrooveVoList
            })
            const res = await operationNesting({...this.form,nestingPartBoList: this.form.nestingPartVoList})
        },
        // 删除坡口
        handleGrooveDel(payload) {
            let res
            const {partsData,grooveData} = payload
            const partsIndex = this.form.nestingPartVoList.findIndex(item => item.partCode === partsData.partCode)
            const grooveIndex = this.form.nestingPartVoList[partsIndex].nestingPartGrooveVoList.findIndex(item => item.nestingPartGrooveId === grooveData.nestingPartGrooveId)
            this.$confirm('是否删除该坡口？',{
                type: 'error'
            }).then(async () => {
                res = await deleteNestingPartGroove(grooveData.nestingPartGrooveId)
                if (res.code === 0) {
                    this.form.nestingPartVoList[partsIndex].nestingPartGrooveVoList.splice(grooveIndex,1)
                    this.$message.success('删除成功')
                }
            }).catch(() => {
                this.$message.info('已取消删除')
            })
        }
    },
};
</script>

<style scoped lang="scss">
.main {
    height: 100%;
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    ::v-deep .el-divider--horizontal {
        margin: 0;
    }
    ::v-deep .el-form {
        padding: 16px;
        .el-form-item__label {
            padding: 0;
            margin-right: 10px;
        }
        .el-form-item {
            width: 91%;
        }
        .el-textarea__inner {
            min-height: 100px !important;
        }
    }

    .flex50 {
        display: flex;
        .el-form-item {
            width: 45%;
        }
    }
    .flex25 {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        flex-wrap: wrap;
        width: 90%;
        .el-form-item,
        .el-select {
            width: 300px;
            margin-right: 50px;
        }
        .el-button {
            // margin-top: 42px;
        }
    }
    .basicData,
    .projectImg,
    .periodInfo {
        background: #fff;
        min-width: 100%;
        p {
            font-size: 14px;
            line-height: 52px;
            margin: 0 16px;
            font-weight: 700;
        }
    }
    .projectImg,
    .periodInfo {
        margin-top: 8px;
    }
    .projectImg {
        .projectImgBoxs {
            display: flex;
            flex-direction: row;
            .imgBox {
                width: 178px;
                height: 178px;
                margin: 16px;
            }
        }
    }
    .periodInfo {
        flex: 1;
        .navBar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 16px 0 0;
            .el-button {
                padding: 8px 20px;
                // height: 32px;
                // line-height: 32px;
            }
        }
    }
}
</style>
