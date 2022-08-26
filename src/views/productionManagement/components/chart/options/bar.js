import { deepMerge } from '@/utils/productionManagement/tool'
const getBar = (options = {}) => {
  const defaultConfig = {
    title: {
      text: '出勤人数',
      top: 0
    },
    grid: {
      top: 120
    },
    legend: {
      show: true,
      top: 0,
      right: '10%',
      itemGap: 15
    },
    xAxis: {
      data: ['直接生产工人', '辅助人员', '车间管理人员']
    },
    yAxis: {
      name: '(人)',
      nameTextStyle: {
        // align: 'right',
        padding: [0, 30, 0, 0]
      },
      nameGap: 25
    },
    series: [
      {
        type: 'bar',
        data: [23, 24, 18],
        name: '实际出勤人数',
        tooltip: {
          position: 'top'
        }
      },
      {
        type: 'bar',
        data: [26, 24, 18],
        name: '应出勤人数',
        tooltip: {
          position: 'top'
        }
      }
    ],
    tooltip: {
      trigger: 'item'
    }
  };

  let config = deepMerge(defaultConfig, options)
  return config
}

export default {
  getBar
}
