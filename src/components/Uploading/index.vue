<template>
  <div>
    <el-upload
      v-loading="loading"
      :file-list="fileList"
      action="#"
      list-type="picture-card"
      :http-request="onRequest"
      :on-change="onChange"
      :on-remove="onRemove"
      :on-preview="onPreview"
      :before-upload="beforeUpload"
      style="overflow: hidden; width: 148px; height: 148px"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="previewImgvisible" width="60%">
      <img :src="imgUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
//id:AKIDsa4JJ4arukNlwsZ2HH3asvjIcy5xbz85
//key:oOkriKirkOnxsY0DBvSkogKkvrY1EDyU
import COS from 'cos-js-sdk-v5'
var cos = new COS({
  SecretId: 'AKIDsa4JJ4arukNlwsZ2HH3asvjIcy5xbz85',
  SecretKey: 'oOkriKirkOnxsY0DBvSkogKkvrY1EDyU'
})
export default {
  name: 'Uploading',
  data() {
    return {
      fileList: [],
      previewImgvisible: false,
      imgUrl: '',
      loading: false
    }
  },

  created() {},

  methods: {
    onRequest({ file }) {
      this.loading = true
      cos.putObject(
        {
          Bucket: 'hmhr-31-1313341593' /* 必须 */,
          Region: 'ap-nanjing' /* 存储桶所在地域，必须字段 */,
          Key: file.name /* 必须 */,
          StorageClass: 'STANDARD',
          Body: file, // 上传文件对象
          onProgress: function (progressData) {
            console.log(JSON.stringify(progressData))
          }
        },
        (err, data) => {
          this.loading = false
          if (err || data.statusCode != 200) {
            return this.$message.error('上传失败，请重试')
          }
          this.$emit('onSuccess', { url: 'https://' + data.Location })
        }
      )
    },
    onChange(file, fileList) {
      this.fileList = fileList
    },
    onRemove(file, fileList) {
      this.fileList = fileList
    },
    onPreview(file) {
      console.log(file)
      this.imgUrl = file.url
      this.previewImgvisible = true
    },
    beforeUpload(file) {
      const types = ['image/jpeg', 'image/gif']
      console.log(file)
      if (!types.includes(file.type)) {
        this.$message.error('请上传' + types.join('、') + '图片')
        return false
      }
      const maxSize = 230 * 1024
      if (file.size > maxSize) {
        this.$message.error('图片不能超过230kb')
        return false
      }
    }
  }
}
</script>

<style scoped></style>
