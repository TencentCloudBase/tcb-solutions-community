// 云函数入口文件
const cloud = require('wx-server-sdk')
const Redis = require('ioredis');
const config = require('./config.json');

const redis = new Redis({
  port: 6379,
  host: config.redis.host,
  family: 4,
  password: config.redis.password,
  db: 0,
});
cloud.init({ env: 'cloud-tcb' });
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {

  const wxContext = cloud.getWXContext()

  try {

    var cacheKey = config.redis.adminTokenKey + event.token;
    var value = await redis.get(cacheKey);
    value = JSON.parse(value);

    if (value.openid == wxContext.OPENID && value.areaId.indexOf(event.areaId) != -1) {

      let data = null;
      let nowDate = new Date();
      if (event.vaild === false) {
        data = { vaild: false, update_time: nowDate };
      } else {
        if (event.info != null) {
          data = event.info;
          if (data.typeDesc != null) {
            let desc = data.typeDesc;
            delete data.typeDesc;
            data.type_desc = desc;
          };
        } else {
          data = {};
        };
        data.update_time = nowDate;
      };

      /****更新用户数据记录 */
      let body =await db.collection('tcbst_biz').where({
        area_id: event.areaId,
        biz_code: event.bizCode
      }).update({data: data});

      return {
        error: null,
        update_time: nowDate,
        timestamp: Math.round(new Date().getTime() / 1000)
      };

    } else {
      return { error: 'token data is error' };
    };

  }catch(error){
    console.log(error);
    return { error: error };
  };

}