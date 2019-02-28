// pages/me/unboxing/unboxing.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 切换判断
    selected: false,
    selected1: false,
    selected0:true,
    //待评价
    evaluationHide: "",
    //已评价
    evaluationQb: "",
    evalLParams:"",
    //评分
    stars: [
      0, 1, 2, 3, 4
    ],
    normalSrc: 'http://img-dmallovo.oss-cn-shenzhen.aliyuncs.com/icon/ICON-WebChar/me/unboxing/n' +
    'o-star.png',
    selectedSrc: 'http://img-dmallovo.oss-cn-shenzhen.aliyuncs.com/icon/ICON-WebChar/me/unboxing/f' +
    'ull-star.png',
    halfSrc: 'http://img-dmallovo.oss-cn-shenzhen.aliyuncs.com/icon/ICON-WebChar/me/unboxing/f' +
    'ull-star.png',
    key: 0,
    //全部评价
    evaluationQuanbu:"",
    evaluationQuanbuText:"",
    evalList:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userToken = wx.getStorageSync('USER_INFO');
    var that = this;
    //全部评价
    app.ajax({
      url: '/order/commentOrder',
      data: {
        // token: '7111e1f1-cfa6-4114-a80d-cc8509f82bd7',
        token: userToken.token
      },
      success: function (res) {
        var tempList = res.data ;
        that.setData({ evaluationQuanbu: res.data })
        for (var i = 0; i < tempList.length; i++) {
          var filtrt = tempList[i]
          filtrt = JSON.stringify(tempList[i].params);
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
          that.setData({
            evalList: pink
          });
        }
       }
    });

    // 待评价
    app.ajax({
      url: '/order/commentOrder',
      data: {
        // token: '7111e1f1-cfa6-4114-a80d-cc8509f82bd7',
        token: userToken.token,
        isComment: 0
      },
      success: function (res) {
        that.setData({evaluationHide: res.data})
      }
    });

    // 已评价
    app.ajax({
      url: '/order/commentOrder',
      data: {
        // token: '7111e1f1-cfa6-4114-a80d-cc8509f82bd7',
        token: userToken.token,
        isComment: 1
      },
      success: function (res) {
        var templistImg = res.data;
        templistImg.forEach(element => {
         
          // 处理用户图片]
          if (element.commentList.length>0&&element.commentList[0].imgs != null){
            element.commentList[0].imgs = element.commentList[0].imgs.split(',')
          }
          //console.log(element.commentList[0])
          // 处理用户星星
         // var pink=[];
          if (element.commentList.length > 0){
            var s = [0,0,0,0,0];
            for (var i = 0; i < element.commentList[0].score; i++) {
              //pink.push('{star:' + i + '}')
              s[i] = 1;
            }
           // element.commentList[0].score = pink
            element.commentList[0].scoreList = s;
          }
        });
        that.setData({evaluationQb: res.data})

        var tempList = res.data;
        for (var i = 0; i < tempList.length; i++) {
          var filtrtList = tempList[i]
          filtrtList = JSON.stringify(tempList[i].params);
          var pink = "";
          pink = filtrtList.substring(1, filtrtList.length - 1);
          pink = pink.replace(/主石净度"/g, "");
          pink = pink.replace(/切工"/g, "");
          pink = pink.replace(/主石颜色"/g, "");
          pink = pink.replace(/主石重量"/g, "");
          pink = pink.replace(/\"/g, "");
          pink = pink.replace(/:/g, " ");
          pink = pink.replace(/,/g, " ");
          pink = pink.replace(/--/g, "");
          tempList[i].evalLParams = pink;
          that.setData({
            evaluationQb: tempList
          })
        }

      

      }
    });
  },
  ordeBtn:function(){
    app.goto('/pages/me/myoder/myoder')
  },
  // 切换tab 
  selected: function (e) {
    this.setData({ selected1: false, selected: true, selected0: false})
  },
  selected1: function (e) {
    this.setData({ selected: false, selected1: true, selected0: false})
  },
  selected0: function (e) {
    this.setData({ selected: false, selected1: false, selected0:true})
  },
  //购物车跳转
  gouwuche: function (e) {
    app.goto('/pages/order/shopCar/shopCar');
  },
  //查看订单
  indentClick:function(e){
    var shopId = e.currentTarget.dataset.shopid
   // app.goto('./orderdetail/orderdetail?id=' + shopId);
    app.goto('/pages/me/myoder/orderdetail/orderdetail?id=' +shopId );
  },
  // 去评价
  gotoPingJia:function(e){
    console.log(e)
    var shopid=e.currentTarget.dataset.shopid
    app.goto('./comment/comment?shopid='+shopid)
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