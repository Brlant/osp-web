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

  .minor-part {
    color: #999;
    font-size: 0.5em;
  }
</style>
<template>
  <div>
    <div class="container d-table">
      <div class="d-table-left">
        <h2 class="header" style="overflow: hidden">
          <span class="pull-right">
            <perm label="mdm-access-platfrom-role-export">
            <a href="#" class="btn-circle" @click.prevent="exportFile"
               style="margin-right: 5px"><i
              class="el-icon-t-print"></i> </a>
              </perm>
              <a href="#" class="btn-circle" @click.prevent="searchType"><i
                class="el-icon-t-search"></i> </a>
          </span>
          {{ type === 1 ? '系统账号管理' : '账号分配' }}
        </h2>
        <div class="d-table-col-wrap" :style="'height:'+ (bodyHeight - 60) + 'px'" @scroll="scrollLoadingData">
          <div class="search-left-box" v-show="showTypeSearch">
            <oms-input v-model="typeTxt" placeholder="请输入名称搜索" :showFocus="showTypeSearch"></oms-input>
          </div>
          <div v-if="!currentItem.id" class="empty-info">
            暂无信息
          </div>
          <div v-else>
            <ul class="show-list">
              <li v-for="item in showTypeList" class="list-item" @click="showType(item)" :key="item.id"
                  :class="{'active':item.id==currentItem.id}">
                <div class="minor-part" v-show="item.manufacturerCode">
                  系统代码{{item.manufacturerCode }}
                </div>
                <div>
                  {{item.name }}
                </div>
              </li>
            </ul>
            <div class="btn-left-list-more">
              <bottom-loading></bottom-loading>
              <div @click.stop="getOrgMore" v-show="!$store.state.bottomLoading">
                <el-button v-show="typePager.currentPage<typePager.totalPage">加载更多</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="d-table-right">
        <div class="d-table-col-wrap" :style="'height:'+bodyHeight  + 'px'">
          <span class="f-12">用户状态:</span>
          <el-radio-group v-model="filters.status" size="small">
            <el-radio-button label="1">正常</el-radio-button>
            <el-radio-button label="2">停用</el-radio-button>
            <el-radio-button label="0">未激活</el-radio-button>
          </el-radio-group>
          <span class="pull-right" style="margin-top: 8px">
           <span class="btn-search-toggle open" v-show="showSearch">
              <single-input v-model="keyTxt" placeholder="请输入名称搜索" :showFocus="showSearch"></single-input>
              <i class="el-icon-t-search" @click.stop="showSearch=(!showSearch)"></i>
           </span>
           <a href="#" class="btn-circle" @click.stop.prevent="showSearch=(!showSearch)" v-show="!showSearch">
              <i class="el-icon-t-search"></i>
           </a>
           <perm :label="type === 1 ? 'mdm-manufacture-oms-org-user-add' : 'mdm-manufacture-oms-org-user-add' ">
                <a href="#" class="btn-circle" @click.stop.prevent="add">
                <i class="el-icon-t-plus"></i>
                </a>
           </perm>
         </span>
          <div v-loading="loading1">
            <table class="table " :class="{'table-hover':dataRows.length !== 0}">
              <thead>
              <tr>
                <th>姓名</th>
                <th>角色</th>
                <th>手机号码</th>
                <th>邮箱</th>
                <th>状态</th>
                <th>操作</th>
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
              <tr v-for="row in dataRows" :key="row.id">
                <td>
                  {{row.name}}
                  <el-tag type="success" v-show="row.adminFlag">主账号</el-tag>
                </td>
                <td>
                  {{ row.list | formatRole }}
                </td>
                <td>
                  {{row.phone}}
                </td>
                <td>
                  {{row.email}}
                </td>
                <td style="width: 50px">
                  <dict :dict-group="'orgUserStatus'" :dict-key="formatStatus(row.status)"></dict>
                </td>
                <td class="list-op" style="width: 120px">
                  <perm :label="'mdm-manufacture-oms-org-user-edit' ">
                    <a href="#" @click.stop.prevent="edit(row)"><i class="el-icon-t-edit"></i>编辑</a>
                  </perm>
                  <perm :label="'mdm-manufacture-oms-org-user-edit' ">
                    <oms-forbid :item="row" @forbided="useNormal" :tips='"确认启用货主用户 \""+row.name+"\" ?"'
                                v-show="row.status === '2'"><i
                      class="el-icon-t-start"></i>启用
                    </oms-forbid>
                  </perm>
                  <perm :label="'mdm-manufacture-oms-org-user-edit' ">
                    <oms-forbid :item="row" @forbided="forbid" :tips='"确认停用货主用户\""+row.name+"\"？"'
                                v-show="row.status !== '2'">
                      <i class="el-icon-t-forbidden"></i>停用
                    </oms-forbid>
                  </perm>
                </td>
              </tr>
              </tbody>
            </table>
            <div class="text-center" v-show="pager.count>pager.pageSize">
              <el-pagination layout="prev, pager, next"
                             :total="pager.count"
                             :pageSize="pager.pageSize"
                             @current-change="getPageList"
                             :current-page="pager.currentPage">
              </el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
    <page-right :show="showRight" @right-close="resetRightBox">
      <edit-form :formItem="form" :title="formTitle" :action="action" :actionType="showRight" :orgId="filters.orgId"
                 @close="showRight=false"
                 @change="itemChange"></edit-form>
    </page-right>
  </div>

</template>
<script>
  import {BaseInfo, OrgUser, User} from '../../../resources';
  import editForm from './form/form.vue';
  import utils from '@/tools/utils';
  import Perm from '../../common/perm';

  export default {
    components: {
      Perm,
      editForm
    },
    data: function () {
      return {
        showRight: false,
        showTypeSearch: false,
        showSearch: false,
        dataRows: [],
        showTypeList: [],
        typeTxt: '',
        keyTxt: '',
        filters: {
          orgId: '',
          status: '1'
        },
        form: {list: [{roleId: ''}]},
        formTitle: '新增',
        oldItem: {},
        action: 'add',
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 20,
          totalPage: 1
        },
        typePager: {
          currentPage: 1,
          count: 0,
          pageSize: 20,
          totalPage: 1
        },
        requestTime: 0,
        loading1: false,
        orgName: '', // 货主名称
        currentItem: {} //  左边列表点击时，添加样式class
      };
    },
    filters: {
      formatRole: function (list) {
        if (list) {
          return list.map(m => m.title).join('，');
        }
        return '';
      }
    },
    computed: {
      bodyHeight: function () {
        let height = parseInt(this.$store.state.bodyHeight, 10);
        height = (height + 50);
        return height;
      },
      type() {
        return this.$route.meta.type;
      }
    },
    mounted() {
      this.getOrgsList(1);
    },
    watch: {
      'typeTxt': function () {
        this.dataRows = [];
        this.orgName = '';
        this.getOrgsList(1);
      },
      'keyTxt': function () {
        this.getPageList(1);
      },
      filters: {
        handler: function () {
          this.getPageList(1);
        },
        deep: true
      },
      type() {
        this.showTypeList = [];
        this.currentItem = {};
        this.dataRows = [];
        this.getOrgsList(1);
      }
    },
    methods: {
      exportFile: function () {
        let params = Object.assign({}, this.filters);
        this.$store.commit('initPrint', {
          isPrinting: true,
          moduleId: '/permission/account'
        });
        this.$http.get('/dhs-orgs/export').then(res => {
          utils.download(res.data.path, '系统用户角色表');
          this.$store.commit('initPrint', {
            isPrinting: false,
            moduleId: '/permission/account'
          });
        }).catch(error => {
          this.$store.commit('initPrint', {
            isPrinting: false,
            moduleId: '/permission/account'
          });
          this.$notify.error({
            message: error.response.data && error.response.data.msg || '导出失败'
          });
        });
      },
      scrollLoadingData(event) {
        this.$scrollLoadingData(event);
      },
      resetRightBox: function () {
        this.showRight = false;
      },
      searchType: function () {
        this.showTypeSearch = !this.showTypeSearch;
      },
      getOrgsList: function (pageNo, isContinue = false) {
        this.typePager.currentPage = pageNo;
        let params = Object.assign({}, {
          pageNo: pageNo,
          pageSize: this.pager.pageSize,
          keyWord: this.typeTxt
        });
        let url = this.type === 1 ? '/dhs-orgs' : '/dhs-orgs';
        let rTime = Date.now();
        this.requestTime = rTime;
        this.$http.get(url, {params}).then(res => {
          if (this.requestTime > rTime) {
            return;
          }
          this.$store.commit('initBottomLoading', false);
          if (isContinue) {
            this.showTypeList = this.showTypeList.concat(res.data.list);
          } else {
            this.showTypeList = res.data.list;
            if (this.showTypeList.length !== 0) {
              this.currentItem = res.data.list[0];
              this.orgName = this.showTypeList[0].name;
              this.filters.orgId = this.currentItem.id;
              this.getPageList(1);
            } else {
              this.currentItem = Object.assign({'id': ''});
              this.filters.orgId = '';
            }
          }
          this.typePager.totalPage = res.data.totalPage;
        });

      },
      getOrgMore: function () {
        this.getOrgsList(this.typePager.currentPage + 1, true);
      },
      getPageList: function (pageNo) {
        if (!this.filters.orgId) return;
        this.pager.currentPage = pageNo;
        let data = Object.assign({}, {
          pageNo: pageNo,
          pageSize: this.pager.pageSize,
          keyWord: this.keyTxt,
          status: this.filters.status
        });
        this.loading1 = true;
        let rTime = Date.now();
        this.requestUserTime = rTime;
        OrgUser.queryUsers(this.filters.orgId, data).then(res => {
          if (this.requestUserTime > rTime) return;
          this.loading1 = false;
          this.dataRows = res.data.list;
          this.pager.count = res.data.count;
        });
      },
      add: function () {
        this.action = 'add';
        this.formTitle = '新增 ' + this.orgName + ' 用户';
        this.form = {
          list: [{roleId: ''}],
          orgId: this.filters.orgId
        };
        this.showRight = true;
      },
      edit: function (item) {
        this.action = 'edit';
        this.formTitle = '编辑 ' + this.orgName + '用户';
        this.oldItem = item;
        this.form = JSON.parse(JSON.stringify(item));
        this.showRight = true;
      },
      remove: function () {

      },
      forbid: function (item) {
        let itemTemp = JSON.parse(JSON.stringify(item));
        itemTemp.status = '2';
        User.stopUser(itemTemp.id).then(() => {
          this.getPageList(1);
          this.$notify.success({
            title: '成功',
            message: '已成功停用货主用户"' + itemTemp.name + '"'
          });
        });
      },
      useNormal: function (item) {
        let itemTemp = JSON.parse(JSON.stringify(item));
        itemTemp.status = '0';
        User.enableUser(itemTemp.id).then(() => {
          this.getPageList(1);
          this.$notify.success({
            title: '成功',
            message: '已成功启用货主用户"' + item.name + '"'
          });
        });
      },
      removeType: function (item) {
        BaseInfo.delete(item.id).then(() => {
          this.getOrgsList();
          this.$notify.success({
            title: '成功',
            message: '已成功删除货主用户"' + item.name + '"'
          });
        });
      },
      showType: function (item) {
        this.filters.orgId = item.id;
        this.orgName = item.name;
        this.currentItem = item;
      },
      itemChange: function (item) {
        this.getPageList(this.pager.currentPage);
        this.showRight = false;
      },
      formatStatus: function (value) {
        if (!value) return '';
        return value.toString();
      }
    }
  };
</script>
