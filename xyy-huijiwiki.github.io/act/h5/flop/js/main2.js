var act_id=17,token="", openid, nickname="", headimgurl="", sex="", country="", province="",debug=false;
var stage, W = 640, H = 960, IS_TOUCH, SCREEN_SHOW_ALL = !1, g_androidsoundtimer = null, g_followAnim = null;
var BASE_RES_DIR = "../";
var RES_DIR = "";
var APP_DEPLOYMENT = "WEB";
var USE_NATIVE_SOUND = !1;
var USE_NATIVE_SHARE = !1;
var IS_IOS = navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? !0 : !1;
var IS_ANDROID = false;
var IS_NATIVE_ANDROID = IS_ANDROID && -1 < navigator.userAgent.indexOf("Version");
var IS_REFFER =true;
var SHOW_LLAMA = !0; 
var SHOW_COPYRIGHT = !1;
var IN_WEIXIN = !1;
var  IS_SUB = !1;
var  best = -1;
var gameTime = 60;
var startBtnHandler_once = true;
score = 0; 
record_flag = !1; 
logFlag = !1;
keyStorage = "bestball";
$(function(){
	debug=true;
	// wx.onMenuShareTimeline({
	// 	title: '智趣羊羊翻翻看', // 分享标题
	// 	link: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb61fdb0e387cbcc4&redirect_uri=http%3a%2f%2fwww.22dm.com%2fact%2fh5%2fflop%2findex.html&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect', // 分享链接
	// 	imgUrl: 'http://www.22dm.com/act/h5/flop/img/icon.jpg' // 分享图标
	// });
	// wx.onMenuShareAppMessage({
	// 	title: '智趣羊羊翻翻看', // 分享标题
	// 	desc: '动动手，翻一翻，小羊对对碰！', // 分享描述
	// 	link: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb61fdb0e387cbcc4&redirect_uri=http%3a%2f%2fwww.22dm.com%2fact%2fh5%2fflop%2findex.html&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect', // 分享链接
	// 	imgUrl: 'http://www.22dm.com/act/h5/flop/img/icon.jpg' // 分享图标
	// });
	if(!debug)
	{
		$.ajax({
			cache: false,
			async: false,
			type: "POST",
			url: '/act/center/openIdCrossDomain.ashx',
			data:{
				"type": "GET",
				"url": 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=wxb61fdb0e387cbcc4&secret=2de4747ccccb04312e71e86708bfec66&code=' + getQueryString("code") + '&grant_type=authorization_code'
			},
			success: function (response) {
				var result = JSON.parse(response);
				token = result.access_token;
				openid = result.openid;
				flop.user = openid;
				$.ajax({
					cache: false,
					async: false,
					type: "POST",
					url: '/act/center/openIdCrossDomain.ashx',
					data: {
						"type": "GET",
						"url": 'https://api.weixin.qq.com/sns/userinfo?access_token='+token+'&openid='+openid+'&lang=zh_CN',
					},
					success: function (response) {
						var r = JSON.parse(response);
						nickname = r.nickname;
						headimgurl = r.headimgurl != "" ? r.headimgurl : 'http://www.22dm.com/act/h5/deep/static/img/icon.jpg';
						sex = r.sex;
						country = r.country;
						province = r.province;
						if(typeof(openid)=="undefined")
						{
							location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb61fdb0e387cbcc4&redirect_uri=http%3a%2f%2fwww.22dm.com%2fact%2fh5%2fflop%2findex.html&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
						}
						else
						{				
							flop.init();
						}
					}
				});	
			}
		});		
	}
	else
	{
		openid="00";
		$("#container").show();
		flop.user = openid;
		flop.init();
	}
})
function onNewScore(score) {
	console.info("score:"+score+",best:"+best);
	if(score>best){ //比历史记录高分
		best = game.score;
		dp_submitScore(game.score);		
	}
}
/*------------------------------------*/
function setCanvas() {
	var a = stage.canvas, b = window.innerWidth, c = window.innerHeight;
	if(c>960){
		$("#main").css({
			"top":(c - 960)>>1
		});	
	}
	if (SCREEN_SHOW_ALL) {
		var d = c;
		b / c > W / H ? b = W * c / H : c = H * b / W;
		//a.style.marginTop = (d - c) / 2 + "px";
	} else {
		d = W * c / H, b >= d ? (b = d, stage.x = 0) : stage.x = (b - d) / 2;
	}
	a.width = W;
	a.height = H;
	a.style.width = b + "px";
	a.style.height = c + "px";
}
createjs.DisplayObject.prototype.do_cache = function () {
	var a = this.getBounds();
	this.cache(a.x, a.y, a.width, a.height);
};
function ProgressBar(a, b) {
	this.initialize();
	this.w = a;
	this.h = b;
	this.logo=new createjs.Bitmap("img/doudouIcon.png");
	this.logo.x = a / 2-130;
	this.logo.y = b / 2-150;
	this.progressText = new createjs.Text("资源加载中..", "bold 24px Arial", "black");
	this.progressText.x = a / 2;
	this.progressText.y = b / 2;
	this.progressText.textAlign = "center";
	this.progressText.textBaseline = "middle";
	this.addChild(this.logo);
	this.addChild(this.progressText);
}
ProgressBar.prototype = new createjs.Container;
ProgressBar.prototype.completeCallback = function (a) {
	this.parent.removeChild(this);
};
ProgressBar.prototype.progressCallback = function (a) {
	this.progressText.text = "\u5df2\u52a0\u8f7d: " + parseInt(100 * a.progress) + "%";
};
ProgressBar.prototype.forQueue = function (a) {
	this.errorList = [];
	a.on("complete", this.completeCallback, this, !0);
	a.on("progress", this.progressCallback, this);
	a.on("error", function (a) {
	}, null, !0);
	a.on("error", function (a) {
		this.errorList.push(a.item.src);
	}, this);
};
function RepeatedImgLayer(a, b, c, d) {
	this.initialize();
	d = a.width + d;
	b += d;
	this.graphics.bf(a).r(0, 0, b, a.height);
	this.setBounds(0, 0, b, a.height);
	this.animation = createjs.Tween.get(this, {loop:!0}).to({x:-d}, d / c * 1000);
	this.do_cache();
}
RepeatedImgLayer.prototype = new createjs.Shape;
RepeatedImgLayer.prototype.setPaused = function (a) {
	this.animation.setPaused(a);
};
function ImageButton(a, b, c) {
	this.initialize();
	a = new createjs.Bitmap(queue.getResult(a));
	b && (b = new createjs.Bitmap(queue.getResult(b)), this.addChild(b), a.x = (b.image.width - a.image.width) / 2, a.y = (b.image.height - a.image.height) / 2);
	this.addChild(a);
	c && (c = this.getBounds(), this.regX = c.width / 2, this.regY = c.height / 2);
	this.on("mousedown", function () {
		this._addFilter(new createjs.ColorMatrixFilter((new createjs.ColorMatrix).adjustBrightness(-80)), "mouse");
	}, this);
	this.on("pressup", function () {
		this._removeFilter("mouse");
	}, this);
}
ImageButton.prototype = new createjs.Container;
ImageButton.prototype._addFilter = function (a, b) {
	a.tag = b;
	if (this.filters) {
		for (var c in this.filters) {
			if (this.filters[c].tag == b) {
				return;
			}
		}
		this.filters.push(a);
	} else {
		this.filters = [a];
	}
	this.do_cache();
};
ImageButton.prototype._removeFilter = function (a) {
	if (this.filters) {
		var b = [], c;
		for (c in this.filters) {
			var d = this.filters[c];
			a != d.tag && b.push(d);
		}
		this.filters = b;
		this.do_cache();
	}
};
ImageButton.prototype.setEnabled = function (a) {
	(this.mouseEnabled = a) ? this._removeFilter("disable") : (a = new createjs.ColorMatrixFilter((new createjs.ColorMatrix).adjustBrightness(-80).adjustSaturation(-100)), this._addFilter(a, "disable"));
};
function loadFollowRes() {
	USE_NATIVE_SHARE || queue.loadManifest({path:BASE_RES_DIR + "img/", manifest:[{src:"follow_anim.png", id:"follow"}]}, !1);
}
function addFollowAnim(a) {
	if (!USE_NATIVE_SHARE) {
		var b = new createjs.SpriteSheet({framerate:10, images:[queue.getResult("follow")], frames:{width:170, height:150}, animations:{show:[0, 4, !0]}});
		g_followAnim = new createjs.Sprite(b);
		g_followAnim.y = H;
		g_followAnim.name = "follow";
		g_followAnim.on("click", function () {
			window.open(FOLLOW_URL, "follow");
		});
		g_followAnim.visible = !1;
		void 0 == a ? stage.addChild(g_followAnim) : a.addChild(g_followAnim);
	}
}
function setFollowParent(a) {
	USE_NATIVE_SHARE || (g_followAnim.parent.removeChild(g_followAnim), a.addChild(g_followAnim));
}
function setFollowAnim(a) {
	if (!USE_NATIVE_SHARE && IS_REFFER) {
		var b = g_followAnim.getBounds();
		a ? (g_followAnim.play(), createjs.Tween.get(g_followAnim).to({regX:b.width, regY:0, visible:!0}).to({regX:0, regY:b.height}, 500)) : createjs.Tween.get(g_followAnim).to({regX:b.width, regY:0}, 500).to({visible:!1}).call(function () {
			g_followAnim.stop();
		});
	}
}
function zero_fill_hex(a, b) {
	for (var c = a.toString(16); c.length < b; ) {
		c = "0" + c;
	}
	return c;
}
function rgb2hex(a) {
	if ("#" == a.charAt(0)) {
		return a;
	}
	a = a.split(/\D+/);
	return "#" + zero_fill_hex(65536 * Number(a[1]) + 256 * Number(a[2]) + Number(a[3]), 6);
}
function hex2rgb(a) {
	var b = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
	a = a.toLowerCase();
	var c = new RGBAcolor;
	if (a && b.test(a)) {
		if (4 === a.length) {
			for (var b = "#", d = 1; 4 > d; d += 1) {
				b += a.slice(d, d + 1).concat(a.slice(d, d + 1));
			}
			a = b;
		}
		b = [];
		b.push(parseInt("0x" + a.slice(1, 3)));
		c.r = parseInt("0x" + a.slice(1, 3));
		b.push(parseInt("0x" + a.slice(3, 5)));
		c.g = parseInt("0x" + a.slice(3, 5));
		b.push(parseInt("0x" + a.slice(5, 7)));
		c.b = parseInt("0x" + a.slice(5, 7));
		c.rgbastring = "RGB(" + b.join(",") + ")";
		return c;
	}
	return a;
}
function RGBAcolor() {
	this.a = this.A = this.b = this.B = this.g = this.G = this.r = this.R = 0;
	this.rgbastring = null;
}
createjs.DisplayObject.prototype.setAnchorPoint = function (a, b) {
	var c = this.getBounds();
	this.regX = c.width * a;
	this.regY = c.height * b;
};
createjs.Container.prototype.addCenterChild = function (a) {
	a.setAnchorPoint(0.5, 0.5);
	var b = this.getBounds();
	a.x = b.x + 0.5 * b.width;
	a.y = b.y + 0.5 * b.height;
	this.addChild(a);
};

/*------------------------------------*/
var memory;
null == memory && (memory = {});
var game;
null == game && (game = {});
var queue;
(function () {
	Array.prototype.indexOf = function (a) {
		for (var b = 0; b < this.length; b++) {
			if (this[b] == a) {
				return b;
			}
		}
		return -1;
	};
	Array.prototype.remove = function (a) {
		a = this.indexOf(a);
		-1 < a && this.splice(a, 1);
	};
	Array.prototype.shuffle = function () {
		for (var a = this.length, b = 0; b < a; b++) {
			var c = Math.randomInt(a - b);
			this.push(this[c]);
			this.splice(c, 1);
		}
	};
	Array.prototype.clear = function () {
		this.length = 0;
	};
	Math.randomInt = function (a) {
		return parseInt(Math.random() * a);
	};
})();

;(function(){
	var numbSpritesheetData = {
			images: ["img/numb.png"],
			frames: {
				width: 32,
				height: 45
			},
			animations: {
				"0":0,
				"1":1,
				"2":2,
				"3":3,
				"4":4,
				"5":5,
				"6":6,
				"7":7,
				"8":8,
				"9":9
			}
		};
		var numbSpritesheet = new createjs.SpriteSheet(numbSpritesheetData);
		window.numbSpritesheet=numbSpritesheet;
})();
;(function () {
	game.qp_a = function (a) {
		return game.queue.getResult(a);
	};
	game.qp_b = function (a, b) {
		a = a * W / 4 + W / 8 + 2 * a;
		b = b * W / 4 + W / 8 + 4 * (b + 3);
		return [a, b];
	};
	game.qp_c = function (a) {
		if (2 <= game.arrOpenedCard.length) {
			for (; 0 < game.arrOpenedCard.length; ) {
				game.arrOpenedCard.pop().close();
			}
		}
		game.arrOpenedCard.push(a);
	};
	game.qp_d = function (a) {
		1 == game.arrOpenedCard.length && a.cid == game.arrOpenedCard[0].cid ? (a.dismiss(function () {
			game.score += 1;
			createjs.Sound.play("bonus", !0);
			0 >= game.gv.getNumChildren() && (game.qp_e(), game.score += 5);
		}), game.arrOpenedCard.pop().dismiss()) : game.qp_c(a);
	};
	game.qp_e = function () {
		game.arrOpenedCard = [];
		game.gv.clearCard();
		game.gv.mouseChildren = !0;
		for (var a = [], b = 0; 10 > b; b++) {
			a[2 * b] = a[2 * b + 1] = b % 6 + 1;
		}
		a.shuffle();
		game.gv.setupCard(a);
	};
	game.qp_f = function () {
		game.countDown = memory.qp_g;
		game.score = 0;
		game.gv.clearCard();
		game.view.renderStartView();	
	};
	game.qp_h = function () {
		clearInterval(game.interval);
		game.gv.mouseChildren = !1;
		game.view.addChild(new memory.Qp_i);
		score = game.score;
		onNewScore(score);
	};
})();
(function () {
	memory.qp_j = 4;//4列
	memory.qp_k = 5;//5行
	memory.qp_g = gameTime;//游戏时间
	memory.Qp_l = function () {
		this.initialize();
		this.x = this.y = 0;
		this.addChild(new createjs.Bitmap(game.qp_a("bg")));
		var a = new createjs.Bitmap;
		a.regX = 290;
		a.regY = 80;
		a.x = 320;
		a.y = 450;
		this.ready = function (b) {
			a.image = game.qp_a("ready");
			this.addChild(a);
			a.scaleX = a.scaleY = 3;
			a.regX = a.getBounds().width / 2;
			a.regY = a.getBounds().height / 2;
			a.alpha = 0;
			createjs.Tween.get(a).to({alpha:1, scaleX:1, scaleY:1}, 300).to({}, 900).call(function () {
				a.image = game.qp_a("go");
				a.regX = a.getBounds().width / 2;
				a.regY = a.getBounds().height / 2;
				createjs.Tween.get(a).to({scaleX:1}, 300).to({alpha:0}, 200).call(function () {
					a.parent.removeChild(a);
					b();
				});
			});
		};
		this.startBtnHandler=function (){
				if(startBtnHandler_once){
					startBtnHandler_once = false;
					/*reset Data*/
					game.countDown = memory.qp_g;
					game.score = 0;
					game.gv.clearCard();
					/*reset Data*/
					game.view.ready(function () {
					game.qp_e();
					game.interval = setInterval(function () {
						game.countDown -= 1;
						 0 >= game.countDown && game.qp_h();
						//game.qp_h();
					}, 1000);
					game.view.startContainer.removeAllEventListeners();
					game.view.startContainer.removeAllChildren();
					});
					var bgShape=new createjs.Shape()
					bgShape.graphics.beginFill("rgba(255,255,255,0.8)").drawRect(0,0,stage.canvas.width,stage.canvas.height);
					game.view.startContainer.addChild(bgShape);				
				}
			}
		this.renderStartView=function(){  //开始页面
			this.startBgImg=new createjs.Bitmap(game.qp_a("startbg"));
			this.startBgImg.x=0;
			this.startBgImg.y=0;
			this.buttonHolder=new createjs.Shape();
			this.buttonHolder.graphics.beginFill("rgba(0,0,0,0.01)").drawRect(0,0,270,120);
			this.buttonHolder.x=175;
			this.buttonHolder.y=680;
			this.buttonHolder.on("click",this.startBtnHandler);
			this.buttonRank=new createjs.Shape();
			this.buttonRank.graphics.beginFill("rgba(0,0,0,0.01)").drawRect(0,0,270,120);
			this.buttonRank.x=175;
			this.buttonRank.y=810;
			this.buttonRank.on("click",dp_Ranking);
			this.startContainer=new createjs.Container();
			this.startContainer.addChild(this.startBgImg,this.buttonHolder);
			this.startContainer.addChild(this.startBgImg,this.buttonRank);
			this.addChild(this.startContainer);		
		}
	};
	memory.Qp_m = function () {
		this.initialize();
		this.x = W / 2;
		this.y = H / 2-80;
		this.regX = W / 2;
		this.regY = H / 3;
		this.scaleX = this.scaleY = 0.9;
		this.setupCard = function (a) {
			for (var b = 0; b < a.length; b++) {
				var c = parseInt(b / memory.qp_k), c = new memory.Qp_n(c, b % memory.qp_k, a[b]);
				this.addChild(c);
			}
		};
		this.clearCard = function () {
			this.removeAllChildren();
		};
	};
	memory.Qp_o = function () {
		this.initialize();
		var a=new createjs.BitmapText("0",numbSpritesheet);
		a.x = 200;
		var b=new createjs.BitmapText(memory.qp_g+"",numbSpritesheet);
		b.x = 530;
		a.y = b.y = H / 8 / 2+5;
		a.regY = b.regY = a.getBounds().height / 2;
		this.addChild(a, b);
		this.on("tick", function (c) {
			a.text = game.score+"";
			b.text = game.countDown+"";
		});
	};
	memory.Qp_n = function (a, b, c) {
		this.initialize();
		this.x = game.qp_b(a, b)[0];
		this.y = game.qp_b(a, b)[1];
		this.scaleX = this.scaleY = this.initScale = 150 / 130;
		this.cid = c;
		this.mouseChildren = !1;
		a = new createjs.Bitmap(game.qp_a(c));
		a.name = "bm";
		var d = new createjs.Bitmap(game.qp_a("back"));
		d.name = "back";
		var e = new createjs.Shape;
		e.name = "frame";
		e.graphics.beginFill("#50afc3").drawRect(8, 8, a.getBounds().width + 2, a.getBounds().height + 2).endFill();
		e.graphics.beginStroke("#ffffff").setStrokeStyle(10).drawRect(2, 2, a.getBounds().width - 2, a.getBounds().height - 2).endStroke();
		e.visible = !1;
		this.regX = d.getBounds().width / 2;
		this.regY = d.getBounds().height / 2;
		this.addChild(e, a, d);
		this.onClick(function (a) {
			a.target.open();
		});
		this.open = function () {
			d.visible && (this.mouseEnabled = !1, createjs.Tween.get(this).to({scaleX:0}, 50).call(function () {
				d.visible = !1;
				e.visible = !0;
				createjs.Tween.get(this).to({scaleX:this.initScale}, 50).call(function () {
					game.qp_d(this);
					this.mouseEnabled = !0;
				});
			}), createjs.Sound.play("flip", !0));
		};
		this.close = function () {
			d.visible || (this.mouseEnabled = !1, createjs.Tween.get(this).to({scaleX:0}, 50).call(function () {
				d.visible = !0;
				e.visible = !1;
				createjs.Tween.get(this).to({scaleX:this.initScale}, 50).call(function () {
					this.mouseEnabled = !0;
				});
			}));
		};
		this.dismiss = function (a) {
			createjs.Tween.get(this).wait(200).to({rotation:1080, scaleX:0, scaleY:0}, 100).call(function () {
				this.parent.removeChild(this);
				a && a();
			});
		};
	};
	memory.Qp_i = function () {
		this.initialize();
		this.setBounds(0, 0, W, H);
		var a = new createjs.Bitmap(game.qp_a("gameover"));
		a.regX = 250;
		a.regY = 30;
		a.x = 320;
		a.y = 170;
		var bg=new createjs.Bitmap(game.qp_a("overbg"))
		bg.x=38;
		bg.y=250;
		var d=new createjs.BitmapText(game.score+"",numbSpritesheet);
		d.y = 345;
		var www=best<0?"0":(best+"");
		var e =new createjs.BitmapText(www,numbSpritesheet);
		e.y = 435;
		d.x = e.x = 410;
		d.textBaseline = e.textBaseline = "middle";
		var f = new createjs.Shape();//再来一次
		f.x = 200;
		f.graphics.beginFill("rgba(0,0,0,0.01)").drawRect(0,0,230,110);
		var h = new createjs.Shape(); //分享
		h.graphics.beginFill("rgba(0,0,0,0.01)").drawRect(0,0,230,110);
		h.x = 440;
		f.regX = h.regX = 115;
		f.regY = h.regY = 40;
		f.y = h.y = 590;
		var g =  new createjs.Shape(); //排行榜
		g.graphics.beginFill("rgba(0,0,0,0.01)").drawRect(0,0,280,110);
		g.regX = 125;
		g.regY = 42;
		g.x = 280;
		g.y = 740;
		var l = new createjs.Shape, k = this.getBounds();
		l.graphics.beginFill("#000000").drawRect(k.x, k.y, k.width, k.height);
		l.alpha = 0.6;
		this.addChild(l, bg,a,  d, e, f, g, h);
		f.onClick(function (a) {
			startBtnHandler_once = true;
			game.view.removeChild(a.target.parent);
			game.qp_f();
			game.view.startBtnHandler();
		});
		g.onClick(function (a) {
			dp_Ranking(); 
		});
		h.onClick(function (a) {
			dp_share(); 
		});
	};
	memory.Qp_m.prototype = new createjs.Container;
	memory.Qp_o.prototype = new createjs.Container;
	memory.Qp_n.prototype = new createjs.Container;
	memory.Qp_i.prototype = new createjs.Container;
	memory.Qp_l.prototype = new createjs.Container;
	createjs.DisplayObject.prototype.onClick = function (a) {
		this.on("click", function (b) {
			createjs.Touch.isSupported() && b.nativeEvent.constructor == MouseEvent || a(b);
		});
	};
})();


function loadResource() {
	SCREEN_SHOW_ALL = !0;
	var a = new ProgressBar(0.8 * W, 40);
	a.regX = a.w / 2;
	a.regY = a.h / 2;
	a.x = W / 2;
	a.y = H / 2;
	stage.addChild(a);
	queue = game.queue = new createjs.LoadQueue(!1);
	queue.setMaxConnections(30);
	queue.on("complete", setup, null, !0);
	queue.loadManifest({path:RES_DIR + "img/", manifest:[{src:"1.jpg", id:"1"}, {src:"2.jpg", id:"2"}, {src:"3.jpg", id:"3"}, {src:"4.jpg", id:"4"}, {src:"5.jpg", id:"5"}, {src:"6.jpg", id:"6"}, {src:"back.png", id:"back"}, {src:"ready.png", id:"ready"}, {src:"go.png", id:"go"},{src:"start.jpg",id:"startbg"}, {src:"bg.jpg", id:"bg"}, {src:"topline.png", id:"topline"}, {src:"bestscore.png", id:"bestscore"}, {src:"curscore.png", id:"curscore"}, {src:"gameover.png", id:"gameover"}, {src:"end.png",id:"overbg"}]}, !1);
	a.forQueue(queue);
	queue.load();
}
function setup() {
	game.view = new memory.Qp_l;
	game.gv = new memory.Qp_m;
	game.sv = new memory.Qp_o;
	game.view.addChild(game.gv, game.sv);
	stage.addChild(game.view);
	game.qp_f();
}
function getQueryString(name)
{
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r!=null)return  unescape(r[2]); return null;
}
