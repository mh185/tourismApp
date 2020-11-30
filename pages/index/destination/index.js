import { queryDestination } from '../../../utils/more/destination.js'
import { pageQueryByCityCode } from '../../../utils/more/tourGuide.js'
var app = getApp();
const iconUrl = app.globalData.iconUrl
const order = ['demo1', 'demo2', 'demo3']
const host = app.globalData.host;
// pages/destination/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    host:host,//图片域名
    screeningBool: false,
    activeNum:'first',//城市颜色切换
    cityList: [],//城市列表
    scenicList: [],//景点列表
    hotShow:false,
    searchLoading: false, 
    gradeList: [
      {
        name:'1A',
        show: false
      }, 
      {
        name: '2A',
        show: false
      }, {
        name: '3A',
        show: false
      }, {
        name: '4A',
        show: false
      }, {
        name: '5A',
        show: false
      }, 
      ],//AA列表
    chooseStar:'',
    page:1,
    iconUrl: iconUrl,
  },
  onClickMore:function(){
    console.log("点击")
    this.setData({
     page:this.data.page+1
    })
    this.pageScenic()

  },
  // 返回上一页
  onClickLeft(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },  // 筛选
  showScreening(){
    // console.log('1123123123')
    this.setData({
      screeningBool: !this.data.screeningBool
    })
  },
  // 地区景点
  toMoredestination(e){
    console.log('e........', e)
    const t = e.currentTarget.dataset.id
    this.setData({
      activeNum : t,
      page:1,
      scenicList:[]
    })
    this.pageScenic()
    // wx.navigateTo({
    //   url: '/pages/index/destination/moredestination/index?areaCode='+t,
    // })
  },
  // 景点详情
  toAttractionsDetail(e){
    console.log(e,'eeeeeee');
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/more/attractions/attractionsDetail/index?id='+id,
    })
  },
  // 导览地图
  toMuideMap(e){
    var id = e.currentTarget.dataset.id
    const handdrawingid = e.currentTarget.dataset.handdrawingid
    console.log(handdrawingid,e,'handdrawingid');
    if(handdrawingid != null) {
      wx.navigateTo({
        url: '/pages/index/guide/guideMap/index?id='+id,
      })
    }else{
      wx.showToast({
          title: '电子导览地图正在上传中  敬请期待',
          icon: 'none',
          duration: 1500,
      })
    }
  },
  // 导航头点击
  click_option(e){
    var t = e.target.dataset.id
    this.setData({
      activeNum : t
    })
  },
  scroll(e) {
    // console.log(e)
  },
  handleTo(){
    wx.navigateTo({
      url: '/pages/destination/more/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      screeningBool: false,
      activeNum:'first',//城市颜色切换
      hotShow:false,
      chooseStar:'',
      gradeList: [
        {
          name:'1A',
          show: false
        }, 
        {
          name: '2A',
          show: false
        }, {
          name: '3A',
          show: false
        }, {
          name: '4A',
          show: false
        }, {
          name: '5A',
          show: false
        }, 
      ],
    })
    this.pageCity()

    this.pageScenic()
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
  // 获取城市
  pageCity() {
    const city = {
      cityCode: '450200',
    }
    pageQueryByCityCode(city).then((res) => {
      if (res.code == 200) {
        const area = res.data
        this.setData({
          cityList: area
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
  // 获取景点
  pageScenic() {
    var starLevel = ''
    const aaa = {
      '1A': 'A',
      '2A': 'AA',
      '3A': 'AAA',
      '4A': 'AAAA',
      '5A': 'AAAAA'
    }
    this.data.gradeList.map((item, j) => {
      if (item.show) {
        const i = item.name
        starLevel = aaa[i]
        // console.log('aaa.....',i , starLevel)
      }
    })
    var param = {
      "areaCode": this.data.activeNum == 'first' ? '' : this.data.activeNum,//所在区县代码
      "hotScenicSpot": this.data.hotShow ? 1 : 0,//是否热门
      "starLevel":  starLevel,//景区星级
      page: this.data.page
    }
    queryDestination(param).then((res) => {
      wx.hideLoading()
      if (res.code == 200) {
        if(res.data.rows.length < 10){
          this.setData({
            searchLoading:true
          })
        }
        if(res.data.rows.length > 0) {
          const area = res.data.rows
          this.setData({
            scenicList: this.data.scenicList.concat(area)
          })
        } else {
          // this.setData({
          //   scenicList: []
          // })
          // wx.showToast({
          //   title: '暂无数据',
          //   icon: 'none',
          //   duration: 1500,
          // })
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
  clickHot(e){
    this.setData({
      hotShow: !this.data.hotShow,
    })
  },
  clickStar(e){
    var t = e.target.dataset.code
    var i = e.target.dataset.index
    console.log(t,i,'ssssssssss');
    
    this.data.gradeList.map((item,j) => {
      if(i != j){
        var s = `gradeList[${j}].show`
        this.setData({
          [s]: false
        })
      }
    })
    var s = `gradeList[${i}].show`
    this.setData({
      [s]: !this.data.gradeList[i].show
    })
    if (this.data.gradeList[i].show) {
      this.setData({
        chooseStar: t,
      })
    } else {
      this.setData({
        chooseStar: '',
      })
    }
  },
  // 重置
  onReset(){
    this.data.gradeList.map((item, j) => {
      var s = `gradeList[${j}].show`
      this.setData({
        [s]: false
      })
    })
    this.setData({
      chooseStar: '',
      hotShow: false,
    })
  },
  // 确认
  onConfirm(){
    this.setData({
      scenicList: [],
      page: 1,
    })
    this.pageScenic()
    this.setData({
      screeningBool: !this.data.screeningBool
    })
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
    wx.showLoading({
      title: '玩命加载中',
    })
    this.onClickMore()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})