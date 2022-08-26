<!--footer-->
<template>
    <div class="footer_box">
        <div class="footer">
            <div v-if="isReturn" class="bnt">
                <el-button type="primary" @click="returnForm">返回</el-button>
                <slot></slot>
            </div>
            <div v-else class="bnt">
                <el-button @click="resetForm">取消</el-button>
                <el-button type="primary" @click="handleEditSave('form')">保存</el-button>
            </div>
        </div>
    </div>

</template>

<script>
export default {
    props:{
        isReturn: { //是否需要提交按钮
            type: Boolean,
            default: false
        },
    },
    data() {
        return {

        };
    },
    created() {

    },
    mounted() {

    },
    methods: {
        returnForm() {
            this.$router.go(-1)
        },
        handleEditSave(){
            this.$emit('handleEditSave');
        },
        resetForm(){
            this.$emit('resetForm');
        }
    }
};
</script>

<style scoped lang="scss">
.footer_box{
    width: 100%;
    box-shadow: 0px -4px 3px 0px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    z-index: 999;
    margin-top: 3px;
    .footer {
        background: #fff;
        text-align: right;
        width: 100%;
        .bnt {
            padding:16px;
        }
    }
}

</style>
