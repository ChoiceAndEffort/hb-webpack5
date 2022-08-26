import Vue from 'vue';
import moment from 'moment';
import { subDate, DateDiff, shortTime } from '@/utils/productionManagement/tool';

Vue.filter('longTime', function(value) {
  return moment(value).format('YYYY-MM-DD HH:mm:ss');
});

// 短时间
Vue.filter('shorttime', function(value) {
  return value ? moment(value).format('YYYY-MM-DD') : '';
});

// 具体时间 YYYY年MM月DD日
Vue.filter('specifictime', function(value) {
  return moment(value).format('YYYY年MM月DD日');
});

// 字符串为空时
Vue.filter('emptyString', function(value) {
  return value || '--';
});

// 数字为空时
Vue.filter('emptyNumber', function(value) {
  return value || '0';
});

// 字符串超过指定长度时显示省略号
Vue.filter('lengthString', function(value, length) {
  return value.length > length ? value.substr(0, length) + '...' : value;
});

// 工艺定额
Vue.filter('quotaStatus', function(value) {
  let data = '';
  switch (value) {
    case 0:
      data = '未配置';
      break;
    case 1:
      data = '已配置';
      break;
  }
  return data;
});
// 人员配置
Vue.filter('SaffedStatus', function(value) {
  let data = '';
  switch (value) {
    case 0:
      data = '未配置';
      break;
    case 1:
      data = '已配置';
      break;
  }
  return data;
});

// 详情配置
Vue.filter('detailStatus', function(value) {
  let data = '';
  switch (value) {
    case 0:
      data = '未编辑';
      break;
    case 1:
      data = '已编辑';
      break;
  }
  return data;
});

// 审核状态
Vue.filter('status', function(value) {
  let data = '';
  switch (value) {
    case 0:
      data = '待审核';
      break;
    case 1:
      data = '审核中';
      break;
    case 2:
      data = '通过';
      break;
    case 3:
      data = '驳回';
      break;
  }
  return data;
});

// 类型状态
Vue.filter('type', function(value) {
  let data = '';
  switch (value) {
    case 0:
      data = '设计描述问题';
      break;
    case 1:
      data = '结构问题';
      break;
    case 2:
      data = '焊接问题';
      break;
    case 3:
      data = '涂装问题';
      break;
    case 4:
      data = '材料问题';
      break;
  }
  return data;
});

// 整改状态
Vue.filter('rectificationType', function(value) {
  let data = '';
  switch (value) {
    case 0:
      data = '待整改';
      break;
    case 1:
      data = '已整改';
      break;
  }
  return data;
});

// 消息状态
Vue.filter('messageStatus', function(value) {
  let data = '';
  switch (value) {
    case 0:
      data = '未处理';
      break;
    case 1:
      data = '已处理';
      break;
  }
  return data;
});

// 消息类型
Vue.filter('messageType', function(value) {
  let data = '';
  switch (value) {
    case 1:
      data = '项目设计答疑';
      break;
    case 2:
      data = '项目设计变更';
      break;
    case 3:
      data = '开工报告';
      break;
    case 4:
      data = '问题反馈';
      break;
  }
  return data;
});

// 是否跨单位
Vue.filter('isCrossCompanyType', function(value) {
  let data = '';
  switch (value) {
    case 0:
      data = '否';
      break;
    case 1:
      data = '是';
      break;
  }
  return data;
});

// 单位类型
Vue.filter('unitType', function(value) {
  let data = '';
  switch (value) {
    case 0:
      data = '建设单位';
      break;
    case 1:
      data = '监理单位';
      break;
    case 2:
      data = '总承包';
      break;
    case 3:
      data = '专业分包';
      break;
    case 4:
      data = '设计单位';
      break;
    case 5:
      data = '监控单位';
      break;
    case 6:
      data = '检验单位';
      break;
  }
  return data;
});

// 复验结果
Vue.filter('reinspectionStatus', function(value) {
  let data = '';
  switch (value) {
    case 0:
      data = '不合格';
      break;
    case 1:
      data = '合格';
      break;
  }
  return data;
});

// 检验状态
Vue.filter('inspectionDtatus', function(value) {
  let data = '';
  switch (value) {
    case 0:
      data = ' 待审核';
      break;
    case 1:
      data = '通过 ';
      break;
    case 2:
      data = '驳回 ';
      break;
  }
  return data;
});

// 支付类型
Vue.filter('PaymentType', function(value) {
  let data = '';
  switch (value) {
    case 0:
      data = ' 预付款';
      break;
    case 1:
      data = '工程款 ';
      break;
    case 2:
      data = '质保金 ';
      break;
  }
  return data;
});

// 查阅状态
Vue.filter('readStatus', function(value) {
  let data = '';
  switch (value) {
    case 0:
      data = '未读';
      break;
    case 1:
      data = '已读';
      break;
  }
  return data;
});

// 查阅状态
Vue.filter('completeStatus', function(value) {
  let data = '';
  switch (value) {
    case 0:
      data = '未完成';
      break;
    case 1:
      data = '已完成';
      break;
  }
  return data;
});

// 申请率
Vue.filter('Rate', function(value) {
  if (!value) {
    return '--';
  } else {
    return value * 100 + '%';
  }
});

// 百分比
Vue.filter('rateOnly', function(value) {
  if (!value) {
    return '--';
  } else {
    return value + '%';
  }
});

// 计算计划完成比例
Vue.filter('networkRate', function(value, startTime, endTime, duration) {
  if (!startTime || !duration || !endTime) {
    return '-';
  } else {
    let start = new Date(startTime);
    let end = new Date(endTime);
    let nowDate = new Date()
    if (nowDate >= end) {
      return '100';
    } else if (nowDate < start) {
      return '0';
    } else {
      let now = subDate(new Date(), 'YYYY-MM-DD');
      let start = shortTime(startTime);
      let days = DateDiff(start, now);
      return (days / duration).toFixed(4) * 1000000 / 10000;
    }
  }
});

// 过滤质量检验状态
Vue.filter('filterQualityStatus', (value, type) => {
  switch (value) {
    case 0: { return type === 'text' ? '待检验' : 'warning' }
    case 1: { return type === 'text' ? '互检中' : 'warning' }
    case 2: { return type === 'text' ? '互检退检' : 'danger' }
    case 3: { return type === 'text' ? '专检中' : 'warning' }
    case 4: { return type === 'text' ? '专检退检' : 'danger' }
    case 5: { return type === 'text' ? '外部检验中' : 'warning' }
    case 6: { return type === 'text' ? '外部检验退检' : 'danger' }
    case 7: { return type === 'text' ? '检验完成' : 'success' }
  }
})
