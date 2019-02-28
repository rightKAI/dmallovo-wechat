// pages/me/logistics/logistics.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logisticsType:"",
    logisticsNum:"",
    infoData:"",
    dataHeader:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this;
    var userToken = wx.getStorageSync('USER_INFO');
    app.checkLoginAjax({
      url: '/order/listExpressState',
      data: {
        token: userToken.token,
        id: options.oid
      },
      success: function (res) {
        if (res.code == "000000") {
          that.setData({
            lastIndex: res.data.stateList.length-1,
            logisticsType: res.data.com,
            logisticsNum: res.data.expressNo,
            infoData: res.data.stateList,
            dataHeader:res.data
          })
        }
      }
    });
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