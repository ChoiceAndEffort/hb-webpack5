<template>
    <div class="home">
        <div class="left_box">
            <div class="l_header">
                <h1>欢迎来到伟谋数智!</h1>
                <div>伟谋数智是由钢构管家（湖北）网络服务有限公司研发！
                    <p>
                        钢构管家以“让天下没有难做的钢结构”为使命，将近30年的行业管理经验通过信息化手段，使用大数据、云计算以及人工智能等技术深度开发成智慧ERP系统，基于此系统，搭建产业互联网平台，整合各方资源，为行业赋能。
                    </p>
                </div>
            </div>
            <div class="l_middle">
                <h5>主营业务</h5>
                <ul>
                    <li>
                        <img src="@/assets/productionManagement/img/index/index2.png" alt="">
                        <p>产品商城</p>
                    </li>
                    <li>
                        <img src="@/assets/productionManagement/img/index/index3.png" alt="">
                        <p>智慧ERP</p>
                    </li>
                    <li>
                        <img src="@/assets/productionManagement/img/index/index4.png" alt="">
                        <p>企业管理咨询</p>
                    </li>
                    <li>
                        <img src="@/assets/productionManagement/img/index/index5.png" alt="">
                        <p>零部件集配</p>
                    </li>
                    <li>
                        <img src="@/assets/productionManagement/img/index/index6.png" alt="">
                        <p>供应链金融</p>
                    </li>
                    <li>
                        <img src="@/assets/productionManagement/img/index/index7.png" alt="">
                        <p>智能制造</p>
                    </li>
                    <li>
                        <img src="@/assets/productionManagement/img/index/index8.png" alt="">
                        <p>社区论坛</p>
                    </li>
                </ul>
            </div>
            <div class="l_bottom">
                <h5>核心优势</h5>
                <ul>
                    <li>
                        <img src="@/assets/productionManagement/img/index/index9.png" alt="">
                        <p>丰富的行业经验</p>
                        <div>
                            <p><span></span>
                                30年行业经验，深度了解行业痛点；
                            </p>
                            <p><span></span>
                                具备为客户痛点提供系统解决方案的能力；
                            </p>
                        </div>
                    </li>
                    <li>
                        <img src="@/assets/productionManagement/img/index/index10.png" alt="">
                        <p>精细化管理</p>
                        <div>
                            <p><span></span>
                                全面预算管控能力及成本控制能力；
                            </p>
                            <p><span></span>
                                丰富的ERP系统管理经验；
                            </p>
                            <p><span></span>
                                盈利能力强；
                            </p>
                            <p><span></span>
                                风险控制能力强；
                            </p>
                        </div>
                    </li>
                    <li>
                        <img src="@/assets/productionManagement/img/index/index11.png" alt="">
                        <p>专业的研发团队</p>
                        <div>
                            <p><span></span>
                                专业的产品研发团队；
                            </p>
                            <p><span></span>
                                优秀的核心技术开发团队；
                            </p>
                            <p><span></span>
                                成熟的人才培养机制及激励机制；
                            </p>
                        </div>
                    </li>
                    <li>
                        <img src="@/assets/productionManagement/img/index/index12.png" alt="">
                        <p>专业顾问团队</p>
                        <div>
                            <p><span></span>
                                具有大量的行业专家顾问团队,支撑产品研发；
                            </p>
                            <p><span></span>
                                湖北省钢结构协会会员单位，具有资源整合能力；
                            </p>
                            <p><span></span>
                                通过平台为客户赋能；
                            </p>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="right_box">
            <div class="r_topbox">
                <h5>核心优势</h5>
                <div>
                    <el-card class="box-card">
                        <h5>愿景</h5>
                        <p>打造中国首家钢结构生态圈</p>
                    </el-card>
                    <el-card class="box-card">
                        <h5>使命</h5>
                        <p>让天下没有难做的钢结构</p>
                    </el-card>
                    <el-card class="box-card">
                        <h5>定位</h5>
                        <p>以自营为主撮合为辅的钢结构B2B数字化产业互联网平台</p>
                    </el-card>
                    <el-card class="box-card">
                        <h5>价值观</h5>
                        <p>打造中国首家服务至上，以客户为中心
                            诚信、创新、合作、奉献钢结构生态圈</p>
                    </el-card>
                </div>
            </div>
            <div class="r_img">

            </div>
<!--            <img src="@/assets/img/index/index13.png" alt="">-->
        </div>
    </div>
</template>

<script>
export default {
    methods: {

    }
};
</script>

<style scoped lang="scss">
.home{
    width: 100%;
    padding-right: 10px;
    display: flex;
    height: 100%;
    img{
        width: 100%;
    }
    .left_box{
        width: 75%;
        margin-right: 14px;
        height: unset;
        background: #fff;
        .l_header{
            padding: 39px 392px 65px 55px;
            background-image: url('https://gggj.oss-cn-hangzhou.aliyuncs.com/220125C525116GTC.png');
            background-size: cover;
            h1{
                font-size: 24px;
                font-weight: bold;
                color: #FFFFFF;
            }
            div{
                width: 470px;
                font-size: 12px;
                font-weight: 400;
                color: #b6b6b6;
                line-height: 14px;
                margin-top: 18px;
                p{
                    margin-top: 12px;
                }
            }
        }
        .l_middle,.l_bottom{
            background: #fff;
            margin-top: 16px;
            padding: 16px 0 21px 16px;
            h5{
                font-size: 14px;
                font-weight: bold;
                color: #303133;
                line-height: 16px;
                margin-bottom: 22px;
            }
            ul{
                display: flex;
                padding: 0 51px 0 35px;
                justify-content: space-between;
                li{
                    display: flex;
                    justify-content: center;
                    flex-direction: column;
                    align-items: center;
                    img{
                        width: 54px;
                        height: 54px;
                    }
                    >p{
                        font-size: 14px;
                        font-weight: 400;
                        color: #303133;
                        margin-top: 13px;
                    }
                }
            }
        }
        .l_bottom{
            ul{
                margin-top: 9px;
                li{
                    padding: 24px 18px;
                    margin: 0 19px;
                    background: #F8FBFF;
                    border-radius: 6px 6px 6px 6px;
                    opacity: 1;
                    flex: 1;
                    >p{
                        font-size: 14px;
                        font-weight: bold;
                        color: #303133;
                    }
                    >div{
                        margin-top: 17px;
                        p{
                            font-size: 12px;
                            font-weight: 400;
                            color: #606266;
                            line-height: 14px;
                            margin-bottom: 12px;
                            display: flex;
                            span{
                                display: block;
                                width: 4px;
                                height: 4px;
                                background: #606266;
                                border-radius: 0px 0px 0px 0px;
                                opacity: 1;
                                margin-right: 8px;
                                margin-top: 5px;
                            }
                        }
                    }
                }
            }

        }
    }
    .right_box{
        width: calc(25% - 14px);
        background: #FFFFFF;
        height: unset;
        overflow-y: hidden;
        display: flex;
        flex-direction: column;
        .r_topbox{
            width: 100%;
            padding: 16px 16px 0;
            h5{
                font-size: 14px;
                font-weight: bold;
                color: #303133;
            }
            .box-card{
                margin-top: 16px;
                padding: 13px 21px;
                h5{
                    font-size: 14px;
                    font-weight: bold;
                    margin-bottom: 8px;
                    display: flex;
                    justify-content: center;
                }
                p{
                    font-size: 12px;
                    font-weight: 400;
                    color: #606266;
                    line-height: 14px;
                    display: flex;
                    justify-content: center;
                    text-align: center;
                }
            }
        }
        .r_img{
            flex: 1;
            width: 100%;
            background: url('https://gggj.oss-cn-hangzhou.aliyuncs.com/220125C57H26CNXP.png');
        }
    }
}
</style>
