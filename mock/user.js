const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

module.exports = [
  // user login
  {
    url: '/mock-api/System/yaboConsolerUser/login/sera003/sera003',
    type: 'get',
    response: config => {

      return {
        "status": "000",
        "errorCode": "00",
        "version": "",
        "data": true
      }

    }
  },

  // get user info
  {
    url: '/mock-api/System/yaboConsolerUsers/sera003',
    type: 'get',
    response: config => {
      return {
        "status": "000",
        "errorCode": "00",
        "version": "",
        "data": [
          {
            "id": 18,
            "account": "sera003",
            "userName": "sera003",
            "pwd": "sera003",
            "role": "test",
            "auth": "",
            "vendors":[1,3],
            "createDate": "2020-12-10 16:24:10",
            "createUser": "test1",
            "lastUpdateTime": "2020-12-10 16:24:10",
            "lastUpdateUser": "test1",
            "lastloginTime": "2020-12-10 16:24:10",
            "isEnable": true,
            "domain": 500015,
            "roleId": 24,
            "space_id":9
          }
        ]
      }

    }
  },

  {
    url: '/mock-api/System/yaboConsolerUsers',
    type: 'get',
    response: config => {
      return {
        "status": "000",
        "errorCode": "00",
        "version": "",
        "data": [
          {
            "id": 18,
            "account": "sera003",
            "userName": "test003",
            "pwd": "sera003",
            "role": "test",
            "auth": "",
            "vendors":[1,3],
            "createDate": "2020-12-10 16:24:10",
            "createUser": "test1",
            "lastUpdateTime": "2020-12-10 16:24:10",
            "lastUpdateUser": "test1",
            "lastloginTime": "2020-12-10 16:24:10",
            "isEnable": true,
            "domain": 500015,
            "roleId": 24
          }
        ]
      }

    }
  },

  // user logout
  {
    url: '/mock-api/System/yaboConsolerUser',
    type: 'put',
    response: config => {
      return {
        "status": "000",
        "errorCode": "00",
        "version": "",
        "data": null
      }
    }
  },

  {
    url: '/mock-api/User/whiteList',
    type: 'get',
    response: config => {
      return {
        status: "000",
        errorCode: "00",
        version: "",
        data: [
          {
            id: 1,
            ipAddress: "111.222.333.444",
            isEnable: true,
            memo: "test2",
            lastUpdateTime: "2020-09-14 19:15:29",
            lastUpdateUser: "Kiva",
            createTime: "2020-10-29 17:28:52",
            createUser: "",
          },
          {
            id: 2,
            ipAddress: "333.222.333.444",
            isEnable: false,
            memo: "test33",
            lastUpdateTime: "2020-09-14 19:15:29",
            lastUpdateUser: "Kiva",
            createTime: "2020-10-29 17:28:52",
            createUser: "",
          },
        ]
      }
    }
  },
]
