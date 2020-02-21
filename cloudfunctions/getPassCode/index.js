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

// 云函数入口函数
exports.main = async (event, context) => {

  const wxContext = cloud.getWXContext()

  try{

    var cacheKey = config.redis.visitCodePubKey + event.serial.replace(/-/g, '');
    var publicKey = await redis.get(cacheKey);
    var timestamp = Math.round(new Date().getTime() / 1000);

    var msg = JSON.stringify({
      serial: event.serial,
      unionid: wxContext.UNIONID,
      env: wxContext.ENV,
      source: wxContext.SOURCE,
      openid: wxContext.OPENID,
      info: event.info,
      timestamp: timestamp
    });
    var cipherMode = 1;
    var encryptData = sm2.doEncrypt(msg, publicKey, cipherMode); //加密

    return {
      error: null,
      requestId: event.requestId,
      openid: wxContext.OPENID,
      passData: encryptData,
      serial: event.serial
    };

  }catch(error){
    console.log(error);
    return { error: error };
  };

};