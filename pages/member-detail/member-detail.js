// pages/member-detail/member-detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentMember: {},
    bottles: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options.memberId)
    const memberId = options.memberId;

    if (memberId) {
      this.loadMemberData(memberId);
    } else {
      console.error('未获取到成员ID');
    }
  },

  loadMemberData: function(memberId){
    const members = wx.getStorageSync('members') || [];
    const member = members.find(m => m.id === memberId);

    if (member) {
      // 计算每个药瓶的有效期状态
      const processedBottles = member.bottles.map(bottle => {
        const daysLeft = this.getDaysLeft(bottle.expiresDate);
        return {
          ...bottle,
          isExpired: daysLeft < 0,
          isExpiringSoon: daysLeft >= 0 && daysLeft <= 30 // 30天内算临期
        };
      });

      this.setData({
        currentMember: member,
        bottles: processedBottles
      });
    }

    wx.stopPullDownRefresh();
  },

  getDaysLeft(expireDateStr) {
    const expireDate = new Date(expireDateStr);
    const today = new Date();
    const diffTime = expireDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  },

  navigateToAddBottle() {
    wx.navigateTo({
      url: `/pages/add-bottle/add-bottle?memberId=${this.data.currentMember.id}`
    });
  },

  editBottle:function(e){
    const bottleId = e.currentTarget.dataset.id;
    const bottle = this.data.bottles.find(b => b.id === bottleId);
    wx.navigateTo({
      url: `/pages/add-bottle/add-bottle?memberId=${this.data.currentMember.id}&bottle=${JSON.stringify(bottle)}`
    });
  },

  deleteBottle: function(e){
    const bottleId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个药瓶记录吗？',
      success: res => {
        if(res.confirm){
          const members = wx.getStorageSync('members');
          const memberIndex = members.findIndex(m => m.id === this.data.currentMember.id);
          members[memberIndex].bottles = members[memberIndex].bottles.filter(b => b.id !== bottleId);

          wx.setStorageSync('members', members);
          this.loadMemberData(this.data.currentMember.id);
        }
      }
    })
  }, 

  deleteMember: function(e){
    const members = wx.getStorageSync("members");
    const id = e.currentTarget.dataset.id;
    console.log(id);

    wx.showModal({
      title: '确认删除',
      content: "确定要删除吗？",
      success: res => {
        if (res.confirm){
          const newMembers = members.filter(member => 
            String(member.id).trim() !== String(id).trim());
          console.log(newMembers);
          wx.setStorageSync("members", newMembers);

          wx.showToast({ 
            title: '已删除', 
            icon: 'success',
            success: res => {
              wx.navigateBack({
                delta: 1
              })
            }
          });
        }

        
      }
    })
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
    this.onRefresh();
  },

  onRefresh: function(){
    const that = this;
    wx.showNavigationBarLoading()
    wx.showLoading({
      title: 'Loading...',
    })
    console.log("下拉刷新中。。。")
    setTimeout(() => {
      wx.hideLoading();
      wx.hideNavigationBarLoading();
      if (!that.data.currentMember || !that.data.currentMember.id) {
        wx.stopPullDownRefresh(); 
        return;
      }
      that.loadMemberData(that.data.currentMember.id);
    },1000)
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