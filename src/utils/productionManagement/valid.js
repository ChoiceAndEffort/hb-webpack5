// 新增项目

export const addprojectRules = {
  name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
  number: [{ required: true, message: '请输入项目编号', trigger: 'blur' }],
  remark: [{ required: true, message: '请输入项目简介', trigger: 'blur' }],
  transportPlace: [{ required: true, message: '请输入目的地', trigger: 'blur' }],
  liaison: [{ required: true, message: '请输入收货人', trigger: 'blur' }],
  liaisonPhone: [{ required: true, message: '请输入收货人联系方式', trigger: 'blur' }],
  couplingSize: [
    { required: true, message: '请输入联段数量', trigger: 'blur' }
  ]
};

export const addprojectRules2 = {
  couplingSize: [
    { required: true, message: '请输入联段数量', trigger: 'blur' }
  ]
};
// 新增零件
export const addpartsRules = {
  partNumber: [
    { required: true, message: '请输入零件编号', trigger: 'blur' }
  ],
  partCode: [{ required: true, message: '请输入零件编码', trigger: 'blur' }],
  partWeight: [
    { required: true, message: '请输入零件重量(单重)', trigger: 'blur' }
  ],
  partSize: [{ required: true, message: '请输入零件数量', trigger: 'blur' }]
};

// 新增物料 焊缝/附属件
export const addMaterialRules = {
  weldingNumber: [
    { required: true, message: '请输入焊缝编号', trigger: 'blur' }
  ],
  weldingType: [
    { required: true, message: '请输入焊缝类型', trigger: 'blur' }
  ],
  weldingLength: [
    { required: true, message: '请输入焊缝长度(米)', trigger: 'blur' }
  ],
  nameOfAccessories: [
    { required: true, message: '请输入附属件名称', trigger: 'blur' }
  ],
  numberOfAccessories: [
    { required: true, message: '请输入附属件数量', trigger: 'blur' }
  ]
};

// 新增bom 组件
export const addBomRules = {
  subassemblyCode: [
    { required: true, message: '请输入组件编号', trigger: 'blur' }
  ],
  subassemblyAmount: [
    { required: true, message: '请输入组件数量', trigger: 'blur' }
  ]
};

// 套料编辑坡口
export const editGroove = {
  grooveName: [
    { required: true, message: '请输入坡口名称', trigger: 'blur' }
  ],
  grooveType: [
    { required: true, message: '请输入坡口类型', trigger: 'blur' }
  ],
  grooveLength: [
    { required: true, message: '请输入坡口长度', trigger: 'blur' }
  ]
};

// 涂装用量配置编辑
export const coatingEdit = {
  materialName: [
    { required: true, message: '请输入物料名称', trigger: 'blur' }
  ],
  dryFilmThickness: [
    { required: true, message: '请输入干膜厚度', trigger: 'blur' }
  ],
  solidContent: [
    { required: true, message: '请输入固体含量', trigger: 'blur' }
  ],
  specificGravity: [
    { required: true, message: '请输入比重', trigger: 'blur' }
  ],
  spreadingRate: [
    { required: true, message: '请输入涂布率', trigger: 'blur' }
  ],
  lossCoefficient: [
    { required: true, message: '请输入损耗系数', trigger: 'blur' }
  ]
};

// 运输列表配置
export const transportRules = {
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' }
  ],
  number: [
    { required: true, message: '请输入编号', trigger: 'blur' }
  ],
  height: [
    { required: true, message: '请输入高度', trigger: 'blur' }
  ],
  width: [
    { required: true, message: '请输入宽度', trigger: 'blur' }
  ],
  length: [
    { required: true, message: '请输入长度', trigger: 'blur' }
  ],
  amount: [
    { required: true, message: '请输入数量', trigger: 'blur' }
  ],
  weight: [
    { required: true, message: '请输入单重', trigger: 'blur' }
  ],
  totalW: [
    { required: true, message: '请输入总重', trigger: 'blur' }
  ]
}
