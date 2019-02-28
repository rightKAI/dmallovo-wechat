// 地址管理js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    adrList: [],
    adrId: 0,
    cartId: 0,
    longitude: '',
    latitude: '',
    id:'',
    activeIndex:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id:options.stgId
    })
  },
  initData: function () {
    var that = this;
    that.loadInfo();
  },
  getStoreList:function(){
    var that = this;
    var json = {
      lat: that.data.latitude,
      lng: that.data.longitude
    }
    //请求列表接口
    app.ajax({
      url: '/store/list?page=1&limit=6',
      data: json,
      success: function (res) {
        console.log(res.code)
        var tempList = res.data.rows;
        if (res.code == "000000") {
          if (tempList.length > 0) {
            for (var i = 0; i < tempList.length; i++) {
              if (tempList[i].id == that.data.id) {
                that.setData({
                  activeIndex:i
                })
                tempList[i].checkbox = 'checked';
              } else {
                tempList[i].checkbox = '';
              }
            }
            that.setData({
              adrList: tempList
            })
            console.log(tempList)
          }
        }
      }
    });
  },
  //获取城市定位
  loadInfo: function () {
    var that = this
    wx.getLocation({
      type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标  
      success: function (res) {
        var longitude = res.longitude
        var latitude = res.latitude
        that.setData({
          longitude: longitude,
          latitude: latitude
        });
        that.getStoreList();
      },
      fail: function () {
        // fail  
      },
      complete: function () {
        // complete  
      }
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
    var param = wx.getStorageSync('orderParam');
    var adrId = !param.adrId ? "" : param.adrId;
    this.setData({
      cartId: param.cartId,
      adrId: adrId
    })
    this.initData();
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
   * 新建联系人
   */
  addNewUser: function () {
    var that = this;
    var cartId = that.data.cartId;
    var adrId = that.data.adrId;
    var pervUrl = '/pages/address/list/list';
    var param = wx.getStorageSync('orderParam');
    param.prevUrl = pervUrl;
    wx.setStorageSync('orderParam', param)
    var url = "/pages/address/add/add?cartId=" + cartId + "&adrId=" + adrId;
    app.goto(url);
  },
  /**
   * 编辑联系人
   */
  editClick: function (e) {
    var that = this;
    var index = e.target.dataset.index;
    var list = that.data.adrList;
    var cartId = that.data.cartId;
    var adrId = that.data.adrId;
    var id = list[index].id;
    var url = "/pages/address/edit/edit?cartId=" + cartId + "&adrId=" + adrId + "&id=" + id;
    app.goto(url);
  },
  /**
   * 删除联系人
   */
  deleteClick: function (e) {
    var that = this;
    var index = e.target.dataset.index;
    var list = that.data.adrList;
    var json = {};
    json.token = app.getUserInfo().token;
    json.id = list[index].id;
    wx.showModal({
      title: '提示',
      content: "是否删除所选联系人?",
      success: function (res) {
        if (res.confirm) {
          app.checkLoginAjax({
            url: '/address/delete',
            data: json,
            success: function (res) {
              if (res.code == "000000") {
                that.initData();
              }
            }
          });
        }
      }
    });
  },
  /**
   * 选择地址
   */
  checkboxClick: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var activeIndex = that.data.activeIndex;
    var list = that.data.adrList;
    if (activeIndex){
      list[activeIndex].checkbox = '';
    }
    list[index].checkbox = 'checked';
    that.setData({
      activeIndex:index,
      adrList:list
    })
    var id = list[index].id;
    wx.setStorageSync('orderParam', { cartId: that.data.cartId })
    var url = "/pages/order/order/order?cartId=" + that.data.cartId + "&stgId=" + id;
    app.goto(url);
  }
})