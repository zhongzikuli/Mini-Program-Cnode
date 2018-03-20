//index.js
//获取应用实例
const api = require('../../utils/api.js');
const util = require('../../utils/util.js')
const app = getApp();

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    winHeight: "",//窗口高度
    currentTab: 'all',
    page: 1,
    limit:10,
    dataList: [],
    section: [
      { name: '全部', tab: 'all' },
      { name: '精华', tab: 'good' },
      { name: '分享', tab: 'share' },
      { name: '问答', tab: 'ask' },
      { name: '招聘', tab: 'job' }
    ]
  },
  
  loadData: function (type, page) {
    var params = {
      tab: type,
      page: page,
      limit: this.data.limit,
      mdrender: true
    }
    wx.showLoading({
      title: '玩命加载中',
    })
    var self = this;
    api.get("https://cnodejs.org/api/v1/topics", params, function (res) {
      if (res.statusCode == 200) {
        //合并数组，用于上拉加载更多,没有append方法，我这种方法不是很好，因为到后面数组会很大
        var renderArr = self.data.page == 1 ? res.data.data : self.data.dataList.concat(res.data.data);
        self.setData({
          dataList: renderArr
        })
        wx.hideLoading(); 
      }
    })
  },
  
  onReachBottom: function (e) {
    
    var page = this.data.page;
    // 控制一下，最多显示十页的数据
    if (page < 10) {
      this.setData({ page: page + 1 });
      this.loadData(this.data.currentTab, this.data.page)
    }
    return false;
  },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    this.setData({ page: 1});
    this.loadData(this.data.currentTab, this.data.page)
  },
  handleTap: function (e) {
    //console.log(e);
    let tab = e.currentTarget.id;
    if (tab) {
      this.setData({
        currentTab: tab,
        page: 1  //重置page为1
      })
      this.loadData(this.data.currentTab, this.data.page)
    }
  },
  goToDetail: function (e) {
    var id = e.target.id;
    wx.navigateTo({// wx.navigateTo，是保留当前页面，调到应用内某个页面，使用wx.navigateBack可以返回
      url: '../detail/detail?id=' + id
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
      })
    } else if (this.data.canIUse) {// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      app.userInfoReadyCallback = res => {// 所以此处加入 callback 以防止这种情况
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {// 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    this.loadData(this.data.currentTab, this.data.page)
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
