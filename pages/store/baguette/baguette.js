// pages/store/baguette/baguette.js
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
    // 国家
    Result: [' 86', ' 852', ' 853', ' 886'],
    /*
    objectResult: [
      {
        id: 0,
        name: '中国 +86',
        url: "http://img-dmallovo.oss-cn-shenzhen.aliyuncs.com/icon/ICON-M/make/china.png"
      },
      {
        id: 1,
        name: '香港 +852',
        url: "http://img-dmallovo.oss-cn-shenzhen.aliyuncs.com/icon/ICON-M/make/china.png"
      },
      {
        id: 2,
        name: '澳门 +853',
        url: "http://img-dmallovo.oss-cn-shenzhen.aliyuncs.com/icon/ICON-M/make/china.png"
      },
      {
        id: 3,
        name: '台湾 +886',
        url: "http://img-dmallovo.oss-cn-shenzhen.aliyuncs.com/icon/ICON-M/make/china.png"
      }
    ],
    */
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
    shopId:'',
    //门店数据
    imgStote:"",
    //经纬度
    latText:"",
    lngText:"",
    place:"",
    cityPlace:"",
    hotCity:[],
    dpTitle:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var year = new Date().getFullYear();
    var mon = new Date().getMonth() > 9 ? new Date().getMonth() : ("0" + new Date().getMonth());
    var day = (new Date().getDate()) > 9 ? new Date().getDate():("0" + new Date().getDate());
    var thatDay = year+"-"+mon+"-"+day;
    wx.setNavigationBarTitle({ title: options.name })
    that.setData({
      shopName:options.name,
      shopId:options.id,
      thatDay: thatDay
    })
    //获取门店详情
    app.ajax({
      url: '/store/detail',
      data: { urlKey: options.key,platform:3 }, //从options获取页面参数
      success: function (res) {
        var tempDetail = res.data;
        that.setData({
          startTime: tempDetail.openTime,
          closeTime: tempDetail.closeTime,
          imgStote: tempDetail,
          latText: tempDetail.lat,
          lngText: tempDetail.lng,
          place: tempDetail.address,
          cityPlace: tempDetail.cityName,
          dpTitle: tempDetail.title
        });
        console.log(that.data.dpTitle)
      }
    });

    var locaCache = wx.getStorageSync("locaCac");
    if (!locaCache) {
      //获取经纬度和定位门店
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          var locaCache = {};
          locaCache.lat = res.latitude;
          locaCache.lot = res.longitude;
          wx.setStorageSync("locaCache", locaCache);
          //请求列表接口
          that.cityHot(locaCache);//热门城市
        }
      })
    } else {
      that.cityHot(locaCache);//热门城市
    }
  
  },
  //热门城市
  cityHot: function (location) {
    var that = this;
    var json = {
      lat: location.lat,
      lng: location.lot,
    }
    app.ajax({
      url: '/store/cityList',
      data: json,
      success: function (res) {
        var tempList = res.data;
        that.setData({
          hotCity: tempList
        });
      }
    });
  },
  // 选择器
  //  国家
  bindPickerChange: function(e) {
   // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  // 日期
  bindDateChange: function(e) {
  //  console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value,
      userDate:e.detail.value
    })
  },
  // 时间
  bindTimeChange: function(e) {
   // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value,
      userTime:e.detail.value
    })
  },
  // 电话
  bindPho:function(e){
   // console.log(e.detail.value)
    this.setData({
      userPho:e.detail.value
    })
  },
  // 名字
  bindUserName:function(e){
  //  console.log(e.detail.value)
    this.setData({
      userName:e.detail.value
    })
  },
  // 留言
  bindTextInfo:function(e){
   // console.log(e.detail.value)
    this.setData({
      userTexto:e.detail.value
    })
  },
  //拨打电话
  onTel: function (e) {
    var tel = e.currentTarget.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: tel //仅为示例，并非真实的电话号码
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
    var token = wx.getStorageSync('USER_INFO').token;
    if(token==''||token==undefined||token==null){
      token=''
    }
    // 用户输入的电话
    var pho=this.data.userPho
    // 用户输入的日期
   // var userday=this.data.userDate+' '+this.data.userTime
    var userday = this.data.userDate 
    // 用户名字
    var Uname=''
    if(this.data.userName==''||this.data.userName==undefined){
      Uname=''
    }else{
      Uname=this.data.userName
    }
    if (!pho) {
      wx.showToast({ title: "请填写手机号码", icon: "none" })
      return;
    }
    if (!/^1[3|4|5|8|7][0-9]\d{4,8}$/.test(pho) || pho.length < 11) {
      wx.showToast({ title: "请填写正确的手机号码", icon: "none" })
      return;
    }
    // 用户文本
    // var textInfoMore=this.data.userTexto
    // if(this.data.userTexto==''||this.data.userTexto==undefined){
    //   textInfoMore=''
    // }else{
    //   textInfoMore=this.data.userTexto
    // }
    // var time1=this.data.userDate
    // var time2=this.data.userTime
    // if (!time1||!time2){
    //   wx.showModal({ title: '提示', showCancel: false, content: "请选择预约时间" });
    //   return;
    // }
    var time1 = this.data.userDate
    if (!time1) {
      wx.showModal({ title: '提示', showCancel: false, content: "请选择预约时间" });
      return;
    }



    app.ajax({
      url: '/store/saveAppointment',
      data: { 
        token: token,
        storeId:this.data.shopId,
        phone: pho,
        username:Uname,
        remark:"",
        date:userday,
        platform:3,
        channel: wx.getStorageSync('channel'),
        hourRegion:'',
      }, //从options获取页面参数
      success: function (res) {
        app.goto('./makeSucce/makeSucce?shopname=' + time1 + "&name=" + that.data.shopName);
      }
    });
  },
  // 跳转成功
  detailTap: function (e) {
    var obj = e.currentTarget.dataset.obj;
    
  }, 
  //地图 
  mapClick:function(e){
  var that=this;
  var latitude = Number(that.data.latText)
  var longitude = Number(that.data.lngText)
  wx.openLocation({
    latitude: latitude,
    longitude: longitude,
    scale: 15,
    name: that.data.cityPlace,
    address: that.data.place
  })
  },

  /**
   * 点击修改跳转到列表
   */
  editClick:function(){
    var url = "/pages/store/list/list";
    app.goto(url);
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