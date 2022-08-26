<!-- 物料焊缝/附属件新增组件 -->
<template>
    <el-form ref="form" :model="form" label-width="100px" :rules="addMaterialRules">
        <el-form-item label="焊缝编号:" prop="weldingNumber" v-if="addType === 'Weldline'">
            <el-input v-model="form.weldingNumber"></el-input>
        </el-form-item>
        <el-form-item label="焊缝类型:"  prop="weldingType" v-if="addType === 'Weldline'">
            <el-input v-model="form.weldingType"></el-input>
        </el-form-item>
        <el-form-item label="焊缝长度:"  prop="weldingLength" v-if="addType === 'Weldline'">
            <el-input v-model.number="form.weldingLength" class="input-with-select">
                    <el-button slot="append" >吨</el-button>
            </el-input>
        </el-form-item>
        <el-form-item label="附属件名称:"  prop="nameOfAccessories" v-if="addType === 'Subsidiary'">
            <el-input v-model="form.nameOfAccessories"></el-input>
        </el-form-item>
        <el-form-item label="附属件数量:"  prop="numberOfAccessories" v-if="addType === 'Subsidiary'">
            <el-input v-model.number="form.numberOfAccessories"></el-input>
        </el-form-item>
    </el-form>
</template>

<script>
import { addMaterialRules } from '@/utils/productionManagement/valid'
export default {
    props: {
        addType: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            addMaterialRules,
            form: {
                weldingNumber: '',
                weldingType: '',
                weldingLength: '',
                nameOfAccessories: '',
                numberOfAccessories: '',
            }
        }
    }
}
</script>

<style scoped lang="scss">

</style>