<template>
    <div class="user-info-wrap" style="color: #000">
        <div class="message" v-if="haspower" @click="add">
            <el-badge :value="num" class="item" v-if="num"> </el-badge>
            <i class="el-icon-bell"></i>
            <div class="tips" v-if="flag">
                <ul>
                    <li v-for="(item, index) in tips" :key="index" @click="openurl(item)">
                        <el-tooltip effect="dark" :content="item.alertContent" placement="left">
                            <div class="content">{{ item.alertContent }}</div>
                        </el-tooltip>
                    </li>
                </ul>
            </div>
        </div>
        <div class="line"></div>
        <div class="enterpriseName_box">
            <template v-if="userInfo&&userInfo.erpriseList&&userInfo.erpriseList.length > 1">
                <el-dropdown>
                    <span class="el-dropdown-link">{{ userInfo&& userInfo.enterpriseName }}<i class="el-icon-arrow-down el-icon--right"></i></span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-for="(item, index) in userInfo&&userInfo.erpriseList" :key="index">
                            <div class="single_enterprise">
                                <p @click="switchEnterprise(item)">{{ item&&item.enterpriseName }}</p>
                                <el-button v-if="item.isDefaultEnterprise != 1" type="text" class="set_default" @click="setDefaultenterprise(item)">设置默认企业</el-button>
                                <el-button v-else type="text" :class="curcurEnterprise(item) ? '' : 'defaults'" icon="el-icon-success"></el-button>
                            </div>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </template>
            <span v-else style="font-size: 14px">{{ userInfo&&userInfo.enterpriseName }}</span>
        </div>
        <div class="line"></div>
        <div class="user">
            <div class="user-img">
                <img v-if="userInfo&&userInfo.headImgUrl != '' && userInfo.headImgUrl != null" :src="userInfo&&userInfo.headImgUrl" />
                <img v-else src="@/assets/images/userInfos/avatar.png" />
            </div>
            <div class="user-info">
                <!--                <div class="role">超级管理员</div>-->
                <el-dropdown>
                    <span class="el-dropdown-link">{{ userInfo&&userInfo.name }}<i class="el-icon-arrow-down el-icon--right"></i></span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="handleLogout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <!-- 催办弹框 -->
        <el-dialog title="催办提醒" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
            <el-descriptions :column="1" v-loading="loading">
                <el-descriptions-item label="催办人">{{ urge.superviseName }}</el-descriptions-item>
                <el-descriptions-item label="催办任务">{{ urge.taskName}}</el-descriptions-item>
                <el-descriptions-item label="催办内容">{{
          urge.content
        }}</el-descriptions-item>
            </el-descriptions>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 接收反馈弹框 -->
        <el-dialog title="接收反馈信息" :visible.sync="dialogVisible1" width="30%" :before-close="handleClose">
            <el-descriptions :column="1" v-loading="loading1">
                <el-descriptions-item label="任务接收" v-if="urge1.receiveStatus !== ''">{{ calcreceivestatus(urge1.receiveStatus) }}</el-descriptions-item>
                <el-descriptions-item label="反馈信息" v-if="urge1.feedbackInformation">{{ urge1.feedbackInformation }}</el-descriptions-item>
            </el-descriptions>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible1 = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible1 = false">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 建议点评弹框 -->
        <el-dialog title="建议点评" :visible.sync="dialogVisible2" width="40%" :before-close="handleClose">
            <div class="baseinfo" v-loading="loading2">
                <el-descriptions title="基本信息" :column="2">
                    <el-descriptions-item label="建议人">{{
            advicebaseinfo.addName
          }}</el-descriptions-item>
                    <el-descriptions-item label="建议部门">{{
            advicebaseinfo.addDep
          }}</el-descriptions-item>
                    <el-descriptions-item label="建议时间">{{
            calctime(advicebaseinfo.addTime)
          }}</el-descriptions-item>
                    <el-descriptions-item label="建议名称">
                        {{ advicebaseinfo.title }}
                    </el-descriptions-item>
                    <el-descriptions-item label="建议类型">{{
            calcinfotype(advicebaseinfo.infoType)
          }}</el-descriptions-item>
                    <el-descriptions-item label="建议内容">{{
            advicebaseinfo.content
          }}</el-descriptions-item>
                    <el-descriptions-item label="备注">{{
            advicebaseinfo.remark
          }}</el-descriptions-item>
                </el-descriptions>
                <div class="baseinfo_file">
                    <div class="file_title">附件</div>
                    <div class="file_content">
                        <el-link :href="advicebaseinfo.fileUrl" target="_blank" type="primary" v-if="advicebaseinfo.fileName">{{ advicebaseinfo.fileName }}</el-link>
                    </div>
                </div>
                <el-descriptions title="建议点评" :column="2" style="margin-top: 20px">
                    <el-descriptions-item label="点评人" v-if="advicecontent.addName">{{
            advicecontent.addName
          }}</el-descriptions-item>
                    <el-descriptions-item label="点评时间" v-if="advicecontent.addTime">{{
            calctime(advicecontent.addTime)
          }}</el-descriptions-item>
                    <el-descriptions-item label="点评意见" v-if="advicecontent.remark">{{
            advicecontent.remark
          }}</el-descriptions-item>
                </el-descriptions>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible2 = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible2 = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {
    chooseEnterprise,
    queryEnterpriseDetail,
    setDefaultEnterprise,
} from "@/api/gggjMain/login";
import router from "@/router/index";
// import moment from "moment";
import { format } from "date-fns";
import {
    getTips,
    updateStatus,
    getDetail,
    taskFeedbackRecord,
    getMainTaskIdByID,
    getAllByEventIdAndDiscussTypeEquals,
    infoCollectgetDetail,
} from "@/api/gggjMain/cus.js";

export default {
    data() {
        return {
            enterpriseList: [],
            flag: false,
            tips: [],
            powerlist: [],
            num: 0,
            dialogVisible: false,
            loading: false,
            urge: {
                addTime: "",
                content: "",
                entepriseId: "",
                fileUrl: "",
                id: "",
                remark: "",
                superviseId: "",
                superviseName: "",
                taskId: "",
                taskName: "",
            },
            dialogVisible1: false,
            loading1: false,
            urge1: {
                content: "",
                currentProcess: "",
                enterpriseId: "",
                feedbackPhase: "",
                id: "",
                remark: "",
                taskId: "",
            },
            mainTaskId: "",
            loading2: false,
            dialogVisible2: false,
            eventId: "",
            advicebaseinfo: {},
            advicecontent: {},
            haspower: false,
        };
    },
    computed: {
        userInfo() {
            return this.$store.state.user.userInfo;
        },
       
    },
    /*    created() {
            queryEnterpriseDetail(this.userInfo.staffId).then(res => {
                this.enterpriseList = res.data
            })
        },*/
    mounted() {
        this.calcpowerlist();
        if (this.haspower) {
            this.getmessage();
        }
    },
    methods: {
         curcurEnterprise() {
            return (item) => {
                const index = this.$store.state.user.userInfo.findIndex(
                    (items) => {
                        items.enterpriseId === item.enterpriseId;
                    }
                );
                return index === -1;
            };
        },
        switchEnterprise(data) {
            const sendData = {
                enterpriseId: data.enterpriseId,
                loginId: this.userInfo.loginId,
            };
            chooseEnterprise(sendData).then((res) => {
                this.$store.commit(
                    "user/SET_ENTERPRISENAME",
                    data.enterpriseName
                ); // 更新右上角企业名称
                this.$store.commit("user/SET_TOKEN", res.data.token); // 存储token
                this.$store.commit("power/SET_MENU_LIST", res.data.powerList); // 存储powerList
                this.$store.commit("user/SET_LOGINID", res.data.loginId); // 切换企业更新loginId
                this.$router.push({
                    path: res.data.powerList[0].action,
                    // path: '/layout/production-management'
                });
            });
        },
        /**设置默认企业*/
        setDefaultenterprise(item) {
            setDefaultEnterprise({
                enterpriseId: item.enterpriseId,
                loginId: this.userInfo.loginId,
            });
        },
        handleLogout() {
            this.$store.commit("user/SET_TOKEN", ""); //清空token
            this.$store.commit("user/SET_USERINFO", undefined); //清空用户信息
            this.$router.push("/");
            window.location.reload();
        },
        //计算时间
        calctime(time) {
            return time?.format(time, "yyyy-MM-dd");
        },
        //计算类型
        calcinfotype(num) {
            if (num === 0) {
                return "建议";
            }
            if (num === 1) {
                return "意见";
            }
        },
        //鼠标点击事件
        add() {
            this.flag = !this.flag;
        },
        //消息点击跳转
        async openurl(info) {
            //console.log(info);
            //任务发送是否接收的提醒
            if (info.mappingType === 1) {
                this.$router.push({
                    path: "/layout/tss/taskmanagement/task-details",
                    query: {
                        id: 0,
                    },
                });
            }
            //接收反馈
            if (info.mappingType === 2) {
                this.dialogVisible1 = true;
                this.loading1 = true;
                this.getreceiveback(info.mappingId);
            }
            //催办提醒
            if (info.mappingType === 3) {
                this.dialogVisible = true;
                this.loading = true;
                this.getreminders(info.mappingId);
                this.$router.push({
                    path: "/layout/tss/taskmanagement/my-tasks",
                    query: {
                        //info: row,
                    },
                });
            }
            //任务点评
            if (info.mappingType === 4) {
                await this.getmaintaskid(info.mappingId);
                //console.log(info);
                this.$router.push({
                    path: "/layout/tss/taskmanagement/progress-details",
                    query: {
                        id: info.mappingId,
                        mainTaskId: this.mainTaskId,
                    },
                });
            }
            //建议点评
            if (info.mappingType === 5) {
                let data = {
                    discussType: 2,
                    taskId: info.mappingId,
                };
                this.dialogVisible2 = true;
                this.loading2 = true;
                await this.getadvice(data);
                this.getadvicecontent(this.eventId);
            }
            this.delmessage(info.id);
        },
        //获取消息
        getmessage() {
            getTips().then((res) => {
                if (res.code === 0) {
                    console.log(res, "消息提醒");
                    this.tips = [...res.data];
                    this.num = res.data.length;
                } else {
                    this.$message.error(res.message);
                }
            });
        },
        //点击一条消息后删除
        delmessage(id) {
            updateStatus(id).then((res) => {
                if (res.code === 0) {
                    this.getmessage();
                } else {
                    this.$message.error(res.message);
                }
            });
        },
        //打开弹框
        handleClose(done) {
            this.$confirm("确认关闭？")
                .then((_) => {
                    done();
                })
                .catch((_) => {});
        },
        //获取催办提醒内容
        getreminders(id) {
            getDetail(id).then((res) => {
                if (res.code === 0) {
                    this.urge = { ...res.data };
                    this.loading = false;
                } else {
                    this.$message.error(res.message);
                }
            });
        },
        //获取接收反馈内容
        getreceiveback(id) {
            taskFeedbackRecord(id).then((res) => {
                if (res.code === 0) {
                    console.log(res);
                    if (res.data.length > 0) {
                        this.urge1 = { ...res.data[res.data.length - 1] };
                    }
                    //console.log(this.urge1);
                    this.loading1 = false;
                } else {
                    this.$message.error(res.message);
                }
            });
        },
        //通过任务id获取主任务id
        async getmaintaskid(id) {
            await getMainTaskIdByID(id).then((res) => {
                if (res.code === 0) {
                    //console.log(res);
                    this.mainTaskId = res.data;
                } else {
                    this.$message.error(res.message);
                }
            });
        },
        //建议点评内容
        async getadvice(data) {
            await getAllByEventIdAndDiscussTypeEquals(data).then((res) => {
                if (res.code === 0) {
                    //console.log(res);
                    this.eventId = res.data[0].eventId;
                    this.advicecontent = { ...res.data[0] };
                } else {
                    this.$message.error(res.message);
                }
            });
        },
        //建议基本信息
        getadvicecontent(id) {
            infoCollectgetDetail(id).then((res) => {
                if (res.code === 0) {
                    //console.log(res,"建议内容");
                    this.advicebaseinfo = { ...res.data };
                    this.loading2 = false;
                } else {
                    this.$message.error(res.message);
                }
            });
        },
        //计算是否有企业督办
        calcpowerlist() {
            if (this.$store.state.power.menuList.length > 0) {
                this.$store.state.power.menuList.forEach((val) => {
                    if (val.name === "企业督办") {
                        return (this.haspower = true);
                    }
                });
            }
        },
        //任务接收状态
        calcreceivestatus(type) {
            if (type === 1) {
                return "已接收";
            }
            if (type === 0) {
                return "未接收";
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.single_enterprise {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    p {
        margin-right: 20px;
    }
    .set_default {
        color: #7a7878;
        &:hover {
            color: #100f0f;
        }
    }
    .defaults {
        color: #3bbf67 !important;
    }
}
.user-info-wrap {
    display: flex;
    align-items: center;
    margin-right: 20px;
    .message {
        cursor: pointer;
        position: relative;
        .el-icon-bell {
            font-size: 18px;
            font-weight: bold;
            // color: #ffffff;
        }
        .tips {
            position: absolute;
            left: -150px;
            top: 33px;
            width: 300px;
            z-index: 999;
            background-color: #efffff;
            overflow-y: scroll;
            height: 150px;
            li {
                padding: 0 10px;
                line-height: 26px;
                .content {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }
        .item {
            margin-top: -28px;
            margin-right: -32px;
        }
    }
    .line {
        display: inline-block;
        height: 22px;
        width: 1px;
        background: rgba(255, 255, 255, 0.5);
        margin: 0 16px;
    }
    .enterpriseName_box {
        cursor: pointer;
        // span {
        //     color: #fff;
        // }
    }
    .user {
        display: flex;
        .user-img {
            height: 32px;
            width: 32px;
            border-radius: 50%;
            overflow: hidden;
            margin-right: 16px;
            background: rgb(217, 217, 217);
            img {
                height: 100%;
                width: 100%;
            }
        }
        .user-info {
            display: flex;
            align-items: center;
            cursor: pointer;
            .role {
                font-size: 12px;
                color: rgba(255, 255, 255, 0.7);
                padding-bottom: 2px;
            }
            .el-dropdown-link {
                cursor: pointer;
                font-size: 14px;
                // color: #ffffff;
                font-weight: 500;
            }
            ::v-deep .el-icon-arrow-down {
                font-size: 12px;
                font-weight: bold;
            }
        }
    }
    .baseinfo_file {
        margin: 0 16px;
        height: 156px;
        border-radius: 4px 4px 4px 4px;
        border: 1px solid #ebeef5;
        .file_title {
            height: 40px;
            line-height: 40px;
            background-color: #f9f9f9;
            font-size: 14px;
            font-family: PingFang SC-Medium, PingFang SC;
            font-weight: 500;
            color: #606266;
            padding: 0 16px;
        }
        .file_content {
            padding: 16px 16px;
        }
    }
}
</style>
