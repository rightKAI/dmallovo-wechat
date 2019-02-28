// pages/order/paymet/paymet.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    paymet: true,
    id:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      id: options.id
    })
  },
  pay:function(){
    var that = this;
    app.checkLoginAjax({
      url: '/order/wechatAppletPay',
      data: { id: that.data.id,ip:"127.0.0.1"},
      success: function (res) {
        if (res.code == "000000") {
          var param = res.data;
          wx.requestPayment(
            {
              'timeStamp': param.timeStamp,
              'nonceStr': param.nonceStr,
              'package': param.package,
              'signType': 'MD5',
              'paySign': param.paySign,
              'success': function (res) {
                if (res.errMsg == "requestPayment:ok"){
                  app.goto("/pages/me/myoder/orderdetail/orderdetail?id=" + that.data.id)
                }else{
                  console.log("支付失败")
                }
              },
              'fail': function (res) { 
                console.log(res)
                if (res.errMsg == "requestPayment:fail cancel"){
                  app.goto("/pages/me/myoder/myoder")
                }else{
                  app.goto("/pages/order/shopCar/shopCar")
                }
              }
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