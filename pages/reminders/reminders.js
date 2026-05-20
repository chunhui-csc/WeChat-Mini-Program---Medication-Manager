// pages/reminders/reminders.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeTab: 'reminders',
    reminderList: [],
    warningList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadRemindersAndWarnings();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.loadRemindersAndWarnings();
  },

  loadRemindersAndWarnings: function(){
    const members = wx.getStorageSync("members") || [];
    let reminders = [];
    let warnings = [];

    const today = new Date();

    members.forEach(member => {
      member.bottles.forEach(bottle => {
        if (bottle.schedule) {
          reminders.push({
            id: `remind_${bottle.id}`,
            medicineName: bottle.medicineName,
            time: bottle.schedule,
            memberName: member.name,
            confirm: false
          })
        }

        const expireDate = new Date(bottle.expiresDate);
        const diffTime = expireDate - today;
        const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (daysLeft <= 30) { 
          warnings.push({
            id: bottle.id,
            medicineName: bottle.medicineName,
            daysLeft: daysLeft,
            isExpired: daysLeft < 0,
            memberName: member.name
          });
        }
      })
    });

    warnings.sort((a, b) => a.daysLeft - b.daysLeft);

    this.setData({
      reminderList: reminders,
      warningList: warnings
    });
  },

  switchTab: function(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
  },

  confirmReminder: function(e){
    const reminderid = e.currentTarget.dataset.id;
    const reminder = this.data.reminderList.find(r => r.id == reminderid);

    wx.showModal({
      title: "确认",
      content: "请确认是否服药",
      success: res => {
        if (res.confirm){
          if (reminder) {
            reminder.confirm = true;
      
            this.setData({
              reminderList: this.data.reminderList
            });
          }
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})