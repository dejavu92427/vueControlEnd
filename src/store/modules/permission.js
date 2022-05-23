import { asyncRoutes, constantRoutes } from '@/router'
//import { getAuthMenu } from '@/api/user'
import Layout from '@/layout'
import { getRole, getRouteV2 } from '@/api/role'



/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
    if (route.children) return true
    var obj = roles.find(obj => obj.id === route.id)
    if (!obj)
        return false
    else
        return true
}

/**
 * create meun array
 * @param routes
 */
export function generaMenu(data, routes) {
    data.forEach(item => {
        // alert(JSON.stringify(item))
        let component = (item.component && item.component.length > 0) ? item.component : ''
        let menu
        if (component.length > 0) {
            menu = {
                path: item.path,
                component: (resolve) => require([`@/views${component}`], resolve),
                name: item.name,
                hidden: item.hidden,
                isdel:true,
                meta: { title: item.title, icon: item.icon, noCache: true }
            }
        }
        else {
            menu = {
                path: item.path,
                component: Layout,
                redirect: 'noRedirect',
                children: [],
                name: item.name,
                hidden: item.hidden,
                isdel:true,
                meta: { title: item.title, icon: item.icon, noCache: true }
            }
        }
        if (item.children) {
            generaMenu(item.children, menu.children)
        }
        routes.push(menu)
    })
}

export function generaPermission(data, permissionControl) {
    data.forEach(item => {
        let menu
        if (item.component.length > 0) {
            menu = {
                id: item.id,
                name: item.name,
                permission: item.permission ? { pView: item.permission.permissionView, pEdit: item.permission.permissionEdit, pDelete: item.permission.permissionDelete,pDef1:item.permission.permissionDef1,pDef2:item.permission.permissionDef2  } : { pView: false, pEdit: false, pDelete: false ,pDef1:false, pDef2:false}
            }
            permissionControl.push(menu)
        }
        if (item.children) {
            generaPermission(item.children, permissionControl)
        }

    })
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
    routes.forEach(function (item, index, object) {
        item.hidden = false; //defautl
        const tmp = { ...item }
        if (hasPermission(roles, tmp)) {
            if (tmp.children) {
                tmp.children = filterAsyncRoutes(tmp.children, roles)
                const haschild = item.children.filter(i => i.hidden == false).length > 0
                if (!haschild) item.hidden = true
            }
        } else {
            //object.splice(index, 1);
            item.hidden = true
        }
    })
}
/*
const state = {
    addRole: false,
    permissionControl: []
}
*/


const getDefaultState = () => {
    return {
        addRole: false,
        permissionControl: []
    }
}

const state = getDefaultState()

const mutations = {
    RESET_STATE: (state) => {
        Object.assign(state, getDefaultState())
    },

    SET_ROUTES: (state, data) => {
        state.addRole = true
        state.permissionControl = data
    }
}

const actions = {  // user logout
    removeRoute({ commit, state }) {
        return new Promise((resolve, reject) => {
            commit('RESET_STATE')
            resolve()
        }).catch(error => {
            reject(error)
        })
    },
    generateRoutes({ commit }, data) {
        return new Promise((resolve, reject) => {
            const allRoute = []
            const roleRoutes = []
            const accessedRoutes = []
            const permissionControl = []
            getRouteV2().then(response => {
                let routeData = response.data
                Object.assign(allRoute, routeData)
                if (response.status !== '000') {
                    throw new Error('選單資料取得異常')
                    //alert(JSON.stringify('選單資料取得異常'))
                } else {
                    //let routeData = response.data
                    getRole(data).then(response => {
                        if (response.status !== '000' || !response.data || response.data.length == 0) {
                            alert(JSON.stringify('角色資料取得異常'))
                            throw new Error('角色資料取得異常')
                        } else {
                            if (!response.data[0].routes) {
                                alert(JSON.stringify('使用者沒有可用選單'))
                                throw new Error('使用者沒有可用選單')
                            }
                            else {
                                let roleData = response.data[0].routes
                                let redirectPath=response.data[0].routes.length==1?response.data[0].routes[0].path:""
                                //temp 
                                Object.assign(roleRoutes, roleData)
                                filterAsyncRoutes(allRoute, roleRoutes)
                                generaMenu(allRoute, accessedRoutes)
                                generaPermission(roleRoutes, permissionControl)
                                commit('SET_ROUTES', permissionControl)
                                if(data.openFirstfun)//third party 預設先開第一個功能
                                {
                                   var root= accessedRoutes.find(o=>o.hidden==false)
                                   var child=root.children.find(c=>c.hidden==false)
                                   if(child) redirectPath=child.path;
                                }
                                //var onlyOneRoot=accessedRoutes.
                                resolve({accessedRoutes,redirectPath})
                            }
                        }
                    }).catch(function (error) {
                        console.log(error)
                        reject(error)
                    })

                }

            }).catch(function (error) {
                console.log(error)
                reject(error)
                // throw error
            })

        })
    }
}

export default {
    state,
    mutations,
    actions
}
