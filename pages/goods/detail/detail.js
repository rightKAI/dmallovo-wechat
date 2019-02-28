 // pages/goods/detail/detail.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    eva:"",
    loading:false,
    focus: false,
    goods:"active",
    detail:"",
    stone:"-1",
    style:"0",
    stoneId: "",
    styleId: "",
    sex:"0",
    letter:"",
    sizeHide:false,//单尺寸
    doubleSizeHide:true,//双尺寸(对戒尺寸)
    letterHide:false,//单刻字
    doubleLetterHide:true,//双刻字(对戒刻字)
    loadNum:0,
    hasDouble:true,//规格
    hasRing:false,//主钻选择,
    stoneParms:false,
    name:"",
    weight:"",
    color:"",
    cut:"",
    neat:"",
    price:"",
    type:"",
    doubleRingType:1,
    imgUrls: [],
    stoneList:[],
    styleList: [],
    sexList:[
      { name: "男女对戒",  backColor: "#001a88", color: "#fff"},
      { name: "单男戒", backColor: "#fff", color: "#333"},
      { name: "单女戒", backColor: "#fff", color: "#333"}
    ],
    hindSize:[],
    manHindSize:[],
    womanHindSize:[],
    sizeIndex:-1,
    wSizeIndex:-1,
    mSizeIndex:-1,
    womanSizeHas:false,
    manSizeHas:false,
    womanLetter:false,
    manLetter:false,
    kzylHide:true,//刻字预览
    womanText:"",//女刻字
    manText:"",//男刻字,
    previewText:"",
    option:{},
    isCollect:0,
    paramList:[],
    detailHide:false,
    paramHide:true,
    evaluateHide: true,
    hideContent: false,
    noContent: true,
    edata: [],
    pselectImg:'',
    selectModal:true,
    hasFixed:'',
    isScroll:true,
    sizeText:'',
    styText:'',
    stoText:'',
    cutParms:false,
    hasGoShopCart: false, //在弹出层内点确定判断弹窗打开前是否由加入购物车入口的
    hasGoShopNew: false, //在弹出层内点确定判断弹窗打开前是否由立即购买入口的
    isShopSave: true,
    isShopSaveType: 2,
    initOptions:'',//页面进来带的参数
    hasBanShop:""//判断购物车及立即购买两个按钮是否可以够购买
  },
  //页面滚动事件
  pageScroll:function(e){
    var that = this;
    var goodsInfoTop = that.data.goodsInfoTop;
    wx.createSelectorQuery().select('#scrollView').scrollOffset(function (res) {
      res.id      // 节点的ID
      res.dataset // 节点的dataset
      res.scrollLeft // 节点的水平滚动位置
      res.scrollTop  // 节点的竖直滚动位置
      if (goodsInfoTop * 2 <= res.scrollTop){
        that.setData({hasFixed:'setFixed'})
      }else{
        that.setData({ hasFixed: '' })
      }
    }).exec()
  },
  /**
   * 预览评价图片
   */
  previewImg:function(e){
    var index = e.target.dataset.index;
    wx.previewImage({
      current: this.data.imgsList[index], // 当前显示图片的http链接
      urls: this.data.imgsList // 需要预览的图片http链接列表
    })
  },
  /**
   * 刻字预览点击事件
   */
  ringPreviewClick:function(){
    var text = this.data.letter;
    this.setData({
      kzylHide: false,
      previewText: text
    })
  },
  /**
   * 刻字预览区域关闭事件
   */
  previewClose:function(){
    this.setData({
      kzylHide: true,
      previewText: ""
    })
  },
  manPreviewClick:function(){
    var text = this.data.manText;
    this.setData({
      kzylHide: false,
      previewText: text
    })
  },
  womanPreviewClick:function(){
    var text = this.data.womanText;
    this.setData({
      kzylHide: false,
      previewText: text
    })
  },
  /***
   * 刻字输入框完成事件(失去焦点)
   */
  inputBlur:function(e){
    this.setData({
      letter: e.detail.value
    })
  },
  clickheart:function(){
    var old = this.data.letter;
    if (old.length < 8) {
      var add = "♡";
      var newVal = old?(old+add):add;
      this.setData({
        letter: newVal
      })
    }
  },
  clicksymbol:function(){
    var old = this.data.letter;
    if (old.length < 8) {
      var add = "&";
      var newVal = old ? (old + add) : add;
      this.setData({
        letter: newVal
      })
    }
  },
  manInputBlur:function(e){
    this.setData({
      manText: e.detail.value
    })
  },
  clickManHeart:function(){
    var old = this.data.manText;
    if (old.length < 8) {
      var add = "♡";
      var newVal = old ? (old + add) : add;
      this.setData({
        manText: newVal
      })
    }
  },
  clickManSymbol:function(){
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
    if (old.length < 8) {
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
  bindPickerSizeChange:function(e){
    var that = this;
    that.setData({
      sizeIndex: e.detail.value,
      sizeText: '"' + that.data.hindSize[e.detail.value]+'寸"'
    });
    var json = {
      stoneId: that.data.stoneId == "0" ? "":that.data.stoneId,
      styleId: that.data.styleId,
      handSize: that.data.hindSize[that.data.sizeIndex],
      type: that.data.type,
      platform:3
    }
    app.ajax({
      url: '/goods/getPrice',
      data: json,
      success: function (res) {
        if (res.code == "000000") {
          var data = res.data;
          that.setData({
            price: data
          })
        }
      }
    });
  },
  /**
   * 男手寸选择事件
   */
  bindPickerMSizeChange:function(e){
    var that = this; 
    var doubleRingType = that.data.doubleRingType;
    if (doubleRingType=='1'){
      var ms = that.data.manHindSize[e.detail.value] ? '男戒' + that.data.manHindSize[e.detail.value]+'寸':'';
      var ws = that.data.womanHindSize[that.data.wSizeIndex] ? '女戒' + that.data.womanHindSize[that.data.wSizeIndex]+'寸' : '';
      var l = [];
      l.push(ms);
      if(ws){
        l.push(ws);
      }
      var sizeText = '"'+l.join()+'"';
    }else{
      var sizeText = '"男戒' + that.data.manHindSize[e.detail.value] + '寸"';
    }
    that.setData({
      mSizeIndex: e.detail.value,
      sizeText: sizeText
    });
    var msize = that.data.manHindSize[that.data.mSizeIndex] ? that.data.manHindSize[that.data.mSizeIndex]:-1;
    var wsize = that.data.womanHindSize[that.data.wSizeIndex] ? that.data.womanHindSize[that.data.wSizeIndex]:-1;
    var json = {
      stoneId: that.data.stoneId,
      styleId: that.data.styleId,
      handSize: msize + "," + wsize,
      type: that.data.type,
      platform: 3
    }
    if (doubleRingType != '1'){
      json.styleId = that.data.styleId.split(',')[0];
      json.stoneId = that.data.stoneId.split(',')[0];
      json.handSize = msize;
    }
    app.ajax({
      url: '/goods/getPrice',
      data: json,
      success: function (res) {
        if (res.code == "000000") {
          var data = res.data;
          that.setData({
            price: data
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
    var doubleRingType = that.data.doubleRingType;
    if (doubleRingType == '1') {
      var ms = that.data.manHindSize[that.data.mSizeIndex] ? '男戒' + that.data.manHindSize[that.data.mSizeIndex] + '寸' : '';
      var ws = that.data.womanHindSize[e.detail.value] ? '女戒' + that.data.womanHindSize[e.detail.value] + '寸' : '';
      var l = [];
      if (ms) {
        l.push(ms);
      }
      l.push(ws);
      var sizeText = '"' + l.join() + '"';
    } else {
      var sizeText = '"女戒' + that.data.womanHindSize[e.detail.value] + '寸"';
    }
    that.setData({
      wSizeIndex: e.detail.value,
      sizeText: sizeText
    });
    var msize = that.data.manHindSize[that.data.mSizeIndex] ? that.data.manHindSize[that.data.mSizeIndex] : -1;
    var wsize = that.data.womanHindSize[that.data.wSizeIndex] ? that.data.womanHindSize[that.data.wSizeIndex] : -1;
    var json = {
      stoneId: that.data.stoneId,
      styleId: that.data.styleId,
      handSize: msize + "," + wsize,
      type: that.data.type,
      platform: 3
    }
    if (doubleRingType != '1') {
      json.styleId = that.data.styleId.split(',')[1];
      json.stoneId = that.data.stoneId.split(',')[1];
      json.handSize = wsize;
    }
    app.ajax({
      url: '/goods/getPrice',
      data: json,
      success: function (res) {
        if (res.code == "000000") {
          var data = res.data;
          that.setData({
            price: data
          })
        }
      }
    });
  },
  /**
   * 预约进店
   */
  goBaguette:function(){
    var url = '/pages/store/list/list';
    app.goto(url)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //将原始参数存储起来不进行修改，主要用于商品下架逻辑判断用
    that.setData({ initOptions: options})
    wx.getSystemInfo({
      success: function (res) {
        var _h = res.windowHeight;
        that.setData({ wheight: _h + 'px', modalHeight: (res.windowHeight-140)+'px'})
      }
    })
    wx.createSelectorQuery().select('.banner').boundingClientRect(function (rect) {
      var initRpx = rect.height/750;
      var _mdh = parseFloat(that.data.wheight)-(167 * initRpx + 105 * initRpx + 206 * initRpx);
      that.setData({mdheught:_mdh});
    }).exec()
    if (options.type == "1") {
      wx.setNavigationBarTitle({ title: '求婚钻戒' })
      that.setData({
        hasRing: false,
        hasDouble: true,
        sizeHide: false,
        doubleSizeHide: true,
        doubleLetterHide: true,
        stoneId: options.stoneId == null || options.stoneId == 'null' ? 0 : options.stoneId,
        styleId: options.styleId,
        stoneParms:false,
        type:1
      });
      that.initData();
    }
    if(options.type == "2"){
      wx.setNavigationBarTitle({ title: '结婚对戒' })
      that.setData({
        hasRing:true,
        hasDouble:false,
        sizeHide: true,
        doubleSizeHide: false,
        letterHide: true,
        stoneId: options.stoneId == null || options.stoneId == 'null' ? 0 : options.stoneId,
        styleId: options.styleId,
        doubleRingType: options.double ? options.double:1,
        stoneParms:true,
        type: 2
      });
      that.doubleRingInitData();
    }
    if (options.type == "3") {
      wx.setNavigationBarTitle({ title: '饰品' })      
      that.setData({
        hasRing: false,
        hasDouble: true,
        sizeHide: false,
        doubleSizeHide: true,
        doubleLetterHide: true,
        stoneId: options.stoneId == null || options.stoneId == 'null' ? 0 : options.stoneId,
        styleId: options.styleId,
        stoneParms: false,
        type: 3
      });
      that.initData();
    }
    //评论数据
    that.evaluateInitData();
  },
  /**
   * 对戒数据渲染
   */
  doubleRingInitData:function(){
    var that = this;
    var json = {
      stoneId: that.data.stoneId,
      styleId: that.data.styleId,
      type: that.data.type,
      doubleRingType:that.data.doubleRingType,
      platform: 3
    }
    var hasBanShop = "";//用于判断商品是否有下架状态不可购买
    app.ajax({
      url: '/goods/detail',
      data: json,
      success: function (res) {
        if (res.code == "000000") {
          var data = res.data;
          var styList = data.listGoldClassify;
          var styleList = [];
          var paramStr = data.attr;
          var list = that.data.paramList;
          var pList = paramStr.substring(1, paramStr.length - 1).split(",");
          var setSty = 0;
          for (var i = 0; i < pList.length; i++) {
            var json = {};
            json.name = pList[i].split("=")[0];
            var vlist = pList[i].split("=")[1].split('/');
            if (json.name.replace(/^\s+|\s+$/g, "") == "款号" && vlist.length>1){
              var one = vlist[0].substring(0, vlist[0].length-1);
              var two = vlist[1].substring(1, vlist[1].length - 1);
              json.val = one+'/'+two;
            } else if (json.name.replace(/^\s+|\s+$/g, "") == "款号" && vlist.length == 1){
              var one = vlist[0].substring(0, vlist[0].length - 1);
              json.val = one;
            }else{
              json.val = pList[i].split("=")[1];
            }
            list.push(json);
          }
          for (var i = 0; i < styList.length; i++) {//材质
            var s = {};
            //获取材质是否下架状态（结合选择的男女对戒规格）,true:未下架可购买，false:下架不可购买
            var checkBan = that.checkBtnHasBan(styList[i]);
            s.name = styList[i].name;
            s.styleId = styList[i].styleId;
            if (that.data.styleId == styList[i].styleId || styList[i].styleId.indexOf(that.data.styleId) != -1) {
              //根据判断status是否显示，不能直接用status，因为对戒status为0的也要显示,对戒饰品仅显示选中下架的商品
              s.hasShow = true;
              //选中下架样式
              s.hasBanClass = checkBan ? '' : 'banClass';
              setSty = 1;
              s.backColor = checkBan ? "#001a88" : "#f6f8fe";
              s.color = checkBan ? "#fff" : "#cdcdcd";
              that.data.style = i;
              that.data.styText = styList[i].name;
              //购买按钮是否可以点击的class名(存在选中下架商品则不可购买)
              hasBanShop = s.hasBanClass == "banClass" ? "banShopClass" : hasBanShop;
            } else {
              //根据判断status是否显示，不能直接用status，因为对戒status为0的也要显示,对戒饰品仅显示选中下架的商品
              s.hasShow = true;
              //选中下架样式
              s.hasBanClass = checkBan ? '' : 'notClick';
              s.backColor = "#fff";
              s.color = checkBan ? "#333" : "#cdcdcd";
            }
            if (styList.length == 1 && i == 0) {
              setSty = 1;
              s.backColor = "#001a88";
              s.color = "#fff";
              that.data.style = i;
            }
            styleList.push(s);
          }
          that.setData({ style: that.data.style})
          var styStatus = styList[that.data.style].status;//选中的材质上下架状态
          if (that.data.doubleRingType == "1" || that.data.doubleRingType == "3") {
            var mslist = that.data.doubleRingType == "3"?[]:data.manRingInfo.listHandSize;
            var wslist = data.femaleRingInfo.listHandSize;
            var manSizeHas = that.data.doubleRingType == "1" ?false:true;
            var sex = that.data.doubleRingType == "1"?0:2;
            //对戒
            if(that.data.doubleRingType == "1"){
              that.data.sexList[0].backColor = styStatus == "1,1" ? "#001a88" :"#f6f8fe";
              that.data.sexList[0].color = styStatus == "1,1" ? "#fff" :"#cdcdcd";
              that.data.sexList[0].hasBanClass = styStatus == "1,1" ? '' : 'notClick';//是否可以点击
              that.data.sexList[1].color = styStatus == "1,1" ? "#333" : "#cdcdcd";
              that.data.sexList[1].hasBanClass = styStatus == "1,1" ? '' : 'notClick';//是否可以点击
              that.data.sexList[2].color = styStatus == "1,1" ? "#333" : "#cdcdcd";
              that.data.sexList[2].hasBanClass = styStatus == "1,1" ? '' : 'notClick';//是否可以点击
              //刻字显示处理
              that.letteringShow(data.manRingInfo.lettering,data.femaleRingInfo.lettering);
            }
            //女戒
            else if (that.data.doubleRingType == "3"){
              that.data.sexList[0].backColor = "#fff";
              that.data.sexList[0].color = styStatus == "1,1" ? "#333" : "#cdcdcd";
              that.data.sexList[0].hasBanClass = styStatus == "1,1" ? '' : 'notClick';//是否可以点击
              that.data.sexList[1].backColor = "#fff";
              that.data.sexList[1].color = styStatus == "1,1" || styStatus == "1,0" ? "#333" : "#cdcdcd";
              that.data.sexList[1].hasBanClass = styStatus == "1,1" || styStatus == "1,0" ? '' : 'notClick';//是否可以点击
              that.data.sexList[2].backColor = styStatus == "1,1" || styStatus == "0,1" ? "#001a88" : "#f6f8fe";
              that.data.sexList[2].color = styStatus == "1,1" || styStatus == "0,1" ? "#fff" : "#cdcdcd";
              that.data.sexList[2].hasBanClass = styStatus == "1,1" || styStatus == "0,1" ? '' : 'notClick';//是否可以点击
              //刻字显示处理
              that.letteringShow(2, data.femaleRingInfo.lettering);
            }
            that.setData({
              imgDetails: data.femaleRingInfo.detailImgs,
              paramList: list,
              manSizeHas: manSizeHas,
              womanSizeHas:false,
              sex: sex, 
              sexList: that.data.sexList,
              imgUrls: data.femaleRingInfo.bannerImgs,
              pselectImg: data.femaleRingInfo.bannerImgs[0],
              name: data.femaleRingInfo.showName
            })
          }
          if (that.data.doubleRingType == "2") {
            var mslist = data.manRingInfo.listHandSize;
            var wslist = [];
            var sex = 1;
            if (that.data.doubleRingType == "2") {
              that.data.sexList[0].backColor = "#fff";
              that.data.sexList[0].color = styStatus == "1,1" ? "#333" : "#cdcdcd";
              that.data.sexList[0].hasBanClass = styStatus == "1,1" ? '' : 'notClick';//是否可以点击
              that.data.sexList[1].backColor = styStatus == "1,1" || styStatus == "0,1" ?"#001a88":"#f6f8fe";
              that.data.sexList[1].color = styStatus == "1,1" || styStatus == "1,0" ?"#fff":"#cdcdcd";
              that.data.sexList[1].hasBanClass = styStatus == "1,1" || styStatus == "1,0" ? '' : 'notClick';//是否可以点击
              that.data.sexList[2].backColor = "#fff";
              that.data.sexList[2].color = styStatus == "1,1" || styStatus == "0,1" ? "#333" : "#cdcdcd";
              that.data.sexList[2].hasBanClass = styStatus == "1,1" || styStatus == "0,1" ? '' : 'notClick';//是否可以点击
            }
            //男戒显示刻字处理
            that.letteringShow(data.manRingInfo.lettering,2);
            that.setData({
              imgDetails: data.manRingInfo.detailImgs,
              paramList: list,
              manSizeHas: false,
              womanSizeHas: true,
              sex: sex,
              sexList: that.data.sexList
            })
            that.setData({
              imgUrls: data.manRingInfo.bannerImgs,
              pselectImg: data.manRingInfo.bannerImgs[0],
              name: data.manRingInfo.showName
            })
          }
          if (setSty != 1){
            styleList[0].backColor = "#001a88";
            styleList[0].color = "#fff";
            that.data.styText = styList[0].name;
          }
          that.setData({
            styleList: styleList,
            womanHindSize: wslist,
            manHindSize: mslist,
            style: that.data.style,
            price: data.price,
            styleId: styList[that.data.style].styleId,
            styText: '"'+that.data.styText+'"',
            stoneParms:true,
            hasBanShop: hasBanShop
          });
        }
      }
    });
  },
  /**
   * 判断对戒按钮状态(true:未下架可购买，false:下架不可购买)
   * 默认是下架状态
   */
  checkBtnHasBan:function(item){
    var that = this;
    var banStatus = false;
    if (that.data.doubleRingType=="1"&&item.status=="1,1"){
      banStatus = true;
    }
    if (that.data.doubleRingType == "2" && (item.status == "1,1" || item.status == "1,0")) {
      banStatus = true;
    }
    if (that.data.doubleRingType == "3" && (item.status == "1,1" || item.status == "0,1")) {
      banStatus = true;
    }
    return banStatus;
  },
  /**
   * 评论数据获取
   */
  evaluateInitData: function () {
    var that = this;
    var json = {
      styleId: that.data.styleId,
      page: 1,
      limit: 20
    }
    app.ajax({
      url: '/goods/listComment',
      data: json,
      success: function (res) {
        if (res.code == "000000") {
          var list = res.data.rows;
          if (list.length > 0) {
            that.setEvaluateParam(list)
          } else {
            that.setData({
              hideContent: true,
              noContent: false
            })
          }
        }
      }
    });
  },
  setEvaluateParam: function (list) {
    for (var i = 0; i < list.length; i++) {
      list[i].imgsList = list[i].imgs?list[i].imgs.split(','):[];
      var star = parseInt(list[i].score);
      var slist = [];
      for (var j = 1; j < 6; j++) {
        if (j < star || j == star) {
          slist.push("star");
        } else {
          slist.push("nostar");
        }
      }
      list[i].starList = slist;
    }
    this.setData({
      edata: list
    })
  },
  //单戒、饰品初始化
  initData:function(){
    var that = this;
    var json = {
      token: app.getUserInfo() ? app.getUserInfo().token : "",
      styleId: that.data.styleId,
      stoneId: that.data.stoneId,
      type: that.data.type,
      platform:3
    }
    app.ajax({
      url: '/goods/detail',
      data: json,
      success: function (res) {
        if(res.code=="000000"){
          var data = res.data;
          that.setData({
            isCollect:res.data.isCollect
          })
          if (that.data.type == "1"){
            that.ringInitData(data);
          } else if (that.data.type == "2"){
            that.doubleRingInitData();
          } else if (that.data.type == "3"){
            that.jewelryInfoInitData(data);
          }
        }
      }
    });
  },
  /**
   * 饰品初始数据渲染
   */
  jewelryInfoInitData:function(data){
    var that = this;
    var styList = data.listGoldClassify;//材质数据
    var stoList = data.listStone;//钻数据
    var sizeList = data.jewelryInfo.listHandSize;//尺寸数据
    var sizeHide = sizeList.length>0?false:true;
    var styleList = [];
    var stoneList = [];
    var paramStr = data.attr;//商品参数（字符串）
    var list = that.data.paramList;
    var pList = paramStr.substring(1, paramStr.length - 1).split(",");//后台返回的商品参数字符串转为数组
    var hasBanShop = "";//用于判断商品是否有下架状态不可购买
    for (var i = 0; i < pList.length; i++) {
      var json = {};
      json.name = pList[i].split("=")[0];
      json.val = pList[i].split("=")[1];
      list.push(json);
    }
    if (that.data.type == "3") {
      that.setData({
        imgDetails: data.jewelryInfo.detailImgs,
        paramList: list,
        letterHide: data.jewelryInfo.lettering == '1' ? false : true
      })
    }
    for (var i = 0; i < styList.length; i++) {//材质
      var s = {};
      s.name = styList[i].name;
      s.styleId = styList[i].styleId;
      if (that.data.styleId == styList[i].styleId) {
        //根据判断status是否显示，不能直接用status，因为对戒status为0的也要显示,对戒饰品仅显示选中下架的商品
        s.hasShow = true;
        //选中下架样式
        s.hasBanClass = styList[i].status == '0' ? 'banClass' : '';
        s.backColor = s.hasBanClass == 'banClass' ? "#f6f8fe" : "#001a88";
        s.color = s.hasBanClass == 'banClass' ? "#cdcdcd" : "#fff";
        that.data.style = i;
        that.data.styText = '"'+styList[i].name+'"';
        //购买按钮是否可以点击的class名(存在选中下架商品则不可购买)
        hasBanShop = s.hasBanClass == "banClass" ? "banShopClass" : hasBanShop;
      } else {
        //status为1显示或者为初始化默认选中但为下架的也要显示
        s.hasShow = styList[i].status == '1' || that.data.initOptions.styleId == styList[i].styleId ? true : false;
        s.hasBanClass = that.data.initOptions.styleId == s.styleId ? 'banClass' : '';
        s.backColor = s.hasBanClass == 'banClass' ? "#f6f8fe" : "#fff";
        s.color = s.hasBanClass == 'banClass' ? "#cdcdcd" : "#333";
      }
      styleList.push(s);
    }
    var isCheck = false;
    for (var i = 0; i < stoList.length; i++) {//钻
      var s = {};
      s.name = stoList[i].name;
      s.stoneId = stoList[i].stoneId;
      if (that.data.stoneId == stoList[i].stoneId) {
        //根据判断status是否显示，不能直接用status，因为对戒status为0的也要显示,对戒饰品仅显示选中下架的商品
        s.hasShow = true;
        //选中下架样式
        s.hasBanClass = stoList[i].status == '0' ? 'banClass' : '';
        s.backColor = s.hasBanClass == 'banClass' ? "#f6f8fe" : "#001a88";
        s.color = s.hasBanClass == 'banClass' ? "#cdcdcd" : "#fff";
        that.data.stone = i;
        isCheck = true;
        var stoText = '"'+stoList[i].name+'"';
        //购买按钮是否可以点击的class名(存在选中下架商品则不可购买)
        hasBanShop = s.hasBanClass == "banClass" ? "banShopClass" : hasBanShop;
      } else {
        //status为1显示或者为初始化默认选中但为下架的也要显示
        s.hasShow = stoList[i].status == '1' || that.data.initOptions.stoneId == stoList[i].stoneId ? true : false;
        s.hasBanClass = that.data.initOptions.stoneId == s.stoneId ? 'banClass' : '';
        s.backColor = s.hasBanClass == 'banClass' ? "#f6f8fe" : "#fff";
        s.color = s.hasBanClass == 'banClass' ? "#cdcdcd" : "#333";
      }
      stoneList.push(s);
    }
    //判断裸石是否有选中，没有选中说明搭配裸石不在列表中，默认选第一个
    if (stoList != null && stoList.length > 0 && !isCheck) {
      stoneList[0].backColor = "#001a88";
      stoneList[0].color = "#fff";
      that.data.stone = 0;
      isCheck = true;
      var stoText = '"' + stoList[0].name + '"';
    }
    if (data.jewelryInfo.stoneShowType == 1) {
      var weight = data.jewelryInfo.stoneWeightStr;
      var color = data.jewelryInfo.stoneColor;
      var cut = data.jewelryInfo.stoneCut;
      var neat = data.jewelryInfo.stoneNeatness;
      var stoneParms = false;
      var cutParms = false;
    }
    if (data.jewelryInfo.stoneShowType == 2) {
      var weight = data.jewelryInfo.mainStoneWeightRegionStr;
      var color = 'H';
      var cut = data.jewelryInfo.stoneCut ? data.jewelryInfo.stoneCut : '';
      var neat = 'SI';
      var stoneParms = false;
      var cutParms = false;
    }
    if (data.jewelryInfo.stoneShowType == 3) {
      var weight = data.jewelryInfo.stoneWeightStr;
      var color = data.jewelryInfo.stoneColor;
      var cut = data.jewelryInfo.stoneCut;
      var neat = data.jewelryInfo.stoneNeatness;
      var stoneParms = true;
      var cutParms = false;
    }
    that.setData({
      hasRing: isCheck ? false : true,
      styleList: styleList,
      stoneList: stoneList,
      hindSize: sizeList,
      style: that.data.style,
      imgUrls: data.jewelryInfo.bannerImgs,
      price: data.price,
      name: data.jewelryInfo.showName,
      sizeHide: sizeHide,
      pselectImg: data.jewelryInfo.bannerImgs[0],
      stoText: stoText,
      styText: that.data.styText,
      cutParms: cutParms,
      weight: weight,
      color: color,
      cut: cut,
      neat: neat,
      cutParms: cutParms,
      hasBanShop: hasBanShop
    })
  },
  /**
   * 求婚钻戒初始数据渲染
   */
  ringInitData:function(data){
    var that = this;
    var stoList = data.listStone;//钻数据
    var styList = data.listGoldClassify;//材质数据
    var sizeList = data.ringInfo.listHandSize;//尺寸数据
    var stoneList = [];
    var styleList = [];
    var paramStr = data.attr;//商品参数（字符串）
    var list = that.data.paramList;
    var hasBanShop = "";//用于判断商品是否有下架状态不可购买
    var pList = paramStr.substring(1, paramStr.length - 1).split(",");//后台返回的商品参数字符串转为数组
    for (var i = 0; i < pList.length; i++) {
      var json = {};
      json.name = pList[i].split("=")[0];
      json.val = pList[i].split("=")[1];
      list.push(json);
    }
    if (that.data.type == "1") {
      that.setData({
        imgDetails: data.ringInfo.detailImgs,
        paramList: list,
        letterHide: data.ringInfo.lettering == '1' ? false : true
      })
    }
    var isCheck = false;
    var stoText = '';
    for (var i = 0; i < stoList.length; i++) {//钻
      var s = {};
      s.name = stoList[i].name;
      s.stoneId = stoList[i].stoneId;
      if (that.data.stoneId == stoList[i].stoneId) {
        //根据判断status是否显示，不能直接用status，因为对戒status为0的也要显示,对戒饰品仅显示选中下架的商品
        s.hasShow = true;
        //选中下架样式
        s.hasBanClass = stoList[i].status=='0'?'banClass':'';
        s.backColor = s.hasBanClass == 'banClass' ? "#f6f8fe" :"#001a88";
        s.color = s.hasBanClass == 'banClass' ? "#cdcdcd" :"#fff";
        s.borColor = "#001a88";
        that.data.stone = i;
        isCheck = true;
        stoText = '"'+s.name+'"';
        //购买按钮是否可以点击的class名(存在选中下架商品则不可购买)
        hasBanShop = s.hasBanClass == "banClass" ? "banShopClass" : hasBanShop;
      } else {
        //status为1显示或者为初始化默认选中但为下架的也要显示
        s.hasShow = stoList[i].status == '1' || that.data.initOptions.stoneId == stoList[i].stoneId?true:false;
        s.hasBanClass = that.data.initOptions.stoneId == s.stoneId? 'banClass' : '';
        s.backColor = s.hasBanClass == 'banClass' ?"#f6f8fe":"#fff";
        s.color = s.hasBanClass == 'banClass' ?"#cdcdcd":"#333";
      }
      stoneList.push(s);
    }
    //判断裸石是否有选中，没有选中说明搭配裸石不在列表中，默认选第一个
    if (!isCheck && stoneList.length>0){
      stoneList[0].backColor = "#001a88";
      stoneList[0].color = "#fff";
      s.borColor = "#001a88";
      stoText = '"' +stoneList[0].name+'"';
      that.data.stone = 0;
    }

    for (var i = 0; i < styList.length; i++) {//材质
      var s = {};
      s.name = styList[i].name;
      s.styleId = styList[i].styleId;
      if (that.data.styleId == styList[i].styleId) {
        //根据判断status是否显示，不能直接用status，因为对戒status为0的也要显示,对戒饰品仅显示选中下架的商品
        s.hasShow = true;
        //选中下架样式
        s.hasBanClass = styList[i].status == '0' ? 'banClass' : '';
        s.backColor = s.hasBanClass == 'banClass' ? "#f6f8fe" : "#001a88";
        s.color = s.hasBanClass == 'banClass' ? "#cdcdcd" : "#fff";
        s.borColor = "#001a88";
        that.data.style = i;
        var styText = '"' +s.name+'"';
        //购买按钮是否可以点击的class名(存在选中下架商品则不可购买)
        hasBanShop = s.hasBanClass == "banClass" ? "banShopClass" : hasBanShop;
      } else {
        //status为1显示或者为初始化默认选中但为下架的也要显示
        s.hasShow = styList[i].status == '1' || that.data.initOptions.styleId == styList[i].styleId ? true : false;
        s.hasBanClass = that.data.initOptions.styleId == s.styleId ? 'banClass' : '';
        s.backColor = s.hasBanClass == 'banClass' ? "#f6f8fe" : "#fff";
        s.color = s.hasBanClass == 'banClass' ? "#cdcdcd" : "#333";
      }
      styleList.push(s);
    }
    if (data.ringInfo.stoneShowType == 1){
      var weight = data.ringInfo.stoneWeightStr;
      var color = data.ringInfo.stoneColor;
      var cut = data.ringInfo.stoneCut;
      var neat = data.ringInfo.stoneNeatness;
      var stoneParms = false;
      var cutParms = false;
    }
    if (data.ringInfo.stoneShowType == 2) {
      var weight = data.ringInfo.mainStoneWeightRegionStr;
      var color = 'H';
      var cut = data.ringInfo.stoneCut ? data.ringInfo.stoneCut:'';
      var neat = 'SI';
      var stoneParms = false;
      var cutParms = false;
    }
    if (data.ringInfo.stoneShowType == 3) {
      var weight = data.ringInfo.stoneWeightStr;
      var color = data.ringInfo.stoneColor;
      var cut = data.ringInfo.stoneCut;
      var neat = data.ringInfo.stoneNeatness;
      var stoneParms = true;
      var cutParms = false;
    }
    that.setData({
      styleList: styleList,
      stoneList: stoneList,
      hindSize: sizeList,
      stone: that.data.stone,
      style: that.data.style,
      imgUrls: data.ringInfo.bannerImgs,
      weight: weight,
      color: color,
      cut: cut,
      neat: neat,
      price: data.price,
      name: data.ringInfo.showName,
      pselectImg: data.ringInfo.bannerImgs[0],
      styText: styText,
      stoText: stoText,
      cutParms: cutParms,
      hasBanShop: hasBanShop
    })
    if(cut==null || cut==''){
      cut: '4564564564'
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    var query = wx.createSelectorQuery();
    query.select('.goodsInfo').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      that.setData({ goodsInfoTop: res[0].top})
    })
  },
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
  onShareAppMessage: function () {},
  /**
   * 商品详情tab切换
   */
  detailTab:function(e){
    var that = this;
    var id = e.target.id;
    if (id == "goods" && that.data.goods != "active") {
      that.setData({
        goods: "active",
        detail: "",
        eva: "",
        detailHide: false,
        paramHide: true,
        evaluateHide:true
      });
    }
    if (id == "detail" && that.data.detail != "active") {
      that.setData({
        goods: "",
        detail: "active",
        eva: "",
        detailHide: true,
        paramHide: false,
        evaluateHide:true
      });
    }
    if (id == "eva" && that.data.eva != "active") {
      that.setData({
        goods: "",
        detail: "",
        eva: "active",
        detailHide: true,
        paramHide: true,
        evaluateHide:false
      });
    }
  },
  /**
   * 顶部tab切换
   */
  clickTab:function(e){
    var that = this;
    var styleId = that.data.styleId;
    var type = that.data.type;
    var stoneId = that.data.stoneId;
    var double = that.data.doubleRingType
    var id = e.target.id;
    var that = this;
    if (id == "goods" && that.data.goods != "active") {
      var url = type == "2" ? '../detail/detail?styleId=' + styleId + '&stoneId=' + stoneId + '&type=' + type + '&double=' + double : '../detail/detail?styleId=' + styleId + '&stoneId=' + stoneId + '&type=' + type;
      app.goto(url);
    }
    if (id == "detail" && that.data.detail != "active") {
      var url = type == "2" ? '../parameter/parameter?styleId=' + styleId + '&stoneId=' + stoneId + '&type=' + type + '&double=' + double : '../parameter/parameter?styleId=' + styleId + '&stoneId=' + stoneId + '&type=' + type;
      app.goto(url);
    }
    if (id == "eva" && that.data.eva != "active") {
      var url = type == "2" ? '../evaluate/evaluate?styleId=' + styleId + '&stoneId=' + stoneId + '&type=' + type + '&double=' + double : '../evaluate/evaluate?styleId=' + styleId + '&stoneId=' + stoneId + '&type=' + type;
      app.goto(url);
    }
  },
  /**
   * 更新数据方法
   */
  updateData:function(){
    var that = this;
    var stoIndex = that.data.stone;
    var styIndex = that.data.style;
    var json = {};
    json.type = that.data.type;
    json.platform = 3;
    if (json.type == "2" && that.data.sex == "0"){
      var styleId = that.data.styleId;
      json.styleId = styleId;
      json.doubleRingType = 1;
    } else if (json.type == "2" && that.data.sex != "0"){
      var styleId = that.data.sex == "1" ? that.data.styleId.split(",")[0] : that.data.styleId.split(",")[1];
      json.doubleRingType = that.data.sex == "1"?2:3;
      json.styleId = styleId;
    } else if (json.type != "2"){
      json.styleId = that.data.styleList[styIndex].styleId;
      json.stoneId = that.data.stoneList.length>0 ? that.data.stoneList[stoIndex].stoneId : "";
    }
    json.token = app.getUserInfo() ? app.getUserInfo().token : "";
    app.ajax({
      url: '/goods/detail',
      data: json,
      success: function (res) {
        if (res.code == "000000") {
          var data = res.data;
          //更新婚戒信息
          if (that.data.type == "1") {
            that.ringInitData(data);
          } 
          //更新饰品信息
          else if (that.data.type == "3") {
            that.jewelryInfoInitData(data);
          }
          //更新对戒信息
          else if (that.data.type == "2"){
            var styList = data.listGoldClassify;
            var styleList = [];
            var mslist = json.doubleRingType == '1' || json.doubleRingType == '2' ? data.manRingInfo.listHandSize:[];
            var wslist = json.doubleRingType == '1' || json.doubleRingType == '3' ? data.femaleRingInfo.listHandSize:[];
            var hasBanShop = "";//用于判断商品是否有下架状态不可购买
            
            //轮播图、商品名称赋值
            var imgs = [];
            var showName = '';
            for (var i = 0; i < styList.length; i++) {//材质
              var s = {};
              s.name = styList[i].name;
              s.styleId = styList[i].styleId;
              //获取材质是否下架状态（结合选择的男女对戒规格）,true:未下架可购买，false:下架不可购买
              var checkBan = that.checkBtnHasBan(styList[i]);
              if (that.data.styleId == styList[i].styleId) {
                //根据判断status是否显示，不能直接用status，因为对戒status为0的也要显示,对戒饰品仅显示选中下架的商品
                s.hasShow = true;
                //选中下架样式
                s.hasBanClass = checkBan ? '' : 'banClass';
                s.backColor = checkBan ? "#001a88" : "#f6f8fe";
                s.color = checkBan ? "#fff" : "#cdcdcd";
                that.data.style = i;
                //购买按钮是否可以点击的class名(存在选中下架商品则不可购买)
                hasBanShop = s.hasBanClass == "banClass" ? "banShopClass" : hasBanShop;
              } else {
                //根据判断status是否显示，不能直接用status，因为对戒status为0的也要显示,对戒饰品仅显示选中下架的商品
                s.hasShow = true;
                //选中下架样式
                s.hasBanClass = checkBan ? '' : 'notClick';
                s.backColor = "#fff";
                s.color = checkBan ? "#333" : "#cdcdcd";
              }
              if (styList.length == 1 && i == 0) {
                s.backColor = "#001a88";
                s.color = "#fff";
                that.data.style = i;
              }
              styleList.push(s);
            }
            that.setData({ style: that.data.style })
            var styStatus = styList[that.data.style].status;//选中的材质上下架状态
            //对戒,默认取女戒轮播图、女戒展示名称
            if(json.doubleRingType == '1'){
              imgs = data.femaleRingInfo.bannerImgs;
              showName = data.femaleRingInfo.showName;
              //刻字展示处理
              that.letteringShow(data.manRingInfo.lettering, data.femaleRingInfo.lettering);
              //男女对戒规格按钮状态
              //对戒
                that.data.sexList[0].backColor = styStatus == "1,1" ? "#001a88" : "#f6f8fe";
                that.data.sexList[0].color = styStatus == "1,1" ? "#fff" : "#cdcdcd";
                that.data.sexList[0].hasBanClass = styStatus == "1,1" ? '' : 'notClick';//是否可以点击
                that.data.sexList[1].color = styStatus == "1,1" ? "#333" : "#cdcdcd";
                that.data.sexList[1].hasBanClass = styStatus == "1,1" ? '' : 'notClick';//是否可以点击
                that.data.sexList[2].color = styStatus == "1,1" ? "#333" : "#cdcdcd";
                that.data.sexList[2].hasBanClass = styStatus == "1,1" ? '' : 'notClick';//是否可以点击
            }
            //男戒
            else if (json.doubleRingType == '2'){
              imgs = data.manRingInfo.bannerImgs;
              showName = data.manRingInfo.showName;
              //刻字展示处理
              that.letteringShow(data.manRingInfo.lettering, 2);
                that.data.sexList[0].backColor = "#fff";
                that.data.sexList[0].color = styStatus == "1,1" ? "#333" : "#cdcdcd";
                that.data.sexList[0].hasBanClass = styStatus == "1,1" ? '' : 'notClick';//是否可以点击
                that.data.sexList[1].backColor = styStatus == "1,1" || styStatus == "1,0" ? "#001a88" : "#f6f8fe";
                that.data.sexList[1].color = styStatus == "1,1" || styStatus == "1,0" ? "#fff" : "#cdcdcd";
                //是否可以点击
                that.data.sexList[1].hasBanClass = styStatus == "1,1" || styStatus == "1,0" ? '' : 'notClick';
                that.data.sexList[2].backColor = "#fff";
                that.data.sexList[2].color = styStatus == "1,1" || styStatus == "0,1" ? "#333" : "#cdcdcd";
                //是否可以点击
                that.data.sexList[2].hasBanClass = styStatus == "1,1" || styStatus == "0,1" ? '' : 'notClick';
            }
            //女戒
            else{
              imgs = data.femaleRingInfo.bannerImgs;
              showName = data.femaleRingInfo.showName;
              //刻字展示处理
              that.letteringShow(2, data.femaleRingInfo.lettering);
              //男女对戒规格按钮状态
              that.data.sexList[0].backColor = "#fff";
              that.data.sexList[0].color = styStatus == "1,1" ? "#333" : "#cdcdcd";
              that.data.sexList[0].hasBanClass = styStatus == "1,1" ? '' : 'notClick';//是否可以点击
              that.data.sexList[1].backColor = "#fff";
              that.data.sexList[1].color = styStatus == "1,1" || styStatus == "1,0" ? "#333" : "#cdcdcd";
              that.data.sexList[1].hasBanClass = styStatus == "1,1" || styStatus == "1,0" ? '' : 'notClick';//是否可以点击
              that.data.sexList[2].backColor = styStatus == "1,1" || styStatus == "0,1" ? "#001a88" : "#f6f8fe";
              that.data.sexList[2].color = styStatus == "1,1" || styStatus == "0,1" ? "#fff" : "#cdcdcd";
              that.data.sexList[2].hasBanClass = styStatus == "1,1" || styStatus == "0,1" ? '' : 'notClick';//是否可以点击
            }
            that.setData({
              styleList: styleList,
              womanHindSize: wslist,
              manHindSize: mslist,
              style: that.data.style,
              imgUrls: imgs,
              price: data.price,
              name: showName,
              styleId: styList[that.data.style].styleId,
              hasBanShop: hasBanShop,
              sexList: that.data.sexList
            });
          }
        }
      }
    });
  },
  /**
   * 戒托材质点击事件
   */
  styleClick:function(e){
    var that = this;
    var index = e.target.dataset.index;
    var backColor = that.data.styleList[index].backColor;
    //检查是否有下架状态则不可点击
    if (that.data.styleList[index].hasBanClass =="notClick"){
        return;
    }
    if (backColor == "#fff") {
      that.data.styleList[index].backColor = "#001a88";
      that.data.styleList[index].color = "#fff";
      that.data.styleList[that.data.style].backColor = "#fff";
      that.data.styleList[that.data.style].color = "#333";
      that.data.styleList[index]
      that.setData({
        styleList: that.data.styleList,
        style: index,
        styleId: that.data.styleList[index].styleId,
        styText: '"'+that.data.styleList[index].name + '"',
      });
      this.updateData();
    }
  },
  /**
   * 主钻选择点击事件
   */
  stoneClick:function(e){
    var that = this;
    var index = e.target.dataset.index;
    var backColor = that.data.stoneList[index].backColor;
    if (backColor == "#fff" && that.data.stone != index){
      that.data.stoneList[index].backColor = "#001a88";
      that.data.stoneList[index].color = "#fff";
      if (that.data.stone!="-1"){
        that.data.stoneList[that.data.stone].backColor = "#fff";
        that.data.stoneList[that.data.stone].color = "#333";
      }
      that.data.stoneList[index]
      that.setData({
        stoneList: that.data.stoneList,
        stone: index,
        stoneId: that.data.stoneList[index].stoneId,
        stoText: '"'+that.data.stoneList[index].name+'"'
      });
      this.updateData();
    }
  },
  /**
   * 男女对戒选择点击事件
   */
  sexClick: function (e) {
    var that = this;
    var index = e.target.dataset.index;
    var backColor = that.data.sexList[index].backColor;
    //检查是否有下架状态则不可点击
    if (that.data.sexList[index].hasBanClass=="notClick"){
      return;
    }
    if (backColor == "#fff" && that.data.sex != index) {
      that.data.sexList[index].backColor = "#001a88";
      that.data.sexList[index].color = "#fff";
      if (that.data.sex != "-1") {
        that.data.sexList[that.data.sex].backColor = "#fff";
        that.data.sexList[that.data.sex].color = "#333";
      }
      that.data.sexList[index];
      if (index == "0") {
        var styleId = that.data.styleId;
        var stoneId = that.data.stoneId;
        var womanSizeHas = false;
        var manSizeHas = false;
        var sizeText = '"男戒' + that.data.manHindSize[that.data.mSizeIndex] + '寸,女戒' + that.data.womanHindSize[that.data.wSizeIndex] + '寸"';
      } else {
        var styleId = index == "1" ? that.data.styleId.split(",")[0] : that.data.styleId.split(",")[1];
        var womanSizeHas = index=="1"?true:false;
        var manSizeHas = index == "1"?false:true;
        if (index == "1"){
          var sizeText = '"男戒' + that.data.manHindSize[that.data.mSizeIndex] + '寸"';
          var stoneId = that.data.stoneId.split(",")[0];
        } else if (index == "2"){
          var sizeText = '"女戒' + that.data.womanHindSize[that.data.wSizeIndex] + '寸"';
          var stoneId = that.data.stoneId.split(",")[1];
        }
      }
      that.setData({
        sexList: that.data.sexList,
        sex: index,
        doubleRingType:parseInt(index)+1,
        womanSizeHas:womanSizeHas,
        manSizeHas: manSizeHas
      });
      var json = {
        styleId: styleId,
        stoneId: stoneId,
        type: that.data.type,
        doubleRingType: that.data.doubleRingType,
        platform: 3
      }
      that.updateData();
      // app.ajax({
      //   url: '/goods/detail',
      //   data: json,
      //   success: function (res) {
      //     if (res.code) {
      //       var data = res.data;
      //       var imgList = that.data.doubleRingType == "2" ? data.manRingInfo.bannerImgs : data.femaleRingInfo.bannerImgs;
      //       var mslist = that.data.doubleRingType == "2" || that.data.doubleRingType == "1" ? data.manRingInfo.listHandSize:[];
      //       var wslist = that.data.doubleRingType == "3" || that.data.doubleRingType == "1" ? data.femaleRingInfo.listHandSize:[];
      //       that.setData({
      //         imgUrls: imgList,
      //         price: data.price,
      //         womanHindSize: wslist,
      //         manHindSize: mslist,
      //       });
      //       //刻字显示处理
      //       //对戒
      //       if(index == "0"){
      //         that.letteringShow(data.manRingInfo.lettering, data.femaleRingInfo.lettering);
      //       }
      //       //男戒
      //       else if(index == "1"){
      //         that.letteringShow(data.manRingInfo.lettering, 2);
      //       }
      //       //女戒
      //       else{
      //         that.letteringShow(2, data.femaleRingInfo.lettering);
      //       }
      //     }
      //   }
      // });
    }
  },
  /**
   * 加入购物车
   */
  addShopCar:function(){
    var that = this;
    if (that.data.hasBanShop =="banShopClass") {
      return;
    }
    var type = that.data.type;
    that.setData({hasGoShopCart: true});
    if(type == "1"){//求婚钻戒
      var param = that.ringGetparam();
      if (!param[0].size) {
        app.alert("请选择尺寸");
        this.setData({
          selectModal: false,
          isScroll: false,
          isShopSave: that.data.isShopSaveType == '2'?false:true,
          hasGoShopCart: that.data.isShopSaveType == '2' ? true : false,
        })
        return
      }
    }
    if (type == "2") {//结婚对戒
      var param = that.doubleRingGetparam();
      var dtype = that.data.doubleRingType;
      if (dtype == "1" && !param[0].size){
        app.alert("请选择男尺寸");
        this.setData({
          selectModal: false,
          isScroll: false,
          isShopSave: that.data.isShopSaveType == '2' ? false : true,
          hasGoShopCart: that.data.isShopSaveType == '2' ? true : false,
        })
        return
      }
      if (dtype == "1" && !param[1].size) {
        app.alert("请选择女尺寸");
        this.setData({
          selectModal: false,
          isScroll: false,
          isShopSave: that.data.isShopSaveType == '2' ? false : true,
          hasGoShopCart: that.data.isShopSaveType == '2' ? true : false,
        })
        return
      }
      if (dtype == "2" && !param[0].size) {
        app.alert("请选择男尺寸");
        this.setData({
          selectModal: false,
          isScroll: false,
          isShopSave: that.data.isShopSaveType == '2' ? false : true,
          hasGoShopCart: that.data.isShopSaveType == '2' ? true : false,
        })
        return
      }
      if (dtype == "3" && !param[0].size) {
        app.alert("请选择女尺寸");
        this.setData({
          selectModal: false,
          isScroll: false,
          isShopSave: that.data.isShopSaveType == '2' ? false : true,
          hasGoShopCart: that.data.isShopSaveType == '2' ? true : false,
        })
        return
      }
    }
    if (type == "3") {//饰品
      var param = that.ringGetparam();
      if (that.data.hindSize.length > 0 && !param[0].size) {
        app.alert("请选择尺寸");
        this.setData({
          selectModal: false,
          isScroll: false,
          isShopSave: that.data.isShopSaveType == '2' ? false : true,
          hasGoShopCart: that.data.isShopSaveType == '2' ? true : false,
        })
        return
      }
      // if (!/^[a-zA-Z\u4e00-\u9fa5\u&\u♡]+$/.test(param[0].lettering, 4) && param[0].lettering) {
      //   app.alert("刻字仅支持包含汉字、字母、&及♡的内容!");
      //   return
      // }
    }
    app.checkLoginAjax({
      url: '/shoppingCart/add',
      data: param,
      header: { "content-type": "application/json;charset=UTF-8" },
      success: function (res) {
        if(res.code == "000000"){
          wx.showToast({ title: "加入成功", icon: "none" });
          that.setData({
            selectModal: true,
            isScroll: true,
            hasGoShopCart:false,
            isShopSave: true,
            isShopSaveType: 2,
          })
        }
      }
    });
  },
  /**
   * 婚戒、饰品提交参数收集
   */
  ringGetparam: function () {
    var that = this;
    var dtype = that.data.type;
    var token = app.getUserInfo().token;
    var list = [];
    if (dtype == "1") {
      var json1 = {};
      json1.type = 1;
      json1.count = 1;
      json1.platform = 3;
      json1.token = token;
      json1.stoneId = that.data.stoneId;
      json1.styleId = that.data.styleId;
      json1.size = that.data.hindSize[that.data.sizeIndex];
      json1.lettering = that.data.letterHide ? "" : that.data.letter;
      list.push(json1);
    }
    if (dtype == "3") {
      var json2 = {};
      json2.type = 3;
      json2.count = 1;
      json2.platform = 3;
      json2.token = token;
      json2.stoneId = that.data.stoneId;
      json2.styleId = that.data.styleId;
      json2.size = that.data.hindSize.length==0?"":that.data.hindSize[that.data.sizeIndex];
      json2.lettering = that.data.letterHide ? "" : that.data.letter;
      list.push(json2);
    }
    return list;
  },
  /**
   * 对戒提交参数收集
   */
  doubleRingGetparam:function(){
    var that = this;
    var dtype = that.data.doubleRingType;
    var token = app.getUserInfo().token;
    var type = 2;
    var list = [];
    if(dtype == "1"){
      var json1 = {};
      var json2 = {};
      json1.type = 2;
      json1.count = 1;
      json1.platform = 3;
      json1.token = token;
      json1.stoneId = that.data.stoneId.split(",")[0];
      json1.styleId = that.data.styleId.split(",")[0];
      json1.size = that.data.manHindSize[that.data.mSizeIndex];
      json1.lettering = that.data.manLetter ? "" : that.data.manText;
      json2.type = 2;
      json2.count = 1;
      json2.platform = 3;
      json2.token = token;
      json2.stoneId = that.data.stoneId.split(",")[1];
      json2.styleId = that.data.styleId.split(",")[1];
      json2.size = that.data.womanHindSize[that.data.wSizeIndex];
      json2.lettering = that.data.womanLetter ? "" : that.data.womanText;
      list.push(json1);
      list.push(json2);
    }
    if (dtype == "2") {
      var json1 = {};
      json1.type = 2;
      json1.count = 1;
      json1.platform = 3;
      json1.token = token;
      json1.stoneId = that.data.stoneId.split(",")[0];
      json1.styleId = that.data.styleId.split(",")[0];
      json1.size = that.data.manHindSize[that.data.mSizeIndex];
      json1.lettering = that.data.manLetter ? "" : that.data.manText;
      list.push(json1);
    }
    if (dtype == "3") {
      var json2 = {};
      json2.type = 2;
      json2.count = 1;
      json2.platform =3;
      json2.token = token;
      json2.stoneId = that.data.stoneId.split(",")[1];
      json2.styleId = that.data.styleId.split(",")[1];
      json2.size = that.data.womanHindSize[that.data.wSizeIndex];
      json2.lettering = that.data.womanLetter ? "" : that.data.womanText;
      list.push(json2);
    }
    return list;
  },
  /**
   * 到购物车页面
   */
  goShopCar:function(){
    var url = "/pages/order/shopCar/shopCar";
    wx.redirectTo({
      url: url
    })
  },
  /**
   * 立即购买
   */
  nowShop:function(){
    var that = this;
    if (that.data.hasBanShop == "banShopClass") {
      return;
    }
    var type = that.data.type;
    that.setData({ hasGoShopNew: true });
    if (type == "1") {//求婚钻戒
      var param = that.ringGetparam();
      param[0].isNow = 1;
      if (!param[0].size) {
        app.alert("请选择尺寸");
        this.setData({
          selectModal: false,
          isScroll: false,
          isShopSave: that.data.isShopSaveType == '2' ? false : true,
          hasGoShopNew: that.data.isShopSaveType == '2' ? true : false,
        })
        return
      }
      // if (!/^[a-zA-Z\u4e00-\u9fa5\u&\u♡]+$/.test(param[0].lettering, 4) && param[0].lettering){
      //   app.alert("刻字仅支持包含汉字、字母、&及♡的内容!");
      //   this.setData({
      //     selectModal: false,
      //     isScroll: false
      //   })
      //   return
      // }
    }
    if (type == "2") {//结婚对戒
      var param = that.doubleRingGetparam();
      var dtype = that.data.doubleRingType;
      if(param.length ==2){
        param[0].isNow = 1;
        param[1].isNow = 1;
      }else{
        param[0].isNow = 1;
      }
      if (dtype == "1" && !param[0].size) {
        app.alert("请选择男尺寸");
        this.setData({
          selectModal: false,
          isScroll: false,
          isShopSave: that.data.isShopSaveType == '2' ? false : true,
          hasGoShopNew: that.data.isShopSaveType == '2' ? true : false,
        })
        return
      }
      if (dtype == "1" && !param[1].size) {
        app.alert("请选择女尺寸");
        this.setData({
          selectModal: false,
          isScroll: false,
          isShopSave: that.data.isShopSaveType == '2' ? false : true,
          hasGoShopNew: that.data.isShopSaveType == '2' ? true : false,
        })
        return
      }
      if (dtype == "2" && !param[0].size) {
        app.alert("请选择男尺寸");
        this.setData({
          selectModal: false,
          isScroll: false,
          isShopSave: that.data.isShopSaveType == '2' ? false : true,
          hasGoShopNew: that.data.isShopSaveType == '2' ? true : false,
        })
        return
      }
      if (dtype == "3" && !param[0].size) {
        app.alert("请选择女尺寸");
        this.setData({
          selectModal: false,
          isScroll: false,
          isShopSave: that.data.isShopSaveType == '2' ? false : true,
          hasGoShopNew: that.data.isShopSaveType == '2' ? true : false,
        })
        return
      }
      
    }
    if (type == "3") {//饰品
      var param = that.ringGetparam();
      param[0].isNow = 1;
      if (that.data.hindSize.length > 0 && !param[0].size) {
        app.alert("请选择尺寸");
        this.setData({
          selectModal: false,
          isScroll: false,
          isShopSave: that.data.isShopSaveType == '2' ? false : true,
          hasGoShopNew: that.data.isShopSaveType == '2' ? true : false,
        })
        return
      }
    }
    app.checkLoginAjax({
      url: '/shoppingCart/add',
      data: param,
      header: { "content-type": "application/json;charset=UTF-8" },
      success: function (res) {
        if (res.code == "000000") {
          wx.setStorageSync('orderParam', { cartId: res.data})
          // var url = "/pages/order/order/order?cartId="+res.data;
          // wx.redirectTo({
          //   url: url
          // })
          var token = app.getUserInfo().token;
          // start 【真爱宣言判断】 立即购买查询本次购买的商品是否需要真爱宣言（并判断是否存在有效的真爱宣言）
          app.ajax({
            url: "/shoppingCart/get?token=" + token + "&cartIds=" + res.data,
            success: function (res) {
              var data = res.data.isExistsPromise;
              if (data == "2") {
                  app.goto('/pages/loveOath/loveOath/loveOath');
              }else{
                that.isAddress(res.data);
              }
            }
          })
        }
      }
    });
  },
  /**
   * 验证联系人是否为空，为空则跳转到新增联系人页面
   */
  isAddress: function (val) {
    var token = app.getUserInfo().token;
    app.checkLoginAjax({
      url: '/address/list',
      data: { token: token },
      success: function (res) {
        if (res.code == "000000") {
          var param = wx.getStorageSync('orderParam');
          if (res.data.length > 0) {
            var url = "/pages/order/order/order?cartId=" + val;
            wx.redirectTo({
              url: url
            })
          } else {
            param.prevUrl = "/pages/order/order/order";
            wx.setStorageSync('orderParam', param)
            var url = "../../address/add/add?cartId=" + val;
            app.goto(url)
          }
        }
      }
    });
  },
  /**
   * 收藏商品或取消收藏
   */
  collectGoods:function(){
    var that = this;
    var type = that.data.type;
    var json = {};
    var userInfo = app.getUserInfo();
    if (!userInfo || userInfo==null) {
      app.alert("请先进行登录");
      return
    }
    if(type == "1"){
      json.stoneId = that.data.stoneId;
      json.styleId = that.data.styleId;
    }
    if (type == "2") {
      var dtype = that.data.doubleRingType;
      if (dtype == "1") {
        json.stoneId = that.data.stoneId;
        json.styleId = that.data.styleId;
      }
      if (dtype == "2") {
        json.stoneId = that.data.stoneId.split(",")[0];
        json.styleId = that.data.styleId.split(",")[0];
      }
      if (dtype == "3") {
        json.stoneId = that.data.stoneId.split(",")[1];
        json.styleId = that.data.styleId.split(",")[1];
      }
    }
    if (type == "3") {
      json.stoneId = that.data.stoneId;
      json.styleId = that.data.styleId;
    }
    json.type = type;
    json.token = userInfo.token;
    var isCollect = that.data.isCollect;
    if (isCollect!=1){
      app.checkLoginAjax({
        url: '/collect/save',
        data: json,
        success: function (res) {
          if (res.code == "000000") {
            var text = isCollect=="1"?"取消收藏成功":"收藏成功";
            var now = isCollect == "1" ?"0":"1";
            wx.showToast({ title: text, icon: "none" })
            that.setData({
              isCollect: now
            })
          }
        }
      });
    }else{
      app.checkLoginAjax({
        url: '/collect/cancel',
        data: json,
        success: function (res) {
          if (res.code == "000000") {
            var text = isCollect == "1" ? "取消收藏成功" : "收藏成功";
            var now = isCollect == "1" ? "0" : "1";
            wx.showToast({ title: text, icon: "none" })
            that.setData({
              isCollect: now
            })
          }
        }
      });
    }


  },
  /**
   * 详情图片点击跳转
   */
  detailImgClick:function(e){
    var that = this;
    var index = e.target.dataset.index;
    var url = that.data.imgDetails[index].link;
    app.goto(url)
  },
  /**点击规格显示弹出层**/
  showModal:function(){
    var that = this;
    this.setData({
      selectModal:false,
      isScroll:false,
      isShopSave: true,
      isShopSaveType: 1
    })
  },
  /**隐藏弹出层**/
  closeModal:function(){
    this.setData({
      selectModal: true,
      isScroll:true,
      isShopSave: true,
      isShopSaveType: 2
    })
  },
  /**弹出层确定按钮([入口注释])**/
  modalSaveOk:function(){
    var that = this;
    var type = that.data.type;
    if (type == "1") {//求婚钻戒
      var param = that.ringGetparam();
      if (!param[0].size) {
        app.alert("请选择尺寸");
        return
      }
    }
    if (type == "2") {//结婚对戒
      var param = that.doubleRingGetparam();
      var dtype = that.data.doubleRingType;
      if (dtype == "1" && !param[0].size) {
        app.alert("请选择男尺寸");
        return
      }
      if (dtype == "1" && !param[1].size) {
        app.alert("请选择女尺寸");
        return
      }
      if (dtype == "2" && !param[0].size) {
        app.alert("请选择男尺寸");
        return
      }
      if (dtype == "3" && !param[0].size) {
        app.alert("请选择女尺寸");
        return
      }
    }
    if (type == "3") {//饰品
      var param = that.ringGetparam();
      if (that.data.hindSize.length > 0 && !param[0].size) {
        app.alert("请选择尺寸");
        return
      }
    }
    that.setData({ isShopSaveType:2})
    if (that.data.hasGoShopCart) {
      that.addShopCar();
    }
    if (that.data.hasGoShopNew) {
      that.nowShop();
    }
    that.setData({
      selectModal: true,
      isScroll:true
    })
  },
  //对戒-刻字显示处理
  letteringShow(manLettering,femaleLettering){
    var doubleLetter = true;
    var manLetter = true;
    var famaleLetter = true;
    //男女戒都不支持刻字
    if (manLettering != '1' && femaleLettering != '1') {
      doubleLetter = true;
      manLetter = true;
      famaleLetter = true;
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