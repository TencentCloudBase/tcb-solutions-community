// pages/punchcardlist/punchcardlist.js
const util = require("./../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      {
        id:1,
        content: '今天体温37.1度，一切正常，还需要适当运动，增加蛋白质的摄入。',
        date: util.formatDate(new Date(2020,2,21,10,30,40)),
        imgUrl: 'cloud://cloud-tcb.636c-cloud-tcb-1301077292/images/1_1.png',
      },
      {
        id: 2,
        content: '今天体温37.0度，需要多运动了，胖了一些。',
        date: util.formatDate(new Date(2020, 2, 1, 8, 56, 40)),
        imgUrl: 'cloud://cloud-tcb.636c-cloud-tcb-1301077292/images/2_1.png',
      },
      {
        id: 3,
        content: '今天体温37.3度，没有不正常反应。',
        date: util.formatDate(new Date(2020, 1, 28, 8, 34, 40)),
        imgUrl: 'cloud://cloud-tcb.636c-cloud-tcb-1301077292/images/3_1.png',
      },
      {
        id: 4,
        content: '今天体温37.2度，到楼下购物，买一些日常用品。一切正常，还需要适当运动，增加蛋白质的摄入。',
        date: util.formatDate(new Date(2020, 1, 23, 9, 48, 40)),
        imgUrl: 'cloud://cloud-tcb.636c-cloud-tcb-1301077292/images/1_1.png',
      },
      {
        id: 5,
        content: '今天体温37.4度，天气不错，没有什么不好的东西。一切正常，还需要适当运动，增加蛋白质的摄入。',
        date: util.formatDate(new Date(2020, 1, 22, 9, 54, 32)),
        imgUrl: 'cloud://cloud-tcb.636c-cloud-tcb-1301077292/images/2_1.png',
      },
      {
        id: 6,
        content: '今天体温37.0度，早上起床比较晚，要多一些好的东西学习。一切正常，还需要适当运动，增加蛋白质的摄入。',
        date: util.formatDate(new Date(2020, 1, 21, 11, 30, 2)),
        imgUrl: 'cloud://cloud-tcb.636c-cloud-tcb-1301077292/images/3_1.png',
      },
    ]

  },

  toCheckIn(){
    wx.redirectTo({
      url: '/pages/punchcardcheckin/punchcardcheckin',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})