// pages/me/unboxing/comment/comment.js
var app = getApp();
Page({
  data: {
    // 用户信息
    userToken: '',
    // 订单号
    orderId: '',
    // 用户评价信息
    userContxt: '',
    // 商品信息
    shopInfoList: '',
    // 图片上传
    imgs: [],
    userin: true,
    // 评分系统
    stars: [
      0, 1, 2, 3, 4
    ],
    normalSrc: 'http://img-dmallovo.oss-cn-shenzhen.aliyuncs.com/icon/ICON-WebChar/me/unboxing/n' +
        'o-star.png',
    selectedSrc: 'http://img-dmallovo.oss-cn-shenzhen.aliyuncs.com/icon/ICON-WebChar/me/unboxing/f' +
        'ull-star.png',
    halfSrc: 'http://img-dmallovo.oss-cn-shenzhen.aliyuncs.com/icon/ICON-WebChar/me/unboxing/f' +
        'ull-star.png',
    key: 0 //评分
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var userToken = wx.getStorageSync('USER_INFO');
    // 获取订单ID
    var orderid = options.shopid
    that.setData({
      orderId: orderid,
      userToken:userToken.token
    })
    // 待评价
    app.ajax({
      url: '/order/commentOrder',
      data: {
        token: userToken.token,
        // token: '7111e1f1-cfa6-4114-a80d-cc8509f82bd7',
        isComment: 0,
        orderGoodsId: orderid
      },
      success: function (res) {
        var tempList = res.data[0]
        if(res.data.length==0){
          return
        }
        var filtrt = tempList.params;
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
        tempList.params = pink

        that.setData({shopInfoList: tempList})
        console.log(that.data.shopInfoList)
      }
    });
  },
  bindTextAreaBlur: function (e) {
    this.setData({userContxt: e.detail.value})
  },
  // 上传图片
  chooseImg: function (e) {
    var that = this;
    var imgs = this.data.imgs;
    if (imgs.length >= 10) {
      this.setData({lenMore: 1, userin: false});
      setTimeout(function () {
        that.setData({lenMore: 0});
      }, 2500);
      return false;
    }
    wx.chooseImage({
      // count: 1, // 默认9
      sizeType: [
        'original', 'compressed'
      ], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: [
        'album', 'camera'
      ], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        var imgs = that.data.imgs;
        // console.log(tempFilePaths + '----');
        for (var i = 0; i < tempFilePaths.length; i++) {
          if (imgs.length >= 10) {
            that.setData({imgs: imgs, userin: false});
            return false;
          } else {
            imgs.push(tempFilePaths[i]);
          }
        }
        // console.log(imgs);
        if (imgs.length >= 10) {
          that.setData({userin: false});
        }
        that.setData({imgs: imgs});
      }
    });
  },
  // 删除图片
  deleteImg: function (e) {
    var imgs = this.data.imgs;
    var index = e.currentTarget.dataset.index;
    imgs.splice(index, 1);
    this.setData({imgs: imgs, userin: true});
  },
  // 预览图片
  previewImg: function (e) {
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    //所有图片
    var imgs = this.data.imgs;
    wx.previewImage({
      //当前显示图片
      current: imgs[index],
      //所有图片
      urls: imgs
    })
  },
  //点击右边,半颗星
  selectLeft: function (e) {
    var key = e.currentTarget.dataset.key
    if (this.data.key == 0.5 && e.currentTarget.dataset.key == 0.5) {
      //只有一颗星的时候,再次点击,变为0颗
      key = 0;
    }
    // 取整
    key = key.toFixed(0)
    console.log("得" + key + "分")
    this.setData({key: key})
  },
  //点击左边,整颗星
  selectRight: function (e) {
    console.log(e)
    var key = e.currentTarget.dataset.key
    console.log("得" + key + "分")
    // 取整
    key = key.toFixed(0)
    this.setData({key: key})
  },
  //  点击评价
  goPingjia: function () {
    // debugger
    var that = this;
    if (that.data.key == 0) {
      console.log("11111111111")
    }
    var stonid = ''
    if (that.data.shopInfoList.stoneId == null) {
      stonid = ''
    } else {
      stonid = that.data.shopInfoList.stoneId
    }
    var userImgList=that.data.imgs;
    // 上传评价信息
    app.ajax({
      url: '/order/addCommentWithoutImg',
      data: {
        orderId: that.data.orderId,
        orderGoodsId: that.data.orderId,
        token: that.data.userToken,
        score: that.data.key,
        context: that.data.userContxt,
        stoneId: stonid,
        styleId: that.data.shopInfoList.goodsId,
        styleNo: that.data.shopInfoList.styleno,
        status: 2
      },
      success: function (res) {
        console.log(123);
        // 用户上传ID
        var userGOImgID=res.data
        // 用户目前选择的图片列表
        var useImg=that.data.imgs
        if(useImg.length==0){
          app.goto('../unboxing')
        }else{
          // 循环上传
        for(var i=0;i<userImgList.length;i++){
          wx.uploadFile({
            url: app.globalData.url + '/order/uploadCommentImg',
            filePath: useImg[i],
            name: 'image',
            formData:{
              id:userGOImgID,
              token:that.data.userToken
            },
            success: function(res){
              if(res.statusCode==200){
                wx.showToast({
                  title: "上传成功!", icon: "none"
                })
                app.goto('../unboxing')
              }else{
                wx.showToast({
                  title: "上传失败!", icon: "none"
                })
              }
            }
          })
        }
        app.goto('/pages/me/unboxing/unboxing')
        }
        
      }
    });
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