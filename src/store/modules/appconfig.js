import manager from '../../config/manager';

const state = {
    getAppconfig: false
}

const mutations = {
    SET_APPCONFIG: (state, appconfig) => {
        state.getAppconfig = true,
            state.appconfig = appconfig
    }
}

const actions = {
/*    getConfig({ commit }) {
        //console.log('getConfig')
         fetch("../config.json")
            .then((res) => res.json())
            .then((res) => {
                const domain = res.rd7Settings.domain
                const appconfig = {
                    domain: domain,
                    title: res.rd7Settings.title,
                    loginImage: res.rd7Settings.loginImage,
                    apiInfo: res.rd7Settings.manager[domain]
                };
                commit('SET_APPCONFIG', appconfig)
                return appconfig;
            })
            .catch((err) => { });
    },
    */
    setConfig({ commit}, data)
    {
        const domain = data.rd7Settings.domain
        const domainType=  domain
        let appInfo=manager[`_${domainType}`]
        const appconfig = {
            domain: domain,
            domainInt: Number(domain),
            isDemo: data.rd7Settings.isDemo,
            title: data.rd7Settings.title + domain.toUpperCase(),
            loginImage: data.rd7Settings.loginImage,
            vendorUBAuthCheck: data.rd7Settings.vendorUBAuthCheck,//全廳ubauth開關  20210324 UBAuth
            domainUBAuth: data.rd7Settings.domainUBAuth,//全廳ubauth開關  20210324 UBAuth
            apiInfo: appInfo,
        };
       // console.log(JSON.stringify(appconfig));
        commit('SET_APPCONFIG', appconfig)
        return true
    }
}
export default {
    state,
    mutations,
    actions
}
