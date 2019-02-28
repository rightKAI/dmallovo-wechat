
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    all:false,
    ring:true,
    doubleOrJewelry:true,
    isActive:"all",
    allNum:0,
    ringNum: 0,
    qitaNum: 0,
    allList:[],
    isNoArea:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var token = app.getUserInfo().token;
    var json = {};
    json.token = token;
    app.checkLoginAjax({
      url: '/collect/list',
      data: json,
      success: function (res) {
        if (res.code == "000000") {
          var list = res.data;
          if(list.length>0){
            var rnum = 0;
            var qitaNum = 0;
            for(var i=0;i<list.length;i++){
                if(list[i].type == '1'){
                  rnum = rnum+1;
                }
                if (list[i].type == '2' || list[i].type == '3') {
                  qitaNum = qitaNum + 1;
                }
            }
            that.setData({
              allNum: list.length,
              ringNum: rnum,
              qitaNum: qitaNum,
              allList:list,
              isNoArea:true
            })
          }else{
            that.setData({
              allNum: 0,
              ringNum: 0,
              qitaNum: 0,
              allList: [],
              isNoArea:false
            })
          }
        }
      }
    });
  },

  //选购钻戒跳转
  xuangou: function (e) {
    app.goto('/pages/goods/list/list');
  },
  //购物车跳转
  gouwuche: function (e) {
    app.goto('/pages/order/shopCar/shopCar');
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
   * 点击Tab
   */
  tabClick:function(e){
    var that = this;
    var id = e.target.id;
    if (that.data.isActive!=id){
      var all = id=="all"?false:true;
      var ring = id=="ring"?false:true;
      var dj = id=="doubleOrJewelry"?false:true;
      that.setData({
        isActive: id,
        all:all,
        ring:ring,
        doubleOrJewelry:dj
      });
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 300
      })
    }
  },
  /**
   * 点击商品跳转到详情页
   */
  goodsClick:function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    var param = that.data.allList[index];
    if(param.type == '2'){
      var url = "/pages/goods/detail/detail?double=1&stoneId="+param.stoneId+'&styleId='+param.styleId+'&type='+param.type;
    }else{
      var url = "/pages/goods/detail/detail?stoneId=" + param.stoneId + '&styleId=' + param.styleId + '&type=' + param.type;
    }
    app.goto(url);
  },
  /**
   * 取消收藏
   */
  cancelClick:function(e){
    var that = this;
    var json = {};
    var token = app.getUserInfo().token;
    var index = e.target.dataset.index;
    var param = that.data.allList[index];
    json.token = token;
    json.styleId = param.styleId;
    json.stoneId = param.stoneId;
    app.checkLoginAjax({
      url: '/collect/cancel',
      data: json,
      success: function (res) {
        if (res.code == "000000") {
        wx.showToast({ title: "取消收藏成功", icon: "none" })
         that.updateData();
        }
      }
    });
  },
  /**
   * 更新数据
   */
  updateData:function(){
    var that = this;
    var token = app.getUserInfo().token;
    var json = {};
    json.token = token;
    app.checkLoginAjax({
      url: '/collect/list',
      data: json,
      success: function (res) {
        if (res.code == "000000") {
          var list = res.data;
          if (list.length > 0) {
            var rnum = 0;
            var qitaNum = 0;
            for (var i = 0; i < list.length; i++) {
              if (list[i].type == '1') {
                rnum = rnum + 1;
              }
              if (list[i].type == '2' || list[i].type == '3') {
                qitaNum = qitaNum + 1;
              }
            }
            that.setData({
              allNum: list.length,
              ringNum: rnum,
              qitaNum: qitaNum,
              allList: list,
              isNoArea:true
            })
          }else{
            that.setData({
              allNum: 0,
              ringNum: 0,
              qitaNum: 0,
              allList: [],
              isNoArea:false
          })
          }
        }
      }
    });
  }
})
