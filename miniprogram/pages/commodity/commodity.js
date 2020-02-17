// pages/commodity/commodity.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time:'09:00',
    TabCur: 3,
    nav:[
      {
        id:0,
        title:'采购交流'
      },
      {
        id: 1,
        title: '采购通知'
      },
      {
        id: 2,
        title: '采购登记'
      },
      {
        id: 3,
        title: '采购查看'
      }
    ]
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

  },

  /**
   * 用户自定义函数
   */
  tabSelect(e) {
    console.log(e.currentTarget.dataset.id)
    this.setData({
      TabCur: e.currentTarget.dataset.id,
    })
  }
})