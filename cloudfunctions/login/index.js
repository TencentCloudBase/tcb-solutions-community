// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk');

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = (event, context) => {

  const wxContext = cloud.getWXContext()
  const db = cloud.database();
  const log = cloud.logger();

  /*********云数据库存储  **************/
  db.collection('tcbst_user').where({
    openid: wxContext.OPENID
  }).get().then(res => {

    let nowDate = new Date();

    if (res.data.length == 0) {

      /****新增用户数据记录 */
      db.collection('tcbst_user').add({
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
      }).then(res => {
        console.log('create user:', res);
        let ret = {
          error: null,
          requestId: event.requestId,
          newUser: true,
          update_time: nowDate,
          timestamp: Math.round(new Date().getTime() /1000)
        };
        return ret;
      });

    } else {

      let login_count = res.data[0].login_count + 1;
      let data = {
        login_time: nowDate,
        update_time: nowDate,
        login_count: login_count
      };

      if (event.place != null){
        data.login_place = event.place;
      };
      /****更新用户数据记录 */
      db.collection('tcbst_user').where({
        openid: wxContext.OPENID
      }).update({
        data: data
      }).then(res => {
        console.log('update user:', res);
        return {
          error: null,
          requestId: event.requestId,
          newUser: false,
          update_time: nowDate,
          timestamp: Math.round(new Date().getTime() / 1000)
        };;
      });
    };

  });

}