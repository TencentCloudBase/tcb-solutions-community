// pages/punchcardlist/punchcardlist.js
const util = require("./../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  toCheckIn(){
    wx.redirectTo({
      url: `/pages/punchcardcheckin/punchcardcheckin?days=${this.data.list.length+1}`,
    })
  },

  onShow: function () {
    let that = this;
    wx.cloud.callFunction({
      name:'punchList',
      success(res){
        const list = res.result.data.sort(function(a,b){
          return new Date(b.date) - new Date(a.date)
        });
        console.log(list);
        that.setData({
          list:list
        })
      },
      fail(e){
        console.log(e);
      }
    })
  }
})