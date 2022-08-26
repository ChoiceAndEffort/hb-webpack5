export const colConfig = [{
  switch: true, // 是否展示该列
  dragLocked: true, // 禁用拖拽
  switchDisabled: true, // 禁用switch开关;
  attrs: {
    type: 'selection',
    'reserve-selection': true,
    label: '选择',
    prop: 'a',
    fixed: 'left'
  }
},
{
  switch: true, // 是否展示该列
  dragLocked: true, // 不可拖拽
  attrs: {
    label: '序号',
    prop: 'index',
    width: '50px',
    formatter: (v, index, c) => { // 格式化该列数据
      return v.id + 1
    }
  }
},
{
  slot: 'addCol', // 列插槽
  switch: true,
  dragLocked: true,
  switchDisabled: true, // 禁用switch开关;
  attrs: {
    type: 'expand',
    label: '展开',
    prop: 'load'
  }
},
{
  slotHeaderName: 'searchNestingName', // 表头插槽
  slotHeaderSearchType: 'input', // 表头查询类型,目前支持 input 和select
  switch: true,
  searchKey: 'nestingName', // /表头查询字段,用于配置查询的时候传递给后台的字段
  attrs: {
    label: '1套料图名称',
    prop: 'materialCode',
    align: 'right',
    resizable: true,
    // width: '300px',
    'show-overflow-tooltip': true // 当内容过长被隐藏时显示 tooltip
  }
},
{
  slotHeaderName: 'searchTotalPage',
  slotHeaderSearchType: 'input',
  searchKey: 'totalPage',
  switch: true,
  attrs: {
    label: '2图纸数量',
    prop: 'totalPage',
    align: 'center',
    resizable: true
    // width: '100px',
  }
},
{
  switch: true,
  attrs: {
    label: '3零件总重量（千克）',
    prop: 'sparePartsTotalWeight',
    align: 'right',
    // width: '300px',
    'show-overflow-tooltip': true,
    resizable: true,
    sortable: true, // 是否支持排序
    formatter: (v) => {
      return v.sparePartsTotalWeight
    }
  }
},
{
  switch: true,
  slotHeaderName: 'selectStatus',
  slotHeaderSearchType: 'select',
  searchKey: 'status',
  attrs: {
    label: '状态',
    prop: 'status',
    align: 'center',
    // width: '300px'
    formatter: (v) => {
      let map = {
        '0': '未开发',
        '1': '已开发,未受控',
        '2': '已受控,未下发'
      }
      // console.log(v);
      return map[v.status];
    }

  }
},
{
  switch: true,
  slotHeaderName: 'selectStatus',
  slotHeaderSearchType: 'select',
  searchKey: 'status1',
  attrs: {
    label: '状态1',
    prop: 'status1',
    align: 'center',
    // width: '300px'
    formatter: (v) => {
      let map = {
        0: '未开发',
        1: '已开发,未受控',
        2: '已受控,未下发'
      }
      // console.log(v);
      return map[v.status];
    }

  }
},
{
  switch: true,
  attrs: {
    label: '过滤器',
    prop: 'filters',
    align: 'center'
    // width: '900px',

  }
},
{
  switch: true,
  attrs: {
    label: '过滤器',
    prop: 'filters',
    align: 'center'
    // width: '900px',

  }
},
{
  switch: true,
  attrs: {
    label: '过滤器',
    prop: 'filters',
    align: 'center'
    // width: '900px',

  }
},
{
  switch: true,
  attrs: {
    label: '过滤器',
    prop: 'filters',
    align: 'center'
    // width: '900px',

  }
},
{

  slotHeaderName: 'searchRawMaterialTotalWeight',
  switch: true,
  searchKey: 'date',
  attrs: {
    label: '录入日期',
    prop: 'date',
    align: 'center'
    // width: '160px',

  }
},
// {
//     slotHeaderName: 'selectStatus',
//     slotHeaderSearchType: 'select',
//     switch: true,
//     searchKey: "status",
//     attrs: {
//         label: "5图纸状态",
//         prop: "status",
//         align: "center",
//         // width: '160px'
//     },
// },
// {
//     slotHeaderName: 'selectStatus1',
//     slotHeaderSearchType: 'select',
//     switch: true,
//     searchKey: "status1",
//     attrs: {
//         label: "5图纸状态1",
//         prop: "status1",
//         align: "center",
//         // width: '160px'
//     },
// },
{
  slotHeaderName: 'hbSetting', // 是否展示表格配置项
  switch: true,
  attrs: {
    label: '',
    width: '100px',
    fixed: 'right'
  }
}
]

export const colConfig1 = [{
  attrs: {
    label: '1-2图名称',
    prop: 'nestingName',
    align: 'center',
    switch: true,
    resizable: true
  }
},
{
  attrs: {
    label: '2-2纸数量',
    prop: 'totalPage',
    align: 'center',
    switch: true
  }
},
{
  attrs: {
    label: '3-2零件重量（千克）',
    prop: 'sparePartsTotalWeight',
    align: 'center',
    switch: true
  }
},
{
  attrs: {
    label: '4-2料总重量（千克）',
    prop: 'rawMaterialTotalWeight',
    align: 'center',
    switch: true
  }
},
{
  slot: 'opCol',
  attrs: {
    label: '操作',
    align: 'center',
    switch: true
    // width: "200px"
  }
},
{
  slotHeaderName: 'hbSetting',
  attrs: {
    label: '',
    width: '30px',
    switch: true
  }
}
]
