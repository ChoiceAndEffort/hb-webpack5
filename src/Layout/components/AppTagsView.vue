<template>
    <div class="tags-wrap">
        <!-- <div class="pointer tag" @click="openFirstPage">首页</div> -->
        <!-- {{visitedViews}} -->
        <svg class="icon-font-icon  tags-left" aria-hidden="true" @click="scrollLeft">
            <use xlink:href="#icon-icon-left"></use>
        </svg>

        <div class="list-box">
            <div class="list-area">
                <div v-for="(item,index) in tabsView" @click="openPage(item)" :key="item.meta.title">
                    <div class="pointer tag" :class="item.path==activePath?'header-item-active':''">{{item.meta.title}} <i class="el-icon-close" @click.stop="closePage(index)"></i></div>
                </div>
            </div>
        </div>

        <svg class="icon-font-icon tags-right" aria-hidden="true" @click="scrollRight">
            <use xlink:href="#icon-icon-right"></use>
        </svg>

    </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
    computed: {
        ...mapGetters(["menuList", "menuLevel1Active", "visitedViews"]),
        tabsView() {
            return this.visitedViews;
        },
        activePath() {
            return this.$route.path;
        },
    },
    methods: {
        openFirstPage() {
            this.$router.push({
                path: this.menuList[this.menuLevel1Active].children[0].action,
            });
        },
        openPage(item) {
            this.$router.push(item);
        },
        closePage(index) {
            this.$store.commit("app/DELETE_VISITEDVIEWS", index || 0);
            let currentIndex = this.tabsView.length - 1;
            if (currentIndex >= 0) {
                this.openPage(this.tabsView[currentIndex]);
            } else {
                this.openFirstPage();
            }
        },
        scrollLeft() {
            const allLength = this.tabsView.length * 80;
            const boxLength = document.querySelector(".list-box").clientWidth;
            if (allLength < boxLength) return;
            const listEl = document.querySelector(".list-area");
            const leftMove = Math.abs(
                parseInt(window.getComputedStyle(listEl, null)?.left)
            );
            if (leftMove + boxLength - 360 < boxLength) {
                // 到最开始的时候
                listEl.style.left = "0px";
            } else {
                listEl.style.left = "-" + (leftMove - 360) + "px";
            }
        },
        // 右滑动逻辑
        scrollRight() {
            const allLength = this.tabsView.length * 80;
            const boxLength = document.querySelector(".list-box").clientWidth;
            if (allLength < boxLength) return;
            const listEl = document.querySelector(".list-area");
            const leftMove = Math.abs(
                parseInt(window.getComputedStyle(listEl, null)?.left)
            );
            if (leftMove + boxLength + 360 > allLength) {
                listEl.style.left = "-" + (allLength - boxLength) + "px";
            } else {
                listEl.style.left = "-" + (leftMove + 360) + "px";
            }
        },
    },
};
</script>

<style lang="scss" scoped>
@import "@/styles/element-variables.scss";
.tags-wrap {
    background: red;
    white-space: nowrap;
    position: relative;
    overflow-x: auto;
    overflow-y: hidden;
    width: 100%;
    display: flex;
    align-items: center;
    padding: 6px 17px;
    box-sizing: border-box;
    height: 40px;
    background: #e5e5e5;
    .list-box {
        width: calc(100vw - 150px);
        overflow: hidden;

        .list-area {
            width: calc(100vw - 150px);
            display: flex;
            transform: all 2s;
            .list-item {
                text-align: center;
                cursor: pointer;
                color: #56585c;

                padding: 4px 20px;
            }
            .header-item-active {
                color: #1678ff;
            }
            position: relative;
            left: 0;
            transition: left 1s;
        }
    }

    .tag {
        height: 32px;
        line-height: 32px;
        text-align: center;
        display: flex;
        align-items: center;
        color: #cacfd6;
        font-size: 14px;
        font-weight: 400;
        background: #ffffff;
        padding: 5px 16px;
        box-sizing: border-box;
        margin-right: 6px;
        border-radius: 2px;
    }

    .el-icon-close {
        margin-left: 10px;
        color: #c9cdd4;
    }
    .tags-left {
        margin: 0 17px 0 0;
    }
}
</style>
