module.exports = [
    {
        url: '/mock-api/Code/codeList/country',
        type: 'get',
        response: config => {

            return {
                "status": "000",
                "errorCode": "00",
                "version": "",
                "data": [
                    {
                        "code": "CHN",
                        "desc": "中國",
                        "createTime": "2020-10-29 17:28:52",
                        "createUser": "",
                        "lastUpdateTime": "2020-10-29 17:28:52",
                        "lastupdateUser": "sera003"
                    },
                    {
                        "code": "TW",
                        "desc": "中國台灣",
                        "createTime": "2020-10-29 17:28:52",
                        "createUser": "",
                        "lastUpdateTime": "2020-10-29 17:28:52",
                        "lastupdateUser": "sera003"
                    },
                    {
                        "code": "JP",
                        "desc": "日本",
                        "createTime": "2020-10-29 17:28:52",
                        "createUser": "",
                        "lastUpdateTime": "2020-10-29 17:28:52",
                        "lastupdateUser": "sera003"
                    },

                ]
            }
        }
    }
]