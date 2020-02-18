// 云函数入口文件
const cloud = require('wx-server-sdk')
const sm2 = require('miniprogram-sm-crypto').sm2;
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

  var cacheKey = 'tcbst:admin:pubKey:' + event.serial.replace(/-/g, '');
  var publicKey = await redis.get(cacheKey);

  var msg = 'serial=' + event.serial + '&timestamp=' + event.codeTimestamp;
  if (event.mateCode != null) {
    msg = msg + event.mateCode;
  };

  if (sm2.doVerifySignature(msg, event.signData, publicKey)){

    let result = await db.collection('tcbst_visit_code').where({
      serial: event.serial
    }).get();

    if (result.data.length > 0){

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

    }else{
      return { error: 'code data is null' };
    };

  }else{
    return {error: 'verifySignature is fail'};
  };

}