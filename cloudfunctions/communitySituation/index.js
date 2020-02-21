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
    case "check":{
      return check(event)
    }
    case "list":{
      return list(event)
    }
    case "addIsolatedPersonnel":{
      return addIsolatedPersonnel(event)
    }
    case "listIsolatedPersonnel":{
      return listIsolatedPersonnel(event)
    }
  }
}

// 上报社区情况
async function add(event){
  if(!event.uploader_id && !event.type && !event.images && !event.area_id){
    await db.collection('community_situation').add({
      data:{
        uploader_id:event.uploader_id,
        type:event.type,
        images:event.images,
        area_id:event.area_id,
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


// 审核社区情况
async function check(event){
  if(!event.cs_id && !event.checker_id){
    await db.collection('community_situation_check').add({
      data:{
        cs_id:event.cs_id,
        checker_id:event.checker_id,
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

// 获取社区情况列表
async function list(event){
  if(!event.area_id){
    await db.collection('community_situation').where({
      area_id: event.area_id,
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


// 添加隔离人员
async function addIsolatedPersonnel(event){
  if(!event.uploader_id && !event.area_id && !event.name && !event.phone && !event.type){
    await db.collection('isolated_personnel').add({
      data:{
        uploader_id:event.uploader_id,
        type:event.type,
        area_id:event.area_id,
        name:event.name,
        phone:event.phone,
        type:event.type,
        reason:event.reason,
        state:event.state,
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

// 获取社区情况列表
async function listIsolatedPersonnel(event){
  if(!event.area_id){
    await db.collection('isolated_personnel').where({
      area_id: event.area_id,
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