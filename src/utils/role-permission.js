import store from '@/store'
import router from '@/router'



//get role permission by route name
export default function getRolePermission(routeName) {
    const permissionControl = store.getters.permissionControl
    const obj = permissionControl.find(obj =>  obj.name.toLowerCase() === routeName.toLowerCase() )
    const rolePermession =
    {
        canView: obj && obj.permission ? obj.permission.pView : false,
        canEdit: obj && obj.permission ? obj.permission.pEdit : false,
        canDelete: obj && obj.permission ? obj.permission.pDelete : false,
        canDef1: obj && obj.permission ? obj.permission.pDef1 : false,
        canDef2: obj && obj.permission ? obj.permission.pDef2 : false,
    }
    return rolePermession
}