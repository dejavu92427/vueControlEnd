import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken, checkThridParty } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import { readJsonFile } from '@/utils/read-Json-file'
import hasPermission from '@/utils/check-permission'
import { config } from '@vue/test-utils'
//import { getClinetIp } from '@/utils/getClinetIp'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/callback', '/404'] // no redirect whitelist



  router.beforeEach(async (to, from, next) => {
    // start progress bar

    NProgress.start()

    if (!store.getters.checkIp)//ip 白名單檢查
    {
      readJsonFile('../config.json', async function (text) {
        var data = JSON.parse(text);
        await store.dispatch("setConfig", data)
        if (to.path != '/404') {
          const allow = await store.dispatch('checkIp')
          
          if (!allow) {
            next({ path: '/404', replace: true })
            NProgress.done
          }
          else
            next({ ...to, replace: true })
        }
        next();
      })
    } else {
      const hasToken = getToken()
      const isThirdPartyLogin = checkThridParty(to);

      if (hasToken && !isThirdPartyLogin) { //after login
        if (to.path === '/login') {
          // if is logged in, redirect to the home page
          next({ path: '/' })
          NProgress.done()
        } else {
          const hasGetUserInfo = store.getters.name
          //console.log(JSON.stringify(store.getters.addRole))
          const hasRoleRoute = store.getters.addRole
          if (hasGetUserInfo) {
            document.title = getPageTitle(`${store.getters.appconfig.title}-${to.meta.title}`);
            if (!hasRoleRoute) {
              const data = {
                roleId: store.getters.roleId.toString(),
                openFirstfun: store.getters.roleId == store.getters.appconfig.apiInfo.thridPartyRoleId
              }
              const routes = await store.dispatch('generateRoutes', data)
              var accessRoutes = routes.accessedRoutes;
              router.addRoutes(accessRoutes)
              accessRoutes.forEach(r => {
                router.options.routes.push(r)
              })
              router.options.routes.push(
                { path: '*', redirect: '/404', isdel: true, hidden: true },
              )
              // hack method to ensure that addRoutes is complete
              // set the replace: true, so the navigation will not leave a history record
              if (!hasPermission(to)) //功能name必須與vue名稱相同
                next(`/login?redirect=${to.path}`)
              else {
                if (routes.redirectPath != "")//預設導向該功能
                  next(`${routes.redirectPath}`);
                else
                  next({ ...to, replace: true })
              }

            } else {
              if (!hasPermission(to))
                next(`/login?redirect=${to.path}`)
              else
                next()
            }
          } else {
            try {
              // if is logged in then refresh

              // readJsonFile('../config.json', function (text) {
              //   var data = JSON.parse(text);
              //   store.dispatch("setConfig", data)
              document.title = getPageTitle(`${store.getters.appconfig.title}-${to.meta.title}`);
              store.dispatch('user/getInfo', store.getters.appconfig.domain).then(() => {
                const data = {
                  roleId: store.getters.roleId.toString(),
                  openFirstfun: store.getters.roleId == store.getters.appconfig.apiInfo.thridPartyRoleId
                }
                store.dispatch('generateRoutes', data).then(routes => {
                  //const t=accessRoutes.child
                  var accessRoutes = routes.accessedRoutes;
                  router.addRoutes(accessRoutes)
                  accessRoutes.forEach(r => {
                    router.options.routes.push(r)
                  })
                  router.options.routes.push(
                    { path: '*', redirect: '/404', isdel: true, hidden: true },
                  )
                  if (!hasPermission(to))
                    next(`/login?redirect=${to.path}`)
                  else
                    next({ ...to, replace: true })

                }).catch(function (error) {
                  store.dispatch('user/resetToken')
                  Message.error(error || 'Has Error')
                  next(`/login?redirect=${to.path}`)
                  NProgress.done()
                })
              }).catch(function (error) {
                store.dispatch('user/resetToken')
                next(`/login?redirect=${to.path}`)
                NProgress.done()
              })
              // })
            } catch (error) {
              // remove token and go to login page to re-login
              await store.dispatch('user/resetToken')
              Message.error(error || 'Has Error')
              next(`/login?redirect=${to.path}`)
              NProgress.done()
            }
          }
        }
      } else {
        /* no token*/
        //get config first

        // readJsonFile('../config.json', function (text) {
        //   var data = JSON.parse(text);
        //   store.dispatch("setConfig", data)
        let title = store.getters.appconfig.title
        document.title = getPageTitle(title);
        if (whiteList.indexOf(to.path) !== -1) {
          // in the free login whitelist, go directly
          next()
          NProgress.done()
        } else {
          // other pages that do not have permission to access are redirected to the login page.
          if (to.query.src && to.query.token && to.query.username) // is 3rd party user call in
            next(`/callback?src=${to.query.src}&token=${to.query.token}&username=${to.query.username}`)
          else
            next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
        //})
      }
    }
  })

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

