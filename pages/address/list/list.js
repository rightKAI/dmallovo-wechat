// 地址管理js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    adrList:[],
    adrId:0,
    cartId:0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  initData: function (){
    var that = this;
    var token = app.getUserInfo().token;
    app.checkLoginAjax({
      url: '/address/list',
      data: { token: token },
      success: function (res) {
        if (res.code == "000000") {
          var list = res.data;
          if (list.length > 0) {
            for (var i = 0; i < list.length; i++) {
              list[i].isCheckbox = (list[i].id == that.data.adrId) && (that.data.adrId != 0) ? "checked" : "";
              list[i].checkboxName = (list[i].id == that.data.adrId) && (that.data.adrId != 0) ? "已选" : "选择"
              if (that.data.adrId == 0 && list[i].isDefault == 1) {
                list[i].isCheckbox = "checked";
                list[i].checkboxName = "已选"
                that.data.adrId = list[i].id;
              }
            }
            that.setData({
              adrList: list,
              adrId: that.data.adrId
            })
          }else{
            that.setData({
              adrList: [],
              adrId: that.data.adrId
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
  addNewUser:function(){
    var that = this;
    var cartId = that.data.cartId;
    var adrId = that.data.adrId;
    var pervUrl = '/pages/address/list/list';
    var param = wx.getStorageSync('orderParam');
    param.prevUrl = pervUrl;
    wx.setStorageSync('orderParam', param)
    var url = "/pages/address/add/add?cartId="+cartId+"&adrId="+adrId;
    app.goto(url);
  },
  /**
   * 编辑联系人
   */
  editClick:function(e){
    var that = this;
    var index = e.target.dataset.index;
    var list = that.data.adrList;
    var cartId = that.data.cartId;
    var adrId = that.data.adrId;
    var id = list[index].id;
    var url = "/pages/address/edit/edit?cartId=" + cartId + "&adrId=" + adrId+"&id="+id;
    app.goto(url);
  },
  /**
   * 删除联系人
   */
  deleteClick:function(e){
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
  checkboxClick:function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    var list = that.data.adrList;
    var id = list[index].id;
    wx.setStorageSync('orderParam', { cartId: that.data.cartId,adrId:id })
    var url = "/pages/order/order/order?cartId=" + that.data.cartId + "&adrId=" + id;
    app.goto(url);
  }
})