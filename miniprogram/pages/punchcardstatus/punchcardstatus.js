const dayjs = require("./../../utils/dayjs.min.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: dayjs().format('YYYY-MM-DD'),
    temp: 37.1,
    type: "succ" // ["succ", "warn"]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      temp: options.temp,
      date: options.date
    })
    const normalTemp = 37.2;
    if (options.temp > normalTemp){
      this.setData({
        type: 'warn'
      });
    }
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