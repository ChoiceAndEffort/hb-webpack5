<!--修改资料-->
<template>
    <div class="main">
        <div class="basicData">
            <p>基础资料</p>
            <el-divider></el-divider>
            <el-form
                ref="form"
                v-if="form"
                :model="form"
                label-width="80px"
                label-position="top"
                :inline="true"
            >
                <div class="flex25">
                    <el-form-item label="物料编号:" >
                        <el-input v-model="form.materialNumber" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="物料编码:">
                        <el-input v-model="form.materialCode" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="物料材质:">
                        <el-input v-model="form.materialQuality" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="物料高(厚度):">
                        <el-input
                            v-model.number="form.materialHeight"
                            class="input-with-select"
                            disabled
                        >
                            <el-button slot="append">毫米</el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="物料宽(毫米):">
                        <el-input v-model.number="form.materialWidth" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="物料长(毫米):">
                        <el-input v-model.number="form.materialLength" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="物料数量:">
                        <el-input v-model.number="form.materialAmount"></el-input>
                    </el-form-item>
                    <el-form-item label="物料重量(单重):">
                        <el-input
                            v-model.number="form.materialWeight"
                            class="input-with-select"
                        >
                            <el-button slot="append">吨</el-button>
                        </el-input>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <div class="projectImg" v-if="false">
            <div class="navBar">
                <p>焊缝</p>
                <el-button @click="add('Weldline')"><i class="el-icon-plus"></i>新增焊缝</el-button>
            </div>
            <el-divider></el-divider>
            <el-form
                ref="form"
                v-if="form"
                :model="form"
                label-width="80px"
                label-position="top"
                :inline="true"
            >
                <div class="flex25" v-for="(item,index) in form.materialWeldSeamVoList" :key="index">
                    <el-form-item label="焊缝编号:">
                        <el-input v-model="item.weldingNumber" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="焊缝类型:">
                        <el-input v-model="item.weldingType"></el-input>
                    </el-form-item>
                    <el-form-item label="焊缝长度(米):">
                        <el-input v-model.number="item.weldingLength"></el-input>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <div class="periodInfo" v-if="false">
            <div class="navBar">
                <p>附属件</p>
                <el-button @click="add('Subsidiary')"><i class="el-icon-plus"></i>新增附属件</el-button>
            </div>
            <el-divider></el-divider>
            <el-form
                ref="form"
                v-if="form"
                :model="form"
                label-width="80px"
                label-position="top"
                :inline="true"
            >
                <div class="flex25" v-for="(item,index) in form.materialAttachmentVoList" :key="index">
                    <el-form-item label="附属件名称:">
                        <el-input v-model="item.nameOfAccessories"></el-input>
                    </el-form-item>
                    <el-form-item label="附属件数量:">
                        <el-input v-model.number="item.numberOfAccessories"></el-input>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <bottom-footer
            @handleEditSave="handleEditSave"
            @resetForm="resetForm"
        ></bottom-footer>
        <!--物料焊缝/附属件新增-->
        <el-dialog :title="addTitle" :visible.sync="addFlag" width="510px" @close="handleCancel">
            <material-add ref="materialAdd" :addType="curType"></material-add>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleCancel">取 消</el-button>
                <el-button type="primary" @click="handleAddMaterial(curType)">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import bottomFooter from "../components/bottomFooter.vue"
import materialAdd from "./components/materialAdd.vue";
import { editMaterialDetail } from '@/api/productionManagement/project.js'
export default {
    name: 'edit-material',
    components: { bottomFooter, materialAdd },
    data() {
        return {
            form: null,
            data: null,
            addTitle: '',
            addFlag: false,
            curType: ''
        };
    },
    created() {},
    mounted() {
        this.form = { ...this.$route.query }
    },
    methods: {
        // 新增
        add(type) {
            this.addFlag = true
            if (type === 'Weldline') {
                this.addTitle = '新增焊缝'
                this.curType = 'Weldline'
            } else if (type === 'Subsidiary') {
                this.addTitle = '新增附属件'
                this.curType = 'Subsidiary'
            }
        },
        //保存
        handleEditSave() {
            this.$refs.form.validate( async (valid) => {
                if (valid) {
                    this.form.materialAttachmentBoList = this.form.materialAttachmentVoList
                    this.form.materialWeldSeamBoList = this.form.materialWeldSeamVoList
                    const res = await editMaterialDetail(this.form)
                    res.success && this.$message({
                        message: '保存成功！',
                        type: 'success'
                    })
                }
            });
        },
        //重置
        resetForm(formName) {
            this.$router.back()
        },
        // 添加焊缝/附属件数据
        handleAddMaterial(curType) {
            this.$refs.materialAdd.$refs.form.validate((valid) => {
                if (valid) {
                    const copy_form = JSON.parse(JSON.stringify(this.form))
                    const { materialAttachmentVoList, materialWeldSeamVoList } = copy_form
                    if (curType === 'Subsidiary') {
                        materialAttachmentVoList.push({ ...this.$refs.materialAdd.form, ...this.form })
                    } else if (curType === 'Weldline') {
                        materialWeldSeamVoList.push({ ...this.$refs.materialAdd.form, ...this.form })
                    }
                    this.form = copy_form
                    this.handleEditSave()
                    this.handleCancel()
                }
            })
        },
        // 取消添加焊缝/附属件数据
        handleCancel() {
            this.$refs.materialAdd.$refs.form.resetFields()
            this.addFlag = false
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
    .periodInfo,.projectImg {
        flex: 1;
        .navBar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 16px 0 0;
            .el-button {
                padding: 8px 20px;
            }
        }
    }
}
</style>
