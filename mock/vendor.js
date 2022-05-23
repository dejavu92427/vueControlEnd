module.exports = [
    {
      url: '/mock-api/Video/vendor',
      type: 'get',
      response: config => {
  
        return {
          "status": "000",
          "errorCode": "00",
          "version": "",
          "data": [
            {
              "id": 1,
              "name": "999",
              "createTime": "2020-11-03 10:16:51",
              "createUser": "",
              "lastUpdateTime": "2020-11-03 10:16:51",
              "lastupdateUser": "sera003"
            },
            {
              "id": 2,
              "site_name": "絲瓜",
              "createTime": "2020-11-03 10:16:51",
              "createUser": "",
              "lastUpdateTime": "2020-11-03 10:16:51",
              "lastupdateUser": "sera003"
            },
            {
                "id": 3,
                "site_name": "億元",
                "createTime": "2020-11-03 10:16:51",
                "createUser": "",
                "lastUpdateTime": "2020-11-03 10:16:51",
                "lastupdateUser": "sera003"
              },
          ]
        }
  
      }
    }
  ]