<!--文件上传-->
<template>
    <div>
        <el-upload
            :limit="limitNum"
            :list-type="listType"
            :file-list="newfileList"
            :before-upload = "beforeUpload"
            :on-success = "onSuccess"
            :on-error = "onError"
            :on-remove = "handleRemove"
            :on-exceed = "handleExceed"
            :before-remove = "beforeRemove"
            :on-preview = "handlePreview"
            :data = data
            :name = name
            :action="uploadUrl"
            :show-file-list="showfileList">
            <slot></slot>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible" width="500px">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
    </div>

</template>

<script>
export default{
    props:{
        uploadUrl: { //上传地址
            type: String,
            default: ''
        },
        limitNum: { //上传限制大小
            type: Number,
            default: 1
        },
        listType: { //element上传列表样式 // picture 图片缩略图  //picture-card 图片正方形  //'' 文件
            type: String,
            default: ''
        },
        fileList: { //文件列表
            type: Array,
            default: () => []
        },
        data: { //上传增加参数
            type: String,
            default: null
        },
        name: { //上传默认字段
            type: String,
            default: 'file'
        },
        uploadType: { //上传支持的格式
            type: Array,
            default: () => []
        },
        uploadSize: { // 上传文件大小限制
            type: Number,
            default: 500
        },
        showfileList: { // 是否展示文件列表
            type: Boolean,
            default: true
        },
        sign: {
            type: Object,
            default: () => {

            }
        }
    },
    data() {
        return {
            newfileList: [], // 父组件传过来的默认list用于编辑页面回显
            sendfileList: [], // 用来获取要删除的index
            dialogImageUrl: '',
            dialogVisible: false,
            disabled: false
        }
    },
    watch: {
        fileList(newData, oldData){
            this.newfileList = []
            if(typeof this.fileList == "string" && this.fileList != ''){ // 传过来的可能是字符串url
                this.sendfileList = [this.fileList]  // 传给父组件的list
                this.newfileList = [{name: this.fileList, url: this.fileList}]
            }else if(this.fileList[0] != ''){ // 传过来的可能是数组多个url
                this.sendfileList = this.fileList // 传给父组件的list
                this.fileList.map(data => {
                    this.newfileList.push({name: data, url: data})
                })
            }
        }
    },
    mounted() {
    },
    methods:{
        beforeUpload(file, fileList) { // 上传前
            if(this.isbeforeUpload) this.$emit('beforeUpload',file, fileList)
            const isLt1M = file.size / 1024 / 1024 < this.uploadSize;
            if (this.uploadType.length>0 && this.uploadType.indexOf(file.type) == -1) {
                this.$alert('请上传'+this.uploadType.join('、')+'格式的图片!', '提示', { confirmButtonText: '知道了', showClose: false });
                return false
            }
            if (!isLt1M) {
                this.$alert('图片大小不能超过'+this.uploadSize+'M!', '提示', { confirmButtonText: '知道了',showClose:false });
                return false
            }
        },
        onSuccess(file, fileList){ // 上传成功
            this.sendfileList.push(file.data)
            if(this.$listeners['onSuccess'] != undefined) this.$emit('onSuccess',file, fileList,this.sendfileList,this.sign)
        },
        onError(file, fileList) {  // 上传失败时
            if(this.$listeners['onError'] != undefined) this.$emit('onError',file, fileList)
        },
        handleRemove(file, fileList) { // 移除文件时
            const removeurl = file.response.data
            this.sendfileList.splice(this.sendfileList.indexOf(removeurl),1)
            if(this.$listeners['handleRemove'] != undefined) this.$emit('handleRemove',file, fileList,this.sendfileList,this.sign)
        },
        beforeRemove(file, fileList) {  // 移除文件前
            if(this.$listeners['beforeRemove'] != undefined) this.$emit('beforeRemove',file, fileList)
        },
        handleExceed(file, fileList) {  // 上传受限制时
            if(this.$listeners['handleExceed'] != undefined) this.$emit('handleExceed',file, fileList)
            this.$message.warning('上传数量达到上限');
            return false
        },
        handlePreview(file, fileList) {
            if(this.$listeners['handlePreview'] != undefined) {
                this.$emit('handlePreview',file, fileList)
            }else if(this.listType==''){
                window.location.href = file.url || file.response.data;
            }else{
                this.dialogImageUrl = file.url || file.response.data;
                this.dialogVisible = true;
            }
        },
    }
}
</script>

<style lang="scss" scoped>
</style>
