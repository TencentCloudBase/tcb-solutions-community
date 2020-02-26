const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  let d={};
  try{
    const users = (await db.collection('tcbst_punch').where({
      _id:event.userInfo.openId
    }).get()).data;
    if(users.length!=0){
      d.data = users[0].punchList;
      d.code = 0;
    }
    else{
      d.data = [];
      d.code = 0;
    }
  }
  catch(e){
    d.code = -1;
    console.log(e);
  }
  return d;
}