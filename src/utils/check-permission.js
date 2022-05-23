import getRolePermission from '@/utils/role-permission'
import store from '@/store'
import { GetUsersLoginTime,GetConsolerUsers } from '@/api/user'
import { getLoginTime,removeCookies,getCookies } from '@/utils/auth'


export default async function hasPermission(to) {
    //console.log(to.path)
    var search = {};
      search.account = store.getters.account;
    var res = await GetConsolerUsers(search)
    if (res && res.data && res.data.length>0) {
        var loginTime = res.data[0].lastloginTime.toString();
        var isEnable = res.data[0].isEnable
        loginTime=loginTime.replace(' ','');
        var lastTime = getCookies('vue_logintime');
        if (loginTime !== lastTime || !isEnable) {
            removeCookies('vue_logintime');
            await store.dispatch("removeRoute");
            await store.dispatch("user/logout");
            document.location.assign(`${window.location.origin}/login?redirect=Dashboard`)
           // window.location=`${window.location.origin}/login?redirect=Dashboard`
            return;
        }
    }

    const noPermissionList = ['dashboard', '*', '404']
    let name = '';
    let canView = true;
    if (to.name)
        name = to.name.toLowerCase()
    else {
        const tAay = to.path.split("/")
        name = tAay[tAay.length - 1].toLowerCase().replace('_demo', '')

    }
    if (noPermissionList.indexOf(name) == -1) {
        const rolePermission = getRolePermission(name)
        if (!rolePermission.canView) {
            canView = false
        }
    }
    return canView;
}