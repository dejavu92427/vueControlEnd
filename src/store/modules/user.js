import {
  logout, GetConsolerUsers, PutConsolerUser, Login
  , UBauthCreateAccount, UBauthUpdateAccount, UBauthGetAccount, UBauthCheckDevice, UBauthVerifyCode
} from '@/api/user'
import { GetVendersNoCount } from "@/api/video";
import { getToken, setTokenOptions, setToken, removeToken, setLoginTime } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    userName: '',
    account: '',
    role: '',
    roleId: '',
    auth: '',
    domain: '',
    vendorId: '',
    vendorName:''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, value) => { state.token = value },
  SET_NAME: (state, value) => { state.name = value },
  SET_AVATAR: (state, value) => { state.avatar = value },
  SET_USERNAME: (state, value) => { state.userName = value },
  SET_ACCOUNT: (state, value) => { state.account = value },
  SET_ROLE: (state, value) => { state.role = value },
  SET_ROLEID: (state, value) => { state.roleId = value },
  SET_AUTH: (state, value) => { state.auth = value },
  SET_DOMAIN: (state, value) => { state.domain = value },
  SET_VENDOR: (state, value) => { state.vendorId = value },
  SET_VENDORNAME: (state, value) => { state.vendorName = value }
}

function SetCommitInfo(_loginuser) {
  mutations.SET_TOKEN(state, _loginuser.account)
  mutations.SET_NAME(state, _loginuser.userName)
  mutations.SET_AVATAR(state, "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif")
  mutations.SET_USERNAME(state, _loginuser.userName)
  mutations.SET_ACCOUNT(state, _loginuser.account)
  mutations.SET_ROLE(state, _loginuser.role)
  mutations.SET_ROLEID(state, _loginuser.roleId)
  mutations.SET_AUTH(state, _loginuser.auth)
  mutations.SET_DOMAIN(state, _loginuser.domain)
  mutations.SET_VENDOR(state, _loginuser.spaceId)
  mutations.SET_VENDORNAME(state, _loginuser.vendorName)
  setTokenOptions(_loginuser.account, { expires: 1 })
  setLoginTime(_loginuser.lastloginTime)
}

const actions = {
  // user login

  login({ commit }, userInfo) {
    const { username, password, domain } = userInfo
    const loginInfo = {
      account: username,
      pwd: password,
      domain: domain
    }
    return new Promise((resolve, reject) => {
      Login(loginInfo).then(response => {
        let isdbUser = false;
        isdbUser = response.data
        if (isdbUser) {
          GetConsolerUsers(loginInfo).then(res => {
            const dbUsers = res.data
            const _loginuser = dbUsers.find(o => o.account == username)
            //SetCommitInfo(_loginuser)
            resolve(_loginuser)
            /* 登入後api 直接寫入美東時間
            _loginuser.lastloginTime = new Date().Format('yyyy-MM-ddThh:mm:ss')
            PutConsolerUser(_loginuser)
            */
          }).catch(function (error) {
            reject('驗證發生異常');
          })
        }
        else {
          reject('請輸入正確的帳號密碼');
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user login

  commitUser({ commit }, userInfo) {    //20210324 UBAuth
    const { username, password, domain, auth } = userInfo
    const loginInfo = {
      account: username,
      pwd: password,
      domain: domain
    }
    return new Promise((resolve, reject) => {
      // Login(loginInfo).then(response => {
      //   let isdbUser = false;
      //   isdbUser = response.data
      //   if (isdbUser) {
      GetConsolerUsers(loginInfo).then(res => {
        const dbUsers = res.data
        const _loginuser = dbUsers.find(o => o.account == username)
        GetVendersNoCount().then(res => {
          if (res.data) {
            var vendorObj = res.data.find((o) => o.id == _loginuser.spaceId);
            if (vendorObj) {
              if (vendorObj.roleType === 1)
                _loginuser.vendorName = `供影商：${vendorObj.spaceName}`;
              else if (vendorObj.roleType === 2)
                _loginuser.vendorName = `廳主：${vendorObj.spaceName}`;
            }
            else if (_loginuser.spaceId === 0) _loginuser.vendorName = `系統管理者`;
            SetCommitInfo(_loginuser)
            resolve(_loginuser)
            // _loginuser.lastloginTime = new Date().Format('yyyy-MM-ddThh:mm:ss')
            if (_loginuser.auth !== "N" && userInfo.auth == "defaultY") {//初始化 檢查ubauth開關，ubauth驗證通過後
              _loginuser.auth = "Y";
            }
            PutConsolerUser(_loginuser)
          }
        }).catch(function (error) {
          reject('驗證發生異常');
        })
      }).catch(function (error) {
        reject('驗證發生異常');
      })
      //   }
      //   else {
      //     reject('請輸入正確的帳號密碼');
      //   }
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // get user info

  getInfo({ commit, state }, domain) {
    const { userName, token } = state
    const logInfo = {
      account: token,
      domain: domain
    }
    return new Promise((resolve, reject) => {
      GetConsolerUsers(logInfo).then(response => {
        const dbUsers = response.data
        const _loginuser = dbUsers.find(o => o.isEnable == true && o.account == token)
        if (_loginuser !== undefined) {
          GetVendersNoCount().then(res => {
            var vendorObj = res.data.find((o) => o.id == _loginuser.spaceId);
            if (vendorObj) {
              if (vendorObj.roleType === 1)
                _loginuser.vendorName = `供影商:${vendorObj.spaceName}`;
              else if (vendorObj.roleType === 2)
                _loginuser.vendorName = `廳主:${vendorObj.spaceName}`;
            }
            else if (_loginuser.spaceId === 0) _loginuser.vendorName = `系統管理者`;
            SetCommitInfo(_loginuser)
            resolve(_loginuser)
          }).catch(error => {
            reject(error)
          })
        }
        else {
          return reject('帳號資料異常，請重新登入')
        }
      }
      ).catch(error => {
        reject(error)
      })
    })
  },
  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      removeToken() // must remove  token  first
      resetRouter()
      commit('RESET_STATE')
      resolve()
    }).catch(error => {
      reject(error)
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  },


  CreateAccount({ commit }, authAccount) {  //20210324 UBAuth
    return new Promise((resolve, reject) => {
      UBauthCreateAccount(authAccount).then(response => {
        resolve(response)
      }).catch(function (error) {
        reject('Error');
      })
    })
  },
  UpdateAccount({ commit }, data) {  //20210324 UBAuth
    return new Promise((resolve, reject) => {
      UBauthUpdateAccount(data).then(response => {
        resolve(response)
      }).catch(function (error) {
        reject('Error');
      })
    })
  },
  GetAccount({ commit }, authAccount) {  //20210324 UBAuth
    return new Promise((resolve, reject) => {
      UBauthGetAccount(authAccount).then(response => {
        resolve(response)
      })
        .catch(error => {
          reject(error)
        })
    })
  },
  CheckDevice({ commit }, authAccount) {  //20210324 UBAuth
    return new Promise((resolve, reject) => {
      UBauthCheckDevice(authAccount).then(response => {
        resolve(response)
      })
        .catch(error => {
          reject(error)
        })
    })
  },
  VerifyCode({ commit }, verifyInfo) {  //20210324 UBAuth
    return new Promise((resolve, reject) => {
      UBauthVerifyCode(verifyInfo).then(response => {
        resolve(response)
      })
        .catch(error => {
          reject(error)
        })
    })
  },

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

