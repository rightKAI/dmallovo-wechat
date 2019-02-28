// pages/store/list/list.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //热门城市
    allSe:false,
    city: '',
    hotCity:[],
    cityClick:false,
    //全部门店
      storeList: [],
      //距离最近
      juliStore: [],
      Mstores:true,
      //tabs
      selected: true,
      selected1: false,
      selected2: false,
      //城市筛选
      cityList:[],
      hide:true,
      isScroll: true,
       //存储定位
      latitudeHot:"",
      longitudeHot:"",
      xID:""
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var locaCache = wx.getStorageSync("locaCac");
    var that = this;
    if (!locaCache){
      //获取经纬度和定位门店
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          var locaCache = {};
          locaCache.lat = res.latitude;
          locaCache.lot = res.longitude;
          wx.setStorageSync("locaCache", locaCache);
          //请求列表接口
          that.getStoreList(locaCache);
          that.cityHot(locaCache);//热门城市
        }
      })
    }else{
      that.getStoreList(locaCache);
      that.cityHot(locaCache);//热门城市
    }

    wx.getSystemInfo({
      success: function (res) {
        var _h = res.windowHeight;
        that.setData({ wheight: _h + 'px', modalHeight: (res.windowHeight - 140) + 'px' })
      }
    });   

    this.loadInfo();  
  },
  //获取城市定位
  loadInfo: function () {
    var that = this
    wx.getLocation({
      type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标  
      success: function (res) {
        var longitude = res.longitude
        var latitude = res.latitude
        that.loadCity(longitude, latitude)
      },
      fail: function () {
        // fail  
      },
      complete: function () {
        // complete  
      }
    })
  }, 
  loadCity: function (longitude, latitude) {
    var that = this
    wx.request({
      url: 'https://api.map.baidu.com/geocoder/v2/?ak=ABUG5YQFITPSdwTt9e7vIRsXYCIow28Q&location=' + latitude + ',' + longitude + '&output=json',
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        // success  
        var city = res.data.result.addressComponent.city;
        city = city.substr(0, city.length - 1);
         that.setData({ city: city });
      },
      fail: function () {
        // fail  
      },
      complete: function () {
        // complete  
      }
    })
  },

  //底部认证七句话链接跳转
  approveUrl: function (e) {
    var id = e.currentTarget.dataset.id
    app.goto('/pages/me/myhelp/helpinfo/helpinfo?helpid=' + id);
  },


 
  //导航切换
  selected: function (e) {
    this.setData({
      selected1: false,
      selected: true,
      selected2: false
    })
    var that = this;
    var json = {
      lat: that.data.latitudeHot,
      lng: that.data.longitudeHot
    }
    //请求列表接口
    app.ajax({
      url: '/store/list?page=1&limit=6',
      data: json,
      success: function (res) {
        var tempList = res.data.rows;
        that.setData({
          storeList: tempList,
          juliStore: tempList,
        });
      }
    });
  },
  selected1: function (e) {
    this.setData({
      selected: false,
      selected1: true,
      selected2: false
    })
  },
  //城市筛选
  showtabs: function (e) {
     this.setData({
       hide:false,
       isScroll:false
     })
  },
  /*关闭筛选弹出层*/
  closeShaixian: function (e) {
    this.setData({
      hide: true,
      isScroll: true
    })
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
        var tempList = res.data.cityList;
        that.setData({
          hotCity: tempList
        })
      }
    });
  },

  //获取门店列表数据
  getStoreList:function(location){
    var that = this;
    var json = {
      lat: location.lat,
      lng: location.lot
    }
    //请求列表接口
    app.ajax({
      url: '/store/list?page=1&limit=6',
      data: json,
      success: function (res) {
        var tempList = res.data.rows;
        that.setData({
          storeList: tempList,
          juliStore:tempList,
          latitudeHot: location.lat,
          longitudeHot: location.lot
        });
      }
    });
  },
  //热门城市点击事件 
  cityBtn: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    this.setData({
      allSe: false,
      'currentItem': id,
       xId:id
    });
  },
  //全部
  allBtn: function (e) {
    var that = this;
    this.setData({
      allSe: true,
      'currentItem': "",
      xId: ""
    });
  },
  //提交确定
  subit:function(e){
    var that = this;
    console.log(that.data.xId)
    if (that.data.xId!=""){
      var json = {
        lat: that.data.latitudeHot,
        lng: that.data.longitudeHot,
        cityId: that.data.xId
      }
      app.ajax({
        url: '/store/list?page=1&limit=6',
        data: json,
        success: function (res) {
          var tempList = res.data.rows;
          that.setData({
            storeList: tempList,
            juliStore: tempList,
            hide: false,
            isScroll: true,
            selected1:true,
            selected:false
          });
        }
      });
    }else{
      var json = {
        lat: that.data.latitudeHot,
        lng: that.data.longitudeHot
      }
      app.ajax({
        url: '/store/list?page=1&limit=6',
        data: json,
        success: function (res) {
          var tempList = res.data.rows;
          that.setData({
            storeList: tempList,
            juliStore: tempList,
            hide: false,
            isScroll: true
          });
        }
      });
    }
  },
 


// 跳转详情
  detailTap: function (e) {
    var obj = e.currentTarget.dataset.obj;
    // app.goto('../detail/detail?urlKey=' + obj);
    app.goto('../baguette/baguette?name=' + obj.name + '&id=' + obj.id + "&key=" + obj.urlKey);
  },
  // 跳转预约
  goBand:function(e){
    var obj = e.currentTarget.dataset.obj;
    console.log(obj + "--------" +obj.urlKey )
    app.goto('../baguette/baguette?name=' + obj.name+'&id='+obj.id+"&key="+obj.urlKey);
  },
  onTel:function(e){
    var tel = e.target.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: tel //仅为示例，并非真实的电话号码
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
  //右侧定位的导航预约门店
  mekeIndex: function () {
    app.goto('/pages/me/myBaguette/myBaguette')
  },
  //底部菜单事件处理函数
  bottomMenuTap: function (e) {
    var url = e.currentTarget.dataset.url;
    if (url == "/pages/order/shopCar/shopCar"){
      app.goto(url);
    }else{
      wx.reLaunch({
        url: url
      })
    }
  }
})