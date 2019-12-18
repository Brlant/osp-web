<style lang="scss" scoped="">
  .el-form .el-select {
    display: block;
  }
</style>
<template>
  <div>
    <h2 class="clearfix">设置最大访问次数</h2>
    <el-form ref="editForm" :model="form" label-width="140px" :rules="rules"
             @submit.prevent="onSubmit('editForm')" onsubmit="return false">
      <el-form-item label="最大访问次数" v-if="!form.limit">
        <el-input placeholder="请输入最大访问次数" v-model="form.maxCount"></el-input>
      </el-form-item>
      <el-form-item label="是否不限制访问次数">
        <el-switch v-model="form.limit" active-text="是" inactive-text="否" @change="limitChange"></el-switch>
      </el-form-item>
      <el-form-item label-width="100px">
        <el-button type="primary" @click="onSubmit('editForm')" native-type="submit" :disabled="doing">保存</el-button>
        <el-button @click="doClose">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {Access} from '@/resources';

  export default {
    name: 'editForm',
    props: {
      formItem: {
        type: Object,
        default: {},
        required: true
      }
    },
    mounted() {
      this.getRoleSelect();
    },
    data: function () {
      return {
        form: {
          limit: false,
          maxCount: ''
        },
        rules: {},
        doing: false,
      };
    },
    watch: {
      formItem: function (val) {
        this.form = {
          limit: false,
          maxCount: ''
        };
        this.form = Object.assign({}, val);
        this.$refs['editForm'] && this.$refs['editForm'].resetFields();
      }
    },
    methods: {
      limitChange(val) {
        this.form.maxCount = '';
      },
      onSubmit: function (formName) {
        let self = this;
        this.$refs[formName].validate((valid) => {
          if (!valid || this.doing) {
            return false;
          }
          this.doing = true;
          let formData = JSON.parse(JSON.stringify(this.form));
          formData.domainObjectId = 'api-system';
          Access.bandOrgRole(formData).then(res => {
            this.$notify.success({
              duration: 2000,
              name: '成功',
              message: '保存成功'
            });
            this.doing = false;
            self.$emit('change', res.data);
            this.$emit('close');
          }).catch(error => {
            this.$notify.error({
              duration: 2000,
              message: error.response.data && error.response.data.msg || '保存失败'
            });
            this.doing = false;
            this.$emit('close');
          });
        });
      },
      doClose: function () {
        this.$emit('close');
        this.$refs['editForm'].resetFields();
      }
    }
  };
</script>
