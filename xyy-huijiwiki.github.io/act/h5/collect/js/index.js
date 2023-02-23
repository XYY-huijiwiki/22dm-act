var token, openid, debug = true;
var weixinData = {
	loginUrl: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb61fdb0e387cbcc4&redirect_uri=http%3a%2f%2fwww.22dm.com%2fact%2fh5%2fcollect%2findex.html&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect',
	shareTitle: '嘻哈闯世界3，“募”名而来',
	shareDesc: '一起嘻嘻哈哈闯世界！《嘻哈闯世界3》的名字由你说了算！现在参与赢羊村大奖！',
	shareLink: 'http://www.22dm.com/act/h5/collect/index.html',
	shareImg: 'http://www.22dm.com/act/h5/collect/images/icon.jpg'
};
var userInfo = {
	openid: "test_act_id_26",
	name: "test",
	sex: "",
	country: "",
	province: "",
	timespan: 0,
	json: { "info": {}, "collect": [] },   //我填写过的信息
	hasPrize: false,
	award: false,
	prize: 0
};
$(function () {
	var width = $(window).width();
	var height = $(window).height();
	if (width > 640)
		$("#all").css("left", (width - 640) >> 1);
	if (height > 1008)
		$("#all").css("top", (height - 1008) >> 1);
	if (getQueryString("code") == null) {
		init();
		// location.href = weixinData.loginUrl;
	}
	else {
		$.ajax({
			cache: false,
			async: false,
			type: "POST",
			url: '/act/center/openIdCrossDomain.ashx',
			data: {
				"type": "GET",
				"url": 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=wxb61fdb0e387cbcc4&secret=2de4747ccccb04312e71e86708bfec66&code=' + getQueryString("code") + '&grant_type=authorization_code'
			},
			success: function (response) {
				var result = JSON.parse(response);
				token = result.access_token;
				openid = result.openid;
				if (typeof (openid) == "undefined") {
					location.href = weixinData.loginUrl;
				}
				else {
					$.ajax({
						cache: false,
						async: false,
						type: "POST",
						url: '/act/center/openIdCrossDomain.ashx',
						data: {
							"type": "GET",
							"url": 'https://api.weixin.qq.com/sns/userinfo?access_token=' + token + '&openid=' + openid + '&lang=zh_CN',
						},
						success: function (res) {
							var r = JSON.parse(res);
							userInfo.openid = openid;
							console.info(userInfo.openid);
							init();
						}
					});
				}
			}
		});

	}
});

function init() {
	$(".layer_open").click(function () {
		var tar = '#' + $(this).attr("tar");
		$(tar).fadeIn();
	});
	$(".layer_close").click(function () {
		$(this).parent().hide();
	});
	$("#dialogs_close").click(function () {
		$("#dialogs").fadeOut();
	});
	$("#award_check,#award_check_top").click(function () {
		if (userInfo.hasPrize) {
			if (!userInfo.award) {
				if (userInfo.prize == 1) {
					$("#award").fadeIn();
				}
				else if (userInfo.prize == 11) {
					$("#dialogs_tips").empty().html('恭喜你获得了50元天猫优惠券<br/><a href="https://taoquan.taobao.com/coupon/unify_apply.htm?sellerId=2473210771&activityId=99e199c1725c4795a6e8aaa7d7d4d72f">点击此处前往领取</a>').parent().parent().fadeIn();
				}
			}
			else {
				$("#dialogs_tips").empty().html('<br/>你已经填写过获奖信息！').parent().parent().fadeIn();
			}
		}
		else {
			$("#dialogs_tips").empty().html('<br/>本次活动你没有上榜！').parent().parent().fadeIn();
		}
	});
	// $.ajax({
	// 	cache: false,
	// 	async: false,
	// 	type: "POST",
	// 	url: 'collect.ashx',
	// 	data: {
	// 		type: "ranking",
	// 		user: userInfo.openid
	// 	},
	// 	success: function (res) {
	// 		console.info(res);
	// 		var data = JSON.parse(res);
	// 		userInfo.hasPrize = data.hasPrize;
	// 		userInfo.prize = data.prize;
	// 		userInfo.award = data.award;
	// 		initWxJsSdk();
	// 	}
	// });
	let data = {
		"hasPrize": false,
		"prize": 0,
		"award": false
	};
	userInfo.hasPrize = data.hasPrize;
	userInfo.prize = data.prize;
	userInfo.award = data.award;
}
var award = {
	check: function () {
		$("#award_tips").empty();
		var name = $("#award_name").val();
		var tel = $("#award_tel").val();
		var address = $("#award_address").val().replace(/\s/g, "");
		var result = "";
		if (name == "") {
			result = "请填写收件人姓名！";
		}
		else if (tel.length != 11) {
			result = "请填写11位收件人手机号码！";
		}
		else if (address == "" || address.length < 8) {
			result = "请填写详细的收件人地址！";
		}
		if (result == "") { //都正确
			var date = new Date();
			var addtime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
			var info = '{"name":"' + name + '","tel":"' + tel + '","address":"' + address + '","addtime":"' + addtime + '","prize":' + userInfo.prize + '}';
			award.post(info);
		}
		else {
			$("#dialogs_tips").empty().html('<br/>' + result).parent().parent().fadeIn();
			return false;
		}
	},
	post: function (info) {
		$.ajax({
			cache: false,
			async: false,
			type: "POST",
			url: 'collect.ashx',
			data: {
				"type": "award",
				"user": userInfo.openid,
				"json": info
			},
			success: function (response) {
				console.info(response);
				var result = JSON.parse(response);
				$("#dialogs_tips").empty().html(result.returnStr).parent().parent().fadeIn();
				if (result.success)
					userInfo.award = true;
			}
		});
	}
};
function initWxJsSdk() {
	$.ajax({
		cache: false,
		async: false,
		type: "POST",
		url: '/act/getWeiXinToken.ashx',
		data: {
			thisUrl: (location.href.split('#')[0])
		},
		success: function (res) {
			var wxData = JSON.parse(res);
			wx.config({
				debug: false,
				appId: wxData.appId,
				timestamp: wxData.timestamp,
				nonceStr: wxData.nonceStr,
				signature: wxData.signature,
				jsApiList: [
					'onMenuShareTimeline',
					'onMenuShareAppMessage'
				]
			});
		}
	});
	wx.ready(function () {
		wx.onMenuShareTimeline({
			title: weixinData.shareTitle,
			link: weixinData.shareLink,
			imgUrl: weixinData.shareImg,
			success: function () {
				console.info("onMenuShareTimeline ok");

			},
			cancel: function () {
				console.info("onMenuShareTimeline cancel");
			}
		});
		wx.onMenuShareAppMessage({
			title: weixinData.shareTitle,
			desc: weixinData.shareDesc,
			link: weixinData.shareLink,
			imgUrl: weixinData.shareImg,
			success: function () {
				console.info("onMenuShareTimeline ok");
			},
			cancel: function () {
				console.info("onMenuShareAppMessage cancel");
			}
		});
	});
}

function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return (r[2]); return null;
}
