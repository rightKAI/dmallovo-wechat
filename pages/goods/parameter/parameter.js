// pages/goods/parameter/parameter.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    eva: "",
    goods: "",
    detail: "active",
    imgDetail:"nav-active",
    parameter:"",
    detailHide:false,
    paramHide:true,
    imgDetails: [],
    paramStr:"",
    paramList:[],
    stoneId: 0,
    styleId: 0,
    doubleRingType: 1,
    type: 2
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
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
      that.doubleRingInitData();
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
      type: that.data.type,
      platform: 2
    }
    if (json.type == "1") {
      stoneId: that.data.stoneId;
    }
    json.token = app.getUserInfo() ? app.getUserInfo().token : "";
    app.ajax({
      url: '/goods/detail',
      data: json,
      success: function (res) {
        if (res.code == "000000") {
          var paramStr = res.data.attr;
          var list = that.data.paramList;
          var pList = paramStr.substring(1, paramStr.length - 1).split(",");
          for (var i = 0; i < pList.length; i++) {
            var json = {};
            json.name = pList[i].split("=")[0];
            json.val = pList[i].split("=")[1];
            list.push(json);
          }
          if (that.data.type == "1") {
            that.setData({
              imgDetails: res.data.ringInfo.detailImgs,
              paramList: list
            })
          }
          if (that.data.type == "3") {
            that.setData({
              imgDetails: res.data.jewelryInfo.detailImgs,
              paramList: list
            })
          }
        }
      }
    });
  },
  /**
  * 对戒数据渲染
  */
  doubleRingInitData: function () {
    var that = this;
    var json = {
      stoneId: that.data.stoneId,
      styleId: that.data.styleId,
      type: that.data.type,
      doubleRingType: that.data.doubleRingType,
      platform: 2
    }
    app.ajax({
      url: '/goods/detail',
      data: json,
      success: function (res) {
        if (res.code == "000000") {
          var paramStr = res.data.attr;
          var list = that.data.paramList;
          var pList = paramStr.substring(1, paramStr.length - 1).split(",");
          for (var i = 0; i < pList.length; i++) {
            var json = {};
            json.name = pList[i].split("=")[0];
            json.val = pList[i].split("=")[1];
            list.push(json);
          }
          if (that.data.doubleRingType == "1" || that.data.doubleRingType=="3"){
            that.setData({
              imgDetails: res.data.femaleRingInfo.detailImgs,
              paramList: list
            })
          }
          if (that.data.doubleRingType == "2") {
            that.setData({
              imgDetails: res.data.manRingInfo.detailImgs,
              paramList: list
            })
          }
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
  
  },
  /**
   * nav点击切换
   */
  clickTab:function(e){
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
  },
  /**
  * nav点击切换
  */
  navClick: function (e) {
    var id = e.target.id;
    var that = this;
    if (id == "imgDetail" && that.data.imgDetail != "nav-active") {
      that.setData({
        imgDetail: "nav-active",
        parameter: "",
        detailHide: false,
        paramHide: true
      })
    }
    if (id == "parameter" && that.data.parameter != "nav-active") {
      that.setData({
        imgDetail: "",
        parameter: "nav-active",
        detailHide: true,
        paramHide: false
      })
    }
  },
})