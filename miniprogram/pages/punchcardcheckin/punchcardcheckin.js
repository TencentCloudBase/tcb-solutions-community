// pages/punchcardcheckin/punchcardcheckin.js
const dayjs = require("./../../utils/dayjs.min.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    symptoms: [
      {
        title: '寒战',
        desc: '发冷'
      },
      {
        id: 1,
        title: '咳痰',
        desc: '气管不适'
      },
      {
        id: 2,
        title: '发烧',
        desc: '37度以上高温'
      },
      {
        id: 3,
        title: '咳痰',
        desc: '气管不适'
      },
      {
        id: 4,
        title: '发烧',
        desc: '37度以上高温'
      },
      {
        id: 5,
        title: '咳痰',
        desc: '气管不适'
      },
      {
        id: 6,
        title: '发烧',
        desc: '37度以上高温'
      },
    ],
    array: [],
    index: 20,
    date: dayjs().format('YYYY-MM-DD')
  },
  bindDateChange: function (e) {
    this.setData({
      date: dayjs(e.detail.value).format('YYYY-MM-DD')
    })
  },
  toHomePage() {
    wx.redirectTo({
      url: '/pages/index/index',
    })
  },
  checkIn() {
    const { array, index, date } = this.data;
    wx.redirectTo({
      url: `/pages/punchcardstatus/punchcardstatus?temp=${array[index]}&date=${date}`,
    })
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let temp = 35;
    let temps = [];
    while(temp < 41){
      temp = temp + 0.1
      temps.push(temp.toFixed(1));
    }
    this.setData({
      array: temps
    })
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