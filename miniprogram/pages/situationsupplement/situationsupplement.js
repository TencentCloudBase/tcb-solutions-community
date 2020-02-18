// miniprogram/pages/situationsupplement/situationsupplement.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPicker: false,
    reportData: {
      link: null,
      address: null,
      remark: '',
      latitude: null,
      longitude:null
    },
    
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
   * 打开地图选择位置
   */
  chooseArea: function() {
    let _this = this;
    wx.chooseLocation({
      success: function(res) {
        console.log(JSON.stringify(res))
        let reportData = _this.data.reportData
        reportData.address = res.address + res.name
        reportData.latitude = res.latitude
        reportData.longitude = res.longitude
        _this.setData({
          reportData
        })
        console.log(_this.data.reportData)
      }
    })
  },
  /**
   * 监听可信链接变化
   */
  pasteLink(e) {
    let reportData = this.data.reportData
    reportData.link = e.detail.value
    this.setData({
      reportData
    });
  },
  /**
   * 监听备注栏的输入事件
   */
  remarkChange: function(e) {
    let reportData = this.data.reportData
    reportData.remark = e.detail.value
    this.setData({
      reportData
    })
  },
  /**
   * 提交疫情信息上报
   */
  submitSituation: function() {
    let reportData = this.data.reportData
    if (reportData.address === null) {
      wx.showToast({
        title: '请选择地区',
        icon: 'none'
      })
    } else if (reportData.link === null) {
      wx.showToast({
        title: '请粘贴可信链接',
        icon: 'none'
      })
    }else {
      console.log('开始提交了', this.data.reportData)
    }
  }
})