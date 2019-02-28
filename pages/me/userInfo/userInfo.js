// pages/me/userInfo/userInfo.js
var app = getApp();
//文件引用  
var CusBase64 = require('base64.js');  

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 用户头像
    userImgs:'http://img.dmallovo.com/user/avatar/ef30c68a-32b2-469c-963c-d3f506db4ece.png',
    date: '请选择',
    marrDate:"请选择",//结婚纪念日选中
    signArray:["白羊座","金牛座","双子座","巨蟹座","狮子座","处女座","天秤座","天蝎座","射手座","摩羯座","水瓶座","双鱼座"],
    bloodList:["A","B","O","AB"],
    sign:"请选择",//星座选中
    blood:"请选择",//血型选中
    nickName:"",//昵称
    name:"",//姓名
    signature:"",//个性签名
    job:"",//职业
    manRadio:"radios",
    womanRadio:"radio",
    radioed:"man",//性别选中
    emoRadioed:"single",
    single:"radios",
    married:"radio",
    love:"radio",
    isHideText:"收起",
    isHideClass:"icon",
    isHide:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var json = {};
    var token = app.getUserInfo().token;
    json.token = token;
    app.checkLoginAjax({
      url: '/user/info',
      data: json,
      success: function (res) {
        if (res.code == "000000") {
          var sex = res.data.sex == "M"?"man":"woman";
          var manRadio = sex == "man"?"radios":"radio";
          var womanRadio = sex == "man"?"radio":"radios";
          var sing = that.filterAffecToStr(res.data.affectiveStates);
          var single = sing=="single"?"radios":"radio";
          var married = sing == "married"?"radios":"radio";
          var love = sing == "love"?"radios":"radio";
          var date = that.filterNull(res.data.birthday) ? that.filterNull(res.data.birthday) : "请选择";
          var marrDate = that.filterNull(res.data.marryDay) ? that.filterNull(res.data.marryDay):"请选择";
          var sign = that.filterNull(res.data.constellation) ? that.filterNull(res.data.constellation) : "请选择";
          var blood = that.filterNull(res.data.bloodType) ? that.filterNull(res.data.bloodType) : "请选择";
          that.setData({
            name : that.filterNull(res.data.userName),//姓名
            nickName: that.filterNull(res.data.nickName),//昵称
            job : that.filterNull(res.data.job),//职业
            signature: that.filterNull(res.data.signature),//个性签名
            sex: sex,//性别
            radioed:sex,
            manRadio:manRadio,
            womanRadio: womanRadio,
            single: single,
            married: married,
            love: love,
            emoRadioed:sing,
            date: date,
            marrDate: marrDate,
            sign: sign,
            blood: blood,
            userImgs: res.data.iconUrl
          })
        }
      }
    });
  },
  filterNull:function(str){
    if(str == null){
      return "";
    }
    return str;
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
   * 性别点击事件
   */
  sexClick:function(e){
    var that = this;
    var id = e.currentTarget.id;
    var nowid = that.data.radioed;
    if(id != nowid){
      var manRadio = id=="man"?"radios":"radio";
      var womanRadio = id=="woman"?"radios":"radio";
      that.setData({
        radioed:id,
        manRadio: manRadio,
        womanRadio: womanRadio
      })
    }
  },
  /**
   * 情感状况点击事件
   */
  emotionClick:function(e){
    var that = this;
    var id = e.currentTarget.id;
    var nowid = that.data.emoRadioed;
    if (id != nowid) {
      var single = id == "single" ? "radios" : "radio";
      var married = id == "married" ? "radios" : "radio";
      var love = id == "love" ? "radios" : "radio";
      that.setData({
        emoRadioed: id,
        single: single,
        married: married,
        love: love
      })
    }
  },
  /**
   * 详细信息隐藏显示点击
   */
  hideOrShowClick:function(){
    var that = this;
    var isclass=that.data.isHideClass;
    var isHide = isclass == "showIcon" ? false : true;
    var isHideText = isclass =="showIcon"?"收起":"展开";
    var isHideClass = isclass == "showIcon" ? "icon" : "showIcon";
    that.setData({
      isHideText: isHideText,
      isHideClass: isHideClass,
      isHide:isHide
    })
  },
  /**
   * 出生日期选择事件
   */
  bindDateChange:function(e){
    this.setData({
      date:e.detail.value
    })
  },
  /**
   * 星座选择事件
   */
  bindSignChange:function(e){
    var signArray = this.data.signArray;
    this.setData({
      sign: signArray[e.detail.value]
    })
  },
  /**
   * 血型选择
   */
  bindBloodChange:function(e){
    var bloodList = this.data.bloodList;
    this.setData({
      blood: bloodList[e.detail.value]
    })
  },
  /**
   * 结婚纪念日选中事件
   */
  bindMarrChange:function(e){
    this.setData({
      marrDate: e.detail.value
    })
  },
  /**
   * 输入框失去焦点事件
   */
  inputBlur:function(e){
    var id = e.target.id;
    var value = e.detail.value;
    var that = this;
    if(id == "nickName"){
      that.setData({
        nickName:value
      })
    }
    if (id == "name") {
      that.setData({
        name: value
      })
    }
    if (id == "signature") {
      that.setData({
        signature: value
      })
    }
    if (id == "job") {
      that.setData({
        job: value
      })
    }
  },
  /**
   * 保存事件
   */
  save:function(){
    var that = this;
    var json = {};
    json.userName = that.data.name;//姓名
    json.nickName = that.data.nickName;//昵称
    json.job = that.data.job;//职业
    json.signature = that.data.signature;//个性签名
    json.sex = that.data.radioed=="man"?"M":"F";//性别
    json.affectiveStates = that.filterAffec(that.data.emoRadioed);//情感状况
    json.birthday = that.data.date == "请选择" ? "" : that.data.date;//生日
    json.marryDay = that.data.marrDate == "请选择" ? "" : that.data.marrDate;//纪念日
    json.constellation = that.data.sign == "请选择" ? "" : that.data.sign;//星座
    json.bloodType = that.data.blood == "请选择" ? "" : that.data.blood;//血型
    var token = app.getUserInfo().token;
    json.token = token;
    app.checkLoginAjax({
      url: '/user/update',
      data: json,
      success: function (res) {
        if (res.code == "000000") {
          wx.showToast({
            title: "修改成功!", icon: "none" 
          }) 
          app.goto('/pages/me/me');
        }
      }
    });
  },
  /**
   * 过滤情感状态
   */
  filterAffec:function(str){
    if (str == "single"){
      var param = 0;
    }
    if (str == "love") {
      var param = 1;
    }
    if (str == "married") {
      var param = 2;
    }
    return param;
  },
  /**
   * 过滤情感状态
   */
  filterAffecToStr: function (num) {
    if (num == "0") {
      var param = "single";
    }
    if (num == "1") {
      var param = "love";
    }
    if (num == "2") {
      var param = "married";
    }
    if(!num){
      var param = "single";
    }
    return param;
  },
  // 更换头像
  updateShow:function(){
    var that=this;
    wx.chooseImage({
      count:1,
      success: function(res) {
        var tempFilePaths = res.tempFilePaths
        that.setData({
          userImg:tempFilePaths[0]
        })
        wx.uploadFile({
          url: app.globalData.url + '/user/uploadUserIcon', 
          filePath: that.data.userImg,
          name: 'image',
          formData: {
            'token': app.getUserInfo().token
          },
          success: function (res) {
            var data = res.data
            wx.showToast({
              title: "更改头像成功!", icon: "none"
            })  
            var token = app.getUserInfo().token;
            var json = {};
            json.token = token;
            app.checkLoginAjax({
              url: '/user/info',
              data: json,
              success: function (res) {
                if (res.code == "000000") {
                  console.log("照片地址:" + res.data.iconUrl);
                  that.setData({
                    userImgs: res.data.iconUrl
                  })
                }
              }
            });
          }
        })
  }
  })
}
})