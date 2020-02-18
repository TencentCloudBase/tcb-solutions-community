// 云函数入口文件
const cloud = require('wx-server-sdk');
const crypto = require('crypto');
const Redis = require('ioredis');

const redis = new Redis({
  port: 6379, // Redis port
  host: '10.0.0.10',
  family: 4,// 4 (IPv4) or 6 (IPv6)
  password:  'tcb12345678',
  db: 2,
});
cloud.init({ env: 'cloud-tcb'});

// 云函数入口函数
exports.main = async (event, context) => {

  const wxContext = cloud.getWXContext()
  const db = cloud.database();

  /*********云数据库存储  **************/
  var result = await db.collection('tcbst_admin').where({
    openid: wxContext.OPENID,
    name: event.name,
    valid: true
  }).get();

  if (result.data.length > 0) {
    
    let data = result.data[0];

    /**********验证输入密码 */
    let secret = '99801010';
    if (dataCompare(secret, event.password, data.password)) {
      /********* 获取随机数作为token */
      let token = getToken(16, 3).substring(0, 38);
      let cacheKey = 'tcbst:admin:token:' + token;
      let value = JSON.stringify({
        openid: wxContext.OPENID,
        name: event.name
      });
      // 缓存24小时
      redis.set(cacheKey, value, 'EX', 3600 * 24);

      let body = await db.collection('tcbst_admin').where({
        openid: wxContext.OPENID
      }).update({
        data: { login_time: db.serverDate()}
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

  }else{
    return { error: 'data is null' };
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