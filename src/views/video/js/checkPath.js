import { GetVendersBySpaceId, GetVideofilehost, GetCdns, GetDomains, GetCos } from "@/api/video";
import store from '@/store'
import { deepClone, consoleLog } from '@/utils/index.js'

var vendorList = [];

var source_domain = undefined;

function extractHostname(url) {
    var hostname;
    var extractUrl;
    if (url.indexOf("//") > -1) {
        hostname = url.split("/")[0] + "//" + url.split("/")[2] + "/";
    } else {
        hostname = url.split("/")[0] + "/";
    }
    extractUrl = url.replace(hostname, "");

    var obj = {
        domain: hostname,
        extractUrl: extractUrl,
    };
    return obj;
}
async function GetVendorAndPushList(spaceId, isProvider = false) {
    if(spaceId==0) return;
    var vendor = vendorList.find(o => o.id == spaceId)
    if (vendor)
    return deepClone(vendor)
   
    if (isProvider) {
        const res = await GetVendersBySpaceId(spaceId)
        if (res.data && res.data.length > 0) {
            var vendors = res.data;

            vendors = vendors.sort(function (a, b) {
                return a.seat < b.seat ? -1 : 1;
            });
            vendor = vendors[0];
            const resC = await GetCos(); //取得Cos內容
            if (resC) {
                var cos = resC.data.find(o => o.id == vendor.cosId)
                if(!cos) return;
                vendor.videoCosScheme = cos.cosScheme
                vendor.videoSpaceDomain = `${cos.cosName}.${cos.cosEndpoint}`
                vendor.imageCosScheme = cos.cosScheme
                vendor.imageSpaceDomain = `${cos.cosName}.${cos.cosEndpoint}`
                const resD = await GetDomains() //取api domain
                if (resD && resD.data.length > 0) {
                    vendor.apiSpaceDomain = resD.data[0].apiDomain
                }
                vendorList.push(vendor)
            }
        }
    } else {
        const res = await GetVendersBySpaceId(spaceId)
        if (res.data && res.data.length > 0) {
            var vendors = res.data;
            vendors = vendors.sort(function (a, b) {
                return a.seat < b.seat ? -1 : 1;
            });
            vendor = vendors[0];
            vendorList.push(vendor)
        }
    }
    return deepClone(vendor)

}

export function ClearVendorList() {
    vendorList = [];
}

export async function GetPreviewPath(item, isProvider = false) { //0：無cdn, 取廳號為0的CDN
    var imagePath = "";
    var videoPath = "";
    var returnObj = {};
    if (item.usedOut == 1)//小豬一律用小豬自己的CDN
    {
        var spaceId = 0;
        if (isProvider)
            spaceId = item.spaceId;
        else
            spaceId = item.videoSpaceId;
        var vendor = await GetVendorAndPushList(spaceId)
        if (vendor) {
            if (vendor.imageSpaceDomain.endsWith('/'))
                vendor.imageSpaceDomain = vendor.imageSpaceDomain.slice(0, -1)
            imagePath = `${vendor.imageSpaceDomain}/`

            if (item.imagePath.startsWith('/'))
                item.imagePath = item.imagePath.slice(1)
            imagePath += `${item.imagePath}`

            /*video */
            if (vendor.videoSpaceDomain.endsWith('/'))
                vendor.videoSpaceDomain = vendor.videoSpaceDomain.slice(0, -1)
            videoPath = `${vendor.videoSpaceDomain}/`

            if (item.videoPath.startsWith('/'))
                item.videoPath = item.videoPath.slice(1)
            videoPath += `${item.videoPath}`
        }
    }
    else if (item.processStatus == 1) //非小豬 已轉檔
    {
        var vendor = undefined;
        if (isProvider) //沒有CDN 用COS的domain
            vendor = await GetVendorAndPushList(item.spaceId, isProvider)
        else {
            vendor = await GetVendorAndPushList(item.spaceId)
        }

        if (vendor) {

            /*  for Demo
            if (item.videoUrl.indexOf('/qa-') < 0 && store.getters.appconfig.domain == 'test') //測試站舊資料
            {
                vendor.videoSpaceDomain = 'https://shuichanyang.com'
                vendor.apiSpaceDomain = 'https://foxyjizz.com'
            }
            if (item.imageUrl.indexOf('/qa-') < 0 && store.getters.appconfig.domain == 'test') //測試站舊資料
            {
                vendor.imageSpaceDomain = 'https://shuichanyang.com'
                vendor.apiSpaceDomain = 'https://foxyjizz.com'
            }
             */

            imagePath = `${vendor.imageCosScheme ? vendor.imageCosScheme : 'https'.replace('/', '')}://`;

            if (vendor.imageSpaceDomain.endsWith('/'))
                vendor.imageSpaceDomain = vendor.imageSpaceDomain.slice(0, -1)
            imagePath += `${vendor.imageSpaceDomain.replace('https://', '').replace('http://', '')}/`

            if (item.imageUrl.startsWith('/'))
                item.imageUrl = item.imageUrl.slice(1)
            imagePath += `${item.imageUrl}`

            /*video */
            var apiDomain=extractHostname(store.getters.appconfig.apiInfo.host)
            if (apiDomain.domain.endsWith('/'))
            apiDomain.domain = apiDomain.domain.slice(0, -1)
            videoPath += `${apiDomain.domain}/`
            if (item.videoUrl && item.videoUrl.startsWith('/'))
                item.videoUrl = item.videoUrl.slice(1)
            videoPath += item.videoUrl.replace('m3u8', '')
            videoPath +=`&spaceId=${item.spaceId}&videoSpaceId=${isProvider?item.spaceId:item.videoSpaceId}&fake=000.m3u8`;
        }


        //  consoleLog(imagePath);
        //  consoleLog(videoPath);

    } else//未轉檔 影圖更換會全轉
    {
        if (source_domain == undefined) {
            var res = await GetVideofilehost();
            source_domain = res.data.gke
        }
        imagePath = `${source_domain}${item.imagePath}`
        videoPath = `${source_domain}${item.videoPath}`
    }
    returnObj.PreviewImageUrl = imagePath
    returnObj.PreviewVideoUrl = videoPath

   // consoleLog(imagePath);
  //  consoleLog(videoPath);
    return returnObj
}
