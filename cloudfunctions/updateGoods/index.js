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

  const wxContext = cloud.getWXContext();

  try{

    var cacheKey = config.redis.adminTokenKey + event.token;
    var value = await redis.get(cacheKey);
    value = JSON.parse(value);

    if (value.openid == wxContext.OPENID) {

      if ([3, 6, 9, 10].indexOf(event.status) != -1) {//3、商家已处理；6、货物抵达且、9、商家取消；10、退货

        let nowDate = new Date();
        /****更新用户数据记录 */
        let result = await db.collection('tcbst_goods').where({
          area_id: value.areaId,
          order_number: event.orderNumber
        }).update({
          data: {
            status: event.status,
            status_desc: event.statusDesc,
            vaild: event.vaild,
            pay_status: event.payStatus,
            amount: event.amount,
            receive_address: event.receiveAddress,
            salesman: event.salesman,
            sales_mobile: event.salesMobile,
            info: event.info,
            arrival_time: event.arrivalTime,
            update_time: nowDate
          }
        });

        return {
          error: null,
          update_time: nowDate,
          timestamp: Math.round(new Date().getTime() / 1000)
        };

      } else {
        return { error: 'update status is error' };
      };

    } else {
      return { error: 'token data is error' };
    };

  }catch(error){
    console.log(error);
    return { error: error };
  };



  

}