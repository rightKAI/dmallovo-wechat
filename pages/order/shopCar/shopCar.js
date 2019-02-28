// 购物车js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopCar:true,
    carList:[],//购物车商品
    totalCount:0,//已选商品
    totalPrice:0,//总价
    chooseNum:0,//选中数量
    isAllChoose:"my-checkbox-off",//是否全选
    saveList:[],//提交参数list
    isNoArea:true,
    selectModal:true,
    goods: "active",
    detail: "",
    stone: "-1",
    style: "0",
    stoneId: "",
    styleId: "",
    sex: "0",
    letter: "",
    sizeHide: false,//单尺寸
    doubleSizeHide: true,//双尺寸(对戒尺寸)
    letterHide: false,//单刻字
    doubleLetterHide: true,//双刻字(对戒刻字)
    loadNum: 0,
    hasDouble: true,//规格
    hasRing: false,//主钻选择,
    stoneParms: true,
    name: "",
    weight: "",
    color: "",
    cut: "",
    neat: "",
    price: "",
    type: "",
    doubleRingType: 1,
    imgUrls: [],
    stoneList: [],
    styleList: [],
    sexList: [
      { name: "男女对戒", backColor: "#fff", color: "#333" },
      { name: "单男戒", backColor: "#fff", color: "#333" },
      { name: "单女戒", backColor: "#fff", color: "#333" }
    ],
    hindSize: [],
    manHindSize: [],
    womanHindSize: [],
    sizeIndex: -1,
    wSizeIndex: -1,
    mSizeIndex: -1,
    womanSizeHas: false,
    manSizeHas: false,
    womanLetter: false,
    manLetter: false,
    kzylHide: true,//刻字预览
    womanText: "",//女刻字
    manText: "",//男刻字,
    previewText: "",
    option: {},
    isCollect: 0,
    paramList: [],
    detailHide: false,
    paramHide: true,
    edata: [],
    pselectImg: '',
    selectModal: true,
    hasFixed: '',
    size:-1,
    noAppStyle:"",
    isNoData:false,
    modalHeight:0,
    isScroll:true,
    existsPromise:"",
    //
    coupleStyleId:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        var _h = res.windowHeight;
        that.setData({ wheight: _h + 'px' })
      }
    })
    this.initData();
  },
  initData:function(){
    var that = this;
    var token = app.getUserInfo().token;
    app.checkLoginAjax({
      url: '/shoppingCart/get',
      data: { token: token },
      success: function (res) {
        if (res.code == "000000") {
          var list = res.data.list;
          if (list.length > 0) {
            that.setGoodsData(list)
            var chooseNum = that.setGoodsChooseNum(list).chooseNum;
            var isAllChoose = chooseNum == list.length ? "my-checkbox-on" : "my-checkbox-off";
            that.setData({
              carList: that.setGoodsChooseNum(list).data,
              totalCount: res.data.count,
              totalPrice: res.data.sumPrice,
              chooseNum: chooseNum,
              isAllChoose: isAllChoose,
              noAppStyle: "",
              isNoData: false,
              existsPromise: res.data.isExistsPromise
            })
          }else{
            that.setData({
              carList: [],
              totalCount: 0,
              totalPrice: 0,
              chooseNum: 0,
              isAllChoose: "my-checkbox-off",
              isNoArea:false,
              noAppStyle:"background:#fff;height:100%",
              isNoData:true
            })
          }
        }
      }
    });
  },
  setGoodsData:function(list){
    var that = this;
    var token = app.getUserInfo().token;
    var chooseNum = 0;
    var data = [];
    for (var i = 0; i < list.length; i++) {
      var json = {
        cartId : list[i].id,
        count : list[i].count,
        isChoose : list[i].isChoose,
        token: token,
        lettering : list[i].lettering
      }
      data.push(json);
    }
    that.setData({
      saveList: data
    })
  },
  setGoodsChooseNum:function(list){
    var that = this;
    var json = {};
    var chooseNum = 0;
    for(var i=0;i<list.length;i++){
      list[i].letterHas = false;
      list[i].editLetterHas = true;
      list[i].lettering = list[i].lettering ? list[i].lettering:"";
      if(list[i].isChoose == 1){
        chooseNum = chooseNum+1;
      }
    }
    json.chooseNum = chooseNum;
    json.data = list;
    return json
  },
  /**
   * 进入结算
   */
  save:function(){
    var that = this;
    if(that.data.chooseNum==0){
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: "请选择您需要购买的商品"
      });
      return
    };
    var token = app.getUserInfo().token;
    app.checkLoginAjax({
      url: '/address/list',
      data: { token: token },
      success: function (res) {
        if (res.code == "000000") {
          wx.setStorageSync('orderParam', {})
          if (res.data.length > 0) {
            if (that.data.existsPromise==1){
              var url = "/pages/order/order/order";
              app.goto(url)
            }else{
              app.goto('../../loveOath/loveOath/loveOath');
            }
          } else {
            wx.setStorageSync('orderParam', { prevUrl:"/pages/order/order/order"})
            var url = "../../address/add/add?cartId=" + that.data.cartId;
            app.goto(url)
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
   * 全选
   */
  allCheckbox:function(){
    var that = this;
    var isNoArea = that.data.isNoArea;
    if (!isNoArea){
      return
    }
    var type = that.data.isAllChoose == "my-checkbox-off" ? "my-checkbox-on" :"my-checkbox-off";
    var choose = that.data.isAllChoose == "my-checkbox-off" ? 1 : 0;
    var slist = that.data.saveList;
    for(var i=0;i<slist.length;i++){
      that.data.saveList[i].isChoose = choose;
    }
    that.setData({
      isAllChoose: type
    });
    app.checkLoginAjax({
      url: '/shoppingCart/update',
      data: that.data.saveList,
      header: { "content-type": "application/json;charset=UTF-8" },
      success: function (res) {
        if (res.code == "000000") {
          that.initData();
        }
      }
    });
  },
  /**
   * 删除商品
   */
  delGoods:function(e){
    var that = this;
    var index = e.target.dataset.index;
    var data = that.data.carList[index];
    var token = app.getUserInfo().token;
    var json ={
      token:token,
      cartId:data.id
    }
    wx.showModal({
      title: '提示',
      content: "您确定要删除该商品吗",
      success: function (res) {
        if (res.confirm) {
          app.checkLoginAjax({
            url: '/shoppingCart/delete',
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
   * 移入收藏
   */
  collectBtn:function(e){
    var that = this;
    var index = e.target.dataset.index;
    var data = that.data.carList[index];
    var token = app.getUserInfo().token;
    var json = {
      token:token,
      type:data.type,
      styleId:data.styleId,
      stoneId:data.stoneId
    };
    app.checkLoginAjax({
      url: '/collect/save',
      data: json,
      success: function (res) {
        if (res.code == "000000") {
          that.initData();
        }
      }
    });
  },
  /**
   * 点击刻字显示修改刻字区域
   */
  letterEdit:function(e){
    var that = this;
    var index = e.target.dataset.index;
    that.data.carList[index].letterHas = true;
    that.data.carList[index].editLetterHas = false;
    that.setData({
      carList: that.data.carList
    })
  },
  /**
   * 商品checkbox选择按钮
   */
  checkBoxClick:function(e){
    var that = this;
    var index = e.target.dataset.index;
    var data = that.data.saveList[index];
    var choose = that.data.saveList[index].isChoose == "1" ? 0 : 1;
    that.data.saveList[index].isChoose = choose;
    that.setData({
      saveList: that.data.saveList
    });
    app.checkLoginAjax({
      url: '/shoppingCart/update',
      data: that.data.saveList,
      header: { "content-type": "application/json;charset=UTF-8" },
      success: function (res) {
        if (res.code == "000000") {
          that.initData();
        }
      }
    });
  },
  /**
   * 空状态按钮事件
   */
  goCollect:function(){
    var url = "/pages/me/myCollect/collect";
    wx.redirectTo({
      url: url
    })
  },
  goShop:function(){
    var url = "/pages/goods/list/list";
    wx.redirectTo({
      url: url
    })
  },
  /**
   * 点击商品图片跳转到详情页
   */
  goGoodsDetail:function(e){
    var that = this;
    var index = e.target.dataset.index;
    var item = that.data.carList[index];
    console.log(item)
    var stoneId = item.stoneId;
    var style = item.styleId;
    var stype = item.type;
    if(stype == '2'){
      var styleno = item.styleno;
      var double = styleno.substring(styleno.length - 1) == 'G' ? 2 : 3;
      var url = "/pages/goods/detail/detail?stoneId=" + stoneId + "&styleId=" + style + "&type=" + stype + "&double=" + double;
    }else{
      var url = "/pages/goods/detail/detail?stoneId=" + stoneId + "&styleId=" + style + "&type=" + stype;
    }
    app.goto(url);
  },
  /**弹出层子层初始化**/
  modalChildInit:function(data){
    var that = this;
    if (data.type == "1") {
      that.setData({
        hasRing: false,
        hasDouble: true,
        sizeHide: false,
        doubleSizeHide: true,
        doubleLetterHide: true,
        stoneId: data.stoneId,
        styleId: data.styleId,
        stoneParms: false,
        type: 1
      });
    }
    if (data.type == "2") {
      that.setData({
        hasRing: true,
        hasDouble: false,
        sizeHide: true,
        doubleSizeHide: false,
        letterHide: true,
        stoneId: data.stoneId,
        styleId: data.styleId,
        doubleRingType: data.styleno.substring(data.styleno.length - 1) == 'G' ? 2 : 3,
        stoneParms: true,
        type: 2
      });
    }
    if (data.type == "3") {
      that.setData({
        hasRing: false,
        hasDouble: true,
        sizeHide: false,
        doubleSizeHide: true,
        doubleLetterHide: true,
        stoneId: data.stoneId,
        styleId: data.styleId,
        stoneParms: true,
        type: 3
      });
    }
  },
  /**弹窗对戒数据渲染**/
  doubleInitData(data){
    var that = this;
    var styList = data.listGoldClassify;
    var styleList = [];
    var setSty = 0;
    var price = data.price;
    if (that.data.doubleRingType == "1" || that.data.doubleRingType == "3") {
      var mslist = that.data.doubleRingType == "3" ? [] : data.manRingInfo.listHandSize;
      var wslist = data.femaleRingInfo.listHandSize;
      var manSizeHas = that.data.doubleRingType == "1" ? false : true;
      var sex = that.data.doubleRingType == "1" ? 0 : 2;
      //对戒
      if (that.data.doubleRingType == "1") {
        //刻字显示处理
        that.letteringShow(data.manRingInfo.lettering, data.femaleRingInfo.lettering);
      }
      //女戒
      else if (that.data.doubleRingType == "3") {
        that.data.sexList[2].backColor = "#001a88";
        that.data.sexList[2].color = "#fff";
        that.data.sexList[1].backColor = "#fff";
        that.data.sexList[1].color = "#333";
        //刻字显示处理
        that.letteringShow(2, data.femaleRingInfo.lettering);
      }
      for (var i = 0; i < wslist.length; i++) {//材质
        if (wslist[i] == that.data.size) {
          that.setData({ wSizeIndex: i });
          var json = {};
          json.type = 2;
          json.platform = 3;
          json.stoneId = data.femaleRingInfo.stoneId;
          json.styleId = data.femaleRingInfo.styleId;
          json.handSize = that.data.size;
          app.ajax({
            url: '/goods/getPrice',
            data: json,
            success: function (res) {
              if (res.code == "000000") {
                var data = res.data;
                that.setData({
                  modalPrice: data
                })
              }
            }
          });
        }
      }
      that.setData({
        manSizeHas: manSizeHas,
        womanSizeHas: false,
        sex: sex,
        sexList: that.data.sexList,
        name: data.femaleRingInfo.name,
        pselectImg: data.femaleRingInfo.bannerImgs[0]
      })
    }
    if (that.data.doubleRingType == "2") {
      var mslist = data.manRingInfo.listHandSize;
      var wslist = [];
      var sex = 1;
      if (that.data.doubleRingType == "2") {
        that.data.sexList[2].backColor = "#fff";
        that.data.sexList[2].color = "#333";
        that.data.sexList[1].backColor = "#001a88";
        that.data.sexList[1].color = "#fff";
      }
      //男戒显示刻字处理
      that.letteringShow(data.manRingInfo.lettering, 2);
      for (var i = 0; i < mslist.length; i++) {//材质
        if (mslist[i] == that.data.size) {
          that.setData({ mSizeIndex: i });
          var json = {};
          json.type = 2;
          json.platform = 3;
          json.stoneId = data.manRingInfo.stoneId;
          json.styleId = data.manRingInfo.styleId;
          json.handSize = that.data.size;
          app.ajax({
            url: '/goods/getPrice',
            data: json,
            success: function (res) {
              if (res.code == "000000") {
                var data = res.data;
                that.setData({
                  modalPrice: data
                })
              }
            }
          });
        }
      }
      that.setData({
        manSizeHas: false,
        womanSizeHas: true,
        sex: sex,
        sexList: that.data.sexList,
        name: data.manRingInfo.name,
        pselectImg: data.manRingInfo.bannerImgs[0]
      })
    }
    for (var i = 0; i < styList.length; i++) {//材质
      var s = {};
      s.name = styList[i].name;
      s.styleId = styList[i].styleId;
      if (that.data.styleId == styList[i].styleId || styList[i].styleId.indexOf(that.data.styleId) >= 0) {
        setSty = 1;
        s.backColor = "#001a88";
        s.color = "#fff";
        s.borcolor = "#001a88";
        that.data.style = i;
      } else {
        s.backColor = "#fff";
        s.color = "#333";
        s.borcolor = "#bdbdbd";
      }
      if (styList.length == 1 && i == 0) {
        setSty = 1;
        s.backColor = "#001a88";
        s.color = "#fff";
        s.borcolor = "#001a88";
        that.data.style = i;
      }
      styleList.push(s);
    }
    that.setData({
      styleList: styleList,
      womanHindSize: wslist,
      manHindSize: mslist,
      style: that.data.style,
      price: data.price,
      styleId: styList[that.data.style].styleId,
      stoneParms:true
    });
  },
  /**弹窗钻戒数据渲染**/
  ringInitData:function(data){
    var that = this;
    var stoList = data.listStone;
    var styList = data.listGoldClassify;
    var sizeList = data.ringInfo.listHandSize;
    var stoneList = [];
    var styleList = [];
    var price = data.price;
    var isCheck = false;
    for (var i = 0; i < stoList.length; i++) {//钻
      var s = {};
      s.name = stoList[i].name;
      s.stoneId = stoList[i].stoneId;
      if (that.data.stoneId == stoList[i].stoneId) {
        s.backColor = "#001a88";
        s.color = "#fff";
        s.borcolor = "#001a88";
        that.data.stone = i;
        isCheck = true;
      } else {
        s.backColor = "#fff";
        s.color = "#333";
        s.borcolor = "#bdbdbd";
      }
      stoneList.push(s);
    }
    //判断裸石是否有选中，没有选中说明搭配裸石不在列表中，默认选第一个
    if (!isCheck && stoneList.length>0) {
      stoneList[0].backColor = "#001a88";
      stoneList[0].color = "#fff";
      stoneList[0].borcolor = "#001a88";
      that.data.stone = 0;
    }

    for (var i = 0; i < styList.length; i++) {//材质
      var s = {};
      s.name = styList[i].name;
      s.styleId = styList[i].styleId;
      if (that.data.styleId == styList[i].styleId) {
        s.backColor = "#001a88";
        s.color = "#fff";
        s.borcolor = "#001a88";
        that.data.style = i;
      } else {
        s.backColor = "#fff";
        s.color = "#333";
        s.borcolor = "#bdbdbd";
      }
      styleList.push(s);
    }
    for (var i = 0; i < sizeList.length; i++) {//材质
      if (sizeList[i] == that.data.size){
        that.setData({ sizeIndex:i});
        var json = {};
        json.type = 1;
        json.platform = 3;
        json.stoneId = data.ringInfo.stoneId;
        json.styleId = data.ringInfo.styleId;
        json.handSize = that.data.size;
        app.ajax({
          url: '/goods/getPrice',
          data: json,
          success: function (res) {
            if (res.code == "000000") {
              var data = res.data;
              var price = res.data
              that.setData({
                modalPrice: data
              })
            }
          }
        });
      }
    }
    if (data.ringInfo.stoneShowType == 1) {
      var weight = data.ringInfo.stoneWeightStr;
      var color = data.ringInfo.stoneColor;
      var cut = data.ringInfo.stoneCut;
      var neat = data.ringInfo.stoneNeatness;
      var stoneParms = false;
    }
    if (data.ringInfo.stoneShowType == 2) {
      var weight = data.ringInfo.mainStoneWeightRegionStr;
      var color = 'H';
      var cut = data.ringInfo.stoneCut ? data.ringInfo.stoneCut : '';
      var neat = 'SI';
      var stoneParms = false;
    }
    if (data.ringInfo.stoneShowType == 3) {
      var weight = data.ringInfo.stoneWeightStr;
      var color = data.ringInfo.stoneColor;
      var cut = data.ringInfo.stoneCut;
      var neat = data.ringInfo.stoneNeatness;
      var stoneParms = true;
    }
    that.setData({
      styleList: styleList,
      stoneList: stoneList,
      hindSize: sizeList,
      stone: that.data.stone,
      style: that.data.style,
      weight: weight,
      color: color,
      cut: cut,
      neat: neat,
      modalPrice: price,
      name: data.ringInfo.name,
      pselectImg: data.ringInfo.bannerImgs[0],
      letterHide: data.ringInfo.lettering == 1 ? false : true
    })
  },
   /**弹窗饰品数据渲染**/
  jewelryInfoInitData:function(data){
    var that = this;
    var styList = data.listGoldClassify;
    var stoList = data.listStone;
    var sizeList = data.jewelryInfo.listHandSize;
    var sizeHide = sizeList.length > 0 ? false : true;
    var styleList = [];
    var stoneList = [];
    var price = data.price;
    for (var i = 0; i < styList.length; i++) {//材质
      var s = {};
      s.name = styList[i].name;
      s.styleId = styList[i].styleId;
      if (that.data.styleId == styList[i].styleId) {
        s.backColor = "#001a88";
        s.color = "#fff";
        s.borcolor = "#001a88";
        that.data.style = i;
      } else {
        s.backColor = "#fff";
        s.color = "#333";
        s.borcolor = "#bdbdbd";
      }
      styleList.push(s);
    }
    var isCheck = false;
    for (var i = 0; i < stoList.length; i++) {//钻
      var s = {};
      s.name = stoList[i].name;
      s.stoneId = stoList[i].stoneId;
      if (that.data.stoneId == stoList[i].stoneId) {
        s.backColor = "#001a88";
        s.color = "#fff";
        s.borcolor = "#001a88";
        that.data.stone = i;
        isCheck = true;
      } else {
        s.backColor = "#fff";
        s.color = "#333";
        s.borcolor = "#bdbdbd";
      }
      stoneList.push(s);
    }
    for (var i = 0; i < sizeList.length; i++) {//材质
      if (sizeList[i] == that.data.size) {
        that.setData({ sizeIndex: i });
        var json = {};
        json.type = 3;
        json.platform = 3;
        json.stoneId = data.jewelryInfo.stoneId;
        json.styleId = data.jewelryInfo.styleId;
        json.handSize = that.data.size;
        app.ajax({
          url: '/goods/getPrice',
          data: json,
          success: function (res) {
            if (res.code == "000000") {
              var data = res.data;
              price = data;
            }
          }
        });
      }
    }
    //判断裸石是否有选中，没有选中说明搭配裸石不在列表中，默认选第一个
    if (stoList != null && stoList.length > 0 && !isCheck) {
      stoneList[0].backColor = "#001a88";
      stoneList[0].color = "#fff";
      s.borcolor = "#001a88";
      that.data.stone = 0;
      isCheck = true;
    }
    if (data.jewelryInfo.stoneShowType == 1) {
      var weight = data.jewelryInfo.stoneWeightStr;
      var color = data.jewelryInfo.stoneColor;
      var cut = data.jewelryInfo.stoneCut;
      var neat = data.jewelryInfo.stoneNeatness;
      var stoneParms = false;
    }
    if (data.jewelryInfo.stoneShowType == 2) {
      var weight = data.jewelryInfo.mainStoneWeightRegionStr;
      var color = 'H';
      var cut = data.jewelryInfo.stoneCut ? data.ringInfo.stoneCut : '';
      var neat = 'SI';
      var stoneParms = false;
    }
    if (data.jewelryInfo.stoneShowType == 3) {
      var weight = data.jewelryInfo.stoneWeightStr;
      var color = data.jewelryInfo.stoneColor;
      var cut = data.jewelryInfo.stoneCut;
      var neat = data.jewelryInfo.stoneNeatness;
      var stoneParms = true;
    }
    that.setData({
      hasRing: isCheck ? false : true,
      styleList: styleList,
      stoneList: stoneList,
      hindSize: sizeList,
      style: that.data.style,
      modalPrice: price,
      name: data.jewelryInfo.name,
      sizeHide: sizeHide,
      pselectImg: data.jewelryInfo.bannerImgs[0],
      letterHide: data.jewelryInfo.lettering == 1 ? false : true,
      stoneParms: stoneParms,
      weight: weight,
      color: color,
      cut: cut,
      neat: neat,
    })
  },
  /**点击编辑显示弹出层**/
  editGoodsBtn: function (e) {
    var that = this;
    var index = e.target.dataset.index;
    var data = that.data.carList[index];
    var idnexStyId = e.currentTarget.dataset.id;
    that.setData({
      coupleStyleId: idnexStyId
    })
    wx.getSystemInfo({
      success: function (res) {
        var _h = res.windowHeight;
        that.setData({ wheight: _h + 'px', modalHeight: (res.windowHeight - 140) + 'px' })
      }
    })
    wx.createSelectorQuery().select('.buy-button').boundingClientRect(function (rect) {
      var initRpx = rect.height / 98;
      var _mdh = parseFloat(that.data.wheight) - (167 * initRpx + 105 * initRpx + 206 * initRpx);
      that.setData({ mdheught: _mdh });
    }).exec()
    if(data.size&&data.size!=' '){
      that.setData({ size: data.size });
    }
    var type = data.type;
    that.modalChildInit(data);
    that.setData({ type: data.type,carIndex:index});
    var json = {
      type: data.type,
      styleId: data.styleId,
      stoneId: data.stoneId,
      platform: 3
    };
    if (data.type == '2'){
      var double = data.styleno.substring(data.styleno.length - 1) == 'G' ? 2 : 3;
      that.data.doubleRingType = double;
      json.doubleRingType = double;
      if (double == '2' && data.lettering && data.lettering != " "){
        that.setData({ manText: data.lettering});
      } else if (double == '3' && data.lettering && data.lettering!=" "){
        that.setData({ womanText: data.lettering});
      }
    }else{
      if (data.lettering && data.lettering != " ") {
        that.setData({ letter: data.lettering });
      } 
    }
    app.checkLoginAjax({
      url: '/goods/detail',
      data: json,
      success: function (res) {
        if (res.code == "000000") {
          that.setData({
            selectModal: false,
            isScroll:false
          });
          var data = res.data;
          if(type == '2'){
            that.doubleInitData(data);
          } else if (that.data.type == "1") {
            that.ringInitData(data);
          } else if (that.data.type == "3") {
            that.jewelryInfoInitData(data);
          }
        }
      }
    });
  },
  /**
  * 主钻选择点击事件
  */
  stoneClick: function (e) {
    var that = this;
    var index = e.target.dataset.index;
    var backColor = that.data.stoneList[index].backColor;
    if (backColor == "#fff" && that.data.stone != index) {
      that.data.stoneList[index].backColor = "#001a88";
      that.data.stoneList[index].color = "#fff";
      that.data.stoneList[index].borcolor = "#001a88";
      if (that.data.stone != "-1") {
        that.data.stoneList[that.data.stone].backColor = "#fff";
        that.data.stoneList[that.data.stone].color = "#333";
        that.data.stoneList[that.data.stone].borcolor = "#bdbdbd";
      }
      that.data.stoneList[index]
      that.setData({
        stoneList: that.data.stoneList,
        stone: index,
        stoneId: that.data.stoneList[index].stoneId
      });
      this.modalUpdateData();
    }
  },
  /**
  * 更新数据方法
  */
  modalUpdateData: function () {
    var that = this;
    var stoIndex = that.data.stone;
    var styIndex = that.data.style;
    var json = {};
    json.type = that.data.type;
    json.platform = 3;
   if (json.type == "2") {
      var styleId = that.data.doubleRingType == "2" ? that.data.styleId.split(",")[0] : that.data.styleId.split(",")[1];
      json.doubleRingType = that.data.doubleRingType;
      json.styleId = styleId;
    } else if (json.type != "2") {
      json.styleId = that.data.styleList[styIndex].styleId;
      json.stoneId = that.data.stoneList.length > 0 ? that.data.stoneList[stoIndex].stoneId : "";
    }
    json.token = app.getUserInfo() ? app.getUserInfo().token : "";
    app.ajax({
      url: '/goods/detail',
      data: json,
      success: function (res) {
        if (res.code == "000000") {
          var data = res.data;
          if (that.data.type == "1") {
            that.ringInitData(data);
          } else if (that.data.type == "3") {
            that.jewelryInfoInitData(data);
          } else if (that.data.type == "2") {
            that.doubleInitData(data);
          }
        }
      }
    });
  },
  /**
  * 戒托材质点击事件
  */
  styleClick: function (e) {
    var that = this;
    var index = e.target.dataset.index;
    var backColor = that.data.styleList[index].backColor;
    if (backColor == "#fff") {
      that.data.styleList[index].backColor = "#001a88";
      that.data.styleList[index].color = "#fff";
      that.data.styleList[index].borcolor = "#001a88";
      that.data.styleList[that.data.style].backColor = "#fff";
      that.data.styleList[that.data.style].color = "#333";
      that.data.styleList[that.data.style].borcolor = "#bdbdbd";
      that.data.styleList[index]
      that.setData({
        styleList: that.data.styleList,
        style: index,
        styleId: that.data.styleList[index].styleId
      });
      that.modalUpdateData();
    }
  },
  /**
   * 刻字预览点击事件
   */
  ringPreviewClick: function () {
    var text = this.data.letter;
    this.setData({
      kzylHide: false,
      previewText: text
    })
  },
  /**
   * 刻字预览区域关闭事件
   */
  previewClose: function () {
    this.setData({
      kzylHide: true,
      previewText: ""
    })
  },
  manPreviewClick: function () {
    var text = this.data.manText;
    this.setData({
      kzylHide: false,
      previewText: text
    })
  },
  womanPreviewClick: function () {
    var text = this.data.womanText;
    this.setData({
      kzylHide: false,
      previewText: text
    })
  },
  /***
   * 刻字输入框完成事件(失去焦点)
   */
  inputBlur: function (e) {
    this.setData({
      letter: e.detail.value
    })
  },
  clickheart: function () {
    var old = this.data.letter;
    if (old.length < 8) {
      var add = "♡";
      var newVal = old ? (old + add) : add;
      this.setData({
        letter: newVal
      })
    }
  },
  clicksymbol: function () {
    var old = this.data.letter;
    if (old.length < 8) {
      var add = "&";
      var newVal = old ? (old + add) : add;
      this.setData({
        letter: newVal
      })
    }
  },
  manInputBlur: function (e) {
    this.setData({
      manText: e.detail.value
    })
  },
  clickManHeart: function () {
    var old = this.data.manText;
    if (old.length < 8) {
      var add = "♡";
      var newVal = old ? (old + add) : add;
      this.setData({
        manText: newVal
      })
    }
  },
  clickManSymbol: function () {
    var old = this.data.manText;
    if (old.length < 8) {
      var add = "&";
      var newVal = old ? (old + add) : add;
      this.setData({
        manText: newVal
      })
    }
  },
  womanInputBlur: function (e) {
    this.setData({
      womanText: e.detail.value
    })
  },
  clickWomanHeart: function () {
    var old = this.data.womanText;
    if(old.length < 8){
      var add = "♡";
      var newVal = old ? (old + add) : add;
      this.setData({
        womanText: newVal
      })
    }
  },
  clickWomanSymbol: function () {
    var old = this.data.womanText;
    if (old.length < 8) {
      var add = "&";
      var newVal = old ? (old + add) : add;
      this.setData({
        womanText: newVal
      })
    }
  },
  /**
   * 选择手寸
   */
  bindPickerSizeChange: function (e) {
    var that = this;
    that.setData({
      sizeIndex: e.detail.value
    });
    var json = {
      stoneId: that.data.stoneId == "0" ? "" : that.data.stoneId,
      styleId: that.data.styleId,
      handSize: that.data.hindSize[that.data.sizeIndex],
      type: that.data.type,
      platform: 3
    }
    app.ajax({
      url: '/goods/getPrice',
      data: json,
      success: function (res) {
        if (res.code == "000000") {
          var data = res.data;
          that.setData({
            modalPrice: data
          })
        }
      }
    });
  },
  /**
   * 男手寸选择事件
   */
  bindPickerMSizeChange: function (e) {
    var that = this;
    that.setData({
      mSizeIndex: e.detail.value
    });
    var msize = that.data.manHindSize[that.data.mSizeIndex] ? that.data.manHindSize[that.data.mSizeIndex] : -1;
    var wsize = that.data.womanHindSize[that.data.wSizeIndex] ? that.data.womanHindSize[that.data.wSizeIndex] : -1;
    var json = {
      stoneId: that.data.stoneId,
      styleId: that.data.coupleStyleId,
      handSize: msize ,
      type: that.data.type,
      platform: 3
    }
    app.ajax({
      url: '/goods/getPrice',
      data: json,
      success: function (res) {
        if (res.code == "000000") {
          var data = res.data;
          that.setData({
            modalPrice: data
          })
        }
      }

    });
  },
  /**
  * 女手寸选择事件
  */
  bindPickerWSizeChange: function (e) {
    var that = this;
    that.setData({
      wSizeIndex: e.detail.value
    });
    var msize = that.data.manHindSize[that.data.mSizeIndex] ? that.data.manHindSize[that.data.mSizeIndex] : -1;
    var wsize = that.data.womanHindSize[that.data.wSizeIndex] ? that.data.womanHindSize[that.data.wSizeIndex] : -1;
    var json = {
      stoneId: that.data.stoneId,
      styleId: that.data.coupleStyleId,
      handSize:  wsize,
      type: that.data.type,
      platform: 3
    }
    app.ajax({
      url: '/goods/getPrice',
      data: json,
      success: function (res) {
        if (res.code == "000000") {
          var data = res.data;
          that.setData({
            modalPrice: data
          })
        }
      }
    });
  },
  /**弹窗确定按钮点击后删除当前数据并重新加入购物车**/
  updateAddShopCart:function(delJson){
    var that = this;
    var gtype = that.data.type;
    var dtype = that.data.doubleRingType;
    var token = app.getUserInfo().token;
    var list = [];
    //婚戒
    if (gtype == "1") {
      //验证刻字
      // if (!that.data.letterHide && !/^[a-zA-Z\u4e00-\u9fa5\u&\u♡]+$/.test(that.data.letter, 4) && that.data.letter) {
      //   app.alert("刻字仅支持包含汉字、字母、&及♡的内容!");
      //   return
      // }
      var json1 = {};
      json1.type = 1;
      json1.count = 1;
      json1.platform = 3;
      json1.token = token;
      json1.stoneId = that.data.stoneId;
      json1.styleId = that.data.styleId;
      json1.size = that.data.hindSize[that.data.sizeIndex];
      //如切换材质，判断当前刻字是否展示，不展示(不支持)则不传刻字信息
      json1.lettering = that.data.letterHide ? "" : that.data.letter; 
      list.push(json1);
    }
    //饰品
    if (gtype == "3") {
      //验证刻字
      // if (!that.data.letterHide && !/^[a-zA-Z\u4e00-\u9fa5\u&\u♡]+$/.test(that.data.letter, 4) && that.data.letter) {
      //   app.alert("刻字仅支持包含汉字、字母、&及♡的内容!");
      //   return
      // }
      var json2 = {};
      json2.type = 3;
      json2.count = 1;
      json2.platform = 3;
      json2.token = token;
      json2.stoneId = that.data.stoneId;
      json2.styleId = that.data.styleId;
      json2.size = that.data.hindSize.length == 0 ? "" : that.data.hindSize[that.data.sizeIndex];
      //如切换材质，判断当前刻字是否展示，不展示(不支持)则不传刻字信息
      json2.lettering = that.data.letterHide ? "" : that.data.letter;
      list.push(json2);
    }
    //男戒
    if (gtype == "2" && dtype == "2") {
      //验证刻字
      // if (!that.data.manLetter && !/^[a-zA-Z\u4e00-\u9fa5\u&\u♡]+$/.test(that.data.manText, 4) && that.data.manText) {
      //   app.alert("刻字仅支持包含汉字、字母、&及♡的内容!");
      //   return
      // }
      var json3 = {};
      json3.type = 2;
      json3.count = 1;
      json3.platform = 3;
      json3.token = token;
      json3.stoneId = that.data.stoneId.split(",")[0];
      json3.styleId = that.data.styleId.split(",")[0];
      json3.size = that.data.manHindSize[that.data.mSizeIndex];
      //如切换材质，判断当前刻字是否展示，不展示(不支持)则不传刻字信息
      json3.lettering = that.data.manLetter ? "" : that.data.manText;
      list.push(json3);
    }
    //女戒
    if (gtype == "2" && dtype == "3") {
      //验证刻字
      // if (!that.data.womanLetter && 
      //     !/^[a-zA-Z\u4e00-\u9fa5\u&\u♡]+$/.test(that.data.womanText, 4) && 
      //     that.data.womanText) {
      //   app.alert("刻字仅支持包含汉字、字母、&及♡的内容!");
      //   return
      // }
      var json3 = {};
      json3.type = 2;
      json3.count = 1;
      json3.platform = 3;
      json3.token = token;
      json3.stoneId = that.data.stoneId.split(",")[1];
      json3.styleId = that.data.styleId.split(",")[1];
      json3.size = that.data.womanHindSize[that.data.wSizeIndex];
      json3.lettering = that.data.womanLetter ? "" : that.data.womanText;
      list.push(json3);
    }
    //先删除原购物车商品
    app.checkLoginAjax({
      url: '/shoppingCart/delete',
      data: delJson,
      success: function (res) {
        //删除成功
        if (res.code == "000000") {
          //添加新的商品到购物车
          app.checkLoginAjax({
            url: '/shoppingCart/add',
            data: list,
            header: { "content-type": "application/json;charset=UTF-8" },
            success: function (res) {
              if (res.code == "000000") {
                that.setData({ selectModal: true, isScroll: true });
                wx.showToast({ title: '编辑成功', icon: "none" });
                that.initData();
              }
            }
          });
        }
      }
    });
  },
  /**弹窗确定按钮**/
  modalSaveOk:function(){
      var that = this;
      var token = app.getUserInfo().token;
      var json = {
        token: token,
        cartId: that.data.carList[that.data.carIndex].id
      }
      //1) 删除 2) 更新
      that.updateAddShopCart(json);
  },
  /**隐藏弹出层**/
  closeModal: function () {
    this.setData({
      selectModal: true,
      isScroll:true
    })
  },
  //对戒-刻字显示处理
  letteringShow(manLettering, femaleLettering){
    var doubleLetter = true;
    var manLetter = true;
    var famaleLetter = true;
    //男女戒都不支持刻字
    if(manLettering != '1' && femaleLettering != '1') {
      doubleLetter = true;
    }
    //男戒不支持刻字
    else if (manLettering != '1' && femaleLettering == '1') {
      doubleLetter = false;
      manLetter = true;
      famaleLetter = false;
    }
    //女戒不支持刻字
    else if (manLettering == '1' && femaleLettering != '1') {
      doubleLetter = false;
      manLetter = false;
      famaleLetter = true;
    }
    //男女戒都可支持刻字
    else{
      doubleLetter = false;
      manLetter = false;
      famaleLetter = false;
    }

    this.setData({
      doubleLetterHide: doubleLetter,
      manLetter: manLetter,
      womanLetter: famaleLetter
    })
  }
})