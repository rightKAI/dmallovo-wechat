//app.js
App({
  globalData: {
    // url:'http://192.168.1.182'
    // url: 'http://www.dmallovo.com'
     url: 'https://wechat.dmallovo.com'
    // url: 'http://127.0.0.1:12138'
    // url:"http://192.168.0.182"
  },
  onLaunch: function (param) {
    //渠道来源处理，记录第一次来源，当前请求存在来源且缓存中不存在来源则保存
    var channelCache = wx.getStorageSync('channel');
    if (param.query.channel && !channelCache) {
      wx.setStorageSync('channel', param.query.channel);
    }
    var that = this;
    //判断用户是否已经登陆
    var userInfo = that.getUserInfo();
    if (userInfo) {
      if(!userInfo.userName){
        wx.removeStorageSync('USER_INFO')
      }
      return;
    } else {
      return;
      //由于授权接口受腾讯影响获取不到用户昵称等信息，因此一进来不走授权
      wx.checkSession({
        success: function () {
          console.log('checkSession success');
          //session 未过期，并且在本生命周期一直有效
        },
        //授权过期或未登陆
        fail: function () {
          //登陆获取code
          wx.login({
            success: function (loginResp) {
              if (loginResp.code) {
                //获取用户信息
                wx.getUserInfo({
                  //withCredentials: true,
                  success: function (res) {
                    //封装登陆需要的参数
                    var params = {};
                    params.code = loginResp.code;
                    params.nickName = res.userInfo.nickName;
                    params.sex = res.userInfo.gender;
                    params.avatarUrl = res.userInfo.avatarUrl;
                    params.channel = wx.getStorageSync('channel');

                    //调用登陆接口
                    that.sendRequest({
                      url: '/thirdLogin/applet',
                      data: params,
                      success: function (res) {
                        wx.setStorageSync("USER_INFO", res.data);
                      }
                    })
                  },
                  fail: function (e) {
                    console.log(e);
                  }
                });
              } else {
                console.log('获取用户登录态失败！' + res.errMsg)
              }
            }
          });
        }
      })
    }
  },
  checkLoginAjax: function (opt) {
    var that = this;
    //获取用户信息
    var userInfo = that.getUserInfo();
    //如果获取不到用户信息调用微信登陆注册借口
    if (!userInfo || !userInfo.token || !userInfo.userName) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '登录已失效，请重新登录！',
        success: function (res) {
          console.log(res)
          if (res.confirm) {
            that.goto('/pages/log/log')
          }
        }
      });
      return;
    }
    //如果获取到用户信息直接发送ajax请求
    else {
      that.sendRequest(opt);
    }
  },
  ajax: function (opt) {
    //用户信息处理
    var that = this;
    //获取用户信息
    // var userInfo = that.getUserInfo();
    // console.log("用户信息:");
    // console.log(userInfo);
    //如果获取不到用户信息调用微信登陆注册借口
    // if (!userInfo || !userInfo.openId) {
    //   that.wxLogin(function () {
    //     that.sendRequest(opt);
    //   });
    // }
    //如果获取到用户信息直接发送ajax请求
    // else {
    that.sendRequest(opt);
    // }
  },
  sendRequest: function (opt) {
    var that = this;
    // var userInfo = that.getUserInfo();
    var header = opt.header ? opt.header : { 'content-type': 'application/x-www-form-urlencoded' };
    //opt.data.token = "";
    wx.request({
      url: that.globalData.url + opt.url,
      data: opt.data,
      method: opt.method ? opt.method : 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT    
      header: header, // 设置请求的 header    
      success: function (res) {
        console.log(res);
        //异常code处理
        if (res.data.code == '999999') {
          if (opt.fail) {
            opt.fail(res);
          } else {
            //请求接口异常
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: '网络异常，请稍后重试！'
            });
          }
          return;
        } else if (res.data.code == '000002') {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '登录已失效，请重新登录！',
            success: function (res) {
              console.log(res)
              if (res.confirm) {
                that.goto('/pages/log/log')
              }
            }
          });
          return;
        } else if (res.data.code != '000000') {
          if (opt.fail) {
            opt.fail(res);
          } else {
            //请求接口异常
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: res.data.msg ? res.data.msg : "请求数据发生异常."
            });
          }
          return;
        } else {
          if (opt.success) {
            opt.success(res.data);
          }
        }
      },
      fail: function (res) {
        if (opt.fail) {
          opt.fail(res);
        }
      },
      complete: function (res) {
        if (opt.complete) {
          opt.complete(res);
        }
      }
    });
  },
  //获取用户信息
  getUserInfo: function (cb) {
    return wx.getStorageSync('USER_INFO');
  },
  //设置缓存,s=秒
  put: function (k, v, s) {
    var postfix = '_deadtime';
    wx.setStorageSync(k, v)
    var seconds = parseInt(s);
    if (seconds > 0) {
      var timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000 + seconds;
      wx.setStorageSync(k + postfix, timestamp + "")
    } else {
      wx.removeStorageSync(k + postfix)
    }
  },
  //获取缓存,def=默认值
  get: function (k, def) {
    var postfix = '_deadtime';
    var deadtime = parseInt(wx.getStorageSync(k + postfix))
    if (deadtime) {
      if (parseInt(deadtime) < Date.parse(new Date()) / 1000) {
        if (def) { return def; } else { return; }
      }
    }
    var res = wx.getStorageSync(k);
    if (res) {
      return res;
    } else {
      return def;
    }
  },
  /**
 * 获取指定的日期
 * @param  intervalDay为-1时返回昨天的日期，0返回当前日期，1为明天的日期
 */
  getDay: function (date, intervalDay) {
    if (isNaN(intervalDay))
      intervalDay = 0;

    var localYear = date.getFullYear();
    var localMonth = date.getMonth();
    var localDate = date.getDate();

    var result = new Date(localYear, localMonth, localDate + intervalDay);
    var tempMonth = result.getMonth() + 1;
    var resultMonth = tempMonth >= 10 ? tempMonth : ('0' + tempMonth);
    var tempDate = result.getDate();
    var resultDate = tempDate >= 10 ? tempDate : ('0' + tempDate);

    return result.getFullYear() + "-" + resultMonth + "-" + resultDate;
  },
  alert: function (content) {
    wx.showModal({
      title: '提示',
      showCancel: false,
      content: content
    });
  },
  confirm: function (content, okFunc, cancelFunc) {
    wx.showModal({
      title: '提示',
      content: content,
      success: function (res) {
        if (res.confirm) {
          okFunc();
        } else if (res.cancel) {
          if (cancelFunc) {
            cancelFunc();
          }
        }
      }
    });
  },
  goto: function (url) {
    if (getCurrentPages().length == 4) {
      wx.redirectTo({
        url: url
      })
    } else {
      wx.navigateTo({
        url: url
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (param) {
    var channel = param.channel;
    var channelCache = wx.getStorageSync('channel');
    if (channel && !channelCache) {
      wx.setStorageSync('channel', channel);
    }
  }
})