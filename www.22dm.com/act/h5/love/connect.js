var heartbeat = {
	a         : 'player_one',
	nf        : '胡飞',
	nt        : '红莉',
	scene     : 1,
	player    : 1,
	roomId    : null,
	state     : 0,
	timespan  : null,
	looptime  : 1000, //轮询时间
	loadcount : 0, 
	loadres   : [],
	loadtag   : "dialogs_guide_1",
	ercodeShow:function(){
		heartbeat.roomId = new Date().getTime();
		$("#ercode").empty();
		var flag = encodeURIComponent('scene='+heartbeat.scene+'&'+'roomId='+heartbeat.roomId);
		var link = 'http://www.22dm.com/act/h5/love/t.html?t='+flag;
		$("#ercode").qrcode({ 
	        render: "canvas", 
	        width: 235,  
	        height:235, 
	        text: link 
	    });
	    console.info('http://localhost:31357/act/h5/love/index.html?state='+flag);
		player_one.getStatu();
	},
	shareShow:function(){
		console.info("dialogs_share : show");
		dialogs.open("dialogs_share");
		$("#dialogs_share").addClass("share_scene_"+heartbeat.scene).show();
		if(heartbeat.a=="share")//打开的是分享链接
		{
			$("#share_to").attr("disabled","disabled");
			$("#share_from").attr("readonly","readonly");
			$("#share_bg").attr("src","res/share_bg_"+heartbeat.scene+".jpg").show().next().show();
		}
		else
			$("#share_tip").attr("src","res/share_tip_"+heartbeat.scene+".png");
		$("#share_love").attr("src","res/share_love_"+heartbeat.scene+".png").fadeIn();
		$("#share_to").val(heartbeat.nt).delay(800).fadeIn();
		$("#share_from").val(heartbeat.nf).delay(1600).fadeIn();
		$(heartbeat.a=="share"?"#btn_play":"#btn_share").delay(2400).fadeIn();
	},
	loadResFinish(){
		console.info("资源:"+heartbeat.loadtag+" 加载完毕");
		var loading = $("#"+heartbeat.loadtag+" .precent_main");
		setTimeout(function(){
			$("#"+heartbeat.loadtag+" .dialogs_precent").hide().next().fadeIn();
		},500)
		if(heartbeat.a=='player_two'){
			cc.director.runScene(new GamePlayScene(heartbeat.scene,heartbeat.player));
			dialogs.close();
		}
	}
}
var player_one={
	getStatu:function(){
		heartbeat.timespan = new Date().getTime();
		var loop = false;
		$.ajax({
			cache: false,
			async: false,
			type: "POST",
			url: 'heartbeat.ashx?'+heartbeat.timespan,
			data:{
				type   : "get",
				roomId : heartbeat.roomId,
				state  : heartbeat.state,
				scene  : heartbeat.scene,
				name   : heartbeat.nf
		 	},
			success: function (res) {
				console.info(res);
				if(heartbeat.state==0){
					heartbeat.state=1;
					loop = true;
				}
				else{
					var r = JSON.parse(res);
					switch(r.state)
					{
						case 1:   //房间创建成功 显示二维码
							loop = true;
							if(!$("#ercode").hasClass("begin")){
								$("#ercode").fadeIn().addClass("begin");				
							}
							break;
						case 2:   //玩家二扫码成功 关闭二维码
							loop = true;
							if(!$("#ercode").hasClass("end")){
								$("#ercode").fadeOut().addClass("end");				
							}
							break;
						case 3:  //玩家二加载场景完毕 播放动画 获取玩家2的名字
							heartbeat.state = 4;
							heartbeat.nt = r.name;
							if(!weixinData.init){
								weixinData.init = true;
								changeWxJsSdk(true);
							}
							if(!$("#ercode").hasClass("end")){
								$("#ercode").fadeOut().addClass("end");				
							}
							if(heartbeat.scene==1)
								cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_FEMALE_A_3));
							else
								cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_MALE_A_2));
							break;
					}
				}	
				if(loop){
					setTimeout(function(){
						player_one.getStatu();
					},heartbeat.looptime)
				}
			}
		});
	},
	sendStatu:function(){  //发送动画已完成 状态4
		$.ajax({
			cache: false,
			async: false,
			type: "POST",
			url: 'heartbeat.ashx?'+heartbeat.timespan,
			data:{
				type   : "set",
				roomId : heartbeat.roomId,
				state  : heartbeat.state
		 	},
			success: function (res) {
				
			}
		});
	}
}
var player_two={
	getStatu:function(){ //获取玩家一是否已经播放结束
		$.ajax({
			cache: false,
			async: false,
			type: "POST",
			url: 'heartbeat.ashx?'+heartbeat.timespan,
			data:{
				type   : "get",
				roomId : heartbeat.roomId,
				state  : heartbeat.state,
				name   : heartbeat.nt
		 	},
			success: function (res) {
				console.info(res);
				var r = JSON.parse(res);
				if(r.state == 4){
					if(heartbeat.scene==1)
						cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_FEMALE_A_4));
					else
						cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_MALE_A_3));
				}
				else{ //轮询
					setTimeout(function(){
						player_two.getStatu();
					},heartbeat.looptime)	
				}
			}
		});
	},
	sendStatu:function(){  //发送状态 扫码进入发送2  加载完成发送3 
		$.ajax({
		cache: false,
		async: false,
		type: "POST",
		url: 'heartbeat.ashx?'+heartbeat.timespan,
		data:{
			type   : "set",
			roomId : heartbeat.roomId,
			state  : heartbeat.state,
			name   : heartbeat.nt
	 	},
		success: function (res) {
			console.info(res);
			var r = JSON.parse(res);
			if(heartbeat.state==2){
				heartbeat.nf = r.name;
				if(!weixinData.init){
					weixinData.init = true;
					changeWxJsSdk(true);
				}
			}
		}
	});
	}
}






