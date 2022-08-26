/* eslint-disable */
import * as echarts from 'echarts';
export const workshopReport = {
  // 派工及成本情况
  cost: {
    title: [
      {
        text: '派工及成本情况'
      }
    ],
    barWidth: 55,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      top: 90,
      left: 60,
      bottom: 30,
      right: 10
    },
    xAxis: {
      type: 'category',
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#303133'
      },
      axisLine: {
        lineStyle: {
          color: '#E4E7ED'
        }
      },
      data: ['计划工单数量', '累计派工数量', '累计报工数量']
    },
    yAxis: {
      type: 'value',
      name: '(单)',
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    series: [
      {
        data: [],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#83bff6' },
            { offset: 0.5, color: '#188df0' },
            { offset: 1, color: '#188df0' }
          ])
        },
        type: 'bar'
      }
    ]
  },
  // 出勤人数
  attendance: {
    title: [
      {
        text: '出勤人数',
        textStyle: {
          height: 100
        }
      }
    ],
    grid: {
      top: 90,
      bottom: 30
    },
    barWidth: 30,
    legend: {
      data: ['应到人数', '实到人数'],
      right: 20,
      itemHeight: 8,
      itemGap: 35, // 图例的间距
      formatter: ['{a|{name}}'].join('\n'),
      textStyle: {
        fontSize: 14,
        height: 10,
        rich: {
          a: {
            verticalAlign: 'top'
          }
        }
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: {
      type: 'category',
      axisLabel: {
        color: '#303133'
      },
      axisLine: {
        lineStyle: {
          color: '#E4E7ED'
        }
      },
      axisTick: {
        show: false
      },
      data: ['直接生产工人', '辅助人员', '车间管理人员']
    },
    yAxis: {
      type: 'value',
      name: '(人)',
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    series: [
      {
        name: '应到人数',
        data: [],
        itemStyle: {
          color: '#158FFF'
        },
        type: 'bar'
      },
      {
        name: '实到人数',
        data: [],
        itemStyle: {
          color: '#87C1FE'
        },
        type: 'bar'
      }
    ]
  },
  // 计划产量完成情况
  scheduledProduction: {
    tooltip: {
      trigger: 'item',
      formatter: function(params) {
        var res = '';

        for (var i = 0; i < data.length; i++) {
          if (data[i].name == params.name) {
            res +=
                            data[i].name +
                            ':' +
                            data[i].percent +
                            '</br>' +
                            `
                          <p style="text-align:center">${data[i].num}吨</p>`;
          }
        }
        return res;
      }
    },
    title: [
      {
        text: '计划产量完成情况'
      },
      {
        subtext: '362628.74',
        text: '计划产量(吨)',
        textAlign: 'center',
        textStyle: {
          color: '#333',
          fontWeight: 500,
          fontSize: 13
        },
        top: '45%',
        left: '29%',
        subtextStyle: {
          color: '#333',
          fontSize: 18,
          fontWeight: 600
        }
      }
    ],
    legend: {
      right: '25%',
      top: '30%',
      icon: 'circle',
      width: 50,
      textStyle: {
        rich: {
          a: {
            fontSize: 20,
            verticalAlign: 'top',
            align: 'center',
            padding: [10, 0, 10, 0]
          },
          b: {
            padding: [40, 0, 0, 0]
          }
        }
      },
      formatter: (name) => {
        var total = 0;
        var target;
        var num;
        for (var i = 0, l = data.length; i < l; i++) {
          total += data[i].value;
          if (data[i].name == name) {
            target = data[i].value;
            num = data[i].num;
          }
        }
        return `{b|${name}       ${(target / total) * 100
        }%} \n {a|${num}}吨`;
      }
    },
    series: [
      {
        // name: 'Access From',
        type: 'pie',
        center: ['30%', '52%'],
        radius: ['45%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emptyCircleStyle: {
          color: '#0F85FF'
        },
        emphasis: {
          // label: {
          //   show: false,
          //   fontSize: '40',
          //   fontWeight: 'bold'
          // }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 80, name: '累计完成', itemStyle: { color: '#0F85FF' }},
          { value: 20, name: '未完成', itemStyle: { color: '#E7F2FF' }}
        ]
      }
    ]
  },
  // 当日产量完成情况
  todayProduction: {
    tooltip: {
      trigger: 'item',
      formatter: function(params) {
        var res = '';
        for (var i = 0; i < data1.length; i++) {
          if (data1[i].name == params.name) {
            res +=
                            data1[i].name +
                            ':' +
                            data1[i].percent +
                            '</br>' +
                            `
                          <p style="text-align:center">${data1[i].num}吨</p>`;
          }
        }
        return res;
      }
    },
    title: [
      {
        subtext: '6702.97',
        text: '计划日产量(吨)',
        textAlign: 'center',
        textStyle: {
          color: '#333',
          fontWeight: 500,
          fontSize: 13
        },
        top: '45%',
        left: '29%',
        subtextStyle: {
          color: '#333',
          fontSize: 18,
          fontWeight: 600
        }
      }
    ],
    legend: {
      right: '25%',
      top: '30%',
      icon: 'circle',
      width: 50,
      textStyle: {
        rich: {
          a: {
            fontSize: 20,
            verticalAlign: 'top',
            align: 'center',
            padding: [10, 0, 10, 0]
          },
          b: {
            padding: [40, 0, 0, 0]
          }
        }
      },
      formatter: (name) => {
        var total = 0;
        var target;
        var num;
        for (var i = 0, l = data1.length; i < l; i++) {
          total += data1[i].value;
          if (data1[i].name == name) {
            target = data1[i].value;
            num = data1[i].num;
          }
        }
        return `{b|${name}       ${(target / total) * 100
        }%} \n {a|${num}}吨`;
      }
    },
    series: [
      {
        // name: 'Access From',
        type: 'pie',
        center: ['30%', '52%'],
        radius: ['45%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emptyCircleStyle: {
          color: '#0F85FF'
        },
        emphasis: {
          // label: {
          //   show: false,
          //   fontSize: '40',
          //   fontWeight: 'bold'
          // }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 65, name: '当日完成', itemStyle: { color: '#FF9900' }},
          {
            value: 35,
            name: '当日未完成',
            itemStyle: { color: '#FFF2DF' }
          }
        ]
      }
    ]
  },
  // 产量趋势
  productionTrend: {
    legend: {
      icon: 'rect',
      top: 40,
      right: 10,
      itemHeight: 8, // 图例单个的宽
      itemGap: 35, // 图例的间距
      type: 'scroll',
      formatter: ['{a|{name}}'].join('\n'),
      textStyle: {
        fontSize: 14,
        height: 10,
        rich: {
          a: {
            verticalAlign: 'middle'
          }
        }
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    title: [
      // {
      //   text: "产量趋势",
      // },
      // {
      //   text: ["{a|总产量}", "{b|4320.32}", "{a|吨}"].join(""),
      //   right: 10,
      //   textStyle: {
      //     rich: {
      //       a: {
      //         fontSize: 15,
      //         padding: [0, 10, 0, 15],
      //       },
      //       b: { fontSize: 20, fontWeight: 800 },
      //     },
      //   },
      // },
    ],
    grid: {
      top: 95,
      left: 50,
      right: 50,
      bottom: 50
    },
    xAxis: {
      type: 'category',
      boundaryGap: true,
      axisTick: {
        show: false
      },
      axisLine: {
        lineStyle: {
          color: '#E4E7ED'
        }
      },
      axisLabel: {
        color: '#303133'
      },
      data: [
        '10-01周一',
        '10-02周二',
        '10-03周三',
        '10-04周四',
        '10-05周五',
        '10-06周六',
        '10-07周日',
        '10-08周日',
        '10-09周一',
        '10-10周二',
        '10-11周三',
        '10-12周四',
        '10-13周五',
        '10-14周六',
        '10-15周日',
        '10-16周一',
        '10-17周二',
        '10-18周三',
        '10-19周四',
        '10-20周五',
        '10-21周六',
        '10-22周日',
        '10-23周日',
        '10-24周一',
        '10-25周二',
        '10-26周三',
        '10-27周四',
        '10-28周五',
        '10-29周六',
        '10-30周日'
      ]
    },
    yAxis: {
      type: 'value',
      name: '(吨)',
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    series: [
      // {
      //     name: "下料",
      //     data: [320, 0, 480, 550, 345, 0, 330, 478, 845, 521, 320, 0, 480, 550, 345, 0, 330, 478, 845, 521, 320, 0, 480, 550, 345, 0, 330, 478, 845, 521],
      //     color: "#1677FF",
      //     type: "line",
      //     // symbolSize:0,   //拐点圆的大小
      //     showSymbol: false,
      //     areaStyle: {
      //         normal: {
      //             //自定义颜色，渐变色填充折线图区域
      //             color: new echarts.graphic.LinearGradient(
      //                 0,
      //                 0,
      //                 0,
      //                 1, //变化度
      //                 //渐变色
      //                 [
      //                     {
      //                         offset: 0,
      //                         color: "#AAC9F5",
      //                     },
      //                     {
      //                         offset: 0.5,
      //                         color: "#E9F3FF",
      //                     },
      //                     {
      //                         offset: 1,
      //                         color: "#fff",
      //                     },
      //                 ]
      //             ),
      //         },
      //     },
      // },
      // {
      //     name: "机加",
      //     type: "line",
      //     color: "#FA8E55",
      //     showSymbol: false,
      //     data: [220, 182, 191, 234, 0, 330, 310, 310, 745, 525, 220, 182, 191, 234, 0, 330, 310, 310, 745, 525, 220, 182, 191, 234, 0, 330, 310, 310, 745, 525],
      //     areaStyle: {
      //         normal: {
      //             //自定义颜色，渐变色填充折线图区域
      //             color: new echarts.graphic.LinearGradient(
      //                 0,
      //                 0,
      //                 0,
      //                 1, //变化度
      //                 //渐变色
      //                 [
      //                     {
      //                         offset: 0,
      //                         color: "#F0D1C4",
      //                     },
      //                     {
      //                         offset: 1,
      //                         color: "#FFFAF8",
      //                     },
      //                     {
      //                         offset: 1,
      //                         color: "#FFFFFF",
      //                     },
      //                 ]
      //             ),
      //         },
      //     },
      // },
      // {
      //     name: "单元件",
      //     type: "line",
      //     data: [350, 365, 401, 448, 337, 332, 100, 288, 211, 254, 220, 350, 365, 401, 448, 337, 332, 100, 288, 211, 254, 220, 350, 365, 401, 448, 337, 332, 100, 288, 211, 254, 220],
      //     color: "#52C41A",
      //     showSymbol: false,
      //     areaStyle: {
      //         normal: {
      //             //自定义颜色，渐变色填充折线图区域
      //             color: new echarts.graphic.LinearGradient(
      //                 0,
      //                 0,
      //                 0,
      //                 1, //变化度
      //                 //渐变色
      //                 [
      //                     {
      //                         offset: 0,
      //                         color: "#D6EAC9",
      //                     },
      //                     {
      //                         offset: 0.5,
      //                         color: "#F7FAF2",
      //                     },
      //                     {
      //                         offset: 1,
      //                         color: "#fff",
      //                     },
      //                 ]
      //             ),
      //         },
      //     },
      // },
    ]
  }

}
export const production = {
  trend: {
    legend: {
      // data: ["江夏厂区完成标准吨", "汉南厂区完成标准吨", "外协单位完成标准吨"],
      icon: 'rect',
      top: 40,
      right: 10,
      itemHeight: 8, // 图例单个的宽
      itemGap: 35, // 图例的间距
      formatter: ['{a|{name}}'].join('\n'),
      textStyle: {
        fontSize: 14,
        height: 10,
        rich: {
          a: {
            verticalAlign: 'middle'
          }
        }
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    title: [
      // {
      //   text: ["{a|总产量}", "{b|4320.32}", "{a|吨}"].join(""),
      //   right: 10,
      //   textStyle: {
      //     rich: {
      //       a: {
      //         fontSize: 15,
      //         padding: [0, 10, 0, 15],
      //       },
      //       b: { fontSize: 20, fontWeight: 800 },
      //     },
      //   },
      // },
    ],
    grid: {
      top: 95,
      left: 50,
      right: 50,
      bottom: 30
    },
    xAxis: {
      type: 'category',
      boundaryGap: true,
      axisTick: {
        show: false
      },
      axisLine: {
        lineStyle: {
          color: '#E4E7ED'
        }
      },
      axisLabel: {
        color: '#303133'
      },
      data: [
        '10-23周日',
        '10-24周一',
        '10-25周二',
        '10-26周三',
        '10-27周四',
        '10-28周五',
        '10-29周六',
        '10-30周日'
      ]
    },
    yAxis: {
      type: 'value',
      name: '(吨)',
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    series: [
      {
        name: '江夏厂区完成标准吨',
        data: [320, 0, 480, 550, 345, 0, 330, 478],
        color: '#1677FF',
        type: 'line',
        // symbolSize:0,   //拐点圆的大小
        showSymbol: false,
        areaStyle: {
          normal: {
            // 自定义颜色，渐变色填充折线图区域
            color: new echarts.graphic.LinearGradient(
              0,
              0,
              0,
              1, // 变化度
              // 渐变色
              [
                {
                  offset: 0,
                  color: '#AAC9F5'
                },
                {
                  offset: 0.5,
                  color: '#E9F3FF'
                },
                {
                  offset: 1,
                  color: '#fff'
                }
              ]
            )
          }
        }
      },
      {
        name: '汉南厂区完成标准吨',
        type: 'line',
        color: '#FA8E55',
        showSymbol: false,
        data: [220, 182, 191, 234, 0, 330, 310, 310],
        areaStyle: {
          normal: {
            // 自定义颜色，渐变色填充折线图区域
            color: new echarts.graphic.LinearGradient(
              0,
              0,
              0,
              1, // 变化度
              // 渐变色
              [
                {
                  offset: 0,
                  color: '#F0D1C4'
                },
                {
                  offset: 1,
                  color: '#FFFAF8'
                },
                {
                  offset: 1,
                  color: '#FFFFFF'
                }
              ]
            )
          }
        }
      },
      {
        name: '外协单位完成标准吨',
        type: 'line',
        data: [350, 365, 401, 448, 337, 332, 100, 288],
        color: '#52C41A',
        showSymbol: false,
        areaStyle: {
          normal: {
            // 自定义颜色，渐变色填充折线图区域
            color: new echarts.graphic.LinearGradient(
              0,
              0,
              0,
              1, // 变化度
              // 渐变色
              [
                {
                  offset: 0,
                  color: '#D6EAC9'
                },
                {
                  offset: 0.5,
                  color: '#F7FAF2'
                },
                {
                  offset: 1,
                  color: '#fff'
                }
              ]
            )
          }
        }
      }
    ]
  }
}
