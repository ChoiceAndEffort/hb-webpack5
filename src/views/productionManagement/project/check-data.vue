<!--套料校验-->
<template>
    <div class="main">
       <ExcelEdit ref="checkExcel" :headerKeys="headerKeys" @handleImport="handleImport" @handleBack="() => this.$router.back()"/>
    </div>
</template>

<script>
import {ExcelEdit} from 'gggj_lib';
import {executionNestingImport,executionMaterialImport,executionBomImport,checkMaterialBlankingAgain,checkNestingAgain,checkBomAgain} from "@/api/productionManagement/project.js"
export default {
    components:{ExcelEdit},
    data() {
        return {
            headerKeys: {},
        };

    },
    created() {
        let queryData = JSON.parse(sessionStorage.getItem('queryData'))
        let query = this.$route.query
        if (typeof this.$route.query.headerKeys == 'string')
            query = queryData
        if(query.type){
            switch(query.type) {
                case '1': {
                    this.data=query.nestingListBos
                };break;
                case '2': {
                    this.data=query.materialListVos
                };break;
                case '3': {
                    this.data=query.bomListBos
                }
            }
            this.headerKeys=query.headerKeys;
        }
    },
    mounted() {
        this.$refs.checkExcel.start(this.data);
    },
    methods: {
        async handleImport(tableData){
            let queryData = JSON.parse(sessionStorage.getItem('queryData'))
            let query = this.$route.query
            if (typeof this.$route.query.headerKeys == 'string')
                query = queryData
            const { type } = query
            if (type == 1) {
                let res
                let nestingListBoList = tableData
                try {
                    res = await checkNestingAgain({
                        nestingListBos: tableData,
                        engineeringProjectId: query.engineeringProjectId,
                        procedureId: query.procedureId,
                        couplingId: query.couplingId,
                        workingProcedureCode: query.workingProcedureCode
                    })
                   if (res.code === 0) {
                        res = await executionNestingImport({
                            ...query,
                            nestingListBoList
                        })
                        this.$message({type: 'success', message: '导入成功'})
                        this.$router.back()
                    }
                } catch (error) {
                    error.code !== 0 && this.$refs.checkExcel.start(error.data.nestingListBos);
                }
            } else if (type == 2) {
                let res
                let materiaListBoList = tableData
                try {
                    res = await checkMaterialBlankingAgain({
                        engineeringProjectId: query.engineeringProjectId,
                        couplingId: query.couplingId,
                        procedureId: query.procedureId,
                        materialListBos: tableData,
                        workingProcedureCode: query.workingProcedureCode
                    })
                    if (res.code === 0) {
                        res = await executionMaterialImport({
                            ...query,
                            materiaListBoList
                        })
                        this.$message({type: 'success', message: '导入成功'})
                        this.$router.back()
                    }
                } catch (error) {
                    error.code !== 0 && this.$refs.checkExcel.start(error.data.materialListVos);
                }
            } else if (type == 3) {
                let res
                let bomDataBoList = tableData
                try {
                    res = await checkBomAgain({
                        bomListBos: tableData,
                    })
                   if (res.code === 0) {
                        res = await executionBomImport({
                            ...query,
                            bomDataBoList
                        })
                        this.$message({type: 'success', message: '导入成功'})
                        this.$router.back()
                    }
                } catch (error) {
                    error.code !== 0 && this.$refs.checkExcel.start(error.data.bomListBos);
                }
            }
	    }
    }
};
</script>

<style scoped lang="scss">
.main {
    min-height: 100%;
    background-color: #fff;
    padding: 16px;
}
</style>
