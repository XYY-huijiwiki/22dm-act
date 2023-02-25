var token, openid, nickname, headimgurl, sex, country, province, act_id = 15, debug;
$(function () {
	// wx.onMenuShareTimeline({
	// 	title: '《深海历险记》之冲出海洋', // 分享标题
	// 	link: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb61fdb0e387cbcc4&redirect_uri=http%3a%2f%2fwww.22dm.com%2fact%2fh5%2fdeep%2findex.html&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect', // 分享链接
	// 	imgUrl: 'http://www.22dm.com/act/h5/deep/static/img/icon.png', // 分享图标
	// 	success: function () { 
	// 		// 用户确认分享后执行的回调函数

	// 	},
	// 	cancel: function () { 
	// 		// 用户取消分享后执行的回调函数
	// 	}
	// });
	// wx.onMenuShareAppMessage({
	// 	title: '《深海历险记》之冲出海洋', // 分享标题
	// 	desc: '帮助喜羊羊冲出海底世界，重回青青草原吧！但要小心黑溜溜的袭击哦', // 分享描述
	// 	link: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb61fdb0e387cbcc4&redirect_uri=http%3a%2f%2fwww.22dm.com%2fact%2fh5%2fdeep%2findex.html&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect', // 分享链接
	// 	imgUrl: 'http://www.22dm.com/act/h5/deep/static/img/icon.png', // 分享图标
	// 	type: 'link', // 分享类型,music、video或link，不填默认为link
	// 	dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
	// 	success: function () { 
	// 		// 用户确认分享后执行的回调函数

	// 	},
	// 	cancel: function () { 
	// 		// 用户取消分享后执行的回调函数
	// 	}
	// });
	// debug = false;
	debug = true;
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
				deep.user = openid;
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
						if (typeof (openid) == "undefined") {
							location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb61fdb0e387cbcc4&redirect_uri=http%3a%2f%2fwww.22dm.com%2fact%2fh5%2fdeep%2findex.html&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
						}
						else {
							$("#container").show();
							deep.init();
						}
					}
				});
			}
		});
	}
	else {
		$("#container").show();
		deep.init();
	}
});
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
			var info = '{"name":"' + name + '","tel":"' + tel + '","address":"' + address + '"}';
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
		// 		"user": deep.user,
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
		alert('对不起,你本次活动没有上榜。')
	},
	open: function () {
		$("#award").show();
	},
	close: function () {
		$("#award").hide();
	}
};
var deep = {
	user: null,
	score: 0,
	scoreList: null,
	init: function () { //获取我的分数以及排行榜
		// $.ajax({
		// 	cache: false,
		// 	async: false,
		// 	type: "POST",
		// 	url: '/act/h5/deep/doDeepScore.ashx',
		// 	data: {
		// 		"act_id":act_id,
		// 		"init": "1",
		// 		"user": deep.user
		// 	},
		// 	success: function (response) {
		// 		//console.info(response);
		// 		var result = JSON.parse(response);
		// 		deep.score = result.score;
		// 		deep.scoreList = result.scoreList;
		// 		deep.addScoreList();
		// 		gameMonitor.init();//开始游戏				
		// 	}
		// });	
		deep.score = 100;
		deep.scoreList = [
			{
				json: {
					img: './static/user/羊年喜羊羊_头像_慢羊羊.jpg',
					name: '慢羊羊',
					addtime: '2017-02-10 23:59:59',
					score: '100'
				},
				user: '01'
			}, {
				json: {
					img: './static/user/羊年喜羊羊_头像_喜羊羊.jpg',
					name: '喜羊羊',
					addtime: '2017-02-10 23:59:59',
					score: '99'
				},
				user: '02'
			}, {
				json: {
					img: './static/user/羊年喜羊羊_头像_美羊羊.jpg',
					name: '美羊羊',
					addtime: '2017-02-10 23:59:59',
					score: '95'
				},
				user: '03'
			}, {
				json: {
					img: './static/user/羊年喜羊羊_头像_灰太狼.jpg',
					name: '灰太狼',
					addtime: '2017-02-10 23:59:59',
					score: '94'
				},
				user: '04'
			}, {
				json: {
					img: './static/user/羊年喜羊羊_头像_暖羊羊.jpg',
					name: '暖羊羊',
					addtime: '2017-02-10 23:59:59',
					score: '90'
				},
				user: '05'
			}, {
				json: {
					img: './static/user/羊年喜羊羊_头像_小灰灰.jpg',
					name: '小灰灰',
					addtime: '2017-02-10 23:59:59',
					score: '85'
				},
				user: '06'
			}, {
				json: {
					img: './static/user/羊年喜羊羊_头像_红太狼.jpg',
					name: '红太狼',
					addtime: '2017-02-10 23:59:59',
					score: '80'
				},
				user: '07'
			}, {
				json: {
					img: './static/user/羊年喜羊羊_头像_沸羊羊.jpg',
					name: '沸羊羊',
					addtime: '2017-02-10 23:59:59',
					score: '70'
				},
				user: '08'
			}, {
				json: {
					img: './static/user/羊年喜羊羊_头像_懒羊羊.jpg',
					name: '懒羊羊',
					addtime: '2017-02-10 23:59:59',
					score: '60'
				},
				user: '09'
			}, {
				json: {
					img: './static/user/Karsten.jpg',
					name: 'Karsten',
					addtime: '2017-02-10 23:59:59',
					score: '40'
				},
				user: '10'
			},
		];
		deep.addScoreList();
		gameMonitor.init();//开始游戏	
	},
	addScoreList: function () {
		var html = '';
		var list = deep.scoreList;
		console.log(list);
		for (var i = 0; i < list.length; i++) {//增加记录
			html += '<li><img class="p_image" src="' + list[i].json.img + '" width="60" height="60" /><a class="p_name">' + list[i].json.name + '</a><a class="p_time">' + list[i].json.addtime + '</a><a class="p_score">厉害了小伙，你捕获了' + list[i].json.score + '个海洋之星！继续前进！！！</a><a class="p_index">' + (i + 1) * 1 + '</a></li>';
		}
		$("#paihan_main").empty().append(html);
	},
	addScore: function (score, time) {
		nickname, headimgurl, sex, country, province;
		var json = '{"addtime":"str_addtime","score":"' + score + '","name":"' + nickname + '","img":"' + headimgurl + '","usetime":"' + time + '","sex":"' + sex + '","country":"' + country + '","province":"' + province + '"}';
		console.info(json);
		// $.ajax({
		// 	cache: false,
		// 	async: false,
		// 	type: "POST",
		// 	url: '/act/h5/deep/doDeepScore.ashx',
		// 	data: {
		// 		"act_id": act_id,
		// 		"init": "0",
		// 		"type": "add",
		// 		"user": deep.user,
		// 		"score": score,
		// 		"json": json
		// 	},
		// 	success: function (response) {
		// 		console.info('更新记录成功');
		// 	}
		// });
	},
	closeP: function () {
		$("#paihanPanel").hide();
	},
	getPrize: function () {
		var time = new Date();
		var now = time.getTime();
		if (now < Date.parse("2017/02/11 00:00:00")) {
			var hasPrize = false;
			for (var i = 0; i < deep.scoreList.length; i++) {
				if (deep.scoreList[i].user == openid) {
					hasPrize = true;
				}
			}
			if (hasPrize) {
				console.info(openid);
				award.open();
			}
			else {
				console.info(openid);
				$(".paihan_tips").empty().html('您本次没有上榜哦!');
				return false;
			}
		}
		else {
			$(".paihan_tips").empty().html('排行榜截止于2017-02-10,请于结束后再来领取奖品!');
			return false;
		}
	}
};

var gameMonitor = {
	w: 640,
	h: 1008,
	bgWidth: 640,
	bgHeight: 1008,
	time: 0,
	timmer: null,
	bgSpeed: 2,
	bgloop: 0,
	score: 0,
	im: new ImageMonitor(),
	foodList: [],
	bgDistance: 0,//背景位置
	eventType: {
		start: 'touchstart',
		move: 'touchmove',
		end: 'touchend'
	},
	init: function () {
		var _this = this;
		var canvas = document.getElementById('stage');
		var ctx = canvas.getContext('2d');
		if (!gameMonitor.isMobile()) {
			gameMonitor.eventType.start = 'mousedown';
			gameMonitor.eventType.move = 'mousemove';
			gameMonitor.eventType.end = 'mouseup';
		}
		//绘制背景
		var bg = new Image();
		_this.bg = bg;
		bg.src = 'static/img/bg.jpg';
		bg.onload = function () {
			ctx.drawImage(bg, 0, 0, _this.bgWidth, _this.bgHeight);
		};
		_this.initListener(ctx);
	},
	initListener: function (ctx) {
		var _this = this;
		var body = $(document.body);
		$(document).on(gameMonitor.eventType.move, ".gamepanel", function (event) {
			event.preventDefault();
		});
		body.on(gameMonitor.eventType.start, '.replay, .playagain', function () {
			$('#resultPanel').hide();
			var canvas = document.getElementById('stage');
			var ctx = canvas.getContext('2d');
			_this.ship = new Ship(ctx);
			_this.ship.controll();
			_this.reset();
			_this.run(ctx);
		});

		body.on(gameMonitor.eventType.start, '#frontpage', function () {
			$('#frontpage').css('left', '-100%');
		});

		body.on(gameMonitor.eventType.start, '#guidePanel', function () {
			$(this).hide();
			_this.ship = new Ship(ctx);
			_this.ship.paint();
			_this.ship.controll();
			gameMonitor.run(ctx);
		});

		body.on(gameMonitor.eventType.start, '.share', function () { //显示分享
			$('.weixin-share').show().on(gameMonitor.eventType.start, function () {
				$(this).hide();
			});
		});
		body.on(gameMonitor.eventType.start, '.paihan', function () { //显示排行榜
			$('#paihanPanel').show().on(gameMonitor.eventType.start, '.hidePaiHan', function () {
				$(this).hide();
			});
		});
	},
	rollBg: function (ctx) {
		if (this.bgDistance >= this.bgHeight) {
			this.bgloop = 0;
		}
		this.bgDistance = ++this.bgloop * this.bgSpeed;
		ctx.drawImage(this.bg, 0, this.bgDistance - this.bgHeight, this.bgWidth, this.bgHeight);
		ctx.drawImage(this.bg, 0, this.bgDistance, this.bgWidth, this.bgHeight);
	},
	run: function (ctx) {
		$("#gamepanel").click();
		var _this = gameMonitor;
		ctx.clearRect(0, 0, _this.bgWidth, _this.bgHeight);
		_this.rollBg(ctx);

		//绘制飞船
		_this.ship.paint();
		_this.ship.eat(_this.foodList);


		//产生月饼
		_this.genorateFood();

		//绘制月饼
		for (i = _this.foodList.length - 1; i >= 0; i--) {
			var f = _this.foodList[i];
			if (f) {
				f.paint(ctx);
				f.move(ctx);
			}

		}
		_this.timmer = setTimeout(function () {
			gameMonitor.run(ctx);
		}, Math.round(1000 / 60));

		_this.time++;
	},
	stop: function () {
		var _this = this;
		$('#stage').off(gameMonitor.eventType.start + ' ' + gameMonitor.eventType.move);
		setTimeout(function () {
			clearTimeout(_this.timmer);
		}, 0);

	},
	genorateFood: function () {
		var genRate = 50; //产生月饼的频率
		var random = Math.random();
		if (random * genRate > genRate - 1) {
			var left = Math.random() * (this.w - 50);
			var type = Math.floor(left) % 2 == 0 ? 0 : 1;
			var id = this.foodList.length;
			var f = new Food(type, left, id);
			this.foodList.push(f);
		}
	},
	reset: function () {
		this.foodList = [];
		this.bgloop = 0;
		this.score = 0;
		this.timmer = null;
		this.time = 0;
		$('#score').text(this.score);
	},
	getScore: function () {
		var time = Math.floor(this.time / 60);
		var score = this.score;
		var user = 1;
		if (score == 0) {
			$('#scorecontent').html('真遗憾，您竟然<span class="lighttext">一个</span>海洋之星都没有抢到！');
			$('.btn1').text('').removeClass('share').addClass('playagain');
			$('#fenghao').removeClass('geili yinhen').addClass('yinhen');
			return;
		}
		else if (score < 10) {
			user = 2;
		}
		else if (score > 10 && score <= 20) {
			user = 10;
		}
		else if (score > 20 && score <= 40) {
			user = 40;
		}
		else if (score > 40 && score <= 60) {
			user = 80;
		}
		else if (score > 60 && score <= 80) {
			user = 92;
		}
		else if (score > 80) {
			user = 99;
		}
		$('#fenghao').removeClass('geili yinhen').addClass('geili');
		$('#scorecontent').html('您在<span id="stime" class="lighttext">0</span>秒内捕获了<span id="sscore" class="lighttext">21341</span>个海洋之星<br>超过了<span id="suser" class="lighttext">0%</span>的用户！');
		$('#stime').text(time);
		$('#sscore').text(score);
		$('#suser').text(user + '%');
		$('.btn1').removeClass('playagain').addClass('share');
		if (score > deep.score) {//更新记录
			deep.score = score;
			deep.addScore(score, time);
		}
	},
	isMobile: function () {
		var sUserAgent = navigator.userAgent.toLowerCase(),
			bIsIpad = sUserAgent.match(/ipad/i) == "ipad",
			bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os",
			bIsMidp = sUserAgent.match(/midp/i) == "midp",
			bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4",
			bIsUc = sUserAgent.match(/ucweb/i) == "ucweb",
			bIsAndroid = sUserAgent.match(/android/i) == "android",
			bIsCE = sUserAgent.match(/windows ce/i) == "windows ce",
			bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile",
			bIsWebview = sUserAgent.match(/webview/i) == "webview";
		return (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM);
	}
};

function Ship(ctx) {
	gameMonitor.im.loadImage(['static/img/player.png']);
	this.width = 113;
	this.height = 140;
	this.left = gameMonitor.w / 2 - this.width / 2;
	this.top = gameMonitor.h - 2 * this.height;
	this.player = gameMonitor.im.createImage('static/img/player.png');
	this.paint = function () {
		ctx.drawImage(this.player, this.left, this.top, this.width, this.height);
	};
	this.setPosition = function (event) {
		if (gameMonitor.isMobile()) {
			var tarL = event.changedTouches[0].clientX;
			var tarT = event.changedTouches[0].clientY;
		}
		else {
			var tarL = event.offsetX;
			var tarT = event.offsetY;
		}
		this.left = tarL - this.width / 2 - 16;
		this.top = tarT - this.height / 2;
		if (this.left < 0) {
			this.left = 0;
		}
		if (this.left > 640 - this.width) {
			this.left = 640 - this.width;
		}
		if (this.top < 0) {
			this.top = 0;
		}
		if (this.top > gameMonitor.h - this.height) {
			this.top = gameMonitor.h - this.height;
		}
		this.paint();
	};

	this.controll = function () {
		var _this = this;
		var stage = $('#gamepanel');
		var currentX = this.left,
			currentY = this.top,
			move = false;
		stage.on(gameMonitor.eventType.start, function (event) {
			_this.setPosition(event);
			move = true;
		}).on(gameMonitor.eventType.end, function () {
			move = false;
		}).on(gameMonitor.eventType.move, function (event) {
			event.preventDefault();
			if (move) {
				_this.setPosition(event);
			}

		});
	};

	this.eat = function (foodlist) {
		for (var i = foodlist.length - 1; i >= 0; i--) {
			var f = foodlist[i];
			if (f) {
				var l1 = this.top + this.height / 2 - (f.top + f.height / 2);
				var l2 = this.left + this.width / 2 - (f.left + f.width / 2);
				var l3 = Math.sqrt(l1 * l1 + l2 * l2);
				if (l3 <= this.height / 2 + f.height / 2) {
					foodlist[f.id] = null;
					if (f.type == 0) {
						gameMonitor.stop();
						$('#gameoverPanel').show();

						setTimeout(function () {
							$('#gameoverPanel').hide();
							$('#resultPanel').show();
							gameMonitor.getScore();
						}, 2000);
					}
					else {
						$('#score').text(++gameMonitor.score);
						$('.heart').removeClass('hearthot').addClass('hearthot');
						setTimeout(function () {
							$('.heart').removeClass('hearthot');
						}, 200);
					}
				}
			}

		}
	};
}

function Food(type, left, id) {
	this.speedUpTime = 300;
	this.id = id;
	this.type = type;
	this.width = 80;
	this.height = 80;
	this.left = left;
	this.top = -50;
	this.speed = 0.04 * Math.pow(1.2, Math.floor(gameMonitor.time / this.speedUpTime));
	this.loop = 0;
	var p = this.type == 0 ? 'static/img/food1.png' : 'static/img/food2.png';
	this.pic = gameMonitor.im.createImage(p);
}
Food.prototype.paint = function (ctx) {
	ctx.drawImage(this.pic, this.left, this.top, this.width, this.height);
};
Food.prototype.move = function (ctx) {
	if (gameMonitor.time % this.speedUpTime == 0) {
		this.speed *= 1.2;
	}
	this.top += ++this.loop * this.speed;
	if (this.top > gameMonitor.h) {
		gameMonitor.foodList[this.id] = null;
	}
	else {
		this.paint(ctx);
	}
};
function ImageMonitor() {
	var imgArray = [];
	return {
		createImage: function (src) {
			return typeof imgArray[src] != 'undefined' ? imgArray[src] : (imgArray[src] = new Image(), imgArray[src].src = src, imgArray[src]);
		},
		loadImage: function (arr, callback) {
			for (var i = 0, l = arr.length; i < l; i++) {
				var img = arr[i];
				imgArray[img] = new Image();
				imgArray[img].onload = function () {
					if (i == l - 1 && typeof callback == 'function') {
						callback();
					}
				};
				imgArray[img].src = img;
			}
		}
	};
}
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]); return null;
}

