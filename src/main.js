
import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css
import '@/styles/custom.scss' // custom css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import '@/utils/date-format'
import '@/utils/number-format'
import '@/utils/string-format'

import uploader from 'vue-simple-uploader'

import VideoPlayer from 'vue-video-player'
import Viewer from "v-viewer";
require( 'viewerjs/dist/viewer.css')

require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')

console.log('v0.0.111.1')

Vue.use(VideoPlayer)

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
    zIndex:5000
  },
});

const hls = require('videojs-contrib-hls')
Vue.use(hls)


/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */


Vue.config.devtools = true;

if (process.env.NODE_ENV === 'production') {
 // const { mockXHR } = require('../mock')
 // mockXHR()
  Vue.config.devtools=false
}

//上傳套件
Vue.use(uploader)
// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false



/* 页面数据缓存 */
var _CACHE_OBJS = {};
 
function _init_cache(comp, key, cache) {
  var obj = cache[key];
  if (obj !== undefined) {
    comp[key] = obj;
  }
  var deep = typeof comp[key] === 'object';
  comp.$watch(key,
    function (val) {
      //console.log("page " + key + " updated");
      cache[key] = val;
    }, {
      deep: deep
    });
}
 
 
var _PAGE_CACHE = {
  /*
   * 初始化页面缓存数据
   * comp: 当前页面component 对象
   * path: 当前页面vue router path
   * data: 需要缓存的数据对象名稱，或名稱数组
   */
  cache: function (comp, path, data) {
    if (data == '' || data == undefined || data == null) {
      data = restore(comp._data);
    }
    var cache = _CACHE_OBJS[path];
    if (cache === undefined) {
      cache = {};
      _CACHE_OBJS[path] = cache;
    }
    if (typeof data == 'string') {
      _init_cache(comp, data, cache);
    } else {
      var i;
      for (i = 0; i < data.length; ++i) {
        _init_cache(comp, data[i], cache);
      }
    }
    console.log(_CACHE_OBJS, "页面数据缓存");
  },
 
  /* 清除页面缓存 */
  clear: function (path) {
    delete _CACHE_OBJS[path];
  },
 
  /* 清空所有缓存数据 */
  reset: function () {
    //console.log("reset page cache");
    _CACHE_OBJS = {};
  },
  /*根据path查看当前页面缓存是否存在*/
  has_cache: function (path) {
    return _CACHE_OBJS[path] !== undefined && !isEmptyObject(_CACHE_OBJS[path]);
  }
};
 
Vue.prototype.$cache = _PAGE_CACHE;
/* eslint-disable no-new */
 
var restore = function (vueObject) {
  var result = [];
  for (var index in vueObject) {
    result.push(index);
  }
  return result;
};
 
var isEmptyObject = function (obj) {
  for (var key in obj) {
    return false;
  }
  return true;
}

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})