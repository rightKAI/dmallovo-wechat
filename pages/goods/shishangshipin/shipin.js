// pages/goods/list/list.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isScroll: true,
    //上啦
    gdata: [],
    offset: 1,
    page: 1,
    loading: false,
    Mseriess: true,
    hasFooter: false,
    /////点击事件颜色选中
    eventColor1: true,
    eventColor2: false,
    eventColor3: false,
    eventColor4: false,
    //人气箭头数据切换
    renqiBox: true,
    renqiImg: true,
    //新品箭头数据切换
    xinbox: true,
    xinImg: false,
    //价格箭头数据切换
    jiagebox: true,
    jiageImg: false,
    //初始化加载商品
    jiehuiList: [],
    //存储升降序
    asc: "",
    /*********帅选弹出列表**********/
    //材质
    materialName: [
      { sort: "白18K金", show: false },
      // { sort: "PT950", show: false },
      // { sort: "18K玫瑰金", show: false }
      { sort: "红18K金", show: false },
      { sort: "黄18K金", show: false }
    ],
    stoneWeightType: "",
    //--价格
    priceName: [
      { price: "0-4999", show: false },
      { price: "5000-7999", show: false },
      { price: "8000-9999", show: false },
      { price: "10000-19999", show: false },
      { price: "20000以上", show: false }
    ],
    //品类
    PLName: [
      { id: 1, sort: "手链/手镯", param: "'手链'",  isShow: true },
      { id: 2, sort: "项链", param: "'项链'",  isShow: false },
      { id: 3, sort: "耳钉/耳环", param: "'耳饰'",  isShow: true },
      { id: 4, sort: "套链", param: "'挂坠'",  isShow: true },
      { id: 5, sort: "吊坠", param: "'项链坠'",  isShow: true },
      { id: 6, sort: "男戒", param: "'男戒'",  isShow: true }
    ],
    //系列
    seriesName: [],
    //弹出层行号
    modalHeight: 0,
    modaHide: false, //筛选
    xilieHide: false, //系列
    //价格文本框
    largePrice: "", //最高值
    smallPrice: "", //最低值
    //系列存储
    xilieList: {},
    //品类存储
    pinleiList: {},
    //钻石重量文本框
    largeWeight: "",
    smallWeight: "",
    modalSerice:"浪漫钻饰",
    adImg: "",//广告位图片
    zjName: '',
    djName: '',
    spName: '',
    xpName:'',
    classification:''//品类
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      classification: options.classification
    });
    var pl = '';
    //获取品类请求名
    for(var i=0;i<that.data.PLName.length;i++){
      if (that.data.PLName[i].id == that.data.classification){
        pl = that.data.PLName[i].param;
        var PLName = that.data.PLName;
        PLName[i].checked = !PLName[i].checked;
        that.data.pinleiList[i] = PLName[i].param;
      }
    }
    //获取广告位信息接口
    that.getAdventInfo();
    //初始化加载商品数据类别
    var json = {
      page: 1,
      limit: 20,
      sort: 1,
      order: 2,
    }
    json.classify = pl? pl:'';
    app.ajax({
      url: '/goods/list/11/3',
      method: 'GET',
      data: json,
      success: function (res) {
        if (res.code == "000000") {
          var list = res.data.rows;
          that.setData({
            jiehuiList: list
          })
        }
      }
    });
    //初始化筛选系列数据列表
    app.ajax({
      url: '/goods/listSeriesParam',
      method: "POST",
      data: { type: 3 },
      success: function (res) {
        if (res.code == "000000") {
          that.data.seriesName = JSON.parse(res.data);
          that.setData({
            seriesName: JSON.parse(res.data)
          })
        }
      }
    });
    var menuParam = {};
    menuParam.platform = '2';
    app.ajax({
      url: '/index/menu',
      method: 'GET',
      data: menuParam,
      success: function (res) {
        if (res.code == "000000") {
          that.setData({
            zjName: res.data[0].name,
            djName: res.data[1].name,
            spName: res.data[2].name,
            xpName:res.data[3].name,
            modalSerice: res.data[2].name
          })
        }
      }
    });
    //弹出层--height-->高度
    wx.getSystemInfo({
      success: function (res) {
        var _h = res.windowHeight;
        that.setData({ wheight: _h + 'px', modalHeight: (res.windowHeight - 140) + 'px', heightXilie: (_h - 300) + 'px' })
      }
    })
  },
  //获取广告位信息
  getAdventInfo: function () {
    var that = this;
    app.ajax({
      url: '/advert/list',
      data: {
        pageCode: 'applet_classify'
      },
      success: function (res) {
        var data = res.data;
        for (var i = 0; i < data.length; i++) {
          if (data[i].placeCode == "applet_clasify_goods_gift") {
            that.setData({
              adImg: data[i].contentList[0].imgurl
            })
          }
        }
      }
    });
  },
  //商品分类头部url链接跳转-->求婚钻戒
  qiuhun: function (e) {
    app.goto('/pages/goods/list/list');
  },
  //商品分类头部url链接跳转-->结婚戒指
  jiehun: function (e) {
    app.goto('/pages/goods/jiehunjiezhi/jiehun');
  },
  //商品分类头部url链接跳转-->时尚饰品
  shishang: function (e) {
    app.goto('/pages/goods/shishangshipin/shipin');
  },
  //商品分类头部url链接跳转-->新品
  xinpin: function (e) {
    app.goto('/pages/goods/xinpin/xinpin');
  },

  /**点击筛选事件**/
  /*人气*/
  renqiBnt: function (e) {
    var that = this;
    var value = !this.data.renqiBox; //获取data-num属性
    that.setData({
      eventColor1: true,
      eventColor2: false,
      eventColor3: false,
      eventColor4: false,
      renqiImg: true,//人气箭头图片显示
      xinImg: false, //新品箭头图片隐藏
      jiageImg: false, //新品箭头图片隐藏
      renqiBox: value  //人气数据排序 
    });

    const num = e.currentTarget.dataset.num;
    that.data.asc = "";//点击清空排序
    that.data.page = 1; //点击清空下拉列表  默认第一页

    //排序筛选 （保存提交筛选条件）
    var seriesText = [];
    for (var key in that.data.xilieList) {
      seriesText.push("'" + that.data.xilieList[key] + "'");
    }
    seriesText = seriesText.join();
    var xilieText = [];
    for (var key in that.data.pinleiList) {
      xilieText.push(that.data.pinleiList[key]);
    }
    xilieText = xilieText.join();

    if (num == 1) {
      var json = {
        page: 1,
        limit: 20,
        sort: 1,
        order: 1,
        classify: xilieText,
        priceStart: that.data.largePrice,
        priceEnd: that.data.smallPrice,
        series: seriesText
      }
      app.ajax({
        url: '/goods/list/11/3',
        method: 'GET',
        data: json,
        success: function (res) {
          if (res.code == "000000") {
            var list = res.data.rows;
            that.setData({
              jiehuiList: list,
              asc: "ASC"
            })
          }
        }
      });
    } else {
      var json = {
        page: 1,
        limit: 20,
        sort: 1,
        order: 2,
        classify: xilieText,
        priceStart: that.data.largePrice,
        priceEnd: that.data.smallPrice,
        series: seriesText
      }
      app.ajax({
        url: '/goods/list/11/3',
        method: 'GET',
        data: json,
        success: function (res) {
          if (res.code == "000000") {
            var list = res.data.rows;
            // that.data.asc; 取值
            that.setData({
              jiehuiList: list,
              asc: "DESC"
            })
          }
        }
      });
    }

  },

  /*系列弹出层*/
  xilieBtn: function (e) {
    this.setData({
      xilieHide: true,
      isScroll:false
    })
  },
  xilieClose: function (e) {
    this.setData({
      xilieHide: false,
      isScroll:true
    })
  },

  /*新品*/
  xinpinBtn: function (e) {
    var that = this;
    var value = !this.data.xinbox; //获取data-num属性
    that.setData({
      eventColor1: false,
      eventColor2: false,
      eventColor3: true,
      eventColor4: false,
      renqiImg: false, //人气箭头图片隐藏
      xinImg: true, //新品箭头图片显示
      jiageImg: false, //新品箭头图片隐藏
      xinbox: value
    })

    const num = e.currentTarget.dataset.num;
    that.data.asc = ""; //点击清空排序
    that.data.page = 1; //点击清空下拉列表  默认第一页

    //排序筛选 （保存提交筛选条件）
    var seriesText = [];
    for (var key in that.data.xilieList) {
      seriesText.push("'" + that.data.xilieList[key] + "'");
    }
    seriesText = seriesText.join();
    var xilieText = [];
    for (var key in that.data.pinleiList) {
      xilieText.push(that.data.pinleiList[key]);
    }
    xilieText = xilieText.join();


    if (num == 1) {
      var json = {
        page: 1,
        limit: 20,
        sort: 2,
        order: 1,
        classify: xilieText,
        priceStart: that.data.largePrice,
        priceEnd: that.data.smallPrice,
        series: seriesText
      }
      app.ajax({
        url: '/goods/list/11/3',
        method: 'GET',
        data: json,
        success: function (res) {
          if (res.code == "000000") {
            var list = res.data.rows;
            that.setData({
              jiehuiList: list,
              asc: "ASC"
            })
          }
        }
      });
    } else {
      var json = {
        page: 1,
        limit: 20,
        sort: 2,
        order: 2,
        classify: xilieText,
        priceStart: that.data.largePrice,
        priceEnd: that.data.smallPrice,
        series: seriesText
      }
      app.ajax({
        url: '/goods/list/11/3',
        method: 'GET',
        data: json,
        success: function (res) {
          if (res.code == "000000") {
            var list = res.data.rows;
            that.setData({
              jiehuiList: list,
              asc: "DESC"
            })
          }
        }
      });
    }


  },

  /*价格*/
  jiageBtn: function (e) {
    var that = this;
    var value = !this.data.jiagebox; //获取data-num属性
    this.setData({
      eventColor1: false,
      eventColor2: false,
      eventColor3: false,
      eventColor4: true,
      renqiImg: false, //人气箭头图片隐藏
      xinImg: false, //新品箭头图片隐藏
      jiageImg: true,//新品箭头图片显示
      jiagebox: value
    })

    const num = e.currentTarget.dataset.num;
    that.data.asc = ""; //点击清空排序
    that.data.page = 1; //点击清空下拉列表  默认第一页

   //排序筛选 （保存提交筛选条件）
    var seriesText = [];
    for (var key in that.data.xilieList) {
      seriesText.push("'" + that.data.xilieList[key] + "'");
    }
    seriesText = seriesText.join();
    var xilieText = [];
    for (var key in that.data.pinleiList) {
      xilieText.push(that.data.pinleiList[key]);
    }
    xilieText = xilieText.join();

    if (num == 1) {
      var json = {
        page: 1,
        limit: 20,
        sort: 4,
        order: 1,
        classify: xilieText,
        priceStart: that.data.largePrice,
        priceEnd: that.data.smallPrice,
        series: seriesText
      }
      app.ajax({
        url: '/goods/list/11/3',
        method: 'GET',
        data: json,
        success: function (res) {
          if (res.code == "000000") {
            var list = res.data.rows;
            that.setData({
              jiehuiList: list,
              asc: "ASC"
            })
          }
        }
      });
    } else {
      var json = {
        page: 1,
        limit: 20,
        sort: 4,
        order: 2,
        classify: xilieText,
        priceStart: that.data.largePrice,
        priceEnd: that.data.smallPrice,
        series: seriesText
      }
      app.ajax({
        url: '/goods/list/11/3',
        method: 'GET',
        data: json,
        success: function (res) {
          if (res.code == "000000") {
            var list = res.data.rows;
            that.setData({
              jiehuiList: list,
              asc: "DESC"
            })
          }
        }
      });
    }



  },

  /*筛选打开弹出层*/
  shaixianBtn: function (e) {
    this.setData({
      modaHide: true,
      isScroll:false
    })
  },
  /*关闭筛选弹出层*/
  closeShaixian: function (e) {
    this.setData({
      modaHide: false,
      isScroll:true
    })
  },

  /*筛选数据点击事件 priceName--*/
  /*价格*/
  subitJiage: function (e) {
    var that = this;
    var id = e.target.dataset.id;  //获取自定义值
    var price = e.target.dataset.price;
    price = price.split("-");
    if (price[0] == "20000以上") {
      price[0] = "20000";
      price[1] = "";
      this.setData({
        id: id,
        largePrice: 20000,
        smallPrice: ""
      })
    } else {
      this.setData({
        id: id,
        largePrice: price[0],
        smallPrice: price[1]
      })
    }
  },
  /*系列*/
  subxilie: function (e) {
    var that = this;
    var id = e.target.dataset.xid;
    var seriesName = this.data.seriesName;
    seriesName[id].checked = !seriesName[id].checked;
    if (seriesName[id].checked) {
      that.data.xilieList[id] = seriesName[id].sort;
      console.log(that.data.xilieList[id])
    } else {
      delete that.data.xilieList[id];
    }
    this.setData({
      seriesName: seriesName,
      xilieList: that.data.xilieList
    })
  },
  /*品类*/
  subpinglei: function (e) {
     var that = this;
    var id = e.target.dataset.xid;
    var PLName = this.data.PLName;
    PLName[id].checked = !PLName[id].checked;
    if (PLName[id].checked) {
      that.data.pinleiList[id] = PLName[id].param;
    } else {
      delete that.data.pinleiList[id];
    }
    console.log(that.data.pinleiList)
    this.setData({
      PLName: PLName,
      pinleiList: that.data.pinleiList
    })
  },

  //最小价格输入事件
  largeForm: function (e) {
    this.setData({
      largePrice: e.detail.value,
      id:"-1"
    });
  },
  //最大价格输入事件
  smalForm: function (e) {
    this.setData({
      smallPrice: e.detail.value,
      id:"-1"
    })
  },
  
  /*筛选数据-->提交--*/
  subit: function (e) {
    var that = this;
    //系列
    var seriesText = [];
    for (var key in that.data.xilieList) {
      seriesText.push("'" + that.data.xilieList[key] + "'");
    }
    seriesText = seriesText.join();
    //品类
    var xilieText = [];
    for (var key in that.data.pinleiList) {
      xilieText.push(that.data.pinleiList[key]);
    }
    xilieText = xilieText.join();
    
    var json = {
      page: 1,
      limit: 20,
      sort: 1,
      order: 2,
      classify: xilieText,
      priceStart: that.data.largePrice,
      priceEnd: that.data.smallPrice,
      series: seriesText
    }
    app.ajax({
      url: '/goods/list/11/3',
      method: "GET",
      data: json,
      success: function (res) {
        if (res.code == "000000") {
          var list = res.data.rows;
          that.setData({
            jiehuiList: list,
            modaHide: false,
            xilieHide: false,
            isScroll:true
          })
        }
      },
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
    var that = this;
    //系列
    var seriesText = [];
    for (var key in that.data.xilieList) {
      seriesText.push("'" + that.data.xilieList[key] + "'");
    }
    seriesText = seriesText.join();
    //品类
    var xilieText = [];
    for (var key in that.data.pinleiList) {
      xilieText.push(that.data.pinleiList[key]);
    }
    xilieText = xilieText.join();

    var json = {
      page: parseInt(that.data.page) + 1,
      limit: 20,
      sort: 1,
      order: 2,
      classify: xilieText,
      priceStart: that.data.largePrice,
      priceEnd: that.data.smallPrice,
      series: seriesText
    }
    app.ajax({
      url: '/goods/list/11/3',
      method: "GET",
      data: json,
      success: function (res) {
        if (res.code == "000000") {
          var listArray = res.data.rows;
          if (listArray.length > 0) {
            that.setData({
              jiehuiList: that.data.jiehuiList.concat(listArray),
              page: res.data.page
            })
          } else {
            that.setData({
              hasFooter: true
            })
          }
        }
      },
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //右侧定位的导航预约门店
  mekeIndex: function () {
    app.goto('/pages/me/myBaguette/myBaguette')
  },

  //商品跳转
  goodsClick: function (e) {
    var styleId = e.currentTarget.dataset.styleid;
    var stoneId = e.currentTarget.dataset.stoneid;
    var typeId = e.currentTarget.dataset.type;
    app.goto('/pages/goods/detail/detail?styleId=' + styleId + '&stoneId=' + stoneId + '&type=' + typeId);
  },

  //底部菜单事件处理函数
  bottomMenuTap: function (e) {
    var url = e.currentTarget.dataset.url;
    if (url == "/pages/order/shopCar/shopCar") {
      app.goto(url);
    } else {
      wx.reLaunch({
        url: url
      })
    }
  }
})