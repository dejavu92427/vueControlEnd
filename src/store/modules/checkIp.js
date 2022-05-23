import { CheckIP } from '@/api/user'

const state = {
    checkIp: false
}

const mutations = {
    SET_CHECKIP: (state, checkIp) => {
        state.checkIp = checkIp
    }
}

const actions = {

    async checkIp({ commit }) {
        var allow = true
        const res = await CheckIP()
        allow = res.data
        const checkIp = allow
        commit('SET_CHECKIP', checkIp)
        return allow;
    }
}
export default {
    state,
    mutations,
    actions
}
