// pages/myshare/myshare.js

const app = getApp()
Page({
    data: {
        list: ['设计用心(⑉• •⑉)‥♡', '界面友好ʕ๑•ɷ•๑ʔ❀', '操作人性化ฅ۶•ﻌ•♡','适合地大学子使用(^～^) ','体验感很不错(◦˙▽˙◦)'],
        result: ['a']
      },
    
      onChange(event) {
        this.setData({
          result: event.detail
        });
      },
    
      toggle(event) {
        const { index } = event.currentTarget.dataset;
        const checkbox = this.selectComponent(`.checkboxes-${index}`);
        checkbox.toggle();
      },
    
      noop() {},
    onShareAppMessage(options){
        // 设置菜单中的转发按钮触发转发事件时的转发内容
        const shareObj = {
            title: "锤子供需", // 默认是小程序的名称(可以写slogan等)
            path: '/pages/HThome/HThome', // 首页
            imageUrl: './images/icons/HTicon.png', //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
            success: res => {
                // 转发成功之后的回调
                if (res.errMsg == 'shareAppMessage:ok') {
                    wx.showToast({
                        title: '转发成功',
                        icon: 'success',
                        duration: 1000
                    })
                }
            }
        };
        
        // 返回shareObj
        return shareObj;
    }
})