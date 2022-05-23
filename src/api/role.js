import request from '@/utils/request'
import store from '@/store'

export function getRole(data) {
  return request({
    url: `${store.getters.appconfig.apiInfo.host}/System/role`,
    method: 'post',
    data
  })
}
/*
export function getRoute(params) {
  return request({
    //url: '/vue-admin-template/role/routelist',
    url: `${store.getters.appconfig.apiInfo.host}/System/Route`,
    method: 'get',
    params:{domain:params}
  })
}
*/
export function getRouteV2() {
  return request({
    //url: '/vue-admin-template/role/routelist',
    url: `${store.getters.appconfig.apiInfo.host}/System/route`,
    method: 'get'
  })
}

export function getRoutes(params) {
  return request({
    //url: '/vue-admin-template/role/routelist',
    url: `${store.getters.appconfig.apiInfo.host}/System/routes`,
    method: 'get',
    //params:{domain:params}
  })
}

export function updateRole(data) {
  //console.log(JSON.stringify(data));
  return request({
    url:`${store.getters.appconfig.apiInfo.host}/System/role`,
    method: 'put',
    data
  })
}

export function updateRoute(data) {
  return request({
    url:`${store.getters.appconfig.apiInfo.host}/System/route`,
    method: 'put',
    data
  })
}



/*
export function deleteRole(data) {
  return request({
    url: '/vue-element-admin/deleterole',
    method: 'post',
    data
  })
}
*/
