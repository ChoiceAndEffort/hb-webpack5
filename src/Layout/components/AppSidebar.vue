<template>
    <div class="menu-wrap" :class="{ active: isCollapse }">
        <el-menu :default-active="$route.path" :unique-opened="true" :collapse="isCollapse" router overflow-y: scroll>
            <div v-for="(group) in currentMenuData" :key="group.name">
                <el-menu-item v-if="!group.children" class="menu-item" :index="group.action">
                    <template slot="title">
                        <i class="el-icon-menu"></i>
                        <span class="title" slot="title">{{ group.name }}</span>
                    </template>
                </el-menu-item>
                <el-submenu v-else class="has-child-menu" :index="group.action">
                    <template slot="title">
                        <i class="el-icon-menu"></i>
                        <span class="title" slot="title">{{ group.name }}</span>
                    </template>
                    <template v-if="group.children">
                        <el-menu-item v-for="(item) in group.children" :index="item.action" :key="item.name">{{ item.name }}</el-menu-item>
                    </template>
                </el-submenu>
            </div>
        </el-menu>
        <i :class="isCollapse?  'el-icon-s-unfold' : 'el-icon-s-fold'" @click="handleCollapse" class="aside-icon" :style="{width: isCollapse ? '38px':''}"></i>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
    data() {
        return {
            isCollapse: false,
            menuStyle: undefined,
        };
    },
    computed: {
        ...mapGetters(["menuList", "menuLevel1Active"]),
        currentMenuData() {
            return this.menuList[this.menuLevel1Active].children;
        },
    },
    mounted() {
        this.$nextTick(() => {
            window.addEventListener("resize", (res) => {
                // console.log(
                //     88888,
                //     "浏览器窗口变化了",
                //     res.currentTarget.devicePixelRatio
                // );
                if (res.currentTarget.devicePixelRatio > 1.25) {
                    this.isCollapse = true;
                    return false;
                }
                // this.isCollapse = false;
            });
        });
    },
    methods: {
        handleCollapse() {
            this.isCollapse = !this.isCollapse;
        },
    },
};
</script>

<style lang="scss" scoped>
@import "@/styles/element-variables.scss";
.title,
.el-menu ::v-deep .el-menu-item,
.el-menu ::v-deep .el-submenu {
    color: #303133;
    font-size: 14px;
    font-weight: 400;
    overflow: hidden;
    width: 256px;
}
.menu-wrap {
    height: 100%;
    width: 100%;
    position: relative;
    .aside-icon {
        box-sizing: border-box;
        position: fixed;
        height: 30px;
        line-height: 30px;
        padding: 0 16px;
        width: 256px;
        color: #fff;
        background: #001529;
        bottom: 0px;
    }
}
.active {
    ::deep .el-icon-arrow-right {
        display: none;
    }
    ::deep.el-menu--collapse {
        width: 38px;
    }
}
.menu-item {
    padding: 0 16px !important;
}

.has-child-menu {
    ::v-deep .el-submenu__title .el-submenu__icon-arrow {
        color: #303133;
        font-size: 6px;
        font-weight: bold;
    }
    ::v-deep .el-submenu__title {
        display: flex;
        align-items: center;
        padding: 0 16px !important;
    }
    .el-menu-item {
        padding-left: 45px !important;
    }
}

.is-opened.is-active {
    .el-icon-menu {
        color: $--color-primary;
    }
    .title {
        color: $--color-primary;
    }
    ::v-deep .el-submenu__icon-arrow {
        color: $--color-primary !important;
    }
}
.el-menu-item.is-active {
    background: #f4f9fd;
    color: $--color-primary;
    border-right: 2px solid $--color-primary;
}
</style>
