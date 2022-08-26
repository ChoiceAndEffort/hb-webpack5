<template>
  <FileUpload :uploadUrl="uploadUrl" :limit="limit" :fileList="fileList">
      <!-- <template v-slot:tips><div>{{tips}}</div></template> -->
  </FileUpload>
</template>

<script>
import FileUpload from '@/components/FileUpload'
export default {
    data(){
        return {
            uploadUrl: 'https://jsonplaceholder.typicode.com/posts/',
            limit: 10,
            fileList: [
                {
                id: '1',
                name: "food.jpeg",
                size: 210,
                url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
                },
                {
                id: '2',
                name: "food2.jpeg",
                size: 334,
                url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
                },
            ],
            tips: '只能上传jpg/png文件，且不超过500kb'
            
        }
    },
    components: {
        FileUpload
    }
}
</script>

<style lang="scss" scoped>

</style>