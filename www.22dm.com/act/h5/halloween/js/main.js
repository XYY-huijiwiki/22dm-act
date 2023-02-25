var isPC=true,token,openid,debug=false,act_id=29;
var weixinData={
    init    : false,
    loginUrl:'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb61fdb0e387cbcc4&redirect_uri=http%3a%2f%2fwww.22dm.com%2fact%2fh5%2fhalloween%2findex.html&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect',
    shareTitle:'嘻哈万圣节',
    shareDesc:'当嘻哈闯世界遇上万圣节，会发生什么？但是糖果一定不能少，快来闯关赢糖果！',
    shareLink:'http://www.22dm.com/act/h5/halloween/index.html',
    shareImg :'http://www.22dm.com/act/h5/halloween/game_assets/icon.png'
}
var userInfo={
    openid    : "test_act_id_29",
    name      : "test",
    face      : "game_assets/icon.png",
    sex       : "1",
    country   : "GuangZhou",
    province  : "GuangDong",
    score     : 0,
    rankList  : null  
}
var halloween = {
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
                halloween.addRankingList();              
            }
        });
    },
    addRankingList:function(){
        var html = '';
        var list = userInfo.rankList;
        for(var i=0;i<list.length;i++){//增加记录
           html += '<li><img class="p_image" src="' + list[i].json.img + '" width="60" height="60" /><a class="p_name">' + list[i].json.name + '</a><a class="p_time">' + list[i].json.addtime + '</a><a class="p_score">厉害了小伙，你在疯狂嘻哈夜中获得了' + list[i].json.score + '的高分！</a><a class="p_index">' + (i + 1) * 1 + '</a></li>';
        }
        $("#paihan_main").empty().append(html);
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
                halloween.getRankingList();
            } 
        });
    },
    getPrize:function(){
        var time = new Date();
        var now = time.getTime();
        if (now > Date.parse("2017/12/01 00:00:00")){
            var hasPrize = false;
            for (var i = 0; i < userInfo.rankList.length; i++) {
                if (userInfo.rankList[i].user == userInfo.openid) {
                    hasPrize = true;
                }
            }
            if (hasPrize) {
                award.open();
            }
            else {
                //console.info(userInfo.openid);
                $(".paihan_tips").empty().html('您本次没有上榜哦!');
                return false;
            }
        }
        else {
            $(".paihan_tips").empty().html('排行榜截止于2017-11-30,请于结束后再来领取奖品!');
            return false;
        }
    }
}
function gameInit(e){
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
                            startGame(e);
                            halloween.getRankingList();
                        }
                    });   
                    initWxJsSdk();
                }
            }
        })
    }
    else{
        if(debug){
            startGame(e);
            halloween.getRankingList();
        }
        else{
            location.href = weixinData.loginUrl;
        }
    }
}
function startGame(e){
    var u = e("wuki");
    u("init", {name: "Jumping Rock"});
}
function submitScore(score){
    if(score>=userInfo.score){
        halloween.sendJson(score);
    }
}
function showIntroduce(){ 
    $("#more_layer").children().hide();
    $("#more_layer").show().children().eq(0).fadeIn();
}
function showRanking(){ 
    $("#more_layer").children().hide();
    $("#more_layer").show().children().eq(1).fadeIn();
}
$(function(){
    $("#more_rule_img,.paihan_close").click(function(){
         $("#more_layer").fadeOut();
    });
    $("canvas").bind("touchmove", function(e) {
        e.preventDefault()
    }, !1);
    $("canvas").bind("touchstart", function(e) {
        e.preventDefault()
    }, !1);
})

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
            var info = '{"name":"'+name+'","tel":"'+tel+'","address":"'+address+'"}';
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
    },
    open:function(){
        $("#award").show();
    },
    close:function(){
        $("#award").hide();
    }
}
