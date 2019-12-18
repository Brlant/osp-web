<style lang="scss" scoped>

  .el-form .el-select {
    display: block;
  }

  .d-table-right {
    .org-name-h2 {
      font-size: 16px;
      font-weight: bold;
    }
  }

  .d-table-col-wrap {
    overflow: auto;
  }

  .empty-info {
    margin-top: 40px;
  }

  .table {
    margin-bottom: 0;
  }

  .table-remark {
    tbody td {
      word-wrap: break-word;
      word-break: break-all;
    }
  }
</style>
<template>
  <div>
    <div class="d-table">
      <div class="d-table-left">
        <div class="d-table-col-wrap" :style="'height:'+bodyHeight" @scroll="scrollLoadingData">
          <h2 class="header">
          <span class="pull-right">
              <a href="#" class="btn-circle" @click.prevent="searchType"><i
                class="el-icon-t-search"></i> </a>
          </span>
            接口设置
          </h2>
          <div class="search-left-box" v-show="showTypeSearch">
            <oms-input v-model="typeTxt" placeholder="请输入关键字搜索" :showFocus="showTypeSearch"></oms-input>
          </div>
          <div v-if="showTypeList.length===0" class="empty-info">
            暂无信息
          </div>
          <div v-else>
            <ul class="show-list">
              <li v-for="item in showTypeList" class="list-item"
                  :class="{'active':item.id==currentItem.id}" @click="showItem(item)">
                <div class="id-part">
                  系统代码 {{item.manufacturerCode }}
                </div>
                <div>
                  {{item.name }}
                </div>
              </li>
            </ul>
            <div class="btn-left-list-more">
              <bottom-loading></bottom-loading>
              <div @click.stop="getOrgMore" v-show="!$store.state.bottomLoading">
                <el-button v-show="pager.currentPage<pager.totalPage">加载更多</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="d-table-right" >
        <div class="d-table-col-wrap" :style="'height:'+bodyHeight">
          <h2 class="org-name-h2" v-show="currentItem.manufacturerCode">系统代码:{{currentItem.manufacturerCode}}</h2>
          <table class="table table-hover table-remark" v-loading="loadingAccountList">
            <thead>
            <tr>
              <th width="20%">接口名称</th>
              <th width="35%">接口路径</th>
              <th width="15%">访问次数</th>
              <th width="15%">剩余访问次数</th>
              <th width="25%">操作</th>
            </tr>
            </thead>
            <tbody v-show="dataRows.length === 0">
            <tr>
              <td colspan="10" class="text-center">
                <div class="empty-info">暂无信息</div>
              </td>
            </tr>
            </tbody>
            <tbody>
            <tr v-for="row in dataRows">
              <td>
                {{row.clientId}}
              </td>
              <td>
                {{row.clientSecret}}
              </td>
              <td>
                {{row.pushUrl}}
              </td>
              <td>
                {{row.remark}}
              </td>
              <td>
                <a href="#" @click.stop.prevent="edit(row)">
                  <i class="el-icon-t-edit"></i>设置
                </a>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <page-right :show="showRight" @right-close="resetRightBox">
      <edit-form :formItem="currentItem"
                 @close="showRight=false"
                 @change="itemChange"></edit-form>
    </page-right>
  </div>

</template>
<script>
  import {http, APIRule} from '@/resources';
  import editForm from './form/form.vue';
  export default {
    components: {
      editForm
    },
    data: function () {
      return {
        currentId: '',
        showRight: false,
        showTypeSearch: false,
        dataRows: [],
        showTypeList: [],
        typeTxt: '',
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 20,
          totalPage: 1
        },
        currentItem: {},
        loadingAccountList: false
      };
    },
    computed: {
      bodyHeight: function () {
        let height = parseInt(this.$store.state.bodyHeight, 10);
        height = (height + 40) + 'px';
        return height;
      }
    },
    mounted() {
      this.getOrgPage(1);
    },
    watch: {
      'typeTxt': function () {
        this.dataRows = [];
        this.currentItem = {};
        this.getOrgPage(1);
      },
    },
    methods: {
      scrollLoadingData(event) {
        this.$scrollLoadingData(event);
      },
      resetRightBox: function () {
        this.showRight = false;
      },
      searchType: function () {
        this.showTypeSearch = !this.showTypeSearch;
      },
      getOrgPage: function (pageNo, isContinue = false) {
        // 根据参数，获取单位信息
        this.pager.currentPage = pageNo;
        let param = Object.assign({}, {
          pageNo: pageNo,
          pageSize: this.pager.pageSize,
          keyWord: this.typeTxt
        });
        if (param.type === 1) {
          param.type = '';
        }
        this.loadingData = true;
        this.$http.get('/orgs/dhs', {params: param}).then(res => {
          if (param.keyWord !== this.typeTxt) return;
          this.$store.commit('initBottomLoading', false);
          if (isContinue) {
            this.showTypeList = this.showTypeList.concat(res.data.list);
          } else {
            this.showTypeList = res.data.list;
            this.currentItem = Object.assign({id: ''}, this.showTypeList[0]);
            if (res.data.list.length !== 0) {
              this.showItem(res.data.list[0])
            }
          }
          this.pager.totalPage = res.data.totalPage;
        });
      },
      getOrgMore: function () {
        this.getOrgPage(this.pager.currentPage + 1, true);
      },
      getRuleList(tree, list) {
        tree.forEach(i => {
          if(i.childMenus) {
            this.getRuleList(i.childMenus, list);
            return;
          }
          list.push(i);
        })
      },
      getApiAccountList: function () {
        let param = Object.assign({}, {
          domainObjectId: 'api-system'
        });
        this.loadingAccountList = true;
        APIRule.query(this.currentItem.id, param).then(res => {
          let list = [];
          this.getRuleList(res.data, list);
          this.dataRows = list;
          this.loadingAccountList = false;
        }).catch((e) => {
          this.loadingAccountList = false;
        });
      },
      showItem(item) {
        this.currentItem = item;
        this.getApiAccountList();
      },
      edit(item) {
        this.currentItem = item;
        this.showRight = true;
      },
      itemChange: function () {
        this.getApiAccountList();
        this.resetRightBox();
      }
    }
  };
</script>
