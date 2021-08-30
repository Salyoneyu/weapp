// pages/HThome/HThome.js
Page({

  /**
   * 页面的初始数据
   */
  
  data: {
    // 轮播图
    imgUrls: [
      './../../images/banner/ban1.png',
      './../../images/banner/ban2.png'
  ],

  hot_list: [],
  choose: 1,
  goods_list: [],
  lost_list: [],
  startNum: 0,
  lastData: false,
  lostStart: 0,
  lastLost: false,
  active: 0,

  classlist:[
    {
      icon:'./../../images/icons/facing.png',
      txt:'生活用品'
      },
    {
    icon:'./../../images/icons/book.png',
    txt:'教材教辅'
    },
    {
      icon:'./../../images/icons/clothes.png',
      txt:'衣服饰品'
      }
  ],
  goodlist:[],

  searchKey: ''
  },

  saveSearchKey(e){
    this.setData({
        searchKey: e.detail.value
    });
},

toSearchList(){
  let { searchKey } = this.data;
  this.setData({
      searchKey: ''
  })
  searchKey = searchKey.replace(/\s*/g, '');
  if(searchKey){
      wx.navigateTo({
          url: `../classifyList/classifyList?from=search&txt=${searchKey}`
      })
  }
},

toClassifyList(e){
  const { classify } = e.currentTarget.dataset;
  wx.navigateTo({
      url: `../classifyList/classifyList?from=classify&txt=${classify}`
  })
},

  tapToDetail(e){
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
        url: `../goodsDetail/goodsDetail?id=${id}&status=1`
    });
},
  initList(startNum){
    const that = this;
    wx.showLoading({
        title: '加载中'
    })
    wx.cloud.callFunction({
        name: 'getGoods_list',
        data: {
            startNum
        },
        success: res => {
            console.log(res);
            wx.stopPullDownRefresh(); // 停止下拉刷新
            wx.hideLoading();
            const { isLast } = res.result;
            let reverseList = res.result.list.data.reverse();
            if(startNum){
                //startNum不为0时，拼接到goods_list的后面
                reverseList = that.data.goodlist.concat(reverseList);
            }
            that.setData({
                goodlist: reverseList,
                lastData: isLast
            });
        },
        fail: err => {
            wx.hideLoading();
            console.log(err);
        }
    })
},

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {

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
    this.initList(0);
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