import request from '@/utils/request'
import store from '@/store'

export function GetCodeList(data) {
    return request({
      url: `${store.getters.appconfig.apiInfo.host}/System/codelist`,
      method: 'post',
      data
    })
  }