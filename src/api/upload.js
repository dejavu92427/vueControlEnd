import request from '@/utils/request'
import store from '@/store'


export function PostupliadFileChunk(data, config) {
  return request({
    url: `${store.getters.appconfig.apiInfo.host}/upload/fileuploadinfo`,
    method: 'put',
    data,
    onUploadProgress: config.onUploadProgress,
    cancelToken: config.cancelToken,
    timeout: 0
  })
}

export function PostVideoMerge(data) {
  return request({
    url: `${store.getters.appconfig.apiInfo.host}/upload/mergefile`,
    method: 'put',
    data,
  })
}

export function PutFileUploadMaster(data) {
  return request({
    url: `${store.getters.appconfig.apiInfo.host}/upload/fileuploadmaster`,
    method: 'put',
    data,
  })
}
