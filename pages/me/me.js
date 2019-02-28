// pages/me/me.js
var app = getApp();
//文件引用  
var CusBase64 = require('./userInfo/base64.js');  
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Mmys:true,
    // 我的订单
    orderAll:[
      {
        imgUrl:'http://img-dmallovo.oss-cn-shenzhen.aliyuncs.com/icon/ICON-WebChar/me/icon_GRZX_02.png',
        name:'待付款',
        id:1,
        count:0
      },
      {
        imgUrl:'http://img-dmallovo.oss-cn-shenzhen.aliyuncs.com/icon/ICON-WebChar/me/icon_GRZX_04.png',
        name:'待收货',
        id:2,
        count: 0
      },
      {
        imgUrl:'http://img-dmallovo.oss-cn-shenzhen.aliyuncs.com/icon/ICON-WebChar/me/icon_GRZX_03.png',
        name:'待评价',
        id:3,
        count: 0
      },
      {
        imgUrl:'http://img-dmallovo.oss-cn-shenzhen.aliyuncs.com/icon/ICON-WebChar/me/icon_GRZX_06.png',
        name:'售后/换货',
        id:4
      },
    ],
    // 其他功能
    otherAll:[
      {
        imgUrl:'http://img-dmallovo.oss-cn-shenzhen.aliyuncs.com/icon/ICON-WebChar/me/icon_GRZX_05.png',
        name:'地址管理'
      },
      {
        imgUrl:'http://img-dmallovo.oss-cn-shenzhen.aliyuncs.com/icon/ICON-WebChar/me/icon_GRZX_01.png',
        name:'帮助中心'
      },
      {
        imgUrl:'http://img-dmallovo.oss-cn-shenzhen.aliyuncs.com/icon/ICON-WebChar/me/icon_GRZX_07.png',
        name:'在线客服'
      },
      {
        imgUrl:'http://img-dmallovo.oss-cn-shenzhen.aliyuncs.com/icon/ICON-WebChar/me/icon_GRZX_08.png',
        name:'电话咨询'
      },
    ],
    name: "用户登录",
    iconUrl:"http://img-dmallovo.oss-cn-shenzhen.aliyuncs.com/icon/ICON-M/touxiang.png",
    appointmentCount: 0,//预约门店数量
    collectCount: 0,//收藏数量
    shoppingCartCount: 0,//购物车数量
    //真爱誓言
    existsPromise:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfo = app.getUserInfo();
    var that = this;
    if (userInfo){
      var token = userInfo.token;
      that.getOrderStatus(token);
      var json = {};
      json.token = token;
      app.checkLoginAjax({
        url: '/user/info',
        data: json,
        success: function (res) {
          if (res.code == "000000") {
            that.setData({
              name: res.data.nickName,
              iconUrl: res.data.iconUrl
            })
          }
        }
      });
    }
  },
  getOrderStatus: function (token){
    var json = {};
    var that = this;
    json.token = token;
    app.checkLoginAjax({
      url: '/order/myOrderStatusCount',
      data: json,
      success: function (res) {
        if (res.code == "000000") {
          var orderStatus = res.data;
          that.data.orderAll[0].count = orderStatus.waitPay>0?true:false;
          that.data.orderAll[1].count = orderStatus.waitReceiveCount?true:false;
          that.data.orderAll[2].count = orderStatus.waitSeedBack>0?true:false;
          that.setData({
            orderAll: that.data.orderAll,
            appointmentCount: orderStatus.appointmentCount,
            collectCount: orderStatus.collectCount,
            shoppingCartCount: orderStatus.shoppingCartCount,
            existsPromise: orderStatus.isExistsPromise
          })
        }
      }
    });
  },
  onTel: function (e) {
    var tel = e.target.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: tel //仅为示例，并非真实的电话号码
    })
  },
  //真爱宣言跳转
  oath:function(){
    app.goto('../loveOath/loveSut/loveSut')
  },
  // 判断去订单页面
  goOder:function(e){
    var userID=e.currentTarget.dataset.id;
    if(userID==1){
      app.goto('./myoder/myoder?formMe=true')
    }
    if(userID==2){
      app.goto('./myoder/myoder')
    }
    if(userID==3){
      app.goto('./unboxing/unboxing')
    }
    if(userID==4){
      console.log("4444444444444")      
    }
  },
  // 去全部订单
  goALLOrder:function(){
    app.goto('./myoder/myoder')
  },
  //头部预约
  goUserYuYue:function(){
    var that=this;
    var userToken = wx.getStorageSync('USER_INFO');
    // userToken.token
    //请求列表接口
    app.ajax({
      url: '/store/listAppointment',
      data: {
        token:userToken.token
      },
      success: function (res) {
        app.goto('./myBaguette/isEnterBagutter/isEnterBagutter')
        // if (res.data == "") {
        //   app.goto('./myBaguette/isEnterBagutter/isEnterBagutter')
        // } else {
        //   app.goto('./myBaguette/isEnterBagutter/isEnterBagutter')
        // }
      }
    });
  },
  //预约进店
  goUserjindian:function(){
    app.goto('/pages/store/list/list')
  },
  /**去购物车**/
  goShopCar:function(){
    app.goto('/pages/order/shopCar/shopCar')
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
    var userInfo = app.getUserInfo();
    var that = this;
    if (userInfo) {
      var token = userInfo.token;
      var json = {};
      that.getOrderStatus(token);
      json.token = token;
      app.checkLoginAjax({
        url: '/user/info',
        data: json,
        success: function (res) {
          if (res.code == "000000") {
            that.setData({
              name: res.data.nickName,
              iconUrl: res.data.iconUrl
            })
          }
        }
      });
    }else{
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '登录已失效，请重新登录！',
        success: function (res) {
          console.log(res)
          if (res.confirm) {
            app.goto('/pages/log/log')
          }
        }
      });
    }
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
   * 绑定手机、帮助中心、个人资料、意见反馈点击事件
   */
  userClick:function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    var name = that.data.otherAll[index].name;
    if(name=="地址管理"){
      var url = "/pages/me/address/address";
      app.goto(url);
    }
    if(name=="帮助中心"){
      var url = "/pages/me/myhelp/myhelp";
      app.goto(url);
    }
    if(name=="电话咨询"){
      wx.makePhoneCall({
        phoneNumber: '400-076-1901' //仅为示例，并非真实的电话号码
      })
    }
  },
  /**
   * 收藏点击
   */
  goMyCollect:function(){
    var url="/pages/me/myCollect/collect";
    app.goto(url);
  },
  /**
   * 切换账号
   */
  cutAccount:function(){
    var url = "/pages/log/log";
    app.goto(url);
  },
  // 更换头像
  updateShow:function () {
    var url = "/pages/me/userInfo/userInfo";
    app.goto(url);
    // var that = this;
    // wx.chooseImage({
    //   count: 1,
    //   success: function (res) {
    //     var tempFilePaths = res.tempFilePaths
    //     that.setData({
    //       imgUrl: tempFilePaths[0]
    //     })
    //     wx.uploadFile({
    //       url: 'https://wechat.dmallovo.com/user/uploadUserIcon',
    //       filePath: that.data.imgUrl,
    //       name: 'image',
    //       formData: {
    //         'token': app.getUserInfo().token
    //       },
    //       success: function (res) {
    //         var data = res.data
    //         wx.showToast({
    //           title: "更改头像成功!", icon: "none"
    //         })
    //         var token = app.getUserInfo().token;
    //         var json = {};
    //         json.token = token;
    //         app.checkLoginAjax({
    //           url: '/user/info',
    //           data: json,
    //           success: function (res) {
    //             if (res.code == "000000") {
    //               console.log("照片地址:" + res.data.iconUrl);
    //               that.setData({
    //                 name: res.data.nickName,
    //                 iconUrl: res.data.iconUrl
    //               })
    //             }
    //           }
    //         });
    //       }
    //     })
    //   }
    // })
  },
  //底部菜单事件处理函数
  bottomMenuTap: function (e) {
    var url = e.currentTarget.dataset.url;
    if (url == "/pages/order/shopCar/shopCar") {
      app.goto(url);
    } else {
      wx.reLaunch({
        url: url
      })
    }
  }
})