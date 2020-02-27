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

    var queryData = null;
    if (event.token != null) {
      /********** 管理员  */
      let cacheKey = config.redis.adminTokenKey + event.token;
      let value = await redis.get(cacheKey);
      value = JSON.parse(value);

      if (value.openid == wxContext.OPENID && value.areaId.indexOf(event.areaId) != -1) {
        queryData = { area_id: event.areaId };
      } else {
        return { error: 'token data is error' };
      };

    } else {
      /********** 一般用户*/
      queryData = { openid: wxContext.OPENID };
    };

    if (event.orderNumber != null) {
      queryData.orderNumber = event.orderNumber;
    };

    if (event.startTime != null) {
      queryData.create_time = db.command.gte(event.startTime);
    };
    if (event.endTime != null) {
      queryData.create_time = db.command.lte(event.endTime);
    };

    var limit = 20;
    if (event.limit != null) {
      limit = event.limit;
    };

    let result = await db.collection('tcbst_goods').where(queryData).limit(limit).get();

    let list = [];
    if (result.data.length > 0) {
      for (let i = 0; i < result.data.length; i++) {

        let info = [];
        for (let j = 0; j < result.data[i].info; j++){
          info.push({
            subOrderNumber: result.data[i].info[j].sub_order_number,
            itemName: result.data[i].info[j].item_name,
            itemCode: result.data[i].info[j].item_code,
            count: result.data[i].info[j].count,
            image: result.data[i].info[j].image
          });
        };

        list.push({
          orderNumber: result.data[i].order_number,
          bizName: result.data[i].biz_name,
          bizCode: result.data[i].biz_code,
          status: result.data[i].status,
          statusDesc: result.data[i].status_desc,
          info: info,
          payStatus: result.data[i].pay_status,
          amount: result.data[i].amount,
          createTime: result.data[i].create_time,
          updateTime: result.data[i].update_time,
          userName: result.data[i].user_name,
          userMobile: result.data[i].user_mobile,
          userAddress: result.data[i].user_address,
          receiveAddress: result.data[i].receive_address,
          salesman: result.data[i].salesman,
          salesMobile: result.data[i].sales_mobile,
          arrivalTime: result.data[i].arrival_time,
          vaild: result.data[i].vaild
        });
      };
    };

    return {
      error: null,
      list: list,
      timestamp: Math.round(new Date().getTime() / 1000)
    };

  }catch(error){
    console.log(error);
    return { error: error };
  };

}