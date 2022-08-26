<template>
    <div class="enterprise_box">
        <div class="card_box" v-for="(item,index) in enterpriseList" :key="index" @click="getEnterprise(item)">
            <el-card shadow="hover">
                {{item.enterpriseName}}
            </el-card>
        </div>
    </div>
</template>

<script>
import { queryEnterpriseDetail,chooseEnterprise } from '@/api/gggjMain/login.js'
export default {
    name: "enterprise",
    data(){
        return{
            enterpriseList: [1,2,3,4,5,6]
        }
    },
    computed: {
        staffId() {
            return this.$store.state.user.userInfo.staffId
        }
    },
    mounted() {
    },
    created() {
        queryEnterpriseDetail(this.staffId).then(res => {
            this.enterpriseList = res.data
        })
    },
    methods: {
        getEnterprise(data) {
            const sendData = {
                enterpriseId: data.enterpriseId,
                staffId: this.staffId
            }
            chooseEnterprise(sendData).then(res => {
                this.$store.commit('user/SET_TOKEN', res.data.token); // 存储token
                this.$store.commit('power/SET_MENU_LIST', res.data.powerList); // 存储powerList
                this.$router.push({
                    path: res.data.powerList[0].action
                    // path: '/layout/production-management'
                })
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.enterprise_box{
    padding: 0 10%;
    background: #fff;
    height: 50%;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    width: 100%;
    .card_box{
        cursor: pointer;
        height: 100px;
        width: 20%;
        margin: 50px 5%;
    }
}
</style>
