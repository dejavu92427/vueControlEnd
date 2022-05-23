module.exports = [
  {
    url: '/mock-api/Video/video_sites',
    type: 'get',
    response: config => {

      return {
        "status": "000",
        "errorCode": "00",
        "version": "",
        "data": [
          {
            "id": 1,
            "site_name": "鴨脖",
            "remark": "鴨脖說明",
            "createTime": "2020-11-03 10:16:51",
            "createUser": "",
            "lastUpdateTime": "2020-11-03 10:16:51",
            "lastupdateUser": "sera003"
          },
          {
            "id": 2,
            "site_name": "小豬",
            "remark": "小豬說明",
            "createTime": "2020-11-03 10:16:51",
            "createUser": "",
            "lastUpdateTime": "2020-11-03 10:16:51",
            "lastupdateUser": "sera003"
          },
        ]
      }

    }
  },
  {
    url: '/mock-api/Video/video_sites',
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
    url: '/mock-api/Video/tag_topics',
    type: 'get',
    response: config => {

      return {
        "status": "000",
        "errorCode": "00",
        "version": "",
        "data": [
          {
            "id": 1,
            "topic": "姿势",
            "createTime": "2020-11-03 10:16:51",
            "createUser": "",
            "lastUpdateTime": "2020-11-03 10:16:51",
            "lastupdateUser": "sera003"
          },
          {
            "id": 2,
            "topic": "行为",
            "createTime": "2020-11-03 10:16:51",
            "createUser": "",
            "lastUpdateTime": "2020-11-03 10:16:51",
            "lastupdateUser": "sera003"
          },
        ]
      }

    }
  },
  {
    url: '/mock-api/Video/tag_topics',
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
    url: '/mock-api/Video/video_tags',
    type: 'post',
    response: config => {
      return {
        "status": "000",
        "errorCode": "00",
        "version": "",
        "totalCount": 2,
        "data": [
          {
            "id": 1,
            "title": "痴汉",
            "is_recommand": 0,
            "topic": 2,
            "seat": 1,
            "isEnableCount": "10",
            "videoCount": "100",
            "createTime": "2020-11-03 10:16:51",
            "createUser": "sera003",
            "lastUpdateTime": "2020-11-03 10:16:51",
            "lastupdateUser": "sera003"
          },
          {
            "id": 2,
            "title": "无码",
            "is_recommand": 1,
            "topic": 1,
            "seat": 2,
            "isEnableCount": "13",
            "videoCount": "103",
            "createTime": "2020-11-03 10:16:51",
            "createUser": "sera003",
            "lastUpdateTime": "2020-11-03 10:16:51",
            "lastupdateUser": "sera003"
          },
        ]
      }
    }
  },
  {
    url: '/mock-api/Video/video_tags',
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
    url: '/mock-api/Video/video_all_tags',
    type: 'get',
    response: config => {
      return {
        "status": "000",
        "errorCode": "00",
        "version": "",
        "data": [
          {
            "id": 1,
            "title": "痴汉"
          },
          {
            "id": 2,
            "title": "无码"
          },
        ]
      }
    }
  },
  {
    url: '/mock-api/Video/video_sorts',
    type: 'post',
    response: config => {
      return {
        "status": "000",
        "errorCode": "00",
        "version": "",
        "data": [
          {
            "id": 1,
            "title": "精品無碼",
            "space_id": 9,
            "desc": "想要的都在這裡",
            "is_show": 0,
            "seat": 2,
            "isEnableCount": "1016",
            "videoCount": "1551",
            "createDate": "2020-02-16 21:42:27",
            "createUser": "Kiva",
            "lastUpdateTime": "2020-08-21 10:43:09",
            "lastupdateUser": "Kiva",
          },
          {
            "id": 4,
            "title": "角色扮演",
            "space_id": 3,
            "desc": "無水印無廣告！",
            "is_show": 1,
            "seat": 10,
            "isEnableCount": "480",
            "videoCount": "616",
            "createDate": "2020-02-16 21:42:27",
            "createUser": "Kiva",
            "lastUpdateTime": "2020-08-21 10:43:09",
            "lastupdateUser": "Kiva",
          },
        ]
      }
    }
  },
  {
    url: '/mock-api/Video/video_sorts',
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
    url: '/mock-api/Video/videos',
    type: 'post',
    response: config => {
      return {
        "status": "000",
        "errorCode": "00",
        "version": "",
        "data": [
          {
            "id": 28719,
            "title": [
              {
                language: "zh-cn", title: "【无码】白衣天使变成肉便器-终极母奴隶成宫琉璃DSAMBD", desc: "【无码】白衣天使变成肉便器-终极母奴隶成宫琉璃DSAMBD"
              },
              {
                language: "vi", title: "[Không kiểm duyệt] Thiên thần trắng trở thành nhà vệ sinh lấy thịt-Người mẹ nô lệ cuối cùng Cheng Gong Liuli DSAMBD", desc: "[Không kiểm duyệt] Thiên thần trắng trở thành nhà vệ sinh lấy thịt-Người mẹ nô lệ cuối cùng Cheng Gong Liuli DSAMBD"
              },
            ],

            "artist": 1,
            "code": "DSAMBD-06",
            "video_file_name": "【无码】白衣天使变成肉便器-终极母奴隶- 成宫琉璃.DSAMBD-06",
            "url_new": "http://192.168.136.135/videos/source/28719/video/28719.mp4",
            "desc": "【无码】白衣天使变成肉便器-终极母奴隶成宫琉璃DSAMBD-06",
            "image_new": "http://192.168.136.135/videos/source/28719/image/28719.png",
            "sort": 1,
            "tag": "无码,多P,美女,护士,美臀,69体位,肉便器",
            "views": 39144,
            "zans": 58732,
            "vip_only": 1,
            "is_recommend": 0,
            "space_id": 9,
            "is_enable": 1,
            "createTime": "2020-02-21 00:47:33",
            "createUser": "Kiva",
            "lastUpdateTime": "2020-08-11 10:12:48",
            "lastUpdateUser": "Kiva",
            "videoUpLoad": 1,
            "imageUpLoad": 1,
            "imageKey": "7d601ac3a28c11a2d2c29bc4c8a15187",
            "imageIV": "425650bcff8d67705efd3de34dc37635",
          },
          {
            "id": 28748,
            "title": [
              { language: "vi", title: "[Không kiểm duyệt] Bản phát hành đầu tiên của lệnh cấm đối với Haruka Uchiyama (Ayase Mito) SMBD", desc: "【无码】中出初解禁内山遥（绫濑美都）SMBD" },
            ],
            "artist": 2,
            "code": "SMBD-02",
            "video_file_name": "【无码】中出初解禁内山遥（绫濑美都）SMBD-02",
            "url_new": "http://192.168.136.135/videos/source/28748/video/28748.mp4",
            "desc": "【无码】中出初解禁内山遥（绫濑美都）SMBD-02",
            "image_new": "http://192.168.136.135/videos/source/28748/image/28748.jpg",
            "sort": 1,
            "tag": "无码,多P,潮吹,解禁",
            "views": 57556,
            "zans": 58392,
            "vip_only": 1,
            "is_recommend": 1,
            "space_id": 3,
            "is_enable": 0,
            "createTime": "2020-02-21 00:47:33",
            "createUser": "Kiva",
            "lastUpdateTime": "2020-08-11 10:12:48",
            "lastUpdateUser": "Kiva",
            "videoUpLoad": 0,
            "imageUpLoad": 1,
            "imageKey": "1919e100e0240cbe92f4c7db5419eebd",
            "imageIV": "7a621a0f15b1c1afd486e7c35a792c6b",
          },
          {
            "id": 28840,
            "title": [
              { language: "zh-cn", title: "【中文】屈服的兔女郎绝望的伊拉玛奇奥·轮·中出地狱！望月米雪PRTD-025", desc: "【中文】屈服的兔女郎绝望的伊拉玛奇奥·轮·中出地狱！望月米雪PRTD-025" },
            ],
            "artist": 3,
            "code": "PRTD-025",
            "video_file_name": "【中文】屈服的兔女郎绝望的伊拉玛奇奥·轮·中出地狱！望月米雪PRTD-025",
            "url_new": "http://192.168.136.135/videos/source/28840/video/28840.mp4",
            "desc": "【中文】屈服的兔女郎绝望的伊拉玛奇奥·轮·中出地狱！望月米雪PRTD-025",
            "image_new": "http://192.168.136.135/videos/source/28840/image/28840.png",
            "sort": 4,
            "tag": "多P,中出,美少女,轮奸,白虎,肉便器",
            "views": 89328,
            "zans": 85940,
            "vip_only": 0,
            "is_recommend": 0,
            "space_id": 9,
            "is_enable": 1,
            "createTime": "2020-02-21 00:47:33",
            "createUser": "Kiva",
            "lastUpdateTime": "2020-08-11 10:12:48",
            "lastUpdateUser": "Kiva",
            "videoUpLoad": 1,
            "imageUpLoad": 0,
            "imageKey": "8748f9d11143fbe81c9c5e64d1641d02",
            "imageIV": "49aab8795d84006dfe91dabe0c773283",
          },
          {
            "id": 29119,
            "title": [
              { language: "zh-cn", title: "【中文】多角色扮演波多野结衣SUPD-122", desc: "【中文】多角色扮演波多野结衣SUPD-122" },
              { language: "vi", title: "【中文】多角色扮演波多野结衣SUPD-122", desc: "【中文】多角色扮演波多野结衣SUPD-122" },
            ],
            "artist": 4,
            "code": "SUPD-122",
            "video_file_name": "[中文]多角色扮演波多野结衣SUPD-122",
            "url_new": "http://192.168.136.135/videos/source/29119/video/29119.mp4",
            "desc": "【中文】多角色扮演波多野结衣SUPD-122",
            "image_new": "http://192.168.136.135/videos/source/29119/image/29119.png",
            "sort": 4,
            "tag": "多P,美女,颜射,足交,巨乳",
            "views": 32690,
            "zans": 68693,
            "vip_only": 0,
            "is_recommend": 1,
            "space_id": 9,
            "is_enable": 1,
            "createTime": "2020-02-21 00:47:33",
            "createUser": "Kiva",
            "lastUpdateTime": "2020-08-11 10:12:48",
            "lastUpdateUser": "Kiva",
            "videoUpLoad": 1,
            "imageUpLoad": 1,
            "imageKey": "a3255165af21e1d0ee26b3ea784e724e",
            "imageIV": "59e261c610d95c5e86d5d3c2453ae8de",
          },
          {
            "id": 29373,
            "title": [
              { language: "vi", title: "【中文】肏翻24小时过火痴女仆性服务波多野结衣PGD-833", desc: "【中文】肏翻24小时过火痴女仆性服务波多野结衣PGD-833" },
            ],
            "artist": 5,
            "code": "PGD-833",
            "video_file_name": "【中文】肏翻24小时过火痴女仆性服务波多野结衣PGD-833",
            "url_new": "http://192.168.136.135/videos/source/29373/video/29373.mp4",
            "desc": "【中文】肏翻24小时过火痴女仆性服务波多野结衣PGD-833",
            "image_new": "http://192.168.136.135/videos/source/29373/image/29373.png",
            "sort": 4,
            "tag": "美乳,巨乳",
            "views": 29071,
            "zans": 199328,
            "vip_only": 0,
            "is_recommend": 0,
            "space_id": 9,
            "is_enable": 0,
            "createTime": "2020-02-21 00:47:33",
            "createUser": "Kiva",
            "lastUpdateTime": "2020-08-11 10:12:48",
            "lastUpdateUser": "Kiva",
            "videoUpLoad": 0,
            "imageUpLoad": 0,
            "imageKey": "15f1636ee5d9e2919c049400adada295",
            "imageIV": "31ae951173501eee63b481ba6b2a9500",
          },
        ]
      }
    }
  },

  {
    url: '/mock-api/Video/video_spaces',
    type: 'get',
    response: config => {
      return {
        "status": "000",
        "errorCode": "00",
        "version": "",
        "data": [

          {
            "id": 9,
            "space_name": "鴨脖(主-機房)",
            "is_enable": 1,
            "image_space_domain": 4,
            "video_space_domain": 4,
            "api_space_domain": 5,
            "xhr_space_domain": null,
            "xhr_credentials": 0,
            "tag": "黑人,大鸡巴,多P,中出,内射,巨根,肛交,自慰,打飞机",
            "used_out": 0,
            "isEnableCount": "11344",
            "videoCount": "11748",
            "watermark": "images.jpeg",
            "watermarkUpload": 0,
            "createDate": "2020-07-21 17:00:13",
            "createUser": "Kiva",
            "lastUpdateTime": "2020-09-14 19:15:29",
            "lastupdateUser": "Kiva",
          },

          {
            "id": 3,
            "space_name": "小豬(備-小豬)",
            "is_enable": 1,
            "image_space_domain": 5,
            "video_space_domain": 14,
            "api_space_domain": 9,
            "xhr_space_domain": "https://api.pv123.app",
            "xhr_credentials": 1,
            "tag": "",
            "used_out": 1,
            "isEnableCount": "5710",
            "videoCount": "17733",
            "watermark": "下載.jpeg",
            "watermarkUpload": 0,
            "createDate": "2020-07-21 17:00:13",
            "createUser": "Kiva",
            "lastUpdateTime": "2020-09-14 19:15:29",
            "lastupdateUser": "Kiva",
          },

          {
            "id": 2,
            "space_name": "小豬(主-機房)",
            "is_enable": 1,
            "image_space_domain": 9,
            "video_space_domain": 9,
            "api_space_domain": 12,
            "xhr_space_domain": "https://api.pv123.app",
            "xhr_credentials": 1,
            "tag": "",
            "used_out": 1,
            "isEnableCount": "5710",
            "videoCount": "17733",
            "watermark": "下載.jpeg",
            "watermarkUpload": 0,
            "createDate": "2020-07-21 17:00:13",
            "createUser": "Kiva",
            "lastUpdateTime": "2020-09-14 19:15:29",
            "lastupdateUser": "Kiva",
          },

        ]
      }
    }
  },

  {
    url: '/mock-api/Video/video_owner',
    type: 'get',
    response: config => {

      return {
        "status": "000",
        "errorCode": "00",
        "version": "",
        "data": [
          {
            "id": 1,
            "artist": "葵司",
            "image": "https://image-video-1300520120.cos.ap-shanghai.myqcloud.com/avatar/%E8%91%B5%E5%8F%B8.jpeg",
            "birthday": "1990-08-14 00:00:00",
            "height": 163,
            "measurement": "88/58/86",
            "cup": "C",
            "country": "JP",
            "desc": "葵司（葵つかさ）是一名日本AV女优，1990年8月14 日出生于日本大阪，主要作品有《求爱365》。葵司不仅拥有清纯可爱的脸蛋，还有性感诱人的E乳好身材，与生俱来的好条件让她闯荡AV界无往不利，更以苍井空、原沙央莉为偶像，企图效法前辈成为国际性的AV女优。不过她也坦言，自己对于AV工作很乐在其中，希望将来能兼顾AV与演艺圈工作，并不会想脱离AV界。",
            "letter": "K",
            "actress": 0,
            "isHot": 1,
            "isEnableCount": "13", //啟用數量
            "videoCount": "103", //全部數量
            "delflag": false,
            "createTime": "2020-10-29 17:28:52",
            "createUser": "",
            "lastUpdateTime": "2020-10-29 17:28:52",
            "lastupdateUser": "sera003"
          },
          {
            "id": 2,
            "artist": "松下纱荣子",
            "image": "https://image-video-1300520120.cos.ap-shanghai.myqcloud.com/avatar/%E6%9D%BE%E4%B8%8B%E7%BA%B1%E8%8D%A3%E5%AD%90.jpeg",
            "birthday": "1990-09-30 00:00:00",
            "height": 165,
            "measurement": "88/57/86",
            "cup": "F",
            "country": "JP",
            "desc": "松下纱荣子（松下紗栄子、Matsushita Saeko、まつしたさえこ），日本AV女优，2015年6月在SOD出道，这位松下纱荣子是把AV女优当做副业，在现实生活中她是位礼仪讲师，而且还曾经当过空姐，所以脸蛋自然是不差，165公分的身高、F罩杯的上围、加上干练又气质的短发造型真是誘人的不得了。",
            "letter": "S",
            "actress": 0,
            "isHot": 1,
            "isEnableCount": "14", //啟用數量
            "videoCount": "104", //全部數量
            "delflag": false,
            "createTime": "2020-10-29 17:28:52",
            "createUser": "",
            "lastUpdateTime": "2020-10-29 17:28:52",
            "lastupdateUser": "sera003"
          },
          {
            "id": 3,
            "artist": "筱田优",
            "image": "https://image-video-1300520120.cos.ap-shanghai.myqcloud.com/avatar/%E7%AD%B1%E7%94%B0%E4%BC%98.jpeg",
            "birthday": "1991-07-21 00:00:00",
            "height": 155,
            "measurement": "85/58/85",
            "cup": "E",
            "country": "JP",
            "desc": "篠田 ゆう（しのだ - 、1991年7月21日 - ）は、日本のAV女优。东京都出身。マークスジャパン所属。",
            "letter": "X",
            "actress": 0,
            "isHot": 0,
            "isEnableCount": "15", //啟用數量
            "videoCount": "105", //全部數量
            "delflag": false,
            "createTime": "2020-10-29 17:28:52",
            "createUser": "",
            "lastUpdateTime": "2020-10-29 17:28:52",
            "lastupdateUser": "sera003"
          },
          {
            "id": 4,
            "artist": "佐佐木明希",
            "image": "https://image-video-1300520120.cos.ap-shanghai.myqcloud.com/avatar/%E4%BD%90%E4%BD%90%E6%9C%A8%E6%98%8E%E5%B8%8C.jpeg",
            "birthday": "1979-12-24 00:00:00",
            "height": 166,
            "measurement": "82/58/86",
            "cup": "C",
            "country": "JP",
            "desc": "佐佐木あき，1979年12月24日-），日本AV女优，出生于埼玉县。所属于ALL PROMOTION事务所。2015年10月，被日本大型AV片商SOD预先宣传是「SOD人妻系列史上最强的三十路人妻」而首次登场的熟女系AV女演员[2]。她已经结婚了。",
            "letter": "Z",
            "actress": 0,
            "isHot": 1,
            "isEnableCount": "13", //啟用數量
            "videoCount": "103", //全部數量
            "delflag": false,
            "createTime": "2020-10-29 17:28:52",
            "createUser": "",
            "lastUpdateTime": "2020-10-29 17:28:52",
            "lastupdateUser": "sera003"
          },
          {
            "id": 5,
            "artist": "古川伊织",
            "image": "https://image-video-1300520120.cos.ap-shanghai.myqcloud.com/avatar/%E5%8F%A4%E5%B7%9D%E4%BC%8A%E7%BB%87.jpeg",
            "birthday": "1991-09-25 00:00:00",
            "height": 155,
            "measurement": "83/58/88",
            "cup": "B",
            "country": "JP",
            "desc": "古川伊织外型为人称道，并不是说她有多沉鱼落雁，但的确清秀又健康。这位在封面照上捧着柠檬合照的青涩少女外型娇嫩，也没有什么性经验，但实际上是个积极向前的热血女孩",
            "letter": "G",
            "actress": 0,
            "isHot": 1,
            "isEnableCount": "13", //啟用數量
            "videoCount": "103", //全部數量
            "delflag": false,
            "createTime": "2020-10-29 17:28:52",
            "createUser": "",
            "lastUpdateTime": "2020-10-29 17:28:52",
            "lastupdateUser": "sera003"
          },
          {
            "id": 6,
            "artist": "藤江史帆",
            "image": "https://image-video-1300520120.cos.ap-shanghai.myqcloud.com/avatar/%E8%97%A4%E6%B1%9F%E5%8F%B2%E5%B8%86.jpeg",
            "birthday": "1996-07-17 00:00:00",
            "height": 163,
            "measurement": "83/59/90",
            "cup": "F",
            "country": "JP",
            "desc": "藤江史帆（ふじえしほ、fujieshiho），日本女演员，O型血，藤江史帆于1996年7月17日出生于日本大阪府。",
            "letter": "T",
            "actress": 0,
            "isHot": 0,
            "isEnableCount": "13", //啟用數量
            "videoCount": "103", //全部數量
            "delflag": false,
            "createTime": "2020-10-29 17:28:52",
            "createUser": "",
            "lastUpdateTime": "2020-10-29 17:28:52",
            "lastupdateUser": "sera003"
          },
          {
            "id": 7,
            "artist": "八乃翼",
            "image": "https://image-video-1300520120.cos.ap-shanghai.myqcloud.com/avatar/%E5%85%AB%E4%B9%83%E7%BF%BC.jpeg",
            "birthday": "1995-09-30 00:00:00",
            "height": 156,
            "measurement": "82/58/85",
            "cup": "E",
            "country": "JP",
            "desc": "八乃翼 HachiroTsubasa),女演员,身高156cM,E罩杯,1995年09月30日出生于日本,不仅拥有漂亮脸蛋再加上E杯美乳更是上天给她的礼物还是现代医美技术的结晶!",
            "letter": "B",
            "actress": 0,
            "isHot": 0,
            "isEnableCount": "19", //啟用數量
            "videoCount": "109", //全部數量
            "delflag": false,
            "createTime": "2020-10-29 17:28:52",
            "createUser": "",
            "lastUpdateTime": "2020-10-29 17:28:52",
            "lastupdateUser": "sera003"
          }
        ]
      }

    }
  },
  {
    url: '/mock-api/Video/video_owner',
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
    url: '/mock-api/Video/spaceCDN',
    type: 'get',
    response: config => {
      return {
        "status": "000",
        "errorCode": "00",
        "version": "",
        "data": [

          {
            "id": 1,
            "spaceId": 9,
            "cdn": "https://rengiala.com",
            "delfalg": 0,
            "createdDate": "2020-07-21 17:00:13",
            "createdUser": "Kiva",
            "lastUpdateTime": "2020-09-14 19:15:29",
            "lastUpdateUser": "Kiva",
          },

          {
            "id": 2,
            "spaceId": 9,
            "cdn": "https://shuichanyang.com",
            "delfalg": 0,
            "createdDate": "2020-07-21 17:00:13",
            "createdUser": "Kiva",
            "lastUpdateTime": "2020-09-14 19:15:29",
            "lastUpdateUser": "Kiva",
          },

          {
            "id": 3,
            "spaceId": 3,
            "cdn": "https://api.pv123.app/",
            "delfalg": 0,
            "createdDate": "2020-07-21 17:00:13",
            "createdUser": "Kiva",
            "lastUpdateTime": "2020-09-14 19:15:29",
            "lastUpdateUser": "Kiva",
          },

          {
            "id": 4,
            "spaceId": 3,
            "cdn": "https://pv-oa-baidu.lipin580.com/",
            "delfalg": 0,
            "createdDate": "2020-07-21 17:00:13",
            "createdUser": "Kiva",
            "lastUpdateTime": "2020-09-14 19:15:29",
            "lastUpdateUser": "Kiva",
          },

          {
            "id": 5,
            "spaceId": 2,
            "cdn": "https://www.google.com/",
            "delfalg": 0,
            "createdDate": "2020-07-21 17:00:13",
            "createdUser": "Kiva",
            "lastUpdateTime": "2020-09-14 19:15:29",
            "lastUpdateUser": "Kiva",
          },

          {
            "id": 6,
            "spaceId": 2,
            "cdn": "https://tw.yahoo.com/",
            "delfalg": 0,
            "createdDate": "2020-07-21 17:00:13",
            "createdUser": "Kiva",
            "lastUpdateTime": "2020-09-14 19:15:29",
            "lastUpdateUser": "Kiva",
          },

        ]
      }
    }
  },

  {
    url: '/mock-api/Video/ApiDomain',
    type: 'get',
    response: config => {
      return {
        "status": "000",
        "errorCode": "00",
        "version": "",
        "data": [
          {
            "id": 1,
            "apiDomain": "https://cdxxx.app",
            "is_enable": true,
            "createUser": "Kiva",
            "lastupdateUser": "Kiva",
            "createTime": "2020-02-16 21:42:27",
            "lastUpdateTime": "2020-08-21 10:43:09"
          },
          {
            "id": 2,
            "apiDomain": "https://xxxfuck.app",
            "is_enable": false,
            "createUser": "Kiva",
            "lastupdateUser": "Kiva",
            "createTime": "2020-02-16 21:42:27",
            "lastUpdateTime": "2020-08-21 10:43:09"
          },
        ]
      }
    }
  },

  {
    url: '/mock-api/Video/video_spaces',
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
    url: '/mock-api/Video/watermark',
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
    url: '/mock-api/Video/spaceCDN',
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
    url: '/mock-api/Video/ApiDomain',
    type: 'put',
    response: config => {
      return {
        "status": "000",
        "errorCode": "00",
        "version": "",
        "data": null
      }
    }
  }, {
    url: '/mock-api/Video/upliadFileChunk',
    type: 'post',
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
    url: '/mock-api/Video/checkeExists',
    type: 'get',
    response: config => {
      return {
        "status": "000",
        "errorCode": "00",
        "version": "",
        "data": false
      }
    }
  },

  {
    url: '/mock-api/Video/merge',
    type: 'post',
    response: config => {
      return {
        "status": "000",
        "errorCode": "00",
        "version": "",
        "data": false
      }
    }
  },

  {
    url: '/mock-api/Video/videos',
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
    url: '/mock-api/Video/viewerVideoCount/\.*',
    type: 'get',
    response: config => {
      return {
        "status": "000",
        "errorCode": "00",
        "version": "",
        "data": [
          {
            "videoSpaceId": 9,
            "isDisableCount": 0,//status=0 的數量
            "isEnableCount": 500, //processStaus=1 and status=1 的數量
            "processCount": 300, //processStaus=0 and status=1 的數量
            "totalVideoCount": 800,
          },
          {
            "videoSpaceId": 3,
            "isDisableCount": 200,//status=0 的數量
            "isEnableCount": 0, //processStaus=1 and status=1 的數量
            "processCount": 300, //processStaus=0 and status=1 的數量
            "totalVideoCount": 500,
          }
        ]
      }
    }
  },
  {
    url: '/mock-api/Video/viewerVideo',
    type: 'post',
    response: config => {
      return {
        "status": "000",
        "errorCode": "00",
        "version": "",
        "totalCount": 1000, //資料總筆數 
        "data": [
          {
            "id": 1,
            "title": [
              {
                "language": "zh-cn",
                "title": "【无码】白衣天使变成肉便器-终极母奴隶成宫琉璃DSAMBD-06",
                "description": "xxxx"
              }
            ],
            "tag": [
              "無碼",
              "美少女"
            ],
            "artist": 11,
            "code": 2900,
            "imageUrl": "https://qiubite1314.com/28713/image/28713.cdxxx.app.aes",
            "videoUrl": "https://qiubite1314.com/28713/video/28713.cdxxx.app.m3u8",
            "imageKey": "24e916546202658d3b92f21c2ca768a3",
            "imageIV": "6fb2ae78feee9640197dd79b2c0cc4bb",
            "sort": 4,
            "isRecommend": 1,
            "views": 3000,
            "zans": 2000,
            "spaceId": 1,
            "videoSpaceId": 1,
            "status": 0,
            "processStatus": 1
          },
          {
            "id": 3,
            "title": [
              {
                "language": "zh-cn",
                "title": "【【飞机篇】美巨乳白嫩少女佐伯雪菜激情中出cwpbd-123",
                "description": "xxxx"
              }
            ],
            "tag": [
              "無碼",
              "美少女"
            ],
            "artist": 11,
            "code": 2901,
            "imageUrl": "https://qiubite1314.com/28719/image/28719.cdxxx.app.aes",
            "videoUrl": "https://qiubite1314.com/28719/video/28719.cdxxx.app.m3u8",
            "imageKey": "7d601ac3a28c11a2d2c29bc4c8a15187",
            "imageIV": "425650bcff8d67705efd3de34dc37635",
            "sort": 1,
            "isRecommend": 1,
            "views": 4000,
            "zans": 1000,
            "spaceId": 1,
            "videoSpaceId": 2,
            "status": 1,
            "processStatus": 0
          },

        ]
      }
    }
  },
  {
    url: '/mock-api/Video/spaceCOS',
    type: 'get',
    response: config => {
      return {
        status: "000",
        errorCode: "00",
        version: "",
        data: [
          {
            id: 1,
            videoSpaceId: 9,
            cosId: 2,
            path: "",
            seat: 1,
            lastUpdateTime: "2020-09-14 19:15:29",
            lastUpdateUser: "Kiva",
          },
          {
            id: 1,
            videoSpaceId: 9,
            cosId: 3,
            path: "",
            seat: 2,
            lastUpdateTime: "2020-09-14 19:15:29",
            lastUpdateUser: "Kiva",
          },
        ]
      }
    }
  },

]