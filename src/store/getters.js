
const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  userName: state => state.user.userName,
  account: state => state.user.account,
  vendorId: state => state.user.vendorId,
  vendorName:state => state.user.vendorName,
  role: state => state.user.role,
  roleId: state => state.user.roleId,
  auth: state => state.user.auth,
  domain: state => state.user.domain,
  addRole: state => state.permission.addRole,
  permissionControl: state => state.permission.permissionControl,
  getAppconfig: state => state.appconfig.getAppconfig,
  appconfig: state => state.appconfig.appconfig,
  checkIp : state => state.checkIp.checkIp
}
export default getters
