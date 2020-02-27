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

    if (value.openid == wxContext.OPENID && value.areaId.indexOf(event.areaId) != -1) {

      let result = await db.collection('tcbst_goods').where({
        area_id: event.areaId,
        order_number: event.orderNumber
      }).get();

      if (result.data.length > 0){

        let data = result.data[0];

        if ([3, 6, 9, 10].indexOf(event.status) != -1) {//3、商家已处理；6、货物抵达且、9、商家取消；10、退货

          let nowDate = new Date();

          /****更新用户数据记录 */
          let info = data.info;
          for(let i = 0; i < info.length; i++){
            for(let j = 0; j < event.info.length; j++){
              if (info[i].sub_order_number == event.info[i].subOrderNumber){
                if (event.info[j].itemCode != null){
                  info[i].item_code = event.info[j].itemCode;
                };
                if (event.info[j].image != null) {
                  info[i].image = event.info[j].image;
                };
                if (event.info[j].timestamp != null) {
                  info[i].timestamp = event.info[j].timestamp;
                };
              };
            };
          };

          for (let i = 0; i < event.info.length; i++) {
            info.push({
              count: event.info[i].count
            });
          };
          
          let upData = {
            status: event.status,
            status_desc: event.statusDesc,
            update_time: nowDate
          };
          if (event.vaild != null){
            upData.vaild = event.vaild;
          };
          if (event.payStatus != null) {
            upData.pay_status = event.payStatus;
          };
          if (event.amount != null) {
            upData.amount = event.amount;
          };
          if (event.receiveAddress != null) {
            upData.receive_address = event.receiveAddress;
          };
          if (event.salesman != null) {
            upData.salesman = event.salesman;
          };
          if (event.salesMobile != null) {
            upData.sales_mobile = event.salesMobile;
          };
          if (event.info != null) {
            upData.info = event.info;
          };
          if (event.arrivalTime != null) {
            upData.arrival_time = event.arrivalTime;
          };

          let result = await db.collection('tcbst_goods').where({
            _id: data._id
          }).update({
            data: upData
          });

          return {
            error: null,
            update_time: nowDate,
            timestamp: Math.round(new Date().getTime() / 1000)
          };

        } else {
          return { error: 'update status is error' };
        };
      }else{
        return {error: 'orderNumber is error'};
      };

    } else {
      return { error: 'token data is error' };
    };

  }catch(error){
    console.log(error);
    return { error: error };
  };



  

}