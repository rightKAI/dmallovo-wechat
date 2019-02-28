// pages/me/myhelp/myhelp.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //菜单
    menuList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.ajax({
      url: '/info/helpMap',
      success: function (res) {
        var temp=res.data;
        temp.forEach(element => {
          element.show=false
        });
        that.setData({menuList: temp})
      }
    });
  },

  // 点击获取ID
  tapname:function(e){
    // debugger
    var that=this;
    // console.log(e.currentTarget.dataset.id)
    var id=e.currentTarget.dataset.id
    var contentFor = that.data.menuList;
    for (var i = 0; i < contentFor.length; i++) {
      　　if (id == contentFor[i].id) {
      　　　　var printPrice = "menuList[" + i + "].show";
      　　　　if (that.data.menuList[i].show) {
      　　　　　　that.setData({
      　　　　　　　　[printPrice]: false
      　　　　　　});
      　　　　} else {
      　　　　　　that.setData({
      　　　　　　　　[printPrice]: true
      　　　　　　});
      　　　　}
      　　} else {
      　　　　　　var printPrice1 = "menuList[" + i + "].show";
      　　　　　　that.setData({
      　　　　　　　　[printPrice1]: false
      　　　　　　});
      　　　　}
      　　}






    // contentFor.forEach(element => {
    //   if(element.id==id){
    //     // element.show=true
    //     console.log(element.show)
    //     if(element.show==true){
    //       that.setData({
    //         [element.show]:false
    //       })
    //     }else{
    //       console.log(111111)
    //       console.log([element.show])
    //       that.setData({
    //         [element.show]:true
    //       })
    //     }
    //   }else{
    //     that.setData({
    //       [element.show]:false
    //     })
    //   }
    // });
    // console.log(contentFor)
    // that.setData({
    //   menuList:contentFor
    // })
    
  },
  // 获取帮助ID
  gohelptxt:function(e){
    var helpid=e.currentTarget.dataset.helpid;
    app.goto('./helpinfo/helpinfo?helpid='+helpid)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {}
})