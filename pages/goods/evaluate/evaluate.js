// pages/goods/evaluate/evaluate.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    eva: "active",
    goods: "",
    detail: "",
    hideContent:false,
    noContent:true,
    edata:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (options.type == "1") {
      wx.setNavigationBarTitle({ title: '求婚钻戒' })
      that.setData({
        hasRing: false,
        hasDouble: true,
        sizeHide: false,
        doubleSizeHide: true,
        letterHide: false,
        doubleLetterHide: true,
        stoneId: options.stoneId,
        styleId: options.styleId,
        stoneParms: false,
        type: 1
      });
      that.initData();
    }
    if (options.type == "2") {
      wx.setNavigationBarTitle({ title: '结婚对戒' })
      that.setData({
        hasRing: true,
        hasDouble: false,
        sizeHide: true,
        doubleSizeHide: false,
        letterHide: true,
        doubleLetterHide: false,
        stoneId: options.stoneId,
        styleId: options.styleId,
        doubleRingType: options.double,
        type: 2
      });
      that.initData();
    }
    if (options.type == "3") {
      wx.setNavigationBarTitle({ title: '饰品' })
      that.setData({
        hasRing: true,
        hasDouble: true,
        sizeHide: false,
        letterHide: true,
        doubleSizeHide: true,
        doubleLetterHide: true,
        stoneId: options.stoneId,
        styleId: options.styleId,
        stoneParms: true,
        type: 3
      });
      that.initData();
    }
  },
  initData: function () {
    var that = this;
    var json = {
      styleId: that.data.styleId,
      page:1,
      limit:20
    }
    app.ajax({
      url: '/goods/listComment',
      data: json,
      success: function (res) {
        if (res.code == "000000") {
          var list = res.data.rows;
          if (list.length>0){
            that.setParam(list)
          }else{
            that.setData({
              hideContent:true,
              noContent:false
            })
          }
        }
      }
    });
  },
  setParam:function(list){
    for(var i=0;i<list.length;i++){
      list[i].imgsList = list[i].imgs.split(',');
      var star = parseInt(list[i].score);
      var slist = [];
      for (var j = 1; j < 6; j++) {
        if (j < star||j==star){
          slist.push("star");
        }else{
          slist.push("nostar");
        }
      }
      list[i].starList = slist;
    }
    this.setData({
      edata:list
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
* 顶部tab切换
*/
  clickTab: function (e) {
    var that = this;
    var styleId = that.data.styleId;
    var type = that.data.type;
    var stoneId = that.data.stoneId;
    var double = that.data.doubleRingType
    var id = e.target.id;
    var that = this;
    if (id == "goods" && that.data.goods != "active") {
      var url = type == "2" ? '../detail/detail?styleId=' + styleId + '&stoneId=' + stoneId + '&type=' + type + '&double=' + double : '../detail/detail?styleId=' + styleId + '&stoneId=' + stoneId + '&type=' + type;
      app.goto(url);
    }
    if (id == "detail" && that.data.detail != "active") {
      var url = type == "2" ? '../parameter/parameter?styleId=' + styleId + '&stoneId=' + stoneId + '&type=' + type + '&double=' + double : '../parameter/parameter?styleId=' + styleId + '&stoneId=' + stoneId + '&type=' + type;
      app.goto(url);
    }
    if (id == "eva" && that.data.eva != "active") {
      var url = type == "2" ? '../evaluate/evaluate?styleId=' + styleId + '&stoneId=' + stoneId + '&type=' + type + '&double=' + double : '../evaluate/evaluate?styleId=' + styleId + '&stoneId=' + stoneId + '&type=' + type;
      app.goto(url);
    }
  }
})