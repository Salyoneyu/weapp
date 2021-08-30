// 云函数入口文件
const cloud = require('wx-server-sdk');
const sd = require('silly-datetime');

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
	const openid = cloud.getWXContext().OPENID;
	const { price, title, description, label, pic_url, place, f_time, type_num, userDetail } = event;
	let { pub_time } = event;
	if(!pub_time){
		pub_time = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
	}
	// const pub_time = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
	const params = {
		price,
		label,
		openid,
		pub_time,
		userDetail,
		place,
		title,
		description,
		type_num,
		pic_url,
		f_time,
		status: 0,
		likeNum: 0
	}
	let add_res = {};
	try{
		await db.collection('goods').add({
		    data: params
		}).then(res=>{
			add_res = res;
		});
	} catch (err) {
		console.log(err);
	}

	return add_res;

}