<template>
  <div class="opera-btn-group" :class="{up: showSearch}">
    <div class="opera-icon">
      <el-col :span="4">
        <h2 class="header f-dib">
          <slot name="title"></slot>
        </h2>
      </el-col>
      <el-col :span="4">
          <slot name="mid"></slot>
      </el-col>
      <el-col :span="16" class="text-right">
        <el-button-group >
          <perm label="show">
            <el-button  plain size="small" @click="search">
              <f-a class="icon-small" name="search"></f-a>查询
            </el-button>
          </perm>
          <perm label="show">
            <el-button plain size="small" @click="reset">
              <f-a class="icon-small" name="reset"></f-a>重置
            </el-button>
          </perm>
          <perm label="show" v-if="isShowAdvance">
            <el-button type="primary"  plain size="small"  @click="showSearch = !showSearch">高级检索</el-button>
          </perm>
          <slot name="btn"></slot>
        </el-button-group>
      </el-col>
    </div>
    <slot name="content"></slot>
  </div>
</template>
<script>
  export default {
    name: 'searchTemplate',
    props: {
      isShow: Boolean,
      isShowAdvance: {
        type: Boolean,
        default: true
      }
    },
    data: function () {
      return {
        showSearch: false
      };
    },
    watch: {
      showSearch (val) {
        this.$emit('isShow', val);
      },
      isShow (val) {
        this.showSearch = val;
      }
    },
    methods: {
      search () {
        this.$emit('search');
      },
      reset () {
        this.$emit('reset');
      }
    }
  };
</script>
