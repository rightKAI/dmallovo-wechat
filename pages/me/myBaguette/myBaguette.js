var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 显示隐藏
    cxl:false,
    // 店铺名字
    shopName:'',
    // 所在地区
    userPlace:'',
    // 国家
    Result: ['86', '852', '853', '886'],
    // objectResult: [
    //   {
    //     id: 0,
    //     name: '中国 +86',
    //     url: "http://img-dmallovo.oss-cn-shenzhen.aliyuncs.com/icon/ICON-M/make/china.png"
    //   },
    //   {
    //     id: 1,
    //     name: '香港 +852',
    //     url: "http://img-dmallovo.oss-cn-shenzhen.aliyuncs.com/icon/ICON-M/make/china.png"
    //   },
    //   {
    //     id: 2,
    //     name: '澳门 +853',
    //     url: "http://img-dmallovo.oss-cn-shenzhen.aliyuncs.com/icon/ICON-M/make/china.png"
    //   },
    //   {
    //     id: 3,
    //     name: '台湾 +886',
    //     url: "http://img-dmallovo.oss-cn-shenzhen.aliyuncs.com/icon/ICON-M/make/china.png"
    //   }
    // ],
    index: 0,
    // 用户输入的电话
    userPhoName:'',
    // 用户输入的日期
    userDate:'',
    userTime:'',
    // 用户名字
    userName:'',
    // 用户文本
    userTexto:'',
    // 当前店铺ID
    shopId:'44',
    dataTime:"",
    timeFlg:true,
    imgUrls:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var year = new Date().getFullYear();
    var mon = parseInt(new Date().getMonth() + 1 ) > 9 ? parseInt(new Date().getMonth() + 1) : ("0" + parseInt(new Date().getMonth() + 1));
    var day = (new Date().getDate()) > 9 ? new Date().getDate() : ("0" + new Date().getDate());
    var thatDay = year + "-" + mon + "-" + day;
    that.setData({
      thatDay: thatDay
    })
    console.log(thatDay)
    var that = this;
    //获取经纬度和定位门店
    wx.getLocation({
        type: 'wgs84',
        success: function (res) {
            var latitude = res.latitude
            var longitude = res.longitude
            var speed = res.speed
            var accuracy = res.accuracy
            //请求列表接口
            app.ajax({
                url: '/store/getRecentlyStore',
                data: {
                    lat: latitude,
                    lng: longitude
                },
                success: function (res) {
                    var placeInfo=res.data.address;
                    placeInfo=placeInfo.substring(0,3)
                    // 最近的门店名字和最近的门店ID
                    that.setData({
                      shopName: res.data.name,
                      shopId: res.data.id,
                      userPlace:placeInfo
                    })
                }
            });
        }
    })


    //广告位
    app.ajax({
      url: '/advert/list',
      data: {
        pageCode: 'm_index_store_list'
      },
      success: function (res) {
        var infoThePage = res.data;
        infoThePage.forEach(item => {
          //banner
          if (item.placeCode == 'm_index_store_banner') {
            var newInfo = item.contentList
            that.setData({ imgUrls: item.contentList[0] })
          }
        });
      }
    });


  },
  // 跳转门店列表
  goStoreList: function () {
    app.goto('/pages/store/list/list')
    // 跳转tab页面必须这样子跳转
    // wx.switchTab({
    //   url:'../../store/list/list'
    // })
  },
  // 选择器
  //  国家
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  // 日期
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value,
      userDate:e.detail.value,
      timeFlg: false
    })
  },
  // 时间
  bindTimeChange: function(e) {
    this.setData({
      time: e.detail.value,
      userTime:e.detail.value
    })

  },
  // 电话
  bindPho:function(e){
    var pho=e.detail.value
    if(pho.length==11){
      var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
      if (!myreg.test(pho)) {
        wx.showToast({
        title: '手机号有误！',
        icon: 'none',
        duration: 800
      })
      }
    }
    this.setData({
      userPho:pho
    })
  },
  // 名字
  bindUserName:function(e){
    this.setData({
      userName:e.detail.value
    })
  },
  // 留言
  bindTextInfo:function(e){
    this.setData({
      userTexto:e.detail.value
    })
  },
  // 点击出现更多
  moreDown:function(){
    this.setData({
      cxl:(!this.data.cxl)
    })
  },
  // 点击提交预约
  goYuYueInfo:function(e){
    var that=this;
    if (this.data.userName==""){
      wx.showToast({
        title: '请输入您的姓名',
        icon: 'none',
        duration: 1000
      })
      return
    }
    // 用户输入的电话,判断
    var pho=this.data.userPho
    if(pho==undefined){
      wx.showToast({
        title: '请输入手机号！',
        icon: 'none',
        duration: 1000
      })
      return
    }
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
      if (!myreg.test(pho)) {
        wx.showToast({
        title: '手机号有误！',
        icon: 'none',
        duration: 800
        })
        return
      }
      
      // 用户输入的日期
    if(this.data.userDate==''){
      wx.showToast({
        title: '请输入日期',
        icon: 'none',
        duration: 800
        })
        return
    }
    var userToken = wx.getStorageSync('USER_INFO');
    // 用户名字
    var Uname=''
    if(this.data.userName==''||this.data.userName==undefined){
      Uname=''
    }else{
      Uname=this.data.userName
    }
    // 用户文本
    var textInfoMore=this.data.userTexto
    if(this.data.userTexto==''||this.data.userTexto==undefined){
      textInfoMore=''
    }else{
      textInfoMore=this.data.userTexto
    }

    app.ajax({
      url: '/store/saveAppointment',
      data: { 
        token: userToken.token,
        storeId:this.data.shopId,
        phone: pho,
        username:Uname,
        remark:textInfoMore,
        // date:userday,
        platform:3,
        channel: wx.getStorageSync('channel'),
        hourRegion:'',
      },
      success: function (res) {
        if(res.code=='000000'){
          app.goto('/pages/store/baguette/makeSucce/makeSucce?shopname=' + that.data.userDate + "&name=" + that.data.shopName);
          that.setData({
            userName: '',
            pho:'',
            date:'',
            timeFlg: true
          })
        }
      }
    });
  },
  // 跳转成功
  detailTap: function (e) {
    var obj = e.currentTarget.dataset.obj;

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