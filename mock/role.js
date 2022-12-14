module.exports = [
  {
    url: '/mock-api/System/routes',
    type: 'get',
    response: config => {
      const { page } = config.page
      return {
        "status": "000",
        "errorCode": "00",
        "version": "",
        "data": [
          {
            "id": 1,
            "parentId": 0,
            "name": "console",
            "component": "",
            "path": "/console",
            "title": "後台管理",
            "icon": "el-icon-help",
            "description":"",
            "view": false,
            "edit": false,
            "delete": false,
            "domain": "00",
            "sequence": 1,
            "createDate": "",
            "lastUpdateTime": "2020-12-09 15:59:02",
            "def1":false,
            "defLabel1":"", 
            "def2":false,
            "defLabel2":""
          },
          {
            "id": 2,
            "parentId": 1,
            "name": "Role",
            "component": "/role/index",
            "path": "/role",
            "title": "角色管理",
            "icon": "",
            "description": "管理各角色之權限",
            "view": true,
            "edit": true,
            "delete": true,
            "domain": "00",
            "sequence": 3,
            "createDate": "",
            "lastUpdateTime": "2020-10-26 16:01:11",
            "def1":false,
            "defLabel1":"", 
            "def2":false,
            "defLabel2":""
          },
          {
            "id": 3,
            "parentId": 1,
            "name": "User",
            "component": "/user/index",
            "path": "/user",
            "title": "帳號維護",
            "icon": "",
            "description": "管理後台使用者帳號",
            "view": true,
            "edit": true,
            "delete": false,
            "domain": "00",
            "sequence": 2,
            "createDate": "",
            "lastUpdateTime": "2020-11-03 09:46:18",
            "def1":false,
            "defLabel1":"", 
            "def2":false,
            "defLabel2":""
          },
          {
            "id": 99,
            "parentId": 1,
            "name": "vendor",
            "component": "/vendor/index",
            "path": "/vendor",
            "title": "廠商管理",
            "icon": "",
            "description": "管理廠商列表",
            "view": true,
            "edit": true,
            "delete": true,
            "domain": "00",
            "sequence": 4,
            "createDate": "",
            "lastUpdateTime": "2020-10-26 16:01:11",
            "def1":false,
            "defLabel1":"", 
            "def2":false,
            "defLabel2":""
          },
          {
            "id": 100,
            "parentId": 0,
            "name": "web",
            "component": "",
            "path": "/web",
            "title": "網站管理",
            "icon": "el-icon-help",
            "description": "",
            "view": false,
            "edit": false,
            "delete": false,
            "domain": "00",
            "sequence": 1,
            "createDate": "",
            "lastUpdateTime": "2020-12-09 15:59:02",
            "def1":false,
            "defLabel1":"", 
            "def2":false,
            "defLabel2":""
          },
          {
            "id": 5,
            "parentId": 100,
            "path": "/web/sites",
            "component": "/web/sites",
            "name": "sites",
            "title": "視頻站点",
            "icon": "",
            "description": "",
            "view": true,
            "edit": true,
            "delete": true,
            "domain": "00",
            "sequence": 1,
            "createDate": "",
            "lastUpdateTime": "2020-10-29 17:28:52",
            "def1":false,
            "defLabel1":"", 
            "def2":false,
            "defLabel2":""
          },
          {
            "id": 7,
            "parentId": 100,
            "path": "/video/vender",
            "component": "/video/vender",
            "name": "space",
            "title": "廠商管理",
            "icon": "",
            "description": "",
            "view": true,
            "edit": false,
            "delete": false,
            "domain": "00",
            "sequence": 1,
            "createDate": "",
            "lastUpdateTime": "2020-10-29 17:28:52",
            "permissionDef1":false,
            "permissionDef_1_label":"", 
            "permissionDef2":false,
            "permissionDef_2_label":""
          },
          {
            "id": 4,
            "parentId": 0,
            "name": "video",
            "component": "",
            "path": "/video",
            "title": "影片管理",
            "icon": "el-icon-folder-checked",
            "description": "",
            "view": false,
            "edit": false,
            "delete": false,
            "domain": "00",
            "sequence": 2,
            "createDate": "",
            "lastUpdateTime": "2020-11-03 16:21:41",
            "def1":false,
            "defLabel1":"", 
            "def2":false,
            "defLabel2":""
          },
          {
            "id": 6,
            "parentId": 4,
            "path": "/video/sort",
            "component": "/video/sort",
            "name": "sort",
            "title": "視頻分類",
            "icon": "",
            "description": "",
            "view": true,
            "edit": true,
            "delete": true,
            "domain": "00",
            "sequence": 2,
            "createDate": "",
            "lastUpdateTime": "2020-11-24 12:51:20",
            "permissionDef1":false,
            "permissionDef_1_label":"", 
            "permissionDef2":false,
            "permissionDef_2_label":""
          },

          {
            "id": 10,
            "parentId": 4,
            "path": "/video/tag-topics",
            "component": "/video/tag-topics",
            "name": "tag-topics",
            "title": "標籤分類",
            "icon": "",
            "description": "",
            "view": true,
            "edit": true,
            "delete": true,
            "domain": "00",
            "sequence": 2,
            "createDate": "",
            "lastUpdateTime": "2020-08-10 11:40:50",
            "def1":false,
            "defLabel1":"", 
            "def2":false,
            "defLabel2":""
          },
          {
            "id": 19,
            "parentId": 4,
            "path": "/video/tags",
            "component": "/video/tags",
            "name": "tags",
            "title": "視頻標籤",
            "icon": "",
            "description": "",
            "view": true,
            "edit": true,
            "delete": true,
            "domain": "00",
            "sequence": 2,
            "createDate": "",
            "lastUpdateTime": "2020-08-10 11:40:50",
            "def1":false,
            "defLabel1":"", 
            "def2":false,
            "defLabel2":""
          },
          {
            "id": 24,
            "parentId": 4,
            "path": "/video/owner",
            "component": "/video/owner",
            "name": "owner",
            "title": "視頻作者",
            "icon": "",
            "description": "",
            "view": true,
            "edit": true,
            "delete": true,
            "domain": "00",
            "sequence": 3,
            "createDate": "",
            "lastUpdateTime": "2020-11-03 16:14:02",
            "def1":false,
            "defLabel1":"", 
            "def2":false,
            "defLabel2":""
          },
          {
            "id": 54,
            "parentId": 4,
            "path": "/video/video-list",
            "component": "/video/video-list",
            "name": "video-list",
            "title": "視頻列表",
            "icon": "",
            "description": "",
            "view": true,
            "edit": true,
            "delete": true,
            "domain": "00",
            "sequence": 1,
            "createDate": "",
            "lastUpdateTime": "2020-07-31 06:15:45",
            "def1":true,
            "defLabel1":"影片上傳", 
            "def2":true,
            "defLabel2":"狀態管理"
          },
          {
            "Type": 0,
            "id": 101,
            "parentId": 4,
            "path": "/video/video-manger",
            "component": "/video/video-manger",
            "name": "video-manger",
            "title": "視頻選擇",
            "icon": "",
            "description": "",
            "view": true,
            "edit": true,
            "delete": false,
            "sequence": 9,
            "delflag": false,
            "createUser": "",
            "lastUpdateTime": "2020-10-23 14:30:20",
            "lastupdateUser": "sera003",
            "def1":false,
            "defLabel1":"", 
            "def2":false,
            "defLabel2":"",
          },
          {
            "id": 8,
            "parentId": 0,
            "path": "/cdn",
            "component": "",
            "name": "CDN",
            "title": "CDN管理",
            "icon": "eye-open",
            "description": "",
            "view": false,
            "edit": false,
            "delete": false,
            "domain": "00",
            "sequence": 4,
            "createDate": "",
            "lastUpdateTime": "2020-12-07 15:37:59",
            "def1":false,
            "defLabel1":"", 
            "def2":false,
            "defLabel2":""
          },
          
          {
            "id": 7,
            "parentId": 8,
            "path": "/video/vendor-cdn",
            "component": "/video/vendor-cdn",
            "name": "vendor-cdn",
            "title": "廠商CDN",
            "icon": "",
            "description": "",
            "view": true,
            "edit": false,
            "delete": false,
            "domain": "00",
            "sequence": 2,
            "createDate": "",
            "lastUpdateTime": "2020-11-20 17:11:24",
            "def1":false,
            "defLabel1":"", 
            "def2":false,
            "defLabel2":""
          },
          {
            "id": 18,
            "parentId": 1,
            "name": "Route",
            "component": "/route/index",
            "path": "/route",
            "title": "功能管理",
            "icon": "",
            "description": "新增或刪除功能",
            "view": true,
            "edit": true,
            "delete": true,
            "domain": "00",
            "sequence": 1,
            "createDate": "2020-08-13 10:55:16",
            "lastUpdateTime": "2020-11-03 10:16:51",
            "def1":false,
            "defLabel1":"", 
            "def2":false,
            "defLabel2":""
          }
        ]
      }
    }
  },
  {
    url: '/mock-api/System/route',
    type: 'get',
    response: config => {
      return {
        "status": "000",
        "errorCode": "00",
        "version": "",
        "data": [
          {
            "id": 1,
            "path": "/console",
            "component": "",
            "name": "console",
            "title": "後台管理",
            "icon": "el-icon-help",
            "description": "",
            "view": false,
            "edit": false,
            "delete": false,
            "lastupdateUser": "rd7",
            "lastUpdateTime": "2020-12-09 15:59:02",
            "def1":false,
            "defLabel1":"", 
            "def2":false,
            "defLabel2":"",
            "children": [
              {
                "Type": 0,
                "id": 18,
                "parentId": 1,
                "path": "/route",
                "component": "/route/index",
                "name": "Route",
                "title": "功能管理",
                "icon": "",
                "description": "新增或刪除功能",
                "view": true,
                "edit": true,
                "delete": true,
                "sequence": 0,
                "delflag": false,
                "createUser": "",
                "lastUpdateTime": "2020-11-03 10:16:51",
                "lastupdateUser": "sera003",
                "def1":false,
                "defLabel1":"", 
                "def2":false,
                "defLabel2":"",
                "permission": {
                  "permissionView": false,
                  "permissionEdit": false,
                  "permissionDelete": false,
                  "permissionDef1":false,
                  "permissionDef2":false,
                }
              },
              {
                "Type": 0,
                "id": 3,
                "parentId": 1,
                "path": "/user",
                "component": "/user/index",
                "name": "User",
                "title": "帳號維護",
                "icon": "",
                "description": "管理後台使用者帳號",
                "view": true,
                "edit": true,
                "delete": false,
                "sequence": 0,
                "delflag": false,
                "createUser": "",
                "lastUpdateTime": "2020-11-03 09:46:18",
                "lastupdateUser": "sera003",
                "def1":false,
                "defLabel1":"", 
                "def2":false,
                "defLabel2":"",
                "permission": {
                  "permissionView": false,
                  "permissionEdit": false,
                  "permissionDelete": false,
                  "permissionDef1":false,
                  "permissionDef2":false,
                }
              },
              {
                "Type": 0,
                "id": 2,
                "parentId": 1,
                "path": "/role",
                "component": "/role/index",
                "name": "Role",
                "title": "角色管理",
                "icon": "",
                "description": "管理各角色之權限",
                "view": true,
                "edit": true,
                "delete": true,
                "sequence": 0,
                "delflag": false,
                "createUser": "",
                "lastUpdateTime": "2020-10-26 16:01:11",
                "lastupdateUser": "sera003",
                "def1":false,
                "defLabel1":"", 
                "def2":false,
                "defLabel2":"",
                "permission": {
                  "permissionView": false,
                  "permissionEdit": false,
                  "permissionDelete": false,
                  "permissionDef1":false,
                  "permissionDef2":false,
                },
                
              },
              

            ]
          },
          {
            "id": 100,
            "parentId": 0,
            "name": "web",
            "component": "",
            "path": "/web",
            "title": "網站管理",
            "icon": "el-icon-help",
            "description": "",
            "view": false,
            "edit": false,
            "delete": false,
            "domain": "00",
            "sequence": 1,
            "createDate": "",
            "lastUpdateTime": "2020-12-09 15:59:02",
            "def1":false,
            "defLabel1":"", 
            "def2":false,
            "defLabel2":"",
            "children":[
              
              {
                "id": 7,
                "parentId": 100,
                "path": "/video/vender",
                "component": "/video/vender",
                "name": "vender",
                "title": "廠商管理",
                "icon": "",
                "description": "",
                "view": true,
                "edit": true,
                "delete": true,
                "domain": "00",
                "sequence": 1,
                "createDate": "",
                "lastUpdateTime": "2020-10-29 17:28:52",
                "permissionDef1":true,
                "permissionDef_1_label":"", 
                "permissionDef2":true,
                "permissionDef_2_label":""
              },

              {
                "Type": 0,
                "id": 87,
                "parentId": 4,
                "path": "/video/api_space_domain",
                "component": "/video/api_space_domain",
                "name": "api_space_domain",
                "title": "Api空間域名",
                "icon": "",
                "description": "",
                "view": true,
                "edit": true,
                "delete": true,
                "sequence": 3,
                "delflag": false,
                "createUser": "Kiva",
                "lastUpdateTime": "2020-10-23 14:30:20",
                "lastupdateUser": "Kiva",
                "def1":false,
                "defLabel1":"", 
                "def2":false,
                "defLabel2":"",
                "permission": {
                  "permissionView": true,
                  "permissionEdit": true,
                  "permissionDelete": true,
                  "permissionDef1":false,
                  "permissionDef2":false,
                }
              },

            ]
          },
          {
            "id": 4,
            "path": "/video",
            "component": "",
            "name": "video",
            "title": "影片管理",
            "icon": "el-icon-folder-checked",
            "description": "",
            "view": false,
            "edit": false,
            "delete": false,
            "lastupdateUser": "sera003",
            "lastUpdateTime": "2020-11-03 16:21:41",
            "def1":false,
            "defLabel1":"", 
            "def2":false,
            "defLabel2":"",
            "children": [
              {
                "Type": 0,
                "id": 10,
                "parentId": 4,
                "path": "/video/tag-topics",
                "component": "/video/tag-topics",
                "name": "tag-topics",
                "title": "標籤分類",
                "icon": "",
                "description": "",
                "view": true,
                "edit": true,
                "delete": true,
                "sequence": 1,
                "delflag": false,
                "createUser": "",
                "lastUpdateTime": "2020-11-24 12:51:20",
                "lastupdateUser": "sera003",
                "def1":false,
                "defLabel1":"", 
                "def2":false,
                "defLabel2":"",
                "permission": {
                  "permissionView": true,
                  "permissionEdit": true,
                  "permissionDelete": true,
                  "permissionDef1":false,
                  "permissionDef2":false,
                }
              },
              {
                "Type": 0,
                "id": 6,
                "parentId": 4,
                "path": "/video/sort",
                "component": "/video/sort",
                "name": "sort",
                "title": "視頻分類",
                "icon": "",
                "description": "",
                "view": true,
                "edit": true,
                "delete": true,
                "sequence": 0,
                "delflag": false,
                "createUser": "",
                "lastUpdateTime": "2020-11-24 12:51:20",
                "lastupdateUser": "sera003",
                "def1":false,
                "defLabel1":"", 
                "def2":false,
                "defLabel2":"",
                "permission": {
                  "permissionView": false,
                  "permissionEdit": false,
                  "permissionDelete": false,
                  "permissionDef1":false,
                  "permissionDef2":false,
                }
              },
              {
                "Type": 0,
                "id": 19,
                "parentId": 4,
                "path": "/video/tags",
                "component": "/video/tags",
                "name": "tags",
                "title": "視頻標籤",
                "icon": "",
                "description": "",
                "view": true,
                "edit": true,
                "delete": true,
                "sequence": 2,
                "delflag": false,
                "createUser": "",
                "lastUpdateTime": "2020-11-03 15:49:22",
                "lastupdateUser": "sera003",
                "def1":false,
                "defLabel1":"", 
                "def2":false,
                "defLabel2":"",
                "permission": {
                  "permissionView": false,
                  "permissionEdit": false,
                  "permissionDelete": false,
                  "permissionDef1":false,
                  "permissionDef2":false,
                }
              },
              {
                "Type": 0,
                "id": 24,
                "parentId": 4,
                "path": "/video/owner",
                "component": "/video/owner",
                "name": "owner",
                "title": "視頻作者",
                "icon": "",
                "description": "",
                "view": true,
                "edit": true,
                "delete": true,
                "sequence": 0,
                "delflag": false,
                "createUser": "",
                "lastUpdateTime": "2020-11-03 16:12:56",
                "lastupdateUser": "sera003",
                "def1":false,
                "defLabel1":"", 
                "def2":false,
                "defLabel2":"",
                "permission": {
                  "permissionView": true,
                  "permissionEdit": true,
                  "permissionDelete": true,
                  "permissionDef1":false,
                  "permissionDef2":false,
                }
              },
              {
                "Type": 0,
                "id": 54,
                "parentId": 4,
                "path": "/video/video-list",
                "component": "/video/video-list",
                "name": "video-list",
                "title": "視頻列表",
                "icon": "",
                "description": "",
                "view": true,
                "edit": true,
                "delete": true,
                "sequence": 9,
                "delflag": false,
                "createUser": "",
                "lastUpdateTime": "2020-10-23 14:30:20",
                "lastupdateUser": "sera003",
                "def1":true,
                "defLabel1":"影片上傳", 
                "def2":true,
                "defLabel2":"狀態管理",
                "permission": {
                  "permissionView": false,
                  "permissionEdit": false,
                  "permissionDelete": false,
                  "permissionDef1":false,
                  "permissionDef2":false,
                }
              },
              {
                "Type": 0,
                "id": 101,
                "parentId": 4,
                "path": "/video/video-manger",
                "component": "/video/video-manger",
                "name": "video-manger",
                "title": "視頻選擇",
                "icon": "",
                "description": "",
                "view": true,
                "edit": true,
                "delete": false,
                "sequence": 9,
                "delflag": false,
                "createUser": "",
                "lastUpdateTime": "2020-10-23 14:30:20",
                "lastupdateUser": "sera003",
                "def1":false,
                "defLabel1":"", 
                "def2":false,
                "defLabel2":"",
                "permission": {
                  "permissionView": false,
                  "permissionEdit": false,
                  "permissionDelete": false,
                  "permissionDef1":false,
                  "permissionDef2":false,
                }
              },
            ]
          },
          {
            "id": 8,
            "path": "/cdn",
            "component": "",
            "name": "CDN",
            "title": "CDN管理",
            "icon": "eye-open",
            "description": "",
            "view": false,
            "edit": false,
            "delete": false,
            "lastupdateUser": "sera003",
            "lastUpdateTime": "2020-11-03 16:14:02",
            "def1":false,
            "defLabel1":"", 
            "def2":false,
            "defLabel2":"",
            "children": [
              
              {
                "Type": 0,
                "id": 7,
                "parentId": 8,
                "path": "/video/vendor-cdn",
                "component": "/video/vendor-cdn",
                "name": "vendor-cdn",
                "title": "廠商CDN",
                "icon": "",
                "description": "",
                "view": true,
                "edit": true,
                "delete": true,
                "sequence": 0,
                "delflag": false,
                "createUser": "",
                "lastUpdateTime": "2020-08-10 11:40:50",
                "lastupdateUser": "",
                "def1":false,
                "defLabel1":"", 
                "def2":false,
                "defLabel2":"",
                "permission": {
                  "permissionView": false,
                  "permissionEdit": false,
                  "permissionDelete": false,
                  "permissionDef1":false,
                  "permissionDef2":false,
                }
              }
            ]
          }
        ]
      }
    }
  },
  {
    url: '/mock-api/System/role',
    type: 'post',
    response: config => {
      return {
        "status": "000",
        "errorCode": "00",
        "version": "",
        "data": [
          {
            "Type": 0,
            "roleId": 24,
            "name": "test",
            "description": "test",
            "domain": "",
            "lastupdateUser": "sera003",
            "delflag": false,
            "routes": [
              {
                "Type": 0,
                "id": 18,
                "parentId": 0,
                "path": "/route",
                "component": "/route/index",
                "name": "Route",
                "title": "功能管理",
                "icon": "",
                "description": "",
                "view": false,
                "edit": false,
                "delete": false,
                "sequence": 0,
                "delflag": false,
                "createUser": "",
                "lastUpdateTime": "",
                "lastupdateUser": "",
                "def1":false,
                "defLabel1":"", 
                "def2":false,
                "defLabel2":"",
                "permission": {
                  "permissionView": true,
                  "permissionEdit": true,
                  "permissionDelete": true,
                  "permissionDef1":false,
                  "permissionDef2":false,
                }
              },
              {
                "Type": 0,
                "id": 87,
                "parentId": 4,
                "path": "/video/api_space_domain",
                "component": "/video/api_space_domain",
                "name": "api_space_domain",
                "title": "Api空間域名",
                "icon": "",
                "description": "",
                "view": true,
                "edit": true,
                "delete": true,
                "sequence": 3,
                "delflag": false,
                "createUser": "Kiva",
                "lastUpdateTime": "2020-10-23 14:30:20",
                "lastupdateUser": "Kiva",
                "def1":false,
                "defLabel1":"", 
                "def2":false,
                "defLabel2":"",
                "permission": {
                  "permissionView": true,
                  "permissionEdit": true,
                  "permissionDelete": true,
                  "permissionDef1":false,
                  "permissionDef2":false,
                }
              },
              {
                "Type": 0,
                "id": 2,
                "parentId": 0,
                "path": "/role",
                "component": "/role/index",
                "name": "Role",
                "title": "角色管理",
                "icon": "",
                "description": "",
                "view": false,
                "edit": false,
                "delete": false,
                "sequence": 0,
                "delflag": false,
                "createUser": "",
                "lastUpdateTime": "",
                "lastupdateUser": "",
                "def1":false,
                "defLabel1":"", 
                "def2":false,
                "defLabel2":"",
                "permission": {
                  "permissionView": true,
                  "permissionEdit": true,
                  "permissionDelete": true,
                  "permissionDef1":false,
                  "permissionDef2":false,
                }
              },
              {
                "Type": 0,
                "id": 99,
                "parentId": 1,
                "name": "vendor",
                "component": "/vendor/index",
                "path": "/vendor",
                "title": "廠商管理",
                "icon": "",
                "description": "管理廠商列表",
                "view": true,
                "edit": true,
                "delete": true,
                "sequence": 0,
                "delflag": false,
                "createUser": "",
                "lastUpdateTime": "2020-10-26 16:01:11",
                "lastupdateUser": "sera003",
                "def1":false,
                "defLabel1":"", 
                "def2":false,
                "defLabel2":"",
                "permission": {
                  "permissionView": false,
                  "permissionEdit": false,
                  "permissionDelete": false,
                  "permissionDef1":false,
                  "permissionDef2":false,
                }
              },
              {
                "Type": 0,
                "id": 3,
                "parentId": 0,
                "path": "/user",
                "component": "/user/index",
                "name": "User",
                "title": "帳號維護",
                "icon": "",
                "description": "",
                "view": false,
                "edit": false,
                "delete": false,
                "sequence": 0,
                "delflag": false,
                "createUser": "",
                "lastUpdateTime": "",
                "lastupdateUser": "",
                "def1":false,
                "defLabel1":"", 
                "def2":false,
                "defLabel2":"",
                "permission": {
                  "permissionView": true,
                  "permissionEdit": true,
                  "permissionDelete": false,
                  "permissionDef1":false,
                  "permissionDef2":false,
                }
              },
              {
                "Type": 0,
                "id": 5,
                "parentId": 4,
                "path": "/web/sites",
                "component": "/web/sites",
                "name": "sites",
                "title": "視頻站点",
                "icon": "",
                "description": "",
                "view": true,
                "edit": true,
                "delete": true,
                "sequence": 0,
                "delflag": false,
                "createUser": "",
                "lastUpdateTime": "2020-10-29 17:28:52",
                "lastupdateUser": "sera003",
                "def1":true,
                "defLabel1":"", 
                "def2":true,
                "defLabel2":"",
                "permission": {
                  "permissionView": true,
                  "permissionEdit": true,
                  "permissionDelete": true,
                  "permissionDef1":false,
                  "permissionDef2":false,
                }
              },
              {
                "Type": 0,
                "id": 6,
                "parentId": 4,
                "path": "/video/sort",
                "component": "/video/sort",
                "name": "sort",
                "title": "視頻分類",
                "icon": "",
                "description": "",
                "view": true,
                "edit": true,
                "delete": true,
                "sequence": 0,
                "delflag": false,
                "createUser": "",
                "lastUpdateTime": "2020-11-24 12:51:20",
                "lastupdateUser": "sera003",
                "def1":false,
                "defLabel1":"", 
                "def2":false,
                "defLabel2":"",
                "permission": {
                  "permissionView": true,
                  "permissionEdit": true,
                  "permissionDelete": true,
                  "permissionDef1":false,
                  "permissionDef2":false,
                }
              },
              {
                "Type": 0,
                "id": 7,
                "parentId": 4,
                "path": "/video/vender",
                "component": "/video/vender",
                "name": "vender",
                "title": "廠商管理",
                "icon": "",
                "description": "",
                "view": true,
                "edit": true,
                "delete": true,
                "sequence": 0,
                "delflag": false,
                "createUser": "",
                "lastUpdateTime": "2020-11-24 12:51:20",
                "lastupdateUser": "sera003",
                "def1":false,
                "defLabel1":"", 
                "def2":false,
                "defLabel2":"",
                "permission": {
                  "permissionView": true,
                  "permissionEdit": true,
                  "permissionDelete": true,
                  "permissionDef1":false,
                  "permissionDef2":false,
                }
              },
              {
                "Type": 0,
                "id": 10,
                "parentId": 4,
                "path": "/video/tag-topics",
                "component": "/video/tag-topics",
                "name": "tag-topics",
                "title": "標籤分類",
                "icon": "",
                "description": "",
                "view": true,
                "edit": true,
                "delete": true,
                "sequence": 0,
                "delflag": false,
                "createUser": "",
                "lastUpdateTime": "2020-11-03 15:49:22",
                "lastupdateUser": "sera003",
                "def1":false,
                "defLabel1":"", 
                "def2":false,
                "defLabel2":"",
                "permission": {
                  "permissionView": true,
                  "permissionEdit": true,
                  "permissionDelete": true,
                  "permissionDef1":false,
                  "permissionDef2":false,
                }
              },
              {
                "Type": 0,
                "id": 19,
                "parentId": 4,
                "path": "/video/tags",
                "component": "/video/tags",
                "name": "tags",
                "title": "視頻標籤",
                "icon": "",
                "description": "",
                "view": true,
                "edit": true,
                "delete": true,
                "sequence": 0,
                "delflag": false,
                "createUser": "",
                "lastUpdateTime": "2020-11-03 15:49:22",
                "lastupdateUser": "sera003",
                "def1":false,
                "defLabel1":"", 
                "def2":false,
                "defLabel2":"",
                "permission": {
                  "permissionView": true,
                  "permissionEdit": true,
                  "permissionDelete": true,
                  "permissionDef1":false,
                  "permissionDef2":false,
                }
              },
              {
                "Type": 0,
                "id": 24,
                "parentId": 4,
                "path": "/video/owner",
                "component": "/video/owner",
                "name": "owner",
                "title": "視頻作者",
                "icon": "",
                "description": "",
                "view": true,
                "edit": true,
                "delete": true,
                "sequence": 0,
                "delflag": false,
                "createUser": "",
                "lastUpdateTime": "2020-11-03 16:12:56",
                "lastupdateUser": "sera003",
                "def1":false,
                "defLabel1":"", 
                "def2":false,
                "defLabel2":"",
                "permission": {
                  "permissionView": true,
                  "permissionEdit": true,
                  "permissionDelete": true,
                  "permissionDef1":false,
                  "permissionDef2":false,
                }
              },
              {
                "Type": 0,
                "id": 54,
                "parentId": 4,
                "path": "/video/video-list",
                "component": "/video/video-list",
                "name": "video-list",
                "title": "視頻列表",
                "icon": "",
                "description": "",
                "view": true,
                "edit": true,
                "delete": true,
                "sequence": 0,
                "delflag": false,
                "createUser": "",
                "lastUpdateTime": "2020-10-23 14:30:20",
                "lastupdateUser": "sera003",
                "def1":true,
                "defLabel1":"", 
                "def2":true,
                "defLabel2":"",
                "permission": {
                  "permissionView": true,
                  "permissionEdit": true,
                  "permissionDelete": true,
                  "permissionDef1":true,
                  "permissionDef2":false,
                }
              },
              {
                "Type": 0,
                "id": 101,
                "parentId": 4,
                "path": "/video/video-manger",
                "component": "/video/video-manger",
                "name": "video-manger",
                "title": "視頻選擇",
                "icon": "",
                "description": "",
                "view": true,
                "edit": true,
                "delete": false,
                "sequence": 9,
                "delflag": false,
                "createUser": "",
                "lastUpdateTime": "2020-10-23 14:30:20",
                "lastupdateUser": "sera003",
                "def1":false,
                "defLabel1":"", 
                "def2":false,
                "defLabel2":"",
                "permission": {
                  "permissionView": true,
                  "permissionEdit": true,
                  "permissionDelete": true,
                  "permissionDef1":false,
                  "permissionDef2":false,
                }
              },
              {
                "Type": 0,
                "id": 7,
                "parentId": 8,
                "path": "/video/vendor-cdn",
                "component": "/video/vendor-cdn",
                "name": "vendor-cdn",
                "title": "廠商CDN",
                "icon": "",
                "description": "",
                "view": true,
                "edit": true,
                "delete": true,
                "sequence": 0,
                "delflag": false,
                "createUser": "",
                "lastUpdateTime": "2020-08-10 11:40:50",
                "lastupdateUser": "",
                "def1":false,
                "defLabel1":"", 
                "def2":false,
                "defLabel2":"",
                "permission": {
                  "permissionView": true,
                  "permissionEdit": true,
                  "permissionDelete": true,
                  "permissionDef1":false,
                  "permissionDef2":false,
                }
              }
            ]
          }
        ]
      }
    }
  },

]