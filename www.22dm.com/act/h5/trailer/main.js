var isPc = false;
var v_all = null;
var breakpoint = [31.2,94.3,163.0,192.0];
var weixinData={
	shareTitle:'2018原创动力新片巡礼',
	shareDesc:'《喜羊羊与灰太狼》的最新绝密情报在此！',
	shareLink:'http://www.22dm.com/act/h5/trailer/index.html',
	shareImg:'http://www.22dm.com/act/h5/trailer/res/public/icon.jpg'
}
var winSize = {
	width       : 1137,
	height      : 640,
	scale       : 1,
	loadcount   : 0, 
	loadres     : [],
	loadtag     : "dialogs_preload",
	precentWidth: 185,
	video       : null,
	interval    : 300, //300毫秒检测一次视频播放进度
	breakpoint  : [31.2,94.3,163.0,192.0],
	timer_video : null,
	xiWidth     : 193,
	xiHeight    : 220,
	xiTop       : 0,
	xiLeft      : 0,
	xiArrvied   : false,
	movable     : false,
	offsetX     : 0,
	offsetY     : 0,
	targetPosition : [650,310],
	timer_xi    : null,
	loadResFinish : function(){
		console.info("loadResFinish");
		v_all.active = '';
		winSize.video = $('#videostart')[0];
		wx.ready(function (){
			cc.audioEngine.playMusic(res.audio_part_1, false);
			cc.audioEngine.stopMusic(); 
			cc.audioEngine.playMusic(res.audio_part_2, false);
			cc.audioEngine.stopMusic(); 
			cc.audioEngine.playMusic(res.audio_part_3, false);
			cc.audioEngine.stopMusic(); 
		});	
		$("#videostart").attr("controls","controls");
		v_all.start();
		//v_all.active = 'part_3';
	},
	listen : function(){
		var play = winSize.video.play();
		winSize.timer_video = setInterval(function(){
			if(v_all.active==""){
				if(winSize.video.currentTime<0.5 && winSize.video.currentTime>0){
					console.info("removeAttr");
					$("#videostart").removeAttr("controls");
				}
				if(winSize.video.currentTime>winSize.breakpoint[0]){
					console.info(winSize.video.currentTime);
					winSize.video.pause();
					v_all.active = 'part_'+(5-winSize.breakpoint.length);
					clearInterval(winSize.timer_video);
				}
			}
		},winSize.interval)
	},
	next : function(){
		winSize.breakpoint.splice(0,1);
		if(winSize.breakpoint.length!=0){
			winSize.listen();
		}
		else{
			v_all.start();
		}
	},
	resize : function(){
		var width = $(window).width();
		var height = $(window).height();
		var marginTop = 0;
		if(!isPc){
			if(height<winSize.width){  //手机需要缩放
				winSize.scale = (height/winSize.width).toFixed(4);
				marginTop = -(winSize.width-height)/2;
				console.info("scale: "+ winSize.scale);
				$("body").css({
					"width" : width,
					"height" : height
				});
			}
			else{
				marginTop = (height-winSize.width)>>1;
			}
			$("#all").css({
				"marginTop" : marginTop,      
				"width" : winSize.height,
				"height" : winSize.width,
				'webkitTransform':'scale('+winSize.scale+')',
				'transform':'scale('+winSize.scale+')'
			});
			$("#video_layer,#dialogs").addClass("rotate");
		}
		else{
			$("#landscape").remove();
		}
		$("#all").show();
	},
	addXiListen:function(){
		if(isPc){
			document.getElementById("xi").addEventListener("mousedown",function(event){
				if(!winSize.xiArrvied){
					winSize.offsetX = event.offsetX;
					winSize.offsetY = event.offsetY;
					winSize.movable = true;
					if(winSize.timer_xi!=null)
						clearInterval(winSize.timer_xi);
					winSize.timer_xi = setInterval(winSize.xiRun,150);
					event.preventDefault();
				}
			});
			document.getElementById("part_2").addEventListener("mousemove",function(event){
				if(winSize.movable && !winSize.xiArrvied){
					winSize.movable = false;
					var delta = {x:event.offsetX-winSize.offsetX,y:event.offsetY-winSize.offsetY};
					if(Math.abs(delta.x)>2 || Math.abs(delta.y)>2){
						var pos = {x:winSize.xiLeft+delta.x,y:winSize.xiTop+delta.y};
						if(pos.x>-100 && pos.x <(winSize.width-100) && pos.y>-100 && pos.y<(winSize.height-100))
						{
							winSize.xiLeft = pos.x;
							winSize.xiTop = pos.y;
							$("#xi").css({
								top : pos.y,
								left: pos.x
							});
							if(pos.x>winSize.targetPosition[0]-100 && pos.x<winSize.targetPosition[0]+100 && pos.y>winSize.targetPosition[1]-50 && pos.y<winSize.targetPosition[1]+50){  //到达目的地
								winSize.xiArrvied = true;
								v_all.trainRun();
								return 0;
							}
						}
					}
					winSize.movable = true;
				}
			});
			document.getElementById("part_2").addEventListener("mouseup",function(event){
				if(winSize.movable && !winSize.xiArrvied){
					winSize.movable = false;
					clearInterval(winSize.timer_xi);
					$("#xi").addClass("active");
					$("#xi_run a").removeClass("active");
				}
			});
		}
		else{
			document.getElementById("xi").addEventListener("touchstart",function(event){
				if(!winSize.xiArrvied){
					winSize.offsetX = event.touches[0].pageX;
					winSize.offsetY = event.touches[0].pageY;
					winSize.movable = true;
					if(winSize.timer_xi!=null)
						clearInterval(winSize.timer_xi);
					winSize.timer_xi = setInterval(winSize.xiRun,150);
					event.preventDefault();
				}
			});
			document.getElementById("part_2").addEventListener("touchmove",function(event){
				if(winSize.movable && !winSize.xiArrvied){
					winSize.movable = false;
					var delta = {x:event.touches[0].pageX-winSize.offsetX,y:event.touches[0].pageY-winSize.offsetY};
					//console.info(delta);
					if(Math.abs(delta.x)>2 || Math.abs(delta.y)>2)
					{
						//var pos = {x:winSize.xiLeft+delta.y,y:winSize.xiTop+delta.x};
						var pos = {x:event.touches[0].pageY-winSize.xiWidth/2,y:640-event.touches[0].pageX-winSize.xiHeight/2};
						if(pos.x>-100 && pos.x <(winSize.width-100) && pos.y>-100 && pos.y<(winSize.height-100))
						{
							$("#xi").css({
								top : pos.y,
								left: pos.x
							});
							winSize.xiLeft = pos.y;
							winSize.xiTop = pos.x;
							if(pos.x>winSize.targetPosition[0]-100 && pos.x<winSize.targetPosition[0]+100 && pos.y>winSize.targetPosition[1]-50 && pos.y<winSize.targetPosition[1]+50){  //到达目的地
								winSize.xiArrvied = true;
								v_all.trainRun();
								return 0;
							}
						}
					}
					winSize.movable = true;
					event.preventDefault();
				}
			});
			document.getElementById("part_2").addEventListener("touchend",function(event){
				if(winSize.movable && !winSize.xiArrvied){
					winSize.movable = false;
					clearInterval(winSize.timer_xi);
					$("#xi").addClass("active");
					$("#xi_run a").removeClass("active");
				}
			});
		}
	},
	xiRun : function(){
		if(winSize.movable){
			$("#xi").removeClass("active");
			var index = $("#xi_run").find("a.active").index();
			var i = 0;
			if(index!=-1){
				i = index < 2 ? index+1 : 0; 
			}
			$("#xi_run").children().eq(i).addClass("active").siblings().removeClass("active");
		}
	}
}
$(function(){
	isPc = IsPC();
	winSize.resize();
	if(getQueryString("debug")!=null)
		breakpoint = [1,3,5,7];
	initWxJsSdk();
	vueInit();
})
function vueInit(){
	v_all = new Vue({
		el: '#all',
		data: {
			active  : 'preload',
			share   : false,
			option_carrot:false,
			option_file:false,
			option_pan:false,
			option_xi:true,
			option_train : false
		},
		methods : {
			onRestart : function(){
				this.active = '';
				winSize.next();
			},
			onShare : function(){
				this.share = !this.share;
			},
			start : function(){
				this.option_carrot = false;
				this.option_file = false;
				this.option_pan = false;
				this.option_xi = true;
				winSize.timer_video = null;
				if(winSize.breakpoint.length==0)
					winSize.video.load();
				//winSize.video.pause();
				winSize.breakpoint =  breakpoint.slice(0);
				winSize.listen();
				console.info("reset");
			},
			part1Entry : function(){
				cc.audioEngine.playMusic(res.audio_part_1, true);
			},
			part1Complete : function(){
				setTimeout(function(){
					v_all.active='';
					winSize.next();
					cc.audioEngine.stopMusic();
				},300)
			},
			part2Entry : function(){
				cc.audioEngine.playMusic(res.audio_part_2, true);
				$("#train").css({
					top : 180,
					left : winSize.width+200
				}).addClass("active");
				$("#train").delay(800).animate({left : 480},800,"swing")
				$("#train").animate({left : 500},200,"swing",function(){
					console.info("part2Entry: finish");
					if(!winSize.xiArrvied)
						winSize.addXiListen();
					else
						winSize.xiArrvied = false;
				});
				$("#xi").css({
					top : 365,
					left : 200
				}).addClass("active");
				winSize.xiTop = 365;
				winSize.xiLeft = 200;
				setTimeout(function(){
					cc.audioEngine.playEffect(res.audio_train,false);  
				},800)
			},
			part2Complete : function(){
				cc.audioEngine.stopMusic();
				winSize.next();
			},
			part3Complete : function(){
				winSize.next();
			},
			part4Entry : function(){
				cc.audioEngine.playMusic(res.audio_part_3, true);
			},
			part4Complete : function(){
				cc.audioEngine.stopMusic();
			},
			trainRun : function(){
				clearInterval(winSize.timer_xi);
				$("#xi").removeClass("active");
				$("#xi_run a").removeClass("active");
				$("#train").addClass("run").delay(500).animate({left : 520},200,"swing");
				setTimeout(function(){
					cc.audioEngine.playEffect(res.audio_train,false);  
				},400)
				$("#train").animate({left : -600},800,"swing",function(){
					$("#train").removeClass("active").removeClass("run");
					v_all.active='';
				});
			}
		}
	});
	cc.game.run();
	registerEvent();
}
function registerEvent(){
	$("#part_1 .select").click(function(){	
		switch($(this).attr("index")*1){
			case 0:
				if(!v_all.option_carrot){
					v_all.option_carrot = true;
					cc.audioEngine.playEffect(res.audio_faile,false);  
				}
				break;
			case 1:
				if(!v_all.option_file){
					v_all.option_file = true;
					cc.audioEngine.playEffect(res.audio_success,false);  
				}
				break;
			case 2:
				if(!v_all.option_pan){
					v_all.option_pan = true;
					cc.audioEngine.playEffect(res.audio_faile,false);  
				}
				break;
		}
	});
	$("#part_3").click(function(){
		v_all.active = '';
	})
}
cc.game.onStart = function() {
	winSize.loadres=g_resources;
	winSize.loadcount=0;
	loadGameResources();
};
function loadGameResources(){
	cc.loader.load(winSize.loadres[winSize.loadcount],function(err){
		if(winSize.loadcount>=winSize.loadres.length-1){ //全部加载完毕
			winSize.loadResFinish();
		}
		else{
			winSize.loadcount++;
			var loading = $("#"+winSize.loadtag+" .precent_main");
			var precent = (winSize.loadcount/(winSize.loadres.length-1)).toFixed(2);
			var width = precent*winSize.precentWidth;
			$("#"+winSize.loadtag+" .precent_word").text(Math.ceil(precent*100)+"%");
			if(!$(loading).is(":animated"))
				loading.animate({width:(winSize.precentWidth+20)*winSize.loadcount/(winSize.loadres.length-1)+"px"});
			else
				loading.stop().animate({width:(winSize.precentWidth+20)*winSize.loadcount/(winSize.loadres.length-1)+"px"});
			loadGameResources();
		}
	})
}
function initWxJsSdk(){
	$.ajax({
		cache: false,
		async: false,
		type: "POST",
		url: '/act/getWeiXinToken.ashx',
		data:{
			thisUrl:(location.href.split('#')[0])
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
			wx.ready(function (){
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
	});
}
function IsPC(){
	var userAgentInfo = navigator.userAgent;
	var Agents = ["Android", "iPhone","SymbianOS", "Windows Phone","iPad", "iPod"];
	var flag = true;
	for (var v = 0; v < Agents.length; v++) {
		if (userAgentInfo.indexOf(Agents[v]) > 0) {
			flag = false;
			break;
		}
	}
	return flag;
}
function getQueryString(name){
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r!=null)return (r[2]); return null;
}