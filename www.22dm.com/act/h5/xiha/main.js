var isPC=false,token,openid,debug=false,act_id=28;
var userInfo={
    openid    : "test_act_id_28",
    name      : "test",
    face      : "res/icon.jpg",
    sex       : "1",
    country   : "GuangZhou",
    province  : "GuangDong",
    score     : 0,
    rankingList  : [],
    hightest  : 0
}
var winSize = {
    width         : 640,
    height        : 1008,
    runingLayer   : '',         //当前运行场景
    backgroundLoopTimer: 50,    //背景循环时间
    ship          : null,
    shipSpeedX    : 10,
    shipSpeedY    : 10,
    bulletLoop    : 0.25,       //发炮间隔
    bulletSpeed   : 1.25,       //炮弹速度
    audioVolume   : 0.5,        //音量
    globalSpeed   : 1,          //正常速度
    iceSpeed      : 0.5,        //冰封速度
    transformTime : 12,         //变身时间
    transformTipsLimit : 2,      //变身提示次数
    loadres       : [],
    loadcount     : 0,
    isMoonDay     : false
}
$(function(){
	isPC = IsPC();
	init();
})
cc.game.onStart = function() {
	var width = $(window).width();
	var height = $(window).height();
	$("#all").css({
		"top":(height-1008)/2,
		"left":(width-640)/2
	});
	$("#preload").show();  
    cc.LoaderScene.preload(g_resources, function(){
	    cc.view.setDesignResolutionSize(640, 1008, cc.ResolutionPolicy.SHOW_ALL);
	    cc.spriteFrameCache.addSpriteFrames(res.btn_plist,res.btn_png);
	    cc.spriteFrameCache.addSpriteFrames(res.gp_main_plist,res.gp_main_png);

        cc.director.runScene(new MainMenuScene());
        //cc.director.runScene(new GamePlayScene(0)); 
        // var data ={
        //     score  : 500,
        //     title  : "天空保卫者",
        //     isNew  : true
        // };
        // cc.director.runScene(new GameResultScene(data));
    	$("#preload").hide();
        if(isPC)
			gamePadInit();
    }, this);
};
var jsondesc = function(x,y)  
{  
    return (x["score"] < y["score"]) ? 1 : -1  
}  
var xiha = {
	ranking : {
		getList : function(){
			if(isPC){
				var data = localStorage.getItem("act_28");
				//console.info(decodeURI(data));
				if(data==null){
					localStorage.setItem("act_28", "[]"); 
				}
				else if(JSON.parse(decodeURI(data)).length>0){
					userInfo.rankingList=JSON.parse(decodeURI(data)).sort(jsondesc);
					userInfo.hightest = userInfo.rankingList[0].score;
				}		
				xiha.ranking.appendList();
			}
			else{
				$.ajax({
					cache: false,
					async: false,
					type: "POST",
					url: 'getGameLogs.ashx',
					data: {
						"init":1,
						"user": userInfo.openid,
						"act_id":act_id
					},
					success: function (response) {
						//console.info(response);
						var r = JSON.parse(response);
						userInfo.hightest=r.hightest;
						userInfo.rankingList=r.rankingList;
						xiha.ranking.appendList();
					}
				});	
			}
		},
		appendList : function(){
			var html ='';
			if(isPC){
				for(var i=0;i<userInfo.rankingList.length && i<6;i++){
					html += '<li>';
					html += '<img class="item_face" src="'+userInfo.face+'" width="102" height="102" /><a class="item_bg"></a>';
					html += '<a class="item_name">'+userInfo.rankingList[i].name+'</a>';
					html += '<a class="item_score">'+userInfo.rankingList[i].score+'</a>';
					html += '<a class="item_number_'+(i+1)+'"></a>';
					html += '</li>';
				}	
			}
			else{
				for(var i=0;i<userInfo.rankingList.length && i<6;i++){
					html += '<li>';
					html += '<img class="item_face" src="'+userInfo.rankingList[i].json.face+'" width="102" height="102" /><a class="item_bg"></a>';
					html += '<a class="item_name">'+userInfo.rankingList[i].json.name+'</a>';
					html += '<a class="item_score">'+userInfo.rankingList[i].score+'</a>';
					html += '<a class="item_number_'+(i+1)+'"></a>';
					html += '</li>';
				}			
			}
			$("#ranking").empty().html(html);		
		},
		addScore : function(score,bulletCount,level){
			var date = new Date();
        	var addtime = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
			var json = '';
			if(isPC){
				json = '{"name":"'+xiha.getTitle(score)+'","score":'+score+',"bulletCount":'+bulletCount+',"level":'+level+',"addtime":"'+addtime+'"}'
				//console.info(json);
				userInfo.rankingList.push(JSON.parse(json));
				localStorage.setItem("act_28", encodeURI(JSON.stringify(userInfo.rankingList))); 
				for(var i=0;i<userInfo.rankingList.length;i++){
					if(score>=userInfo.rankingList[i].score || userInfo.rankingList.length<10){
						xiha.ranking.getList();
						break;
					}
				}
			}
			else{
				json = '{"score":'+score+',"bulletCount":'+bulletCount+',"level":'+level+',"name":"'+userInfo.name+'","face":"'+userInfo.face+'","addtime":"'+addtime+'"}';
				$.ajax({
					cache: false,
					async: false,
					type: "POST",
					url: 'getGameLogs.ashx',
					data: {
						"init":0,
						"user": userInfo.openid,
						"score":score,
						"count":bulletCount,
						"json": json,
						"act_id":act_id
					},
					success: function (response) {
						for(var i=0;i<userInfo.rankingList.length;i++){
							if(score>=userInfo.rankingList[i].score || userInfo.rankingList.length<10){
								xiha.ranking.getList();
								break;
							}
						}
					}
				});	
			}
		},
		open:function(){
			$("#rankingList").show();		
		},
		close:function(){
			$("#rankingList").hide();
		}
	},
	getTitle : function(score){
		var title = '';
		if(score<=5000)
			title = '小菜鸟';
		else if(score<=10000)
			title = '见习船员';
		else if(score<=20000)
			title = '嘻哈船员';
		else if(score<=30000)
			title = '嘻哈大副';
		else if(score<=40000)
			title = '嘻哈船长';
		else
			title = '天空保卫者';
		return title;
		
	}
}
function init(){
	if(!isPC){
		if(getQueryString("code")==null){
			location.href = weixinData.loginUrl;
		}
		else{
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
						userInfo.openid = openid;
						$.ajax({
							cache: false,
							async: false,
							type: "POST",
							url: '/act/center/openIdCrossDomain.ashx',
							data: {
								"type": "GET",
								"url": 'https://api.weixin.qq.com/sns/userinfo?access_token='+token+'&openid='+openid+'&lang=zh_CN',
							},
							success: function (res) {
								var r = JSON.parse(res);
								userInfo.name = r.nickname;
								userInfo.face = r.headimgurl != "" ? r.headimgurl : 'http://www.22dm.com/act/h5/xiha/res/icon.jpg';
								userInfo.sex = r.sex;
                            	userInfo.country = r.country;
                            	userInfo.province = r.province;
                            	cc.game.run();
								xiha.ranking.getList();
								initWxJsSdk();
							}
						});					
					}
				}
			});
			
		}
	}
	else{
		cc.game.run();
		xiha.ranking.getList();
	}
}
function gamePadInit(){
    gamepad  = new Gamepad();
    gamepad.init();
    gamepad.bind(Gamepad.Event.AXIS_CHANGED, function(e) {
    	if(winSize.runingLayer!="GamePlayScene_index"){
	        if(e.axis=="LEFT_STICK_Y" && Math.abs(e.value)>=0.95){ //上下选择
	            var event = null;
	            var EventName = null;
	            switch(winSize.runingLayer){
	                case "MainMenuScene_index":
	                    EventName = jf.EventName.MM_SELECT;
	                    break;
	                case "GameResultScene_index":
	                    EventName = jf.EventName.GS_SELECT;
	                    break; 
	                case "GamePlayScene_menu":
	                	EventName = jf.EventName.GP_SELECT;
	                	break;  
	            }
	            if(EventName!=null){
	                event = new cc.EventCustom(EventName);
	                event.setUserData({
	                    value : e.value
	                });       
	                cc.eventManager.dispatchEvent(event); 
	            }
	        }
    	}
    });

    gamepad.bind(Gamepad.Event.BUTTON_DOWN, function(e) {
        var layer = winSize.runingLayer;
        if(e.control=="FACE_2"){
            var event = null;
            switch(layer){
                case "GamePlayScene_index":
                	winSize.ship.fire = true;
                	break;
                case "GamePlayScene_menu":
                	event = new cc.EventCustom(jf.EventName.GP_CLICK);
                	break;
                case "MainMenuScene_index":
                    event = new cc.EventCustom(jf.EventName.MM_CLICK);
                    break;
                case "MainMenuScene_rule":
                    event = new cc.EventCustom(jf.EventName.MM_REMOVE_RULE_LAYER);
                    break;
                case "MainMenuScene_ranking":
                    winSize.runingLayer = "MainMenuScene_index";
                    xiha.ranking.close();
                    break;
                case "GameResultScene_index":
                    event = new cc.EventCustom(jf.EventName.GS_CLICK);
                    break;
                case "GameResultScene_ranking":
                    winSize.runingLayer = "GameResultScene_index";
                    xiha.ranking.close();
                    break;
                default :
                	xiha.ranking.close();
                	break;
            }
            if(event!=null)
                cc.eventManager.dispatchEvent(event); 
        }
        else if(e.control=="START_FORWARD" &&　layer=="GamePlayScene_index"){
            event = new cc.EventCustom(jf.EventName.GP_CREATE_MENU_LAYER);
            cc.eventManager.dispatchEvent(event); 
        }
        else if(e.control=="SELECT_BACK" && layer=="GamePlayScene_index"){
            cc.director.runScene(new MainMenuScene());
        }
    });
    gamepad.bind(Gamepad.Event.TICK, function(e) {
        if(winSize.runingLayer=="GamePlayScene_index"){
            var x = e[0].axes[0];
            var y = e[0].axes[1];
            if(Math.abs(x)>0.1 || Math.abs(y)>0.1){
                var dx = winSize.ship.x+x*winSize.shipSpeedX;
                var dy = winSize.ship.y-y*winSize.shipSpeedY
                if(dx>winSize.ship.width/5 && dx<winSize.width-winSize.ship.width/5){
                    winSize.ship.x = dx;
                }
                if(dy>winSize.ship.height/4 && dy<winSize.height-winSize.ship.height/4){
                    winSize.ship.y = dy;
                }
            }
        }
    });
   	gamepad.bind(Gamepad.Event.BUTTON_UP, function(e) {
    	if(winSize.runingLayer == "GamePlayScene_index"){
		    winSize.ship.fire = false;	
    	}
	});
}
var weixinData={
    init    : false,
    loginUrl:'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb61fdb0e387cbcc4&redirect_uri=http%3a%2f%2fwww.22dm.com%2fact%2fh5%2fxiha%2findex.html&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect',
    shareTitle:'嘻哈闯世界3',
    shareDesc:'嘻哈飞船变身闯关，多种能力等你挑战！羊羊带你一飞冲天，荣耀凯旋。',
    shareLink:'http://www.22dm.com/act/h5/xiha/index.html',
    shareImg :'http://www.22dm.com/act/h5/xiha/res/icon.jpg'
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
			//console.info(res);
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
		wx.onMenuShareTimeline({
			title: weixinData.shareDesc, 
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
function IsPC()
{
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
function getQueryString(name)
{
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r!=null)return (r[2]); return null;
}




