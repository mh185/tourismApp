import Toast from '../../vant/toast/toast';
import {getTel} from '../../utils/api/user'
import {getRouteList} from '../../utils/api/boutiqueRoute'
import { homeBanner} from '../../utils/more/homeSearch.js'
import {getTravelsList, travelsShare} from '../../utils/api/travels'
import {getHot} from '../../utils/api/attraction'
import { getRealAuth } from '../../utils/more/healthCode.js'

var app = getApp();
const iconUrl = app.globalData.iconUrl;
const host = app.globalData.host;
Page({
  data: {
    top:'',
    host:host,
    iconUrl: iconUrl,
    // imgUrls: [
    //   'http://47.108.86.202:8081/icon/banner1.png',
    //   'http://47.108.86.202:8081/icon/banner2.png',
    //   'http://47.108.86.202:8081/icon/banner1.png',
    //   'http://47.108.86.202:8081/icon/banner2.png',
    // ],
    bannerList: [],
    indicatorDots: false, //是否显示面板指示点
    autoplay: true, //是否自动播放
    interval: 3000, //停留时间间隔
    duration: 1000, //播放时长
    previousMargin: '30rpx', //前边距，可用于露出前一项的一小部分，接受 px 和 rpx 值
    nextMargin: '110px', //后边距，可用于露出后一项的一小部分，接受 px 和 rpx 值
    // snaptoedge: true,
    circular: true, //是否采用衔接滑动
    currentSwiperIndex: 0, //swiper当前索引
    hotList: [],
    weather:'',//温度
    weatherCity:'',//天气城市
    airQuality: '',//空气质量
    hotData:[],//热门推荐
    boutiqueRouteList: [], //精品路线
    // navList:12,//导航
    // navList: [{
    //     imgName: 'jiankangma',
    //     name: '健康码'
    //   },
    //   {
    //     imgName: 'classification',
    //     name: '景区预约'
    //   },
    //   {
    //     imgName: 'jingqutubiao',
    //     name: '景区'
    //   },
    //   {
    //     imgName: 'meishi',
    //     name: '美食'
    //   },
    //   {
    //     imgName: 'youjigonglue',
    //     name: '游记攻略'
    //   },
    //   {
    //     imgName: 'jxlx',
    //     name: '精品路线'
    //   },
    //   {
    //     imgName: 'jingqudaolan',
    //     name: '景区导览'
    //   },
    //   {
    //     imgName: 'jingquredu',
    //     name: '景区热度'
    //   },
    //   {
    //     imgName: 'lvyoutousu',
    //     name: '旅游投诉'
    //   },
    //   {
    //     imgName: 'gengduo',
    //     name: '更多'
    //   },
    // ],
    navList: [{
      imgName: 'jiankangma',
      name: '健康码'
    },
    {
      imgName: 'classification',
      name: '景区预约'
    },
    {
      imgName: 'jingqutubiao',
      name: '景区'
    },
    {
      imgName: 'zhaocesuoicon',
      name: '找公厕'
    },
    {
      imgName: 'meishi',
      name: '美食'
    },
    {
      imgName: 'daoyouchaxuntubiao',
      name: '导游查询'
    },
    {
      imgName: 'lvxingshechaxuntubiao',
      name: '旅行社查询'
    },
    {
      imgName: 'jingqudaolan',
      name: '景区导览'
    },
    {
      imgName: 'lvyoutousu',
      name: '旅游投诉'
    },
    // {
    //   imgName: 'jingquredu',
    //   name: '景区热度'
    // },
    {
          imgName: 'gengduo',
          name: '更多'
        },
    ],
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    navPage:1,//热门推荐第几页
    navSize:10,//热门每页几条
    navIndex:0,//当前热门推荐or游记攻略or精品路线 （0，1，2）
    weatherKongqi:'',
    weatherImg:''
  },
  onLoad() {
    // 天气
    this.getWeither()
    // app.globalData.weathers = '123123'
    // console.log('app.globalData.weathers.....', app.globalData.weathers)

      // banner
      this.getBanner()
  
  },
  toWeather(){
    wx.navigateTo({
      // url: '../index/weather/index?weather='+JSON.stringify(this.data.weatherKongqi.forecast7),
      url: '../index/weather/index',
    })
  },
  onReachBottom(){
       console.log("到底了！！");
       wx.showLoading({
        title: '玩命加载中',
      })
      this.onClickMore()
  },
  // 查看用户是否已经实名认证
  onGetRealAuth() {
    getRealAuth().then((res) => {
      console.log('res......', res)
      if (res.code == 200) {
        // this.setData({
        //   authentication: res.data
        // })
        // 0 没认证
        if (!res.data){
          wx.navigateTo({
            url: '/pages/index/healthCode/index',
          })
        } else {
          wx.navigateTo({
            // url: '/pages/index/healthCode/index',
            url: '/pages/index/healthCode/healthQrCode/index',
          })  
        }
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 1500,
        })
      }
    })
  },
  onShow() {
    this.setData({
      navPage: 1,
      boutiqueRouteList: [],
      hotList: [],
      hotData:[],
    })
      //精品路线
      this.getRoute();
      //游记
      this.getTravels();
      // 热门推荐
      this.gethot()
  },
  gotoCultural(){
    // wx.showLoading({
    //   title: '体验版暂不支持该跳转',
    // })
    
    // setTimeout(function () {
    //   wx.hideLoading()
    // }, 1000)
    wx.navigateToMiniProgram({
      appId: "wxf585b434a78dc95d",
      path:'',
      success(res) {
        wx.showToast({
          title: '跳转成功'
        })
      }
    })
    
  },
  // 天气
  getWeither(){
    var that = this
    wx.request({
      // url: 'http://183.66.194.186:8000/weaher/city', //服务器url+参数中携带的接口具体地址
      url: 'https://lzzhly.wglj.liuzhou.gov.cn/weather/city', //服务器url+参数中携带的接口具体地址
      // data:{
      //   name:'柳州市'
      // },
      header: {
        "Content-Type": "application/x-www-form-urlencoded", 
      },
      method: 'POST', //默认为GET,可以不写，如常用请求格式为POST，可以设置POST为默认请求方式
      success: function (res) {
        console.log('天气。。。', res)
        if(res.data.code == 200) {
          app.globalData.weathers = res.data.data
          that.setData({
            weather: res.data.data.wendu,
            weatherCity: res.data.data.city.split('，')[0],
            airQuality: res.data.data.kongqi.split(' ')[1],
            weatherImg:res.data.data.forecast7[1]
          })
          console.log(that.data.weatherImg,"111111")
        }else{
          that.setData({
            weather: '',
          })
          wx.showToast({
            title: '天气获取失败',
            icon: 'none',
            duration: 1500,
          })
        }

      }
    })
  },
  getBanner(){
    var param = {
      tag: 'HOME',
    }
    homeBanner(param).then((res) => {
      if (res.code == 200) {
        this.setData({
          bannerList: res.data
        })
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 1500,
        })
      }
    })
  },
  // to banner 详情
  toBannerDetails(e) {
    console.log('e.....',e)
    const id = e.currentTarget.dataset.id
    this.data.bannerList.map((item,i) => {
      if (item.id == id && item.isJump){
        // var p = item.toParam.split('?')[1]
        wx.navigateTo({
          url: `/${item.jumpUrl}${item.toParam}` ,
        })
      }
    })
  },
  gethot(){
    let params = {
      page: this.data.navPage,
      size: this.data.navSize
    }
    getHot(params).then(res=>{

      // console.log(res);
      
      if(res.code==200){
         if(res.data.rows.length < this.data.navSize){
          this.setData({
            searchLoading:true
          })
         }
        this.setData({
          hotData:this.data.hotData.concat(res.data.rows)
        })
        wx.hideLoading()
      }else {
        wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 1500,
        })
      }
    })
  },
  getRoute() {
    let params = {
      page: this.data.navPage,
      size: this.data.navSize
    }
    getRouteList(params).then(res=>{
      if (res.code == 200) {
        if(res.data.length < this.data.navSize){
          this.setData({
            searchLoading:true
          })
         }
        this.setData({
          boutiqueRouteList:this.data.boutiqueRouteList.concat(res.data.rows)
        })
        wx.hideLoading()
      } else {
        wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 1500,
        })
      }
    })
  },
  // 热门推荐
  onTabChange(e){
    // var top=document.body.scrollTop;
    // console.log(top,'wqweqwe')
    // console.log(e.detail.index)
    this.setData({
      navIndex:e.detail.index
    })
    wx.pageScrollTo({
      scrollTop: this.data.top,
      duration: 0
    });
  },
  onPageScroll: function(e) {
    // console.log(e.scrollTop)
    this.setData({
      top:e.scrollTop
    })
  },
  // 搜索
  onSearch(e) {
    const z = e.detail
    // console.log('z....', z)
    wx.navigateTo({
      url: '../index/search/index?id=' + z,
    })
  },
  getTravels() {
    let params = {
      page: this.data.navPage,
      size: this.data.navSize
    }
    getTravelsList(params).then(res => {
      if (res.code == 200) {
        if(res.data.rows.length < this.data.navSize){
          this.setData({
            searchLoading:true
          })
        }
        this.setData({
          hotList:this.data.hotList.concat(res.data.rows)
        })
        wx.hideLoading()
     
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 1500,
        })
      }
    })
  },
  // 720 全景
  toPanorama() {
    wx.navigateTo({
      // url: '/pages/index/panorama/index'
      url: '/pages/more/panoramaList/index'
    })
  },
  // 五区
  toDestination() {
    // console.log('hhzkhakjshdahsjk')
    wx.navigateTo({
      // url: '/pages/index/destination/index'
      url:"/pages/index/selectedFiveDistricts/index",
    })
  },
  // 路线详情
  toRouterDetail(e) {
    // console.log(e.currentTarget.dataset.index)
    wx.navigateTo({
      url: '/pages/more/boutiqueRoute/routerDetail/index?id=' + e.currentTarget.dataset.index
    })
  },
  // 游记攻略详情
  toTravelStrategyDetails(e) {
    // console.log(e.currentTarget.dataset.index)
    wx.navigateTo({
      url: '/pages/more/travelNotesIntroduction/travelStrategyDetails/index?id='+e.currentTarget.dataset.index
    })
  },
  // 景点详情
  toAttractionsDetail(ev) {
    // console.log(ev);
    var id = ev.currentTarget.dataset.id
    wx.navigateTo({
      url: `../more/attractions/attractionsDetail/index?id=${id}`
    })
  },
  // 美食特产
  toGourmetSpecialty() {
    wx.navigateTo({
      url: '../index/gourmetSpecialty/index'
    })
  },
  // banner
  swiperBindchange(e) {
    this.setData({
      currentSwiperIndex: e.detail.current
    })
  },
  // 导航栏点击
  tonav(e) {
    // console.log('e......', e)
    const url = {
      "健康码": '/pages/index/healthCode/index',
      "景区预约": '/pages/scenicSpotBooking/index',
      // "景区预约": '',
      "景区": '/pages/more/attractions/index',
      "找公厕": '/pages/more/findToilet/index',
      "美食": '/pages/more/deliciousFood/index',
      "导游查询": '/pages/more/tourGuide/index',
      "旅行社查询": '/pages/more/travelAgencyInquiry/index',
      // "游记攻略": '/pages/more/travelNotesIntroduction/index',
      // "精品路线": '/pages/more/boutiqueRoute/index',
      "景区导览": '/pages/index/tour/index',
      "旅游投诉": 'complaint',
      // "景区热度": '/pages/more/scenicSpotHeat/index',
      "更多": '/pages/more/index',
    }
    const n = e.currentTarget.dataset.id
    // console.log('n......', n)
    const m = url[n]
    if (m == "") {
      Toast.fail('该功能正在开发中，敬请期待');
    } else if (m == "complaint") {
      this.getTell();
    } else if (n == "健康码") {
      this.onGetRealAuth();
      // wx.navigateTo({
      //   url: '/pages/index/healthCodeUrl/index',
      // })
    } else {
      wx.navigateTo({
        url: m,
      })
    }
    // else if(n == "景区预约") {
    //   wx.navigateToMiniProgram({
    //     appId: 'wx416f21d2e7c54de9',
    //     path: '/packageB/pages/novel_coronavirus_2020/ScenicStatisticPage/ScenicStatisticPage',
    //     // extraData: {
    //     //   foo: 'bar'
    //     // },
    //     // envVersion: 'develop',
    //     // success(res) {
    //     //   // 打开成功
    //     // }
    //   })
    // }
  },
  //获取电话
  getTell: function () {
    getTel().then((res) => {
      contactTel: 12301;
      this.freeTell()
      // if (res.code == 200) {
      //   this.setData({
      //     contactTel: res.data[0].contactTel
      //   })
      //   this.freeTell()
      // } else {
      //   wx.showToast({
      //     title: res.message,
      //     icon: 'none',
      //     duration: 1500,
      //   })
      // }
    })
  },
  //拨打电话
  freeTell: function () {
    wx.makePhoneCall({
      phoneNumber: 12301+"",
    }).catch((e) => {
      // console.log(e)  //用catch(e)来捕获错误{makePhoneCall:fail cancel}
    })
  },
  onClickMore:function(){
     console.log("点击")
     this.setData({
      navPage:this.data.navPage+1
     })
     if(this.data.navIndex==0){
      //热门推荐
      this.gethot()
    }else if(this.data.navIndex==1){
   
      //游记
      this.getTravels();
 
    }else{
      //路线
      this.getRoute();
    }
  },
  // 分享
  travelsShare() {
    const params = {
      travelsId: this.data.travelsId
    }
    travelsShare(params).then((res) => {
      if(res.code == 200) {
      this.getTravels()
      // this.click_option()
      } else {
        wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 1500,
        })
      }
    })
  },
  //用户点击右上角分享
  onShareAppMessage: function( options ){
    console.log("options风向....", options)
    this.setData({
      travelsId: options.target.dataset.index
    })
    const that = this
    // 来自页面内的按钮的转发
    if(options.from == 'button'){
      // console.log("button分享....")
      that.travelsShare()
    }
  },
})