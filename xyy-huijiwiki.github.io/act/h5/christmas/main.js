var isPC = false, token, openid, debug = true, act_id = 32;
var weixinData = {
	init: false,
	loginUrl: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb61fdb0e387cbcc4&redirect_uri=http%3a%2f%2fwww.22dm.com%2fact%2fh5%2fchristmas%2findex.html&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect',
	shareTitle: '遗失的铃铛',
	shareDesc: '遗失的 “铃铛”再升级，新春好礼送不停！',
	shareLink: 'http://www.22dm.com/act/h5/christmas/index.html',
	shareImg: 'http://www.22dm.com/act/h5/christmas/res/Public/icon.jpg'
};
var userInfo = {
	openid: "oTaiPuEUqBR9FQRGw5hvR0oyOAWo",
	name: "test",
	face: "res/Public/icon.jpg",
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
	TmxWidth: 1560,
	TmxHeight: 780,
	GameTime: 18,
	ArtInterfere: [1, 2, 11, 15, 16, 17, 18, 19, 20, 22, 24, 28, 37, 38],
	ArtLevel: [[2, 5, 8], [3, 6, 9], [4, 8, 12]],
	ArtSequence: [],
	ArtRows: 6,
	ArtColumn: 7,
	ArtMargin: 30,
	CCricle: 100,
	isFirstTime: true,
	TimerAdd: 5,
	TimerMax: 2,
	ProbabilityRearrange: 0.5,
	ProbabilityBrother: 0.5,
	ProbabilityTimer: 0.85
};
var dialogs = {
	loadcount: 0,
	loadres: [],
	loadtag: "dialogs_preload",
	precentWidth: 200,
	open: function (tag, isClose) {
		if (isClose === undefined) {
			dialogs.empty();
			$("#dialogs #" + tag).show().parent().fadeIn();
		}
		else {
			$("#dialogs #" + tag).fadeIn();
		}
	},
	close: function () {
		dialogs.empty();
		$("#dialogs").fadeOut();
	},
	empty: function () {
		$("#dialogs").hide().children().hide();
	},
	loadResFinish: function () {
		cc.spriteFrameCache.addSpriteFrames(res.gp_role_plist, res.gp_role_png);
		cc.director.runScene(new MainMenuScene());
		// {
		// 	winSize.GameTime = 3600;
		// 	winSize.currSkill = 100;
		// 	winSize.ProbabilityTimer = 0;
		// 	cc.director.runScene(new GamePlayScene());
		// }
		var data = {
			score: 2400,
			theme: 0,
		};
		//cc.director.runScene(new GameResultScene(data));
		dialogs.close();
		//dialogs.open("dialogs_ranking");
	},
	getTheme: function (score) {
		if (score <= 2500)
			return 0;
		else if (score <= 5000)
			return 1;
		else if (score <= 10000)
			return 2;
		else if (score <= 20000)
			return 3;
		else if (score <= 40000)
			return 4;
		else
			return 5;
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
			// 		//console.info(response);
			// 		var result = JSON.parse(response);
			// 		userInfo.hightest = result.score;
			// 		userInfo.rankingList = result.scoreList;
			// 		dialogs.ranking.addRankingList();
			// 	}
			// });
			let result = {
				"time": "2023-02-27",
				"score": "43900",
				"count": "0",
				"scoreList": [
					{
						"user": "oTaiPuLyns1CePoNhAWp7k0-hif8",
						"count": "0",
						"json": {
							"addtime": "2017-12-22",
							"score": "333400",
							"name": "喜糖( ^ω^)",
							"img": "http://wx.qlogo.cn/mmopen/vi_32/bX9WaUqyuc7Ax75ybbSnFmovKG8vux5cEOJugZJQo9VPNibrwlyHS7QsXDPGdRDMd6o6nWucuEWF29pUxAZdcVQ/0",
							"sex": "1",
							"country": "中国",
							"province": "广东"
						}
					},
					{
						"user": "oTaiPuK9efbPXEDaezQE8H6QsFRo",
						"count": "0",
						"json": {
							"addtime": "2017-12-22",
							"score": "228500",
							"name": "0803小侦探喜羊羊",
							"img": "http://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqPSDAaVSJibHt7x4cPuMtyOZ3MlTAwGSFmRmSqicqXRRku90jibLQrbgh74dFEvezAnmiavCO8lfPbcA/0",
							"sex": "0",
							"country": "",
							"province": ""
						}
					},
					{
						"user": "oTaiPuKkYO2uED10GQyGw9-64KEI",
						"count": "0",
						"json": {
							"addtime": "2017-12-22",
							"score": "140300",
							"name": "疯狂帝国",
							"img": "http://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83ep8O159MOZpZBb4MHTAuWJkwPkR5xHg7Tom2kicdZezEKCqDiblGmAQPKA6HZD4j149onibN4CxMicGuA/0",
							"sex": "0",
							"country": "",
							"province": ""
						}
					},
					{
						"user": "oTaiPuJcjhMH6IK7aSg2LuYGranw",
						"count": "0",
						"json": {
							"addtime": "2017-12-22",
							"score": "79800",
							"name": "老灰",
							"img": "http://wx.qlogo.cn/mmopen/vi_32/2S22Cd5tuS0HGGpqjFZiankMHf8C6Ie6nsTlD2m0ZgAcTen3Ulox3icZxHFfObw8FOaFxoFz5EicANELI62icDLFRg/0",
							"sex": "1",
							"country": "中国",
							"province": "浙江"
						}
					},
					{
						"user": "oTaiPuJYKEeZh8pPznfOEFhA5GfM",
						"count": "0",
						"json": {
							"addtime": "2017-12-21",
							"score": "44900",
							"name": "羊羊乐儿",
							"img": "http://wx.qlogo.cn/mmopen/vi_32/CDdMOiayCMfL84tc6xMdMnZ2lPHXjhdghciaCTiaP32d8bgbmsTqmXrkIAMWRSCXwvSlZft4hSiabfTHkYYopn2bIQ/0",
							"sex": "1",
							"country": "中国",
							"province": "湖北"
						}
					},
					{
						"user": "oTaiPuOGP2U8ALTOHpdpEE8PtPZQ",
						"count": "0",
						"json": {
							"addtime": "2018-01-21",
							"score": "43900",
							"name": "小康",
							"img": "http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLZoI5olaqlJDJ5mXIffzRLJEkftNaAjE4fGMKETajILzgrQTHFqldCAPaBJDAt5jN4Vb31wW6PpA/132",
							"sex": "0",
							"country": "",
							"province": ""
						}
					},
					{
						"user": "oTaiPuK5w_NcLpU2JDdsWvNdqkU4",
						"count": "0",
						"json": {
							"addtime": "2018-01-28",
							"score": "39900",
							"name": ".",
							"img": "http://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eopYeYuCR1U7cyrsqQb5yWJdib5WZNcZt5UglhibYXkGaxEodbniaF5icdrzDYm1BGiaIseoV4PWsspVLA/132",
							"sex": "1",
							"country": "",
							"province": ""
						}
					},
					{
						"user": "oTaiPuHhvt5SUxXCCVdY6k-eU8fw",
						"count": "0",
						"json": {
							"addtime": "2017-12-21",
							"score": "30700",
							"name": "柯南",
							"img": "http://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83ercf4cXbep198pmTkEK2NAZSEptqx6eWIFPkvDchBiaBXX8IlOeVW811o0MuibmycP1qDK5DVsuqtIA/0",
							"sex": "0",
							"country": "",
							"province": ""
						}
					},
					{
						"user": "oTaiPuEUqBR9FQRGw5hvR0oyOAWo",
						"count": "0",
						"json": {
							"addtime": "2017-12-21",
							"score": "29300",
							"name": "lllzc",
							"img": "http://wx.qlogo.cn/mmopen/vi_32/wpMrYfXQAg7ibgJZ8zHSS5FetEzic3zZaWPEKd7CKofzcbqnxX7lLV3sf2K2BPblJSJFCaHL5k5bkH16FuCejwVQ/0",
							"sex": "1",
							"country": "中国",
							"province": "广东"
						}
					},
					{
						"user": "oTaiPuN71vQYfruyJdslKtfoRSmw",
						"count": "0",
						"json": {
							"addtime": "2017-12-25",
							"score": "26500",
							"name": "D",
							"img": "http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLITbMk2VjoicW6n2VwgPq0aMHzFicNOJHMeicztggCU0FPuJ35FWN7HKibrFcoYlCwKys1eKb4aibbb5Q/0",
							"sex": "1",
							"country": "中国",
							"province": "广东"
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
				html += '<li><img class="p_image" src="' + list[i].json.img + '" width="85" height="85" /><a class="p_mask"></a><a class="p_name">' + list[i].json.name + '</a><a class="p_time">' + list[i].json.addtime + '</a><a class="p_score">' + list[i].json.score + '分</a><a class="p_above"><img src="res/Public/number/p_' + (i + 1) + '.png"/></a></li>';
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
		},
		getPrize: function () {
			var time = new Date();
			var now = time.getTime();
			if (now > Date.parse("2018/02/01 00:00:00")) {
				var hasPrize = false;
				for (var i = 0; i < userInfo.rankingList.length; i++) {
					if (userInfo.rankingList[i].user == userInfo.openid) {
						hasPrize = true;
					}
				}
				if (hasPrize) {
					award.open();
				}
				else {
					alert('您本次没有上榜哦!');
					return false;
				}
			}
			else {
				alert('排行榜截止于2018-01-31,请于结束后再来领取奖品!');
				return false;
			}
		}
	},
	startGame: function () {
		GameManager.restart();
		dialogs.close();
		cc.director.runScene(new GamePlayScene());
	}
};
$(function () {
	var height = $(window).height() > 1300 ? 1180 : $(window).height();
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
	GameLogin();
});

cc.game.onStart = function () {
	dialogs.loadres = g_resources;
	dialogs.loadcount = 0;
	dialogs.open(dialogs.loadtag);
	loadGameResources();
};
function GameLogin() {
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
								userInfo.name = r.nickname;
								userInfo.face = r.headimgurl != "" ? r.headimgurl : 'http://www.22dm.com/act/h5/xiha/res/icon.jpg';
								userInfo.sex = r.sex;
								userInfo.country = r.country;
								userInfo.province = r.province;
								cc.game.run();
								dialogs.ranking.getRankingList();
								initWxJsSdk();
								registerEvent();
							}
						});
					}
				}
			});

		}
	}
	else {
		cc.game.run();
		dialogs.ranking.getRankingList();
		registerEvent();
	}
}

function registerEvent() {
	$(".dialogs_close,#dialogs_share").click(function () {
		dialogs.close();
	});
	$(".dialogs_close_self").click(function () {
		$(this).parent().fadeOut();
	});
	$("#wallpaper_list li a").click(function () {
		var number = $(this).attr("number");
		$("#download_img").attr("src", "res/Public/wallpaper/" + number + ".jpg");
		dialogs.open("dialogs_download", false);
	});
	$("#download_close").click(function () {
		$(this).parent().parent().hide();
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
var award = {
	check: function (user) {
		$("#award_tips").empty();
		var name = $("#award_name").val();
		var tel = $("#award_tel").val();
		var address = $("#award_address").val();
		var result = "";
		if (name == "") {
			result = "请输入收件人姓名!";
		}
		else if (tel.length != 11) {
			result = "请输入11位收件人手机号码!";
		}
		else if (address == "" || address.length < 8) {
			result = "请输入详细的收件人地址!";
		}
		if (result == "") { //都正确
			var date = new Date();
			var addtime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
			var info = '{"name":"' + name + '","tel":"' + tel + '","address":"' + address + '","addtime":"' + addtime + '"}';
			award.post(info);
		}
		else {
			$("#award_tips").text(result);
			return false;
		}
	},
	post: function (info) {
		// $.ajax({
		// 	cache: false,
		// 	async: false,
		// 	type: "POST",
		// 	url: '/act/h5/deep/doDeepScore.ashx',
		// 	data: {
		// 		"act_id": act_id,
		// 		"init": "0",
		// 		"type": "award",
		// 		"user": userInfo.openid,
		// 		"info": info
		// 	},
		// 	success: function (response) {
		// 		var result = JSON.parse(response);
		// 		if (result.success) {
		// 			alert(result.returnStr);
		// 		}
		// 		else {
		// 			alert(result.returnStr);
		// 		}
		// 	}
		// });
		alert('信息提交成功!奖品于14个工作日内发出。')
	},
	open: function () {
		$("#award").show();
	},
	close: function () {
		$("#award").hide();
	}
}


