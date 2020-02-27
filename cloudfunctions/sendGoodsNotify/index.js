// 云函数入口文件
const cloud = require('wx-server-sdk')
const moment = require('moment');
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

      if (event.status == 7) {//7、通知用户到货、*4、管理通知用户确认

        let result = await db.collection('tcbst_goods').where({
          order_number: event.orderNumber
        }).get();

        if (result.data.length > 0){
          let data = result.data[0];
          console.log('config.templateId', config.templateId);
          let body = await cloud.openapi.templateMessage.send({
            touser: data.openid,
            page: event.page,
            data: {
              keyword1: {
                value: data.order_number
              },
              keyword2: {
                value: moment(data.createTime).format('YYYY-MM-DD HH:mm')
              },
              keyword3: {
                value: event.receiveAddress
              },
              keyword4: {
                value: event.arrivalTime
              },
              keyword5: {
                value: event.salesMobile
              }
            },
            templateId: config.templateId,
            formId: wxContext.OPENID ,
            emphasisKeyword: 'keyword1.DATA'
          });

          console.log('body', body);
          result = await db.collection('tcbst_goods').where({
            order_number: event.orderNumber
          }).update({
            data: {
              status: event.status,
              sales_mobile: event.salesMobile, 
              receive_address: event.receiveAddress,
              arrival_time: moment(event.arrivalTime, 'YYYY-MM-DD HH:mm'),
              update_time: db.serverDate()
            }
          });

          return {
            error: null,
            requestId: event.requestId,
            timestamp: Math.round(new Date().getTime() / 1000)
          }

        }else{
          return { error: 'goods orderNumber is error' };
        };    

      } else {
        return { error: 'send status is error' };
      };

    } else {
      return { error: 'token data is error' };
    };

  }catch(error){
    console.log(error);
    return { error: error };
  };

}