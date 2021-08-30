import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

const app = getApp();

Page({

    /**
    * 页面的初始数据
    */
    data: {
        good_imgs: [],
        detail: {},
        isLike: false,
        logged: false,
        goods_id: 0,
        status: 1
    },
    tapToUserInfo(e){
        const {logged}=app.globalData;
        if(!logged){
        Dialog.confirm({
        title: '未登录',
        message: '您暂未登录，请登录后再进行操作',
        width:"800rpx"
        }).then(() => {
        wx.switchTab({
          url: '../HTmine/HTmine',
        })
      }).catch(() => {
        })
    }
    else{
        const { userid } = e.currentTarget.dataset;
        wx.navigateTo({
            url: `../userCenter/userCenter?userId=${userid}`
        })
    }
    },
    
    /**
    * 生命周期函数--监听页面加载
    */
    onLoad: function (options) {
        const skey = wx.getStorageSync('skey');
        const that = this;
        const { id, status } = options;
        const params = {
            skey,
            id
        }
        if(status == 0){
            params['status'] = status;
        }
        this.setData({
            goods_id: id,
            status
        })
        wx.cloud.callFunction({
            name: 'getGoods_detail',
            data: params,
            success: res => {
                console.log(res);
                that.setData({
                    good_imgs: res.result.detail.data.pic_url,
                    detail: res.result.detail.data,
                    isLike: res.result.isLike,
                    logged: app.globalData.logged
                })
            },
            fail: err => {
                console.log(err);
            }
        })
    },

    modifyLikeGoods(){
        const { logged, isLike, goods_id, status } = this.data;
        console.log(status==1,logged);

        if(status == 1){
            if(logged){
                this.setData({
                    isLike: !isLike
                });

                const skey = wx.getStorageSync('skey');
                //调用云函数添加/删除喜欢商品
                wx.cloud.callFunction({
                    name: 'saveOrDelete_likes',
                    data: {
                        goods_id,
                        skey,
                        isLike: !isLike
                    },
                    success: res => {
                        console.log(res);
                    },
                    fail: err => {
                        console.log(err);
                    }
                })


            }else{
                Dialog.confirm({
                    title: '未登录',
                    message: '您暂未登录，请登录后再进行操作',
                    width:"800rpx"
                }).then(() => {
                    wx.switchTab({
                      url: '../HTmine/HTmine',
                    })
                  }).catch(() => {
                    // on cancel
                  });
            }
        }
    },
})