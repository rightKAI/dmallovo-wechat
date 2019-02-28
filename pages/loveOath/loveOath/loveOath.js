// pages/loveOath/loveOath/loveOath.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    DateHot:"",
    indexCheckbox:true,
    seName:"",
    meName:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //时间
      var now = new Date();
      var year = now.getFullYear(); //年
      var month = now.getMonth() + 1; //月
      var day = now.getDate(); //日
      var clock = year + "-";
      if (month < 10) clock += "0";
      clock += month + "-";
      if (day < 10) clock += "0";
      clock += day + " ";
      this.setData({
        DateHot: clock
      });
  },

  sheName: function (e) {
    this.setData({
      seName: e.detail.value
    })
  },
  meName: function (e) {
    this.setData({
      meName: e.detail.value
    })
  },
  //真爱宣言选中
  checkboxBtn:function(){
    var that = this;
    if (that.data.indexCheckbox == true) {
      that.setData({
        indexCheckbox:false
      })
    } else {
      that.setData({
        indexCheckbox: true
      })
    }
  },
  //提交宣言
  oathBtn:function(){
    if (this.data.seName==""){
      wx.showToast({ title: "请填写她的姓名", icon: "none" })
      return;
    }
    if (this.data.meName == "") {
      wx.showToast({ title: "请填写您的姓名", icon: "none" })
      return;
    }
    if (this.data.indexCheckbox == false) {
      wx.showToast({ title: "请勾选“并接受「爱的卖身契」”", icon: "none" })
      return;
    }
    var token = app.getUserInfo().token;
    var json = {};
    json.token = token;
    json.dearName = this.data.seName;
    json.promiseName = this.data.meName;
    app.ajax({
      url: '/promise/addPromise',
      data: json,
      success: function (res) {
        setTimeout(function () {
          app.goto('../../order/order/order')
        }, 1000);
      }
    });
   // 
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