// pages/log/log.js
var app = getApp();
function countdown(that) {
  var second = that.data.timer
  if (second == 0) {
    that.setData({
      verifyCodeText: "获取验证码",
      timer: 60,
      isGetCode: 1,
    });
    return;
  }
  var time = setTimeout(function () {
    var t = second - 1;
    that.setData({
      verifyCodeText: "重新发送" + t,
      timer: t,
      isGetCode: 0
    });
    countdown(that);
  }, 1000)
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    verifyCodeText: "获取验证码",
    isGetCode: 1,
    phone: "",
    vcode: "",
    timer: 60
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
   * 输入框数据变化
   */
  changeInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  changeCode: function (e) {
    this.setData({
      vcode: e.detail.value
    })
  },
  /**
   * 获取验证码
   */
  getVerifyCode: function () {
    var that = this;
    var isGetCode = that.data.isGetCode;
    var phone = that.data.phone;
    var timer = that.data.timer;
    if (isGetCode == '1') {
      if (!phone) {
        wx.showToast({ title: "请填写手机号码", icon: "none" })
        return;
      }
      if (!/^1[3|4|5|8|7][0-9]\d{4,8}$/.test(phone) || phone.length < 11) {
        wx.showToast({ title: "请填写正确的手机号码", icon: "none" })
        return;
      }
      app.ajax({
        url: '/system/getVerifyCode',
        data: { action: "phone", phone: phone },
        header: { "content-type": "application/json;charset=UTF-8" },
        success: function (res) {
          wx.showToast({ title: "验证码已发送，请注意查收", icon: "none" })
          countdown(that);
        }
      });
    }
  },
  /**
   * 验证码登录
   */
  goLogin: function () {
    var that = this;
    var phone = that.data.phone;
    var code = that.data.vcode;
    if (!phone) {
      wx.showToast({ title: "请填写手机号码", icon: "none" })
      return;
    }
    if (!code) {
      wx.showToast({ title: "请输入验证码", icon: "none" })
      return;
    }
    if (!/^1[3|4|5|8|7][0-9]\d{4,8}$/.test(phone) || phone.length < 11) {
      wx.showToast({ title: "请填写正确的手机号码", icon: "none" })
      return;
    }

    wx.login({
      success: function (loginResp) {
        if (loginResp.code) {
          app.ajax({
            url: '/user/loginByVerifyCode',
            data: { 
              code: loginResp.code, 
              verifycode: code, 
              phone: phone, 
              platform: 3, 
              channel: wx.getStorageSync('channel') 
            },
            header: { "content-type": "application/json;charset=UTF-8" },
            success: function (res) {
              if (res.code == "000000") {
                var json = {};
                json.userId = res.data.userId;
                json.userName = res.data.userName;
                json.token = res.data.token;
                json.iconUrl = res.data.iconUrl;
                wx.setStorageSync('USER_INFO', json);
                that.setData({
                  verifyCodeText: "获取验证码",
                  timer: 60,
                  isGetCode: 1
                });
                wx.reLaunch({
                  url: "/pages/index/index"
                })
              } else {
                wx.showToast({ title: "登录失败", icon: "none" })
                that.setData({
                  verifyCodeText: "获取验证码",
                  timer: 60,
                  isGetCode: 1
                })
              }
            }
          });
        } else {
          wx.showToast({ title: "登录失败", icon: "none" })
        }
      }
    });
  },
  /**
   * 微信登录
   */
  wechatLogin: function (e) {
    var that = this;
    if (e.detail.errMsg != "getUserInfo:ok") {
      return;
    }
    //登陆获取code
    wx.login({
      success: function (loginResp) {
        if (loginResp.code) {
          //封装登陆需要的参数
          var params = {};
          params.code = loginResp.code;
          params.nickName = e.detail.userInfo.nickName;
          params.sex = e.detail.userInfo.gender;
          params.avatarUrl = e.detail.userInfo.avatarUrl;
          params.channel = wx.getStorageSync('channel');
          //调用登陆接口
          app.sendRequest({
            url: '/thirdLogin/applet',
            data: params,
            success: function (res) {
              wx.setStorageSync("USER_INFO", res.data);
              wx.reLaunch({
                url: "/pages/index/index"
              })
            }
          })
        } else {
          wx.showToast({ title: "登录失败", icon: "none" })
        }
      }
    });
  }
})