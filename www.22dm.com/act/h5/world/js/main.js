var isPC=true,token,openid,debug=false,act_id=27;
var weixinData={
    init    : false,
    loginUrl:'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb61fdb0e387cbcc4&redirect_uri=http%3a%2f%2fwww.22dm.com%2fact%2fh5%2fworld%2findex.html&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect',
    shareTitle:'羊羊游世界',
    shareDesc:'跟随着萌羊和萌狼的脚步一起闯关冒险！游历世界！',
    shareLink:'http://www.22dm.com/act/h5/world/index.html',
    shareImg :'http://www.22dm.com/act/h5/world/res/icon.png'
}
var userInfo={
    openid    : "test_act_id_26",
    name      : "test",
    face      : "res/icon.png",
    sex       : "1",
    country   : "GuangZhou",
    province  : "GuangDong",
    score     : 0,
    rankList  : null   //我填写过的信息
}
var world = {
    openList:function(){
        $("#more").fadeIn();
    },
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
                console.info(response);
                var result = JSON.parse(response);
                userInfo.score = result.score;
                userInfo.rankList = result.scoreList;
                world.addRankingList();              
            }
        });
    },
    addRankingList:function(){
        var html = '';
        var list = userInfo.rankList;
        for(var i=0;i<list.length;i++){//增加记录
            html += '<li><img class="p_image" src="' + list[i].json.img + '" width="80" height="80" /><a class="p_name">' + list[i].json.name + '</a><a class="p_time">' + list[i].json.addtime + '</a><a class="p_score">厉害了小伙！你在《羊羊游世界》中获得了' + list[i].json.score + '分！</a><a class="p_index">' + (i + 1) * 1 + '</a></li>';
        }
        $("#more_ranking").empty().append(html);
    },
    sendJson:function(score){
        var json = '{"addtime":"str_addtime","score":"'+score+'","name":"'+userInfo.name+'","img":"'+userInfo.face+'","sex":"'+userInfo.sex+'","country":"'+userInfo.country+'","province":"'+userInfo.province+'"}';
        console.info(json);
        userInfo.score = score;
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
                console.info('更新记录成功');
                world.getRankingList();
            } 
        });
    }
}
$(function(){
    $("#more_close").click(function(){
        $("#more").fadeOut();
    });
    $("#more_btn a").click(function(){
        var btn = $(this);
        if(!btn.hasClass("selected")){
            btn.addClass("selected").siblings().removeClass("selected");
            $("#more_layer").children().hide().eq(btn.index()).show();
        }
    })
})
function mainInit(){
    $("#all").css({
        "width" : $(window).width(),
        "height" : $(window).height()
    });
    if(getQueryString("code")!=null){
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
                else{
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
                            userInfo.face = r.headimgurl != "" ? r.headimgurl : 'http://www.22dm.com/act/h5/collect/images/icon.jpg';
                            userInfo.sex = r.sex;
                            userInfo.country = r.country;
                            userInfo.province = r.province;
                            init();
                            world.getRankingList();
                            initWxJsSdk();
                        }
                    });   
                }
            }
        })
    }
    else{
        if(debug){
            init();
            world.getRankingList();
        }
        else{
            location.href = weixinData.loginUrl;
        }
    }
}
var SG_Hooks = {
    debug : true,
	getLanguage : function( supportedLanguages ){
		return SG.initLangs(supportedLanguages);
	},
	
	start : function(){
        SG_Hooks.debug && console.log('game started');
        SG.trigger({type:'start'});
	},
	
	levelUp : function( level, score, callback){
        var total = k6S46[K46]['localStorage'].getItem("TOTAL_SCORE")*1;
        if(total>=userInfo.score){
            world.sendJson(total);
        }
        SG_Hooks.debug && console.log('level up:' + level + '/' + score+" , total:"+total);
        SG.trigger({type:'levelUp', level:level, lastLevelScore:score}, callback);
	},

	gameOver : function( level, score, callback){
        SG_Hooks.debug && console.log('game over:' + level + '/' + score);
		SG.trigger({type:'gameOver', score:score}, callback);
	},

    gameCompleted : function( score, callback ){
        SG_Hooks.debug && console.log('game completed:' + score);
        SG.trigger({type:'gameCompleted', score:score}, callback);
    },

    gamePause : function( state, callback ){ // state: on|off
        SG_Hooks.debug && console.log('game pause:' + state);
        SG.trigger({type:'gamePause', state:state}, callback);
    },
    
    gameRestart : function( callback ){
        SG_Hooks.debug && console.log('game restart:');
        SG.trigger({type:'gameRestart'}, callback);
    },
    
    selectMainMenu : function(callback){
        SG_Hooks.debug && console.log('selectMainMenu:');
        SG.trigger({type:'selectMainMenu'}, callback);
    },
    
    selectLevel : function( level, callback ){
        SG_Hooks.debug && console.log('selectLevel:'+level);
        SG.trigger({type:'selectLevel', level:level}, callback);
    },
    
    setSound : function( state, callback ){ // state: on|off
        SG_Hooks.debug && console.log('setSound:'+state);
        SG.trigger({type:'gameCompleted', state:state}, callback);
    },
    
    setOrientationHandler : function( f ){
		SG.setOrientationHandler( f );
	},
	
	setResizeHandler: function ( f ){
		SG.setResizeHandler(f);
	}
};
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
    });
}
function getQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return (r[2]); return null;
}
