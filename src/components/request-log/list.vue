<style lang="scss" scoped="">

  .R {
    word-wrap: break-word;
    word-break: break-all;
  }

  .good-selects {
    .el-select-dropdown__item {
      height: auto;
      width: 300px;
    }
  }

  .align-word {
    letter-spacing: 1em;
    margin-right: -1em;
  }

  .order-list-item {
    cursor: pointer;
  }

  .good-selects {
    .el-select-dropdown__item {
      width: auto;
    }
  }

  .header-list {
    overflow: hidden;
  }
</style>
<template>
  <div class="order-page">
    <div class="container">
      <div class="opera-btn-group" :class="{up:!showSearch}">
        <div class="opera-icon">
          <!--<span class="">-->
          <!--<i class="el-icon-t-search"></i> 筛选查询-->
          <!--</span>-->
          <span class="pull-left switching-icon" @click="showSearch = !showSearch">
            <i class="el-icon-arrow-up"></i>
            <span v-show="showSearch">收起筛选</span>
            <span v-show="!showSearch">展开筛选</span>
          </span>
        </div>
        <el-form class="advanced-query-form" onsubmit="return false" v-show="showSearch">
          <el-row>
            <el-col :span="8">
              <oms-form-row label="日志请求时间" :span="8">
                <el-col :span="24">
                  <el-date-picker
                    v-model="expectedTime"
                    type="datetimerange"
                    :default-time="['00:00:00', '23:59:59']"
                    placeholder="请选择">
                  </el-date-picker>
                </el-col>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row label="请求域名" :span="7">
                <oms-input type="text" v-model="searchWord.requestDomain" placeholder="请输入请求域名"
                           @keyup.native.enter="searchInOrder"></oms-input>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row label="请求路径" :span="8">
                <oms-input type="text" v-model="searchWord.requestPath" placeholder="请输入请求路径"
                           @keyup.native.enter="searchInOrder"></oms-input>
              </oms-form-row>
            </el-col>
          </el-row>
          <el-row>

            <el-col :span="8">
              <oms-form-row label="请求URL" :span="8">
                <oms-input type="text" v-model="searchWord.requestUrl" placeholder="请输入请求URL"
                           @keyup.native.enter="searchInOrder"></oms-input>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row label="HTTP状态码" :span="8">
                <oms-input type="text" v-model="searchWord.requestStatusCode" placeholder="请输入HTTP状态码"
                           @keyup.native.enter="searchInOrder"></oms-input>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row label="请求方法" :span="8">
                <oms-input type="text" v-model="searchWord.requestHttpMethod" placeholder="请输入请求方法"
                           @keyup.native.enter="searchInOrder"></oms-input>
              </oms-form-row>
            </el-col>
          </el-row>
          <el-row>

            <el-col :span="8">
              <oms-form-row label="请求解密内容" :span="8">
                <oms-input type="text" v-model="searchWord.requestErrorMessage" placeholder="请输入错误信息"
                           @keyup.native.enter="searchInOrder"></oms-input>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row label="异常信息" :span="8">
                <oms-input type="text" v-model="searchWord.requestException" placeholder="请输入异常信息"
                           @keyup.native.enter="searchInOrder"></oms-input>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row label="请求处理时间" :span="8">
                <oms-input type="text" v-model="searchWord.requestHandleTime" placeholder="请输入请求处理时间"
                           @keyup.native.enter="searchInOrder"></oms-input>
              </oms-form-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <oms-form-row label="请求大小" :span="8">
                <oms-input type="text" v-model="searchWord.requestSize" placeholder="请输入请求大小"
                           @keyup.native.enter="searchInOrder"></oms-input>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row label="响应大小" :span="8">
                <oms-input type="text" v-model="searchWord.responseSize" placeholder="请输入响应大小"
                           @keyup.native.enter="searchInOrder"></oms-input>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row label="请求body" :span="8">
                <oms-input type="text" v-model="searchWord.requestBody" placeholder="请输入请求body"
                           @keyup.native.enter="searchInOrder"></oms-input>
              </oms-form-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <oms-form-row label="响应body" :span="8">
                <oms-input type="text" v-model="searchWord.responseBody" placeholder="请输入响应body"
                           @keyup.native.enter="searchInOrder"></oms-input>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row label="调用者应用ID" :span="8">
                <oms-input type="text" v-model="searchWord.requestAppId" placeholder="请输入调用者应用ID"
                           @keyup.native.enter="searchInOrder"></oms-input>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row label="" :span="8">
                <el-button type="primary" native-type="submit" @click="searchInOrder">查询</el-button>
                <el-button native-type="reset" @click="resetSearchForm">重置</el-button>
              </oms-form-row>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <el-table :data="logList" border @row-click="showDetail" class="clearfix" :header-row-class-name="'headerClass'"
                ref="orderDetail">
        <el-table-column prop="requestTime" label="请求时间" :sortable="true"
                         width="200">
          <template slot-scope="scope">
            {{ scope.row.requestTime | time}}
          </template>
        </el-table-column>
        <el-table-column prop="requestClientIp" label="调用者IP" :sortable="true" width="200"></el-table-column>
        <el-table-column prop="requestAppId" label="调用者应用ID" :sortable="true" width="200"></el-table-column>
        <el-table-column prop="requestDomain" label="请求域名" :sortable="true" width="200"></el-table-column>
        <el-table-column prop="requestPath" label="请求路径" :sortable="true" width="200"></el-table-column>
        <el-table-column prop="requestUrl" label="请求URL" :sortable="true" width="200"></el-table-column>
        <el-table-column prop="requestApiStageName" label="请求环境名称" :sortable="true" width="150"></el-table-column>
        <el-table-column prop="requestHttpMethod" label="请求方法" :sortable="true" width="130"></el-table-column>

        <el-table-column prop="requestBody" label="请求body" :sortable="true" min-width="200">
          <div style="max-height: 150px;overflow: auto" slot-scope="{row}">
            {{row.requestBody}}
          </div>
        </el-table-column>
        <el-table-column prop="responseBody" label="响应body" :sortable="true" min-width="200">
          <div style="max-height: 150px;overflow: auto" slot-scope="{row}">
            {{row.responseBody}}
          </div>
        </el-table-column>
        <el-table-column prop="requestStatusCode" label="HTTP状态码" :sortable="true" width="130"></el-table-column>
        <el-table-column prop="requestErrorMessage" label="请求解密内容" :sortable="true" width="200"></el-table-column>
        <el-table-column prop="requestException" label="异常信息" :sortable="true" width="200"></el-table-column>
        <el-table-column prop="requestHandleTime" label="请求处理时间" :sortable="true" width="130"></el-table-column>
        <el-table-column prop="requestSize" label="请求大小" :sortable="true" width="120"></el-table-column>
        <el-table-column prop="responseSize" label="响应大小" :sortable="true" width="120"></el-table-column>
      </el-table>
      <div class="text-center" v-show="(logList.length || pager.currentPage !== 1) && !loadingData">
        <el-cu-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                          :current-page="pager.currentPage"
                          :page-sizes="[10,20,100]" :page-size="10" layout="sizes, prev, pager, next, jumper"
                          :total="pager.count">
        </el-cu-pagination>
      </div>
    </div>

    <!--<page-right :show="showDetailPart" @right-close="resetRightBox" :css="{'width':'1100px','padding':0}">-->
    <!--<detail :currentItem="currentItem" @close="resetRightBox"></detail>-->
    <!--</page-right>-->
  </div>
</template>
<script>
  import {BaseInfo, User} from '@/resources';
  //  import detail from './detail.vue';

  export default {
//    components: {detail},
    data() {
      return {
        loadingData: true,
        showSearch: true,
        logList: [],
        filters: {
          requestDomain: '',
          requestPath: '',
          requestUrl:'',
          requestStatusCode:'',
          requestHttpMethod:'',
          requestErrorMessage:'',
          requestException:'',
          requestHandleTime:'',
          requestSize:'',
          responseSize:'',
          requestBody:'',
          responseBody:'',
          requestAppId:'',
          startTime: '',
          endTime: ''
        },
        searchWord: {
          requestDomain: '',
          requestPath: '',
          requestUrl:'',
          requestStatusCode:'',
          requestHttpMethod:'',
          requestErrorMessage:'',
          requestException:'',
          requestHandleTime:'',
          requestSize:'',
          responseSize:'',
          requestBody:'',
          responseBody:'',
          requestAppId:'',
          startTime: '',
          endTime: ''
        },
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 10
        },
        expectedTime: '',
        userList: []
      };
    },
    mounted() {
      this.getLogPager(1);
    },
    computed: {},
    watch: {
      filters: {
        handler: function () {
          this.getLogPager(1);
        },
        deep: true
      },
      'expectedTime': function (val) {
        if (val) {
          this.searchInOrder();
        } else {
          this.searchWord.startTime = '';
          this.searchWord.endTime = '';
          this.searchInOrder();
        }
      }
    },
    methods: {
      showActionType: function (item) {
        if (item === 'login') {
          item = '登录';
        }
        return item;
      },
      filterUser: function (query) {
        let data = Object.assign({}, {
          pageNo: 1,
          pageSize: 20,
          objectId: 'openapi-system',
          keyWord: query,
          status: 1
        });
        User.query(data).then(res => {
          this.userList = res.data.list;
        });
      },
      handleSizeChange(val) {
        this.pager.pageSize = val;
        this.getLogPager(1);
      },
      handleCurrentChange(val) {
        this.getLogPager(val);
      },
      filterCustomer: function (query) {// 过滤客户
        BaseInfo.query({keyWord: query, type: 0}).then(res => {
          this.customerList = res.data.list;
        });
      },
      getLogPager: function (pageNo) { // 得到日志列表
        this.pager.currentPage = pageNo;
        let param = Object.assign({}, {
          pageNo: pageNo,
          pageSize: this.pager.pageSize
        }, this.filters);
        this.loadingData = true;
        this.$http.get('/request-log/pager', {params: param}).then(res => {
          this.logList = res.data.list;
          this.pager.count = this.pager.currentPage * this.pager.pageSize + (this.logList.length === this.pager.pageSize ? 1 : 0);
          this.loadingData = false;
        });
      },
      showDetail(item) {
        this.currentItemId = item.id;
        this.currentItem = item;
        this.showDetailPart = true;
      },
      resetRightBox() {
        this.showDetailPart = false;
      },
      searchInOrder: function () {// 搜索
        this.searchWord.startTime = this.$formatAryTime(this.expectedTime, 0);
        this.searchWord.endTime = this.$formatAryTime(this.expectedTime, 1);
        Object.assign(this.filters, this.searchWord);
        this.getLogPager(1);
      },
      resetSearchForm: function () {// 重置表单
        this.searchWord = {
          requestDomain: '',
          requestPath: '',
          requestUrl:'',
          requestStatusCode:'',
          requestHttpMethod:'',
          requestErrorMessage:'',
          requestException:'',
          requestHandleTime:'',
          requestSize:'',
          responseSize:'',
          requestBody:'',
          responseBody:'',
          requestAppId:'',
          startTime: '',
          endTime: ''
        };
        this.expectedTime = '';
        this.filters = Object.assign({}, this.searchWord);
        this.getLogPager(1);
      },
      formatTimeToRangeByFormat(time, type) {
        if (!time) return '';
        let str = ' 23:59:59';
        let date = this.$moment(time).format('YYYY-MM-DD');
        return this.$moment(date + (type === 1 ? str : '')).format('YYYY-MM-DD HH:mm:ss');
      },
      formatTime(date) {
        return date ? this.$moment(date).format('YYYY-MM-DD') : '';
      }
    }
  };
</script>
