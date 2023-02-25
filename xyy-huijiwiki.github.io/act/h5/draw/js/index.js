var draw_data, good_id = [], act_id = 20, isPC, token, openid, nickname, headimgurl, sex, country, province, debug = true;
var container, d_bg, d_img, shape, mask, mouse, canvasWidth, canvasHeight, isDown, downX, downY, offsetX = 0, offsetY = 0, offsetTop = 0;
var imgUrl = "images/", imgData, RootCoordinate = { x: 0, y: 0 }, moveable = false;
$(function () {
	canvasWidth = 1008;
	canvasHeight = 640;
	isPC = IsPC();
	if (isPC) {
		$("#all_bg").addClass("pc");
		$("#topnav,#fnav").show();
		draw.init();
		init(window._requestAF, "canvas-wrap", canvasWidth, canvasHeight, main);
	}
	else {
		offsetTop = $(window).height() - 1008 >> 1;
		offsetTop = offsetTop > 0 ? offsetTop : 0;
		$("#all_bg").css({
			"width": $(window).width(),
			"height": $(window).height()
		});
		$("#all").addClass("rotate_90").css({
			"top": offsetTop
		});
		draw.enlargeMost = 1.6;
		draw.enlargeEach = 0.2;
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
					location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb61fdb0e387cbcc4&redirect_uri=http%3a%2f%2fwww.22dm.com%2fact%2fh5%2fdraw%2findex.html&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
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
							headimgurl = r.headimgurl != "" ? r.headimgurl : 'http://www.22dm.com/act/h5/deep/static/img/icon.jpg';
							sex = r.sex;
							country = r.country;
							province = r.province;
							draw.init();
							init(window._requestAF, "canvas-wrap", canvasWidth, canvasHeight, main);
						}
					});
				}
			}
		});
	}

});

var draw = {
	goodClick: [],
	map: "bg/1.png",
	brushColor: '#AA6321',
	brushEraser: false,
	brushType: "normal",
	brushThickness: 5,
	enlargeMost: 1,
	enlargeEach: 0.1,
	enlargeQuantity: 0,
	init: async function () {
		// $.ajax({
		// 	cache: false,
		// 	async: false,
		// 	type: "POST",
		// 	url: '/act/h5/draw/draw.ashx',
		// 	data: {
		// 		"act_id": act_id,
		// 		"from": isPC ? "pc" : "wx",
		// 		"user": openid,
		// 		"init": 1
		// 	},
		// 	success: function (response) {
		// 		//console.info(response);
		// 		draw_data = JSON.parse(response);
		// 		/*var bus_goodClick = getCookie("draw_goodClick");
		// 		if(bus_goodClick!=null){
		// 			draw.goodClick=unescape(bus_goodClick).substring(1,bus_goodClick.length-1).split(",");
		// 			console.info(draw.goodClick);
		// 		}*/
		// 	}
		// });
		let response = await fetch('./response.json');
		draw_data = await response.json();
	},
	addDrawList: function () {
		var html = '';
		for (var i = 0; i < draw_data.drawList.length; i++) {
			html += '<li id="item_' + draw_data.drawList[i].id + '" item_src="' + draw_data.drawList[i].json.originalPath + '">';
			html += '<a class="item_bg"><img class="item_img" src="' + draw_data.drawList[i].json.squashPath + '" width="208" height="139" /></a><a class="item_look"></a>';
			html += '<span class="item_good"><a>' + draw_data.drawList[i].score + '</a></span><div class="clear"></div></li>';
		}
		$("#ranking_list").empty().html(html);
		for (var i = 0; i < draw_data.myDraw.length; i++) {
			$("#item_" + draw_data.myDraw[i]).prepend('<a class="item_del" onclick="draw.del(' + draw_data.myDraw[i] + ')"></a>');
		}
		for (var i = 0; i < draw.goodClick.length; i++) {
			$("#item_" + draw.goodClick[i] * 1 + " .item_good").addClass("selected");
		}
		addDrawListener();
	},
	enlarge: function (type) {
		var scale = null;
		if (type == 1) {
			if (draw.enlargeQuantity + draw.enlargeEach <= draw.enlargeMost) {
				$("#enlager_small").removeClass("not");
				scale = draw.enlargeQuantity + draw.enlargeEach;
			}
		}
		else {
			if (draw.enlargeQuantity - draw.enlargeEach >= 0) {
				$("#enlager_big").removeClass("not");
				scale = draw.enlargeQuantity - draw.enlargeEach;
			}
		}
		if (scale != null) {
			draw.enlargeQuantity = scale;
			container.scaleX = 1 + scale;
			container.scaleY = 1 + scale;
			container.x = -scale * canvasWidth >> 1;
			container.y = -scale * canvasHeight >> 1;
			RootCoordinate.x = container.getRootCoordinate().x;
			RootCoordinate.y = container.getRootCoordinate().y;
			container.dragRange = new LRectangle(-scale * canvasWidth, -scale * canvasHeight, scale * canvasWidth, scale * canvasHeight);
			if (scale.toFixed(1) == 0.0) {
				$("#enlager_small,#enlager_move").addClass("not");
				moveable = false;
			}
			else if (scale.toFixed(1) == 1.0) {
				$("#enlager_big").addClass("not");
			}
		}
	},
	select: function () {
		canvas.draw.img(draw.map);
	},
	empty: function () {
		shape.die();
		shape.graphics.lineCap("round");
		draw.dialogs.close();
		draw.eraser(false);
	},
	creat: {
		getDataUrl: function () {
			imgData = container.getDataURL("image/jpeg", 0.9);
			$("#creat_selector_source,#canvas-finish-data").attr("src", imgData);
		},
		sure: function () {
			draw.dialogs.close();
			$("#selector_wrap").children().hide();
			$("#canvas-finish,#left-selector-save").show();
			$("#left-selector a").removeClass("selected");
		},
		cancel: function () {
			draw.dialogs.close();
			$("#select_creat").removeClass("selected");
		},
		back: function () {
			$("#left-selector-save,#canvas-finish").hide();
		}
	},
	upload: {
		ask: function () {
			$("#select_upload").addClass("selected");
			draw.dialogs.open(6);
		},
		cancel: function () {
			$("#select_upload").removeClass("selected");
			draw.dialogs.close();
		},
		sure: function () {
			if (typeof (openid) == "undefined") {
				login.init();
			}
			else {
				draw.dialogs.open(8);
				var json = '{"originalPath":"RESIZA","squashPath":"RESIZB","addtime":"RESIZC"}';
				$.ajax({
					cache: false,
					async: false,
					type: "POST",
					url: '/act/h5/draw/draw.ashx',
					data: {
						"act_id": act_id,
						"type": "upload",
						"user": openid,
						"from": isPC ? "pc" : "wx",
						"openid": openid,
						"init": 0,
						"json": json,
						"imgData": imgData
					},
					success: function (response) {
						//console.info(response);
						var r = JSON.parse(response);
						if (r.success) {
							draw.dialogs.open(9);
							draw.init();
							draw.addDrawList();
						}
						else {
							draw.dialogs.close();
							alert(r.returnStr);
						}
					}
				});
			}
		}
	},
	del: function (id) {
		if (confirm("你确定要删除此记录吗?")) {
			draw.doAjax("del", id, $("#item_" + id).attr("item_src"));
			$("#item_" + id).fadeOut();
		}
	},
	doAjax: function (type, id, path) {
		$.ajax({
			cache: false,
			async: false,
			type: "POST",
			url: '/act/h5/draw/draw.ashx',
			data: {
				"act_id": act_id,
				"user": openid,
				"from": isPC ? "pc" : "wx",
				"openid": openid,
				"type": type,
				"draw_id": id,
				"draw_path": path,
				"init": 0
			},
			success: function (response) {
			}
		});
	},
	eraser: function (i) {
		draw.brushEraser = i;
		canvas.brush.init();
	},
	dialogs: {
		open: function (i) {
			var e = $("#selector_dialogs");
			e.children().hide().eq(i).show();
			var w = e.width();
			var h = e.height();
			e.css({
				"top": canvasHeight - h >> 1,
				"left": canvasWidth - h >> 1
			}).show();
		},
		close: function () {
			$("#selector_dialogs").hide();
			$("#action_selector").attr("class", "action_selector_0");
		}
	},
	share: function () {
		$("#share-wrap").show();
		$("#select_share").addClass("selected");
	}
};

var canvas = {
	draw: {
		init: function () {
			container.addChild(shape);
			container.addChild(mask);
			container.addChild(d_img);
			var loader = new LLoader();
			loader.load(imgUrl + "mask.png", "bitmapData");
			loader.addEventListener(LEvent.COMPLETE, function (event) {
				var bitmap = new LBitmap(new LBitmapData(loader.content));
				mask.addChild(bitmap);
				shape.graphics.lineCap("round");
				canvas.brush.init();
				canvas.draw.img(draw.map);
				draw.addDrawList();
				addNormalListener();
				if (isPC) {
					container.addEventListener(LMouseEvent.MOUSE_DOWN, onDown);
					container.addEventListener(LMouseEvent.MOUSE_MOVE, onMove);
					container.addEventListener(LMouseEvent.MOUSE_UP, onUp);
				}
				else {
					document.getElementById("canvas-wrap").addEventListener("touchstart", onDown);
					document.getElementById("canvas-wrap").addEventListener("touchmove", onMove);
					document.getElementById("canvas-wrap").addEventListener("touchup", onUp);
				}
			});
		},
		img: function (src) {
			var loader = new LLoader();
			loader.load(imgUrl + src, "bitmapData");
			loader.addEventListener(LEvent.COMPLETE, function (event) {
				var bitmap = new LBitmap(new LBitmapData(loader.content));
				d_img.removeAllChild();//清空
				d_img.addChild(bitmap);
				draw.empty();
			});
		}
	},
	brush: {
		init: function () {
			draw.brushType == "normal" ? mask.visible = false : mask.visible = true;
			var color = draw.brushEraser ? "#fff" : draw.brushColor;
			shape.graphics.lineStyle(draw.brushThickness, color);
		}
	}
};
function main() {
	LGlobal.preventDefault = false;
	container = new LSprite();	//容器&鼠标监听器
	shape = new LShape();	    //轨迹
	mask = new LSprite();       //蒙版
	d_img = new LSprite();	    //底图
	container.width = canvasWidth;
	container.height = isPC ? canvasHeight : canvasWidth;
	mask.width = canvasWidth;
	mask.height = canvasHeight;
	d_img.width = canvasWidth;
	d_img.height = canvasHeight;
	shape.width = canvasWidth;
	shape.height = canvasHeight;
	container.graphics.drawRect(0, "#fff", [0, 0, canvasWidth, canvasHeight], true, "#fff");
	addChild(container);
	canvas.draw.init();
}
function onDown(e) {
	if (!moveable) {
		shape.graphics.beginPath();
		isPC ? LGlobal.preventDefault = true : e.preventDefault();
		downX = isPC ? e.selfX : (e.touches[0].pageY - offsetTop - RootCoordinate.x) / (1 + draw.enlargeQuantity);
		downY = isPC ? e.selfY : (640 - e.touches[0].pageX - RootCoordinate.y) / (1 + draw.enlargeQuantity);
	}
	else {
		if (isPC)
			container.startDrag();
		else {
			e.preventDefault();
			downX = e.touches[0].pageY;
			downY = e.touches[0].pageX;
		}
	}
	isDown = true;
}
function onMove(e) {
	if (isDown) {
		if (!moveable) { //绘图
			shape.graphics.beginPath();
			shape.graphics.moveTo(downX, downY);
			shape.graphics.lineTo(isPC ? e.selfX : (e.touches[0].pageY - offsetTop - RootCoordinate.x) / (1 + draw.enlargeQuantity), isPC ? e.selfY : (640 - e.touches[0].pageX - RootCoordinate.y) / (1 + draw.enlargeQuantity));
			shape.graphics.stroke();
			downX = isPC ? e.selfX : (e.touches[0].pageY - offsetTop - RootCoordinate.x) / (1 + draw.enlargeQuantity);
			downY = isPC ? e.selfY : (640 - e.touches[0].pageX - RootCoordinate.y) / (1 + draw.enlargeQuantity);
		}
		else if (!isPC) { //手机移动
			e.preventDefault();
			container.x += e.touches[0].pageY - downX;
			container.y -= e.touches[0].pageX - downY;
			RootCoordinate.x = container.getRootCoordinate().x;
			RootCoordinate.y = container.getRootCoordinate().y;
			downX = e.touches[0].pageY;
			downY = e.touches[0].pageX;
		}
	}
}
function onUp(e) {
	isDown = false;
	if (!moveable) {
		LGlobal.preventDefault = false;
		shape.graphics.closePath();
	}
	if (isPC) {
		container.stopDrag();
	}
}
var login = {
	init: function () {
		var html = '<div id="login_wrap"><div id="login_section_nav" class="login_section"><a id="l_b_login" class="l_btn l_selected"></a><a id="l_b_reg" class="l_btn"></a><a id="longin_nav_close" onclick=login.close()></a><div class="clear"></div></div><div id="login_section_main" class="login_section"><div id="l_s_login" class="l_s_m_inner inner_show"><ul><li><span>账&nbsp;&nbsp;&nbsp;&nbsp;号:</span><input type="text" id="l_name" /></li><li><span>密&nbsp;&nbsp;&nbsp;&nbsp;码:</span><input type="password" id="l_pwd" /></li><li><span>验证码:</span><input type="text" id="l_cc" /><a id="l_gc"><img id="l_cc_img" src="/Srv/CreatCode.aspx?l=4&n=l_cc&ran=14564" onclick="login.refreshCode(1)"/></a></li></ul><div id="login_ctl"><div class="login_ctl_tips">111</div><div class="login_ctl_btn"><a id="l_d_login" onclick="login.doCountLogin()"></a><a id="l_d_forget" href="#"></a></div></div></div><div id="l_s_reg" class="l_s_m_inner"><ul><li><span>账&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号:</span><input type="text" id="r_name" /></li><li><span>密&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;码:</span><input type="password" id="r_pwd" /></li><li> <span>确认密码:</span><input type="password" id="r_cpwd" /></li><li><span>验证码:</span><input type="text" id="r_cc" /><a id="r_gc"><img id="r_cc_img" src="/Srv/CreatCode.aspx?l=4&n=r_cc&ran=23489" onclick="login.refreshCode(2)"/></a></li></ul><div class="login_ctl"><div class="login_ctl_tips">111</div><div class="login_ctl_btn"><a id="l_d_reg" onclick="login.doReg()"></a></div></div></div></div><div id="login_section_other" class="login_section"><a id="login_qq" onclick="login.doOpenIdLogin()"/></a></div></div>';
		dialogs.addInnerDiv(html);
		$("#login_section_nav a").click(function () {
			if (!$(this).hasClass("l_selected")) {
				login.closeTips();
				$(this).addClass("l_selected").siblings().removeClass("l_selected");
				var n = $("#login_section_main .l_s_m_inner").eq($(this).index());
				if (!n.hasClass("inner_show")) {
					n.addClass("inner_show").siblings().removeClass("inner_show");
				}
			}
		});
	},
	dofillRegName: function (oInfo, oid, mode) {
		dialogs.removeAll();
		var html = '<div id="puzzle_dw"><div id="puzzle_dw_title" class="dialogs_section">填写用户昵称</div><div id="puzzle_dw_main" class="dialogs_section"><span id="puzzle_dw_fill_wrap"><input type="text" id="fill_name_t" /></span><span class="puzzle_dw_fill_tips"></span><span class="puzzle_dw_tips"><div class="red">温馨提示:</div><div class="puzzle_dw_tips_cnt">用户昵称不可修改，由3-20位数字英文汉字以及下划线组成。</div><div class="clear"></div></span><span><a id="puzzle_dw_fill_name_btn"><img src="images/tnav_2.png" width="204" height="88" /></a></span></div><div id="puzzle_dw_other" class="dialogs_section"></div><a class="puzzle_dw_close" onclick="dialogs.closeDialogs()"></a></div>';
		dialogs.addInnerDiv(html);
		$("#puzzle_dw_fill_name_btn").unbind().click(function () {
			var name = $("#fill_name_t").val();
			if (name != "" && login.ckhCount(name)) { //合法昵称
				$(".puzzle_dw_fill_tips").empty();
				login.doOpenIdReg(oInfo, oid, mode, name);
			}
			else {
				$(".puzzle_dw_fill_tips").html("您的昵称填写有误!");
			}
		});
	},
	refreshCode: function (i) {
		if (i == 1)
			document.getElementById("l_cc_img").src = '/Srv/CreatCode.aspx?l=4&n=l_cc&ran=' + Math.random();
		else if (i == 2)
			document.getElementById("r_cc_img").src = '/Srv/CreatCode.aspx?l=4&n=r_cc&ran=' + Math.random();
	},
	close: function () {
		dialogs.removeAll();
		dialogs.closeDialogs();
	},
	doCountLogin: function () {
		var l_name = $("#l_name").val();
		var l_pwd = $("#l_pwd").val();
		var l_cc = $("#l_cc").val();
		var tips = "";
		if (l_name == "") {
			tips = "请输入您的账号";
			$("#l_name").focus();
		}
		else if (!login.ckhCount(l_name)) {
			tips = "账号须由3-20位数字英文汉字或下划线组成";
			$("#l_name").focus();
		}
		else if (l_pwd.length < 6 || l_pwd.length > 12) {
			tips = "请输入6-12位数的密码";
			$("#l_pwd").focus();
		}
		else if (l_cc.length != 4) {
			tips = "请输入4位数验证码";
			$("#l_cc").focus();
		}
		else if (!login.chkCode(1, l_cc)) {
			tips = "验证码不正确!";
			login.refreshCode(1);
			$("#l_cc").focus();
		}
		if (tips != "") {
			login.showTips(tips);
			return false;
		}
		else {
			login.doLoginAjax(1, "count", l_name, l_pwd, "0", "", null);
		}
	},
	doLoginAjax: function (type, mode, name, pwd, oid, oInfo, callback) {
		login.showTips("登录中...");
		$.ajax({
			cache: false,
			async: false,
			type: "POST",
			url: "/center/doLogin.ashx",
			data: {
				"type": type,
				"mode": mode,
				"name": name,
				"pwd": pwd,
				"oid": oid
			},
			success: function (response) {
				console.info(response);
				var result = JSON.parse(response);
				if (result.success) {
					dialogs.closeDialogs();
					openid = "";
				}
				else {
					if (mode == "count") {
						login.showTips(result.returnStr);
					}
					else {
						login.dofillRegName(oInfo, oid, mode);
					}
				}
			},
			error: function (data) {
				login.showTips("系统错误,请稍后再试");
				return false;
			}
		});
	},
	doReg: function () {
		var r_name = $("#r_name").val();
		var r_pwd = $("#r_pwd").val();
		var r_cpwd = $("#r_cpwd").val();
		var r_cc = $("#r_cc").val();
		var tips = "";
		if (r_name == "") {
			tips = "请输入您的账号";
			$("#r_name").focus();
		}
		else if (!login.isTrueName(r_name)) {
			tips = "账号不能含有关键字符,请使用其他账号名称";
			$("#r_name").focus();
		}
		else if (!login.ckhCount(r_name)) {
			tips = "账号须由3-20数字或英文字母或下划线组成";
			$("#r_name").focus();
		}
		else if (r_pwd.length < 6 || r_pwd.length > 12)
			tips = "请输入6-12位数的密码";
		else if (r_pwd != r_cpwd)
			tips = "两次输入的密码不相同";
		else if (r_cc.length != 4)
			tips = "请输入4位数验证码";
		else if (!login.chkCode(2, r_cc)) {
			tips = "验证码不正确!";
			login.refreshCode(2);
		}
		if (tips != "") {
			login.showTips(tips);
			return false;
		}
		else {
			login.closeTips();
			login.doRegAjax(2, "count", r_name, r_pwd, "0", act.init);
		}
	},
	doRegAjax: function (type, mode, name, pwd, oid, callback) {
		login.showTips("注册中...");
		$.ajax({
			cache: false,
			async: false,
			type: "POST",
			url: "/center/doLogin.ashx",
			data: {
				"type": type,
				"mode": mode,
				"name": name,
				"pwd": pwd,
				"oid": oid
			},
			success: function (response) {
				console.info(response);
				var result = JSON.parse(response);
				if (result.success) {
					login.showTips(result.returnStr);
					dialogs.closeDialogs();
					openid = "";
				}
				else {
					login.showTips(result.returnStr);
				}
			},
			error: function (data) {
				login.showTips("系统错误,请稍后再试");
				return false;
			}
		});

	},
	isTrueName: function (txt) {
		var tmp = ["管理", "22dm", "22DM", "22Dm", "22dM", "官方", "原创"];
		for (var i = 0; i < tmp.length; i++) {
			if (txt.indexOf(tmp[i]) != -1) {
				return false;
			}
		}
		return true;
	},
	ckhCount: function (txt) {
		var regusername = /^([\u4e00-\u9fa5-a-zA-Z0-9_]){3,20}$/;
		return regusername.test(txt);
	},
	chkPwd: function (txt) {
		var regpassword = /^[\w]{6,12}$/;
		return regpassword.test(txt);
	},
	showTips: function (tips) {
		$(".login_ctl_tips").empty().html(tips).show();
	},
	closeTips: function () {
		$(".login_ctl_tips").empty().hide();
	},
	chkCode: function (t, c) {
		var cc = getCookie(t == 1 ? "l_cc" : "r_cc");
		if (cc != null) {
			if (c.toLowerCase() == cc.toLowerCase())
				return true;
		}
		return false;
	}
};
function addDrawListener() {
	//点赞
	$(".item_good").unbind("click").click(function () {
		var e = $(this);
		if (!e.hasClass("selected")) {
			var i = e.parent().index();
			var id = e.parent().attr("id").substr(5);
			e.addClass("selected");
			e.children().text(e.children().text() * 1 + 1);
			draw.doAjax("good", id, "");
			draw_data.drawList[i].score++;
			draw.goodClick.push(id);
			//setCookie("draw_goodClick",JSON.stringify(draw.goodClick));
			//console.info(draw.goodClick);
		}
	});
	//查看
	$(".item_look").unbind("click").click(function () {
		draw.doAjax("look", $(this).parent().attr("id").substr(5), "");
		$("#ranking_dialogs").fadeIn();
		var img = new Image();
		img.src = $(this).parent().attr("item_src");
		img.onload = function () {
			$("#ranking_img").attr("src", img.src);
		};
	});
	//查看关闭
	$("#ranking_dialogs_close,#ranking_dialogs").unbind("click").click(function () {
		$("#ranking_dialogs").fadeOut();
	});
}
function addNormalListener() {
	//主菜单选择
	$("#left-selector-main a").click(function () {
		var index = $(this).index() * 1;
		var e = $(this);
		if (index < 2) {
			if (!e.hasClass("selected")) {
				$("#selector_wrap").children().hide().eq(index).show();
				e.addClass("selected").siblings().removeClass("selected");
				draw.dialogs.close();
			}
			else {
				$("#selector_wrap").children().hide();
				e.removeClass("selected");
			}
		}
		else if (index == 2) {
			if (!e.hasClass("selected")) {
				container.x = 0;
				container.y = 0;
				$("#selector_wrap").children().hide();
				e.addClass("selected").siblings().removeClass("selected");
				draw.dialogs.open(5);
				draw.creat.getDataUrl();
			}
			else {
				draw.dialogs.close();
				e.removeClass("selected");
			}
		}
	});
	//底图切换
	$("#bg_pre,#bg_next").click(function () {
		var type = $(this).attr("id") == "bg_pre" ? 0 : 1;
		var total = $("#bg_list").children().length;
		var now = $("#bg_list .now").index();
		var each = 4;
		if (total > each) {
			var begin = null;
			if (type) { //下一页
				if (now + each < total) {
					begin = now + each;
				}
			}
			else {
				if (now != 0) {
					begin = now - each < 0 ? 0 : now - each;
				}
			}
			if (begin != null) {
				$("#bg_list").children().hide();
				$("#bg_list").children().removeClass("now").eq(begin).addClass("now");
				for (var i = begin; i < begin + each; i++) {
					$("#bg_list").children().eq(i).fadeIn();
				}
			}
		}
	});
	$("#bg_list li").click(function () {
		if (!$(this).hasClass("selected")) {
			draw.map = $(this).attr("bg_src");
			$(this).addClass("selected").siblings().removeClass("selected");
			draw.dialogs.open(7);
		}
	});
	//工具选择
	$("#action_selector a").click(function () {
		var index = $(this).index() * 1 + 1;
		var e = $(this).parent();
		var name = "action_selector_" + index;
		if (e.attr("class") == name) {
			draw.dialogs.close();
			name = "action_selector_0";
			if (index == 4) {
				draw.eraser(false);
			}
		}
		else {
			if (index == 4) {
				draw.eraser(true);
				draw.dialogs.close();
			}
			else {
				draw.dialogs.open(index - 1);
			}
		}
		$(this).parent().attr("class", name);
	});
	//颜色选择
	$("#color_plate a").click(function () {
		if (!$(this).hasClass("selected")) {
			$(this).addClass("selected").siblings().removeClass("selected");
			var index = $(this).index() * 1 + 1;
			$("#color_pen").attr("class", "pen_" + index);
			draw.brushColor = $(this).attr("color");
			draw.eraser(false);
		}
	});
	//粗细选择
	$("#thickness_selector a").click(function () {
		if (!$(this).hasClass("selected")) {
			$(this).addClass("selected").siblings().removeClass("selected");
			draw.brushThickness = $(this).attr("thickness") * 1;
			draw.eraser(false);
		}
	});
	//画笔选择
	$("#penType_selector a").click(function () {
		if (!$(this).hasClass("selected")) {
			$(this).addClass("selected").siblings().removeClass("selected");
			draw.brushType = $(this).attr("brushType");
			draw.eraser(false);
		}
	});
	//分享
	$("#share-wrap").click(function () {
		$(this).hide();
		$("#select_share").removeClass("selected");
	});
	$("#tips-wrap").click(function () {
		$(this).hide();
	});
	//打开排行榜
	$("#select_vote_1,#select_vote_2").click(function () {
		$("#s_ranking").show();
	});
	//排序
	$("#ranking_btn a").click(function () {
		var index = $(this).index();
		if (index == 2) {
			$("#s_ranking").hide();
			return;
		}
		else {
			if (!$(this).hasClass("selected")) {
				$(this).addClass("selected").siblings().removeClass("selected");
				draw_data.drawList.sort(index == 0 ? SortGood : SortTime);
				draw.addDrawList();
			}
		}
	});

	//移动开关
	$("#enlager_move").click(function () {
		if ($(this).hasClass("not")) {
			if (draw.enlargeQuantity.toFixed(1) != 0.0) { //当前状态可以移动
				$(this).removeClass("not");
				moveable = true;
			}
			else {

			}
		}
		else {
			$(this).addClass("not");
			moveable = false;
		}
	});
}
var dialogs = {
	openDialogs: function () {
		$("#dialogs_wrap").fadeIn(300);
	},
	closeDialogs: function () {
		$("#dialogs_wrap").empty().fadeOut(300);
	},
	addInnerDiv: function (html) {
		$("#dialogs_wrap").prepend(html).fadeIn(300);
		dialogs.resize();
	},
	removeAll: function () {
		$("#dialogs_wrap").empty();
	},
	resize: function () {
		var w = canvasWidth;
		var h = canvasHeight;
		var iw = $("#dialogs_wrap").children().eq(0).width();
		var ih = $("#dialogs_wrap").children().eq(0).height();
		$("#dialogs_wrap").children().eq(0).css({
			"position": "absolute",
			"top": (h - ih) >> 1,
			"left": (w - iw) >> 1
		});
	}
};
function SortTime(x, y) {
	return (x.addtime < y.addtime) ? 1 : -1;
}
function SortGood(x, y) {
	return (x.score * 1 < y.score * 1) ? 1 : -1;
}
function getEvtLoc() {
	return { x: event.touches[0].pageX, y: event.touches[0].pageY };
}
window._requestAF = (function () {
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function (/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
			window.setTimeout(callback, 1000 / 60);
		};
})();
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
	if (r != null) return unescape(r[2]); return null;
}
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