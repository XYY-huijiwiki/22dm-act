var isPC = false, token, openid, debug = true, act_id = 30;
var weixinData = {
	init: false,
	loginUrl: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb61fdb0e387cbcc4&redirect_uri=http%3a%2f%2fwww.22dm.com%2fact%2fh5%2fsingle%2findex.html&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect',
	shareTitle: '谁动了我的红莉',
	shareDesc: '“虐狗”还是“当狗”，就在你的一念之间.....',
	shareLink: 'http://www.22dm.com/act/h5/single/index.html',
	shareImg: 'http://www.22dm.com/act/h5/single/res/icon.jpg'
};
var userInfo = {
	openid: "test_act_id_28",
	name: "test",
	face: "res/icon.jpg",
	sex: "1",
	country: "GuangZhou",
	province: "GuangDong",
	score: 0,
	rankingList: [],
	hightest: 0
};
var winSize = {
	width: 640,
	height: 1008,
	CreatEach: 4,
	CreatCount: 0,
	RunSpeed: 7.5,
	RolePotintGroup: [],
	MovePotintGroup: [],
	beginX: 470,
	beginY: 150,
	audioVolume: 0.8,        //音量
	LevelDelayTime: 5,
	MoveOffset: 152
};
var dialogs = {
	loadcount: 0,
	loadres: [],
	loadtag: "dialogs_preload",
	precentWidth: 200,
	open: function (tag) {
		dialogs.empty();
		$("#dialogs #" + tag).show().parent().fadeIn();
	},
	close: function () {
		$("#dialogs").fadeOut();
	},
	empty: function () {
		$("#dialogs").hide().children().hide();
	},
	loadResFinish: function () {
		cc.spriteFrameCache.addSpriteFrames(res.public_btn_plist, res.public_btn_png);
		var tmx = new cc.TMXTiledMap(res.gp_map_tmx);
		var tmxPoint_1 = tmx.getObjectGroup("point_1").getObjects();
		var tmxPoint_2 = tmx.getObjectGroup("point_2").getObjects();
		var tmxPoint_3 = tmx.getObjectGroup("point_3").getObjects();
		var tmxRun = tmx.getObjectGroup("run").getObjects();
		for (var i = 0; i < tmxPoint_1.length; i++) {
			var tmp = [];
			tmp.push({ x: tmxPoint_1[i].x, y: tmxPoint_1[i].y });
			tmp.push({ x: tmxPoint_2[i].x, y: tmxPoint_2[i].y });
			tmp.push({ x: tmxPoint_3[i].x, y: tmxPoint_3[i].y });
			winSize.RolePotintGroup.push(tmp);
		}
		for (var i = 0; i < tmxRun.length; i++) {
			if (i == 0)
				winSize.MovePotintGroup.push({ x: tmxRun[i].x - winSize.beginX, y: tmxRun[i].y - winSize.beginY });
			else
				winSize.MovePotintGroup.push({ x: tmxRun[i].x - tmxRun[i - 1].x, y: tmxRun[i].y - tmxRun[i - 1].y });
		}
		//console.info(winSize.MovePotintGroup);
		cc.director.runScene(new MainMenuScene());
		//cc.director.runScene(new GamePlayScene(true));
		var data = {
			theme: 0,
			score: 10
		};
		//cc.director.runScene(new GameResultScene(data));
		dialogs.close();
	},
	getTheme: function (score) {
		if (score < 5)
			return 0;
		else if (score <= 10)
			return 1;
		else if (score <= 20)
			return 2;
		else
			return 3;
	},
	ranking: {
		getRankingList: function () {
			// $.ajax({
			// 	cache: false,
			// 	async: false,
			// 	type: "POST",
			// 	url: '/act/h5/deep/doDeepScore.ashx',
			// 	data: {
			// 		"act_id": act_id,
			// 		"init": "1",
			// 		"user": userInfo.openid
			// 	},
			// 	success: function (response) {
			// 		console.info(response);
			// 		var result = JSON.parse(response);
			// 		userInfo.hightest = result.score;
			// 		userInfo.rankingList = result.scoreList;
			// 		dialogs.ranking.addRankingList();
			// 	}
			// });
			let result = {
				"time": "2023-02-26",
				"score": "10",
				"count": "0",
				"scoreList": [
					{
						"user": "oTaiPuLyns1CePoNhAWp7k0-hif8",
						"count": "0",
						"json": {
							"addtime": "2017-11-18",
							"score": "238",
							"name": "地球嘉年华",
							"img": "http://wx.qlogo.cn/mmopen/vi_32/bX9WaUqyuc7Ax75ybbSnFmovKG8vux5cEOJugZJQo9VPNibrwlyHS7QsXDPGdRDMdPsc3Lxm9HpLt3QNZ7OWbtA/0",
							"sex": "1",
							"country": "中国",
							"province": "广东"
						}
					},
					{
						"user": "oTaiPuJcjhMH6IK7aSg2LuYGranw",
						"count": "0",
						"json": {
							"addtime": "2017-11-23",
							"score": "80",
							"name": "老灰",
							"img": "http://wx.qlogo.cn/mmopen/vi_32/2S22Cd5tuS0HGGpqjFZiankMHf8C6Ie6nsTlD2m0ZgAcTen3Ulox3icZxHFfObw8FOmbu5Tqyq2fS0aod8lNdFSA/0",
							"sex": "1",
							"country": "中国",
							"province": "浙江"
						}
					},
					{
						"user": "oTaiPuJ8_WpO68MoVrdIIAT12x-M",
						"count": "0",
						"json": {
							"addtime": "2018-04-27",
							"score": "77",
							"name": "飞翔",
							"img": "http://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83eoyneYaD7xrcrxMU8DeeLbCyANwMAibOjFcWbBTzUJVNHMvCAkREOB7ryOayuoiadbwcBtIOqTYuqnA/132",
							"sex": "1",
							"country": "中国",
							"province": ""
						}
					},
					{
						"user": "oTaiPuPShCwKl1S2YVnQdKqdoRJQ",
						"count": "0",
						"json": {
							"addtime": "2017-11-20",
							"score": "73",
							"name": "圣铃楠魂",
							"img": "http://wx.qlogo.cn/mmopen/vi_32/Hh8WLAAQCzCBDhiaUicsjYv7uQss7HSUteH25SBygSHJICiacUGZs3u5eurSP73F5ewtGDH7GVkIUSicu8zJzjFFlw/0",
							"sex": "0",
							"country": "",
							"province": ""
						}
					},
					{
						"user": "oTaiPuPCw7m3hZxN0XNy4JuFJuZ4",
						"count": "0",
						"json": {
							"addtime": "2018-01-29",
							"score": "65",
							"name": "土豆",
							"img": "http://wx.qlogo.cn/mmopen/vi_32/zntp4opmJ8XBrlIuVlMWicFpK0j08CbPelOFvFTtr3KicSLNibUTdQQXcKyh1MnEkf2qZbaCXxNuQeJ66TpAzNjtQ/132",
							"sex": "1",
							"country": "中国",
							"province": "四川"
						}
					},
					{
						"user": "oTaiPuGLjPcGG_vm2OnFyoWwiWzA",
						"count": "0",
						"json": {
							"addtime": "2017-11-13",
							"score": "61",
							"name": "LEE",
							"img": "http://wx.qlogo.cn/mmopen/vi_32/gO7LltVVLYzLFTP2xEkcPo6BILOLcBRDOsZPqGLicWXHnc2KsKsgumjc3DiaI6wCiadt3Hdib1YzexUFCyXaQXcVrw/0",
							"sex": "1",
							"country": "冰岛",
							"province": ""
						}
					},
					{
						"user": "oTaiPuL5ofd6vH8_8zBJOFpDEGMA",
						"count": "0",
						"json": {
							"addtime": "2017-11-13",
							"score": "57",
							"name": "熊",
							"img": "http://wx.qlogo.cn/mmopen/vi_32/FLJF3bOibHxMIvxmyDNm2DibZrvFxClpicBjvKY2TVgADos7mcpooTCBSicdrIicAUNqyPGibGtgPP7ac4rkHfDc0dXA/0",
							"sex": "1",
							"country": "奥地利",
							"province": "克恩顿"
						}
					},
					{
						"user": "oTaiPuD92UDG8btLPrITlHV5IZe0",
						"count": "0",
						"json": {
							"addtime": "2017-11-17",
							"score": "56",
							"name": "天天开心",
							"img": "http://wx.qlogo.cn/mmopen/vi_32/EL7iaV7AsQf0icd4hDGY3veMZLXgI2N1klGuXibicj2uGEoroSmgiaveKrqInVK3gfgj7oOGttqt3EW5GN2luOGGm3Q/0",
							"sex": "2",
							"country": "中国",
							"province": "四川"
						}
					},
					{
						"user": "oTaiPuInv9Ofos_PVJ46YHYDsvpk",
						"count": "0",
						"json": {
							"addtime": "2017-11-18",
							"score": "56",
							"name": "小宣",
							"img": "http://wx.qlogo.cn/mmopen/vi_32/h1pRAImuWpicSREvgHs9vXnk100vnxibZiaPZ1k5WBib9CcG7PxA0Ey3Caqmz2eMY3utuwT7eU3ux99ibApJBYIo3Bw/0",
							"sex": "1",
							"country": "中国",
							"province": "黑龙江"
						}
					},
					{
						"user": "oTaiPuLNx4QWCpzMcBm9amin020w",
						"count": "0",
						"json": {
							"addtime": "2017-12-28",
							"score": "55",
							"name": "超人联盟",
							"img": "http://wx.qlogo.cn/mmopen/vi_32/DbDFxGCC4Mwe9YDd0Q9yRA068HBN8thgBV4a0j7dicaIliasDX2cF4nIN7TWXd8YibmGjzWYCicb6y984tSkicBxPVw/0",
							"sex": "0",
							"country": "",
							"province": ""
						}
					}
				]
			};
			userInfo.hightest = result.score;
			userInfo.rankingList = result.scoreList;
			dialogs.ranking.addRankingList();
		},
		addRankingList: function () {
			var html = '';
			var list = userInfo.rankingList;
			for (var i = 0; i < list.length; i++) {//增加记录
				html += '<li><img class="p_image" src="' + list[i].json.img + '" width="130" height="130" /><a class="p_name">' + list[i].json.name + '</a><a class="p_time">' + list[i].json.addtime + '</a><a class="p_score">' + list[i].json.score + '分</a><a class="' + ((i < 3 ? 'p_above' : 'p_behind')) + '"><img src="res/images/number/p_' + (i + 1) + '.png"/></a></li>';
			}
			$("#ranking").empty().append(html);
		},
		addScore: function (score) {
			var json = '{"addtime":"str_addtime","score":"' + score + '","name":"' + userInfo.name + '","img":"' + userInfo.face + '","sex":"' + userInfo.sex + '","country":"' + userInfo.country + '","province":"' + userInfo.province + '"}';
			console.info(json);
			userInfo.hightest = score;
			$.ajax({
				cache: false,
				async: false,
				type: "POST",
				url: '/act/h5/deep/doDeepScore.ashx',
				data: {
					"act_id": act_id,
					"init": "0",
					"type": "add",
					"user": userInfo.openid,
					"score": score,
					"json": json
				},
				success: function (response) {
					console.info('更新记录成功');
					dialogs.ranking.getRankingList();
				}
			});
		}
	}
};
$(function () {
	var height = $(window).height();
	var width = $(window).width();
	isPC = IsPC();
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
	LoveInit();
});

cc.game.onStart = function () {
	dialogs.loadres = g_resources;
	dialogs.loadcount = 0;
	dialogs.open(dialogs.loadtag);
	loadGameResources();
};
function LoveInit() {
	if (!debug) {
		if (getQueryString("code") == null) {
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
						userInfo.openid = openid;
						// $.ajax({
						// 	cache: false,
						// 	async: false,
						// 	type: "POST",
						// 	url: '/act/center/openIdCrossDomain.ashx',
						// 	data: {
						// 		"type": "GET",
						// 		"url": 'https://api.weixin.qq.com/sns/userinfo?access_token=' + token + '&openid=' + openid + '&lang=zh_CN',
						// 	},
						// 	success: function (res) {
						// 		var r = JSON.parse(res);
						// 		userInfo.name = r.nickname;
						// 		userInfo.face = r.headimgurl != "" ? r.headimgurl : 'http://www.22dm.com/act/h5/xiha/res/icon.jpg';
						// 		userInfo.sex = r.sex;
						// 		userInfo.country = r.country;
						// 		userInfo.province = r.province;
						// 		cc.game.run();
						// 		dialogs.ranking.getRankingList();
						// 		initWxJsSdk();
						// 		registerEvent();
						// 	}
						// });

						cc.game.run();
						dialogs.ranking.getRankingList();
						initWxJsSdk();
						registerEvent();
					}
				}
			});

		}
	}
	else {
		cc.game.run();
		dialogs.ranking.getRankingList();
		registerEvent();
		//dialogs.open("dialogs_ranking");
	}
}

function registerEvent() {
	$(".dialogs_close,#dialogs_share").click(function () {
		dialogs.close();
	});
}
function loadGameResources() {
	cc.loader.load(dialogs.loadres[dialogs.loadcount], function (err) {
		if (dialogs.loadcount >= dialogs.loadres.length - 1) { //全部加载完毕
			dialogs.loadResFinish();
		}
		else {
			dialogs.loadcount++;
			var loading = $("#" + dialogs.loadtag + " .precent_main");
			var precent = (dialogs.loadcount / (dialogs.loadres.length - 1)).toFixed(2);
			var width = precent * dialogs.precentWidth;
			$("#" + dialogs.loadtag + " .precent_word").text(Math.ceil(precent * 100) + "%");
			if (!$(loading).is(":animated"))
				loading.animate({ width: (dialogs.precentWidth + 20) * dialogs.loadcount / (dialogs.loadres.length - 1) + "px" });
			else
				loading.stop().animate({ width: (dialogs.precentWidth + 20) * dialogs.loadcount / (dialogs.loadres.length - 1) + "px" });
			loadGameResources();
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
			});
		}
	});
}


