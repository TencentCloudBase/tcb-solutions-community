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
    let punchitem = {
      date:event.date,
      temp:event.temp,
      des:event.des,
      item:event.item
    }
    if(users.length!=0){
      let today = (await db.collection('tcbst_punch').where({
        _id:event.userInfo.openId,
        punchList: _.elemMatch({
          date:_.eq(punchitem.date)
        })
      }).get()).data;
  
      if(today.length==0){
        await db.collection('tcbst_punch').doc(event.userInfo.openId).update({
          data:{
            punchList:_.push(punchitem)
          }
        });
        d.code = 0;
      }
      else{
        d.code = 1;
      }
    }
    else{
      await db.collection('tcbst_punch').add({
        data:{
          _id:event.userInfo.openId,
          punchList:[punchitem]
        }
      });
      d.code = 0;
    }
  }
  catch(e){
    d.code = -1;
    console.log(e);
  }
  return d;
}