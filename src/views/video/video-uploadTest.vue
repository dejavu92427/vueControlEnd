<template>
  <div id="app">
    <div class="mater-upload-container">
      <file-upload :type="type" :fileType="fileType" :videoId="videoId" :videoSpaceId="videoSpaceId"></file-upload>
    </div>
  </div>
</template>
<script>
import fileUpload from "./components/fileUpload";

export default {
  components: { fileUpload },
  data() {
    return {
      type: "video",
      fileType: 1, //1:2:3 影片，封面，浮水印
      videoId: 0,
      videoSpaceId: 0,
    };
  },

  created() {
    this.type = "video"; //image,video
    this.videoId = 10; //浮水印時給0
    this.videoSpaceId = 1;
    this.fileType = 1;
  },
  methods: {},
};
</script>
<style scoped lang="scss">
.mater-upload-container {
  >>> .simple-upload-container {
    border: none;
    max-height: 500px;
  }
}
</style>
