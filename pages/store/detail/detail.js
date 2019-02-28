// pages/store/detail/detail.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    storeDetail:{},
    // 单独图片
    imgArray:'',
    // 门店预约人数
    appointmentCount:'',
    // 地图坐标
    markers:[],
    urlKey:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //请求列表接口
    app.ajax({
      url: '/store/detail',
      data: {urlKey: options.urlKey}, //从options获取页面参数
      success: function (res) {
        var tempDetail = res.data;
        that.setData({
          storeDetail: tempDetail,
          // 单独图片
          imgArray:tempDetail.imgList[0].imgUrl,
          // 地图坐标
          markers:[{
            latitude: tempDetail.lat,  
            longitude: tempDetail.lng,  
            name: tempDetail.name
          }],
          urlKey: options.urlKey
        });
        // 替换标题 
        wx.setNavigationBarTitle({  
          title: tempDetail.name,  
        })  
        that.getBookNum();
      }
    });
    
  },
  getBookNum:function(){
    var that = this;
    // 请求门店城市
    app.ajax({
      url: '/store/cityList',
      data: {
        lat: that.data.markers[0].latitude,
        lng: that.data.markers[0].longitude
      }, //从options获取页面参数
      success: function (res) {
        var tempDetail = res.data;
        that.setData({
          appointmentCount: tempDetail
        });
      }
    });
  },
  onTel: function (e) {
    var tel = e.target.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: tel //仅为示例，并非真实的电话号码
    })
  },
  //预约进店
  goYuYue:function(){
    var that = this;
    var id = that.data.storeDetail.id;
    var name = that.data.storeDetail.name;
    app.goto('/pages/store/baguette/baguette?name=' + name + '&id=' + id + "&key=" + that.data.urlKey);
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