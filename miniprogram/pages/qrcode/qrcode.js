var QR = require("../../utils/qrcode.js");
const { screenWidth, screenHeight, pixelRatio, statusBarHeight } = wx.getSystemInfoSync();
let onOff = false;
Page({
  data: {
    canvasHidden: false,
    imagePath: '',
    placeholder: '疫情防控'//默认二维码生成文本
  },
  onLoad: function (options) {
    const that = this;
    // 页面初始化 options为页面跳转所带来的参数
    var size = that.setCanvasSize();//动态设置画布大小
    that.getUserInfo();
    wx.cloud.callFunction({
      name: 'openapi',
      data: {
        action: 'getOpenData',
      },
      //验证通过
      success: function (res) {
        console.log(res.result.openid)
      },
      fail: function (err) {
        console.log("获取失败：",err)
        wx.showToast({
          icon:'none',
          title: '信息获取失败,请稍后重试~'
        })
      }
    })
    that.createQrCode(that.data.placeholder, "mycanvas", size.w, size.h,'onLoad');
  },
  getUserInfo: function (e) {
    const that = this;
    if(e){
      const userInfo = e.detail.userInfo;
      that.setData({
        isQrCodeStauts:true,
        userInfo
      })
    }else{
      wx.getSetting({
        success (res){
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: function(e) {
                that.setData({
                  userInfo:e.userInfo,
                  isQrCodeStauts:true
                })
              }
            })
          }
        }
      })
    }
  }, 

  /**
  * 生命周期函数--监听页面卸载
  */
  onUnload:function(){
    onOff = false;
  },
  //适配不同屏幕大小的canvas
  setCanvasSize: function () {
    var size = {};
    try {
      var res = wx.getSystemInfoSync();//不同屏幕下canvas的适配比例；设计稿是750宽
      var scale = 750 / 686;
      var width = res.windowWidth / scale;
      var height = width;//canvas画布为正方形
      size.w = width;
      size.h = height;
    } catch (e) {
      // Do something when catch error
      console.log("获取设备信息失败" + e);
    }
    return size;
  },
  createQrCode: function (url, canvasId, cavW, cavH,status) {
    //调用插件中的draw方法，绘制二维码图片
    QR.api.draw(url, canvasId, cavW, cavH);
    setTimeout(() => { 
      this.canvasToTempImage(); 
    }, 1000);
  },
  //获取临时缓存照片路径，存入data中
  canvasToTempImage: function () {
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'mycanvas',
      success: function (res) {
        var tempFilePath = res.tempFilePath;
        that.setData({
          imagePath: tempFilePath,
        });
        if (onOff) {
          wx.hideToast();
          that.previewImg();
        }
        onOff = true;
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },
  //点击图片进行预览，长按保存分享图片
  previewImg: function (e) {
    const that = this;
    var img = that.data.imagePath;
    console.log(img);
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: [img],
      success: function () {
      }
    })
  },
  //扫码生成二维码
  // onScanQrCode: function (e){
  //   const that = this;
  //   wx.scanCode({
  //     success: function (res) {
  //       console.log("扫码信息：", res);
  //       var size = that.setCanvasSize();//动态设置画布大小
  //       that.createQrCode(res.result, "mycanvas", size.w, size.h);
  //     }
  //   })
  // },
  formSubmit: function (e) {
    var that = this;
    var url = e.detail.value.url;
    wx.showToast({
      title: '生成中...',
      icon: 'loading',
      duration: 2000
    });
    var st = setTimeout(function () {
      var size = that.setCanvasSize();
      //绘制二维码
      that.createQrCode(url, "mycanvas", size.w, size.h);
      clearTimeout(st);
    }, 2000)
  },
})