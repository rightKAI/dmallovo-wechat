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
    //性别
    SixName: [
      { sort: "男", show: false }, 
      { sort: "女", show: false }
    ],
    sexArrayNum:[],
    // 
    stoneWeightType: "",
    //--价格
    priceName: [
      { price: "0-4999", show: false },
      { price: "5000-7999", show: false },
      { price: "8000-9999", show: false },
      { price: "10000-19999", show: false },
      { price: "20000以上", show: false }
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
    //钻石重量文本框
    largeWeight: "",
    smallWeight: "",
    //性别
    sexData:{},
    modalSerice:"结婚对戒",
    adImg: "",//广告位图片
    zjName: '',
    djName: '',
    spName: '',
    xpName:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //获取广告位信息接口
    that.getAdventInfo();
    //初始化加载商品数据类别
    var json = {
      page: 1,
      limit: 20,
      sort: 1,
      order: 2
    }
    app.ajax({
      url: '/goods/list/8/2',
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
      data: { type: 2 },
      success: function (res) {
        if (res.code == "000000") {
          that.data.seriesName = JSON.parse(res.data);
          that.setData({
            seriesName: JSON.parse(res.data)
          })
        }
      }
    })
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
            xpName: res.data[3].name,
            modalSerice: res.data[1].name
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

    //


    /*
    app.ajax({
      url: '/advert/placeContentList',
      data: {placeCode:'applet_clasify_goods_list',offset:0,limit:20},
      success: function (res) {
        if (res.code == "000000") {
          var list = res.data.list;
          that.setData({
            gdata:list,
            offset:res.data.offset
          })
        }
      }
    });
   */


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
          if (data[i].placeCode == "applet_clasify_goods_marriang") {
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

    var xingbieText = [];
    for (var key in that.data.sexData) {
      xingbieText.push(parseInt(key) + 1);
    }
    xingbieText = xingbieText.join();

    if (num == 1) {
      var json = {
        page: 1,
        limit: 20,
        sort: 1,
        order: 1,
        doubleRingType: xingbieText,
        priceStart: that.data.largePrice,
        priceEnd: that.data.smallPrice,
        series: seriesText
      }
      app.ajax({
        url: '/goods/list/8/2',
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
        doubleRingType: xingbieText,
        priceStart: that.data.largePrice,
        priceEnd: that.data.smallPrice,
        series: seriesText
      }
      app.ajax({
        url: '/goods/list/8/2',
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

    var xingbieText = [];
    for (var key in that.data.sexData) {
      xingbieText.push(parseInt(key) + 1);
    }
    xingbieText = xingbieText.join();


    if (num == 1) {
      var json = {
        page: 1,
        limit: 20,
        sort: 2,
        order: 1,
        doubleRingType: xingbieText,
        priceStart: that.data.largePrice,
        priceEnd: that.data.smallPrice,
        series: seriesText
      }
      app.ajax({
        url: '/goods/list/8/2',
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
        doubleRingType: xingbieText,
        priceStart: that.data.largePrice,
        priceEnd: that.data.smallPrice,
        series: seriesText
      }
      app.ajax({
        url: '/goods/list/8/2',
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

    var xingbieText = [];
    for (var key in that.data.sexData) {
      xingbieText.push(parseInt(key) + 1);
    }
    xingbieText = xingbieText.join();

    if (num == 1) {
      var json = {
        page: 1,
        limit: 20,
        sort: 4,
        order: 1,
        doubleRingType: xingbieText,
        priceStart: that.data.largePrice,
        priceEnd: that.data.smallPrice,
        series: seriesText
      }
      app.ajax({
        url: '/goods/list/8/2',
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
        doubleRingType: xingbieText,
        priceStart: that.data.largePrice,
        priceEnd: that.data.smallPrice,
        series: seriesText
      }
      app.ajax({
        url: '/goods/list/8/2',
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
    } else {
      delete that.data.xilieList[id];
    }
    this.setData({
      seriesName: seriesName,
      xilieList: that.data.xilieList
    })
  },
  /*性别*/
  subXingbie:function(e){
    var that=this;
    var id = e.target.dataset.xid;
    var sex = e.target.dataset.sex;
    var SixName = this.data.SixName;
    SixName[id].checked = !SixName[id].checked;
    if (SixName[id].checked) {
      that.data.sexData[id] = SixName[id].sort;
    } else {
      delete that.data.sexData[id];
    }
    this.setData({
      SixName: SixName,
      sexData: that.data.sexData
    });
  },

  //最小价格输入事件
  largeForm:function(e){ 
    this.setData({
      largePrice: e.detail.value,
      id:"-1"
    });
  },
  //最大价格输入事件
  smalForm: function (e) {
    this.setData({
      smallPrice:e.detail.value,
      id:"-1"
    })
  },

  /*筛选数据-->提交--*/
  subit: function (e) {
    var that = this;
    var seriesText = [];
    for (var key in that.data.xilieList) {
      seriesText.push("'" + that.data.xilieList[key] + "'");
    }
    seriesText = seriesText.join();

    //性别
    var xingbieText = [];
    for (var key in that.data.sexData) {
      xingbieText.push(parseInt(key) + 1);
    }
   xingbieText = xingbieText.join();
    var json = {
      page: 1,
      limit: 20,
      sort: 1,
      order: 2,
      doubleRingType: xingbieText,
      priceStart: that.data.largePrice,
      priceEnd: that.data.smallPrice,
      series: seriesText
    }
    app.ajax({
      url: '/goods/list/8/2',
      method: "GET",
      data: json,
      success: function (res) {
        if (res.code == "000000") {
          var list = res.data.rows;
          that.setData({
            jiehuiList: list,
            modaHide: false,
            xilieHide: false,
            sexArrayNum : xingbieText,
            isScroll:true
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
    var that = this;
    var seriesText = [];
    for (var key in that.data.xilieList) {
      seriesText.push("'" + that.data.xilieList[key] + "'");
    }
    seriesText = seriesText.join();

    //性别
    var xingbieText = [];
    for (var key in that.data.sexData) {
      xingbieText.push(parseInt(key) + 1);
    }
    xingbieText = xingbieText.join();
    var json = {
      page: parseInt(that.data.page) + 1,
      limit: 20,
      sort: 1,
      order: 2,
      doubleRingType: xingbieText,
      priceStart: that.data.largePrice,
      priceEnd: that.data.smallPrice,
      series: seriesText
    }
    app.ajax({
      url: '/goods/list/8/2',
      method: "GET",
      data: json,
      success: function (res) {
        if (res.code == "000000") {
          var listArray = res.data.rows;
          if (listArray.length > 0) {
            that.setData({
              jiehuiList: that.data.jiehuiList.concat(listArray),
              page: res.data.page,
            })
          } else {
            that.setData({
              hasFooter: true
            })
          }
        }
      }

    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //商品跳转 styleId=2380,2381&stoneId=0,0&type=2
  goodsClick: function (e) {
    var that=this
    var styleId = e.currentTarget.dataset.styleid;
    var stoneId = e.currentTarget.dataset.stoneid;
    var typeId = e.currentTarget.dataset.type;
    app.goto('/pages/goods/detail/detail?styleId=' + styleId + '&stoneId=' + stoneId + '&type=' + typeId );
  },
  //右侧定位的导航预约门店
  mekeIndex: function () {
    app.goto('/pages/me/myBaguette/myBaguette')
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