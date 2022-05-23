<template>
  <video-player
    ref="videoPlayer"
    class="video-player vjs-custom-skin"
    :playsinline="true"
    :options="playerOptions"
  />
</template>
<script>
export default {
  props: {
    src: "",
  },
  data() {
    return {
      videoType: "",
      playerOptions: {
        //https://docs.videojs.com/tutorial-options.html
        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: false,
        muted: false,
        loop: false,
        preload: "auto",
        language: 'zh-CN',
        aspectRatio: "16:9",
        fluid: true,
        sources: [
          {
            type: "video/mp4",
            src: "https://jsshashixian.com/28713/video/28713.cdxxx.app.m3u8",
          },
        ],
        hls: true,
        poster: "", //封面
        width: document.documentElement.clientWidth,
        notSupportedMessage: "此視頻格式無法支援播放",
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true, // 全屏按钮
        },
      },
    };
  },
  watch: {},
  created() {
    var types = [
      { ext: "3gpp", type: "video/3gpp" },
      { ext: "3gpp2", type: "video/3gpp2" },
      { ext: "ogg", type: "video/ogg" },
      //{ ext: "mov", type: "video/quicktime" },
      { ext: "mov", type: "video/mp4" },
      { ext: "mpeg", type: "video/mpeg" },
      { ext: "mp4", type: "video/mp4" },
      { ext: "webm", type: "video/webm" },
      //{ ext: "avi", type: "video/x-msvideo" },
      { ext: "avi", type: "video/" },
      { ext: "mp4", type: "video/mp4" },
      //{ ext: "mkv", type: "video/x-matroska" },
      { ext: "mkv", type: "video/mp4" },
      { ext: "m3u8", type: "application/x-mpegURL" },
    ];
    var ext = this.src
      .substring(this.src.lastIndexOf(".") + 1, this.src.length)
      .toLowerCase();

    const vtype = types.find((i) => i.ext == ext);
    if (vtype) {
      this.videoType = vtype.type;
    }
    var soruce = { type: this.videoType, src: this.src };
    this.playerOptions.sources[0] = soruce;
  },
  methods: {},
};
</script>