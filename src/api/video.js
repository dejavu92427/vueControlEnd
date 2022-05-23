import request from '@/utils/request'
import store from '@/store'

export function GetVideoSites() {
    return request({
      url: `${store.getters.appconfig.apiInfo.hostV2}/Video/video_sites`,
      method: 'get'
    })
  }
  
export function PutVideoSites(data) {
    return request({
      url: `${store.getters.appconfig.apiInfo.hostV2}/Video/video_sites`,
      method: 'put',
      data
    })
  }
  
  export function GetVideoTagTopics(sapceId) {
    return request({
      url: `${store.getters.appconfig.apiInfo.host}/System/topics/${sapceId}`,
      method: 'get'
    })
  }
  
export function PutVideoTagTopics(data) {
    return request({
      url: `${store.getters.appconfig.apiInfo.host}/System/topics`,
      method: 'put',
      data
    })
  }

  export function PostVideoTags(data) {
    return request({
      url: `${store.getters.appconfig.apiInfo.host}/System/videotags`,
      method: 'post',
      data
    })
  }

  export function PostVideoTagsCount(data) {
    return request({
      url: `${store.getters.appconfig.apiInfo.host}/System/videotagscount`,
      method: 'post',
      data
    })
  }

  export function PutVideoTag(data) {
    return request({
      url: `${store.getters.appconfig.apiInfo.host}/System/videotag`,
      method: 'put',
      data
    })
  }
  export function GetVedioAllTags(spaceId , topic = 0) {
    return request({
      url: `${store.getters.appconfig.apiInfo.host}/System/videotag/${spaceId}/${topic>0?topic:''}`,
      method: 'get'
    })
  }

  export function GetSortsCount(condition) {
    return request({
      url: `${store.getters.appconfig.apiInfo.host}/System/sortsCount`,
      method: 'post',
      data: condition,
    })
  }

  export function GetSorts() {
    return request({
      url: `${store.getters.appconfig.apiInfo.host}/System/sorts`,
      method: 'get',
    })
  }

  export function PutSorts(updateData) {
    return request({
      url: `${store.getters.appconfig.apiInfo.host}/System/sorts`,
      method: 'put',
      data: updateData,
    })
  }

  export function GetVideos() {
    return request({
      url: `${store.getters.appconfig.apiInfo.hostV2}/Video/videos`,
      method: 'get'
    })
  }

  export function GetVideosInCondition(condition) {
    return request({
      url: `${store.getters.appconfig.apiInfo.host}/System/videosincondition`,
      method: 'post',
      data: condition,
    })
  }

  export function GetVideoOwnerCount(spaceId) {
    return request({
      url: `${store.getters.appconfig.apiInfo.host}/System/ownerscount/${spaceId}`,
      method: 'get'
    })
  }

  export function GetVideoOwner() {
    return request({
      url: `${store.getters.appconfig.apiInfo.host}/System/owners`,
      method: 'get'
    })
  }

  export function PutVideoOwner(data) {
    return request({
      url: `${store.getters.appconfig.apiInfo.host}/System/owners`,
      method: 'put',
      data
    })
  }

  export function GetVenders() {
    return request({
      url: `${store.getters.appconfig.apiInfo.host}/System/vendors`,
      method: 'get'
    })
  }

  export function GetVendersCount(spaceId) {
    return request({
      url: `${store.getters.appconfig.apiInfo.host}/System/vendorscount/${spaceId}`,
      method: 'get'
    })
  }

  export function GetAllVendersCount() {
    return request({
      url: `${store.getters.appconfig.apiInfo.host}/System/vendorscount`,
      method: 'get'
    })
  }

  export function GetVendersNoCount() {
    return request({
      url: `${store.getters.appconfig.apiInfo.host}/System/vendors`,
      method: 'get'
    })
  }
  export function GetVendersBySpaceId(spaceId) {
    return request({
      url: `${store.getters.appconfig.apiInfo.host}/System/vendors/${spaceId}`,
      method: 'get'
    })
  }

  export function GetCdns() {
    return request({
      url: `${store.getters.appconfig.apiInfo.host}/System/cdn`,
      method: 'get'
    })
  }

  export function GetDomains() {
    return request({
      url: `${store.getters.appconfig.apiInfo.host}/System/apiDomain`,
      method: 'get'
    })
  }

  export function PutVenders(updateData) {
    return request({
      url: `${store.getters.appconfig.apiInfo.host}/System/vendors`,
      method: 'put',
      data: updateData,
    })
  }

  export function PutWatermark() {
    return request({
      url: `${store.getters.appconfig.apiInfo.hostV2}/Video/watermark`,
      method: 'put'
    })
  }


  export function PutCdn(data) {
    return request({
      url: `${store.getters.appconfig.apiInfo.host}/System/cdn`,
      method: 'put',
      data
    })
  }

  export function PutApiDomain(updateData) {
    return request({
      url: `${store.getters.appconfig.apiInfo.host}/System/apiDomain`,
      method: 'put',
      data: updateData,
    })
  }

  export function PutVideos(updateData) {
    return request({
      url: `${store.getters.appconfig.apiInfo.host}/System/videos`,
      method: 'put',
      data: updateData,
    })
  }

  export function GetViewerVideoCount(spaceId) {
    return request({
      url: `${store.getters.appconfig.apiInfo.host}/System/videoCountBySpaces/${spaceId}`,
      method: 'get'
    })
  }

  export function PostViewerVideo(data) {
    return request({
      url: `${store.getters.appconfig.apiInfo.host}/System/viewerVideoInCondition`,
      method: 'post',
      data:data
    })
  }

  export function PutViewerVideo(updateData) {
    return request({
      url: `${store.getters.appconfig.apiInfo.host}/System/viewerVideos`,
      method: 'put',
      data: updateData,
    })
  }
  
  export function PutAllStatus(updateData) {
    return request({
      url: `${store.getters.appconfig.apiInfo.host}/System/viewerVideosAll`,
      method: 'put',
      data: updateData,
    })
  }

  export function AddViewrVideo(updateData) {
    return request({
      url: `${store.getters.appconfig.apiInfo.host}/System/viewerMapping`,
      method: 'put',
      data: updateData,
    })
  }

  export function GetTagMapping(videoId) {
    return request({
      url: `${store.getters.appconfig.apiInfo.host}/System/tagMapping/${videoId}`,
      method: 'get'
    })
  }

  export function GetTitleMapping(videoId) {
    return request({
      url: `${store.getters.appconfig.apiInfo.host}/System/titleMapping/${videoId}`,
      method: 'get'
    })
  }

  export function GetVideofilehost() {
    return request({
      url: `${store.getters.appconfig.apiInfo.host}/System/videofilehost`,
      method: 'get'
    })
  }


  export function GetCos() {
    return request({
      url: `${store.getters.appconfig.apiInfo.host}/System/cos`,
      method: 'get'
    })
  }

  
  export function PutCos(data) {
    return request({
      url: `${store.getters.appconfig.apiInfo.host}/System/cos`,
      method: 'put',
      data
    })
  }
  export function PostEnqueue(data) {
    return request({
      url: `${store.getters.appconfig.apiInfo.host}/transform/enqueue`,
      method: 'post',
      data
    })
  }

  export function PutProcessStatus(data) {
    return request({
      url: `${store.getters.appconfig.apiInfo.host}/transform/processstatus`,
      method: 'put',
      data
    })
  }

  export function GetViewerVideoInfo(videoId) {
    return request({
      url: `${store.getters.appconfig.apiInfo.host}/System/viewerVideoInfo/${videoId}`,
      method: 'get'
    })
  }

  export function GetSpaceIdbyViewerSpaceId(viewerSpaceId) {
    return request({
      url: `${store.getters.appconfig.apiInfo.host}/System/spaceIdbyViewerSpaceId/${viewerSpaceId}`,
      method: 'get'
    })
  }

  export function PutClearPathCache(cdn,path) {
    return request({
      url: `${store.getters.appconfig.apiInfo.host}/ThirdCloud/CDN/ClearPathCache?cdndomain=${cdn}`,
      method: 'put',
      data: path,
    })
  }

  export function GetSpaceCOS() {
    return request({
      url: `${store.getters.appconfig.apiInfo.host}/System/spaceCOS`,
      method: 'get'
    })
  }
  export function PutSpaceCOS(data) {
    return request({
      url: `${store.getters.appconfig.apiInfo.host}/System/spaceCOS`,
      method: 'put',
      data
    })
  }
  export function GetSystembyName(name) {
    return request({
      url: `${store.getters.appconfig.apiInfo.host}/System/getSystem/${name}`,
      method: 'get'
    })
  }

  export function PostUpdateRedis(data) {
    return request({
      url: `${store.getters.appconfig.apiInfo.host}/System/updateRedis`,
      method: 'post',
      data
    })
  }

  export function PutNewTag(data) {
    return request({
      url: `${store.getters.appconfig.apiInfo.host}/System/newTag`,
      method: 'put',
      data
    })
  }

  export function PutDeleteTag(data) {
    return request({
      url: `${store.getters.appconfig.apiInfo.host}/System/deleteTag`,
      method: 'put',
      data
    })
  }

  export function PutViewerMappingStatus(data) {
    return request({
      url: `${store.getters.appconfig.apiInfo.host}/System/viewerMappingStatus`,
      method: 'put',
      data
    })
  }

