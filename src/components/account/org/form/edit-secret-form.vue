<style lang="scss" scoped="">
  .el-form .el-select {
    display: block;
  }
</style>
<template>
  <div>
    <h2 class="clearfix">编辑appSecret</h2>
    <el-form ref="accountform" :model="form" label-width="100px" :rules="rules"
             @submit.prevent="onSubmit('accountform')" onsubmit="return false">
      <el-form-item label="appSecret" prop="clientSecret">
        <oms-input placeholder="请输入appSecret" v-model="form.clientSecret"></oms-input>
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
    name: 'editForm',
    props: {
      formItem: {
        type: Object,
        default: {},
        required: true
      },
      actionType: {
        type: Boolean,
        required: true
      }
    },
    mounted() {
    },
    data: function () {
      return {
        form: {
          clientSecret: ''
        },
        rules: {
          clientSecret: [
            {required: true, message: '请输入appSecret', trigger: 'blur'}
          ]
        },
        roleSelect: [],
        doing: false,
        apiAccountList: []
      };
    },
    watch: {
      actionType: function (val) {
        if (!val) return;
        this.form = Object.assign({}, this.formItem);
        // this.$refs['accountform'].resetFields();
      }
    },
    methods: {
      onSubmit: function (formName) {
        this.$refs[formName].validate((valid) => {
          if (!valid || this.doing) {
            return false;
          }
          this.doing = true;
          http.put('/oauth-client-details/' + this.form.clientId + '/secret', this.form).then(() => {
            this.$notify.success({
              duration: 2000,
              name: '成功',
              message: '编辑appSecret成功'
            });
            this.doing = false;
            this.$emit('change', this.form);
            this.$emit('close');
          }).catch(error => {
            this.$notify.error({
              duration: 2000,
              message: error.response.data && error.response.data.msg || '编辑appSecret失败'
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
