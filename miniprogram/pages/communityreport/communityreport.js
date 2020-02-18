// miniprogram/pages/communityreport/communityreport.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    communityReportData: {
      reportType: 1,
      remark: '',
      images: []
    },
    notificationText:'测试测试测试123测试测试测试123测试测试测试123测试测试测试123测试测试测试123测试测试测试123测试测试测试123测试测试测试123测试测试测试123测试测试测试123测试测试测试123测试测试测试123测试测试测试123测试测试测试123测试测试测试123测试测试测试123测试测试测试123测试测试测试123测试测试测试123测试测试测试123',
    notificationTextPosition: 0
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
   * 切换举报场景
   */
  choiceSituation: function (e) {
    let communityReportData = this.data.communityReportData
    communityReportData.reportType = e.target.dataset.type
    this.setData({
      communityReportData
    })
  },
  /**
   * 选择图片
   */
  chooseImage: function(e){
    let communityReportData = this.data.communityReportData
    let imageIndex = e.target.dataset.imgindex
    let _this = this
    wx.chooseImage({
      count: 1,
      success: function(res) {
        communityReportData.images[imageIndex] = res.tempFilePaths[0]
        _this.setData({
          communityReportData
        })
      },
    })
  },
  /**
   * 点击删除图片 
   */
  deleteImage: function(e) {
    let communityReportData = this.data.communityReportData
    let imageIndex = e.target.dataset.imgindex
    communityReportData.images.splice(imageIndex, 1)
    this.setData({
      communityReportData
    })
  },
  /**
   * 监听备注栏的输入事件
   */
    remarkChange: function (e) {
      let communityReportData = this.data.communityReportData
      communityReportData.remark = e.detail.value
      this.setData({
        communityReportData
      })
      console.log(this.data.communityReportData)
    },
})