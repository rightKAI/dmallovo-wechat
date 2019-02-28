//index.js 获取应用实例
const app = getApp()
Page({
    data: {
        //品牌广告图片
        pingpai:"",
        //热门商品广告
        hotShop:[],
        footerList:[],
        //
        Mindexs:true,
        imgUrls: [],
        /*
        shopIcon: [
            {
                img: 'http://img-dmallovo.oss-cn-shenzhen.aliyuncs.com/icon/ICON-WebChar/1qiuhun.png',
                oneName: 'Engage Ring',
                twoName: '求婚钻戒',
                shopListId: 1
            }, {
                img: 'http://img-dmallovo.oss-cn-shenzhen.aliyuncs.com/icon/ICON-WebChar/2dingzhi.png',
                oneName: 'Diamond',
                twoName: '定制钻戒',
                shopListId: 2
            }, {
                img: 'http://img-dmallovo.oss-cn-shenzhen.aliyuncs.com/icon/ICON-WebChar/3tianmi.png',
                oneName: 'Love Gift',
                twoName: '甜蜜礼物',
                shopListId: 3
            }
        ],
        */
        indicatorDots: true,
        autoplay: true,
        interval: 3000,
        duration: 500,
        circular: true,
        // 最近的实体店
        shopStoreName: '',
        storeId: 0,
        //底部广告
        bottomAD: [],
        phonePho:"", //手机号码
        focus: false, //获取焦点
        storeId:"", //门店ID
        dataTime:"",
        dialog: false,
        twoDialog:false,
        exitClose:false
    },
    //生命周期，初始化
    onLoad: function (options) {
        var that = this;
        //弹出层
        var m = Date.parse(new Date()); //获取当前时间戳
        var value = wx.getStorageSync('key') 
        if (!value){
          //存储当前时间戳
          wx.setStorageSync('key', m); 
          that.setData({
            dialog:true
          })
          } else {
          wx.getStorage({
            key: 'key',
            success: function (res) {
              var test = 
              new Date(res.data).getFullYear() + "-" + (new Date(res.data).getMonth() + 1) + "-" + new Date(res.data).getDate()+ ' 23:59:59';
              //判断当前时间戳大于存储时间就弹出
              if (m > Date.parse(test)){
                 that.setData({
                   dialog: true
                 })
                 wx.setStorageSync('key', m); 
               }else{
                 that.setData({
                   dialog: false
                 })
               }
            }
          })
        }

        //获取经纬度和定位门店
        wx.getLocation({
            type: 'wgs84',
            success: function (res) {
                var latitude = res.latitude
                var longitude = res.longitude
                var locaCache = {};
                locaCache.lat = res.latitude;
                locaCache.lot = res.longitude;
                wx.setStorageSync("locaCache", locaCache);
                var speed = res.speed
                var accuracy = res.accuracy
                //请求列表接口
                app.ajax({
                    url: '/store/getRecentlyStore',
                    data: {
                        lat: latitude,
                        lng: longitude
                    },
                    success: function (res) {
                        // 最近的门店名字
                        that.setData({shopStoreName: res.data.name})
                        // 最近的门店ID
                        that.setData({
                          storeId: res.data.id,
                          key: res.data.urlKey,
                        });
                        that.storeId = res.data.id;
                    }
                });
            }
        })
        //获取广告位信息，包含轮播图
        app.ajax({
            url: '/advert/list',
            data: {
                pageCode: 'applet_index'
            },
            success: function (res) {
                var infoThePage = res.data;
                infoThePage.forEach(item => {
                    //banner
                    if (item.placeCode == 'applet_index_banner') {
                        var newInfo = item.contentList
                      newInfo.map((p) => p.id === 361 ? p.link = "/pages/BrandCustom/BrandCustom" : void(0))
                        that.setData({ imgUrls: newInfo})
                    }
                    //推荐系列
                    if (item.placeCode == 'applet_index_detail') {
                        var newInfo = item.contentList
                        that.setData({bottomAD: item.contentList})
                    }
                    //热卖商品
                    if (item.placeCode == 'applet_index_hot') {
                      var newInfo = item.contentList
                      that.setData({ footerList: item.contentList })
                    }
                    //分类
                    if (item.placeCode == 'applet_index_list') {
                      var newInfo = item.contentList
                      that.setData({ hotShop: item.contentList })
                      console.log(item.contentList)
                    }
                    //品牌广告 
                    if (item.placeCode == 'applet_index_brand') {
                      var newInfo = item.contentList
                      that.setData({ pingpai: item.contentList })
                    }
                });
            }
        });

    },
    //点击轮播触发的效果
    goSwpie: function (e) {
        app.goto('/'+e.currentTarget.dataset.link)
    },
    //弹窗yes事件
    yesBtn:function(){
      var that=this;
      app.ajax({
        url: '/report/reportIndexDiaLog',
        data: {
          platform: 3,
          operation: "yes"
        },
        success: function (res) {
          that.closeBtn();
        }
      });  
    },
    //弹窗NO事件
    noBtn:function(){
      var that = this;
      app.ajax({
        url: '/report/reportIndexDiaLog',
        data: {
          platform: 3,
          operation: "no"
        },
        success: function (res) {
          that.setData({
            twoDialog: true
          })
        }
      })
    },
    //点错返回事件
    backBtn:function(){
      var that = this;
      app.ajax({
        url: '/report/reportIndexDiaLog',
        data: {
          platform: 3,
          operation: "return"
        },
        success: function (res) {
          that.setData({
            twoDialog: false
          })
        }
      })
    },
    //放弃退出事件
    closeBackBtn:function(){
      var that=this;
      app.ajax({
        url: '/report/reportIndexDiaLog',
        data:{
          platform: 3,
          operation: "quit"
        },
        success:function(res){
          that.closeBtn();
        }
      })
    },

    //关闭弹窗
    closeBtn:function(){
       this.setData({
          dialog:false
       })
    },

    //点击预约
    // goYyueShop: function (e) {
    //     var that = this;
    //     //   店铺名字
    //     var storeName = that.data.shopStoreName
    //     // 店铺ID
    //     var storeId = that.data.storeId
    //     app.goto('../store/baguette/baguette?name=' + storeName + '&id=' + storeId+"&key="+that.data.key);
    // },

    //预约进店获取手机号码
    bindPho: function (e) {
      //console.log(e.detail.value);
      this.setData({
        phonePho: e.detail.value
      });
    },
    //预约进店
    makeShop:function(e){
      var that = this;
      var pho = this.data.phonePho;
      var token = app.getUserInfo().token;
      if (pho==""){
        this.setData({
          focus: true
        });
        wx.showToast({ title: "请填写手机号码", icon: "none" });
        return;
      } else if (!/^1[3|4|5|8|7][0-9]\d{4,8}$/.test(pho) || pho.length < 11){
        this.setData({
          focus: true
        });
        wx.showToast({ title: "请输入正确的手机号码", icon: "none" });
        return;
      }
      app.ajax({
        url: '/store/saveAppointment',
        data: {
          phone: pho,
          storeId:that.storeId,
          token: token,
          platform: 3,
          channel: wx.getStorageSync('channel')
        },
        success: function (res) {
          wx.showToast({ title: "预约成功", icon: "none" })
          that.setData({
            phonePho: ""
          })
        }
      });      
    },

    //底部认证七句话链接跳转
    approveUrl:function(e){
      var id = e.currentTarget.dataset.id
      app.goto('/pages/me/myhelp/helpinfo/helpinfo?helpid=' + id);
    },
   
    // 底部广告跳转
    goInfoList:function(e){
        var that = this;
        app.goto(e.currentTarget.dataset.link);
    },
    //轮播图跳转
    banImgClick:function(e){
      var url = e.target.dataset.link;
      app.goto(url)
    },
    //热门商品
    footerClick:function(e){
      var url = e.currentTarget.dataset.link;
      app.goto(url)
    },
    //分类系列
    xileiClick:function(e){
      var url = e.currentTarget.dataset.link;
      app.goto(url)
    },
    //品牌广告
    pingpaiClick:function(e){
      var url = e.currentTarget.dataset.url;
      app.goto(url)
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
    },
    //推荐系列
    recommendShop:function(e){
      var url = e.currentTarget.dataset.url;
      app.goto(url)
    },
    //右侧定位的导航预约门店
    mekeIndex: function () {
      app.goto('/pages/me/myBaguette/myBaguette')
    },
    //点击首页店名跳转到对应门店详情
    goStoreDetail:function(){
      var that = this;
      var key = that.data.key;
      var id = that.data.storeId;
      var name = that.data.shopStoreName;
      var url = '/pages/store/baguette/baguette?name='+name+'&id='+id+'&key='+key;
      app.goto(url);
    }
})
