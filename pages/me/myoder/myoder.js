// pages/me/myoder/myoder.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 切换判断
    selected: false,
    selected1: true,
    selected2: false,
    //待付款状态栏
    obliNumText: '',
    // 待付款数据
    obligation: [],
    //全部订单状态栏
    numText: "",
    //全部订单
    orderShop: [],
    //已完成
    OKtion: [],
    OKnumText: ""//状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if(options.formMe){
      that.setData({
        selected: true,
        selected1: false,
        selected2: false,
      })
    }
    var userToken = wx.getStorageSync('USER_INFO');
    // 待付款订单 请求列表接口
    app.ajax({
      url: '/order/myOrder',
      data: {
        token: userToken.token,
        status: 1
      },
      success: function (res) {
        var tempList = res.data.orderList;
        that.setData({obliNumText: res.data.waitPay})
        for (var i = 0; i < tempList.length; i++) {
          tempList[i]
            .goodsList
            .forEach(element => {
              var filtrt = element.params;
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
              pink = pink.replace(/--/g, "");
              element.params = pink
            });
          if (tempList[i].status == 1) {
            tempList[i].status = "待付款";
          } else if (tempList[i].status !== 1) {
            tempList[i].status = "";
          }
        }
        that.setData({obligation: tempList});
      }
    });


     // 已完成 请求列表接口
    app.ajax({
      url: '/order/myOrder',
      data: {
        token: userToken.token,
        status: 10
      },
      success: function (res) {
        var tempList = res.data.orderList;
        that.setData({ OKnumText: res.data.waitPay })
        for (var i = 0; i < tempList.length; i++) {
          tempList[i]
            .goodsList
            .forEach(element => {
              var filtrt = element.params;
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
              pink = pink.replace(/--/g, "");
              element.params = pink
            });
          if (tempList[i].status == 10) {
            tempList[i].status = "已完成";
          } else if (tempList[i].status !== 1) {
            tempList[i].status = "";
          }
        }
        that.setData({ OKtion: tempList });
      }
    });

    // 全部订单 请求列表接口
    app.ajax({
      url: '/order/myOrder',
      data: {
        token: userToken.token,
        status: ''
      },
      success: function (res) {
        that.setData({numText: res.data.all})
        var tempList = res.data.orderList
        tempList.forEach(element => {
          // 订单状态处理
          if (element.status == 1) {
            element.status = "待付款";
          }
          if (element.status == 2) {
            element.status = "已取消";
          }
          if (element.status == 3) {
            element.status = "已付款";
          }
          if (element.status == 4) {
            element.status = "待发货";
          }
          if (element.status == 5) {
            element.status = "已发货";
          }
          if (element.status == 6) {
            element.status = "已到店";
          }
          if (element.status == 7) {
            element.status = "待自提";
          }
          if (element.status == 8) {
            element.status = "已提取";
          }
          if (element.status == 9) {
            element.status = "待评价";
          }
          if (element.status == 10) {
            element.status = "已评价";
          }
          if (element.status == 11) {
            element.status = "已完成";
          }
          // 商品4C处理
          element
            .goodsList
            .forEach(item => {
              if (item.lettering == null) {
                item.lettering = ''
              }

              var filtrt = item.params;
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
              pink = pink.replace(/null/g, "");
              pink = pink.replace(/--/g, "");
              item.params = pink
            });
        });
        that.setData({orderShop: tempList})
      }
    });
  },
  //更新数据
  updateData:function(){  
    var that = this;
    var userToken = wx.getStorageSync('USER_INFO');
    // 待付款订单 请求列表接口
    app.ajax({
      url: '/order/myOrder',
      data: {
        token: userToken.token,
        status: 1
      },
      success: function (res) {
        var tempList = res.data.orderList;
        that.setData({ obliNumText: res.data.waitPay })
        for (var i = 0; i < tempList.length; i++) {
          tempList[i]
            .goodsList
            .forEach(element => {
              var filtrt = element.params;
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
              pink = pink.replace(/--/g, "");
              element.params = pink
            });
          if (tempList[i].status == 1) {
            tempList[i].status = "待付款";
          } else if (tempList[i].status !== 1) {
            tempList[i].status = "";
          }
        }
        that.setData({ obligation: tempList });
      }
    });


    // 已完成 请求列表接口
    app.ajax({
      url: '/order/myOrder',
      data: {
        token: userToken.token,
        status: 10
      },
      success: function (res) {
        var tempList = res.data.orderList;
        that.setData({ OKnumText: res.data.waitPay })
        for (var i = 0; i < tempList.length; i++) {
          tempList[i]
            .goodsList
            .forEach(element => {
              var filtrt = element.params;
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
              pink = pink.replace(/--/g, "");
              element.params = pink
            });
          if (tempList[i].status == 10) {
            tempList[i].status = "已完成";
          } else if (tempList[i].status !== 1) {
            tempList[i].status = "";
          }
        }
        that.setData({ OKtion: tempList });
      }
    });

    // 全部订单 请求列表接口
    app.ajax({
      url: '/order/myOrder',
      data: {
        token: userToken.token,
        status: ''
      },
      success: function (res) {
        that.setData({ numText: res.data.all })
        var tempList = res.data.orderList
        tempList.forEach(element => {
          // 订单状态处理
          if (element.status == 1) {
            element.status = "待付款";
          }
          if (element.status == 2) {
            element.status = "已取消";
          }
          if (element.status == 3) {
            element.status = "已付款";
          }
          if (element.status == 4) {
            element.status = "待发货";
          }
          if (element.status == 5) {
            element.status = "已发货";
          }
          if (element.status == 6) {
            element.status = "已到店";
          }
          if (element.status == 7) {
            element.status = "待自提";
          }
          if (element.status == 8) {
            element.status = "已提取";
          }
          if (element.status == 9) {
            element.status = "待评价";
          }
          if (element.status == 10) {
            element.status = "已评价";
          }
          if (element.status == 11) {
            element.status = "已完成";
          }
          // 商品4C处理
          element
            .goodsList
            .forEach(item => {
              if (item.lettering == null) {
                item.lettering = ''
              }

              var filtrt = item.params;
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
              pink = pink.replace(/null/g, "");
              pink = pink.replace(/--/g, "");
              item.params = pink
            });
        });
        that.setData({ orderShop: tempList })
      }
    });
  },
  // 切换tab全部订单
  selected1: function (e) {
    this.setData({ selected: false, selected1: true, selected2: false })
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },
  // 切换tab待付款订单
  selected: function (e) {
    this.setData({ selected1: false, selected: true, selected2: false})
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },
  // 切换tab已完成订单
  selected2: function (e) {
    this.setData({ selected1: false, selected: false, selected2: true})
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },

  //选购钻戒跳转
  xuangou: function (e) {
    app.goto('/pages/goods/list/list');
  },
  //购物车跳转
  gouwuche: function (e) {
    app.goto('/pages/order/shopCar/shopCar');
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
              that.updateData()
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 前往订单详情
  orderDetailGo: function (e) {
    var orderId = e.currentTarget.dataset.id;
    app.goto('./orderdetail/orderdetail?id=' + orderId);
  },
  // 支付订单
  buyMoney: function (e) {
    var orderId = e.currentTarget.dataset.id;
    var that = this;
    var orderId = orderId;
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
                  app.goto("/pages/me/myoder/orderdetail/orderdetail?id=" + that.data.id)
                } else {
                  console.log("支付失败")
                }
              },
              'fail': function (res) {
                console.log(res)
                if (res.errMsg == "requestPayment:fail cancel") {
                  
                } else {
                  app.goto("/pages/order/shopCar/shopCar")
                }
              }
            })
        }
      }
    });
  },
  // 跳转客服
  goKefu: function () {
    console.log("我在找客服")
  },
  //跳转评价
  goPingJia:function(e){
    var orderId = e.currentTarget.dataset.oid;
    app.goto('/pages/me/unboxing/comment/comment?shopid=' + orderId);
  },
  //跳转到商品详情
  goGoods:function(e){
    var item = e.currentTarget.dataset.obj;
    console.log(item)
    var stoneId = item.stoneId;
    var style = item.goodsId;
    var stype = item.type;
    if (stype == '2') {
      var styleno = item.styleno;
      var double = styleno.substring(styleno.length - 1) == 'G' ? 2 : 3;
      var url = "/pages/goods/detail/detail?stoneId=" + stoneId + "&styleId=" + style + "&type=" + stype + "&double="+double;
    } else {
      var url = "/pages/goods/detail/detail?stoneId=" + stoneId + "&styleId=" + style + "&type=" + stype;
    }
    app.goto(url);
  },
  //跳转到物流跟踪
  goLogistics:function(e){
    var oid = e.currentTarget.dataset.oid;
    var url = "/pages/me/logistics/logistics?oid="+oid;
    app.goto(url);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.updateData();
  },

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