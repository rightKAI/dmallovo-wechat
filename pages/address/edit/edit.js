// pages/address/add/add.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: ['请', '选', '择'],
    customItem: '请选择',
    isSelArea: 0,
    phone: "",
    name: "",
    remark: "",
    isDefault: false,
    areaData: {},
    edata:{},
    cartId:0,
    adrId:0,
    id:0,
    checked:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.checkLoginAjax({
      url: '/common/vuePositionData',
      success: function (res) {
        if (res.code == "000000") {
          that.setData({
            areaData: res.data,
            cartId:options.cartId,
            adrId:options.adrId,
            id:options.id
          });
          that.getEditData();
        }
      }
    });
  },
  /**
   * 获取需编辑地址信息
   */
  getEditData:function(){
    var that = this;
    var id = that.data.id;
    var token = app.getUserInfo().token; 
    var json = {};
    json.token = token;
    json.id = id;
    app.checkLoginAjax({
      url: '/address/get',
      data: json,
      success: function (res) {
        if (res.code == "000000") {
          var param = res.data;
          var area = [];
          area.push(param.provinceName);
          area.push(param.cityName);
          area.push(param.areaName);
          var isdefault = param.isDefault=="1"?true:false;
          var checked = param.isDefault == "1" ? 'checked' : '';
          that.setData({
            region:area,
            edata:param,
            isDefault:isdefault,
            checked:checked,
            phone: param.phone,
            name: param.userName,
            remark: param.address,
          })
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
   * 收货人姓名联动
   */
  nameChange: function (e) {
    var value = e.detail.value;
    this.setData({
      name: value
    })
  },
  /**
   * 手机号码联动
   */
  phoneChange: function (e) {
    var value = e.detail.value;
    this.setData({
      phone: value
    })
  },
  /**
   * 留言联动
   */
  remarkChange: function (e) {
    var value = e.detail.value;
    this.setData({
      remark: value
    })
  },
  /**
   * 设为默认地址
   */
  checkChange: function () {
    var that = this;
    var checked = that.data.checked;
    if(checked == 'checked'){
      that.setData({
        checked:''
      })
    }else{
      that.setData({
        checked:'checked'
      })
    }
    
  },
  /**
   * 省市区选择联动事件
   */
  selectAreaChange: function (e) {
    var that = this;
    var val = e.detail.value;
    console.log(val)
    if (val[0] == "请选择" && val[1] == "请选择" && val[2] == "请选择") {
      that.setData({
        isSelArea: 0,
        region: ['请', '选', '择']
      })
    } else {
      if (val[0] != "请选择" && val[1] != "请选择" && val[2] != "请选择") {
        that.setData({
          isSelArea: 1,
          region: val
        })
      } else if (val[0] != "请" || val[1] != "选" || val[2] != "择") {
        var p = val[0] != "请选择" && val[0] != "请" ? val[0] : "";
        var c = val[1] != "请选择" && val[1] != "选" ? val[1] : "";
        var a = val[2] != "请选择" && val[2] != "择" ? val[2] : "";
        that.setData({
          isSelArea: 0,
          region: [p, c, a]
        })
      }
    }
  },
  /**
   * 获取省市区code
   * type为类型：province_list省；city_list市；county_list区
   */
  getAreaCode: function (name, type) {
    var that = this;
    var data = that.data.areaData[type];
    var code;
    for (var key in data) {
      if (name == data[key]) {
        code = key;
      }
    }
    return code;
  },
  save: function () {
    var that = this;
    var name = that.data.name;
    var phone = that.data.phone;
    var text = that.data.remark;
    var token = app.getUserInfo().token;
    var p = that.data.region[0];//省
    var c = that.data.region[1];//市
    var a = that.data.region[2];//区
    var json = {};
    json.id = that.data.id;
    json.phone = phone;
    json.address = text;
    json.userName = name;
    json.token = token;
    json.provinceId = p != "请选择" && p != "请" ? that.getAreaCode(p, "province_list") : "";
    json.cityId = c != "请选择" && c != "选" ? that.getAreaCode(c, "city_list") : "";
    json.areaId = a != "请选择" && a != "择" ? that.getAreaCode(a, "county_list") : "";
    json.isDefault = that.data.checked == 'checked' ? 1 : 0;
    console.log(json)
    if (!json.phone) {
      wx.showModal({ title: '提示', showCancel: false, content: "请填写手机号码" });
      return;
    }
    if (!/^1[3|4|5|8|7][0-9]\d{4,8}$/.test(json.phone) || json.phone.length < 11) {
      wx.showModal({ title: '提示', showCancel: false, content: "请填写正确的手机号码" });
      return;
    }
    if (!json.address) {
      wx.showModal({ title: '提示', showCancel: false, content: "请填写详细地址" });
      return;
    }
    if (!json.userName) {
      wx.showModal({ title: '提示', showCancel: false, content: "请填写收货人姓名" });
      return;
    }
    if (!json.provinceId) {
      wx.showModal({ title: '提示', showCancel: false, content: "请选择收件地址省份" });
      return;
    }
    if (!json.cityId) {
      wx.showModal({ title: '提示', showCancel: false, content: "请选择收件地址城市" });
      return;
    }
    if (!json.areaId) {
      wx.showModal({ title: '提示', showCancel: false, content: "请选择收件地址地区" });
      return;
    }
    app.checkLoginAjax({
      url: '/address/update',
      data: json,
      success: function (res) {
        if (res.code == "000000") {
          var url = "/pages/address/list/list?cartId=" + that.data.cartId + "&adrId" + that.data.adrId;
          app.goto(url);
        }
      }
    });
  }
})