<template>
    <div class="bosms_box">
        <div class="bottom_footer">
            <div class="box_5x">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>互检人员</span>
                        <el-button style="float: right; padding: 7px 3px" icon="el-icon-plus"  @click="addPersonnel(1)">新增人员</el-button>
                    </div>
                    <!-- 表单 -->
                    <div>
                        <TableBody
                            :colConfig="colConfig"
                            :data="mutualInspectorConfigureList.data"
                            max-height="300"
                        >
                            <template slot="isStaffed" slot-scope="{ scope }">
                                <el-button icon="el-icon-delete" class="col" circle @click="deletePersonnel(scope.row, scope.$index, 1)"></el-button>
                            </template>
                        </TableBody>
                    </div>
                </el-card>
            </div>
            <div class="box_5x">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>专检人员</span>
                        <el-button  style="float: right; padding: 7px 3px"  icon="el-icon-plus"  @click="addPersonnel(2)">新增人员</el-button>
                    </div>
                    <!-- 表单 -->
                    <div>
                        <TableBody
                            :colConfig="colConfig"
                            :data="specialInspectorConfigureList.data"
                            max-height="300"
                        >
                            <template slot="isStaffed" slot-scope="{ scope }">
                                <el-button icon="el-icon-delete" class="col" circle @click="deletePersonnel(scope.row, scope.$index, 2)"></el-button>
                            </template>
                        </TableBody>
                    </div>
                </el-card>
            </div>
            <div class="box_5x">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>外部检验人员</span>
                        <el-button  style="float: right; padding: 7px 3px"  icon="el-icon-plus"  @click="addPersonnel(3)">新增人员</el-button>
                    </div>
                    <!-- 表单 -->
                    <div>
                        <TableBody
                            :colConfig="colConfig"
                            :data="externalInspectorConfigureList.data"
                            max-height="300"
                        >
                            <template slot="isStaffed" slot-scope="{ scope }">
                                <el-button icon="el-icon-delete" class="col" circle @click="deletePersonnel(scope.row, scope.$index, 3)"></el-button>
                            </template>
                        </TableBody>
                    </div>
                </el-card>
            </div>
            <div class="box_5x">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>安全检验人员</span>
                        <el-button  style="float: right; padding: 7px 3px"  icon="el-icon-plus"  @click="addPersonnel(4)">新增人员</el-button>
                    </div>
                    <!-- 表单 -->
                    <div>
                        <TableBody
                            :colConfig="colConfig"
                            :data="securityInspectorConfigureList.data"
                            max-height="300"
                        >
                            <template slot="isStaffed" slot-scope="{ scope }">
                                <el-button icon="el-icon-delete" class="col" circle @click="deletePersonnel(scope.row, scope.$index, 4)"></el-button>
                            </template>
                        </TableBody>
                    </div>
                </el-card>
            </div>
        </div>
        <bottomFooter :isReturn="true">
            <el-button type="primary" @click="operationJobWorkReportStaff">确定</el-button>
        </bottomFooter>
<!--        <div class="flex_row_end bottom_btn">
            <el-button>取消</el-button>
            <el-button type="primary" @click="operationJobWorkReportStaff">确定</el-button>
        </div>-->
        <!-- 模态框 开始-->
        <el-dialog
            title="选择执行人"
            :visible.sync="dialogTablsdx"
            class="motai"
            width="1100px"
        >
            <selectPeople ref="selectTable" :colConfig="addPeopleColconfig" :addObj="addObj" :framework=0 :showselect="false" :selectidEd="selectidEd" @setPersonnelData="setPersonnelData" @closedialogTablsdx="closedialogTablsdx"></selectPeople>
        </el-dialog>
        <!-- 模态框 结束-->
    </div>
</template>
<script>
import { TableBody } from "gggj_lib";
import { inspectorsaveBatch, getMultipleListByProjectProcessId } from '@/api/productionManagement/project.js'
import selectPeople from "../components/selectPeople";
import bottomFooter from '../components/bottomFooter.vue'
import {workOrderDistribution} from "@/api/productionManagement/dispatch";
export default {
    components: { TableBody, selectPeople, bottomFooter },
    data() {
        return {
            data5: {
                total: 0,
                size: 10,
                page: 0,
                lastPage: 0,
                totalPages: 2,
                first: true,
                last: true,
            },
            // 点击新增人员打开模态框
            dialogTablsdx: false,
            dialogTableVisible: false,
            addPeopleColconfig: [
                {
                    attrs: {   align: 'center', type: 'selection', 'reserve-selection': true },
                },
                {
                    attrs: { label: '序号', prop: 'index', align: 'center', type: 'index' },
                },
                {
                    attrs: { label: '姓名', prop: 'staff.name', align: 'center' },
                },{
                    attrs: { label: '工号', prop: 'staff.number', align: 'center' },
                },
              /*  {
                    attrs:  { label: '部门', prop: 'positionList[0].departmentName', align: 'center' },
                },
                {
                    attrs: { label: '岗位', prop: 'positionList[0].name', align: 'center' },
                },*/
                {
                    attrs: { label: '手机号', prop: 'staff.mobile', align: 'center' },
                }],
            colConfig: [
                {
                    attrs: {
                        label: "序号",
                        prop: "index",
                        align: "center",
                        type: "index",
                    },
                },
                {
                    attrs: { label: '姓名', prop: 'staffName', align: 'center' },
                },{
                    attrs: { label: '工号', prop: 'staffNumber', align: 'center' },
                },
             /*   {
                    attrs:  { label: '部门', prop: 'staffPosition[0].departmentName', align: 'center' },
                },
                {
                    attrs: { label: '岗位', prop: 'staffPosition[0].name', align: 'center' },
                },*/
                {
                    attrs: { label: '手机号', prop: 'staffPhone', align: 'center' },
                },
                {
                    slot: "isStaffed",
                    attrs: {
                        label: "操作",
                        prop: "progreward",
                        align: "center",
                    },
                },
            ],
            externalInspectorConfigureList: {  // 外部检验人员
                data: [],
                selectidEd: []
            },
            mutualInspectorConfigureList: { // 互检人员
                data: [],
                selectidEd: []
            },
            securityInspectorConfigureList: { // 安全检查人员
                data: [],
                selectidEd: []
            },
            specialInspectorConfigureList: { // 专检人员
                data: [],
                selectidEd: []
            },
            selectidEd: [],
            personnelSign: true, // true: 新增生产人员  false: 新增辅助人员
            addObj: {}, // 接口默认要的参数
        };
    },
    created() {
        this.getPagedata()
    },
    mounted() {},
    methods: {
        /**确认配置人员*/
        operationJobWorkReportStaff() {
            if(this.externalInspectorConfigureList.data.length<1 && this.mutualInspectorConfigureList.data.length<1 && this.securityInspectorConfigureList.data.length<1 && this.specialInspectorConfigureList.data.length<1) return this.$message.warning('请指派人员');
            this.$confirm('是否确定配置检验人员?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                const inspectorConfigureFirstInsideBoList = [
                    ...this.externalInspectorConfigureList.data,
                    ...this.mutualInspectorConfigureList.data,
                    ...this.securityInspectorConfigureList.data,
                    ...this.specialInspectorConfigureList.data
                ]
                const sendData = {
                    inspectorConfigureFirstInsideBoList: inspectorConfigureFirstInsideBoList,
                    projectProcessId: this.$route.query.id
                }
                inspectorsaveBatch(sendData).then(res => {
                    this.$message.success('配置完成');
                    this.$router.go(-1)
                })
            }).catch(() => {
            });
        },
        setPersonnelData(rpsdata) { // 接收新增人员弹框传回来的人员list及新增的人员id list
            let sendIds = []; // 人员id集合
            let sendArr = []; // 人员id集合
            rpsdata.forEach((data,index) => {
                if(this.selectidEd.indexOf(data.staff.staffId) != -1){ // 之前已加的人员在list中去掉

                }else{
                    sendIds.push(data.staff.staffId) // 之前已加的人员加到list 方便后期再加比对
                    sendArr.push({
                        checkType: this.personnelSign,
                        staffId: data.staff.staffId,
                        staffDepartment: data.staff.departmentId,
                        staffName: data.staff.name,
                        staffNumber: data.staff.number,
                        staffPhone: data.staff.mobile,
                        // staffPosition: data.positionList,
                    })
                }
            })
            this.dialogTablsdx = false;
            switch (this.personnelSign){
                case 1:
                    this.mutualInspectorConfigureList.data = [...this.mutualInspectorConfigureList.data,...sendArr]
                    this.mutualInspectorConfigureList.selectidEd = [...this.mutualInspectorConfigureList.selectidEd, ...sendIds]
                    break;
                case 2:
                    this.specialInspectorConfigureList.data = [...this.specialInspectorConfigureList.data,...sendArr]
                    this.specialInspectorConfigureList.selectidEd = [...this.specialInspectorConfigureList.selectidEd, ...sendIds]
                    break;
                case 3:
                    this.externalInspectorConfigureList.data = [...this.externalInspectorConfigureList.data,...sendArr]
                    this.externalInspectorConfigureList.selectidEd = [...this.externalInspectorConfigureList.selectidEd, ...sendIds]
                    break;
                case 4:
                    this.securityInspectorConfigureList.data = [...this.securityInspectorConfigureList.data,...sendArr]
                    this.securityInspectorConfigureList.selectidEd = [...this.securityInspectorConfigureList.selectidEd, ...sendIds]
                    break;
            }
        },
        addPersonnel(sign) { // 打开新增人员弹框并把已有人员id list传过去方便校验查重
            this.dialogTablsdx = true;
            this.personnelSign = sign;
            this.$nextTick(()=>{
                this.$refs['selectTable'].clearSelect()
            })
            switch (sign){
                case 1:
                    this.addObj = {
                        checkType: 1
                    }
                    this.$set(this, 'selectidEd', this.mutualInspectorConfigureList.selectidEd)
                    break;
                case 2:
                    this.addObj = {
                        checkType: 2
                    }
                    this.$set(this, 'selectidEd', this.specialInspectorConfigureList.selectidEd)
                    break;
                case 3:
                    this.addObj = {
                        checkType: 3
                    }
                    this.$set(this, 'selectidEd', this.externalInspectorConfigureList.selectidEd)
                    break;
                case 4:
                    this.addObj = {
                        checkType: 4
                    }
                    this.$set(this, 'selectidEd', this.securityInspectorConfigureList.selectidEd)
                    break;
            }
        },
        deletePersonnel(data, index, sign) {
            switch (sign){
                case 1:
                    this.mutualInspectorConfigureList.data.splice(index,1)
                    this.mutualInspectorConfigureList.selectidEd.splice(index, 1)
                    break;
                case 2:
                    this.specialInspectorConfigureList.data.splice(index,1)
                    this.specialInspectorConfigureList.selectidEd.splice(index, 1)
                    break;
                case 3:
                    this.externalInspectorConfigureList.data.splice(index,1)
                    this.externalInspectorConfigureList.selectidEd.splice(index, 1)
                    break;
                case 4:
                    this.securityInspectorConfigureList.data.splice(index,1)
                    this.securityInspectorConfigureList.selectidEd.splice(index, 1)
                    break;
            }
        },
        getPagedata() {
            getMultipleListByProjectProcessId({ id: this.$route.query.id }).then(res => {
                this.externalInspectorConfigureList.data = res.data.externalInspectorConfigureList
                this.mutualInspectorConfigureList.data = res.data.mutualInspectorConfigureList
                this.securityInspectorConfigureList.data = res.data.securityInspectorConfigureList
                this.specialInspectorConfigureList.data = res.data.specialInspectorConfigureList
                res.data.externalInspectorConfigureList.forEach(data => {
                    this.externalInspectorConfigureList.selectidEd.push(data.staffId)
                })
                res.data.mutualInspectorConfigureList.forEach(data => {
                    this.mutualInspectorConfigureList.selectidEd.push(data.staffId)
                })
                res.data.securityInspectorConfigureList.forEach(data => {
                    this.securityInspectorConfigureList.selectidEd.push(data.staffId)
                })
                res.data.specialInspectorConfigureList.forEach(data => {
                    this.specialInspectorConfigureList.selectidEd.push(data.staffId)
                })
            })
        },
        closedialogTablsdx() {
            this.dialogTablsdx = false
        }
    },
};
</script>

<style scoped lang="scss">
.bosms_box{
    height: 100%;
    display: flex;
    flex-direction: column;
    .box_5x{
        margin-bottom: 10px;
        height: 400px;
        .box-card{
            height: 100%;
        }
    }
    .bottom_btn{
        margin-top: 5px;
        margin-right: 10px;
        padding-bottom: 20px;
    }
}
.clearfix > el-button {
    color: #b0b1b3;
}
.top_op {
    margin-top: 15px;
}
.optio {
    display: flex;
}

.optio > .optio_one {
    width: 250px;
}
.col {
    color: #fa5555;
    border: none;
}

</style>
