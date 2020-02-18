// 云函数入口文件
const cloud = require('wx-server-sdk')
const sm2 = require('miniprogram-sm-crypto').sm2;
const uuid = require('node-uuid');
const Redis = require('ioredis');

const redis = new Redis({
  port: 6379, // Redis port
  host: '10.0.0.10',
  family: 4,// 4 (IPv4) or 6 (IPv6)
  password: 'tcb12345678',
  db: 2,
});
cloud.init({ env: 'cloud-tcb' });

// 云函数入口函数
exports.main = async (event, context) => {

  const wxContext = cloud.getWXContext();
  const db = cloud.database();

  var cacheKey = 'tcbst:admin:token:' + event.token;
  var value = await redis.get(cacheKey);
  value = JSON.parse(value);

  if (value.openid == wxContext.OPENID) {
    
    cacheKey = 'tcbst:admin:priKey:' + event.serial.replace(/-/g, '');
    var privateKey = await redis.get(cacheKey);
    var cipherMode = 1;
    var info = JSON.parse(sm2.doDecrypt(event.passData, privateKey, cipherMode));

    var result = await db.collection('tcbst_visit_code').where({
      serial: event.serial,
      openid: wxContext.OPENID,
      code_data: info.codeData,
      valid: true
    }).get();

    if (result.data.length > 0) {

      let data = result.data[0];
      let timestamp = Math.round(new Date().getTime() / 1000);

      /*************增加用户通行记录 */
      let body = await db.collection('tcbst_pass_info').add({
        data: {
          passNo: uuid.v1(),
          serial: event.serial,
          openid: info.openid,
          area_id: data.area_id,
          area_area: data.area_area,
          org_mame: data.org_name,
          unionid: wxContext.UNIONID,
          env: info.env,
          source: info.source,
          info: info.info,
          area_place: data.area_place,
          valid: true,
          create_time: db.serverDate()
        }
      });

      return {
        error: null,
        requestId: event.requestId,
        timestamp: Math.round(new Date().getTime() / 1000)
      };

    } else {
      return { error: 'data get fail' };
    };

  }else{
    return { error: 'token data is error' };
  };

}