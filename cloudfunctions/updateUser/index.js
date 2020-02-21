// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: 'cloud-tcb' });
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {

  const wxContext = cloud.getWXContext()

  try{

    var nowDate = new Date();
    var data = {
      name: event.name,
      nick_name: event.nickName,
      mobile: event.mobile,
      city: event.city,
      province: event.province,
      country: event.country,
      update_time: nowDate
    };

    if (event.address != null) {
      data.address = event.address;
    };
    if (event.age != null) {
      data.age = event.age;
    };
    if (event.certificateType != null) {
      data.certificate_type = event.certificateType;
    };
    if (event.certificateNumber != null) {
      data.certificate_number = event.certificateNumber;
    };
    if (event.place != null) {
      data.place = event.place;
    };
    if (event.areaId != null) {
      data.area_id = event.areaId;
    };

    var result = await db.collection('tcbst_user').where({
      openid: wxContext.OPENID
    }).update({
      data: data
    });

    return {
      error: null,
      requestId: event.requestId,
      updateTime: nowDate,
      timestamp: Math.round(new Date().getTime() / 1000)
    };

  }catch(error){
    console.log(error);
    return { error: error };
  };
}