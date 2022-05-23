import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import permission from './modules/permission'
import appconfig from './modules/appconfig'
import checkIp from './modules/checkIp'

Vue.use(Vuex)


const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    permission,
    appconfig,
    checkIp
  },
  getters
})

export default store
