import request from '@/utils/request'
import store from '@/store'


export function AcessUserInfo(code) {
    return request({
      url: `${store.getters.appconfig.apiInfo.hostV2}/System/acessUserInfo/${code}`,
      method: 'get',
    })
  }
  
