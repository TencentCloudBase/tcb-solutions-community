// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: 'cloud-tcb' });
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {

  const wxContext = cloud.getWXContext();

  try {

    var queryData = {
      area_id: event.areaId
    };

    if (event.bizName != null) {
      queryData.biz_name = event.bizName;
    };
    if (event.address != null) {
      queryData.address = event.address;
    };
    if (event.bizCode != null) {
      queryData.biz_code = event.bizCode;
    };
    if (event.telephone != null) {
      queryData.telephone = event.telephone;
    };

    var result = await db.collection('tcbst_biz').where(queryData).get();

    var list = [];
    if (result.data.length > 0) {

      for (let i = 0; i < result.data.length; i++) {
        list.push({
          bizCode: result.data[i].biz_code,
          bizName: result.data[i].biz_name,
          address: result.data[i].address,
          telephone: result.data[i].telephone,
          dept: result.data[i].dept,
          contacts: result.data[i].contacts,
          mobile: result.data[i].mobile,
          msg: result.data[i].msg,
          place: result.data[i].place,
          type: result.data[i].type,
          typeDesc: result.data[i].typeDesc,
          attach: result.data[i].attach
        });
      };

    };

    return {
      requestId: event.requestId,
      error: null,
      list: list,
      timestamp: Math.round(new Date().getTime() / 1000)
    };

  }catch(error){
    console.log(error);
    return { error: error };
  };

}