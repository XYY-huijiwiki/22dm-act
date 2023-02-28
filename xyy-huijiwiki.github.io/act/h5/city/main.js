var v_main, Layer_decorate, Listen_decorate;
var weixinData = {
	shareLink: 'http://www.22dm.com/act/h5/city/index.html',
	shareTitle: '嫁人就嫁灰太狼，和我约会吧！',
	shareDesc: '时间地点安排好了，就差一个对象。',
	shareImg: 'http://www.22dm.com/act/h5/city/res/Public/icon.jpg'
};
var winSize = {
	width: 640,
	height: 1138,
	minHeight: 1008,
	scale: 1,
	scaleOffsetX: 0,
	scaleOffsetY: 130,
	resize: function () {
		var width = $(window).width();
		var height = $(window).height();
		$("body").css({
			"width": width,
			"height": height,
			"overflow": "hidden"
		});
		$("#all").show();
	}
};
var dialogs = {
	loadcount: 0,
	loadres: [],
	loadtag: "dialogs_preload",
	precentWidth: 195,
	loadResFinish: function () {
		cc.spriteFrameCache.addSpriteFrames(res.mm_role_0_plist, res.mm_role_0_png);
		cc.spriteFrameCache.addSpriteFrames(res.mm_role_1_plist, res.mm_role_1_png);
		cc.spriteFrameCache.addSpriteFrames(res.mm_role_2_plist, res.mm_role_2_png);
		cc.spriteFrameCache.addSpriteFrames(res.gp_main_0_plist, res.gp_main_0_png);
		cc.spriteFrameCache.addSpriteFrames(res.gp_main_1_plist, res.gp_main_1_png);
		cc.spriteFrameCache.addSpriteFrames(res.gp_main_2_plist, res.gp_main_2_png);

		v_main.MainMenuScene();
		$("#btn_music").show().click();
		//v_main.GamePlayScene();
	}
};
$(function () {
	doUserLogin();
	$("#btn_music").click(function () {
		var audio = $("#audio")[0];
		if ($(this).hasClass('con-y')) {
			audio.play();
			$(this).removeClass('con-y').addClass('con-r');
		}
		else {
			audio.pause();
			$(this).addClass('con-y').removeClass('con-r');
		}
	});
});
function vueInit() {
	v_main = new Vue({
		el: '#all',
		data: {
			active: '',
			role: 1,
			decorate: { sky: 0, ground: 0, role: 0 },
			count: { city: 0, icon: 0 },
			limit: { city: 20, icon: 50 },
			guide: false,
			canvasImg: '',
			path: '',
			share: false,
			uploadId: [],
			uploadState: 0
		},
		methods: {
			MainMenuScene: function () {
				v_main.role = -1;
				cc.director.runScene(new MainMenuScene());
				$("#choose,#choose_save,#main_back").hide();
				v_main.active = 'index';
			},
			GamePlayScene: function () {
				this.active = '';
				this.decorate = { sky: 0, ground: 0, role: 0 };
				this.count = { city: 0, icon: 0 };
				cc.director.runScene(new GamePlayScene());
				this.create_ercode();
				$("#choose,#choose_save,#main_back").fadeIn();
				this.guide = true;
			},
			GameResultScene: function () {
				v_main.active = 'finish';
				GameManager.GP_LOGO.setVisible(true);
				$("#downloadImg").hide();
				for (var i = 0; i < Layer_decorate.childrenCount; i++) {
					for (var j = 1; j < Layer_decorate.children[i].childrenCount; j++) {
						Layer_decorate.children[i].children[j].setVisible(false);
					}
				}
				setTimeout(function () {
					v_main.canvasImg = document.getElementById('gameCanvas').toDataURL(0, 0, 640, 1138, "image/jpeg", 1);
					$("#downloadImg").fadeIn();
				}, 300);
			},
			index_select: function (role) {
				this.role = role;
				var node = role == 0 ? GameManager.MM_ROLE_BOY : GameManager.MM_ROLE_GIRL;
				node.stopAllActions();
				node.runAction(ActionManager.MM_ROLE_RUN(role, function () {
					v_main.active = 'begin';
				}));
			},
			choose_open: function (type) {
				if ($("#choose_main").hasClass('isClose')) {
					$("#choose_main").animate({ width: 480, marginRight: 10 }, function () {
						$("#choose_main").removeClass('isClose');
						$("#choose_close").removeClass('hide');
					});
				}
				$("#choose_left li a").removeClass("active");
				$("#choose_" + type).addClass('active');
				$("#choose_main").children().hide().eq(type).show();
			},
			choose_close: function () {
				$("#choose_close").addClass('hide');
				$("#choose_main").addClass('isClose').animate({ width: 0, marginRight: 0 });
			},
			updateGround: function (index) {
				if (this.decorate.ground != index) {
					this.decorate.ground = index;
				}
				else {
					this.decorate.ground = -1;
				}
				var event = new cc.EventCustom(jf.EventName.GP_UPDATE_GROUND);
				cc.eventManager.dispatchEvent(event);
			},
			updateSky: function (index) {
				if (this.decorate.sky != index) {
					this.decorate.sky = index;
					var event = new cc.EventCustom(jf.EventName.GP_UPDATE_SKY);
					cc.eventManager.dispatchEvent(event);
				}
			},
			updateRole: function (index) {
				if (this.decorate.role != index) {
					this.decorate.role = index;
				}
				else {
					//this.decorate.role = -1;
				}
				drawDecoration("#r_" + index + ".png", 'role');
			},
			addCity: function (index) {
				if (v_main.count.city < v_main.limit.city) {
					drawDecoration("#dcs_" + index + ".png", 'city');
					v_main.count.city++;
				}
				else {
					$(".limit_city").fadeIn().delay(500).fadeOut();
				}
			},
			addIcon: function (index) {
				if (v_main.count.icon < v_main.limit.icon) {
					drawDecoration("#zsw_" + index + ".png", 'icon');
					v_main.count.icon++;
				}
				else {
					$(".limit_icon").fadeIn().delay(500).fadeOut();
				}
			},
			finish_back: function () {
				this.create_ercode();
				var event = new cc.EventCustom(jf.EventName.GP_UPDATE_SIGN);
				cc.eventManager.dispatchEvent(event);
				GameManager.GP_LOGO.setVisible(false);
				this.uploadState = 0;
				this.active = '';
			},
			create_ercode: function () {
				var path = (new Date().getTime() + '_' + Math.ceil(Math.random() * 100));
				v_main.path = path;
				$("#ercode").empty();
				var qrcode = new QRCode('ercode', {
					text: 'http://22dm.com/act/h5/city/index.html?i=' + path,
					width: 200,
					height: 200,
					colorDark: '#000000',
					colorLight: '#ffffff',
					correctLevel: QRCode.CorrectLevel.L
				});
				setTimeout(function () {
					cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_UPDATE_ERCODE));
				}, 500);
			},
			uploadImg: function () {
				if (v_main.uploadState == 0) {
					v_main.uploadState = 1;
					setTimeout(function () {
						$.ajax({
							cache: false,
							async: false,
							type: "POST",
							url: "saveImg.ashx",
							data: {
								filename: v_main.path,
								imgData: v_main.canvasImg
							},
							success: function (response) {
								var res = JSON.parse(response);
								if (res.success) {
									console.info('upload_finish:' + res.path);
									v_main.uploadId.push(res.path);
									if (v_main.uploadState == 1) {
										setTimeout(function () {
											v_main.uploadState = 2;
										}, 800);
									}
									changeShareLink(res.path);
								}
							}
						});
					}, 500);
				}
			},
			beginEntry: function () {
				$("#begin_role").removeClass("active").addClass("active");
				$("#begin_btn").removeClass("active").addClass("active");
				$("#begin_word").delay(1500).fadeIn();
			},
			beginLeave: function () {
				$("#begin_role").removeClass("active");
				$("#begin_btn").removeClass("active");
				$("#begin_word").hide();
			}
		},
		mounted: function () {
			if (getQueryString("i") == null) {
				this.active = 'preload';
				cc.game.run();

				//this.active='begin';
			}
			else {
				console.info('show:' + getQueryString("i"));
				var img = '<img id="showImg" src="upload/' + getQueryString("i") + '.jpg" onerror="noImage()" width="539" height="958"/>';
				$("#dialogs_show").append(img);
				this.active = 'show';
			}
		}
	});
}
function drawDecoration(src, type) {
	var roleIndex = -1;
	for (var i = 0; i < Layer_decorate.childrenCount; i++) {
		Layer_decorate.children[i].setLocalZOrder(0);
		if (Layer_decorate.children[i].type == 'role' && type == 'role') {
			roleIndex = i;
		}
	}
	// if(roleIndex!=-1){
	// 	Layer_decorate.children[roleIndex].removeFromParent();
	// 	if(v_main.decorate.role ==-1)
	// 		return;
	// }
	var scale = 1;
	var d = new cc.Sprite(src);
	var l = new decorationLayer(type, d.width * scale + 40, d.height * scale + 40);
	Layer_decorate.addChild(l, 100);
	l.addChild(d, 0);
	d.attr({
		x: l.width / 2,
		y: l.height / 2,
		scale: scale
	});
	decorationControl(l);
	cc.eventManager.addListener(Listen_decorate.clone(), l);
}
var decorationLayer = cc.Layer.extend({
	ctor: function (type, width, height) {
		this._super();
		//this.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
		//this.setBackGroundColorOpacity(150);
		//this.setBackGroundColor(cc.color(0, 0, 0));
		this.attr({
			type: type,
			name: 'decorationLayer',
			width: width,
			height: height,
			x: winSize.width / 2 - 200,
			y: winSize.height / 2 - 150,
			bx: winSize.width / 2,
			by: winSize.height / 2,
			moveType: 'default'
		});
	}
});
var decorationControl = function (that) {
	var a = new ccui.Button("d_del.png", "d_del.png", "d_del.png", ccui.Widget.PLIST_TEXTURE);;
	var b = new ccui.Button("d_rotate.png", "d_rotate.png", "d_rotate.png", ccui.Widget.PLIST_TEXTURE);
	var c = new ccui.Button("d_scale.png", "d_scale.png", "d_scale.png", ccui.Widget.PLIST_TEXTURE);
	that.addChild(a);
	that.addChild(b);
	that.addChild(c);
	a.attr({
		visiable: false,
		type: 'delete',
		width: 0,
		height: a.height,
		x: 0,
		y: that.height,
		anchorX: 0,
		anchorY: 1,
		visible: 0
	});
	b.attr({
		type: 'rotate',
		width: b.width,
		height: b.height,
		x: that.width,
		y: that.height,
		anchorX: 1,
		anchorY: 1,
		visible: 0
	});
	c.attr({
		type: 'scale',
		width: c.width,
		height: c.height,
		x: that.width,
		y: 0,
		anchorX: 1,
		anchorY: 0,
		visible: 0
	});
	a.addTouchEventListener(function (sender, type) {
		if (type == ccui.Widget.TOUCH_ENDED) {
			switch (sender.parent.type) {
				case 'role':
					v_main.decorate.role = -1;
					break;
				case 'city':
					v_main.count.city--;
					break;
				case 'icon':
					v_main.count.icon--;
					break;
			}
			sender.parent.removeFromParent();
		}
	}, this);
	b.addTouchEventListener(function (sender, type) {
		switch (type) {
			case ccui.Widget.TOUCH_BEGAN:
				sender.parent.moveType = 'rotate';
				sender.setTouchEnabled(false);
				break;
		}
	}, this);
	c.addTouchEventListener(function (sender, type) {
		switch (type) {
			case ccui.Widget.TOUCH_BEGAN:
				sender.parent.moveType = 'scale';
				sender.setTouchEnabled(false);
				break;
		}
	}, this);
};
function doUserLogin() {
	winSize.resize();
	vueInit();
	initWxJsSdk();
}
cc.game.onStart = function () {
	dialogs.loadres = g_resources;
	dialogs.loadcount = 0;
	loadGameResources();
};
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
			imgUrl: weixinData.shareImg
		});
		wx.onMenuShareAppMessage({
			title: weixinData.shareTitle,
			desc: weixinData.shareDesc,
			link: weixinData.shareLink,
			imgUrl: weixinData.shareImg
		});
	});
}
function changeShareLink(imgPath) {
	wx.onMenuShareTimeline({
		title: weixinData.shareTitle,
		link: weixinData.shareLink + '?i=' + imgPath,
		imgUrl: weixinData.shareImg
	});
	wx.onMenuShareAppMessage({
		title: weixinData.shareTitle,
		desc: weixinData.shareDesc,
		link: weixinData.shareLink + '?i=' + imgPath,
		imgUrl: weixinData.shareImg
	});
}
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return (r[2]); return null;
}
function noImage() {
	location.href = '/act/h5/city/index.html';
}
