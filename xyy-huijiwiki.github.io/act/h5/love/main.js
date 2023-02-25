var isPC = true, winSize, token, openid, nickname, headimgurl, debug = true;
var weixinData = {
	init: false,
	loginUrl: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb61fdb0e387cbcc4&redirect_uri=http%3a%2f%2fwww.22dm.com%2fact%2fh5%2flove%2findex.html&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect',
	shareTitle: '甜蜜七夕——嫁人就嫁灰太狼',
	shareDesc: '世界上最遥远的距离是我在你身边，你却在玩手机，甜蜜七夕，双 “机”开启',
	shareLink: 'http://www.22dm.com/act/h5/love/index.html',
	shareImg: 'http://www.22dm.com/act/h5/love/res/icon.jpg'
};
$(function () {
	var height = $(window).height();
	var width = $(window).width();
	isPC = IsPC();
	winSize = { width: 640, height: 1008 };
	if (height > 1008) {
		$("#all").css({
			"top": (height - 1008) >> 1
		});
	}
	if (width > 640) {
		$("#all").css({
			"left": (width - 640) >> 1
		});
	}
	$("#all").show();
	if (getQueryString('share') != null) {
		heartbeat.a = 'share';
		heartbeat.scene = getQueryString('scene');
		heartbeat.nf = decodeURIComponent(getQueryString('nf'));
		heartbeat.nt = decodeURIComponent(getQueryString('nt'));
		heartbeat.shareShow();
		initWxJsSdk(true);
	}
	else { //微信登录
		if (debug) {
			LoveInit();
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
							success: function (response) {
								var r = JSON.parse(response);
								nickname = r.nickname;
								//headimgurl = r.headimgurl != "" ? r.headimgurl : 'http://www.22dm.com/act/h5/love/res/icon.jpg';
								LoveInit();
								initWxJsSdk(false);
							}
						});
					}
				}
			});
		}
	}
});
var dialogs = {
	open: function (tag) {
		dialogs.empty();
		$("#dialogs #" + tag).show().parent().fadeIn();
	},
	close: function () {
		$("#dialogs").fadeOut();
	},
	empty: function () {
		$("#dialogs").hide().children().hide();
	}
};

cc.game.onStart = function () {
	console.info(heartbeat.a + " : entry");
	heartbeat.loadcount = 0;
	if (heartbeat.a == "player_two") {
		if (heartbeat.scene == 1)
			heartbeat.loadres = g_resources_female_two;
		else
			heartbeat.loadres = g_resources_male_two;
		heartbeat.loadtag = 'dialogs_guide_3';
	}
	else {
		heartbeat.nf = nickname;
		heartbeat.loadres = g_resources_index;
		heartbeat.loadtag = 'dialogs_guide_1';

	}
	dialogs.open(heartbeat.loadtag);
	loadGamePlayResources();
};
function LoveInit() {
	var flag = decodeURIComponent(getQueryString("state"));
	if (flag != 'STATE' && flag != "null") {  //玩家二 获取state参数 拿到roomId 跟 scene
		var roomId = getQueryString2('roomId', flag);
		var scene = getQueryString2('scene', flag);
		heartbeat.nt = nickname;
		heartbeat.a = 'player_two';
		heartbeat.scene = scene;
		heartbeat.roomId = roomId;
		heartbeat.player = 2;
		heartbeat.state = 2;
		player_two.sendStatu(); //发送扫码状态 以及用户名
	}
	cc.game.run();
	registerEvent();
}

function registerEvent() {
	$("#btn_begin").click(function () {
		$(this).unbind("click");
		cc.director.runScene(new GamePlayScene(heartbeat.scene, heartbeat.player));
		dialogs.close();
	});
	$("#btn_ok").click(function () {
		$(this).unbind("click");
		cc.director.runScene(new MainMenuScene());
		dialogs.close();
	});
	$("#btn_share").click(function () {
		$("#share_tip").fadeIn();
	});
}

function loadGamePlayResources() {
	cc.loader.load(heartbeat.loadres[heartbeat.loadcount], function (err) {
		//console.info(heartbeat.loadres[heartbeat.loadcount]+" :finish");
		if (heartbeat.loadcount >= heartbeat.loadres.length - 1) { //全部加载完毕
			heartbeat.loadResFinish();
		}
		else {
			heartbeat.loadcount++;
			var loading = $("#" + heartbeat.loadtag + " .precent_main");
			var precent = (heartbeat.loadcount / (heartbeat.loadres.length - 1)).toFixed(2);
			var width = precent * 200;
			$("#" + heartbeat.loadtag + " .precent_word").text(Math.ceil(precent * 100) + "%");
			if (!$(loading).is(":animated"))
				loading.animate({ width: 220 * heartbeat.loadcount / (heartbeat.loadres.length - 1) + "px" });
			else
				loading.stop().animate({ width: 220 * heartbeat.loadcount / (heartbeat.loadres.length - 1) + "px" });
			loadGamePlayResources();
		}
	});
}


function IsPC() {
	var userAgentInfo = navigator.userAgent;
	var Agents = ["Android", "iPhone",
		"SymbianOS", "Windows Phone",
		"iPad", "iPod"];
	var flag = true;
	for (var v = 0; v < Agents.length; v++) {
		if (userAgentInfo.indexOf(Agents[v]) > 0) {
			flag = false;
			break;
		}
	}
	return flag;
}
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return (r[2]); return null;
}
function getQueryString2(name, link) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = link.match(reg);
	if (r != null) return (r[2]); return null;
}
function initWxJsSdk(doChange) {
	$.ajax({
		cache: false,
		async: false,
		type: "POST",
		url: '/act/getWeiXinToken.ashx',
		data: {
			thisUrl: (location.href.split('#')[0])
		},
		success: function (res) {
			console.info(res);
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
			title: weixinData.shareDesc,
			link: weixinData.shareLink,
			imgUrl: weixinData.shareImg,
			success: function () {

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

			},
			cancel: function () {
				console.info("onMenuShareAppMessage cancel");
			}
		});
		if (doChange) {
			changeWxJsSdk();
		}
	});
}
function changeWxJsSdk() {
	wx.onMenuShareTimeline({
		title: '最远的距离不是银河宽度，而是两个手机屏幕，看' + heartbeat.nf + '给' + heartbeat.nt + '的浪漫表白',
		link: weixinData.shareLink + "?share=1&scene=" + heartbeat.scene + "&nf=" + encodeURIComponent(heartbeat.nf) + "&nt=" + encodeURIComponent(heartbeat.nt),
		imgUrl: weixinData.shareImg,
		success: function () {

		},
		cancel: function () {
			console.info("onMenuShareTimeline cancel");
		}
	});
	wx.onMenuShareAppMessage({
		title: weixinData.shareTitle,
		desc: '最远的距离不是银河宽度，而是两个手机屏幕，看' + heartbeat.nf + '给' + heartbeat.nt + '的浪漫表白',
		link: weixinData.shareLink + "?share=1&scene=" + heartbeat.scene + "&nf=" + encodeURIComponent(heartbeat.nf) + "&nt=" + encodeURIComponent(heartbeat.nt),
		imgUrl: weixinData.shareImg,
		success: function () {

		},
		cancel: function () {
			console.info("onMenuShareAppMessage cancel");
		}
	});

}



