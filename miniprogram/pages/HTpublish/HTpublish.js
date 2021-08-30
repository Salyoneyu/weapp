// pages/HTpublish/HTpublish.js
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      v: '',
      showPicker: false,
      openPicker2:false,
      logged: false,
      columns: ['生活用品', '教材教辅','衣服饰品','其他'],
      columns2: [
        // 第一列
        {
          values: ['一组团', '二组团','三组团','其他'],
          defaultIndex: 2,
        },
        // 第二列
        {
          values: ['一栋', '二栋', '三栋','四栋','五栋','其他'],
          defaultIndex: 1,
        },
      ],
      descrip_err: '',
      title_err: '',
      place_err: '',
      price_err:'',
      params: {
        price:'',
        label: '',
        place:'',
        title: '',
        description: '',
        type_num: 0,     //0:失物信息  1:招领信息
        pic_url: new Array(),
        f_time: ''
    },
    tempFilePaths: []
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
        wx.switchTab({
        url: '../HTmine/HTmine',
      });
});}
},
  closePicker(){
    this.setData({
        showPicker: false
    })
},
openPicker(){
  this.setData({
      showPicker: true
  })
},
  onConfirm(event) {
    const { value, index } = event.detail;
    const { params } = this.data;
    params['label'] = value;
    console.log(event.detail);
    this.setData({
        params,
        showPicker: false})
  },

  closePicker2(){
    this.setData({
        showPicker2: false
    })
},
openPicker2(){
  this.setData({
      showPicker2: true
  })
},
  onConfirm2(event) {
    const { value, index } = event.detail;
    const { params } = this.data;
    params['place'] = value;
    console.log(event.detail);
    this.setData({
        params,
        showPicker2: false})
  },
  checkParams(params){
    const { label, title, description, place, f_time } = params;
    let temp = 1;

    //判断发布类型是否为空
    const msg1 = '请选择物品标签'
    const msg2 = '请选择所属地区'
   
    if ( ! label ){
        wx.showToast({
            title: msg1,
            icon: 'none',
            duration: 1000
        });
        temp = 0;
    }
    if ( ! place ){
        wx.showToast({
            title: msg2,
            icon: 'none',
            duration: 1000
        });
        temp = 0;
    }

    //判断描述是否为空
    if(!description){
        this.setData({
            descrip_err: '请填写描述信息'
        });
        temp = 0;
    }

    //判断标题是否为空
    if(!title){
        this.setData({
            title_err: '请填写标题'
        });
        temp = 0;
    }
    return temp;

},
saveMessage(e){
    console.log(e);
    const {type} = e.currentTarget.dataset;
    const { params } = this.data;
    params[type] = e.detail;
    this.setData({
        params,
        phone_err: '',
        descrip_err: '',
        title_err: '',
        address_err: '',
        time_err: ''
    })
},
timeConvert(time){
    const changeTime = num => {
        if(num<10){
            num = `0${num}`;
        }
        return num;
    }
    const y = time.getFullYear();
    let m = time.getMonth()+1;
    let d = time.getDate();
    let h = time.getHours();
    let mm = time.getMinutes();
    let s = time.getSeconds();
    m = changeTime(m);
    d = changeTime(d);
    h = changeTime(h);
    mm = changeTime(mm);
    s = changeTime(s);
    return `${y}-${m}-${d} ${h}:${mm}:${s}`;
},
  toPublish(){
    const { logged } = app.globalData;
    if(logged){
    const { params } = this.data;
    //发布前校验
    const temp = this.checkParams(params);
    if(temp){
        wx.showLoading({
            title: '发布中',
        });
        const { nickName, avatarUrl } = app.globalData.userInfo
        params.userDetail = {
            nickName,
            avatarUrl
        }
        params['pub_time'] = this.timeConvert(new Date());
        console.log(params);
        wx.cloud.callFunction({
            name: 'publish_lost',
            data: params,
            success: res => {
                wx.hideLoading();
                wx.showToast({
                    title: '发布成功',
                    icon: 'success',
                    duration: 1000,
                    success: () => {
                        setTimeout(() => {
                            wx.navigateBack();
                        }, 1000)
                    }
                })
            },
            fail: err => {
                console.log(err);
                wx.hideLoading();
                wx.showToast({
                    title: '发布失败',
                    icon: 'none',
                    duration: 1000,
                    success: () => {
                        setTimeout(() => {
                            wx.navigateBack();
                        }, 1000)
                    }
                })
            }

        })
    }}else{
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
},
doUpload(filePath) {
  const that = this;
  const arr = filePath.split('/');
  const name = arr[arr.length-1];
   // 上传图片
  // const cloudPath = 'goods-pic/my-image' + filePath.match(/\.[^.]+?$/)[0];
  const cloudPath = 'lost-and-found/' + name;

  wx.cloud.uploadFile({
      cloudPath,
      filePath
  }).then(res => {
      console.log('[上传文件] 成功：', res)
      const { params } = that.data;
      const { pic_url } = params;
      pic_url.push(res.fileID);
      params['pic_url'] = pic_url;
      that.setData({
          params
      });
  }).catch(error => {
      console.error('[上传文件] 失败：', error);
       wx.showToast({
          icon: 'none',
          title: '上传失败',
          duration: 1000
      })
  })
},
deletePic(e){
    console.log(e);
    const {index} = e.currentTarget.dataset;
    const {tempFilePaths} = this.data;
    tempFilePaths.splice(index,1);
    this.setData({
        tempFilePaths
    })

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
  chooseImage:function() {
    const that = this;
// 选择图片
    wx.chooseImage({
        count: 3,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: function (res) {
            const filePath = res.tempFilePaths;
            //将选择的图片上传
            filePath.forEach((path, index) => {
                that.doUpload(path);
            });
            const {tempFilePaths} = that.data;
            that.setData({
                tempFilePaths: tempFilePaths.concat(filePath)
            },()=>{
                console.log(that.data.tempFilePaths)
            })
        },
        fail: e => {
            console.error(e)
        }
    })
},
})
