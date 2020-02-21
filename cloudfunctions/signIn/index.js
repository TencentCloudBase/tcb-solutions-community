// 云函数入口文件
const cloud = require('wx-server-sdk');
const crypto = require('crypto');
const Redis = require('ioredis');
const config = require('./config.json');

const redis = new Redis({
  port: 6379, 
  host: config.redis.host,
  family: 4,
  password: config.redis.password,
  db: 0,
});

cloud.init({ env: 'cloud-tcb'});
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {

  const wxContext = cloud.getWXContext()

  try {
    /*********云数据库存储查询  **************/
    var result = await db.collection('tcbst_admin').where({
      openid: wxContext.OPENID,
      name: event.name,
      valid: true
    }).get();

    if (result.data.length > 0) {

      let data = result.data[0];
      /**********验证输入密码 */
      let secret = await redis.get(config.redis.secretKey);

      if (dataCompare(secret, event.password, data.password)) {

        /********* 获取随机数作为token */
        let token = getToken(16, 3).substring(0, 38);
        let cacheKey = config.redis.adminTokenKey + token;
        let value = JSON.stringify({
          openid: wxContext.OPENID,
          name: event.name,
          areaId: data.area_id
        });

        // 缓存24小时
        redis.set(cacheKey, value, 'EX', 3600 * 24);
        let body = await db.collection('tcbst_admin').where({
          openid: wxContext.OPENID,
          name: event.name,
        }).update({
          data: { login_time: db.serverDate() }
        });

        return {
          error: null,
          requestId: event.requestId,
          token: token,
          timestamp: Math.round(new Date().getTime() / 1000)
        };

      } else {
        return { error: 'password is error' };
      };

    } else {
      return { error: 'data is null' };
    };

  }catch(error){
    console.log(error);
    return {error: error};
  };

};

function dataCompare(secret, password, dbPassword) {
  try {
    var str = crypto.createHmac('sha256', secret).update(password).digest().toString('base64');
    return str === dbPassword;
  } catch (err) {
    console.error('encrypt dataCompare err:', err.toString());
    return null;
  };
};

/**********hex 随机字符串 */
function getToken(number, loop) {
  var result = "";
  for (let j = 0; j < loop; j++) {
    let str = '';
    for (let i = 0; i < number; i++) {
      str += Math.floor(Math.random() * 10);
    };
    result += Number(str).toString(16);
  };
  return result.toUpperCase();
};