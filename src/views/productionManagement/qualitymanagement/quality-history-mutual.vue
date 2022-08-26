<template>
    <!-- 历史互检信息 -->
    <div>
        <template v-if="checkData.length!==0">
            <div class="wrap" v-for="(item,index) in checkData" :key="index">
            <div class="title">
                <span>第{{checkData.length-index}}次{{dialogType==='mutual'?'互检':'监理'}}</span>
                <el-tag size="mini" :type="item.status | formatStatus('color')">
                    {{item.status | formatStatus('text')}}
                </el-tag>
            </div>
            <div class="mutual-row">
                <span>
                    <span>{{dialogType==='mutual'?'互检':'监理'}}人:</span>
                    <span>{{item.addName}}</span>
                </span>
                <span>
                    <span>{{dialogType==='mutual'?'互检':'监理'}}时间: </span>
                    <span>{{item.addTime | shorttime}}</span>
                </span>
            </div>
            <div class="row">
                <span>{{dialogType==='mutual'?'互检':'监理'}}意见: </span>
                <span>{{item.suggestion}}</span>
            </div>
            <div class="row">
                <span>{{dialogType==='mutual'?'互检':'监理'}}图片: </span>
                <div class="images">
                <div :class="['images-list',item.projectAttachmentVoList.length===0?'image-none':'']">
                    <template v-if="item.projectAttachmentVoList.length">
                    <el-image
                            v-for="(items,index) in item.projectAttachmentVoList"
                            :key="index"
                            :src="items.attachmentUrl"
                            :preview-src-list="[items.attachmentUrl]"
                            style="width: 80px; height: 80px; margin-right: 12px">
                    </el-image>
                    </template>
                    <template v-else>
                    <span>暂无图片</span>
                    </template>
                </div>
                </div>
            </div>
            </div>
        </template>
        <span class="none" v-else>暂无数据</span>
    </div>
</template>

<script>
export default {
    props: {
        dialogType: { // 模态框类型
            type: String,
            default: ''
        },
        checkData: { // 检查数据
            type: Array,
            default: () => []
        }
    },
    created() {
    },
    data() {
        return {
        }
    },
    filters: {
        // 审核状态格式化
        formatStatus(value,type) {
            if (typeof value !== 'number')
                return
            switch(value) {
                case 0: {return type==='text'?'驳回':'danger'};
                case 1: {return type==='text'?'通过':'primary'}
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.wrap {
    margin-top: 20px;
    &:first-child {
        margin-top: 0;
    }
    .title {
        margin-bottom: 16px;
        span:nth-child(1) {
        font-weight: bold;
        color: #303133;
        margin-right: 8px;
        }
    }
    .row {
        display: flex;
        margin-top: 24px;
        span:nth-child(odd) {
        margin-right: 5px;
        }
    }
    .mutual-row {
        display: flex;
        justify-content: space-between;
        span:nth-child(odd) {
        margin-right: 5px;
        }
    }
    .major-row {
        margin-top: 32px;
        span:nth-child(odd) {
        margin-right: 5px;
        }
        span:nth-child(2) {
        margin-left: 300px;
        }
    }
}
.none {
    display: flex;
    justify-content: center;
}
</style>
