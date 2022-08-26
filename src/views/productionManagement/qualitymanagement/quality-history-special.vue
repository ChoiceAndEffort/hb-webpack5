<template>
    <!-- 历史专检信息 -->
    <div>
      <template v-if="checkData.length!==0">
        <div class="wrap"  v-for="(item,index) in checkData" :key="index">
          <div class="title">
            <span>第{{checkData.length-index}}次专检</span>
            <el-tag size="mini" :type="item.status | formatStatus('color')">
                {{item.status | formatStatus('text')}}
            </el-tag>
          </div>
          <!-- 表格内容 -->
          <div>
            <TableBody
              :key="index"
              :colConfig="colConfig"
              :data="item.inspectionItemsVoList"
            >
              <template slot="theoretical" slot-scope="{ scope }">
                <el-input
                  disabled
                  :placeholder="scope.row.theoreticalValue">
                </el-input>
              </template>
              <template slot="actual" slot-scope="{ scope }">
                <el-input 
                  disabled
                  :placeholder="scope.row.actualValue">
                </el-input>
              </template>
            </TableBody>
          </div>
          <div class="major-row">
            <span>
              <span>专检人: </span>
              <span>{{item.addName}}</span>
            </span>
            <span>
              <span>专检时间: </span>
              <span>{{item.addTime | shorttime}}</span>
            </span>
          </div>
          <div class="row">
            <span>互检意见: </span>
            <span>{{item.suggestion}}</span>
          </div>
          <div class="row">
            <span>专检图片:</span>
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
import { TableBody } from 'gggj_lib';
export default {
    components: {
      TableBody
    },
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
    data() {
        return {
          colConfig: [
            /* 序号 */
            {
              attrs: {
                label: "序号",
                prop: "index",
                align: "center",
                type: "index",
              },
            },
            {
              attrs: { label: "检验项目", prop: "inspectionItems", align: "center" },
            },
            {
              attrs: { label: "注意事项", prop: "attentionPoints", align: "center" },
            },
            {
              attrs: { label: "允许偏差", prop: "allowableDeviation", align: "center" },
            },
            {
              slot: "theoretical",
              attrs: { label: "理论值", prop: "theoreticalValue", align: "center" },
            },
            {
              slot: "actual",
              attrs: { label: "实际值", prop: "actualValue", align: "center" },
            },
          ],    
        }
    },
    created() {
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
    display: flex;
    margin-top: 32px;
    span:nth-child(odd) {
      margin-right: 5px;
    }
    span {
      flex: 1;
    }
  }
}
.none {
    display: flex;
    justify-content: center;
}
</style>