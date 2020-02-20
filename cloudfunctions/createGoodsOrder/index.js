// 云函数入口文件
const cloud = require('wx-server-sdk');
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

    let nowDate = new Date();

    let orderNumber = await getOrderNumber(nowDate);

    /****新增用户提交的商品物资* 记录 */
    let result = await db.collection('tcbst_goods').add({
      data: {
        order_number: orderNumber,
        openid: wxContext.OPENID,
        env: wxContext.ENV,
        unionid: wxContext.UNIONID,
        source: wxContext.SOURCE,
        area_id: event.areaId,
        user_name: event.name,
        user_address: event.address,
        user_mobile: event.mobile,
        biz_code: event.bizCode,
        biz_name: event.bizName,
        info: event.info,
        status: 1, //正常建立
        create_time: nowDate,
        update_time: nowDate
      }
    });

    return {
      error: null,
      requestId: event.requestId,
      orderNumber: orderNumber,
      createTime: nowDate,
      timestamp: Math.round(new Date().getTime() / 1000)
    };

  }catch(error){
    console.log(error);
    return { error: error };
  };


};

function getOrderNumber(date, callback){
  return new Promise(function (resolve, reject) {
    var mm = date.getMonth();
    var dd = date.getDate();
    var yyyy = date.getFullYear();

    if (mm > 9) {
      mm = mm.toString();
    } else {
      mm = '0' + mm.toString();
    };
    if (dd > 9) {
      dd = dd.toString();
    } else {
      dd = '0' + dd.toString();
    };

    var key = config.redis.goodsNoKey;
    redis.incr(key, function (err, reply) {
      if (!err) {
        let orderNumber = yyyy.toString() + mm + dd;
        if (reply < 800000) {
          orderNumber = orderNumber + (100000 + reply).toString();
        } else {
          orderNumber = orderNumber + (100000 + reply).toString();
          redis.set(key, 0);
        };
        resolve(orderNumber);
      } else {
        reject(err);
      };
    });
  });
};
