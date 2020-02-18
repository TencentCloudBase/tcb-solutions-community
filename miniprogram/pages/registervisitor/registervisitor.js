/* 社区疫情防疫 */
Page({
  /* 数据 */
  data: {
    otherText: 0
  },
  /* 页面加载 */
  onLoad(options) {},
  /* 页面载入 */
  onReady() {},
  /* 页面显示 */
  onShow() {},
  /* 页面隐藏 */
  onHide() {},
  /* 页面卸载 */
  onUnload() {},
  /* 页面下拉刷新 */
  onPullDownRefresh() {},
  /* 页面触底 */
  onReachBottom() {},
  /* 页面分享 */
  onShareAppMessage() {},

  back() {
    wx.navigateBack({
      delta: 1,
    })
  },

  inputOther(e) {
    console.log(e)
    if (e.detail.cursor > 190) {
      wx.showToast({
        title: '还可以输入' + (200 - e.detail.cursor) + '个字',
        duration: 1000,
        icon: 'none'
      })
    }
    this.setData({
      otherText: e.detail.cursor
    })
  }
})