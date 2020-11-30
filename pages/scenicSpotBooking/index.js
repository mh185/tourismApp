// pages/scenicSpotBooking/index.js
// import { insertTravelers } from '../../utils/more/destination.js'
import { queryAllTraveler, scenicSpotBookingInsert} from '../../utils/more/destination.js'
import { scenicReservation } from '../../utils/more/scenicSpotBooking.js'
import { scenicList } from '../../utils/api/attraction'
import { pageQueryByCityCode } from '../../utils/more/tourGuide.js'
var utils = require('../../utils/util.js');

var app = getApp();
var page=1;
var size=10;
const host = app.globalData.scenicHost
const iconUrl = app.globalData.iconUrl
const hostList = app.globalData.host
import Toast from '../../vant/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeNum: '0',
    hostList: hostList,
    areaCode:'',
    scenicSpotName:'',
    scenicListData:[],
    cityList:[],
    screeningBool: false,
    selectItemId:'',//筛选
    // appointment: false,//线上/电话
    appointment: true,//线上/电话
    scenicId: '',//选择景区ID
    host: host,
    iconUrl: iconUrl,
    cardList:[],//出行人列表
    dateTime:'请选择',
    show: false,
    time: "请选择",
    chooseScenic:"请选择",//选中景区 name
    selectScenicId:'',//选中景区 id
    columns: [],
  },
  // 线上/电话
  appointmentClick(e) {
    // console.log('46464646546545', e)  //用catch(e)来捕获错误{makePhoneCall:fail cancel}、
    const cId = e.target.dataset.id
    this.setData({
      activeNum: cId,
      appointment: !this.data.appointment
    })
  },
  //打电话
  toTelephone(e) {
    console.log('................0', e)
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone+"",
    }).catch((e) => {
      // console.log(e)  //用catch(e)来捕获错误{makePhoneCall:fail cancel}
    })
  },
  // 获取景区列表
  getScenicList(){
    const params = {
      areaCode: this.data.areaCode,
      scenicSpotName: this.data.scenicSpotName,
    }
    // console.log('params.....', params);
    scenicList({ params, page, size }).then(res => {
      // console.log({ page, size });
      if (res.code == 200) {
        if(res.data.rows.length < size){
          this.setData({
            searchLoading:true
          })
        }
        this.setData({
          scenicListData:this.data.scenicListData.concat(res.data.rows)
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
  //确认
  confirm(){
    this.setData({
      scenicListData: [],
      page:1,
      screeningBool: !this.data.screeningBool
    })
    this.getScenicList()
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
  //选择--电话预约
  onSelectCity(e){
    var a = e.currentTarget.dataset.item
    console.log('e......', e)
    this.setData({
      selectItemId: a.name,
      areaCode: a.code,
      latitude: '',
      longitude: '',
    })
  },
  // 筛选
  showScreening(){
    this.setData({
      screeningBool: !this.data.screeningBool
    })
  },
  //重置
  reset(){
    this.setData({
      selectItemId: '',
    })
  },
  //选择游客
  selectCard(e){
    var id = e.currentTarget.dataset.id
    console.log(id,'id')
    this.data.cardList.map((item,i) => {
      if(item.id == id){
        var it = `cardList[${i}].checked`
        this.setData({
          [it]: !this.data.cardList[i].checked
        })
      }
    })
    console.log(this.data.cardList, 'this.data.cardList')

  },
  // 获取出行人列表
  pageCard() {
    queryAllTraveler().then((res) => {
      if(res.code == 200) {
        res.data.map(item => {
          item.checked = item.defaultTraveler?true : false
        })
        this.setData({
          cardList: res.data
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
  // 返回首页
  onClickLeft() {
    wx.removeStorageSync('chooseScenic')
    wx.removeStorageSync('chooseScenicDate')
    wx.removeStorageSync('chooseScenicId')
    wx.removeStorageSync('chooseScenicItem')

    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  //预约
  subscribe(){
    console.log(this.data,'this.dta')
    //预约人员
    var travelers = []
    this.data.cardList.map((item) => {
      if (item.checked){
        var o = {
          name:item.name,
          idTypeName: item.idTypeName,
          idCard: item.idCard,
          phone: item.phone,
        }
        travelers.push(o)
      }
    })
    //预约时间段ID
    const selectScenicItem = wx.getStorageSync('chooseScenicItem')
    var timeID
    selectScenicItem.timeList.map(item => {
      if (item.timePeriod == this.data.time){
        timeID = item.id
      }
    })
    var param = {
      'createUserTel': app.globalData.wxUserInfo.mobile,
      "timeId": timeID,
      "areaId": this.data.selectScenicId,
      "travelers": JSON.stringify(travelers)
    }
    if (!param.createUserTel) {
      wx.showToast({
        title: '请登录',
        icon: 'none',
        duration: 1500,
      })
      return
    }
    if (!param.areaId) {
      wx.showToast({
        title: '请选择景区',
        icon: 'none',
        duration: 1500,
      })
      return
    } 
    if (!param.timeId) {
      wx.showToast({
        title: '请选择出行日期/预约时段',
        icon: 'none',
        duration: 1500,
      })
      return
    }
    if (!param.travelers) {
      wx.showToast({
        title: '请选择游客',
        icon: 'none',
        duration: 1500,
      })
      return
    }
    var that = this
    scenicReservation(param).then(res => {
      wx.showToast({
        title: res.msg,
        icon: 'none',
        duration: 1500,
      })
      // if (res.code == 0) {
      //   wx.removeStorageSync('chooseScenic')
      //   wx.removeStorageSync('chooseScenicDate')
      //   wx.removeStorageSync('chooseScenicId')
      // }
    })
    // wx.request({
    //   url: `${host}/Appointment/v2/Reservation`, //服务器url+参数中携带的接口具体地址
    //   data: param,
    //   header: {
    //     "Content-Type": "application/x-www-form-urlencoded",
    //     AppId: '772wgl',
    //   },
    //   method: 'POST', 
    //   success: function (res) {
    //     wx.showToast({
    //       title: res.data.msg,
    //       icon: 'none',
    //       duration: 1500,
    //     })
    //     if (res.data.code == 0) {
    //       wx.removeStorageSync('chooseScenic')
    //       wx.removeStorageSync('chooseScenicDate')
    //       wx.removeStorageSync('chooseScenicId')
    //     }
    //   }
    // })
    // scenicSpotBookingInsert(param).then((res) => {
    //   //预约成功移除缓存
    //   if(res.code == 200){
    //     wx.removeStorageSync('chooseScenic')
    //     wx.removeStorageSync('chooseScenicDate')
    //     wx.removeStorageSync('chooseScenicId')
    //   }
    //   wx.showToast({
    //     title: res.message,
    //     icon: 'none',
    //     duration: 1500,
    //   })
    // })
  },
  // 选择时间段
  pickerTime(event) {
    const { picker, value, index } = event.detail;
    Toast(`当前值：${value}, 当前索引：${index}`);
    this.setData({ time: event.detail.value });
    this.popupBottom()
    // console.log('event', event)
  },
  // 选择景区
  toChooseScenic() {
    wx.navigateTo({
      url: '../scenicSpotBooking/chooseScenic/index'
    })
  },
  // 出行日期
  toSelectDate() {
    wx.navigateTo({
      url: `../scenicSpotBooking/selectDate/index?scenicId=${this.data.scenicId}`
    })
  },
  // 添加出行人
  toAddTraveler() {
    wx.navigateTo({
      url: '../scenicSpotBooking/addTraveler/index'
    })
  },
  // 预约时段
  toappointmentPeriod() {
    if (this.data.columns.length > 0){
      this.showPopup()
    } else {
      wx.showToast({
        title: "无可预约时段",
        icon: 'none',
        duration: 1500,
      })
    }
  },
  showPopup() {
    this.setData({ show: true });
  },
  // 底部弹出关闭
  popupBottom() {
    this.setData({ show: false });
  },
  // 出行人列表
  toTravelers() {
    wx.navigateTo({
      url: '../scenicSpotBooking/travelers/index'
    })
  },
  // 我的预约列表
  toSubscribeList() {
    wx.navigateTo({
      url: '../scenicSpotBooking/subscribeList/index'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var TIME = utils.formatTime(new Date());
    this.setData({
      chooseScenic: "请选择",
      dateTime: `${TIME.split(' ')[0]}`,
      time: "请选择",
    });
    // console.log(this.data.dateTime, 'this.data.dateTime当前时间......');
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
    // 获取城市
    this.pageCity()
    // 获取出行人列表
    this.pageCard()
    // 获取景区列表
    this.getScenicList()
    const chooseScenic = wx.getStorageSync('chooseScenic')//已选景区
    const selectScenicId = wx.getStorageSync('selectScenicId')//已选景区ID
    //选择景区 显示
    if(chooseScenic){
      // 景区改变后重新选择 日期和时段，因为每个景区可预约的时段不一样
      if (chooseScenic != this.data.chooseScenic){
        wx.removeStorageSync('chooseScenicDate')
        this.setData({
          dateTime: '请选择',
          time:'请选择',
        })
      }
      this.setData({
        chooseScenic: chooseScenic,
        selectScenicId: selectScenicId,
      })
    }
    const dateTime = wx.getStorageSync('chooseScenicDate')//已选出行日期
    if (dateTime){
      // 景区改变后重新选择 日期和时段，因为每个景区可预约的时段不一样
      if (dateTime != this.data.dateTime){
        this.setData({
          time:'请选择',
        })
      }
      this.setData({
        dateTime: dateTime
      })
    }
    const selectScenicItem = wx.getStorageSync('chooseScenicItem')//已选景区详情
    if (selectScenicItem){
      var a = []
      selectScenicItem.timeList.map((item) => {
        // 排除不能预约的时段
        if (item.receptionQuantity - item.receptionTotal > 0){
          a.push(item.timePeriod)
        }
      })
      this.setData({
        columns:a
      })
    }
    // console.log("999999999999", chooseScenic, selectScenicId, this.data.scenicSpot)
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
    console.log("到底了！！");
    wx.showLoading({
     title: '玩命加载中',
   })
   this.onClickMore()
  },
  onClickMore:function(){
    // this.setData({
      page = page+1
    // })
    this.getScenicList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  
})