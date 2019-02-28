// pages/loveOath/loveSut/loveSut.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgSrc:""
  },

  /**
   * 生命周期函数--监听页面加载 /promise/queryPromise
   */
  onLoad: function (options) {
    var that=this;
    var token = app.getUserInfo().token;
    var json = {};
    json.token = token;
    app.ajax({
      url: '/promise/queryPromise',
      data: json,
      success: function (res) {
        var list=res.data;
        that.setData({
          imgSrc: list.mImgUrl
        });
      }
    });
  },

  baocun:function(){
    var that=this;
    wx.downloadFile({
      url: that.data.imgSrc,
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (res) {
            wx.showToast({ title: "保存成功,请到相册查看", icon: "none" });
            console.log(res);
          },
          fail: function (res) {
            console.log(res);
            console.log('fail');
          }
        })
      },
      fail: function () {
        console.log('fail');
      }
    })


    // wx.saveImageToPhotosAlbum({
    //   filePath: that.data.imgSrc,
    //   success: function (res) {
    //     console.log(res)
    //   },
    //   fail: function (res) {
    //     console.log('fail1111111')
    //   }
    // })
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