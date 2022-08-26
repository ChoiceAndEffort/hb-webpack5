<!--新增人员-->
<template>
  <div class="sub-page">
    <p class="title">基础信息</p>
    <div class="form">
      <el-form
        :model="formInline.staff"
        :rules="addFormDataRules"
        ref="formInlines"
        label-position="right"
        label-width="100px"
      >
        <el-form-item label="身份证：" prop="idCard">
          <el-input
            v-model="formInline.staff.idCard"
            placeholder="请输入身份证号"
          ></el-input>
        </el-form-item>
        <el-form-item label="姓名：" prop="name">
          <el-input
            v-model="formInline.staff.name"
            placeholder="请输入姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号：" prop="mobile">
          <el-input
            v-model="formInline.staff.mobile"
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>
        <!--                <el-form-item label="性别："  prop="gender">
                    <el-select v-model="formInline.staff.gender" placeholder="请选择" value-key="value">
                        <el-option v-for="(item,index) in genderOptions" :label="item.label" :value = "item.value" :key="index"></el-option>
                    </el-select>
                </el-form-item>-->
        <el-form-item label="常住地址：" >
          <el-input
            v-model="formInline.staff.permanentAddress"
            placeholder="请输入常住地址"
          ></el-input>
        </el-form-item>
        <el-form-item label="家庭地址：" >
          <el-input
            v-model="formInline.staff.homeAddress"
            placeholder="请输入家庭地址"
          ></el-input>
        </el-form-item>
        <el-form-item label="工号：" >
          <el-input
            v-model="formInline.staff.number"
            placeholder="请输入工号"
          ></el-input>
        </el-form-item>
        <!--                <el-form-item label="生日："  prop="birthday">
                    <el-date-picker v-model="formInline.staff.birthday" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
                </el-form-item>-->
        <el-form-item label="入职时间：" prop="hireDate">
          <el-date-picker
            v-model="formInline.staff.hireDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
      </el-form>
    </div>
    <el-divider></el-divider>
    <p class="title">详细信息</p>
    <el-form
      :inline="true"
      :model="totalVerification"
      ref="totalVerification"
      class="demo-form-inline"
    >
      <el-tabs class="tabs" type="border-card" tab-position="left">
        <el-tab-pane>
          <el-form-item
            class="total-verification"
            slot="label"
            label="部门"
            prop="positionList"
            :rules="{
              required: true,
              message: '请完善部门信息',
              trigger: 'change',
            }"
          ></el-form-item>
          <el-button @click="add('positionList')" icon="el-icon-plus"
            >新增部门</el-button
          >
          <el-form
            :inline="true"
            :model="formInline"
            ref="positionList"
            class="demo-form-inline"
          >
            <div
              class="seachBox"
              v-for="(item, index) in formInline.positionList"
              :key="index"
            >
              <el-form-item
                label="部门："
                :prop="'positionList.' + index + '.departmentId'"
                :rules="{
                  required: true,
                  message: '部门不能为空',
                  trigger: 'change',
                }"
              >
                <el-cascader
                  v-model="item.departmentId"
                  :props="departmentOptionsprops"
                  :options="departmentData.departmentOptions"
                  @change="handleStationselect(item.departmentId, index)"
                ></el-cascader>
              </el-form-item>
              <el-form-item
                label="岗位："
                :prop="'positionList.' + index + '.positionId'"
                :rules="{
                  required: true,
                  message: '岗位不能为空',
                  trigger: 'change',
                }"
              >
                  <el-cascader ref="cascader" v-model="item.positionId" :show-all-levels="false" :options="item.stationOptions" :props="props" style="width: 216px" @change="handleRoleselect(item.positionId, index)"></el-cascader>
<!--                <el-select
                  placeholder="请选择岗位"
                  clearable
                  filterable
                  v-model="item.positionId"
                  @change="handleRoleselect(item.positionId, index)"
                >
                  <el-option
                    v-for="items in item.stationOptions"
                    :label="items.name"
                    :value="items.positionId"
                  ></el-option>
                </el-select>-->
              </el-form-item>
              <el-form-item
                label="角色："
                :prop="'positionList.' + index + '.role'"
                align="left"
                v-if="item.roleOptions.length > 0"
                :rules="{
                  required: true,
                  message: '角色不能为空',
                  trigger: 'change',
                }"
              >
                <el-checkbox-group
                  style="margin-left: 30px"
                  v-model="item.role"
                >
                  <el-checkbox
                    v-for="items in item.roleOptions"
                    :label="items.roleId"
                    >{{ items.name }}</el-checkbox
                  >
                </el-checkbox-group>
              </el-form-item>
              <el-button
                type="text"
                icon="el-icon-delete"
                @click="remove('positionList', index)"
              ></el-button>
            </div>
          </el-form>
        </el-tab-pane>
        <el-tab-pane>
            <!-- :rules="{
              required: true,
              message: '请完善工种信息',
              trigger: 'change',
            }" -->
          <el-form-item
            class="total-verification"
            slot="label"
            label="工种"
            prop="workTypeLevelIds"

          ></el-form-item>
          <el-button @click="add('workTypeLevelIds')" icon="el-icon-plus"
            >新增工种</el-button
          >
          <el-form
            :inline="true"
            :model="formInline"
            ref="workTypeLevelIds"
            class="demo-form-inline"
          >
            <div
              class="seachBox"
              v-for="(item, index) in formInline.workTypeLevelIds"
              :key="index"
            >
              <!-- :rules="{
                required: true,
                message: '工种不能为空',
                trigger: 'change',
              }" -->
              <el-form-item
                label="工种："
                :prop="'workTypeLevelIds.' + index + '.workTypeId'"

              >
                <el-select
                  v-model="item.workTypeId"
                  placeholder="请选择工种"
                  @change="handleWorkselect(item.workTypeId, index)"
                >
                  <el-option
                    v-for="items in typeOptions"
                    :key="items.workTypeId"
                    :label="items.name"
                    :value="items.workTypeId"
                  ></el-option>
                </el-select>
              </el-form-item>
              <!-- :rules="{
                required: true,
                message: '工种等级不能为空',
                trigger: 'change',
              }" -->
              <el-form-item
                label="工种等级："
                :prop="'workTypeLevelIds.' + index + '.workTypeLevelId'"

              >
                <el-select
                  v-model="item.workTypeLevelId"
                  clearable
                  filterable
                  placeholder="请选择工种等级"
                >
                  <el-option
                    v-for="items in item.levelOptions"
                    :key="items.workTypeLevelId"
                    :label="items.name"
                    :value="items.workTypeLevelId"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-button
                type="text"
                icon="el-icon-delete"
                @click="remove('workTypeLevelIds', index)"
              ></el-button>
            </div>
          </el-form>
        </el-tab-pane>
        <el-tab-pane>
          <el-form-item
            class="total-verification"
            slot="label"
            label="职业证书"
            prop="professionalCertificateList"
          ></el-form-item>
          <el-button
            @click="add('professionalCertificateList')"
            icon="el-icon-plus"
            >新增职业证书</el-button
          >
          <el-form
            :inline="true"
            :model="formInline"
            ref="professionalCertificateList"
            class="demo-form-inline"
          >
            <div
              class="seachBox"
              v-for="(item, index) in formInline.professionalCertificateList"
              :key="index"
            >
              <el-form-item
                label="证书名称："
                :prop="'professionalCertificateList.' + index + '.name'"
                :rules="{
                  required: true,
                  message: '证书名称不能为空',
                  trigger: 'change',
                }"
              >
                <el-input
                  v-model="item.name"
                  placeholder="请输入证书名称"
                  maxlength="32"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="证书有效期："
                :prop="
                  'professionalCertificateList.' + index + '.expirationTime'
                "
                :rules="{
                  required: true,
                  message: '证书有效期不能为空',
                  trigger: 'change',
                }"
              >
                <el-date-picker
                  v-model="item.expirationTime"
                  type="date"
                  placeholder="选择日期"
                ></el-date-picker>
              </el-form-item>
              <el-form-item
                label="发证机构："
                :prop="
                  'professionalCertificateList.' + index + '.issuingAuthority'
                "
                :rules="{
                  required: true,
                  message: '发证机构不能为空',
                  trigger: 'change',
                }"
              >
                <el-input
                  v-model="item.issuingAuthority"
                  placeholder="请输入发证机构"
                  maxlength="32"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="技能等级："
                :prop="'professionalCertificateList.' + index + '.level'"
                :rules="{
                  required: true,
                  message: '技能等级不能为空',
                  trigger: 'change',
                }"
              >
                <!--                             <el-select v-model="item.dengji" placeholder="请选择技能等级">
                                    <el-option v-for="item in dengjiList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                 </el-select>-->
                <el-input
                  placeholder="请输入职业等级"
                  v-model="item.level"
                  maxlength="32"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="证书类型："
                :prop="'professionalCertificateList.' + index + '.type'"
                :rules="{
                  required: true,
                  message: '证书类型不能为空',
                  trigger: 'change',
                }"
              >
                <!--                             <el-select v-model="item.leixing" placeholder="请选择证书类型：">
                                    <el-option v-for="item in dengjiList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                 </el-select>-->
                <el-input
                  placeholder="请输入证书类型"
                  v-model="item.type"
                  maxlength="32"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="上传附件："
                :prop="'professionalCertificateList.' + index + '.imgUrl'">
<!--                :rules="{
                  required: true,
                  message: '职业证书不能为空',
                  trigger: 'change',
                }"-->

                <UploadFile
                  class="upload-demo"
                  :uploadUrl="uploadSingleurl"
                  :listType="picturecard"
                  :fileList="item.imgUrl ? item.imgUrl.split(',') : ''"
                  :sign="{ index: index, key: 'professionalCertificateList' }"
                  @onSuccess="uploadonSuccess"
                  @handleRemove="uploadonSuccess"
                >
                  <div class="upfles">+上传职业证书</div>
                </UploadFile>
              </el-form-item>

              <el-button
                type="text"
                icon="el-icon-delete"
                @click="remove('professionalCertificateList', index)"
              ></el-button>
            </div>
          </el-form>
        </el-tab-pane>
        <el-tab-pane>
          <el-form-item
            class="total-verification"
            slot="label"
            label="雇主责任险"
            prop="employersLiabilityInsuranceList"
          ></el-form-item>
          <el-button
            @click="add('employersLiabilityInsuranceList')"
            icon="el-icon-plus"
            >新增雇主责任险</el-button
          >
          <el-form
            :inline="true"
            :model="formInline"
            ref="employersLiabilityInsuranceList"
            class="demo-form-inline"
          >
            <div
              class="seachBox"
              v-for="(
                item, index
              ) in formInline.employersLiabilityInsuranceList"
              :key="index"
            >
              <el-form-item label="是否购买：">
                <el-radio v-model="item.isBuy" :label="1">已购买</el-radio>
                <el-radio v-model="item.isBuy" :label="0">未购买</el-radio>
              </el-form-item>
              <el-form-item
                label="批次号："
                v-if="item.isBuy == '1'"
                :prop="
                  'employersLiabilityInsuranceList.' + index + '.batchNumber'
                "
                :rules="{
                  required: true,
                  message: '批次号不能为空',
                  trigger: 'change',
                }"
              >
                <el-input
                  v-model="item.batchNumber"
                  placeholder="请输入批次号"
                  maxlength="32"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="上传附件："
                v-if="item.isBuy == '1'"
                :prop="
                  'employersLiabilityInsuranceList.' + index + '.attachment '
                "
              >
                <UploadFile
                  class="upload-demo"
                  :uploadUrl="uploadSingleurl"
                  :fileList="item.attachment ? item.attachment.split(',') : ''"
                  :isonSuccess="true"
                  :sign="{
                    index: index,
                    key: 'employersLiabilityInsuranceList',
                  }"
                  @onSuccess="uploadonSuccess"
                >
                  <div class="upfles">+上传雇主责任险附件</div>
                </UploadFile>
              </el-form-item>

              <el-button
                type="text"
                icon="el-icon-delete"
                @click="remove('employersLiabilityInsuranceList', index)"
              ></el-button>
            </div>
          </el-form>
        </el-tab-pane>
        <el-tab-pane>
          <el-form-item
            class="total-verification"
            slot="label"
            label="体检"
            prop="medicalExaminationList"
          >
          </el-form-item>
          <el-button @click="add('medicalExaminationList')" icon="el-icon-plus"
            >新增体检报工</el-button
          >
          <el-form
            :inline="true"
            :model="formInline"
            ref="medicalExaminationList"
            class="demo-form-inline"
          >
            <div
              class="seachBox"
              v-for="(item, index) in formInline.medicalExaminationList"
              :key="index"
            >
              <el-form-item
                label="入职体检报告："
                :prop="
                  'medicalExaminationList.' +
                  index +
                  '.entryMedicalExaminationReport '
                "
              >
                <UploadFile
                  class="upload-demo"
                  :uploadUrl="uploadSingleurl"
                  :fileList="
                    item.entryMedicalExaminationReport
                      ? item.entryMedicalExaminationReport.split(',')
                      : ''
                  "
                  :isonSuccess="true"
                  :sign="{ index: index, key: 'entryMedicalExaminationReport' }"
                  @onSuccess="uploadonSuccess"
                >
                  <div class="upfles">+上传入职体检报告</div>
                </UploadFile>
              </el-form-item>
              <el-form-item
                label="离职体检报告："
                :prop="
                  'medicalExaminationList.' +
                  index +
                  '.quitMedicalExaminationReport '
                "
              >
                <UploadFile
                  class="upload-demo"
                  :uploadUrl="uploadSingleurl"
                  :fileList="
                    item.quitMedicalExaminationReport
                      ? item.quitMedicalExaminationReport.split(',')
                      : ''
                  "
                  :isonSuccess="true"
                  :sign="{ index: index, key: 'quitMedicalExaminationReport' }"
                  @onSuccess="uploadonSuccess"
                >
                  <div class="upfles">+上传离职体检报告</div>
                </UploadFile>
              </el-form-item>
              <el-button
                type="text"
                icon="el-icon-delete"
                @click="remove('medicalExaminationList', index)"
              ></el-button>
            </div>
          </el-form>
        </el-tab-pane>
        <el-tab-pane>
          <el-form-item
            class="total-verification"
            slot="label"
            label=" 证件照"
            prop="idPhotoUrl"
          >
          </el-form-item>
          <UploadFile
            class="upload-demo"
            :uploadUrl="uploadSingleurl"
            :fileList="
              formInline.staff.idPhotoUrl
                ? formInline.staff.idPhotoUrl.split(',')
                : ''
            "
            :listType="picturecardt"
            :isonSuccess="true"
            :sign="{ key: 'idPhotoUrl' }"
            @onSuccess="uploadonSuccess"
          >
          </UploadFile>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <div class="footer">
      <el-button @click="back">取消</el-button>
      <el-button type="primary" @click="handleSaveTopform">保存</el-button>
    </div>
  </div>
</template>

<script>
import {
  getDepartmentList,
  getPositionList,
  getWorkTypeList,
  getWorkTypeLevelList,
  getPositionRole,
  operationStaffAllInfo,
  getStaffAllInfo,
} from "@/api/productionManagement/departmentRole.js";
import { enterpriseId } from "@/assets/productionManagement/comjs/login.js";
import { UploadFile } from "gggj_lib";
// import UploadFile from './index';
import { uploadSingleurl } from "@/api/productionManagement/cus.js";
import { idCardValidity, validateMobile } from "@/utils/productionManagement/validate.js";
export default {
  components: { UploadFile },
  data() {
    return {
      uploadSingleurl: uploadSingleurl,
      picturecard: "",
      picturecardt: "picture-card", // 证件照
      addFormDataRules: {
        hireDate: [
          { required: true, message: "入职时间不能为空", trigger: "blur" },
        ],
        // homeAddress: [
        //   { required: true, message: "家庭地址不能为空", trigger: "blur" },
        //   { max: 128, message: "家庭地址不能超过128字符", trigger: "blur" },
        // ],
        idCard: [
          { required: true, message: "请输入证件号", trigger: "blur" },
          {
            pattern:
              /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/,
            message: "请输入正确的证件号",
            trigger: "blur",
          },
          { validator: idCardValidity, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: validateMobile, trigger: "blur" },
        ],
        name: [
          { required: true, message: "员工姓名不能为空", trigger: "blur" },
          { max: 12, message: "员工姓名不能超过12个字符", trigger: "blur" },
        ],
        // number: [
        //   { required: true, message: "工号不能为空", trigger: "blur" },
        //   { max: 32, message: "工号不能超过32位", trigger: "blur" },
        // ],
        // permanentAddress: [
        //   { required: true, message: "常住地址不能为空", trigger: "blur" },
        //   { max: 128, message: "常住地址不能超过128个字符", trigger: "blur" },
        // ],
      },
      totalVerification: {
        positionList: "",
        workTypeLevelIds: "",
        professionalCertificateList: "",
        employersLiabilityInsuranceList: "",
        medicalExaminationList: "",
        idPhotoUrl: "",
      },
      formInline: {
        staff: {
          hireDate: "", // 入职时间
          homeAddress: "", // 家庭地址
          idCard: "", // 身份证号
          mobile: "", // 手机号码
          name: "", // 员工姓名
          number: "", // 工号
          gender: "", // 性别
          birthday: "", // 生日
          permanentAddress: "", // 常住地址
          idPhotoUrl: "", // 证件照
        },
        positionList: [
          {
            departmentId: "", // 部门
            positionId: "",
            stationOptions: [], // 部门集合
            roleOptions: [], // 角色集合
            role: [],
          },
        ], // 部门
        workTypeLevelIds: [
          {
            workTypeId: "", // 工种
            workTypeLevelId: "", // 等级已选的集合
            levelOptions: [], // 等级集合
          },
        ], // 工种
        employersLiabilityInsuranceList: [
          /*       {
                     isBuy: '', // 是否购买
                     batchNumber: '', // 批次号
                     attachment: '' //url
                 }*/
        ], // 责任险
        medicalExaminationList: [
          /*  {
                     entryMedicalExaminationReport: '',
                     quitMedicalExaminationReport: '',
                 }*/
        ], //体检
        professionalCertificateList: [
          /*           {
                     expirationTime: "",
                     imgUrl: "",
                     issuingAuthority: "",
                     level: "",
                     name: "",
                     professionalCertificateId: "",
                     type: "",
                 }*/
        ], // 职业证书
      },
        props: {
            emitPath:false,
            value: 'positionId',
            label: 'name',
            expandTrigger: 'hover',
            checkStrictly: true,
            lazy: true,
            lazyLoad: this.lazyLoad
        },
      /**新*/
      genderOptions: [
        {
          label: "男",
          value: 1,
        },
        {
          label: "女",
          value: 0,
        },
      ],
      departmentOptionsprops: {
        label: "name",
        value: "departmentId",
        expandTrigger: "hover",
        checkStrictly: true,
      },
      departmentData: {
        //tab - 显示数据 - 部门
        departmentOptions: [], // 部门
        stationOptions: [], //岗位
        isLoading: {
          form: false,
          save: false,
        },
      },
      typeOptions: [], //工种
      workTypeFormData: {
        type: "", //工种
        level: "", //等级
      },
      // 当前选中部门id
      curDepartId: '',
    };
  },
  created() {},
  mounted() {
    this.getDepartmentListData();
    this.getWorkTypeListData();
    if (this.$route.query.staffId) {
      this.staffId = this.$route.query.staffId;
      this.getData(this.staffId); //编辑获取页面数据
      this.$route.meta.title = "修改人员";
    } else {
      this.$route.meta.title = "新增人员";
    }
  },
  methods: {
      /**岗位级联*/
      // test
      lazyLoad(node, resolve) {
          this.getProvence(node, resolve)
      },
      // test
      getProvence(node, resolve) {
          getPositionList({
              departmentId: (node.data && node.data.departmentId) ? node.data.departmentId : this?.curDepartId,
              pid: node.value||0
          }).then((json) => {
              if (Array.isArray(json.data)) {
                  const nodes = json.data.map(item => ({
                      positionId: item.positionId, //
                      // value: item.dwdm,
                      name: item.name,
                      leaf: node.level >= 2 // 5层级
                  }))
                  resolve(nodes)
              } else {
                  // this.$message.error(json.data || json.data.error)
              }
          }).catch(error => this.$message.error(error))
      },
    getData(data) {
      getStaffAllInfo(data).then((res) => {
        this.formInline = {
          staff: res.data.staff,
          positionList: [], // 部门
          workTypeLevelIds: [], // 工种
          employersLiabilityInsuranceList:
            res.data.employersLiabilityInsuranceList, // 责任险
          medicalExaminationList: res.data.medicalExaminationList, //体检
          professionalCertificateList: res.data.professionalCertificateList, // 职业证书
        };
        /**部门框回显包括下拉选择框*/
        res.data.positionList.map((position, index) => {
          let rolelist = [];
          position.roleList.map((role) => {
            rolelist = [...rolelist, role.roleId];
          });
          this.formInline.positionList.push({
            departmentId: position.departmentId, // 部门
            positionId: position.positionId,
            stationOptions: [], // 部门集合
            roleOptions: [], // 角色集合
            role: [],
          });
          this.handleStationselect(
            [position.departmentId],
            index,
            position.positionId
          ); // 获取岗位下拉
          this.handleRoleselect(position.positionId, index, rolelist); // 获取角色选择框
        });
        /**工种框回显包括下拉选择框*/
        res.data.workTypeList.map((workTypeId, index) => {
          this.formInline.workTypeLevelIds.push({
            workTypeId: workTypeId.workTypeId, // 工种
            workTypeLevelId: workTypeId.workTypeLevelId, // 等级
            stationOptions: [], // 部门集合
            roleOptions: [], // 角色集合
            role: [],
          });
          this.handleWorkselect(
            workTypeId.workTypeId,
            index,
            workTypeId.workTypeLevelId
          );
        });
      });
    },
    /**获取部门数据*/
    getDepartmentListData() {
      getDepartmentList({
        enterpriseId,
        type: 0,
        status: 1,
      })
        .then((res) => {
          this.departmentData.departmentOptions = res.data;
        })
        .finally(() => {});
    },
    /**根据部门获取岗位*/
    handleStationselect(ids, index, positionId) {
      this.formInline.positionList[index].stationOptions = []; // 清空岗位下拉框
      this.formInline.positionList[index].roleOptions = []; // 清空可选角色复选框
      this.formInline.positionList[index].role = []; // 清空已选角色复选框
      this.formInline.positionList[index].positionId = "";
      this.curDepartId = ids.length >= 1 ? ids[ids.length - 1] : ids[0]
      getPositionList({
        departmentId: ids.length >= 1 ? ids[ids.length - 1] : ids[0],
        pid: 0,
      }).then((res) => {
        this.formInline.positionList[index].stationOptions = res.data;
        if (positionId != undefined)
          this.formInline.positionList[index].positionId = positionId;
      });
    },
    /**切换岗位获取角色*/
    handleRoleselect(id, index, roleList) {
      this.formInline.positionList[index].role = [];
      getPositionRole(id)
        .then((res) => {
          this.formInline.positionList[index].roleOptions = res.data;
          if (roleList != undefined)
            this.formInline.positionList[index].role = roleList;
        })
        .finally(() => {});
    },
    /** 获取工种*/
    getWorkTypeListData() {
      getWorkTypeList({}).then((res) => {
        this.typeOptions = res.data;
      });
    },
    /**根据工种获取等级下拉 */
    handleWorkselect(id, index, workTypeLevelId) {
      this.formInline.workTypeLevelIds[index].levelOptions = [];
      this.formInline.workTypeLevelIds[index].workTypeLevelId = "";
      this.workTypeFormData.level = "";
      getWorkTypeLevelList({
        workTypeId: id,
      }).then((res) => {
        res.data.forEach((res) => {
          this.formInline.workTypeLevelIds[index].levelOptions.push(res);
        });
        if (workTypeLevelId != undefined)
          this.formInline.workTypeLevelIds[index].workTypeLevelId =
            workTypeLevelId;
      });
    },
    //新增
    add(type) {
      if (type == "positionList") {
        // 新增部门
        this.formInline.positionList.push({
          departmentId: "", // 部门
          positionId: "",
          stationOptions: [], // 部门集合
          roleOptions: [], // 角色集合
          role: [],
        });
      } else if (type == "workTypeLevelIds") {
        // 新增工种
        this.formInline.workTypeLevelIds.push({
          workTypeId: "", // 工种
          workTypeLevelId: [], // 等级已选的集合
          levelOptions: [], // 等级集合
        });
      } else if (type == "professionalCertificateList") {
        // 职业证书
        this.formInline.professionalCertificateList.push({
          expirationTime: "",
          imgUrl: "",
          issuingAuthority: "",
          level: "",
          name: "",
          professionalCertificateId: "",
          type: "",
        });
      } else if (type == "medicalExaminationList") {
        // 体检集合
        this.formInline.medicalExaminationList.push({
          entryMedicalExaminationReport: "",
          quitMedicalExaminationReport: "",
        });
      } else if (type == "employersLiabilityInsuranceList") {
        // 雇主责任险集合
        this.formInline.employersLiabilityInsuranceList.push({
          isBuy: 1, // 是否购买
          batchNumber: "", // 批次号
          attachment: "", //url
        });
      } else if (type == "picture") {
        this.formInline.couplingList.push({
          value: "",
        });
      }
    },
    /**上传图片接收上传组件传来的url list*/
    uploadonSuccess(file, list, sendfile, sign) {
      // sendfile是最终的url list
      switch (sign.key) {
        case "professionalCertificateList":
          this.formInline.professionalCertificateList[sign.index].imgUrl =
            sendfile.join(",");
          break;
        case "employersLiabilityInsuranceList":
          this.formInline.employersLiabilityInsuranceList[
            sign.index
          ].attachment = sendfile.join(",");
          break;
        case "entryMedicalExaminationReport":
          this.formInline.medicalExaminationList[
            sign.index
          ].entryMedicalExaminationReport = sendfile.join(",");
          break;
        case "quitMedicalExaminationReport":
          this.formInline.medicalExaminationList[
            sign.index
          ].quitMedicalExaminationReport = sendfile.join(",");
          break;
        case "idPhotoUrl":
          this.formInline.staff.idPhotoUrl = sendfile.join(",");
          break;
      }
    },
    //移除
    remove(type, index) {
      if (type == "positionList") {
        this.formInline.positionList.splice(index, 1);
      } else if (type == "workTypeLevelIds") {
        this.formInline.workTypeLevelIds.splice(index, 1);
      } else if (type == "professionalCertificateList") {
        this.formInline.professionalCertificateList.splice(index, 1);
      } else if (type == "medicalExaminationList") {
        this.formInline.medicalExaminationList.splice(index, 1);
      } else if (type == "employersLiabilityInsuranceList") {
        this.formInline.employersLiabilityInsuranceList.splice(index, 1);
      }
    },
    back() {
      this.$router.go(-1);
    },
    handleSaveTopform() {
      let positionIds = [];
      let roleIds = [];
      let workTypeLevelIds = [];
      this.formInline.positionList.map((item) => {
        if (item.positionId != "")
          positionIds = [...positionIds, item.positionId];
        roleIds = [...roleIds, ...item.role];
      });
      this.formInline.workTypeLevelIds.map((item) => {
        if (item.workTypeLevelId != "")
          workTypeLevelIds.push(item.workTypeLevelId);
      });

      const sendData = {
        staff: this.formInline.staff,
        workTypeLevelIds: workTypeLevelIds, // 工种id集合
        roleIds: roleIds, // 角色id集合
        professionalCertificateList:
          this.formInline.professionalCertificateList,
        positionIds: positionIds,
        medicalExaminationList: this.formInline.medicalExaminationList,
        employersLiabilityInsuranceList:
          this.formInline.employersLiabilityInsuranceList,
        enterpriseId: enterpriseId,
      };
      if (this.staffId != null) sendData.staffId = this.staffId;
      let checkSign = false;
      /**头部基础信息校验*/
      this.$refs.formInlines.validate((valid) => {
        if (valid) {
          checkSign = true;
        } else {
        }
      });
      // 移除表单的部分校验属性
      this.$refs.formInlines.clearValidate(['idCard'])
      /**底部各种表单校验*/
      let massage = ""; // 校验弹框
      this.$refs.positionList.validate((valid) => {
        // 部门
        if (valid) {
          this.totalVerification.positionList = true;
        } else {
          this.totalVerification.positionList = "";
        }
      });
      this.$refs.workTypeLevelIds.validate((valid) => {
        // 工种
        if (valid) {
          this.totalVerification.workTypeLevelIds = true;
        } else {
          this.totalVerification.workTypeLevelIds = "";
        }
      });
      this.$refs.professionalCertificateList.validate((valid) => {
        // 职业证书
        if (valid) {
          this.totalVerification.professionalCertificateList = true;
        } else {
          massage += "请完善职业证书信息";
          this.totalVerification.professionalCertificateList = "";
        }
      });
      this.$refs.employersLiabilityInsuranceList.validate((valid) => {
        // 雇主责任险
        if (valid) {
          this.totalVerification.employersLiabilityInsuranceList = true;
        } else {
          massage += "、雇主责任险信息";
          this.totalVerification.employersLiabilityInsuranceList = "";
        }
      });
      this.$refs.medicalExaminationList.validate((valid) => {
        // 体检的校验暂无用
        if (valid) {
          this.totalVerification.medicalExaminationList = true;
        } else {
          this.totalVerification.medicalExaminationList = "";
        }
      });
      /**总校验*/

      this.$refs.totalVerification.validate((valid) => {
        if (valid && checkSign) {
          if (massage != "") return this.$message.warning(massage);
          operationStaffAllInfo(sendData)
            .then((res) => {
              this.$message({
                message: "保存成功",
                type: "success",
              });
              this.$router.back();
            })
            .finally(() => {});
        } else {
        }
      });
      
      
    },
  },
};
</script>

<style scoped lang="scss">
.sub-page {
  display: flex;
  flex-direction: column;
  ::v-deep .el-form-item__label {
    padding: 0;
  }
  ::v-deep .el-form--inline .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
  }
  ::v-deep .el-tabs__item {
    padding: 0 24px;
    margin-bottom: 0;
  }
  ::v-deep .el-tabs--border-card > .el-tabs__header {
    background: #fafafa;
  }
  .title {
    font-size: 16px;
    font-weight: 700;
    padding-bottom: 24px;
  }
  ::v-deep.total-verification {
    width: 100%;
    cursor: pointer;
    .el-form-item__label {
      cursor: pointer;
      display: block;
      text-align: left;
      font-weight: 500;
    }
    .el-form-item__content {
      width: 100%;
    }
  }
  .form {
    .el-form {
      width: 100%;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      //justify-content: space-around;
      .el-form-item {
        width: 30%;
      }
      .el-date-editor.el-input {
        width: 100%;
      }
    }
  }

  ::v-deep .el-tabs--left {
    flex: 1;
    .el-tabs__item.is-left:first-child {
      margin-top: 13px;
    }
    .el-tabs__item.is-left {
      margin: -1px 0 13px -1px;
      color: #606266 !important;
    }
  }
  ::v-deep .el-tabs--border-card {
    box-shadow: none;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
  }
  ::v-deep .el-tabs--left.el-tabs--border-card .el-tabs__header.is-left {
    border-right: 1px solid #e4e7ed;
  }
  ::v-deep
    .el-tabs--border-card
    > .el-tabs__header
    .el-tabs__item.is-active
    .el-form-item__label {
    color: #1989fa;
  }
  ::v-deep .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
    background-color: #fafafa !important;
  }
  ::v-deep .tabs {
    .el-tabs__item.is-left.is-active {
        border-top: transparent;
        border-bottom: transparent;
        border-right: 1px solid #e4e7ed;
    }
  }
  ::v-deep .el-tabs__content {
    overflow: auto;
    height: 100%;
  }
  .seachBox {
    padding-left: 16px;
    margin: 16px 0;
    border: 1px solid #e4e7ed;
    position: relative;
    .el-form-item {
      margin: 16px 0;
      margin-right: 16px;
      width: 45%;
    }
    .el-button--text {
      position: absolute;
      right: 16px;
      top: 16px;
      color: red;
    }
  }
  .footer {
    height: 60px;
    text-align: right;
    .el-button {
      margin-top: 15px;
    }
  }
  .upfles {
    width: 100%;
    border: 1px solid #dcdfe6;
    padding: 0 50px;
    text-align: center;
    color: #dcdfe6;
  }
  .imgBox {
    width: 178px;
    height: 178px;
    padding: 16px 0;
  }
}
</style>
