<template>
  <div>
    <upload-list :list-type="type" :files=uploadingFiles v-if="!showFileList"
                 style="padding-bottom:10px;" @remove="cancelUpload"></upload-list>
    <oms-el-upload
      class="upload-demo"
      ref="upload"
      name="file"
      :action="uploadUrl"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :file-list="fileLists"
      :on-change="changeFile"
      :on-success="success"
      :on-error="error"
      :before-upload="beforeAvatarUpload"
      :list-type="type"
      :show-file-list="showFileList"
      :multiple="multiple"
      :on-progress="showProgress"
      :data="uploadData"
      :formData="formData">
      <el-button slot="trigger" size="small" type="primary">{{ uploadName }}</el-button>
    </oms-el-upload>
  </div>
</template>

<script>
  import {OmsAttachment, http} from '../../../resources';
  import UploadList from './upload.file.list.vue';
  import OmsElUpload from './upload/src/index.vue';

  export default {
    name: 'omsUploadRelation',
    components: {UploadList, OmsElUpload},
    props: {
      fileList: {
        type: Array,
        default: function () {
          return [];
        }
      },
      objectId: {
        type: String
      },
      objectType: {
        type: String
      },
      type: {
        type: String,
        default: 'text'
      },
      showFileList: {
        type: Boolean,
        default: true
      },
      multiple: {
        type: Boolean,
        default: true
      },
      uploadName: {
        type: String,
        default: '选取文件'
      },
      formData: {
        type: Object
      }
    },

    data() {
      return {
        fileLists: this.fileList,
        object: {
          objectId: this.objectId,
          objectType: this.objectType
        },
        dialogImageUrl: '',
        dialogVisible: false,
        uploadData: {},
        uploadUrl: '/omsAttachment',
        uploadingFiles: []
      };
    },
    watch: {
      fileList: function (val) {
        val.forEach(file => {
          file.url = file.attachmentStoragePath;
          file.name = file.attachmentFileName;
        });
        this.fileLists = val;
      },
      objectId: function (val) {
        this.object.objectId = val;
      },
      objectType: function (val) {
        this.object.objectType = val;
      },
      showFileList (val) {
        if (!val) {
          this.$refs['upload'].clearFiles();
        }
      }
    },

    methods: {
      changeFile: function (file, fileList) {
        if (file.response) {
          file.attachmentId = file.response.attachmentId;
          file.name = file.attachmentFileName = file.response.original;
          file.url = file.attachmentStoragePath = file.response.url;
        }
        this.$emit('change', fileList);
        this.fileLists = fileList;
      },
      submitUpload() {
        this.$refs.upload.submit();
      },
      handleRemove(file) {
        OmsAttachment.delete(file.attachmentId).then(() => {
          this.$notify.success({
            duration: 2000,
            title: '成功',
            message: '已成功删除附件' + file.attachmentFileName + '"'
          });
        }).catch(() => {
          this.$notify.error({
            duration: 2000,
            message: '删除失败'
          });
        });
      },
      handlePreview(file) {
        this.$store.commit('changeAttachment', {currentId: file.attachmentId, attachmentList: this.fileLists});
      },
      beforeAvatarUpload(file) {
        this.uploadingFiles.push(file);
      },
      success(response, file, fileList) {
        this.uploadingFiles = this.uploadingFiles.filter(item => item.uid !== file.uid);
        if (response) {
          this.$notify.success({
            duration: 2000,
            message: '上传附件成功'
          });
          this.$emit('refreshCodes');
        } else {
          this.$notify.error({
            duration: 2000,
            message: '上传附件失败'
          });
        }
      },
      error(err) {
        this.$notify.error({
          duration: 2000,
          message: '上传附件失败' + err
        });
      },
      showProgress(event, file, fileList) {
        let index = -1;
        for (let i = 0, len = this.uploadingFiles.length; i < len; i++) {
          if (file.uid === this.uploadingFiles[i].uid) {
            index = i;
          }
        }
        if (index !== -1) {
          this.uploadingFiles.splice(index, 1, file);
        }
      },
      cancelUpload: function (file) {
        this.$refs['upload'].abort(file);
        this.uploadingFiles = this.uploadingFiles.filter(item => item.uid !== file.uid);
      }
    }

  };
</script>
