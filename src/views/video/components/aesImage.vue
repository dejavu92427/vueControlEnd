<template>
  <img :src="image" :width="imgWidth" :height="imgHeight"  />
</template>
<script>
import CryptoJS from "crypto-js";
export default {
  props: {
    src: "",
    imageKey: "",
    imageIV: "",
    imgWidth: Number,
    imgHeight: Number,
  },
  data() {
    return {
      image: "",
    };
  },
  watch: {},
  created() {
    this.handleView();
  },
  methods: {
    async handleView() {
      var key = this.imageKey;
      var iv = this.imageIV;
      var encryptedFilename = this.src;

      var oReq = new XMLHttpRequest();
      oReq.open("GET", encryptedFilename, true);
      oReq.responseType = "arraybuffer";
      var _this = this;
      oReq.onload = function (oEvent) {
        var arrayBuffer = oReq.response;
        var base64 = _this.decrypt(arrayBuffer, key, iv);
        _this.image = `data:image/png;base64,${base64}`;
      };
      oReq.send(null);
    },
    decrypt(arrayBuffer, dbKey, dbIv) {
      const key = CryptoJS.enc.Hex.parse(dbKey);
      const iv = CryptoJS.enc.Hex.parse(dbIv);
      const wordary = CryptoJS.lib.WordArray.create(arrayBuffer);
      let dcBase64String = wordary.toString(CryptoJS.enc.Base64);
      let decrypt = CryptoJS.AES.decrypt(dcBase64String, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });
      let base64 = decrypt.toString(CryptoJS.enc.Base64);
      return base64;
    },
  },
};
</script>