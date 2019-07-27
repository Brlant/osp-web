import { BaseInfo, TempDev } from '@/resources';
export default {
  data () {
    return {
      allTempList: [],
      orgList: [],
      customerList: [],
      tempTypeList: ['有线温度计', '无线温度计', '冷柜温度计', '车头温度计', '湿度计']
    };
  },
  methods: {
    queryCustomer: function (query) {// 查询客户
      BaseInfo.query({keyWord: query}).then(res => {
        this.customerList = res.data.list;
      });
    },
    queryOrg: function (query) {// 查询货主
      BaseInfo.query({keyWord: query, type: '0'}).then(res => {
        this.orgList = res.data.list;
      });
    },
    queryAllTemp(query) {
      TempDev.query({devName: query}).then(res => {
        this.allTempList = res.data.currentList;
      });
    }
  }
};
