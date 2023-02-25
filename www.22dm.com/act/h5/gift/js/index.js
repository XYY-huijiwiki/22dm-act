var isPC=true,token, openid, nickname, headimgurl, sex, country, province,act_id=23,debug=false;
var weixinData={
	state  : null,
	isShare:false, // 是否为分享出去的链接 , false: 由公众号入口进入自己参与
	loginUrl:'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb61fdb0e387cbcc4&redirect_uri=http%3a%2f%2fwww.22dm.com%2fact%2fh5%2fgift%2findex.html&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect',
	shareTitle:'玩转地球嘉年华，羊村大奖等你拿',
	shareDesc:'快来和我一起玩转地球嘉年华，帮我点亮游乐设施，赢取羊村大奖',
	shareLink:'http://www.22dm.com/act/h5/gift/index.html?active=share',
	shareImg:'http://www.22dm.com/act/h5/gift/images/icon.jpg'
}
var userInfo={
	cpe       : false,
	own       : false,
	openid    : "test_act_id_22",
	shareid   : "test_act_id_22",
	name      : "test",
	face      : "images/diqiu.png",
	hasSign   : false,
	shareList : [],
	prize     : 0
}
//刷新
$(function(){
	var width = $(window).width();
	var height = $(window).height();
	if(width>640)
		$("#all").css("left",(width-640)>>1);
	if(height>1008)
		$("#all").css("top",(height-1008)>>1);
	//不是分享链接 不是cpe进入
	if(getQueryString("active")=="share" || getQueryString("from")=="cpe"){
		var a = location.href;
		var b = a.indexOf("?");
		var c;
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
							userInfo.face = r.headimgurl != "" ? r.headimgurl : 'http://www.22dm.com/act/h5/deep/static/img/icon.jpg';
							sex = r.sex;
							country = r.country;
							province = r.province;		
							if(getQueryString("from")!=null)
								userInfo.cpe = true;
							init();
						}
					});				
				}
			}
		})
	}
})

function init(){
	weixinData.state = decodeURIComponent(getQueryString("state"));
	console.info("loginurl:"+location.href);
	console.info("state:"+weixinData.state);
	if(getQueryString2("active",weixinData.state)!=null){
		weixinData.isShare = true;
		userInfo.shareid = getQueryString2("shareid",weixinData.state);
		if(userInfo.shareid==userInfo.openid){
			userInfo.own = true;
		}
		else{
			$("#btn_sign").addClass("help"); //帮他点亮
			$("#btn_record").addClass("help"); //我要参加
		}
	}
	else{
		userInfo.shareid = userInfo.openid;
		userInfo.own = true;
	}
	if(getQueryString2("from",weixinData.state)!=null)
		userInfo.cpe = true;
	$.ajax({
		cache: false,
		async: false,
		type: "POST",
		url: 'progress.ashx',
		data:{
			type : "init",
			act_id : act_id,
			user : userInfo.shareid
		},
		success: function (res) {
			var data = JSON.parse(res);
			userInfo.shareList = data.shareList;
			for(var i=0;i<data.shareList.length;i++){
				$("#earth_list a").eq(i).addClass("sign");
				if(data.shareList[i].user==userInfo.openid){
					userInfo.hasSign = true;
					$("#btn_sign").addClass(userInfo.own ? "sign" : "record");	 
				}
				if(i==5 && userInfo.own)
					$("#btn_sign").addClass("finish");
			}
			initWxJsSdk();
		}
	});
	$("#earth_list a").click(function(){
		var earth = $(this);
		var data = userInfo.shareList;
		var length = data.length;
		showIntroduce($(this).index());
	});
	$("#introduce_wall_wrap li").click(function(){
		var p = $("#dialogs_introduce").attr("w_p")*1;
		var i = $(this).index()+1;
		$("#download_src").attr("src","images/w/b_"+p+"_"+i+".jpg");
		dialogs("download");
	});
	$(".dialogs_close").click(function(){
		$(this).parent().hide().parent().hide();
		$("#introduce_video").empty();
	})
	$("#dialogs_share,#dialogs_ercode").click(function(){
		$(this).hide().parent().hide();
	})
	$("#download_close").click(function(){
		$("#dialogs_download").fadeOut();
		$("#download_src").attr("src","");
	})
	$("#dialogs_tip").click(function(){
		var prize = userInfo.prize;
		if(prize>=5){
			$(this).hide();
			dialogs("award");
		}
		else if(prize>0){
			location.href = tmall[prize-1];
		}
	})
	$("#main,#dialogs_record,#dialogs_prize,#dialogs_award,#dialogs_tip,#dialogs_rule,#dialogs_share,#dialogs_ercode").on("touchmove",function(e){
		e.preventDefault();
	});
	//record();
	//dialogs('rule');
	//dialogs('share');
	//dialogs('ercode');
	//dialogs('award');
	//dialogs('prize');
	//dialogs('tip');
	//dialogs('download');
	//$("#earth_list a").eq(0).click();
}
function showIntroduce(index){
	$("#dialogs_introduce").attr("w_p",index);
	$("#introduce_video").empty().html(youkuifram[index]);
	$("#introduce_img").attr("src","images/i_"+index+".png");
	$("#introduce_wall_1").attr("src","images/w/s_"+index+"_1.jpg");
	$("#introduce_wall_2").attr("src","images/w/s_"+index+"_2.jpg");
	$("#introduce_wall_3").attr("src","images/w/s_"+index+"_3.jpg");
	$("#introduce_wall_4").attr("src","images/w/s_"+index+"_4.jpg");
	dialogs("introduce");
}

function sign(){
	var sign = $("#btn_sign");
	if(sign.hasClass("finish")){ //抽奖
		dialogs("prize");
		return;
	}
	else if(!userInfo.hasSign){  //没有点亮过
		if(userInfo.cpe || userInfo.isShare){
			userInfo.hasSign = true;
			var obj = addSignJson(userInfo.shareList);
			//console.info(obj);
			$.ajax({
				cache: false,
				async: false,
				type: "POST",
				url: 'progress.ashx',
				data:{
					type : "sign",
					act_id : act_id,
					user : userInfo.shareid,
					json : JSON.stringify(obj),
					score: obj.length
				},
				success: function (res) {
					$("#earth_list a").eq(obj.length-1).hide().addClass("sign").fadeIn(1500);
					$("#btn_sign").addClass(userInfo.own ? "sign" : "record");	
					if(obj.length==6 && userInfo.own)
						$("#btn_sign").addClass("finish");
					setTimeout(function(){
						showIntroduce(obj.length-1);				
					},500)
				}
			});
		}
		else{  //不是分享链接又没有关注我们的
			dialogs("ercode");
		}
	}
	else{  //分享
		if(userInfo.own)
			dialogs("share");
		else{
			var html = "";
			var progress = 0;
			for(var i=0;i<userInfo.shareList.length&&i<6;i++){
				progress++;
				html +='<li class="record_list_'+(i+1)+'">';
				html +='<img class="record_face" src="'+userInfo.shareList[i].face+'" width="80" height="80" />';
				html +='<a class="record_time">'+userInfo.shareList[i].addtime+'</a>';
				html +='<a class="record_title">'+userInfo.shareList[i].name+'点亮了"'+introduceTitle[i]+'"</a></li>';
			}
			$("#record_list").empty().html(html);
			$(".record_progress_4").text(progress+"/6");
			if(progress > 0){
				$(".record_progress_1").show();
				$(".record_progress_2").css("width",progress*44+"px").show();
				if(progress>=6)
					$(".record_progress_3").show();
			}
			dialogs('record');
		}
	}
}
function record()
{
	var record = $("#btn_record");
	if(!record.hasClass("help")){
		var html = "";
		var progress = 0;
		for(var i=0;i<userInfo.shareList.length&&i<6;i++){
			progress++;
			html +='<li class="record_list_'+(i+1)+'">';
			html +='<img class="record_face" src="'+userInfo.shareList[i].face+'" width="80" height="80" />';
			html +='<a class="record_time">'+userInfo.shareList[i].addtime+'</a>';
			html +='<a class="record_title">'+userInfo.shareList[i].name+'点亮了"'+introduceTitle[i]+'"</a></li>';
		}
		$("#record_list").empty().html(html);
		$(".record_progress_4").text(progress+"/6");
		if(progress > 0){
			$(".record_progress_1").show();
			$(".record_progress_2").css("width",progress*44+"px").show();
			if(progress>=6)
				$(".record_progress_3").show();
		}
		dialogs('record');
	}
	else{
		dialogs('ercode');
	}
}
var prize={
	check:function(){
		if(userInfo.shareList.length<1){
			$("#prize_tips").empty().text("对不起,你还没完成本次活动");
		}
		else{
			$("#prize_tips").empty();
			this.begin();
		}
	},
	begin:function(){
		$.ajax({
			cache: false,
			async: false,
			type: "POST",
			url: 'progress.ashx',
			data:{
				type : 'prize',
				act_id : act_id,
				user : userInfo.openid
			},
			success: function (res) {
				//console.info(res);
				var r = JSON.parse(res);
				if(r.success){
					userInfo.prize = r.prize;
					if(r.prize>0){
						prize.dialogs(r.prize);
					}
					else{
						$("#prize_tips").empty().text("你本次抽奖没有中奖,谢谢参与!");
					}
				}
				else{
					$("#prize_tips").empty().text(r.returnStr);
				}
			}
		});
	},
	dialogs:function(p){
		$("#tip_image").attr("src","images/p/"+p+".png");
		dialogs("tip");		
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

function dialogs(target){
	$("#dialogs").show();
	$("#dialogs_"+target).fadeIn();
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
			console.info(res);
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
		var name = !userInfo.own ? '' : ("&name="+userInfo.name);  
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
	/*wx.ready(function (){
		wx.onMenuShareTimeline({
			title: weixinData.shareTitle,
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
			desc: weixinData.shareDesc,
			link: weixinData.shareLink+"&shareid="+userInfo.shareid,
			imgUrl: weixinData.shareImg, 
			success: function () { 
				console.info("onMenuShareTimeline ok");
			},
			cancel: function () { 
				console.info("onMenuShareAppMessage cancel");
			}
		});
	});	*/	
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
function getQueryString2(name,link)
{
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = link.match(reg);
	if(r!=null)return (r[2]); return null;
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
            url: 'progress.ashx',
            data: {
                type: "award",
                act_id : act_id,
                user: userInfo.openid,
                json: info
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
var introduceTitle=["远古冰川乐园","神奇的潮汐","征服高山","沙漠之洲","蓝色的地球","闪耀的星星"];
var tmall=['https://taoquan.taobao.com/coupon/unify_apply.htm?sellerId=2473210771&activityId=d300931f4b1d444892b280f264e6dcdb','https://taoquan.taobao.com/coupon/unify_apply.htm?sellerId=2473210771&activityId=40501562ce674cd59f973d5083d0e205','https://taoquan.taobao.com/coupon/unify_apply.htm?sellerId=2473210771&activityId=99e199c1725c4795a6e8aaa7d7d4d72f','https://taoquan.taobao.com/coupon/unify_apply.htm?sellerId=3020165993&activityId=e262ef69134a414095ec1b6fc6e54cdc']
var youkuifram=["<iframe height=260 width=470 src='http://player.youku.com/embed/XMjg4MDY4NzU0OA==' frameborder=0 'allowfullscreen'></iframe>","<iframe height=260 width=470 src='http://player.youku.com/embed/XMjg4MDYzMDc1Ng==' frameborder=0 'allowfullscreen'></iframe>","<iframe height=260 width=470 src='http://player.youku.com/embed/XMjg4MDcwNzY2OA==' frameborder=0 'allowfullscreen'></iframe>","<iframe height=260 width=470 src='http://player.youku.com/embed/XMjg4MDcyNzgxNg==' frameborder=0 'allowfullscreen'></iframe>","<iframe height=260 width=470 src='http://player.youku.com/embed/XMjg4MDY1MjQxNg==' frameborder=0 'allowfullscreen'></iframe>","<iframe height=260 width=470 src='http://player.youku.com/embed/XMjg4MDc0MDYxMg==' frameborder=0 'allowfullscreen'></iframe>"]