const { version, stage } = require('./config');
require('./utils/libs.js');
//初始化云开发
wx.cloud.init({
  env: stage,
  traceUser: true,
})
App({
  onLaunch: function () {

    /**
     * 更新版本
     */
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        console.log("是否更新版本:",res.hasUpdate)
      })
      updateManager.onUpdateReady(function () {
        wx.showModal({
          content: '发现新版本，请重启当前小程序~',
          confirmColor: '#2f8dd6',
          confirmText: '确定重启',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate()
            }
          }
        })
      })
    }
    this.globalData = {}
  }
})
