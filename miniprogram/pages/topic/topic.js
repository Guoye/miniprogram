// pages/topic/topic.js
const db = wx.cloud.database()
const dbCollection = db.collection('topics')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isCreate: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options && options.id){
      dbCollection.doc(options.id).get()
        .then(resp => {
          // 当前是编辑模式
          this.setData({isCreate: false});

          console.log(resp)
          this.setData(resp.data)
        }).catch(error=>{
          console.log(error);
          wx.showToast
        })
    }
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
   * 时间事件
   */
  bindDateChange: function (event) {
    this.setData({
      endDate: event.detail.value
    })
  },

  /**
   * 时间事件
   */
  bindDateChange2: function (event) {
    this.setData({
      pubDate: event.detail.value
    })
  },

  /**
   * 表单提交事件
   */
  formSubmit(e) {
    if(this.data.isCreate){
      this.add(e);
    } else {
      this.update(e);
    }
    
  },

  /**
   * 新增
   */
  add(e){
    const postData = { ...{ createTime: db.serverDate() }, ...e.detail.value }
    dbCollection.add({
      data: postData
    })
      .then(res => {

        wx.showToast({
          title: '添加成功',
          icon: 'success',
          duration: 3000
        })

        // 返回上一页
        // wx.navigateBack()

      })
      .catch(console.error)
  },

  /**
   * 更新
   */
  update(e) {
    const postData = { ...{ lastEditTime: db.serverDate() }, ...e.detail.value }
    dbCollection.doc(this.data._id).update({
      data: postData
    }).then(resp => {
      console.log(resp)
      wx.showToast({
        title: "更新成功",
        icon: "success",
        duration: 3000
      })
    }).catch(error=>{
      console.log(error)
    })
  },

  /**
   * 表单重置
   */
  formReset() {
    console.log('form发生了reset事件')
  }
})