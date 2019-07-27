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
            API账户管理
          </h2>
          <div class="search-left-box" v-show="showTypeSearch">
            <oms-input v-model="typeTxt" placeholder="请输入关键字搜索" :showFocus="showTypeSearch"></oms-input>
          </div>
          <div v-if="showTypeList.length===0" class="empty-info">
            暂无信息
          </div>
          <div v-else>
            <ul class="show-list">
              <li v-for="item in showTypeList" class="list-item" @click="showType(item)"
                  :class="{'active':item.id==currentItem.id}">
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
      <div class="d-table-right">
        <div class="d-table-col-wrap">
          <perm label="api-manufacture-oauth-client-details-add">
                <span class="pull-right" style="margin-top: 8px" @click.stop.prevent="addApiAccount">
                      <a href="#" class="btn-circle btn-opera" @click.prevent="">
                        <i class="el-icon-t-plus"></i>
                      </a>
                     新增API账号
                </span>
          </perm>
          <h2 class="org-name-h2" v-show="currentItem.manufacturerCode">系统代码:{{currentItem.manufacturerCode}}</h2>
          <table class="table table-hover table-remark" v-loading="loadingAccountList">
            <thead>
            <tr>
              <th width="17%">appKey</th>
              <th width="17%">appSecret</th>
              <th width="15%">角色</th>
              <th width="15%">推送地址</th>
              <th width="15">备注</th>
              <th width="21%">操作</th>
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
                {{ row.roleList | formatRole }}
              </td>
              <td>
                {{row.pushUrl}}
              </td>
              <td>
                {{row.remark}}
              </td>
              <td>
                <perm label="api-manufacture-oauth-client-details-reset">
                  <a href="#" @click.stop.prevent="resetAPIAccountItem(row)">
                    <i class="el-icon-t-reset"></i> 重置
                  </a>
                </perm>
                <perm label="api-manufacture-oauth-client-details-remark">
                  <a href="#" @click.stop.prevent="addRemark(row)">
                    <i class="el-icon-t-plus"></i> 新增备注
                  </a>
                </perm>
                <div>
                  <perm label="api-bind-org-user-role">
                    <a href="#" @click.stop.prevent="add(row)">
                      <i class="el-icon-t-edit"></i> 授权角色
                    </a>
                  </perm>
                  <perm label="api-manufacture-oauth-client-details-url">
                    <a href="#" @click.stop.prevent="configUrl(row)">
                      <i class="el-icon-t-edit"></i> 推送地址
                    </a>
                  </perm>
                </div>
                <div>
                  <perm label="api-manufacture-oauth-client-details-secret">
                    <a href="#" @click.stop.prevent="editSecret(row)">
                      <i class="el-icon-t-edit"></i>编辑appSecret
                    </a>
                  </perm>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <page-right :show="showRight" @right-close="resetRightBox">
      <edit-form :formItem="form" :title="formTitle" :action="action" :actionType="showRight" :orgId="currentId"
                 @close="showRight=false"
                 @change="itemChange"></edit-form>
    </page-right>
    <page-right :show="showRemarkRight" @right-close="resetRightBox">
      <remark-form :formItem="remarkform" :actionType="showRemarkRight" @close="showRemarkRight=false"
                   @change="itemChange"></remark-form>
    </page-right>
    <page-right :show="showConfigUrlRight" @right-close="resetRightBox">
      <add-config-url :formItem="urlForm" :actionType="showConfigUrlRight" @close="showConfigUrlRight=false"
                      @change="itemChange"></add-config-url>
    </page-right>
    <page-right :show="showEditSecretRight" @right-close="resetRightBox">
      <edit-secret-form :formItem="secretForm" :actionType="showEditSecretRight" @close="showEditSecretRight=false"
                        @change="itemChange"></edit-secret-form>
    </page-right>
  </div>

</template>
<script>
  import {http, OauthClient} from '../../../resources';
  import editForm from './form/form.vue';
  import remarkForm from './form/remark-form';
  import AddConfigUrl from './form/add-url-form';
  import EditSecretForm from './form/edit-secret-form';

  export default {
    components: {
      editForm, remarkForm, AddConfigUrl, EditSecretForm
    },
    data: function () {
      return {
        currentId: '',
        showRight: false,
        showTypeSearch: false,
        showRemarkRight: false,
        showConfigUrlRight: false,
        showEditSecretRight: false,
        showSearch: false,
        dataRows: [],
        showTypeList: [],
        typeTxt: '',
        keyTxt: '',
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
        orgName: '', // 单位名称
        currentItem: {}, //  左边列表点击时，添加样式class
        isInit: true,
        orgNo: '',
        roleList: [],
        remarkform: {},
        urlForm: {},
        secretForm: {},
        loadingAccountList: false
      };
    },
    computed: {
      bodyHeight: function () {
        let height = parseInt(this.$store.state.bodyHeight, 10);
        height = (height - 20) + 'px';
        return height;
      }
    },
    filters: {
      formatRole: function (list) {
        return list.map(m => m.title).join('，');
      }
    },
    mounted() {
      this.getOrgPage(1);
    },
    watch: {
      'typeTxt': function () {
        this.dataRows = [];
        this.roleList = [];
        this.currentItem = {};
        this.getOrgPage(1);
      },
      'currentItem.id': function (val) {
        if (val) {
          this.getApiAccountList();
        }
      }
    },
    methods: {
      addRemark: function (item) {
        this.remarkform = Object.assign({}, item);
        this.showRemarkRight = true;
      },
      configUrl(item) {
        this.urlForm = Object.assign({}, item);
        this.showConfigUrlRight = true;
      },
      editSecret(item) {
        this.secretForm = Object.assign({}, item);
        this.showEditSecretRight = true;
      },
      addApiAccount: function () {
        this.$confirm('是否要添加API账户', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.doing = true;
          http.post('/oauth-client-details', {orgId: this.currentItem.id}).then(() => {
            this.$notify.success({
              duration: 2000,
              name: '成功',
              message: '添加API账户成功'
            });
            this.getApiAccountList();
            this.doing = false;
          }).catch(error => {
            this.$notify.error({
              duration: 2000,
              message: error.response.data && error.response.data.msg || '添加API账户失败'
            });
            this.doing = false;
          });
        }).catch(error => {
        });
      },
      resetAPIAccountItem: function (item) {// 重置单个api账户
        this.$confirm('是否要重置API账户', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          http.put('/oauth-client-details/' + item.clientId + '/reset').then(() => {
            this.$notify.success({
              duration: 2000,
              name: '成功',
              message: '重置API账户成功'
            });
            this.getApiAccountList();
          }).catch(error => {
            this.$notify.error({
              duration: 2000,
              message: error.response.data && error.response.data.msg || '重置API账户失败'
            });
            this.doing = false;
          });
        });
      },
      scrollLoadingData(event) {
        this.$scrollLoadingData(event);
      },
      resetRightBox: function () {
        this.showRight = false;
        this.showRemarkRight = false;
        this.showConfigUrlRight = false;
        this.showEditSecretRight = false;
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
              this.showType(this.currentItem);
              this.getApiAccountList();
            }
          }
          this.pager.totalPage = res.data.totalPage;
        });
      },
      getOrgMore: function () {
        this.getOrgPage(this.pager.currentPage + 1, true);
      },
      getApiAccountList: function () {
        let param = Object.assign({}, {
          domainObjectId: 'api-system'
        });
        this.loadingAccountList = true;
        OauthClient.getOneOauthClient(this.currentItem.id, param).then(res => {
          this.dataRows = res.data;
          this.loadingAccountList = false;
        }).catch(() => {
          this.loadingAccountList = false;
        });
      },
      add: function (item) {
        this.action = 'add';
        this.formTitle = 'APP账号 ' + item.clientId + '的角色授权';
        let roleIdList = [];
        item.roleList.forEach(val => {
          roleIdList.push(val.roleId);
        });
        this.form = {
          roleIdList: roleIdList
        };
        this.currentId = item.clientId;
        this.showRight = true;
      },
      showType: function (item) {
        this.orgName = item.name;
        this.currentItem = item;
      },
      itemChange: function () {
        this.getApiAccountList();
        this.showRight = false;
        this.showRemarkRight = false;
      }
    }
  };
</script>
