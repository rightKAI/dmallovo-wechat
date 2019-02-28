// pages/me/myBaguette/isEnterBagutter/isEnterBagutter.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ArrayList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userToken = wx.getStorageSync('USER_INFO');
    var that = this;
    //请求列表接口 
    app.ajax({
      url: '/store/listAppointment',
      data: {
        token: userToken.token
      },
      success: function (res) {
        var tempList = res.data;
        that.setData({
          ArrayList: tempList
        });
      }
    });
  },
  // 跳转门店列表
  goStoreList: function () {
    // 跳转tab页面必须这样子跳转
    wx.reLaunch({
      url:'/pages/store/list/list'
    })
  },
  //购物车跳转
  gouwuche: function (e) {
    app.goto('/pages/order/shopCar/shopCar');
  },
  //过期重新预约门店
  makeBtn:function(){
    app.goto('/pages/store/list/list');
  },
  // 发送到手机
  goUserPho: function (e) {
    var storeId = e.currentTarget.dataset.id
    var userPhone = e.currentTarget.dataset.phone
    var userToken = wx.getStorageSync('USER_INFO');
    var that = this;
    //请求列表接口
    app.ajax({
      url: '/store/sendStoreLocationSms',
      data: {
        token: userToken.token,
        phone: userPhone,
        storeId: storeId,
        platform: 3,
        channel: wx.getStorageSync('channel')
      },
      success: function (res) {
        if (res.code == '000000') {
          wx.showToast({title: '地址发送成功!', icon: 'success', duration: 2000})
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {}
})