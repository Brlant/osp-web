<style lang="scss" scoped="">
  .el-form .el-select {
    display: block;
  }
</style>
<template>
  <div>
    <h2 class="clearfix">{{title}}</h2>
    <el-form ref="accountform" :model="form" label-width="100px" :rules="rules"
             @submit.prevent="onSubmit('accountform')" onsubmit="return false">
      <el-form-item label="用户角色">
        <el-select placeholder="请选择角色" multiple v-model="form.roleIdList">
          <el-option :label="item.title" :value="item.id" :key="item.id" v-for="item in roleSelect"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label-width="100px">
        <el-button type="primary" @click="onSubmit('accountform')" native-type="submit" :disabled="doing">保存</el-button>
        <el-button @click="doClose">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {Access} from '../../../../resources';

  export default {
    name: 'editForm',
    props: {
      formItem: {
        type: Object,
        default: {},
        required: true
      },
      title: {
        type: String,
        default: '增加'
      },
      action: {
        type: String,
        default: ''
      },
      orgId: {
        type: String,
        default: ''
      },
      actionType: {
        type: Boolean,
        default: true
      }
    },
    mounted() {
      this.getRoleSelect();
    },
    data: function () {
      return {
        form: {
          roleIdList: []
        },
        rules: {
          roleIdList: [
            {required: true, message: '请选择角色', trigger: 'change'}
          ]
        },
        roleSelect: [],
        doing: false,
        apiAccountList: []
      };
    },
    watch: {
      formItem: function (val) {
        this.form = Object.assign({}, val);
        this.form.roleIdList = val.roleIdList;
      },
      showRight: function (val) {
        if (!val) {
          this.$refs['accountform'].resetFields();
        }
      }
    },
    methods: {
      getRoleSelect: function () {
        // 查询角色列表
        let param = Object.assign({}, {
          keyword: this.typeTxt,
          deleteFlag: false,
          objectId: 'api-system'
        });
        Access.queryApiAccess(param).then(res => {
          this.roleSelect = res.data.list;
        });
      },
      onSubmit: function (formName) {
        let self = this;
        this.$refs[formName].validate((valid) => {
          if (!valid || this.doing) {
            return false;
          }
          this.doing = true;
          let formData = JSON.parse(JSON.stringify(this.form));
          formData.orgId = this.orgId;
          formData.domainObjectId = 'api-system';
          Access.bandOrgRole(formData).then(res => {
              this.$notify.success({
                duration: 2000,
                name: '成功',
                message: '新增角色成功'
              });
            this.doing = false;
            self.$emit('change', res.data);
            this.$emit('close');
          }).catch(error => {
              this.$notify.error({
                duration: 2000,
                message: error.response.data && error.response.data.msg || '新增角色失败'
              });
              this.doing = false;
              this.$emit('close');
            });
        });
      },
      doClose: function () {
        this.$emit('close');
        this.$refs['accountform'].resetFields();
      }
    }
  };
</script>
