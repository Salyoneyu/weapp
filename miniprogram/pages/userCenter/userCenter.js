const app = getApp();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		info: {},
		goods_list: [],
		lost_list: []

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		wx.showLoading({
			title: '加载中'
		})
		const { userId } = options;
		const that = this;
		wx.cloud.callFunction({
			name: 'cFuncs',
			data: {
				userId,
				api_name: 'getOthersInfo'
			},
			success: res => {
				wx.hideLoading();
				const goods_list = res.result[1].data;
				const lost_list = res.result[2].data;
				if(1){
					const g_map = {
						1: '男',
						2: '女'
					};
					const gender = g_map[res.result[0].data[0].detailInfo.gender];
					res.result[0].data[0].detailInfo.gender = gender;
				}
				const info = res.result[0].data[0].detailInfo;
				that.setData({
					info,
					goods_list,
					lost_list
				})
				console.log(res);
			},
			fail: err => {
				wx.hideLoading();
				console.log(err);
			}
		})
	},

	tapToDetail(e){
        wx.navigateTo({
            url: `../goodsDetail/goodsDetail?id=${e.currentTarget.dataset.id}&status=1`
        });
	},

	tapToLostDetail(e){
        const { id } = e.currentTarget.dataset;
        wx.navigateTo({
            url: `../lostDetail/lostDetail?id=${id}`
        });
    },
})