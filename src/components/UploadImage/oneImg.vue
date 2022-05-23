<template>
  <div>
    <el-upload
      action="#"
      ref="upload"
      :file-list="fileList"
      accept=".jpg, .jpeg, .png"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      :before-upload="beforeAvatarUpload"
      :on-preview="handlePictureCardPreview"
    >
      <el-button slot="trigger" size="small" type="primary">{{
        this.fileList.length > 0 ? "替換圖片" : "選取圖片"
      }}</el-button>
    </el-upload>
    <div v-if="imageVisible">
      <div class="images" v-viewer>
        <img
          ref="uploadImg"
          :src="imgInfo.base64"
          alt=""
          style="max-hight: 300px; max-width: 300px"
        />{{ imgInfo.size }}
      </div>
    </div>
  </div>
</template>

<script>
import "viewerjs/dist/viewer.css";
import Viewer from "v-viewer";
import Vue from "vue";
Vue.use(Viewer, {
  defaultOptions: {
    title: [
      1,
      (image, imageData) =>
        ` size = (${imageData.naturalWidth} × ${imageData.naturalHeight})`,
    ],
    toolbar: {
      zoomIn: 1,
      zoomOut: 1,
      oneToOne: 1,
      reset: 1,
      prev: 0,
      play: {
        show: 0,
        size: "large",
      },
      next: 0,
      rotateLeft: 0,
      rotateRight: 0,
      flipHorizontal: 0,
      flipVertical: 0,
    },
  },
});
export default {
  props: {
    canDelete: false,
    imageUrl: String,
  },
  data() {
    return {
      imgInfo: {},
      imageVisible: false,
      fileList: [],
    };
  },
  created() {
    this.setOldImg(this.imageUrl);
  },
  methods: {
    setOldImg(img) {
      this.imageVisible = false;
      if (img.length > 0) {
        let image = new Image();
        image.src = img;
        image.onload = () => {
          this.imgInfo.size = ` (size = ${image.width}x${image.height})`;
          this.imgInfo.base64 = img;
          this.fileList.push({ name: img, url: "" });
          this.imageVisible = true;
        };
      }
    },
    handlePictureCardPreview(file) {
      if (this.fileList.length > 0) {
        this.imageVisible = !this.imageVisible;
      }
    },
    handleRemove(file) {
      this.fileList = [];
      this.imgInfo = {};
      this.imageVisible = false;
      this.$emit("getImageInfo", "");
    },
    beforeRemove(file) {
      if (!this.canDelete) return false;
    },
    beforeAvatarUpload(file) {
      const isImg =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/jpg";
      //const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isImg) {
        this.$message.error("圖片只能是 JPEG/JPG/PNG 格式!");
        return false;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imgInfo.base64 = reader.result;
        this.imgInfo.size = "";
        this.fileList = [];
        this.fileList.push({ name: file.name, url: "" });
        this.$emit("getImageInfo", this.imgInfo.base64);
        this.imageVisible = true;
      };

      return false; //手動上傳
    },
  },
};
</script>
<style scoped>
.el-list-leave .el-list-leave-active {
  display: none;
}
</style>
