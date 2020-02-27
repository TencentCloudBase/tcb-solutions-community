// 云函数入口文件
const cloud = require('wx-server-sdk');
const sm2 = require('miniprogram-sm-crypto').sm2;
const Redis = require('ioredis');
const uuid = require('node-uuid');
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

  try {

    var cacheKey = config.redis.adminTokenKey + event.token;
    var value = await redis.get(cacheKey);
    value = JSON.parse(value);

    if (value.openid == wxContext.OPENID && value.areaId.indexOf(event.areaId) != -1 ) {

      // 查询数据
      var result = await db.collection('tcbst_admin').where({
        openid: value.openid, 
        valid: true
      }).get();

      if (result.data.length > 0) {

        let data = result.data[0];

        let serial = uuid.v1();
        let codeData = (uuid.v4() + uuid.v4()).replace(/-/g, '').toUpperCase();

        let nowDate = new Date();
        let timestamp = Math.round(new Date().getTime() / 1000);

        if (event.expiresTime == null || event.expiresTime < 3600) {
          /***** 有效时间最低1小时, 默认24小时 */
          event.expiresTime = 3600 * 24;
        };
        /*************增加扫码记录 */
        let body = await db.collection('tcbst_visit_code').add({
          data: {
            serial: serial,
            code_data: codeData,
            openid: data.openid,
            area_id: event.areaId,
            area_area: data.area_area,
            org_mame: data.org_name,
            type: 'visit',
            valid: true,
            area_place: event.place,
            mate_code: event.mateCode,
            create_time: nowDate,
            expires_time: event.expiresTime,
            update_time: nowDate
          }
        });

        let keypair = sm2.generateKeyPairHex();
        let publicKey = keypair.publicKey; // 公钥
        let privateKey = keypair.privateKey; // 私钥

        cacheKey = config.redis.visitCodePubKey + serial.replace(/-/g, '');
        redis.set(cacheKey, publicKey, 'EX', event.expiresTime);
        cacheKey = config.redis.visitCodePriKey + serial.replace(/-/g, '');
        redis.set(cacheKey, privateKey, 'EX', event.expiresTime);

        let msg = 'serial=' + serial + '&timestamp=' + timestamp;
        if (event.mateCode != null) {
          msg = msg + event.mateCode;
        };
        let sigData = sm2.doSignature(msg, privateKey);

        return {
          error: null,
          requestId: event.requestId,
          serial: serial,
          sigData: sigData,
          timestamp: timestamp
        };

      } else {
        return { error: 'admin data is error' };
      };

    } else {
      return { error: 'token data is error' };
    };

  }catch(error){
    console.log(error);
    return { error: error };
  };

};

