// components/notification/motification.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    notificationText: {
      type: String,
      value: ''
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    notificationTextPosition: 0,
    isShow: true,
    textInterval: null,
  },

  /**
   * 组件声明周期， 激活
   */
  ready: function() {
    // 实现通知消息滚动
    const query = wx.createSelectorQuery().in(this)
    let _this = this;
    let scrollWidth, scrollContentWidth;
    query.selectAll('#notification-scroll').boundingClientRect(function (res) {
      scrollWidth = res[0].width
    }).exec()
    query.selectAll('#scroll-content').boundingClientRect(function (res) {
      scrollContentWidth = res[0].width
    }).exec()

    setTimeout(()=> {
      let position = 0;
      const textInterval = setInterval(() => {
        if (!_this.data.isShow){
          console.log('取消定时器了')
          clearInterval(textInterval)
        }
        if (position > (scrollContentWidth - scrollWidth)) {
          position = 0;
        }
        _this.setData({
          notificationTextPosition: position
        })
        position += 1
      }, 30)


    },1000)
  },
  /**
   * 组件的方法列表
   */
  methods: {
    closeNotification: function() {
      console.log('点击了取消')
      this.setData({
        isShow: false
      })
    }
  }
})
