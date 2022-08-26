<template>
    <div class="header-wrap">
        <AppLogo />
        <div class="header-center">
            <div class="center-left">
                <svg class="icon-font-icon  tags-left" aria-hidden="true">
                    <use xlink:href="#icon-icon-workbench"></use>
                </svg>
                <span>工作台</span>
            </div>
            <div class="center-container">
                <img src="@/assets/images/userInfos/goLeft.png" alt="" srcset="" class="go-left" @click="scrollLeft">
                <div class="list-box">
                    <div class="list">
                        <div v-for="(item,index) in menuList" :key="item.name" @click="handleMenuLevel(index)" class="list-item">
                            <div class="one" :class="menuLevel1Active==index?'header-item-active':''">
                                <router-link :to="item.action">{{item.name}}</router-link>
                            </div>

                        </div>
                    </div>
                </div>

                <img src="@/assets/images/userInfos/goLeft.png" alt="" srcset="" class="go-right" @click="scrollRight">
            </div>

        </div>
        <div class="user-info-area">
            <AppUserInfo />
        </div>

    </div>
</template>

<script>
import { mapGetters } from "vuex";
import AppLogo from "./AppLogo.vue";
import AppUserInfo from "./AppUserInfo.vue";
export default {
    computed: {
        ...mapGetters(["menuList", "menuLevel1Active"]),
    },
    components: {
        AppLogo,
        AppUserInfo,
    },
    methods: {
        handleMenuLevel(index) {
            this.$store.commit("app/RESET_VISITEDVIEWS", []);
            this.$store.commit("power/SET_MENU_LEVEL1_ACTIVE", index);
        },
        scrollLeft() {
            const allLength = this.menuList.length * 100;
            const boxLength = document.querySelector(".list-box").clientWidth;
            if (allLength < boxLength) return;
            const listEl = document.querySelector(".list");
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
            const allLength = this.menuList.length * 100;
            const boxLength = document.querySelector(".list-box").clientWidth;
            if (allLength < boxLength) return;
            const listEl = document.querySelector(".list");
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
.header-wrap {
    position: relative;
    display: flex;
    align-items: center;
    height: 48px;
    background: #fff;
    box-shadow: 0px 1px 2px 2px rgba(100, 3, 3, 0.02);
    .header-center {
        display: flex;
        align-items: center;
        margin-left: 37px;
        .center-left {
            width: 120px;
            font-size: 14px;
            padding: 4px 16px;
        }
    }
    .center-container {
        display: flex;
        align-items: center;
        flex: 1;
        .go-left,
        .go-right {
            width: 26px;
            height: 26px;
        }
        .go-right {
            transform: rotate(180deg);
            margin-top: -5px;
        }
    }

    .list-box {
        width: calc(100vw - 900px);
        overflow: hidden;

        .list {
            width: calc(100vw - 900px);

            display: flex;
            transform: all 2s;
            .list-item {
                min-width: 100px;
                text-align: center;
                cursor: pointer;
                color: #56585c;
                a {
                    color: #56585c;
                    text-decoration: none;
                }

                padding: 4px 20px;
            }
            .header-item-active {
                a {
                    color: #1678ff;
                }
                border-bottom: 1px solid #1678ff;
            }
            .one {
                font-size: 14px;
                padding: 6px 0px;
            }
            position: relative;
            left: 0;
            transition: left 1s;
        }
    }

    .user-info-area {
        position: absolute;
        right: 0;
    }
}
</style>
