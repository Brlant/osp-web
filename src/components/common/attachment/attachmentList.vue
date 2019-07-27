<style lang="scss" scoped>
  .list-item {
    position: relative;
    line-height: 20px;
    padding-top: 3px;
    padding-bottom: 3px;
    border: 0;
    .download-link {
      display: none;
    }
    &:hover .download-link {
      display: block;
    }
  }
</style>
<template>
  <ul class="show-list">
    <li class="list-item" v-for="attachment in attachmentList" @click="handlePreview(attachment)">
      {{attachment.attachmentFileName}}
      <perm :label="perm">
        <a :href="attachment.attachmentStoragePath "
           class="download-link pull-right" :download="attachment.attachmentFileName" @click.stop="">
          <i class="el-icon-t-download"></i>
        </a>
      </perm>
    </li>
  </ul>
</template>
<script>
  import {OmsAttachment} from '../../../resources';

  export default {
    data() {
      return {
        object: {
          objectId: this.objectId,
          objectType: this.objectType
        },
        attachmentList: [],
        perm: this.permission
      };
    },
    watch: {
      objectId: function (val) {
        this.object.objectId = val;
        this.getFileList();
      },
      objectType: function (val) {
        this.object.objectType = val;
      },
      attachmentIdList: function () {
        this.getFileList();
      },
      perm: function (val) {
        this.perm = val;
      }
    },
    props: ['objectId', 'objectType', 'attachmentIdList', 'permission'],
    methods: {
      getFileList: function () {
        if (!this.object.objectId) return;
        OmsAttachment.queryOneAttachmentList(this.object.objectId, this.object.objectType).then(res => {
          this.attachmentList = res.data;
        });
      },
      handlePreview(file) {
        this.$store.commit('changeAttachment', {currentId: file.attachmentId, attachmentList: this.attachmentList});
      }
    },
    mounted() {
      this.getFileList();
    }
  };
</script>
