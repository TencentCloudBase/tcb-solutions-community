// pages/virusmap/virusmap.js

const mockCommunities = [{
    "province": "广东省",
    "city": "深圳市",
    "district": "南山区",
    "county": "",
    "street": "",
    "community": "南头街道麒麟花园",
    "show_address": "南头街道麒麟花园",
    "cnt_inc_uncertain": "-1",
    "cnt_inc_certain": "-1",
    "cnt_inc_die": "-1",
    "cnt_inc_recure": "-1",
    "cnt_sum_uncertain": "-1",
    "cnt_sum_certain": "-1",
    "cnt_sum_die": "-1",
    "cnt_sum_recure": "-1",
    "full_address": "广东省深圳市南山区南头街道麒麟花园",
    "release_date": "",
    "article_source": [{
      "title": "最全！深圳这82个小区曾发现“新型肺炎”病人！但大家不用慌",
      "url": "http://wjw.sz.gov.cn/yqxx/202001/t20200131_18994647.htm"
    }],
    "id": "8578f99f7f76e02f49f37f00e9c48dcd",
    "lng": "113.93055",
    "lat": "22.544729",
    "doc_id": "90000052_8578f99f7f76e02f49f37f00e9c48dcd",
    "source": [{
      "name": "深圳市卫健委",
      "url": ""
    }],
    "communitytype": 1,
    "distance": -1
  },
  {
    "province": "广东省",
    "city": "深圳市",
    "district": "南山区",
    "county": "",
    "street": "",
    "community": "南山街道友邻公寓",
    "show_address": "南山街道友邻公寓",
    "cnt_inc_uncertain": "-1",
    "cnt_inc_certain": "-1",
    "cnt_inc_die": "-1",
    "cnt_inc_recure": "-1",
    "cnt_sum_uncertain": "-1",
    "cnt_sum_certain": "-1",
    "cnt_sum_die": "-1",
    "cnt_sum_recure": "-1",
    "full_address": "广东省深圳市南山区南山街道友邻公寓",
    "release_date": "",
    "article_source": [{
      "title": "最全！深圳这82个小区曾发现“新型肺炎”病人！但大家不用慌",
      "url": "http://wjw.sz.gov.cn/yqxx/202001/t20200131_18994647.htm"
    }],
    "id": "68a732fe1c86373a7a28c0380e7ea1e6",
    "lng": "113.929703",
    "lat": "22.531321",
    "doc_id": "90000052_68a732fe1c86373a7a28c0380e7ea1e6",
    "source": [{
      "name": "深圳市卫健委",
      "url": ""
    }],
    "communitytype": 1,
    "distance": -1
  },
  {
    "province": "广东省",
    "city": "深圳市",
    "district": "南山区",
    "county": "",
    "street": "",
    "community": "南山街道学府花园",
    "show_address": "南山街道学府花园",
    "cnt_inc_uncertain": "-1",
    "cnt_inc_certain": "-1",
    "cnt_inc_die": "-1",
    "cnt_inc_recure": "-1",
    "cnt_sum_uncertain": "-1",
    "cnt_sum_certain": "-1",
    "cnt_sum_die": "-1",
    "cnt_sum_recure": "-1",
    "full_address": "广东省深圳市南山区南山街道学府花园",
    "release_date": "",
    "article_source": [{
      "title": "最新！增27个小区！深圳确诊病人到过这些地方",
      "url": "https://mp.weixin.qq.com/s/WHiMvufLOxkOo800shPomQ"
    }],
    "id": "d930fd6c208a031a431e3dd08e4f0fdd",
    "lng": "113.92627",
    "lat": "22.525787",
    "doc_id": "90000052_d930fd6c208a031a431e3dd08e4f0fdd",
    "source": [{
      "name": "深圳市卫健委",
      "url": ""
    }],
    "communitytype": 1,
    "distance": -1
  }
]

Page({

  /**
   * 页面的初始数据
   */
  data: {
    clientHeight: '300px',
    markers: [],
    confirmedPoints: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setMapSize()
    this.getNearCommunities()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  /**
   * 自定义函数
   */
  setMapSize() {
    let self = this
    wx.getSystemInfo({
      success: function(res) {
        const clientHeight = res.windowHeight;
        const clientWidth = res.windowWidth;
        const ratio = 750 / clientWidth;
        const height = clientHeight * ratio;
        self.setData({
          clientHeight: (height - 750) + 'px'
        });
      }
    });
  },

  regionchange(e) {},

  markertap(e) {},

  getNearCommunities() {
    let markers = []
    let confirmedPoints = []
    for (let i = 0; i < mockCommunities.length; i++) {
      markers.push({
        iconPath: "/common/image/icon-location.png",
        id: 0,
        latitude: mockCommunities[i].lat,
        longitude: mockCommunities[i].lng,
        width: 32,
        height: 32
      })
      confirmedPoints.push({
        latitude: mockCommunities[i].lat,
        longitude: mockCommunities[i].lng
      })
    }
    this.setData({
      markers: markers,
      confirmedPoints: confirmedPoints
    })
  }
})