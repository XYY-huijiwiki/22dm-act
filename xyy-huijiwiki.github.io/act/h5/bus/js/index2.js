var token, openid, nickname, headimgurl, sex, country, province, debug;
var canvas, context, canvasWidth = 1208, canvasHeight = 640;
var imageUrl = "images/";
var barrageItem, looper, barrageTime, looperTime = 1200;
var act_id = 16;
$(function () {
	debug = 1;
	control.width = $(window).width();
	control.height = $(window).height();
	if (IsPC()) {
		$("#all_bg").addClass("pc");
		control.eventType.start = 'mousedown';
		control.eventType.move = 'mousemove';
		control.eventType.end = 'mouseup';
	}
	else {
		$("#all").addClass("rotate_90");
	}
	$("#btn_index").click(function () {
		$("#s_index").fadeOut().next().show();
	});
	$("#btn_go").click(function () {
		$("#s_introduce").fadeOut().next().show();
	});
	$("#control_switch").click(function () {
		if ($(this).hasClass("close")) {
			$("#control_btn").show();
			$(this).removeClass("close");
		}
		else {
			$("#control_btn").hide();
			$(this).addClass("close");
		}
	});
	$("#city_list li a").click(function () {
		var city = imageUrl + $(this).attr("city") + ".jpg";
		control.saveCity(city);
	});
	if (!debug) {
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
					location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb61fdb0e387cbcc4&redirect_uri=http%3a%2f%2fwww.22dm.com%2fact%2fh5%2fbus%2findex.html&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
				}
				else {
					bus.user = openid;
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
							headimgurl = r.headimgurl != "" ? r.headimgurl : 'http://www.22dm.com/act/h5/bus/images/wx.jpg';
							sex = r.sex;
							country = r.country;
							province = r.province;
							if (typeof (openid) == "undefined") {
								location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb61fdb0e387cbcc4&redirect_uri=http%3a%2f%2fwww.22dm.com%2fact%2fh5%2fbus%2findex.html&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
							}
							else {
								bus.user = openid;
								window.addEventListener('orientationchange', function () { control.onorientation(); }, false);
								control.onorientation();
							}
						}
					});
				}
			}
		});
	}
	else {
		bus.user = 'oTaiPuEUqBR9FQRGw5hvR0oyOAWo';
		window.addEventListener('orientationchange', function () { control.onorientation(); }, false);
		control.onorientation();
	}
	$(document).on(control.eventType.move, "#all_bg", function (event) {
		event.preventDefault();
	});
	wx.onMenuShareTimeline({
		title: '?????????????????????????????????????????????????????????????????????',
		desc: '?????????????????????????????????????????????????????????????????????????????????????????????',
		link: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb61fdb0e387cbcc4&redirect_uri=http%3a%2f%2fwww.22dm.com%2fact%2fh5%2fbus%2findex.html&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect', // ????????????
		imgUrl: 'http://www.22dm.com/act/h5/bus/images/icon.jpg',
		success: function () {

		},
		cancel: function () {

		}
	});
	wx.onMenuShareAppMessage({
		title: '?????????????????????????????????????????????????????????????????????', // ????????????
		desc: '?????????????????????????????????????????????????????????????????????????????????????????????',
		link: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb61fdb0e387cbcc4&redirect_uri=http%3a%2f%2fwww.22dm.com%2fact%2fh5%2fbus%2findex.html&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect', // ????????????
		imgUrl: 'http://www.22dm.com/act/h5/bus/images/icon.jpg',
		type: 'link',
		dataUrl: '',
		success: function () {
		},
		cancel: function () {

		}
	});
});
var award = {
	check: function (user) {
		$("#award_tips").empty();
		var name = $("#award_name").val();
		var tel = $("#award_tel").val();
		var address = $("#award_address").val();
		var result = "";
		if (name == "") {
			result = "????????????????????????!";
		}
		else if (tel.length != 11) {
			result = "?????????11????????????????????????!";
		}
		else if (address == "" || address.length < 8) {
			result = "?????????????????????????????????!";
		}
		if (result == "") { //?????????
			var info = '{"name":"' + name + '","tel":"' + tel + '","address":"' + address + '"}';
			award.post(info);
		}
		else {
			$("#award_tips").text(result);
			//alert(result);
			return false;
		}
	},
	post: function (info) {
		// $.ajax({
		// 	cache: false,
		// 	async: false,
		// 	type: "POST",
		// 	url: '/act/h5/bus/doBarrage.ashx',
		// 	data: {
		// 		"act_id": act_id,
		// 		"init": "0",
		// 		"type": "award",
		// 		"user": bus.user,
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
		alert('??????????????????!?????????7????????????????????????');
	},
	open: function () {
		$("#award").show();
	},
	close: function () {
		$("#award").hide();
	}
};
var bus = {
	user: '',
	scoreList: null,
	rankList: null,
	barrageList: null,
	init: async function () {
		if (control.height > 1008) {
			$("#all_bg").css("height", control.height);
			$("#all,#award").css("top", (control.height - 1008) >> 1);
		}
		$("#pagetip").hide();
		$("#all_bg").show();
		$("#s_index").show();
		canvas = document.getElementById('canvas_creat');
		context = canvas.getContext('2d');
		canvas.width = canvasWidth;
		canvas.height = canvasHeight;
		// $.ajax({
		// 	cache: false,
		// 	async: false,
		// 	type: "POST",
		// 	url: '/act/h5/bus/doBarrage.ashx',
		// 	data: {
		// 		"act_id": 16,
		// 		"init": "1",
		// 		"user": bus.user,
		// 	},
		// 	success: function (response) {
		// 		var bus_goodClick = getCookie("bus_goodClick");
		// 		if (bus_goodClick != null) {
		// 			control.goodClick = unescape(bus_goodClick).substring(1, bus_goodClick.length - 1).split(",");
		// 		}
		// 		var result = JSON.parse(response);
		// 		bus.barrageList = result.barrageList;
		// 		bus.rankingList = result.rankingList;
		// 		control.postCount = result.todayPost;
		// 		if (bus.barrageList.length != 0) {
		// 			barrageItem = bus.creatBarrageItem(bus.barrageList);//????????????json	
		// 			$('#barrage_container').empty();
		// 			barrageInit();
		// 		}
		// 		if (bus.barrageList.length != 0) {
		// 			bus.creatRankingList();//???????????????				
		// 		}
		// 		//console.info(response);
		// 	}
		// });
		let response = await fetch('./list.json');
		let responseJSON = await response.json();
		var bus_goodClick = getCookie("bus_goodClick");
		if (bus_goodClick != null) {
			control.goodClick = unescape(bus_goodClick).substring(1, bus_goodClick.length - 1).split(",");
		}
		var result = responseJSON;
		bus.barrageList = result.barrageList;
		bus.rankingList = result.rankingList;
		control.postCount = result.todayPost;
		if (bus.barrageList.length != 0) {
			barrageItem = bus.creatBarrageItem(bus.barrageList);//????????????json	
			$('#barrage_container').empty();
			barrageInit();
		}
		if (bus.barrageList.length != 0) {
			bus.creatRankingList();//???????????????				
		}
		//console.info(response);
	},
	creatRankingList: function () {
		var html = "";
		for (var i = 0; i < bus.rankingList.length; i++) {
			html += '<li><span class="ranking_img"><img src="' + bus.rankingList[i].data.img + '" width="50" height="50" /></span>';
			html += '<span class="ranking_name">' + bus.rankingList[i].data.name + '</span></li>';
		}
		$("#wall_ranking").empty().html(html);
	},
	creatBarrageItem: function () {
		var json = [];
		for (var i = 0; i < bus.barrageList.length; i++) {
			var tmp = {};
			tmp.id = bus.barrageList[i].id;
			tmp.good = bus.barrageList[i].good;
			tmp.addtime = bus.barrageList[i].addtime;
			tmp.name = bus.barrageList[i].data.name;
			tmp.img = bus.barrageList[i].data.img;
			tmp.city = bus.barrageList[i].data.city;
			tmp.info = unescape(bus.barrageList[i].data.info);
			json.push(tmp);
		}
		return json;
	},
	openDialogs: function (title, describe, tips, time) {
		dialogs.removeAll();
		var html = '<div id="ex_dw"><div id="ex_dw_title" class="dialogs_section">' + title + '</div><div id="ex_dw_main" class="dialogs_section"><span>' + describe + '</span></div><div id="ex_dw_other" class="dialogs_section">' + tips + '</div><a class="ex_dw_close" onclick=dialogs.closeDialogs()></a></div>';
		dialogs.addInnerDiv(html);
		t = setTimeout(function () {
			dialogs.closeDialogs();
		}, time);
	}
};

var control = {
	height: 0,
	width: 0,
	city: "/act/h5/bus/images/c_gz.jpg",
	title: "",
	titleLengthLimit: 24,
	postCount: 0,
	postLimit: 3,
	goodClick: [],
	eventType: {
		start: 'touchstart',
		move: 'touchmove',
		end: 'touchend'
	},
	barrager: {
		post: function () {
			var json = '{"name":"' + nickname + '","img":"' + headimgurl + '","sex":"' + sex + '","country":"' + country + '","province":"' + province + '","city":"' + control.city + '","info":"' + escape(control.title) + '"}';
			// $.ajax({
			// 	cache: false,
			// 	async: false,
			// 	type: "POST",
			// 	url: '/act/h5/bus/doBarrage.ashx',
			// 	data: {
			// 		"user": bus.user,
			// 		"act_id": act_id,
			// 		"init": "0",
			// 		"type": "send",
			// 		"json": json
			// 	},
			// 	success: function (response) {
			// 		console.info(response);
			// 		response = JSON.parse(response);
			// 		if (response.success) {
			// 			bus.openDialogs("??????", "????????????~", "?????????5????????????", 5000);
			// 			$("#btn_post").addClass("posted");
			// 			control.postCount++;
			// 			var tmp = {};
			// 			tmp.id = response.id;
			// 			tmp.good = 0;
			// 			tmp.name = nickname;
			// 			tmp.img = headimgurl;
			// 			tmp.city = control.city;
			// 			tmp.info = control.title;
			// 			if (bus.barrageList.length == 0) {
			// 				barrageItem = [];//????????????json	
			// 				barrageItem.push(tmp);
			// 				$('#barrage_container').empty();
			// 				barrageInit();
			// 			}
			// 			else {
			// 				barrageItem.push(tmp);
			// 			}
			// 			console.info(response.id);
			// 		}
			// 		else {
			// 			bus.openDialogs("??????", "???????????????????????????" + control.postLimit + "????????????~", "?????????5????????????", 5000);
			// 		}
			// 	}
			// });
			bus.openDialogs("??????", "????????????~", "?????????5????????????", 5000);
			$("#btn_post").addClass("posted");
			control.postCount++;
			var tmp = {};
			tmp.id = 186471063097214907617189123;
			tmp.good = 0;
			tmp.name = nickname;
			tmp.img = headimgurl;
			tmp.city = control.city;
			tmp.info = control.title;
			if (bus.barrageList.length == 0) {
				barrageItem = [];//????????????json	
				barrageItem.push(tmp);
				$('#barrage_container').empty();
				barrageInit();
			}
			else {
				barrageItem.push(tmp);
			}
		},
		good: function (id) {
			var obj = $("#barrage_" + id + " .b_good");
			if (!obj.hasClass("b_good_ed")) {
				control.goodClick.push(id);
				setCookie("bus_goodClick", JSON.stringify(control.goodClick));
				obj.addClass("b_good_ed");
				$.ajax({
					cache: false,
					async: false,
					type: "POST",
					url: '/act/h5/bus/doBarrage.ashx',
					data: {
						"user": bus.user,
						"act_id": act_id,
						"init": "0",
						"type": "good",
						"barrage_id": id
					},
					success: function (response) {
						console.info(response);
					}
				});
			}
			else {
				bus.openDialogs("??????", "??????????????????~", "?????????5????????????", 5000);
			}
		}
	},
	onorientation: function () {
		if (!IsPC()) {
			var orientation = window.orientation;
			if (orientation == 90 || orientation == -90) { //??????
				$("#all_bg").hide();
				$("#pagetip").css({
					"width": $(window).width(),
					"height": $(window).height()
				}).show();
			}
			else {
				bus.init();
			}
		}
		else {
			bus.init();
		}
	},
	creatWall: function () {
		if (control.title != "") {
			control.dialogsOpen(3);
			creatCanvas(control.city, control.title);
		}
		else {
			bus.openDialogs("??????", "?????????????????????~", "?????????3????????????", 3000);
			control.dialogsOpen(2);
		}
	},
	wall: {
		post: function () {
			if (!$("#btn_post").hasClass("posted")) {
				if (control.postCount < control.postLimit) {
					control.barrager.post();
				}
				else {
					bus.openDialogs("??????", "???????????????????????????" + control.postLimit + "????????????~", "?????????5????????????", 5000);
				}
			}
			else {
				bus.openDialogs("??????", "??????????????????????????????~<br/>??????????????????!", "?????????5????????????", 5000);
			}
		},
		open: function () {
			$("#s_wall").addClass("show");
		},
		close: function () {
			$("#s_wall").removeClass("show");
		},
		prize: function () {
			var time = new Date();
			var now = time.getTime();
			if (now > Date.parse('2017/03/14 00:00:00')) {
				var hasPrize = false;
				for (var i = 0; i < bus.rankingList.length; i++) {
					if (bus.rankingList[i].user == bus.user) {
						hasPrize = true;
					}
				}
				if (!hasPrize) {
					award.open();
				}
				else {
					bus.openDialogs("??????", "??????????????????????????????!", "?????????5????????????", 5000);

				}
			}
			else {
				bus.openDialogs("??????", "????????????????????????<br/>????????????:2017-03-15", "?????????5????????????", 5000);
			}
		}
	},
	saveCity: function (city) {
		control.city = city;
		$("#game_bg").attr("src", city);
	},
	saveTitle: function () {
		var title = $("#bus_title").val().replace(/\s/g, "");
		var result = "";
		var str = ["???", "??????", "???", "???", "???", "???", "??????", "???", "??????", "??????"];
		if (title == "") {
			result = "??????????????????";
		}
		else if (title.length > control.titleLengthLimit) {
			result = "???????????????????????????" + control.titleLengthLimit + "?????????";
		}
		for (var i = 0; i < str.length; i++) {
			if (title.indexOf(str[i]) != -1) {
				result = "?????????????????????!";
			}
		}
		if (result != "") {
			$(".bus_title_tips").show().empty().html(result);
		}
		else {
			$(".bus_title_tips").hide();
			control.title = title;
			$("#game_title").text(title);
			control.dialogsClose();
		}
	},
	dialogsOpen: function (i) {
		var container = "";
		switch (i) {
			case 1:
				container = "#city_container";
				break;
			case 2:
				container = "#bus_container";
				break;
			case 3:
				container = "#book_container";
				break;
		}
		$("#game_dialogs").children().hide();
		$("#game_dialogs").fadeIn().children(container).show();
		if (i == 2) {
			//$("#bus_title").focus();
		}
	},
	dialogsClose: function () {
		$("#game_dialogs").fadeOut();
	},
	back: function (obj) {
		$("#" + obj).hide().prev().show();
	},
	share: {
		open: function () {
			$(".share_container").show();
		},
		close: function () {
			$(".share_container").hide();
		}
	},
	join: function () {
		var time = new Date();
		var now = time.getTime();
		if (now > Date.parse("2017/02/11 00:00:00") && now < Date.parse("2017/02/12 23:59:59")) {
			window.location.href = "http://u3626172.viewer.maka.im/k/YM64TYSX";
		}
		else {
			bus.openDialogs("??????", "????????????????????????~<br/>????????????:2???11-12???", "?????????5????????????", 5000);
		}
	}
};
function barrageInit() {
	var looper_time = looperTime;
	var run_once = true;
	var items = barrageItem;
	var total;
	var index = 0;
	barrager();
	function barrager() {
		total = barrageItem.length;
		if (run_once) {
			looper = setInterval(barrager, looper_time);
			run_once = false;
		}
		//??????????????????
		if (index == total - 1) {
			$('#barrage_container').barrager(items[index], items[index].id, true);
			clearInterval(looper);
			run_once = true;
			return false;
		}
		else {
			$('#barrage_container').barrager(items[index], items[index].id, false);
		}
		index++;
	}
}


function creatCanvas(cityUrl, txt) {
	context.clearRect(0, 0, canvasWidth, canvasHeight);
	var img = new Image();
	var advert = new Image();
	img.src = cityUrl;
	advert.src = "images/qs_zz.png";
	img.onload = function () {
		advert.onload = function () {
			context.fillStyle = "#FFF";
			context.fillRect(898, 0, 1208, 640);
			context.drawImage(img, 0, 0, 1008, 640, 0, 0, 1008, 640);
			context.drawImage(advert, 0, 0, 310, 640, 898, 0, 310, 640);
			canvasTextAutoLine(txt, 350, 380, 300);
		};
	};
}
function canvasTextAutoLine(str, initX, initY, maxWidth) {
	context.fillStyle = "#000";
	context.font = "26px Arial";
	context.textAlign = "center";
	var lineHeight = 30;
	var lineWidth = 0;
	var lastSubStrIndex = 0;
	for (var i = 0; i < str.length; i++) {
		lineWidth += context.measureText(str[i]).width;
		if (lineWidth > maxWidth) {
			context.fillText(str.substring(lastSubStrIndex, i), initX, initY);
			initY += lineHeight;
			lineWidth = 0;
			lastSubStrIndex = i;
		}
		if (i == str.length - 1) {
			context.fillText(str.substring(lastSubStrIndex, i + 1), initX, initY);
		}
	}
	var date = canvas.toDataURL("image/jpg");
	$("#book_img").attr("src", date);
}
var dialogs = {
	openDialogs: function () {
		$("#dialogs_wrap").fadeIn(300);
	},
	closeDialogs: function () {
		$("#dialogs_wrap").empty().fadeOut(300);
		clearTimeout(t);
	},
	addInnerDiv: function (html) {
		$("#dialogs_wrap").prepend(html).fadeIn(300);
		dialogs.resize();
	},
	removeAll: function () {
		$("#dialogs_wrap").empty();
	},
	resize: function () {
		var w = 1008;
		var h = 640;
		var iw = $("#dialogs_wrap").children().eq(0).width();
		var ih = $("#dialogs_wrap").children().eq(0).height();
		$("#dialogs_wrap").children().eq(0).css({
			"position": "absolute",
			"top": (h - ih) >> 1,
			"left": (w - iw) >> 1
		});
	}
};
function setCookie(name, value) {
	var Days = 30;
	var exp = new Date();
	exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
	document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}
function getCookie(name) {
	var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
	if (arr = document.cookie.match(reg))
		return unescape(arr[2]);
	else
		return null;
}
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]); return null;
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