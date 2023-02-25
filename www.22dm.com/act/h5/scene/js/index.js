var token, openid, nickname, headimgurl, sex, country, province, debug, totalTime;
var act_id = 18, canvasWidth, canvasHeight, isPC = true;
var container,scene_1,scene_2,slideType=1,moveSpeed=1.5,gammaSpeed=0.6;
var downX=0,isDown=false,nowGamma=0,isMoving=false;
var LoadedResource,LoaderProcess=0,PageResource={};
var loadingLayer,datalist=[],data=[]; 
var sound_1,sound_2,sound,elementSoundList=[],music=false,soundLoops=1;
var ImageURL = "/act/h5/scene/images/", SoundURL = "/act/h5/scene/sound/";
$(function(){
    isPC = IsPC();
    debug = 1;
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
                //guess.user = openid;
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
                        headimgurl = r.headimgurl != "" ? r.headimgurl : 'http://www.22dm.com/act/h5/scene/images/icon.jpg';
                        sex = r.sex;
                        country = r.country;
                        province = r.province;
                        if (typeof (openid) == "undefined") {
                            location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb61fdb0e387cbcc4&redirect_uri=http%3a%2f%2fwww.22dm.com%2fact%2fh5%2fscene%2findex.html&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
                        }
                        else {
                            monitor.init();
                        }
                    }
                });
            }
        });
    }
    else {
        //guess.user = 'oTaiPuEUqBR9FQRGw5hvR0oyOAWo';
        monitor.init();
    }
	wx.onMenuShareTimeline({
	    title: '狼朗公司办公室开放日', // 分享标题
	    link: 'http://www.22dm.com/act/h5/scene/index.html', // 分享链接
	    imgUrl: 'http://www.22dm.com/act/h5/scene/images/share.jpg', // 分享图标
	    success: function () {
	        // 用户确认分享后执行的回调函数

	    },
	    cancel: function () {
	        // 用户取消分享后执行的回调函数
	    }
	});
	wx.onMenuShareAppMessage({
	    title: '狼朗公司办公室开放日', // 分享标题
	    desc: '震惊！《嫁人就嫁灰太狼》男主角竟然在这样的地方上班！', // 分享描述
	    link: 'http://www.22dm.com/act/h5/scene/index.html', // 分享链接
	    imgUrl: 'http://www.22dm.com/act/h5/scene/images/share.jpg', // 分享图标
	    type: 'link', // 分享类型,music、video或link，不填默认为link
	    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
	    success: function () {
	        // 用户确认分享后执行的回调函数

	    },
	    cancel: function () {
	        // 用户取消分享后执行的回调函数
	    }
	});
});
//s:第几个场景 eid:唯一id name:名字 b:背景张数 g:gif张数 i:介绍(1为特点) it:介绍内容
var list_el={
	el_1:{"s":1,"eid":1,"name":"香","b":1,"g":1,"it":'<yellow>特点：</yellow>身材火爆，计较，自尊心强，经常翘首舞姿卖弄性感，演员天份高，情商高。'},
	el_2:{"s":1,"eid":2,"name":"白大大","b":1,"g":0,"it":'<yellow>特点：</yellow>身材火爆，计较，自尊心强，经常翘首舞姿卖弄性感，演员天份高，情商高。'},
	el_3:{"s":1,"eid":3,"name":"胡飞","b":1,"g":1,"it":'<yellow>特点：</yellow>务实员工，刻苦耐劳，却常好心办坏事，能化解一切不可能战胜的困难与任务。而在白大大的眼中，胡飞是一个不受重用的员工，就算是这样，胡飞也会排除万难，从不轻言放弃。'},
	el_4:{"s":1,"eid":4,"name":"华姐","b":1,"g":1,"it":'<yellow>特点：</yellow>工作认真，对垃圾很执着，说话坦率，同时他是一个渴望被爱的人，恋爱神经活跃，渴望被爱，经常误会别人想表白她。'},
	el_5:{"s":2,"eid":5,"name":"红利","b":1,"g":1,"it":'<yellow>特点：</yellow>尽管是办公室的女神,悠着众多的追求者,却不会因此而沾沾自喜,但第一次见到胡飞的时候,觉得胡飞就是个小傻子,不太愿意接近，后来发现胡飞人品好，不屈不挠的精神打动了她，让红莉另眼相看。'},
	el_6:{"s":2,"eid":6,"name":"孟波","b":1,"g":1,"it":'<yellow>特点：</yellow>在座位永远都有一台属于自己的健身器材,常常有意无意地你用办公室用品来进行健身,两块胸肌能左右动,相信你量能解决一切'},
	el_7:{"s":2,"eid":7,"name":"路人甲","b":1,"g":1,"it":'<yellow>小&nbsp;薪：</yellow>慢热，单纯，退缩，文静。<br/><yellow>赵巨富：</yellow>有钱，任性，洒脱，喜欢出风头。<br/><yellow>小喇叭：</yellow>聪明，八卦，神气。<br/>'}
}
var list={
	isOpen:false,
	info:null,
	say_limit:24,
	say_less:3,
	good_list:[],
	look_list:[],
	post_count:0,
	str:["死","妈的","草","操","艹","滚","傻逼","屌","恶心","垃圾","黄伟明","官方","尼玛","狗日","婊"],
	open:function(id){		
		var eid = 'el_'+id;
		var p_1="",p_2="",p_3="";
		var info = list.info["el_"+id];
		p_1 = '<img src="images/l_1.png" width="600" height="845" />';
		p_1 += '<img src="images/el_b_'+id+'.png" width="600" height="845" />';
		p_1 += list_el[eid].g == 1 ? '<img id="el_gif" class="el_g_'+id+'" src="images/el_g_'+id+'.gif"/>':'';
		p_2 = '<img src="images/l_2.png" width="600" height="845" />';
		p_2 += '<img src="images/el_i_'+id+'.png" width="600" height="845" /><div id="el_introduce"><div id="el_introduce_main">'+list_el[eid].it+'</div></div>';
		p_2 += '<div id="el_info"><a id="btn_good"'; 
		for(var i=0;list.good_list.length;i++){
			if(id==list.good_list[i]){
				p_2 += ' class="btn_gooded"';
				break;
			}
		}
		p_2 +=' onclick="list.good('+id+')">'+info.good+'</a><a id="btn_look">'+info.look+'</a></div>';
		p_3 = '<img class="el_dialogs" src="images/l_3.png" width="600" height="845" /><ul id="el_barrage">';
		for(var i=info.say.length-1;i>=0;i--){
			p_3 += '<li><span class="barrage_cnt">'+unescape(info.say[i].cnt)+'</span><span class="barrage_time">'+info.say[i].time+'</span><div class="clear"></div></li>';
		}
		p_3 += '</ul><span id="el_speech_tips"></span><input id="el_speech" type="text" placeholder="请在此处输入内容"/><a id="el_speech_btn" onclick="list.say('+id+')"><img src="images/btn/btn_post.png" width="174" height="50"/></a>';
		$("#el_p_1 .el_dialogs").empty().html(p_1);
		$("#el_p_2 .el_dialogs").empty().html(p_2);
		$("#el_p_3 .el_dialogs").empty().html(p_3);
		$("#el_list").show();
		$("#el_p_2").show();
		list.isOpen=true;
		var hasLook = false;	
		for(var i=0;i<list.look_list.length;i++){
			if(id==list.look_list[i]){
				hasLook = true;
			}
		}
		if(!hasLook){
			list.info["el_"+id].look++;
			list.look_list.push(id);
			list.post(3,id,"");
		}	
	},
	game:function(){
		$("#game_list").show();
		list.isOpen=true;
	},
	close:function(i){
		if(i==1){
			$("#el_main").children().hide(); 
			$("#el_list").fadeOut(300);	
		}
		else{
			$("#game_list").fadeOut(300);	
		}
		list.isOpen=false;
	},
	part:function(type){
		var el = $("#el_main");
		var length = el.children().length;
		var index=-1;
		for(var i=0;i<length;i++){
			if(el.children().eq(i).is(":visible")){
				index=i;
				el.children(i).hide();
				break;
			}
		}
		if(type==1){//下一项
			index = index+1<length?index+1:0;
		}
		else{
			index = index-1>=0?index-1:length-1;
		}
		el.children().eq(index).show();
	},
	say:function(id){
		var txt = $("#el_speech").val().replace(/\s/g,"");
		var result = "";
		if(txt=="" || txt.length<list.say_less){
			result = "请输入不少于"+list.say_less+"个字符的内容";
		}
		else if(txt.length>=list.say_limit){
			result = "文本内容只能输入"+list.say_limit+"个字符";
		}
		else if(list.post_count>=3){
			result = "请勿吐槽太多啦~";
		}
		for (var i = 0; i < list.str.length; i++) {
		    if (txt.indexOf(list.str[i]) != -1) {
		        result = "请使用文明用语!";
		    }
		}
		if(result!=""){
			$("#el_speech_tips").empty().show().html(result);
		}
		else{
			list.post(1,id,txt);
		}
	},
	good:function(id){
		var e = $("#btn_good");
		if(!e.hasClass("btn_gooded")){
			list.good_list.push(id);
			list.info["el_"+id].good++;
			e.addClass("btn_gooded");
			e.html(e.html()*1+1);
			list.post(2,id,"");
			//setCookie("scene_good",JSON.stringify(list.good_list));
		}
	},
	post:function(d,id,txt){
		var type = "";
		var user = "el_"+id;
		var content = "";
		switch(d){
			case 1:
				type="send";
				break;
			case 2:
				type="good";
				break;
			case 3:
				type="look";
				break;
		}
		if(d==1){
			var date=new Date;
			var month=date.getMonth()+1;
			var day=date.getDate();
			content+='{';
			content+='"cnt":"'+escape(txt)+'",';
			content+='"time":"'+month+'-'+day+'"';
			content+='}';
		}
		$.ajax({
            cache: false,
            async: false,
            type: "POST",
            url: '/act/h5/scene/doScene.ashx',
            data: {
                "init": "0",
                "act_id": act_id,
                "type": type,
                "user": user,
                "content": content
            },
            success: function (response) {
                var result = JSON.parse(response);
                if (result.success) {
					if(d==1){
						list.info["el_"+id].say.push(JSON.parse(unescape(content)));
						$("#el_speech_tips").empty().html("发送成功!").show();
						$("#el_speech").val("");
						$("#el_p_3 .el_dialogs ul").prepend('<li><span class="barrage_cnt">'+txt+'</span><span class="barrage_time">2-3</span><div class="clear"></div></li>');
						list.post_count++;
					}
                    //console.info(response);
                }
                else {
                     console.info(result.success);
                }
            }
        });
	}
}
var monitor = {
	init:function(){
		canvasWidth = 640;
		canvasHeight = 1008;
		if($(window).height()>1008){
			$("#all").css({
				"top":($(window).height()-1008)>>1
			});	
		}
		$.ajax({
            cache: false,
            async: false,
            type: "POST",
            url: '/act/h5/scene/doScene.ashx',
            data: {
                "init": "1",
                "act_id": act_id
            },
            success: function (response) {
				try{
					list.info = JSON.parse(response);	
					$("#map").show();
					monitor.addListener();
					init(20,"canvas-wrap",canvasWidth,canvasHeight,main);	 	
				}
				catch(e){
					console.info(e);
				}
            }
        });
	},
	addListener:function(){
		$("#begin_road").click(function(){
			$("#index").hide().next().fadeIn(300);
		});
		$("#road_back").click(function(){
			$("#road").hide().prev().fadeIn(300);
		});
		$("#btn_select").click(function(){
			$("#map").hide().prev().fadeIn(300);
		});
		$("#btn_tips").click(function(){
			$(this).hide();
		});
	},
	openGyro:function(){
		if(!isPC)
		{
			if(slideType!=3)
			{
				window.addEventListener('deviceorientation',handleOrientation,true);
				slideType = 3;	
				$("#btn_gyro").addClass("gyro");
			}
			else
			{
				window.removeEventListener('deviceorientation',handleOrientation,true);
				$("#btn_gyro").removeClass("gyro");
				if(isPC)
					slideType = 1;
				else
					slideType = 2;
			}	
		}	
	},
	start:{
		road:function(i){
			if(scene.onload)
			{
				$("#road").hide().next().fadeIn(500);
				monitor.select(i);			
			}
		},
		index:function(){
			$("#loading").hide().next().fadeIn(500);
			init(30,"canvas-wrap",canvasWidth,canvasHeight,main);
			$("#road a").click(function(){
				var index = $(this).index();
				beginRoad(index);	
			});		
		},
		sound:function(){
			var target = $("#btn_music");
			if(target.hasClass("play"))
			{
				sound.stop();
				target.removeClass("play");
				music = false;
			}
			else
			{
				sound.play(0,soundLoops);
				target.addClass("play");
				music = true;
			}	
		}
	},
	select:function(i){
		if(i==1){
			container.scene=1;
			scene_2.visible=false;
			scene_1.visible=true;	
		}
		else{
			container.scene=2;
			scene_1.visible=false;
			scene_2.visible=true;
		}
		if(!$("#btn_tips").hasClass("loaded")){
			$("#btn_tips").show();
			setTimeout(function(){
				$("#btn_tips").fadeOut().addClass("loaded");
			},5000);
		}
	}
};
var scene = {
	onload:false,
	init:function(d){
		LGlobal.preventDefault=false;
		data = d;
		container = new LSprite();	
		container.name = "container";
		container.width = canvasWidth;
		container.height = canvasHeight;
		addChild(container);
		container.addEventListener(LMouseEvent.MOUSE_DOWN,onDown);
		container.addEventListener(LMouseEvent.MOUSE_MOVE,onMove);
		container.addEventListener(LMouseEvent.MOUSE_UP,onUp); 
		scene.creat.bg();
		scene.creat.sound();
		monitor.select(2);	//选择默认场景
		$("#map").hide();
		$("#index").show();	
		scene_1.x=-4745;
		scene_2.x = -2690;
		//scene_2.x = -7500;
		//container.addChild(new FPS());
	},
	creat:{
		bg:function(){
			var w = canvasWidth*2*moveSpeed;
			scene_1 = new LSprite();
			scene_2 = new LSprite();
			container.addChild(scene_1);
			container.addChild(scene_2);
			scene_1.visible=false;
			scene_2.visible=false;
			scene_1.name = "scene_1";
			scene_2.name = "scene_2";				
			var loader_bg_1 = new LLoader(); 
			loader_bg_1.load(data["scene_1"].src,"bitmapData");  
			loader_bg_1.addEventListener(LEvent.COMPLETE,function(event){
				var bitmap = new LBitmapData(loader_bg_1.content);  
				var bitmapData_1 = new LBitmapData(null, 0, 0, bitmap.width+w*2, 1008, LBitmapData.DATA_CANVAS)
				bitmapData_1.copyPixels(bitmap, new LRectangle(bitmap.width-w, 0, w, canvasHeight), new LPoint(0,0));
				bitmapData_1.copyPixels(bitmap, new LRectangle(0, 0, bitmap.width, bitmap.height), new LPoint(w,0));
				bitmapData_1.copyPixels(bitmap, new LRectangle(0, 0, w, canvasHeight), new LPoint(bitmap.width+w,0));
				scene_1.addChild(new LBitmap(bitmapData_1)); 
				scene_1.bgWidth = bitmap.width;
				scene_1.width = bitmap.width+w*2;
				scene_1.height = canvasHeight;
				var loader_bg_2 = new LLoader(); 
				loader_bg_2.load(data["scene_2"].src,"bitmapData");  
				loader_bg_2.addEventListener(LEvent.COMPLETE,function(event){
					var bitmap2 = new LBitmapData(loader_bg_2.content); 
					var bitmapData_2 = new LBitmapData(null, 0, 0, bitmap2.width+w*2, 1008, LBitmapData.DATA_CANVAS)
					bitmapData_2.copyPixels(bitmap2, new LRectangle(bitmap2.width-w, 0, w, canvasHeight), new LPoint(0,0));
					bitmapData_2.copyPixels(bitmap2, new LRectangle(0, 0, bitmap2.width, bitmap2.height), new LPoint(w,0));
					bitmapData_2.copyPixels(bitmap2, new LRectangle(0, 0, w, canvasHeight), new LPoint(bitmap2.width+w,0));
					scene_2.addChild(new LBitmap(bitmapData_2)); 
					scene_2.bgWidth = bitmap2.width;
					scene_2.width = bitmap2.width+w*2;
					scene_2.height = canvasHeight;
					creatElement(0);//添加元素			
					$("#map a").show();	
					scene.onload = true;	
				});  
			}); 
		},
		sound:function(){
			sound = new LSound();
			sound.load(data["sound_bg_1"]);
			$("#btn_music").click(function(){monitor.start.sound()});
		}
	}
};
function main()
{  	
	loadingLayer = new LoadingSample1(); 
    addChild(loadingLayer); 
	LLoadManage.load( 
        loadData, 
        function(progress){ 
            loadingLayer.setProgress(progress); 
         }, 
		function(d){
			loadingLayer.remove();
			scene.init(d);
		 }
    );
}

//w:图宽度 h:图高度 x,y:图坐标 sw:点击区域宽度 sh:点击区域高度 x,y:点击区域坐标 a:动画 l:人物介绍 c:动画帧数 game:游戏 s:动画速度 b:显示图片 g:游戏 lI:leftIndex
var element = [
	{"id":"1","name":"香","hid":"ax","scene":1,"w":316,"h":1008,"x":2930,"y":0,"sw":230,"sh":280,"sx":3050,"sy":420,"a":true,"l":true,"t":1,"r":true,"c":5,"lI":5,"s":8},
	{"id":"2","name":"白大大","scene":1,"sw":640,"sh":1008,"sx":2849,"sy":0,"sw":200,"sh":300,"sx":2170,"sy":420,"a":false,"b":false,"l":true,"t":1,"r":true},
	{"id":"3","name":"胡飞","hid":"hf","scene":1,"w":397,"h":1008,"x":1387,"y":0,"sw":230,"sh":350,"sx":1500,"sy":520,"a":true,"l":true,"t":1,"r":true,"c":4,"lI":4,"s":3},
	{"id":"4","name":"华姐","hid":"hj","scene":1,"w":723,"h":1008,"x":4177,"y":0,"sw":330,"sh":350,"sx":4400,"sy":520,"a":true,"l":true,"t":1,"r":true,"c":4,"lI":4,"s":10},
	{"id":"5","name":"红莉","hid":"hl","scene":2,"w":399,"h":1008,"x":795,"y":0,"sw":250,"sh":500,"sx":880,"sy":350,"a":true,"l":true,"t":1,"r":true,"c":6,"lI":6,"s":8},
	{"id":"6","name":"孟波","hid":"mb","scene":2,"w":359,"h":1008,"x":6800,"y":0,"sw":300,"sh":280,"sx":6800,"sy":520,"a":true,"l":true,"t":1,"r":true,"c":5,"lI":5,"s":8},
	{"id":"ck","name":"床帘","hid":"ck","scene":2,"w":"617","h":"397","x":5250,"y":480,"a":true,"c":3,"lI":1,"s":50,"l":false},
	{"id":"7","name":"路人甲","hid":"lrj","scene":2,"w":531,"h":378,"x":5230,"y":630,"sw":430,"sh":300,"sx":5250,"sy":660,"a":true,"b":false,"l":true,"t":1,"c":2,"lI":2,"s":10},
	{"id":"9","name":"解压小游戏","hid":"jy","scene":2,"sw":350,"sh":250,"sx":3030,"sy":660,"a":false,"b":false,"l":true,"t":2},
	{"id":"10","name":"开窗按钮","hid":"ck_open","scene":2,"sw":50,"sh":300,"sx":5875,"sy":480,"a":false,"b":false,"l":true,"t":3}
];
function openWindows(player){
    setTimeout(function () { if (isMoving == false) { player.onframe(); } }, 100);
}
var el_ck;
function creatElement(i)
{
	if(i<element.length)
	{
		var inner = new LSprite();
		var shape = new LShape();
		var player;
		var w = canvasWidth*2*moveSpeed;
		element[i].scene == 1 ? scene_1.addChild(inner) : scene_2.addChild(inner);
		if(element[i].a)//有动画
		{
			var datas = [];
			var listChild = [];
			for (var j = 0; j < element[i].c; j++) {			
				datas.push(new LBitmapData(data[element[i].hid+"_"+(j+1)]));
				listChild.push({dataIndex : j, x : 0, y : 0, width : element[i].w, height : element[i].h, sx : 0, sy : 0});
			}
			player =new LAnimationTimeline(datas, [listChild]);
			inner.addChild(player);
			player.stop();
			if(element[i].lI == element[i].c){
				player.setLabel("left",0,element[i].c-1,1,false);
				player.gotoAndPlay("left");			
			}
			else {//窗户
				player.setLabel("left",0,element[i].c-1,1,false);
			    el_ck = player;
				inner.addEventListener(LMouseEvent.MOUSE_DOWN,function(){
					openWindows(player);
				});	
				/*shape.addEventListener(LMouseEvent.MOUSE_DOWN,function(){
					openWindows(player);
				});*/
			}
			player.speed = element[i].s;//动画速度
			inner.width = element[i].w;
			inner.height = element[i].h;
			inner.x = element[i].x+w;
			inner.y = element[i].y;
			//console.info("creat_animation_"+element[i].name);
		}
		else if(element[i].b)//没有动画
		{
			inner.width = element[i].w;
			inner.height = element[i].h;
			inner.x = element[i].x+w;
			inner.y = element[i].y;
			var loader = new LLoader(); 
			loader.load(data[element[i].hid].src,"bitmapData");  
			loader.addEventListener(LEvent.COMPLETE,function(event){
				inner.addChild(new LBitmap(new LBitmapData(loader.content)));
			});
		}
		if(element[i].l){//点击区域
			element[i].scene == 1 ? scene_1.addChild(shape) : scene_2.addChild(shape);
			shape.graphics.drawRect(0, "#ff0000", [0, 0, element[i].sw, element[i].sh]);
			shape.x = element[i].sx+w;
			shape.y = element[i].sy;	
			shape.addEventListener(LMouseEvent.MOUSE_DOWN, function () {
			    switch (element[i].t)
			    {
			        case 1:
			            elementDown(element[i].id)
			            break;
			        case 2:
			            gameDown(element[i].id)
			            break;
			        case 3:
			            openWindows(el_ck)
			            break;
			    }
			});					
		}
		creatElement(i+1);
	}
	else
	{
		return;
	}
}
function elementDown(id)
{
	setTimeout(function(){
		if(isMoving==false)
		{
			list.open(id);
		}
	},200);
}
function gameDown(id) 
{
	setTimeout(function(){
		if(isMoving==false)
		{
			 list.game(id)
		}
	},200);
}
function onDown(e)
{
	LGlobal.preventDefault=true;
	if(e.clickTarget.name == "container")
	{
		isDown = true;
		isMoving = false;
		var loc=getEvtLoc();
		downX = loc.x;
	}
}
function onMove(e)
{
	if(isDown&&!list.isOpen) //点击
	{
		var loc=getEvtLoc();
		var dx=(loc.x-downX)*moveSpeed;
		var x = e.target.x;
		e.target.x += dx;		
		downX = loc.x;		
		isMoving=true;
	}
}
function onUp(e)
{
	var x = e.target.x;
	if(x>-canvasWidth*moveSpeed) //左边无缝
	{
		e.target.x = -e.target.bgWidth+x;
	}
	else if(x<-e.target.bgWidth-1280*moveSpeed)
	{
		e.target.x = (e.target.bgWidth+x);
	}
	LGlobal.preventDefault=false;
	isDown = false;
	//console.info(e.target.x);
}
function handleOrientation(e)
{
	if(!isDown&&!list.isOpen){
		var bg = container.scene == 1 ? scene_1 : scene_2;
		nowGamma = e.gamma;
		if (nowGamma >  90) { nowGamma =  90};
		if (nowGamma < -90) { nowGamma = -90};
		var dx=-(nowGamma*gammaSpeed);
		var x = bg.x;
		if(x>-canvasWidth) //左边无缝
		{
			bg.x = -bg.bgWidth+x;
		}
		else if(x<-bg.bgWidth-1280*moveSpeed)
		{
			bg.x = (bg.bgWidth+x);
		}
		else{
			bg.x += dx;	
		}
	}
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

function getEvtLoc()
{
	if(isPC)
		return {x:event.offsetX,y:event.offsetY}
	else
		return {x:event.touches[0].pageX,y:event.touches[0].pageY}
} 
function setCookie(name,value) 
{ 
    var Days = 30; 
    var exp = new Date(); 
    exp.setTime(exp.getTime() + Days*24*60*60*1000); 
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString(); 
} 
function getCookie(name)
{
	var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	if(arr=document.cookie.match(reg))
		return unescape(arr[2]);
	else
		return null;
}
var loadData =[
	{"name":"ax_1","path":ImageURL+"el/e_1_1.jpg"},
	{"name":"ax_2","path":ImageURL+"el/e_1_2.jpg"},
	{"name":"ax_3","path":ImageURL+"el/e_1_3.jpg"},
	{"name":"ax_4","path":ImageURL+"el/e_1_4.jpg"},
	{"name":"ax_5","path":ImageURL+"el/e_1_5.jpg"},
	{"name":"hf_1","path":ImageURL+"el/e_3_1.jpg"},
	{"name":"hf_2","path":ImageURL+"el/e_3_2.jpg"},
	{"name":"hf_3","path":ImageURL+"el/e_3_3.jpg"},
	{"name":"hf_4","path":ImageURL+"el/e_3_4.jpg"},
	{"name":"hj_1","path":ImageURL+"el/e_4_1.jpg"},
	{"name":"hj_2","path":ImageURL+"el/e_4_2.jpg"},
	{"name":"hj_3","path":ImageURL+"el/e_4_3.jpg"},
	{"name":"hj_4","path":ImageURL+"el/e_4_4.jpg"},
	{"name":"hl_1","path":ImageURL+"el/e_5_1.jpg"},
	{"name":"hl_2","path":ImageURL+"el/e_5_2.jpg"},
	{"name":"hl_3","path":ImageURL+"el/e_5_3.jpg"},
	{"name":"hl_4","path":ImageURL+"el/e_5_4.jpg"},
	{"name":"hl_5","path":ImageURL+"el/e_5_5.jpg"},
	{"name":"hl_6","path":ImageURL+"el/e_5_6.jpg"},
	{"name":"mb_1","path":ImageURL+"el/e_6_1.jpg"},
	{"name":"mb_2","path":ImageURL+"el/e_6_2.jpg"},
	{"name":"mb_3","path":ImageURL+"el/e_6_3.jpg"},
	{"name":"mb_4","path":ImageURL+"el/e_6_4.jpg"},
	{"name":"mb_5","path":ImageURL+"el/e_6_5.jpg"},
	{"name":"lrj_1","path":ImageURL+"el/e_7_1.png"},
	{"name":"lrj_2","path":ImageURL+"el/e_7_2.png"},
	{"name":"scene_1","path":ImageURL+"b_s_1.jpg"},
	{"name":"scene_2","path":ImageURL+"b_s_2.jpg"},
	{"name":"ck_1","path":ImageURL+"el/ck_1.jpg"},
	{"name":"ck_2","path":ImageURL+"el/ck_2.jpg"},
	{"name":"ck_3","path":ImageURL+"el/ck_3.jpg"},
	{"name":"ax_gif","path":ImageURL+"el_g_1.gif"},
	{"name":"hf_gif","path":ImageURL+"el_g_3.gif"},
	{"name":"hj_gif","path":ImageURL+"el_g_4.gif"},
	{"name":"hl_gif","path":ImageURL+"el_g_5.gif"},
	{"name":"mb_gif","path":ImageURL+"el_g_6.gif"},
	{"name":"lrj_gif","path":ImageURL+"el_g_7.gif"},
	{"name":"ax_i","path":ImageURL+"el_i_1.png"},
	{"name":"bdd_i","path":ImageURL+"el_i_2.png"},
	{"name":"hf_i","path":ImageURL+"el_i_3.png"},
	{"name":"hj_i","path":ImageURL+"el_i_4.png"},
	{"name":"hl_i","path":ImageURL+"el_i_5.png"},
	{"name":"mb_i","path":ImageURL+"el_i_6.png"},
	{"name":"lrj_i","path":ImageURL+"el_i_7.png"},
	{"name":"bdd_b","path":ImageURL+"el_b_2.png"},
	{"name":"hf_b","path":ImageURL+"el_b_3.png"},
	{"name":"hj_b","path":ImageURL+"el_b_4.png"},
	{"name":"hl_b","path":ImageURL+"el_b_5.png"},
	{"name":"lrj_b","path":ImageURL+"el_b_7.png"},
	{"name":"l_1","path":ImageURL+"l_1.png"},
	{"name":"l_2","path":ImageURL+"l_2.png"},
	{"name":"l_3","path":ImageURL+"l_3.png"},
	{"name":"yx_1","path":ImageURL+"yx_1.png"},
	{"name":"sound_bg_1","path":SoundURL+"sound_1.mp3","type":"sound"}
];
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}