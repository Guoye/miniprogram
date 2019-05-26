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
    this.getOpenId();
    this.getUserInfomation();
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

  },

  /**
   * 获取当前用户openid
   */
  getOpenId() {
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
    dbCollection.where({
      _openid: this.data.openid
    }).get().then(resp=>{
      console.log(resp)
      this.setData({
        list: resp.data
      })
    }).catch(error => {
      console.error(error)
    })
  },

  /**
   * 路由
   */
  goPage(event){
    console.log(event)
    const id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: './topic?id='+id,
    })
  }
})