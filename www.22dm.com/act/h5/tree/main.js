var act_id=35,debug=0,token, openid;
var v_main,v_main;
var weixinData={
	state  : null,
	isShare:false, // 是否为分享出去的链接 , false: 由公众号入口进入自己参与
	loginUrl:'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb61fdb0e387cbcc4&redirect_uri=http%3a%2f%2fwww.22dm.com%2fact%2fh5%2ftree%2findex.html&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect',
	shareTitle:'喜羊羊邀你“种树”拿好礼',
	shareDesc:'快来助力喜羊羊“植树”活动，帮我赢取羊村好礼！',
	shareFinish : '我正在和喜羊羊共同为植树节助力，现在参与还有机会赢取羊村好礼，一起来吧！',
	shareLink:'http://www.22dm.com/act/h5/tree/index.html?active=share',
	shareImg:'http://www.22dm.com/act/h5/tree/res/Public/icon.jpg'
}
var userInfo={
	cpe       : false,
	own       : false,
	openid    : "test_act_id_35",
	shareid   : "test_act_id_35",
	name      : "test",
	face      : "res/Public/icon.jpg",
	sex       : '1',
	country   : 'GuangZhou',
	province  : 'GuangDong' ,
	hasSign   : false,
	hasAgain  : false,
	canAgain  : false,
	prize     : 0
}
var winSize = {
	width       : 640,
	height      : 1008,
	tvId        : 5,
	videoList   : null,
	prizeName   : ['喜羊羊水杯(蓝色)','喜羊羊水杯(黄色)','喜羊羊水杯(粉色)','《智趣羊学堂》公仔(喜羊羊)','《智趣羊学堂》仔(美羊羊)','《智趣羊学堂》公仔(懒羊羊)','《智趣羊学堂》书包'],
	tips : function(content,btn,callback){
		v_main.tips = content;
		v_main.tipsBtn = btn;
		v_main.tipsCallBack = callback;
	},
	onWater : function(i){
		var w = new cc.EventCustom(jf.EventName.GP_WATER);
        w.setUserData({index:i})
        cc.eventManager.dispatchEvent(w);
	},
	hasGrowUp : function(i){
		v_main.treeGrowed[i] = true;
		v_main.introduceId = v_main.treeOrder[i];
		console.info("第 "+i+" 棵小数已经长大!");
		if(userInfo.own){   //是我自己
			if(v_main.shareList.length!=6){  //
				if(!userInfo.hasAgain){  //提示看视频可以再种一次
					winSize.tips('你成功种下了第'+(i+1)+'棵小树~前往观看剧集有机会再种一棵哦!',['sure','back'],'introduce');
				}
				else{
					winSize.tips('你成功种下了第'+(i+1)+'棵小树!',['sure','back'],'introduce');
				}
			}
			else{  //前往抽奖
				winSize.tips('你成功种下了第'+(i+1)+'棵小树!任务已经完成,点击确定前往抽奖吧!',['sure','back'],'prize');
			}
		}
		else{// 助力成功!提示好友参与活动
			winSize.tips('你帮他(她)种下了第'+(i+1)+'棵小树~快来一起参与活动抽大奖吧!',['sure','back'],'ercode');
		}
	}
}
var dialogs = {
	loadcount : 0, 
	loadres   : [],
	loadtag   : "dialogs_preload",
	precentWidth : 185,
	loadResFinish:function(){
		v_main.active='';
		$("#main").show();
		cc.spriteFrameCache.addSpriteFrames(res.gp_tree_0_plist,res.gp_tree_0_png);
		cc.spriteFrameCache.addSpriteFrames(res.gp_tree_1_plist,res.gp_tree_1_png);
		cc.spriteFrameCache.addSpriteFrames(res.gp_tree_2_plist,res.gp_tree_2_png);
		cc.director.runScene(new GamePlayScene());
	}
}
function vueInit(){
    v_main = new Vue({
        el: '#all',
        data: {
        	btn_sign    : '',
        	btn_record  : '',
        	active   : '',
        	tips     : '', 
        	tipsBtn  : ['sure','back'],
        	tipsCallBack : 'introduce',
        	shareList   : [],
        	introduceId : 0,
        	treeOrder   : [1,0,2,4,3,5],
        	treeGrowed  : [false,false,false,false,false,false],
        	videoSrc    : ['XMzM5MTE2MzE2NA','XMzM5MDk5NDY5Ng','XMzM5MTE0ODc2OA','XMzM5MTAyMjc5Ng','XMzM5MTIxMzA0OA','XMzM5MTA1OTA5Ng']
        },
        computed : {
        	progress : function(){
        		console.info(this);
        		return 0;
        	},
        	playIntroduceVideo : function(){
        		var src = "<iframe height=305 width=518 src='http://player.youku.com/embed/"+this.videoSrc[this.introduce]+"==' frameborder=0 'allowfullscreen'></iframe>";
        		return src;
        	}
        },
        methods:{
        	sure : function(){
				this.tips='';
				this.active = this.tipsCallBack;
				if(this.active=='introduce'){
					if(userInfo.hasSign&&!userInfo.hasAgain&&!userInfo.canAgain&&userInfo.own){
						userInfo.canAgain = true;
						this.btn_sign = 'again';
						console.info("获得了再种一次的机会");
					}
				}
				return true;
			},
			back : function(){
				this.tips='';
			},
			palyTV : function(){
				this.active='video';
				playVideo(0);
				if(userInfo.hasSign&&!userInfo.hasAgain&&!userInfo.canAgain&&userInfo.own){
					userInfo.canAgain = true;
					this.btn_sign = 'again';
					console.info("获得了再种一次的机会");
				}
			},
			playIntroduce : function(id){
				this.introduceId = id;
				this.active='introduce';
				if(userInfo.hasSign&&!userInfo.hasAgain&&!userInfo.canAgain&&userInfo.own){
					userInfo.canAgain = true;
					this.btn_sign = 'again';
					console.info("获得了再种一次的机会");
				}
			}
        },
        filters : {
        	getMonth : function(time){
        		return (new Date(Date.parse(time.replace(/-/g,"/"))).getMonth()+1);
        	},
        	getDay : function(time){
        		return (new Date(Date.parse(time.replace(/-/g,"/"))).getDate());
        	}
        }
    });
    $("#all").show();
    v_main.active='preload';
    init();
    cc.game.run(); //画面绘制
    registerEvent();
}
$(function(){
	var width = $(window).width();
	var height = $(window).height();
	//alert(width+','+height);
	if(width>640)
		$("#all").css("left",(width-640)>>1);
	if(height>1008)
		$("#all").css("top",(height-1008)>>1);
	// 禁用默认滑动
    $(document).on("touchmove",function(e){
        e.preventDefault();
    });
	doUserLogin();
})
function init(){
	//获取state
	weixinData.state = decodeURIComponent(getQueryString("state"));
	//console.info(weixinData.state);
	if(weixinData.state!='STATE'){
		if(getQueryString2("from",weixinData.state)!=null)
			userInfo.cpe = true;
		if(debug&&getQueryString2("openid",weixinData.state)!=null)
			userInfo.openid = getQueryString2("openid",weixinData.state);
		if(getQueryString2("active",weixinData.state)!=null){
			weixinData.isShare = true;
			userInfo.shareid = getQueryString2("shareid",weixinData.state);
			if(userInfo.shareid==userInfo.openid)
				userInfo.own = true;
		}
		else{
			userInfo.shareid = userInfo.openid;
			userInfo.own = true;
		}
	}
	if(userInfo.cpe){
		$.ajax({
			cache: false,
			async: false,
			type: "POST",
			url: '../gift/progress.ashx',
			data:{
				type : "init",
				act_id : act_id,
				user : userInfo.shareid
			},
			success: function (res) {
				console.info(res);
				var data = JSON.parse(res);
				v_main.shareList = data.shareList;
				for(var i=0;i<data.shareList.length;i++){
					if(data.shareList[i].user==userInfo.openid){
						if(!userInfo.hasSign){
							userInfo.hasSign = true;   //点了了一次了	
							v_main.btn_sign = 'sign';
						}
						else{
							userInfo.hasAgain = true;  //点亮过两次了 
							v_main.btn_sign = 'sign';
						}
					}
					if(i==5 && userInfo.own)
						v_main.btn_sign = 'finish';
					v_main.treeGrowed[i] = true;
				}
				if(!userInfo.own){
					v_main.btn_sign = 'help';  //帮他点亮
					v_main.btn_record = 'help';//我要参加
				}
			}
		});
	}
}
cc.game.onStart = function() {
	dialogs.loadres=g_resources;
    dialogs.loadcount=0;
    loadGameResources();
};
function loadGameResources()
{
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
function sign(){
	var sign = $("#btn_sign");
	if(sign.hasClass("finish")){ //抽奖
		v_main.active='prize';
		return;
	}
	else if(!userInfo.hasSign || (userInfo.canAgain&&!userInfo.hasAgain)){  //没有点亮过
		if(v_main.shareList.length<6){  //还没完成任务
			if(userInfo.cpe || userInfo.isShare || userInfo.own){
				if(!userInfo.hasSign)
					userInfo.hasSign = true;
				else{
					userInfo.canAgain = false;
					userInfo.hasAgain = true;
				}
				winSize.onWater(v_main.shareList.length);
				var obj = addSignJson(v_main.shareList);
				//console.info(obj);
				$.ajax({
					cache: false,
					async: false,
					type: "POST",
					url: '../gift/progress.ashx',
					data:{
						type : "sign",
						act_id : act_id,
						user : userInfo.shareid,
						json : JSON.stringify(obj),
						score: obj.length
					},
					success: function (res) {
						if(userInfo.own){
							v_main.btn_sign = "sign";
						}	
						else{
							v_main.btn_sign = "record";
						}
						if(obj.length==6 && userInfo.own)
							v_main.btn_sign='finish';
					}
				});
			}
			else{  //不是分享链接又没有关注我们的
				v_main.active='ercode';
			}
		}
		else{
			winSize.tips('你的好友已经完成任务啦!快来一起抽大奖吧!',['sure'],'ercode');
		}
	}
	else{  //分享
		if(userInfo.own)
			v_main.active='share';
		else
			winSize.tips('你已经助力过该好友了哦!',['sure'],'');
	}
}
function record()
{
	var record = $("#btn_record");
	if(!record.hasClass("help")){
		v_main.active='record';
	}
	else{
		v_main.active='ercode';
	}
}
var prize={
	check:function(){
		if(v_main.shareList.length<6){
			winSize.tips('对不起,你还没完成本次活动',['sure'],'');
		}
		else{
			prize.begin();
		}
	},
	begin:function(){
		$.ajax({
			cache: false,
			async: false,
			type: "POST",
			url: '../gift/progress.ashx',
			data:{
				type : 'prize',
				act_id : act_id,
				user : userInfo.openid
			},
			success: function (res) {
				console.info(res);
				var r = JSON.parse(res);
				if(r.success){
					userInfo.prize = r.prize;
					if(r.prize>0){
						winSize.tips('喜大普奔！你获得了'+winSize.prizeName[r.prize-1]+'一个！',['prize'],'award');
					}
					else{
						winSize.tips("Sorry~你本次抽奖没有中奖，谢谢参与！",['sure'],'');
					}
				}
				else{
					winSize.tips(r.returnStr,['sure'],'');
				}
			}
		});
	}
}

function addSignJson(json){
	var date = new Date();
	var o = new Object();
	o.user = userInfo.openid;
	o.name = userInfo.name;
	o.face = userInfo.face;
	o.addtime = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
	json.unshift(o);
	return json;
}
function doUserLogin(){
	if(!debug){
		//微信登录传参
		if(getQueryString("active")=="share" || getQueryString("from")=="cpe"){
			var a = location.href;
			var b = a.indexOf("?");
			var c = null;
			a = encodeURIComponent(a.substr(b+1)); //所有参数
			c = weixinData.loginUrl.replace("STATE",a);
			location.href = c;
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
							}
						});				
					}
				}
			})
		}
	}
	else{
		vueInit();
	}
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
		var title = !userInfo.own ? '' : ("我是"+userInfo.name+",");
		wx.onMenuShareTimeline({
			title: title+weixinData.shareTitle,
			link: weixinData.shareLink+"&shareid="+userInfo.shareid,
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
			desc: title+weixinData.shareDesc,
			link: weixinData.shareLink+"&shareid="+userInfo.shareid,
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
var award = {
    check: function () {
        $("#award_tips").empty();
        var name = $("#award_name").val();
        var tel = $("#award_tel").val();
        var address = $("#award_address").val().replace(/\s/g, "");
        var result = "";
        if (name=="") {
            result = "请填写收件人姓名!";
        }
        else if (tel.length != 11) {
            result = "请填写11位收件人手机号码!";
        }
        else if (address == "" || address.length<8) {
            result = "请填写详细的收件人地址!";
        }
        if (result == "") { //都正确
        	var date = new Date();
        	var addtime = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
            var info = '{"name":"'+name+'","tel":"'+tel+'","address":"'+address+'","addtime":"'+addtime+'","prize":'+userInfo.prize+'}';
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
            url: '../gift/progress.ashx',
            data: {
                type: "award",
                act_id : act_id,
                user: userInfo.openid,
                json: info
            },
            success: function (response) {
                var result = JSON.parse(response);
                winSize.tips(result.returnStr,['sure'],'');
            }
        });
    }
}
function registerEvent()
{
	initWxJsSdk(); //微信分享初始化
	winSize.videoList = TvList[winSize.tvId];
	creatTvList();
	$(".tv_catalog_title").click(function(){
		$(this).addClass("actived").siblings().removeClass("actived");
		var index = $(this).index();
		winSize.videoList = TvList[TvList.length-1-index];
		creatTvList();
	});
	$("#tv_play_out_btn").click(function(){
		v_main.active='';
		$("#tv_ifram").empty();
	});
}
function creatTvList(){
	var html = '';
	for(var i=0;i<winSize.videoList.length;i++){
		html += '<li><a>'+(i+1)+'</a></li>';
	}
	$("#tv_catalog_btn").empty().html(html);
	$("#tv_catalog_btn li a").unbind("click").click(function(){
		if(!$(this).hasClass("selected"))
		{
			var index = $(this).parent().index();
			playVideo(index);
		}
	});
}
function playVideo(i){
	var title = winSize.videoList[i].title;
	var src;
	if(winSize.videoList[i].src.indexOf("=")==-1)
		src = '<iframe frameborder="0" width="600" height="345" src="https://v.qq.com/iframe/player.html?vid='+winSize.videoList[i].src+'&tiny=0&auto=0" allowfullscreen></iframe>';
	else
		src = '<iframe width=600 height=345 src="http://player.youku.com/embed/'+winSize.videoList[i].src+'" frameborder=0 allowfullscreen></iframe>';
	$("#tv_ifram").empty().html(src);
	$("#tv_play_title").empty().text(title);
	$("#tv_catalog_btn li a").eq(i).parent().addClass("selected").siblings().removeClass("selected");
	$("#video_box").fadeIn();
}
function getQueryString(name)
{
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r!=null)return (r[2]); return null;
}
function getQueryString2(name,link)
{
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = link.match(reg);
	if(r!=null)return (r[2]); return null;
}