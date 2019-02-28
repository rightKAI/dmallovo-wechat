// pages/store/baguette/makeSucce/makeSucce.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopName:'',
    userName:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var name=options.shopname
    var time=options.time
    var pho=options.name
    this.setData({
      // shopName:name+' '+time,
      shopName: name,
      userName:pho
    })
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
   * 查看我的预约
   */
  myBaguette:function(){
    var url = "/pages/me/myBaguette/isEnterBagutter/isEnterBagutter";
    app.goto(url);
  },
  /**
   * 随便逛逛
   */
  goShop:function(){
    var url = "/pages/goods/list/list";
    app.goto(url);
  }
})