import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';//弹出框提示
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        avatarUrl: './../../images/icons/nouser.png',
        logged: false,
        userInfo: {},
        showLoading: false
    },

    bindGetUserInfo(e) {
        Dialog.confirm({
            title: '提示',
            message: '点击确定进行登录',
            width:'800rpx'
        }).then(() => {
            this.goLogin(e.detail.userInfo);
        });

    },

    goLogin(userInfo) {
        const that = this;
        this.setData({
            showLoading: true
        })
        console.log('userInfo:', userInfo);
        const {
            nickName,
            gender,
            avatarUrl
        } = userInfo;
        //登录
        wx.login({
            success(res) {
                if (res.code) {
                    // 调用云函数
                    wx.cloud.callFunction({
                        name: 'Get_Session_key',
                        data: {
                            code: res.code,
                            nickName,
                            gender,
                            avatarUrl,
                        },
                        success: result => {
                            console.log('登录成功,skey:', result);
                            //将skey存入storage
                            try {
                                wx.setStorageSync('skey', result.result.skey);
                                //获取用户信息
                                that.getUserInfo();
                            } catch (e) {
                                console.log(e);
                            }
                        },
                        fail: err => {
                            console.log(err);
                        }
                    })
                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
        })
    },

    getUserInfo() {
        const that = this;
        const skey = wx.getStorageSync('skey');
        if (skey) {
            //获取用户详细信息
            // 调用云函数
            wx.cloud.callFunction({
                name: 'Get_Detail_info',
                data: {
                    skey,
                },
                success: result => {
                    console.log(result.result.info);
                    if (result.result.suc) {
                        app.globalData.logged = true;
                        app.globalData.userInfo = result.result.info;
                        that.setData({
                            userInfo: result.result.info,
                            logged: true
                        });
                    } else {
                        wx.showToast({
                            title: result.result.info,
                            icon: 'none',
                            duration: 1000
                        })
                    }
                    that.setData({
                        showLoading: false
                    })
                },
                fail: err => {
                    console.log(err);
                }
            })
        }
    },

    toUserInfo() {
        wx.navigateTo({
            url: '../userInfo/userInfo'
        })
    },


    onShow() {
        const {
            logged,
            userInfo
        } = app.globalData;
        if (logged) {
            this.setData({
                logged,
                userInfo
            })
        }
    }
})