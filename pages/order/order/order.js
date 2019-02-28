// pages/order/order/order.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: true,
    count: 0,
    sumPrice: 0,
    orderData: [],
    cartId: 0,
    adrId: 0,
    addrData: {},
    saveJson: {},
    phone: "",
    remark: "",
    isNoArea: true,
    mcheckbox: 'mcheckbox-off',
    addressArea:true,
    noAddressArea:false,
    wxChecked:'',
    hasPayModal:true,
    orderId:'',
    lgActive:'active',//包邮选中参数
    stActive:'',//门店自提选中参数
    stgId:'',
    yesContent:true,
    storeGet:true,
    stgName:"",//提货人姓名
    stgPhone:"",//提货人手机
    stgText:"",//提货门店及门店电话
    stgAddress:""//提货门店地址
  },
  /**
   * 提货类型切换事件
   */
  tabTypeClick:function(e){
    var ttype = e.target.dataset.type;
    this.data.lgActive = ttype == 'logistics'?'active':'';
    this.data.stActive = ttype == 'storeGet' ? 'active' : '';
    this.setData({
      lgActive: this.data.lgActive,
      stActive: this.data.stActive,
      storeGet: ttype == 'storeGet'?false:true
    })
  },
  /**
   * 门店自提点击事件
   */
  storeInfoClick:function(){
    var that = this;
    var i = that.data.adrId && that.data.adrId != 'undefind' ? that.data.adrId : "";
    var json = {
      stgName: that.data.stgName,//提货姓名
      stgPhone: that.data.stgPhone,//提货手机
      phone: that.data.phone,//发货通知手机
      remark: that.data.remark//订单备注
    }
    //门店自提跳转前将已输入的提货信息进行缓存，页面跳转回来之后做输入后需清除该缓存
    wx.setStorageSync("stgInput", json);
    wx.setStorageSync('orderParam', { cartId: that.data.cartId, adrId: i })
    var url = "../../address/storeList/storeList?cartId=" + that.data.cartId + "&stgId=" + that.data.stgId;
    app.goto(url);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var stgId = options.stgId;
    this.setData({
      stgId: stgId,
      lgActive: stgId?'':'active',
      stActive: stgId ? 'active' : '',
    })
  },
  /**
   * 获取初始化数据
   */
  initData: function (options) {
    this.getStore();
    this.getGoodsData(options);
    this.getAddress();
  },
  getStore(){
    var that = this;
    if (that.data.stgId){
      //检查缓存内是否有门店自提跳转前已输入的提货信息
      that.setData({
        stgPhone : wx.getStorageSync("stgInput")
          ? wx.getStorageSync("stgInput").stgPhone
          : "",//自提人电话
        stgName : wx.getStorageSync("stgInput")
          ? wx.getStorageSync("stgInput").stgName
          : "",//自提人姓名
        phone : wx.getStorageSync("stgInput")
          ? wx.getStorageSync("stgInput").phone
          : "",//发货通知电话
        remark : wx.getStorageSync("stgInput")
          ? wx.getStorageSync("stgInput").remark
          : "",//订单备注
      })
      var jsontext = {};
      jsontext.id = that.data.stgId;
      app.checkLoginAjax({
        url: '/store/detail',
        data: jsontext,
        success: function (res) {
          if (res.code == "000000") {
            wx.removeStorageSync('stgInput')
            that.setData({
              stgText:res.data.name+' '+res.data.tel,
              stgAddress: res.data.address,
              yesContent:false,
              storeGet:false
            })
          }
        }
      });
    }
  },
  /**
   * 获取商品数据
   */
  getGoodsData: function (param) {
    var that = this;
    var json = {};
    if (param.cartId && param.cartId != "undefined") {
      var cartId = param.cartId;
    }
    var token = app.getUserInfo().token;
    json.token = token;
    json.isChoose = 1;
    if (cartId) {
      json.cartIds = cartId;
    }
    app.checkLoginAjax({
      url: '/shoppingCart/get',
      data: json,
      success: function (res) {
        if (res.code == "000000") {
          if (res.data.list.length > 0) {
            that.setData({
              count: res.data.count,
              sumPrice: res.data.sumPrice,
              orderData: res.data.list
            })
          } else {
            that.setData({
              count: res.data.count,
              sumPrice: res.data.sumPrice,
              orderData: [],
              isNoArea: false
            })
          }
        }
      }
    });
  },
  /**
   * 获取收货人
   */
  getAddress: function () {
    var that = this;
    var token = app.getUserInfo().token;
    app.checkLoginAjax({
      url: '/address/list',
      data: { token: token },
      success: function (res) {
        if (res.code == "000000") {
          if (res.data.length > 0) {
            var adata = res.data;
            that.data.addrData = adata[0];
            that.data.phone = adata[0].phone;
            that.data.saveJson.addressId = adata[0].id;
            for (var i = 0; i < adata.length; i++) {
              if (!that.data.adrId || that.data.adrId == "0") {
                if (adata[i].isDefault == 1) {
                  that.data.addrData = adata[i];
                  that.data.phone = adata[i].phone;
                  that.data.saveJson.addressId = adata[i].id;
                }
              } else if (that.data.adrId && that.data.adrId != "0") {
                if (adata[i].id == that.data.adrId) {
                  that.data.addrData = adata[i];
                  that.data.phone = adata[i].phone;
                  that.data.saveJson.addressId = adata[i].id;
                }
              }
            }
            that.setData({
              addrData: that.data.addrData,
              phone: that.data.phone,
              adrId: that.data.saveJson.addressId,
              addressArea: false,
              noAddressArea: true,
              mcheckbox: 'mcheckbox-on',
            })
          } else {
            that.setData({
              addrData: that.data.addrData,
              phone: that.data.phone,
              adrId: that.data.saveJson.addressId,
              addressArea: true,
              noAddressArea: false,
              mcheckbox: 'mcheckbox-off'
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
    var param = wx.getStorageSync('orderParam');
    var adrId = !param.adrId ? "" : param.adrId;
    this.setData({
      cartId: param.cartId,
      adrId: adrId
    })
    this.initData(param);
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
  //新增联系人
  goAddUser:function(){
    var param = wx.getStorageSync('orderParam');
    param.prevUrl = "/pages/order/order/order";
    wx.setStorageSync('orderParam', param);
    var url = "../../address/add/add?cartId=" + that.data.cartId;
    app.goto(url);
  },
  //发货通知checkbox点击事件
  msnCheckEvent:function(){
    var that = this;
    var mcheckbox = that.data.mcheckbox;
    if (mcheckbox=='mcheckbox-off'){
      that.setData({ mcheckbox:'mcheckbox-on'});
    }else{
      that.setData({ mcheckbox: 'mcheckbox-off'});
    }
  },
  //地址管理点击
  addressClick: function () {
    var that = this;
    var i = that.data.adrId && that.data.adrId != 'undefind' ? that.data.adrId : "";
    wx.setStorageSync('orderParam', { cartId: that.data.cartId, adrId: i })
    var url = "../../address/list/list?cartId=" + that.data.cartId + "&adrId=" + that.data.adrId;
    app.goto(url);
  },
  //提货人姓名输入框事件
  stgNameEvent: function (e) {
    var that = this;
    var value = e.detail.value;
    that.setData({
      stgName: value
    });
  },
  //提货人手机输入框事件
  stgPhoneEvent: function (e) {
    var that = this;
    var value = e.detail.value;
    that.setData({
      stgPhone: value
    });
  },
  sendPhone: function (e) {
    var that = this;
    var value = e.detail.value;
    that.setData({
      phone: value
    });
  },
  remark: function (e) {
    var that = this;
    var value = e.detail.value;
    that.setData({
      remark: value
    });
  },
  //微信支付checkbox点击
  wxPayClick:function(){
    var that = this;
    var checked = that.data.wxChecked;
    if (checked == 'checked'){
      that.setData({ wxChecked:''});
    }else{
      that.setData({ wxChecked: 'checked' });
    }
  },
  //支付确定按钮
  paySaveEvent:function(){
    var that = this;
    var orderId = that.data.orderId;
    app.checkLoginAjax({
      url: '/order/wechatAppletPay',
      data: { id: orderId, ip: "127.0.0.1" },
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
                if (res.errMsg == "requestPayment:ok") {
                  wx.showToast({
                    title: '支付成功',
                    icon: 'none',
                    duration: 500
                  })
                  app.goto("/pages/me/myoder/orderdetail/orderdetail?id=" + that.data.orderId)
                } else {
                  console.log("支付失败")
                }
              },
              'fail': function (res) {
                console.log(res)
                if (res.errMsg == "requestPayment:fail cancel") {
                  app.goto("/pages/me/myoder/myoder")
                } else {
                  app.goto("/pages/order/shopCar/shopCar")
                }
              }
            })
        }
      }
    });
  },
  //点击透明背景或关闭按钮隐藏弹窗
  hidePayModal:function(){
    var that = this;
    var oid = that.data.orderId;
    that.setData({ hasPayModal:true});
    app.goto("/pages/me/myoder/orderdetail/orderdetail?id=" + oid);
  },
  createOrder: function (e) {
    var that = this;
    var storeGet = that.data.storeGet;//判断提货类型，true:顺丰包邮；false：门店自提
    var json = {};
    var clist = that.data.orderData;
    var list = [];
    json.smsPhone = that.data.mcheckbox == 'mcheckbox-on' ?that.data.phone:'';
    json.token = app.getUserInfo().token;
    json.source = 3;
    json.remark = that.data.remark;
    json.platform = 3;
    json.channel = wx.getStorageSync('channel');
    if (storeGet){
      json.sendMode = 1;
      json.addressId = that.data.adrId;
    }else{
      json.storeId = that.data.stgId;
      json.sendMode = 2;
      json.receiveUserName = that.data.stgName;
      json.receiveUserPhone = that.data.stgPhone;
      if (!json.storeId) {
        wx.showModal({ title: '提示', showCancel: false, content: "请选择自提门店" });
        return;
      }
      if (!json.receiveUserName) {
        wx.showModal({ title: '提示', showCancel: false, content: "请填写提货人姓名" });
        return;
      }
      if (!/^1[3|4|5|8|7][0-9]\d{4,8}$/.test(json.receiveUserPhone)) {
        wx.showModal({ title: '提示', showCancel: false, content: "请填写正确的提货人手机号码" });
        return;
      }
      if (!json.receiveUserPhone){
        wx.showModal({ title: '提示', showCancel: false, content: "请填写提货人手机号码" });
        return;
      }
    }
    if (!/^1[3|4|5|8|7][0-9]\d{4,8}$/.test(json.smsPhone)) {
      wx.showModal({ title: '提示', showCancel: false, content: "请填写正确的手机号码" });
      return;
    }
    for (var i = 0; i < clist.length; i++) {
      list.push(clist[i].id);
    }
    json.cartId = list.join(',');
    if (clist.length==0){
      return;
    }
    wx.showLoading({
      title: '创建订单中',
    })
    app.checkLoginAjax({
      url: '/order/createOrder',
      data: json,
      success: function (res) {
        if (res.code == "000000") {
          wx.hideLoading();
          that.setData({ 
            orderId: res.data
          });
          that.paySaveEvent();
        }
      }
    });
  }
})