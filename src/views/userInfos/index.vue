<template>
	<div class="home">
		<p>主页面基座, 由此处分发前往子项目</p>
        <el-button type="text" @click="handleItem">点击前往生产管理系统</el-button>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
	name: 'Home',
    data(){
        return{

        }
    },
    created() {     
        const hasToken = this.$store.getters.token;
        if(!hasToken){
            this.$router.push({
                path: '/login'
            })
        }
        this.$store.commit('app/CLEAN_VISITEDVIEWS')
    },
	components: {},
    computed: {
    	...mapGetters(['token', 'theme'])
    },
    methods: {
       handleItem(){
           this.$router.push({
               path: '/layout/production-management'
           })
       }
    }
};
</script>

<style lang="scss" scoped>
.home{
    height: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    p{
        margin-top: 200px;
    }
}
</style>
