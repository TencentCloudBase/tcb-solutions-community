// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk');
const signIn = require('./signIn');
cloud.init({ env: 'cloud-tcb' });
const db = cloud.database();

exports.main = async (event, context) => {

  const wxContext = cloud.getWXContext();

  try{

    /*********云数据库存储查询  **************/
    var result = await db.collection('tcbst_user').where({
      openid: wxContext.OPENID
    }).get();
    var nowDate = new Date();

    if (result.data.length > 0){
      /****更新用户数据记录 */
      let login_count = result.data[0].login_count + 1;
      let data = {
        login_time: nowDate,
        update_time: nowDate,
        login_count: login_count
      };
      if (event.place != null) {
        data.login_place = event.place;
      };

      /****更新用户数据记录 */
      let body = await db.collection('tcbst_user').where({
        openid: wxContext.OPENID
      }).update({
        data: data
      });

      /***********管理员登录 */
      let adminToken = await signIn({ openid: wxContext.OPENID, db: db });
      console.log('adminToken', adminToken);
      let ret = {
        error: null,
        requestId: event.requestId,
        newUser: false,
        update_time: nowDate,
        timestamp: Math.round(new Date().getTime() / 1000)
      };

      if (adminToken.error === null){
        ret.token = adminToken.token;
      };

      return ret;

    }else{

      /****新增用户数据记录 */
      let body = await db.collection('tcbst_user').add({
        data: {
          openid: wxContext.OPENID,
          env: wxContext.ENV,
          unionid: wxContext.UNIONID,
          source: wxContext.SOURCE,
          login_place: event.place,
          login_count: 1,
          login_time: nowDate,
          valid: true,
          role: 1,
          create_time: nowDate,
          update_time: nowDate
        }
      });

      return {
        error: null,
        requestId: event.requestId,
        newUser: true,
        update_time: nowDate,
        timestamp: Math.round(new Date().getTime() / 1000)
      };
       
    };

  }catch(error){
    console.log(error);
    return { error: error };
  };
};

