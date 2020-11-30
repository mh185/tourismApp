// pages/hotel/chooseLocation/index.js
import city from '../../../libs/city.js'
// var city = requir('./libs/city.js')
console.log(city, 'city')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mainActiveIndex: 0,
    activeId: null,
    items:[
      {
        // 导航名称
        text: '所有城市',
        // 导航名称右上角徽标，1.5.0 版本开始支持
        // badge: 3,
        // 是否在导航名称右上角显示小红点，1.5.0 版本开始支持
        // dot: true,
        // 禁用选项
        // disabled: false,
        // 该导航下所有的可选项
        children: [
          {
            // 名称
            text: '温州',
            // id，作为匹配选中状态的标识
            id: 1,
            // 禁用选项
            // disabled: true,
          },
          {
            text: '杭州',
            id: 2,
          },
        ],
      },
    ]
  },
  // 选择城市
  toHotelReservation: function() {
    wx.navigateTo({
      url: '../hotelReservation/index',
    })
  },
  onClickNav({ detail = {} }) {
    this.setData({
      mainActiveIndex: detail.index || 0,
    });
  },

  onClickItem({ detail = {} }) {
    const activeId = this.data.activeId === detail.id ? null : detail.id;

    this.setData({ activeId });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initCity()
  },
  initCity(){
    var cityKey = Object.keys(city.city_list)
    var items = []
    cityKey.map((key, index) => {
      var o = {
        text: city.city_list[key],
        children:[
          {
            // 名称
            text: '温州',
            id: 1,
          },
        ]
      }
      items.push(o)
    })

    this.setData({
      items: items
    })
    console.log(this.data.items,'this.data.items')
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

  }
})