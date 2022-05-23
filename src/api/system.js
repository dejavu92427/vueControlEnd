import request from '@/utils/request'
import store from '@/store'
/*
export function GetSystemConfig(type) {
    return request({
      url: `${store.getters.appconfig.apiInfo.host}/system/config`,
      method: 'get',
      params: type
    })
  }

  export function PutSystemConfig(data) {
    return request({
      url: `${store.getters.appconfig.apiInfo.host}/system/config`,
      method: 'put',
      data
    })
  }
*/
  export function GetSystemConfigLog(data) {
    return request({
      url: `${store.getters.appconfig.apiInfo.hostV2}/System/configLog`,
      method: 'post',
      data
    })
  }

  export function GetSystemConfigV2(type) {
    return request({
      url: `${store.getters.appconfig.apiInfo.hostV2}/System/config/${type}`,
      method: 'get'
    })
  }

  export function PutSystemConfigV2(data) {
    return request({
      url: `${store.getters.appconfig.apiInfo.hostV2}/System/config`,
      method: 'put',
      data
    })
  }

  export function GetAllowIPs(ip) {
    return request({
      url: `${store.getters.appconfig.apiInfo.hostV2}/System/allowIPs/${ip}`,
      //url: `${store.getters.appconfig.apiInfo.hostV2}/System​/allowIPs​/${ip}`,
      method: 'get'
    })
  }