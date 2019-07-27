export default {
  data () {
    return {
      checkList: [
        {label: '温度值', key: '0', unit: '℃'},
        {label: '湿度值', key: '1', unit: '%'},
        {label: '无监控数据时限', key: '2', unit: 'min'},
        {label: '电压值', key: '3', unit: 'V'}
      ],
      conditions: [
        {label: '大于', key: '1'},
        {label: '小于', key: '0'}
      ],
      levels: [
        {label: '低', key: '0'},
        {label: '高', key: '1'}
      ],
      logicList: [
        {label: '满足一个条件', key: '0'},
        {label: '满足所有条件', key: '1'}
      ]
    };
  }
};
