import request from '@/utils/request'
import store from '@/store'

export function GetSpace() {
    return request({
      url: `${store.getters.appconfig.apiInfo.hostV2}/Web/space`,
      method: 'get'
    })
  }

  export function PutSpace(data) {
    return request({
      url: `${store.getters.appconfig.apiInfo.hostV2}/Web/space`,
      method: 'put',
      data
    })
  }