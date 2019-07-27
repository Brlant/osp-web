<style lang="scss" scoped="">
  .el-form .el-select {
    display: block;
  }
</style>
<template>
  <div>
    <h2 class="clearfix">新增备注信息</h2>
    <el-form ref="accountform" :model="form" label-width="100px" :rules="rules"
             @submit.prevent="onSubmit('accountform')" onsubmit="return false">
      <el-form-item label="备注">
        <oms-input type="textarea" :autosize="{ minRows: 5, maxRows: 5}" placeholder="请输入备注"
                   v-model="form.remark"></oms-input>
      </el-form-item>
      <el-form-item label-width="100px">
        <el-button type="primary" @click="onSubmit('accountform')" native-type="submit" :disabled="doing">保存</el-button>
        <el-button @click="doClose">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {http} from '../../../../resources';

  export default {
    name: 'remarkForm',
    props: {
      formItem: {
        type: Object,
        default: {},
        required: true
      }
    },
    mounted() {
    },
    data: function () {
      return {
        form: {},
        rules: {},
        roleSelect: [],
        doing: false,
        apiAccountList: []
      };
    },
    watch: {
      formItem: function (val) {
        this.form = Object.assign({}, val);
      },
      showRight: function (val) {
        if (!val) {
          this.$refs['accountform'].resetFields();
        }
      }
    },
    methods: {
      onSubmit: function (formName) {
        this.$refs[formName].validate((valid) => {
          if (!valid || this.doing) {
            return false;
          }
          this.doing = true;
          http.put('/oauth-client-details/' + this.form.clientId + '/remark', this.form).then(() => {
            this.$notify.success({
              duration: 2000,
              name: '成功',
              message: '新增备注成功'
            });
            this.doing = false;
            this.$emit('change', this.form);
            this.$emit('close');
          }).catch(error => {
            this.$notify.error({
              duration: 2000,
              message: error.response.data && error.response.data.msg || '新增备注失败'
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
