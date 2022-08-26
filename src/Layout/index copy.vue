<template>
    <div class="content-area">
        <div class="root-left">
            <AppLogo class="header-logo" />
            <AppSidebar ref="sidebar" />
        </div>
        <div class="root-right">
            <el-header>
                <AppHeader />
            </el-header>
            <div class="container">
                <div class="hb-aside">

                </div>

                <div class="sub-page-wrap">
                    <AppTagsView class="breadcrumb" @toggleClick="handleCollapse" />
                    <div class="sub-page-main">
                        <router-view />
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import AppLogo from "./components/AppLogo.vue";
import { mapGetters } from "vuex";
import { AppHeader } from "./components";
import { AppSidebar } from "./components";
import { AppTagsView } from "./components";

export default {
    name: "Layout",
    components: {
        AppLogo,
        AppHeader,
        AppSidebar,
        AppTagsView,
    },
    data() {
        return {
            token2: "",
        };
    },
    computed: {
        ...mapGetters(["token", "theme"]),
    },
    methods: {
        handleCollapse() {
            this.$refs.sidebar.handleCollapse();
        },
        handleToken() {
            this.$store.commit("user/SET_TOKEN", this.token2);
        },
        getToken() {},
    },
};
</script>

<style lang="scss" scoped>
.content-area {
    width: 100%;
    height: 100%;
    display: flex;
    .root-left {
        width: 256px;
    }
    .root-right {
        flex: 1;
        height: 100%;
    }
}
// .el-header {
//     // height: 48px !important;
//     // background: #001529;

//     // .header-wrap {
//     //     height: 100%;
//     // }

//     padding: 0;
// }
// .container {
//     display: flex;
//     border-top: 5px solid red;
//     height: calc(100vh - 64px);
//     .hb-aside {
//         // height: calc(100vh - 48px);
//         overflow: hidden;
//         height: 100%;
//         // width: 200px;
//         overflow-y: auto;
//         .menu-wrap {
//             // width: 100%;
//             height: 100%;
//             background: #ffffff;
//             ::v-deep .el-menu {
//                 height: 100%;
//             }
//         }
//     }
//     .sub-page-wrap {
//         flex: 1;
//         display: flex;
//         flex-direction: column;
//         overflow-x: hidden;
//         background: #e5e5e5;
//         .sub-page-main {
//             flex: 1;
//             flex-direction: column;
//             padding: 10px;
//             height: 100%;
//             width: 100%;
//             box-sizing: border-box;
//             overflow-y: auto;
//             // #sub-page-main {
//             //   height: 100%;
//             //   width: 100%;
//             // }
//         }
//     }
// }

// ::-webkit-scrollbar-track-piece {
//     background-color: rgba(0, 0, 0, 0);
// }
</style>
