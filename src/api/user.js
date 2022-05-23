import request from '@/utils/request'
import store from '@/store'

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}

export function Login(loginInfo) {
  return request({
    url: `${store.getters.appconfig.apiInfo.host}/System/consolerUser/login/${loginInfo.account}/${loginInfo.pwd}`,
    method: 'get'
    //params: loginInfo 
  })
}

export function GetConsolerUsers(account) {
  return request({
    url: `${store.getters.appconfig.apiInfo.host}/System/consolerUsers/${(account.account==undefined||account.account=="")?"":account.account+"/"}`,
    method: 'get'
    //params:account
  })
}

export function GetUsersLoginTime(account) {
  return request({
    url: `${store.getters.appconfig.apiInfo.host}/System/consolerUser/logintime/${account}`,
    method: 'get'
    //params:account
  })
}

export function PutConsolerUser(data) { //domain+account 找到覆蓋，沒找到新增
  return request({
    url: `${store.getters.appconfig.apiInfo.host}/System/consolerUser`,
    method: 'put',
    data
  })
}

export function health() {
  return request({
    url:`${store.getters.appconfig.apiInfo.host}/Health/health`,
    method: 'get'
  })
}

// ********************** UBAuth **************************
export function UBauthCreateAccount(data) {//20210324 UBAuth
  //url: `https://bbauth-api.vir999.net/HallApi/User/Account`,
  return request({
    url: `${store.getters.appconfig.apiInfo.host}/Account/UBAuth/User/Account`,
    method: 'post',
    //type: 'ubauth',
    data
  })
}
export function UBauthUpdateAccount(data) {//20210324 UBAuth
  //url: `https://bbauth-api.vir999.net/HallApi/User/${data.account}/Account?type=${data.type}`,
  return request({
    url: `${store.getters.appconfig.apiInfo.host}/Account/UBAuth/User/${data.account}/Account?type=${data.type}`,
    method: 'put',
    //type: 'ubauth',
  })
}
export function UBauthGetAccount(account) {//20210324 UBAuth
  //url: `https://bbauth-api.vir999.net/HallApi/User/${account}/Account`
  return request({
    url: `${store.getters.appconfig.apiInfo.host}/Account/UBAuth/User/${account}/Account`,
    method: 'get',
  //   type: 'ubauth'
  })
}
export function UBauthCheckDevice(account) {//20210324 UBAuth
  //url: `https://bbauth-api.vir999.net/HallApi/User/${account}/Device/Check?connectWS=0`,
  return request({
    url: `${store.getters.appconfig.apiInfo.host}/Account/UBAuth/User/${account}/Device/Check?connectWS=0`,
    method: 'get',
    //type: 'ubauth'
  })
}
export function UBauthResetDevice(account) {//20210324 UBAuth
  //url: `https://bbauth-api.vir999.net/HallApi/User/${account}/Device/Reset`,
  return request({
    url: `${store.getters.appconfig.apiInfo.host}/Account/UBAuth/User/${account}/Device/Reset`,
    method: 'put',
    // type: 'ubauth'
  })
}
export function UBauthVerifyCode(verifyInfo) {//20210324 UBAuth
  //url: `https://bbauth-api.vir999.net/HallApi/User/${verifyInfo.account}/Code/${verifyInfo.code}/Verify`,
  return request({
    url: `${store.getters.appconfig.apiInfo.host}/Account/UBAuth/User/${verifyInfo.account}/Code/${verifyInfo.code}/Verify`,
    method: 'get',
    // type: 'ubauth'
  })
}

export function GetWhitelisting(isEnable) {
  return request({
    url:`${store.getters.appconfig.apiInfo.host}/System/getwhitelisting/${isEnable}`,
    method: 'get'
  })
}

export function PutWhitelisting(data) {
  return request({
    url:`${store.getters.appconfig.apiInfo.host}/System/whitelisting`,
    method: 'put',
    data
  })
}

export function CheckIP() {
  return request({
    url:`${store.getters.appconfig.apiInfo.host}/Health/checkwhitelisting`,
    method: 'get'
  })
}