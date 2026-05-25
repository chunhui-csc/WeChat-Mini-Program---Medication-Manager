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

    const todayStr = new Date().toLocaleDateString();
    const lastRecordDate = wx.getStorageSync('lastRecordDate') || [];

    if (lastRecordDate){
      if (lastRecordDate !== todayStr) {
        // 日期不一致，说明已经是新的一天了，需要重置所有药品的状态
        members.forEach(member => {
          member.bottles.forEach(bottle => {
            bottle.confirm = false; // 将所有药品的 confirm 重置为 false
          });
        });
  
        wx.setStorageSync('lastRecordDate', todayStr);
        wx.setStorageSync('members', members);
        console.log('检测到跨天，已自动刷新用药状态');
      }
    }

    wx.setStorageSync('lastRecordDate', todayStr);

    members.forEach(member => {
      member.bottles.forEach(bottle => {
        if (bottle.schedule) {
          reminders.push({
            id: bottle.id,
            medicineName: bottle.medicineName,
            time: bottle.schedule,
            memberName: member.name,
            confirm: bottle.confirm || false,
            memberId: member.id
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
    
    wx.setStorageSync('reminderList', this.data.reminderList);
  },

  switchTab: function(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
  },

  confirmReminder: function(e){
    const reminderId = e.currentTarget.dataset.id;
    const reminder = this.data.reminderList.find(r => r.id == reminderId);
    const members = wx.getStorageSync('members');

    wx.showModal({
      title: "确认",
      content: "请确认是否服药",
      success: res => {
        if (res.confirm){
          if (reminder) {
            members.forEach(member => {
              const targetBottle = member.bottles.find(b => b.id === reminderId);
              if (targetBottle) {
                targetBottle.confirm = true;
              }
            });
    
            wx.setStorageSync('members', members);
    
            this.loadRemindersAndWarnings();
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