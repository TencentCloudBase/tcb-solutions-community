// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  // console.log(event)
  switch (event.action) {
    case 'getWXACode': {
      return getWXACode(event)
    }
    case 'getOpenData': {
      return {
        openid: wxContext.OPENID,
        appid: wxContext.APPID,
        unionid: wxContext.UNIONID,
      }
    }
    case 'msgSecCheck': {
      return msgSecCheck(event)
    }
    case 'imgSecCheck': {
      return imgSecCheck(event)
    }
    case 'submitPages': {
      return submitPages(event)
    }
    default: {
      return
    }
  }
}

//获取小程序码
async function getWXACode(event) {
  console.log(event.url)
  // 此处将获取永久有效的小程序码，并将其保存在云文件存储中，最后返回云文件 ID 给前端使用

  const wxacodeResult = await cloud.openapi.wxacode.get({
    path: event.url || 'pages/index/index',
  })

  const fileExtensionMatches = wxacodeResult.contentType.match(/\/([^\/]+)/)
  const fileExtension = (fileExtensionMatches && fileExtensionMatches[1]) || 'jpg'

  const uploadResult = await cloud.uploadFile({
    // 云文件路径，此处为演示采用一个固定名称
    cloudPath: `wxCode/wxCode${Math.random() * 9999999}.${fileExtension}`,
    // 要上传的文件内容可直接传入图片 Buffer
    fileContent: wxacodeResult.buffer,
  })

  if (!uploadResult.fileID) {
    throw new Error(`上传失败，文件为空，存储服务器状态代码为空 ${uploadResult.statusCode}`)
  }

  return uploadResult.fileID
}


// 检测文本是否合规
async function msgSecCheck(event) {
  // 需 wx-server-sdk >= 0.5.0
  return cloud.openapi.security.msgSecCheck({
    content: event.content,
  })
}

// 检测图片是否合规
async function imgSecCheck(event) {
  return cloud.openapi.security.imgSecCheck({
    media: {
      contentType: event.contentType,
      value: Buffer.from(event.value)
    }
  })
}

// 收录页面
async function submitPages(event) {
  return cloud.openapi.search.submitPages({
    pages: [{
      path: event.path,
      query: event.query
    }]
  })
}
