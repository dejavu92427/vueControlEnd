module.exports = [
  {
    url: '/mock-api/Web/space',
    type: 'get',
    response: config => {

      return {
        "status": "000",
        "errorCode": "00",
        "version": "",
        "data": [
          {
            "id": 1,
            "space_name": "鴨脖",
            "is_enable": 0,
            "image_space_domain": "https://cdn-image-video.divoma.com",
            "video_space_domain": "https://iroir.com",
            "api_space_domain": null,
            "space_domain_from": 0,
            "xhr_space_domain": null,
            "xhr_credentials": 0,
            "tag": "",
            "used_out": "BLOB",
            "watermarkUpload": 0,
            "delflag": false,
            "createDate": "2020-10-29 17:28:52",
            "createUser": "",
            "lastUpdateTime": "2020-10-29 17:28:52",
            "lastupdateUser": "sera003"
          },
          {
            "id": 2,
            "space_name": "女女",
            "is_enable": 0,
            "image_space_domain": "http://image.hannlin.com",
            "video_space_domain": "https://dianxinwuliu.com",
            "api_space_domain": null,
            "space_domain_from": 0,
            "xhr_space_domain": null,
            "xhr_credentials": 0,
            "tag": "",
            "used_out": "BLOB",
            "watermarkUpload": 0,
            "delflag": false,
            "createDate": "2020-10-29 17:28:52",
            "createUser": "",
            "lastUpdateTime": "2020-10-29 17:28:52",
            "lastupdateUser": "sera003"
          },
          {
            "id": 3,
            "space_name": "小豬",
            "is_enable": 1,
            "image_space_domain": "https://api.pv123.app",
            "video_space_domain": "https://pv-oa-baidu.lipin580.com",
            "api_space_domain": "https://api.pv123.app",
            "space_domain_from": 1,
            "xhr_space_domain": "https://api.pv123.app",
            "xhr_credentials": 1,
            "tag": "",
            "used_out": "BLOB",
            "watermarkUpload": 0,
            "delflag": false,
            "createDate": "2020-10-29 17:28:52",
            "createUser": "",
            "lastUpdateTime": "2020-10-29 17:28:52",
            "lastupdateUser": "sera003"
          },
          {
            "id": 4,
            "space_name": "男男",
            "is_enable": 0,
            "image_space_domain": "https://rengiala.com",
            "video_space_domain": "https://rengiala.com",
            "api_space_domain": "https://cdxxx.app",
            "space_domain_from": 1,
            "xhr_space_domain": null,
            "xhr_credentials": 0,
            "tag": "",
            "used_out": "BLOB",
            "watermarkUpload": 0,
            "delflag": false,
            "createDate": "2020-10-29 17:28:52",
            "createUser": "",
            "lastUpdateTime": "2020-10-29 17:28:52",
            "lastupdateUser": "sera003"
          }
        ]
      }

    }
  },
  {
    url: '/mock-api/Web/space',
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
]