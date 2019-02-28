// pages/me/myoder/orderdetail/orderdetail.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 订单详情头部
    headCity: '',
    // 订单详情商品
    headShop: '',
    // 订单详情data
    maxText: '',
    //
    arrayList:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var userToken = wx.getStorageSync('USER_INFO');
    // 初始化获取订单信息
    app.ajax({
      url: '/order/detail',
      data: {
        token: userToken.token,
        id: options.id
      },
      success: function (res) {
        // 处理4C
        var tempList = res.data.goodsList;
        for (var i = 0; i < tempList.length; i++) {
          var filtrt = tempList[i].params;
          filtrt = JSON.stringify(filtrt);
          var pink = "";
          pink = filtrt.substring(1, filtrt.length - 1);
          pink = pink.replace(/主石净度"/g, "");
          pink = pink.replace(/切工"/g, "");
          pink = pink.replace(/主石颜色"/g, "");
          pink = pink.replace(/主石重量"/g, "");
          pink = pink.replace(/\"/g, "");
          pink = pink.replace(/:/g, " ");
          pink = pink.replace(/,/g, " ");

          tempList[i].params = pink
        }
        // 订单状态处理
        var odreInfoData = res.data;
        if (odreInfoData.status == 1) {
          odreInfoData.status = "等待付款";
        }
        if (odreInfoData.status == 2) {
          odreInfoData.status = "已取消";
        }
        if (odreInfoData.status == 3) {
          odreInfoData.status = "已付款";
        }
        if (odreInfoData.status == 4) {
          odreInfoData.status = "待发货";
        }
        if (odreInfoData.status == 5) {
          odreInfoData.status = "已发货";
        }
        if (odreInfoData.status == 6) {
          odreInfoData.status = "已到店";
        }
        if (odreInfoData.status == 7) {
          odreInfoData.status = "待自提";
        }
        if (odreInfoData.status == 8) {
          odreInfoData.status = "已提取";
        }
        if (odreInfoData.status == 9) {
          odreInfoData.status = "待评价";
        }
        if (odreInfoData.status == 10) {
          odreInfoData.status = "已评价";
        }
        if (odreInfoData.status == 11) {
          odreInfoData.status = "已完成";
        }
        // 订单支付处理
        if (odreInfoData.payment == 0) {
          odreInfoData.payment = "未支付";
        }
        if (odreInfoData.payment == 1) {
          odreInfoData.payment = "支付宝";
        }
        if (odreInfoData.payment == 2) {
          odreInfoData.payment = "微信";
        }
        if (odreInfoData.sendMode == '1'){
          odreInfoData.sendModeText = '物流配送';
        }
        if (odreInfoData.sendMode == '2') {
          odreInfoData.sendModeText = '门店自提';
        }
        that.setData({
          //订单详情头部
          headCity: res.data.sendMode == '1' ? res.data.userAddressDTO : res.data,
          //订单详情商品
          headShop: tempList,
          //订单详情data
          maxText: odreInfoData,
          //
          arrayList: res.data,
          sendMode: res.data.sendMode
        })
      }
    })
  },
  //评论
  unboxBtn:function(){
    app.goto("/pages/me/unboxing/unboxing");
  },
  // 支付订单
  buyMoney: function (e) {
    var orderId = e.currentTarget.dataset.id;
    app.goto("/pages/order/paymet/paymet?id=" + orderId);
  },
  // 跳转客服
  goKefu: function () {
    console.log("我在找客服")
  },
  //跳转评价
  goPingJia: function (e) {
    var orderId = e.currentTarget.dataset.oid;
    app.goto('/pages/me/unboxing/comment/comment?shopid=' + orderId);
  },
  // 取消订单
  qxOrder: function (e) {
    var that = this;
    var userToken = wx.getStorageSync('USER_INFO');
    var orderId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '决定放弃购买？',
      content: '要不......再想想？',
      confirmColor: '#001a88',
      success: function (res) {
        if (res.confirm) {
          // 确定
          app.ajax({
            url: '/order/cancel',
            data: {
              token: userToken.token,
              id: orderId
            },
            success: function (res) {
              // that.onLoad()
              app.goto('../../myoder/myoder');
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
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