<template>
  <div id="app">
    <div class="mater-upload-container">
      <Simple
        ref="upload"
        :headers="headers"
        :before-upload="beforeUpload"
        :accept="accepts"
        :upload-arguments="uploadArgumentsObj"
        :limit="limit"
        :on-exceed="fileLimitFn"
        :base-url="baseUrl"
        :chunk-size="chunkSize"
        v-on:getStatus="getStatus"
        @success="success"
      >
        <div slot="tip" class="upload-tip">
          <i class="el-icon-info" style="margin-right: 5px"></i> 只能上傳：{{
            acceptDesc[uploadType]
          }}； 限制大小：{{ sizelimit}}
        </div>
      </Simple>
    </div>
  </div>
</template>
<script>
import Simple from "@/components/Simple";
import { MessageBox, Message } from "element-ui";
import { isDisabled } from "videojs-contrib-hls/es5/playlist";
import { GetCodeList } from "@/api/code";
export default {
  //name: "MaterUpload",
  components: { Simple },
  props: {
    type: "",
    fileType: 0,
    videoId: 0,
    videoSpaceId: 0,
  },
  data: () => ({
    maxSize: 0,
    sizelimit:"",
    accepts: "image/png",
    acceptsObj: {
      video: [
       /*  "video/3gpp",
        "video/3gpp2",
        "video/ogg",
        "video/quicktime",
        "video/mpeg",
         "video/webm",
        "video/avi",
        "video/mkv",
        "video/x-matroska",
        "video/x-msvideo",
        "audio/ogg",
        */
        "video/mp4",
      ],
      image: [
        "image/png",
        "image/gif",
        "image/jpeg",
        "image/jpg",
        "image/bmp",
        ".",
      ],
      audio: ["audio/mp3", "audio/mpeg"],
      ppt: [
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        ".ppt",
        ".pptx",
      ],
      excel: [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ],
    },
    acceptDesc: {
     // video: "3gp,3g2,avi,mp4,mov,mpeg,ogv,webm,mkv",
      video: "mp4",
      image: "png,gif,jpeg,jpg,bmp",
      audio: "mp3",
      ppt: "ppt",
      excel: "xls,xlsx",
    },
    limit: 1,
    chunkSize: 10 * 1024 * 1024,
    share: 1, // 是否共享 0私有  1共享
  }),
  computed: {
    headers() {
      return {
        Authorization: "token",
      };
    },
    baseUrl() {
      return "http://localhost:9529/mock-api/";
    },
    uploadType() {
      return this.type;
    },
    uploadArgumentsObj() {
      return {
        type: this.type,
        fileType: this.fileType,
        videoId: this.videoId,
        videoSpaceId: this.videoSpaceId,
        share: this.share,
      };
    },
  },

  created() {
    if (this.uploadType) {
      this.accepts = this.acceptsObj[this.uploadType].join(",");
    } else {
      this.$message("存在類型不正確的文件");
    }
    this.getMaxSize();
  },
  methods: {
    sizeLimit(sizeByte) {
      var size = Math.round(sizeByte / 1024 / 1024);
      var limit = "";
      if (size > 1024) {
        var size = Math.round(size / 1024);
        limit = `${size}GB`;
      } else limit = `${size}MB`;
      return limit;
    },
    getStatus: function (childValue) {
      this.$emit("changeStatus", childValue);
    },
    async getMaxSize() {
      const res = await GetCodeList({ code: "uploadsize" });
      if (res.data) {
        var find;
        if (this.uploadType == "image")
          find = res.data.find((o) => o.value == "IMAGE");
        if (this.uploadType == "video")
          find = res.data.find((o) => o.value == "VIDEO");
        if (find) this.maxSize = find.name;
        this.sizelimit = this.sizeLimit(this.maxSize);
      }
    },
    beforeUpload(file) {
      var filetype = file.type;
      if (file.name.endsWith(".mkv")) filetype = "video/mkv";
      //console.log("beforeAvatarUpload -> file", file);
      if (this.acceptsObj[this.uploadType].indexOf(filetype) === -1) {
        /*
        this.$notify({
          message: "只能上傳" + this.acceptDesc[this.uploadType],
          type: "error",
          offset: 50,
        });
        */
        Message({
          message: "只能上傳" + this.acceptDesc[this.uploadType],
          type: "error",
          duration: 5 * 1000,
        });
        return false;
      }
      if (!file.size) {
        Message({
          message: "不能上傳大小为0的檔案",
          type: "error",
          duration: 5 * 1000,
        });
        /*
        setTimeout(() => {
          this.$notify({
            message: "不能上傳大小为0的檔案",
            type: "warning",
            offset: 50,
          });
        }, 500);
        */
        return false;
      }
      var fileType = this.uploadType == "image" ? "圖檔" : "影片";
      var limit;
      if (file.size > this.maxSize) {
        limit = this.sizeLimit(this.maxSize);
        Message({
          message: `上傳${fileType}檔案不可超過的${limit}`,
          type: "error",
          duration: 5 * 1000,
        });
        /*
        setTimeout(() => {
          this.$notify({
            message: `上傳檔案不可超過的${limit}`,
            type: "warning",
            offset: 50,
          });
        }, 500);
        */
        return false;
      }
      return this.propertyRestrictions(file);
    },
    // 文件个数限制
    fileLimitFn(files) {
      this.$message.warning(`最多支持選擇${this.limit}個文件`);
    },
    // 清空文件，暂未使用
    clearFiles() {
      this.$refs.upload.clearFiles();
    },
    success() {
      this.$emit("childByValue", true);
    },
    // beforeUpload()
    // {
    //   //this.$emit("changeStatus", false);
    // },
    // 属性限制
    async propertyRestrictions(file) {
      return new Promise(async (resolve, reject) => {
        if (this.uploadType === "image") {
          const isVerifyResolution = await this.verifyResolution(file);
          // console.log(
          //   "propertyRestrictions -> isVerifyResolution",
          //   isVerifyResolution
          // );
          if (!isVerifyResolution) {
            this.$message(this.$t("messageTips.notAbove4k"));
            reject();
          }
        }
        resolve(true);
      });
    },
    // 圖片大小檢查
    verifyResolution(file, maxWidth = 3840, maxHeight = 2160) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
          if (reader.readyState === 2) {
            const img = new Image();
            img.src = reader.result;
            img.onload = function () {
              const width = this.width;
              const height = this.height;
              const bool = width > maxWidth || height > maxHeight;
              if (bool) {
                resolve(false);
              }
              resolve(true);
            };
          }
        };
      });
    },
  },
};
</script>

