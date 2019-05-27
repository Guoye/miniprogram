// pages/topic/topiclist.js
const db = wx.cloud.database()
const dbCollection = db.collection('topics')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '',
    userInfo: {},
    openid: '',
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad')
    this.getOpenId();
    this.getUserInfomation();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('onReady')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(this.data.openid){
      console.log('========onShow')
      this.getList();
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('onHide')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('onUnload')
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
   * 获取当前用户openid
   */
  getOpenId() {
    wx.showLoading({
      title: '加载中...',
    })
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'login',
      // 传递给云函数的参数
      data: {},
      success: res => {
        // output: res.result === 3
        console.log(res)
        this.setData({
          openid: res.result.openid
        });
        wx.hideLoading();
        this.getList();
      },
      fail: err => {
        // handle error
      },
      complete: () => {
        // ...
      }
    })
  },

  /**
   * 获取用户信息
   */
  getUserInfomation() {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log(res)
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },

  /**
   * 获取当前用户活动列表
   */
  getList(){
    wx.showLoading({
      title: '加载中...',
    })
    dbCollection.where({
      _openid: this.data.openid,
      enabled: 1
    }).orderBy('lastEditTime', 'desc')
      .orderBy('createTime', 'desc')
    .get().then(resp=>{
      console.log(resp)
      this.setData({
        list: resp.data
      })
      wx.hideLoading();
    }).catch(error => {
      console.error(error)
    })
  },

  /**
   * 路由
   */
  goPage(event){
    console.log(event)
    let id = '';
    if(event){
      id = '?id=' + event.currentTarget.dataset.id;
    }
    wx.navigateTo({
      url: './topic'+id,
    })
  },

  /**
   * 新增活动
   */
  addTopic() {
    this.goPage();
  }
})