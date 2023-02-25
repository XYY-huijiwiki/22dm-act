var isPC = true, act_id = 22, token, openid;
var loginUrl = 'https://open.weixin.qq.com/connect/qrconnect?appid=wx434687e1f5079c30&redirect_uri=http%3A%2F%2Fwww.22dm.com%2Fact%2Fwx.html&response_type=code&scope=snsapi_login';
var loginUrlWx = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb61fdb0e387cbcc4&redirect_uri=http%3a%2f%2fwww.22dm.com%2fact%2fh5%2fplane%2findex.html&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';
var userInfo = {
	openid: null,
	name: 'test',
	face: './res/icon.jpg',
	recordList: [],
	rankingList: [],
	hightest: 0
};
var plane = {
	width: 640,
	height: 1008,
	openRankingList: function () {
		$("#ranking").show();
	},
	closeRankingList: function () {
		cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GS_REMOVE_RANKING_LAYER));
	}
};
var timer = {
	bgLoop: 20,  //背景循环时间,单位:秒
	fireFlight: 1,
	fireLoop: 0.2,
	planeSpeedX: 6.7,
	planeSpeedY: 10
};
function gamePadInit() {
	gamepad = new Gamepad();
	gamepad.init();
}
function getGameLogs() {
	if (isPC) {
		userInfo.openid = decodeURI(getQueryString("openid"));
		userInfo.name = decodeURI(getQueryString("name"));
		userInfo.face = decodeURI(getQueryString("face"));
		if (userInfo.openid !== "null") {
			location.href = loginUrl;
		}
		else {
			addRecordList();
		}
	}
	else {
		// $.ajax({
		// 	cache: false,
		// 	async: false,
		// 	type: "POST",
		// 	url: '/act/center/openIdCrossDomain.ashx',
		// 	data: {
		// 		"type": "GET",
		// 		"url": 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=wxb61fdb0e387cbcc4&secret=2de4747ccccb04312e71e86708bfec66&code=' + getQueryString("code") + '&grant_type=authorization_code'
		// 	},
		// 	success: function (response) {
		// 		var result = JSON.parse(response);
		// 		token = result.access_token;
		// 		openid = result.openid;
		// 		if (typeof (openid) == "undefined") {
		// 			location.href = loginUrlWx;
		// 		}
		// 		else {
		// 			userInfo.openid = openid;
		// 			addRecordList();
		// 			$.ajax({
		// 				cache: false,
		// 				async: false,
		// 				type: "POST",
		// 				url: '/act/center/openIdCrossDomain.ashx',
		// 				data: {
		// 					"type": "GET",
		// 					"url": 'https://api.weixin.qq.com/sns/userinfo?access_token=' + token + '&openid=' + openid + '&lang=zh_CN',
		// 				},
		// 				success: function (response) {
		// 					var r = JSON.parse(response);
		// 					userInfo.name = r.nickname;
		// 					userInfo.face = r.headimgurl != "" ? r.headimgurl : 'http://www.22dm.com/act/h5/plane/res/icon.jpg';
		// 					initWxJsSdk();
		// 				}
		// 			});
		// 		}
		// 	}
		// });
		addRecordList();
	}

}
function initWxJsSdk() {
	var share_title = "发明大作战";
	var share_desc = "控制妙宝号击碎陨石，是时候展示真正的技术了。";
	var share_link = 'http://www.22dm.com/act/h5/plane/index.html';
	var share_img = 'http://www.22dm.com/act/h5/plane/res/icon.jpg';
	// $.ajax({
	// 	cache: false,
	// 	async: false,
	// 	type: "POST",
	// 	url: '/act/getWeiXinToken.ashx',
	// 	data: {
	// 		thisUrl: (location.href.split('#')[0])
	// 	},
	// 	success: function (res) {
	// 		console.info(res);
	// 		var wxData = JSON.parse(res);
	// 		wx.config({
	// 			debug: true,
	// 			appId: wxData.appId,
	// 			timestamp: wxData.timestamp,
	// 			nonceStr: wxData.nonceStr,
	// 			signature: wxData.signature,
	// 			jsApiList: [
	// 				'onMenuShareTimeline',
	// 				'onMenuShareAppMessage'
	// 			]
	// 		});
	// 	}
	// });
	wx.ready(function () {
		wx.onMenuShareTimeline({
			title: share_desc, // 分享标题
			link: share_link,
			imgUrl: share_img, // 分享图标
			success: function () {
				console.info("onMenuShareTimeline ok");

			},
			cancel: function () {
				console.info("onMenuShareTimeline cancel");
			}
		});
		wx.onMenuShareAppMessage({
			title: share_title, // 分享标题
			desc: share_desc, // 分享描述
			link: share_link, // 分享链接
			imgUrl: share_img, // 分享图标
			success: function () {
				console.info("onMenuShareTimeline ok");
			},
			cancel: function () {
				console.info("onMenuShareAppMessage cancel");
			}
		});
	});
}
function addRecordList() {
	// $.ajax({
	// 	cache: false,
	// 	async: false,
	// 	type: "POST",
	// 	url: 'getGameLogs.ashx',
	// 	data: {
	// 		"init": 1,
	// 		"user": userInfo.openid,
	// 		"act_id": act_id
	// 	},
	// 	success: function (response) {
	// 		//console.info(response);
	// 		var r = JSON.parse(response);
	// 		var r = JSON.parse(response);
	// 		userInfo.hightest = r.hightest;
	// 		userInfo.recordList = r.recordList;
	// 		userInfo.rankingList = r.rankingList;
	// 		var html = '';
	// 		for (var i = 0; i < userInfo.rankingList.length; i++) {
	// 			html += '<li>';
	// 			html += '<img class="face" src="' + userInfo.rankingList[i].json.face + '" width="46" height="46" /><img class="face_bg" src="res/GameResult/toux.png" width="82" height="73" />';
	// 			html += '<a class="item_name">' + userInfo.rankingList[i].json.name + '</a>';
	// 			html += '<a class="item_score">' + userInfo.rankingList[i].score + '</a>';
	// 			html += '<a class="item_count">' + userInfo.rankingList[i].count + '</a>';
	// 			html += '<a class="item_number_' + (i + 1) + '"></a>';
	// 			html += '</li>';
	// 		}
	// 		$("#rankingList").empty().html(html);
	// 	}
	// });
	let r = {
		"hightest": 40700,
		"recordList": [
			{
				"score": "600",
				"addtime": "2017-08-16"
			},
			{
				"score": "33600",
				"addtime": "2017-07-06"
			},
			{
				"score": "40700",
				"addtime": "2017-07-06"
			},
			{
				"score": "28000",
				"addtime": "2017-07-06"
			},
			{
				"score": "6000",
				"addtime": "2017-07-06"
			},
			{
				"score": "5100",
				"addtime": "2017-07-06"
			}
		],
		"rankingList": [
			{
				"user": "oTaiPuPhXlmB7kHNawelUnns4Iq8",
				"score": "144600",
				"count": "901",
				"json": {
					"score": 26100,
					"bulletCount": 901,
					"level": 2,
					"name": "怀念旧时光的我们",
					"face": "http://wx.qlogo.cn/mmopen/0h9ia1IvLcayPREJZPtaGsIDUeBxMQbnNA30AcvvjrjcNOkNm5bk2GuTUKl3ymAmT1WjPG7kPiaPw5EVmUEE0nIlMLrgdQmqs1/0"
				}
			},
			{
				"user": "oTaiPuK9efbPXEDaezQE8H6QsFRo",
				"score": "87000",
				"count": "1821",
				"json": {
					"score": 35800,
					"bulletCount": 1821,
					"level": 5,
					"name": "0803小侦探喜羊羊",
					"face": "http://wx.qlogo.cn/mmopen/Q3auHgzwzM7bCEfiajpBz8fTcawghpNvaVrJWqt5jdp8hojXh0DwsNkrxWl880sMYk5pibWsbFQwcxLmxLqvBNvw/0"
				}
			},
			{
				"user": "oTaiPuPCzTgmSvVb0FoftEdoiL8A",
				"score": "78000",
				"count": "405",
				"json": {
					"score": 8700,
					"bulletCount": 405,
					"level": 1,
					"name": "陈成",
					"face": "http://www.22dm.com/act/h5/plane/res/icon.jpg"
				}
			},
			{
				"user": "oTaiPuJYKEeZh8pPznfOEFhA5GfM",
				"score": "64400",
				"count": "1510",
				"json": {
					"score": 27200,
					"bulletCount": 1510,
					"level": 4,
					"name": "羊羊乐儿",
					"face": "http://wx.qlogo.cn/mmopen/Q3auHgzwzM49MHIhXyI9O1qrTYuMBkvSEtV5hCaGwXibIOiacVgUicev17kx4hQUfxocQt8hPD2sMvpZ3sr4EN1ibQbN3viajmvyopnm616ShJpU/0"
				}
			},
			{
				"user": "oTaiPuLyns1CePoNhAWp7k0-hif8",
				"score": "59500",
				"count": "1450",
				"json": {
					"score": 40500,
					"bulletCount": 1450,
					"level": 4,
					"name": "嘻哈_Restart",
					"face": "http://wx.qlogo.cn/mmopen/TsrAtX2ibWBgpiaqcORxyP0LTLEDRPvickExaicTR784MTajKUafZ37Gk2FXvo6b1k147QgGov5LMeObxvKqUQBibWsyGfgkU1cvG/0"
				}
			},
			{
				"user": "oTaiPuPKC1xQLAx_RBSuxvwgGlwU",
				"score": "57000",
				"count": "2637",
				"json": {
					"score": 57000,
					"bulletCount": 2637,
					"level": 7,
					"name": "静静的拥抱",
					"face": "http://wx.qlogo.cn/mmopen/UUOxCQgaJn4B8uXZSGZBLzR71r8YtK5vusMIlIkDveupPRibckHAr5sRlyciaarFujJhlyJ2IW6Muflx7nJyFBGefdptQFBQ96/0"
				}
			},
			{
				"user": "oTaiPuIE7EodN5zKYAcwf26lmFoA",
				"score": "53000",
				"count": "292",
				"json": {
					"score": 6800,
					"bulletCount": 292,
					"level": 1,
					"name": "snowing",
					"face": "http://wx.qlogo.cn/mmhead/7N2JRaWooRDA3ib5vcpIibKvjQW4D0q3E56RfJSBnzWe4rkUdsLhnI4A/0"
				}
			}
		]
	};
	userInfo.hightest = r.hightest;
	userInfo.recordList = r.recordList;
	userInfo.rankingList = r.rankingList;
	var html = '';
	for (var i = 0; i < userInfo.rankingList.length; i++) {
		html += '<li>';
		html += '<img class="face" src="' + userInfo.rankingList[i].json.face + '" width="46" height="46" /><img class="face_bg" src="res/GameResult/toux.png" width="82" height="73" />';
		html += '<a class="item_name">' + userInfo.rankingList[i].json.name + '</a>';
		html += '<a class="item_score">' + userInfo.rankingList[i].score + '</a>';
		html += '<a class="item_count">' + userInfo.rankingList[i].count + '</a>';
		html += '<a class="item_number_' + (i + 1) + '"></a>';
		html += '</li>';
	}
	$("#rankingList").empty().html(html);

}
function addScore(score, bulletCount, level) {
	var json = '{"score":' + score + ',"bulletCount":' + bulletCount + ',"level":' + level + ',"name":"' + userInfo.name + '","face":"' + userInfo.face + '"}';
	//console.info(json);
	// $.ajax({
	// 	cache: false,
	// 	async: false,
	// 	type: "POST",
	// 	url: 'getGameLogs.ashx',
	// 	data: {
	// 		"init": 0,
	// 		"user": userInfo.openid,
	// 		"score": score,
	// 		"count": bulletCount,
	// 		"json": json,
	// 		"act_id": act_id
	// 	},
	// 	success: function (response) {
	// 		var flag = false;
	// 		for (var i = 0; i < userInfo.rankingList.length; i++) {
	// 			if (score >= userInfo.rankingList[i].score || userInfo.rankingList.length < 7) {
	// 				flag = true;
	// 				break;
	// 			}
	// 		}
	// 		if (!flag) {
	// 			var a = { "score": score, "addtime": '2017-07-0' + new Date().getDate() };
	// 			userInfo.recordList.unshift(a);
	// 		}
	// 		else {
	// 			addRecordList();
	// 		}
	// 	}
	// });
}
function getTitle(score) {
	var title = '';
	if (score <= 5000)
		title = '吉祥物';
	else if (score <= 10000)
		title = '发明学徒';
	else if (score <= 20000)
		title = '发明助手';
	else if (score <= 30000)
		title = '发明能手';
	else if (score <= 40000)
		title = '发明小天才';
	else if (score <= 50000)
		title = '智多星';
	else if (score <= 10000000)
		title = '妙多多';
	return title;
}
cc.game.onStart = function () {
	isPC = IsPC();
	if (isPC) {
		$("body,#all").addClass("pc");
	}
	else {
		$("body,#all,#debug").addClass("phone");
		$("#all").css({
			"top": ($(window).height() - 1008) / 2
		});
	}
	gamePadInit();
	getGameLogs();
	cc.LoaderScene.preload(g_resources, function () {
		$("#main").show();
		winSize = { width: 640, height: 1008 };
		cc.view.setDesignResolutionSize(640, 1008, cc.ResolutionPolicy.SHOW_ALL);
		cc.director.runScene(new MainMenuScene());
		//cc.director.runScene(new GamePlayScene(1));
		//cc.director.runScene(new GameResultScene());
	}, this);
};
cc.game.run();
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




