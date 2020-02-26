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
    date: dayjs().format('YYYY-MM-DD'),
    des:'',
    item:[]
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
    const { array, index, date,des,item } = this.data;
    const showdata={
      temp:array[index],
      des: des,
      date:new Date(date),
      item :item
    };
    console.log(showdata);
    wx.showLoading({
      title: '打卡中',
      mask:true
    })
    wx.cloud.callFunction({
      name:'punchCheckin',
      data:showdata,
      success(res){
        wx.hideLoading();
        if(res.result.code==0){
          wx.redirectTo({
            url: `/pages/punchcardstatus/punchcardstatus?temp=${array[index]}&date=${date}&item=${item.length}`,
          })
        }
        else if(res.result.code==1){
          wx.showModal({
            title:'错误',
            content:'此日期已经打卡了，不能重复打卡',
            showCancel:false
          })
        }
        else{
          wx.showModal({
            title:'错误',
            content:'打卡失败，网路出现故障',
            showCancel:false
          })
        }
      },
      fail(e){
        wx.showModal({
          title:'错误',
          content:'打卡失败，网路出现故障',
          showCancel:false
        })
      }
    })
    
  },
  inputdes(e){
    this.setData({
      des: e.detail.value
    })
  },
  inputitem(e){
    this.setData({
      item: e.detail.value
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
      array: temps,
      days:options.days
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