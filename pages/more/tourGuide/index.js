// pages/more/tourGuide/index.js
// import Dialog from '../../vant/dialog/dialog';
import { searchGuide } from '../../../utils/more/tourGuide'
var app = getApp();
const iconUrl = app.globalData.iconUrl
Page({
  /**
   * 页面的初始数据
   */
  data: {
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    page: 1,
    size: 5,
    iconUrl: iconUrl,
    show:false,
    showButton: true,
    showList: false,
    screeningBool: false,//筛选
    // SelectDisplay: false,
    value: '',
    sex: '',//性别
    grade: '',//等级
    select: [
      {name:''},
      {name:''},
    ],//筛选结果
    cardList: [],//导游名片
  },
  // 添加已选择项
  // addSelected(id) {
  //   console.log("id......", id)
  // },
  // 选择性别
  choiceGender(event) {
    const gender = {'1': '男', '0': '女'}
    const self = event.target
    // console.log("self......", self.dataset.id)
    const nam = "select[0].name" 
    if(self.dataset.id == this.data.sex){
      this.setData({
        sex: '',
        [nam]: ''
      })
    } else {
      this.setData({
        sex: self.dataset.id,
        [nam]: gender[self.dataset.id]
      })
    }

  },
  // 选择等级
  choiceGrade(event) {
    const self = event.target
    const gd = {'INITIAL': '初级', 'MIDDLE': '中级', 'SENIOR': '高级'}
    const nam = "select[1].name" 
    // console.log("self......", self.dataset.id)
    if(self.dataset.id == this.data.grade){
      this.setData({
        grade: '',
        [nam]: ''
      })
    } else {
      this.setData({
        grade: self.dataset.id,
        [nam]: gd[self.dataset.id]
      })
    }

  },
  // 获取关键字
  keyword(e) {
    console.log('e.detail', e.detail, this.data.value)
    this.setData({
      value: e.detail,
    })
  },
  // 显示查询提示
  toSearch() {
    if(!this.data.value){
      wx.showToast({
        title: '请输入搜索关键词',
        icon: 'none',
        duration: 1500,
      })
      return
    }
    this.setData({
      show:true,
      page: 1,
      cardList:[],
      searchLoading:false,
      screeningBool: false,
    })
  },
  // 显示查询结果
  toSearchList(){
    this.search()
    this.setData({
      showList: true,
      show: false,
      showButton: false
    })
  },
  // 取消查询
  toMyAppointment(){
    this.setData({
      show: false
    })
  },
  // 筛选
  showScreening(){
    // console.log('1123123123')
    this.setData({
      screeningBool: !this.data.screeningBool
    })
  },
  // 转换等级
  levelGrade(e){
    console.log('e......', e)
    const gd = {'INITIAL': '初级', 'MIDDLE': '中级', 'SENIOR': '高级'}
    return gd[e]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  // 传参
  search() {
    const param = {
      keyWord: this.data.value,
      level: this.data.grade,
      page : this.data.page,
      sex: this.data.sex,
      size: this.data.size,
    }
    // 接口取返回值
    searchGuide(param).then((res) => {
      // console.log('res.........', res)
      if(res.code == 200) {
        const m = res.data.rows
        console.log('m.length.........', m.length)
        if (m.length < this.data.size) {
          console.log('m.length.........', m.length)
          this.setData({
            searchLoading: true,
          })
        }
        m.map((item) => {
          item.nameZh = this.levelGrade(item.level)
        })
        this.setData({
          cardList: this.data.cardList.concat(m)
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
  // 返回更多
  onClickLeft() {
    // wx.navigateTo({
    //   url: '/pages/more/index'
    // })
    wx.navigateBack({
      delta: 1,
    })
  },
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log("到底了！！");
    wx.showLoading({
     title: '玩命加载中',
   })
   this.onClickMore()
  },
  onClickMore:function(){
     console.log("点击")
     this.setData({
      page:this.data.page+1
     })
     this.search()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})