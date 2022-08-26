/* eslint-disable */
import { deepMerge } from '@/utils/productionManagement/tool';
const getProd = (configData = {}) => {
  let data = [{
    name: `下半月计划产量(吨)     ${configData.halfPlan}`,
    value: configData.halfPlan
  },
  {
    name: `日计划完成产量(吨)     ${configData.dayPlan}`,
    value: configData.dayPlan
  },
  {
    name: `实际当日完成产量(吨)     ${configData.dayCount}`,
    value: configData.dayCount
  }
  // {
  //   name: "车间4",
  //   value: 200
  // }
  ];
  let arrName = getArrayValue(data, 'name');
  let arrValue = getArrayValue(data, 'value');
  let sumValue = 1000;
  let objData = array2obj(data, 'name');
  let optionData = getData(data)

  function getArrayValue(array, key) {
    var key = key || 'value';
    var res = [];
    if (array) {
      array.forEach(function(t) {
        res.push(t[key]);
      });
    }
    return res;
  }

  function array2obj(array, key) {
    var resObj = {};
    for (var i = 0; i < array.length; i++) {
      resObj[array[i][key]] = array[i];
    }
    return resObj;
  }

  function getData(data) {
    var res = {
      series: [{
        name: '大环',
        type: 'gauge',
        splitNumber: 15,
        radius: '82%',
        center: ['50%', '55%'],
        startAngle: 90,
        endAngle: -270,
        axisLine: {
          show: false

        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false

        },
        axisLabel: {
          show: false
        },
        detail: {
          show: false
        }
      }

      ],
      yAxis: []
    };
    for (let i = 0; i < data.length; i++) {
      res.series.push({
        width: '75%',
        height: '75%',
        name: '学历',
        type: 'pie',
        clockWise: true,
        z: 2,
        hoverAnimation: false,
        radius: [73 - i * 15 + '%', 68 - i * 15 + '%'],
        center: ['75%', '50%'],
        label: {
          show: false,

          formatter: function(params) {
            return params.value;
          }
        },
        labelLine: {
          show: false
        },
        data: [{
          value: data[i].value,
          name: data[i].name
        }, {
          value: sumValue - data[i].value,
          name: '',
          itemStyle: {
            color: '#ddd',
            borderWidth: 0
          },
          tooltip: {
            show: false
          },
          label: {
            show: false
          },
          hoverAnimation: false
        }]
      });
      res.yAxis.push(data[i].name);
    }
    return res;
  }

  let defaultConfig = {
    title: {
      text: '下半月产量(吨)'
    },
    color: ['#678CFF', 'transparent', '#FFBD66', '#70C27C'],
    legend: {
      show: true,
      data: arrName,
      bottom: 10,
      left: '30%',
      orient: 'vertical'
    },
    // grid: {
    //   top: '10.5%',
    //   bottom: '58%',
    //   left: "50%",
    //   containLabel: false
    // },
    yAxis: [{
      type: 'category',
      inverse: true,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        interval: 0,
        inside: false,
        textStyle: {
          color: 'RGB(78,184,252)',
          fontSize: 14
        },
        // show: true
        show: false
      },
      data: optionData.yAxis
    }],
    xAxis: [{
      show: false
    }],
    series: optionData.series
  };

  // let config = deepMerge(defaultConfig, options);

  return defaultConfig;
};

export default { getProd };
