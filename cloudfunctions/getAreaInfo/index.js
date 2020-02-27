// 云函数入口文件
const cloud = require('wx-server-sdk')
const sm2 = require('miniprogram-sm-crypto').sm2;
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

  const wxContext = cloud.getWXContext();

  try{

    var cacheKey = config.redis.visitCodePubKey + event.serial.replace(/-/g, '');
    var publicKey = await redis.get(cacheKey);

    var msg = 'serial=' + event.serial + '&timestamp=' + event.codeTimestamp;
    if (event.mateCode != null) {
      msg = msg + event.mateCode;
    };

    if (sm2.doVerifySignature(msg, event.signData, publicKey)) {

      let result = await db.collection('tcbst_visit_code').where({
        serial: event.serial,
        area_id: event.areaId
      }).get();

      if (result.data.length > 0) {

        let data = result.data[0];

        return {
          error: null,
          requestId: event.requestId,
          codeData: data.code_data,
          areaPlace: data.area_place,
          areaId: data.area_id,
          orgName: data.org_name,
          timestamp: Math.round(new Date().getTime() / 1000)
        };

      } else {
        return { error: 'code data is null' };
      };

    } else {
      return { error: 'verifySignature is fail' };
    };

  }catch(error){
    console.log(error);
    return { error: error };
  };

}