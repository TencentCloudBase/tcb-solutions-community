// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 数据库
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  switch(event.action){
    case "add":{
      return add(event)
    }
    case "getNear":{
      return getNear(event)
    }
  }
}

// 上报疫情
async function add(event){
  if(!event.uploader_id && !event.address && !event.location && !event.link){
    await db.collection('epidemic_situation').add({
      data:{
        uploader_id:event.uploader_id,
        address:event.address,
        location:db.Geo.Point(location.longitude,location.latitude),
        link:event.link,
        remark:event.remark,
        create_time:new Date(),
        update_time:new Date(),
        is_delete:0
      }
    })
    return{
      code:0,
      msg:"success"
    }
  }else{
    return{
      code:5001,
      msg:"参数不完整"
    }
  }
}


// 获取附近疫情
async function getNear(event){
  if(!event.longitude && !event.latitude){
    await db.collection('epidemic_situation').where({
      location: db.command.geoNear({
        geometry: db.Geo.Point(longitude,latitude),
        // minDistance:1000,
        // maxDistance:5000
      }) ,
      is_delete: 0
    })
    .get({
      success(res){
        return{
          code:0,
          msg:"success",
          situations:res.data
        }
      }
    })
  }else{
    return{
      code:5001,
      msg:"参数不完整"
    }
  }
}