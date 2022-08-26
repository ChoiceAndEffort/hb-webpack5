<template>
    <div class="logo-wrap">
        <div class="logo-bg">
            <img class="logo-img" src="@/assets/images/userInfos/logo.png" />
        </div>
        <img src="@/assets/images/userInfos/companyTitle.png" alt="" class="company-title">

        <!-- <img src="@/assets/images/userInfos/logo.png" alt="" class="logo"> -->
        <!-- <div class="name">{{ appTitle }}</div> -->
        <!--        <div class="line"></div>
        <div class="name-sub">智慧ERP</div>-->
    </div>
</template>

<script>
import { title } from "@/settings.js";
export default {
    data() {
        return {};
    },
    computed: {
        appTitle() {
            return title;
        },
    },
};
</script>

<style lang="scss" scoped>
.logo-wrap{
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 24px;
    width: 256px;
    .logo-bg {
        background: url("../../assets/images/userInfos/logoBg.png") no-repeat
            left top 100%/100%;
        width: 36px;
        height: 31px;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
            width: 23px;
            height: 20px;
        }
    }
    .logo-img {
        width: 153px;
        height: 34px;
    }
    .logo {
        width: 38px;
        height: 34px;
    }
    .company-title {
        width: 64px;
        height: 15px;
    }
    // .name {
    //     margin-left: 5px;
    //     color: #ffffff;
    //     font-size: 16px;
    //     font-weight: 600;
    // }
    // .line {
    //     display: inline-block;
    //     height: 22px;
    //     width: 1px;
    //     background: rgba(255, 255, 255, 0.5);
    //     margin: 0 8px;
    // }
    // .name-sub {
    //     font-size: 16px;
    //     font-weight: 200;
    //     color: #ffffff;
    //     margin-left: 5px;
    // }
}
</style>
