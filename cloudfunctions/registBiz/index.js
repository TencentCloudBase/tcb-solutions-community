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

      let key = config.redis.bizCodeKey;
      let bizCode = (await redis.incr('key') + 1000000000).toString();

      /*************增加商家记录 */
      let nowDate = new Date();
      let body = await db.collection('tcbst_biz').add({
        data: {
          biz_code: bizCode,
          area_id: event.areaId,
          biz_name: event.bizName,
          address: event.address,
          telephone: event.telephone,
          dept: event.dept,
          mobile: event.mobile,
          contacts: event.contacts,
          place: event.place,
          msg: event.msg,
          type: event.type,
          type_desc: event.typeDesc,
          attach: event.attach,
          create_time: nowDate,
          update_time: nowDate
        }
      });

      return {
        error: null,
        bizCode: bizCode,
        timestamp: Math.round(new Date().getTime() / 1000)
      }

    } else {
      return { error: 'token data is error' };
    };

  }catch(error){
    console.log(error);
    return { error: error };
  };

}