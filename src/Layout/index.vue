<template>
    <div>
        <AppHeader />
        <div class="container">
            <div class="hb-aside">
                <AppSidebar ref="sidebar" />
            </div>
            <div class="sub-page-wrap">
                <AppTagsView @toggleClick="handleCollapse" />
                <div class="sub-page-main">
                    <router-view />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { AppHeader } from "./components";
import { AppSidebar } from "./components";
import { AppTagsView } from "./components";

export default {
    name: "Layout",
    components: {
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
.el-header {
    height: 48px !important;
    // background: #001529;
    // .header-wrap {
    //   height: 100%;
    // }
    padding: 0;
}
.container {
    display: flex;
    height: calc(100vh - 48px);
    .hb-aside {
        overflow: hidden;
        height: calc(100vh - 76px);
        overflow-y: auto;
        .menu-wrap {
            background: #ffffff;
        }
    }
    .sub-page-wrap {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow-x: hidden;
        .sub-page-main {
            flex: 1;
            flex-direction: column;
            padding: 10px;
            padding-top: 3px;
            width: 100%;
            box-sizing: border-box;
            overflow-y: auto;
            // height: calc(100vh - 100px);
        }
    }
}

::-webkit-scrollbar-track-piece {
    background-color: rgba(0, 0, 0, 0);
}
</style>
