// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: 'cloud-tcb' });
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {

  try{

    const wxContext = cloud.getWXContext();

    if ([5, 8].indexOf(event.status) != -1) {//5：用户确认需求，8、用户完成交易

      let nowDate = new Date();
      /****更新物资订单数据记录 */
      let result = await db.collection('tcbst_goods').where({
        orderNumber: event.orderNumber,
        openid: wxContext.OPENID
      }).update({
        data: {
          status: event.status,
          status_desc: event.statusDssc,
          update_time: nowDate
        }
      });

      return {
        error: null,
        requestId: event.requestId,
        updateTime: nowDate,
        timestamp: Math.round(new Date().getTime() / 1000)
      };

    } else {
      return { error: 'status is error' };
    };
    
  }catch(error){
    console.log(error);
    return { error: error };
  };


}