var act_id=37,debug=0,token, openid;
var audio_main=null,audio_ranking=null,timer_add=null;
var v_main;
var weixinData={
	loginUrl:'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb61fdb0e387cbcc4&redirect_uri=http%3a%2f%2fwww.22dm.com%2fact%2fh5%2fchildren%2findex.html&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect',
	shareLink:'http://www.22dm.com/act/h5/children/index.html',
	shareTitle:'喜羊羊之欢乐打地鼠',
	shareDesc:'要奖品就来一起玩吧！',
	shareImg:'http://www.22dm.com/act/h5/children/res/Public/icon.jpg'
}
var userInfo={
	openid    : "test_37",
	name      : "test",
	face      : "res/Public/icon.jpg",
	sex       : '1',
	country   : 'GuangZhou',
	province  : 'GuangDong' ,
	hightest  : 0,
	hasShare  : true
}
var winSize = {
	width       : 640,
	height      : 1136,
	scale       : 1,
	scaleOffsetX:0,
	scaleOffsetY:0,
	GameTime    : 45,
	IceTime     : 5,
	getTheme : function(score){
		if(score<=200)
			return 0;
		else if(score<=500)
			return 1;
		else if(score<=1000)
			return 2;
		else if(score<=20000)
			return 3;
		else
			return 4;
	},
	ranking : {
		getRankingList:function(){
        	$.ajax({
	            cache: false,
	            async: false,
	            type: "POST",
	            url: '/act/h5/deep/doDeepScore.ashx',
	            data: {
	                "act_id":act_id,
	                "init": "1",
	                "user": userInfo.openid
	            },
	            success: function (response) {
	                //console.info(response);
	                var result = JSON.parse(response);
	                userInfo.hightest = result.score;
					v_main.recordList = result.scoreList;        
	            }
	        });
	    },
		addScore : function(score){
			var json = '{"addtime":"str_addtime","score":"'+score+'","name":"'+userInfo.name+'","img":"'+userInfo.face+'","sex":"'+userInfo.sex+'","country":"'+userInfo.country+'","province":"'+userInfo.province+'"}';
	        //console.info(json);
	        userInfo.hightest = score;
	        $.ajax({
	            cache: false,
	            async: false,
	            type: "POST",
	            url: '/act/h5/deep/doDeepScore.ashx',
	            data:{
	                "act_id":act_id,
	                "init": "0",
	                "type": "add",
	                "user": userInfo.openid,
	                "score":score,
	                "json":json
	            },
	            success: function (response) {
	                winSize.ranking.getRankingList();
	            } 
	        });	
		},
		getPrize:function(){
	        var time = new Date();
	        var now = time.getTime();
	        if (now > Date.parse("2018/09/01 00:00:00")){
	            var hasPrize = false;
	            for (var i = 0; i < v_main.recordList.length; i++) {
	                if (v_main.recordList[i].user == userInfo.openid) {
	                    hasPrize = true;
	                }
	            }
	            if (hasPrize) {
	                v_main.active='award';
	            }
	            else {
	                alert('您本次没有上榜哦!');
	                return false;
	            }
	        }
	        else {
	            alert('排行榜截止于2018-08-31,请于结束后再来领取奖品!');
	            return false;
	        }
	    }
	},
	playEffect : function(effect){
		//timer_danger
		//button
		//game_over
		//mouse
		//lose
		//prize
		//forbid
		cc.audioEngine.playEffect(res["audio_"+effect],false);
	},
	setEffectsVolume : function(volume){
		audio_main.volume = volume;
		audio_ranking.volume = volume;
        cc.audioEngine.setEffectsVolume(volume);
	},
	resize : function(){
		var width = $(window).width();
		var height = $(window).height();
		$("body").css({
			"width":width,
			"height":height,
			"overflow" : "hidden"
		})
		if(height<1040){  //手机需要缩放
			winSize.scale = (height/1040).toFixed(4);
			winSize.scaleOffsetX = winSize.width*(1-winSize.scale)/2
			winSize.scaleOffsetY = winSize.height*(1-winSize.scale)/2
			$("#all").css({
				'webkitTransform':'scale('+winSize.scale+')',
				'transform':'scale('+winSize.scale+')'
			});

		}
		console.info("scale: "+winSize.scale);
		$("#all").show();
	}
}
var dialogs = {
	loadcount : 0, 
	loadres   : [],
	loadtag   : "dialogs_preload",
	precentWidth : 330,
	loadResFinish:function(){
		cc.spriteFrameCache.addSpriteFrames(res.gp_main_plist,res.gp_main_png);
		cc.spriteFrameCache.addSpriteFrames(res.gp_role_plist,res.gp_role_png);
		cc.spriteFrameCache.addSpriteFrames(res.gs_theme_plist,res.gs_theme_png);
		v_main.active='';
		cc.director.runScene(new MainMenuScene());
		
		//v_main.Game_resert();
		//cc.director.runScene(new GamePlayScene());

		//cc.director.runScene(new GameResultScene({score:100,theme:0}));
	}
}
function vueInit(){
    v_main = new Vue({
        el: '#all',
        data: {
        	active   : '',
			tips     : '',
			recordList : [],
			guide    : false,
			share    : true,
			Game_level : 10,
			Game_score : 0,
			Game_time  : 4500,
			Game_hp    : 3,
			Game_Ice   : 3,
			Game_Bomb  : 3,
			isHammer   : false
        },
        watch : {
			Game_score : function(newValue,oldValue){
				if(!GameManager.isGameOver){
					GameManager.totalScore += newValue-oldValue;
					cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_UPDATE_SCORE_TEXT));
				}
			},
			Game_hp : function(newValue,oldValue){
				//console.info("new:"+newValue+" old:"+oldValue);
				if(!GameManager.isGameOver){
					if(newValue>=0 && newValue<=3){
						var event = new cc.EventCustom(jf.EventName.GP_UPDATE_HP);
						event.setUserData({isAdd:newValue>oldValue?true:false});
						cc.eventManager.dispatchEvent(event);
					}
					else if(newValue<0){
						cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_GAME_OVER));
					}
				}
			},
			Game_time : function(newValue,oldValue){
				if(!GameManager.isGameOver){
					if(newValue>=0){
						cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_UPDATE_TIMER_TEXT));
					}
					else
						cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_GAME_OVER));
				}
			},
			Game_Ice : function(newValue,oldValue){
				var event = new cc.EventCustom(jf.EventName.GP_UPDATE_SKILL_NUM);
				event.setUserData({type:0,num:newValue});
				cc.eventManager.dispatchEvent(event);
				if(oldValue>newValue){
					var event_ice = new cc.EventCustom(jf.EventName.GP_LOAD_SKILL_ICE);
					event_ice.setUserData({
						callback : function(){
							GameManager.isSkilling = false;
							cc.director.getScheduler().setTimeScale(1);
						}
					});
					GameManager.isSkilling = true;
					cc.eventManager.dispatchEvent(event_ice);
					cc.director.getScheduler().setTimeScale(0.5);
					winSize.playEffect('ice');
				}
			},
			Game_Bomb : function(newValue,oldValue){
				var event = new cc.EventCustom(jf.EventName.GP_UPDATE_SKILL_NUM);
				event.setUserData({type:1,num:newValue});
				cc.eventManager.dispatchEvent(event);
				if(oldValue>newValue){
					GameManager.isSkilling = true;
					v_main.isHammer = true;
					var event_bomb = new cc.EventCustom(jf.EventName.GP_LOAD_SKILL_BOMB);
					event_bomb.setUserData({
						callback : function(){
							GameManager.isSkilling = false;
							v_main.isHammer = false;
							cc.director.getScheduler().setTimeScale(1);
						}
					});
					cc.eventManager.dispatchEvent(event_bomb);
					cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_BOMB_RUN));
					cc.director.getScheduler().setTimeScale(0.5);
					winSize.playEffect('bomb');
				}
			}
        },
        methods:{
			Game_resert : function(){
				GameManager.isGameOver = true;
				this.Game_level = 0;
				this.Game_hp = 3;
				GameManager.totalScore = 0;
				this.Game_next();
			},
			Game_next : function(){
				GameManager.isGameOver = true;
				this.Game_level++;
				this.Game_score = 0;
				this.Game_time = winSize.GameTime;
				cc.director.getScheduler().setTimeScale(1);
				cc.director.runScene(new GamePlayScene());
			},
			Game_wolf : function(data){
				var random = Math.random();
				if(random<0.35){
					this.Game_score+=5;
					var event = new cc.EventCustom(jf.EventName.GP_ADD_SCORE_TIP);
					event.setUserData({location:data,score:5});
					cc.eventManager.dispatchEvent(event);
				}
				else if(random<0.7)
					this.Game_add_time(data);
				else
					this.Game_add_hp(data);
			},
			Game_add_hp : function(data){
				if(this.Game_hp<3){
					this.Game_hp++;
					var event = new cc.EventCustom(jf.EventName.GP_ADD_HP_TIP);
					event.setUserData(data);
					cc.eventManager.dispatchEvent(event);
				}
				else
					this.Game_add_time(data);
			},
			Game_add_time : function(data){
				this.Game_time+=5;
				var event = new cc.EventCustom(jf.EventName.GP_ADD_TIME_TIP);
				event.setUserData(data);
				cc.eventManager.dispatchEvent(event);
			},
			Game_add_hammer : function(x,y){
				//v_main.isHammer = true;
				var event = new cc.EventCustom(jf.EventName.GP_ADD_HAMMER);
				event.setUserData({x:x/winSize.scale,y:y/winSize.scale});
				cc.eventManager.dispatchEvent(event);
			},
			cancelShare : function(){
				this.tips = '';
				var event = new cc.EventCustom(jf.EventName.GP_CREATE_DIALOGS_LAYER);
				event.setUserData({
                    text:"游戏结束",
                    tips:'',
					cb:function(){
                        cc.director.runScene(new GameResultScene({score:GameManager.totalScore,theme:winSize.getTheme(GameManager.totalScore)}));
					}.bind(this)
				});
				cc.eventManager.dispatchEvent(event);
			},
			shareReturn : function(){
				if(this.tips!=''){
					//alert('share:OK');
					this.tips = '';
					//this.share=true;
					this.Game_hp++;
					this.Game_next();
				}
			},
			recordEntry : function(){
				audio_main.pause();
				audio_ranking.load();
				audio_ranking.play();
			},
			recordLeave : function(){
				audio_ranking.pause();
				audio_main.load();
				audio_main.play();
			},
			guideLeave : function(){
				this.guide = true;
				this.Game_level = 0;
				this.Game_next();
			}
        },
        filters : {
        	getMonth : function(time){
        		return (new Date(Date.parse(time.replace(/-/g,"/"))).getMonth()+1);
        	},
        	getDay : function(time){
        		return (new Date(Date.parse(time.replace(/-/g,"/"))).getDate());
        	}
		},
		mounted : function(){
			this.active='preload';
			cc.game.run();
		}
    });
	winSize.ranking.getRankingList();
}
$(function(){
	audio_main = document.getElementById('gameMusic');
	audio_ranking = document.getElementById('rankingMusic');
	doUserLogin();
	document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
		WeixinJSBridge.call('hideToolbar');
		//
	});
	document.getElementById("dialogs_award").addEventListener("touchmove",function(event){event.preventDefault();});
	document.getElementById("dialogs_preload").addEventListener("touchmove",function(event){event.preventDefault();});
	document.getElementById("dialogs_rule").addEventListener("touchmove",function(event){event.preventDefault();});
	document.getElementById("dialogs_share").addEventListener("touchmove",function(event){event.preventDefault();});
	document.getElementById("dialogs_guide").addEventListener("touchmove",function(event){event.preventDefault();});
})
function doUserLogin(){
	if(!debug){
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
				if(typeof(openid)=="undefined")
				{
					location.href = weixinData.loginUrl;
				}
				else
				{
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
							userInfo.openid = openid;
							userInfo.name = r.nickname;
							userInfo.face = r.headimgurl != "" ? r.headimgurl : weixinData.shareImg;
							userInfo.sex = r.sex;
							userInfo.ountry = r.country;
							userInfo.province = r.province;		
							vueInit();
							initWxJsSdk();
							winSize.resize();
						}
					});				
				}
			}
		})
	}
	else{
		vueInit();
		audio_main.play();
		winSize.resize();
	}
}
cc.game.onStart = function() {
	dialogs.loadres=g_resources;
    dialogs.loadcount=0;
    loadGameResources();
};
function loadGameResources(){
	cc.loader.load(dialogs.loadres[dialogs.loadcount],function(err){
		if(dialogs.loadcount>=dialogs.loadres.length-1){ //全部加载完毕
			dialogs.loadResFinish();
		}
		else{
			dialogs.loadcount++;
			var loading = $("#"+dialogs.loadtag+" .precent_main");
			var precent = (dialogs.loadcount/(dialogs.loadres.length-1)).toFixed(2);
			var width = precent*dialogs.precentWidth;
			$("#"+dialogs.loadtag+" .precent_word").text(Math.ceil(precent*100)+"%");
			if(!$(loading).is(":animated"))
				loading.animate({width:(dialogs.precentWidth+20)*dialogs.loadcount/(dialogs.loadres.length-1)+"px"});
			else
				loading.stop().animate({width:(dialogs.precentWidth+20)*dialogs.loadcount/(dialogs.loadres.length-1)+"px"});
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
		}
	});
	wx.ready(function (){	
		//alert("ready ok1");
		wx.onMenuShareTimeline({
			title:weixinData.shareTitle,
			link: weixinData.shareLink,
			imgUrl: weixinData.shareImg,
			success: function () { 
				//alert("onMenuShareTimeline ok");
				v_main.shareReturn();
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
				//alert("onMenuShareTimeline ok");
				v_main.shareReturn();
			},
			cancel: function () { 
				console.info("onMenuShareAppMessage cancel");
			}
		});
		audio_main.play();
		winSize.resize();
	});	
}
function getQueryString(name){
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r!=null)return (r[2]); return null;
}
var award = {
    check: function (user) {
        $("#award_tips").empty();
        var name = $("#award_name").val();
        var tel = $("#award_tel").val();
        var address = $("#award_address").val();
        var result = "";
        if (name=="") {
            result = "请输入收件人姓名!";
        }
        else if (tel.length != 11) {
            result = "请输入11位收件人手机号码!";
        }
        else if (address == "" || address.length<8) {
            result = "请输入详细的收件人地址!";
        }
        if (result == "") { //都正确
        	var date = new Date();
        	var addtime = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
            var info = '{"name":"'+name+'","tel":"'+tel+'","address":"'+address+'","addtime":"'+addtime+'"}';
            award.post(info);
        }
        else {
            $("#award_tips").text(result);
            return false;
        }
    },
    post: function (info) {
        $.ajax({
            cache: false,
            async: false,
            type: "POST",
            url: '/act/h5/deep/doDeepScore.ashx',
            data: {
                "act_id": act_id,
                "init": "0",
                "type": "award",
                "user": userInfo.openid,
                "info": info
            },
            success: function (response) {
                var result = JSON.parse(response);
                if (result.success) {
                    alert(result.returnStr);
                }
                else {
                    alert(result.returnStr);
                }
            }
        });
    }
}