import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import router from '@/router'


// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 90000, // request timeout,
  maxContentLength: 500 * 1024 * 1024,
  maxBodyLength: 500 * 1024 * 1024
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.getAppconfig) {
      if (config.type == 'rd5') {
        config.headers['token'] = store.getters.appconfig.apiInfo.rd5token
      }
      if (config.type == 'form-data') {
        config.headers['Content-type'] = 'multipart/form-data'
      }
      else {
        config.headers['Content-type'] = 'application/json'
      }
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {

    //missiontag例外，response中沒有status段
    let isException = false

    if (response.request.responseURL.includes('account/missiontag')
      || response.request.responseURL.includes('activity/activity')
      || response.request.responseURL.includes('CDN/ClearPathCache')) {
      isException = true
    }

    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    //if (res.code !== 20000) {
    let isTrue = ((typeof res === 'string' && res.startsWith('/yellow')) || res.status == 'ok' || res.status == '000' || isException && response.status == 200 || res == "非服務地區" || response.request.responseURL.includes('processstatus'))
    if ((!isTrue) && res.code !== 20000) {//arvin Login on 2020/07/28
      //    console.log(response.request.responseURL);
      console.log(`Error : ${response.request.responseURL} : ${JSON.stringify(res)}`);
      var isUploadApi = (response.request.responseURL.includes('fileuploadinfo') || response.request.responseURL.includes('mergefile'))
      var msg = res.showMsg ? res.msg : "";
      if (!isUploadApi) //上傳檔案不alert message
        Message({
          message: msg.length > 0 ? msg : 'Api連線中斷或發生異常',
          type: 'error',
          duration: 5 * 1000
        })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(`res.status: ${res.status};res.errorCode:${res.errorCode}` || 'Error'))
    }
    else if (res == "非服務地區") {
      router.push("/404");
    }
    else {
      if (res.errorCode == "01")
        res.data = [];
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message ? `${error.message} 網路異常` : `網路異常`,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
