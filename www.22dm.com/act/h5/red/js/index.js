var bodyWidth=$(window).width()-3;
var bodyHeight=$(window).height()-3;
var countLoop,prizeOpen,stop,probability,limitBeginX,limintEndX,timeLeft,timeRight,disappearTime,disappearY,rotateLeft,rotateright,countOpen,countEnd,total,redCount;
var loadingLayer,container,data,canvasWidth,bodyHeight;
var ImageURL = '/act/h5/red/images/';
var easeList=['LEasing.None.easeIn','LEasing.Quad.easeIn','LEasing.Circ.easeOut'];
var red={
	clickcount:0,
	start:false,
	begin:'2017-01-27 16:00:00',
	end:'2017-02-02 17:00:00',
	hour:16,
	showIndex:function(){
		var html = '<div id="red_index"><a id="red_close" onclick="dialogs.closeDialogs()"></a><a id="red_go" onclick="red.init()"></a><img src="/act/h5/red/images/ti.png" width="640" height="807"></div>';
		dialogs.removeAll();
		dialogs.addInnerDiv(html);
		
	},
	init:function(){
		if(red.clickcount<5){
		var time = new Date();
		var now = time.getTime();
		if(now>Date.parse(red.begin) && now<Date.parse(red.end)){
			var hour =  time.getHours();
			if(hour==red.hour){
				red.start = true;		
console.info("red:begin");	
			}
		}
			if(red.start){
				if(act.data.login){
					dialogs.closeDialogs();
					$("#red_wrap").fadeIn(300);
					LGlobal.preventDefault = true;
					element.creat();
					red.clickcount ++;			
				}
				else{
					dialogs.removeAll();
					login.init();
				}
			}
			else{
				act.openDialogs.tips_dw("新年红包雨","活动尚未开始哦~","本窗口将会在5秒后关闭",5000);
			}		
		}
		else{
			act.openDialogs.tips_dw("提示","别着急，慢慢来~","本窗口将会在3秒后关闭",3000);
		}		
	},
	doPrize:function(){
		$.ajax({
			cache: false,
			async: false,
			type: "POST",
			url: "/act/h5/red/getRedPrize.ashx",
			data: {
				
			},
			success: function (response) {
				console.info(response);
				var result = JSON.parse(response);
				if(result.success){
					if(result.returnStr.prize_type=="0"){
						red.removeAll();
						act.openDialogs.tips_dw('新年红包雨','啊哦，差一点点就中奖了<br/>明天再来试试吧！<br/><img src="/act/h5/red/images/'+element.getIntRandom(9,21)+'.gif" width="240" height="240">',"提示:活动每天16-17点开始哦",10000);
					}
					else{
						red.removeAll();
						var onlycode = result.returnStr.onlycode;
						var src = result.returnStr.src;
						act.openDialogs.puzzle_dw(3,"喜大普奔!","恭喜您获得了",result.returnStr.src,result.returnStr.onlycode);
					}
				}
				else{
					red.removeAll();
					act.openDialogs.tips_dw("提示",result.returnStr,"本窗口将会在10秒后关闭",10000);		
				}
			},
			error: function (data) {
				console.info("error: " + data.responseText);
				return false;
			}
		});
	},
	closeIndex:function(){
		$("#red_index").fadeOut(300);	
	},
	removeAll:function(){
		LGlobal.preventDefault = false;
		$("#red_wrap").empty().fadeOut(300);
	}
}
var loadData =[
	{name:"red_1",path:ImageURL+"hb_1.png"},
	{name:"red_2",path:ImageURL+"hb_2.png"},
	{name:"red_3", path: ImageURL + "hb_3.png" },
    { name: "red_4", path: ImageURL + "r_1.png" },
	{ name: "red_5", path: ImageURL + "r_2.png" },
	{ name: "red_6", path: ImageURL + "r_3.png" },
    { name: "red_7", path: ImageURL + "r_4.png" },
	{ name: "red_8", path: ImageURL + "r_5.png" },
	{name:"red_1_2",path:ImageURL+"hb_1_2.png"},
	{name:"red_2_2",path:ImageURL+"hb_2_2.png"},
	{ name: "red_3_2", path: ImageURL + "hb_3_2.png" },
    { name: "red_4_2", path: ImageURL + "r_1_2.png" },
    { name: "red_5_2", path: ImageURL + "r_2_2.png" },
    { name: "red_6_2", path: ImageURL + "r_3_2.png" },
    { name: "red_7_2", path: ImageURL + "r_4_2.png" },
    { name: "red_8_2", path: ImageURL + "r_5_2.png" },
];
$(function(){
	$("#canvas-wrap").css({"width":bodyWidth,"height":bodyHeight});
	canvasWidth=bodyWidth;
	canvasHeight=bodyHeight;
	stop=false;
	probability=10;//中奖几率(%)
	limitBeginX=20;
	limintEndX=canvasWidth-20;
	rotateLeft=-30;
	rotateright=30;
	timeLeft=1.2;
	timeRight=1.5;
	disappearTime=0.5;//不中奖消失的时间
	disappearY=300;//不中奖消失的位移
	total = 500;//最大下落数
	countOpen=0;//红包打开的数
	countEnd=10;//中奖点击最大数
	redCount = 0;//下落的红包数
	prizeOpen=false;
	countLoop=5;
	LGlobal.preventDefault = false;
	init(18, "canvas-wrap", canvasWidth, canvasHeight, main);
})
function redDown(e)
{
	countOpen++;
	//不管这么多,先把你置顶先啦	
	container.setChildIndex(e.clickTarget,container.numChildren-1);
	if(!getPrize())//没有中奖啦,红包改变状态
	{	
		element.showNo(e.clickTarget);
	}
	else//中奖啦,先进行element.stop 然后异步查库存吧
	{
		element.showHas(e.clickTarget);
	}
}
var element={
	creat:function(){
		redCount++;
		var ran = this.getIntRandom(1,8);
		var name = "red_" + ran;
		var pngLayer = new InteractivePNG();
		var loader = new LLoader(); 
		loader.load(data[name].src,"bitmapData");  
		loader.addEventListener(LEvent.COMPLETE,function(event){
			var bitmap = new LBitmap(new LBitmapData(loader.content));
			var loader2 = new LLoader();
			loader2.load(data[name+"_2"].src,"bitmapData");  //不中的图片
			loader2.addEventListener(LEvent.COMPLETE,function(event){
				var bitmap2 = new LBitmap(new LBitmapData(loader2.content));
				bitmap2.visible=false;
				pngLayer.width = bitmap.width;
				pngLayer.height = bitmap.height;
				pngLayer.rotateCenter = true;
				var p = element.initPosition(pngLayer.width,pngLayer.height);
				pngLayer.x=p.x;//起始X
				pngLayer.y=-bitmap.height;
				bitmap.rotate=p.rotate;//旋转角度
				bitmap2.rotate=p.rotate;//旋转角度
				pngLayer.addChild(bitmap2);
				pngLayer.addChild(bitmap);
				pngLayer.name='red_'+redCount;
				container.addChild(pngLayer);
				pngLayer.addEventListener(LMouseEvent.MOUSE_DOWN,redDown);
				pngLayer.tween=element.startMove(pngLayer);	
				if(redCount<=total)
				{
					setTimeout(function(){
						if(!stop)
							element.creat();
					},250);
				}
			});
		});
	},
	showNo:function(e){ //停止当前的缓动,移除监听事件
		element.stopTween(e.tween);
		e.removeEventListener(LMouseEvent.MOUSE_DOWN);	
		element.showOpen(e);
		element.disappear(e);
	},
	showHas:function(e){
		stop = true;
		LTweenLite.removeAll();//停止动画
		e.removeEventListener(LMouseEvent.MOUSE_DOWN);
		var index = container.getChildIndex(e);
		container.setChildIndex(e,container.numChildren-1); //再次置顶
		for(var i=0;i<index;i++)
		{			
			container.childList[i].removeEventListener(LMouseEvent.MOUSE_DOWN);
			element.disappear(container.childList[i]);	
		}
		element.showOpen(e);
		e.childList[0].rotate=0;
		var tmp = 0;
		var tween = LTweenLite.to(e.childList[0], 0.15, { rotate: 30, loop: true }).to(e.childList[0], 0.15, {rotate: -30, onComplete: function (e) {
		    tmp++;
		    if (tmp==countLoop)
			{
				tmp=countLoop;
			    console.info("finish");
				tween.loop=false;
				tween.stop = true;
				LTweenLite.removeAll();//停止动画
				red.doPrize();
				return false;
			}
		}});//播放摇晃效果	
	},
	showOpen:function(e){
		e.childList[1].remove();
		e.childList[0].visible=true;
	},
	disappear:function(e){
		LTweenLite.to(e,disappearTime,{y:e.y+disappearY,alpha:0,onComplete:function(e){
			e.remove();
		}});
	},
	setTop:function(e){
		container.setChildIndex(e,container.numChildren-1);
	},
	initPosition:function(w,h){	
		var rotate = this.getIntRandom(-60,60);
		var offsetX=0,offsetY=0;//确保旋转后的玩意不会超越边界显示,以及下落到最低端才消失		
		/*if(rotate>0)//
			offsetX=(Math.cos(rotate*Math.PI/180)*h).toFixed(0);
		else
			offsetY=(Math.cos(rotate*Math.PI/180)*w).toFixed(0);*/
		return {"x":this.getIntRandom(limitBeginX+offsetX,limintEndX-w-offsetX),"rotate":rotate,"y":offsetY};
	},
	startMove:function(e){
		return LTweenLite.to(e,element.getFloorRandom(timeLeft,timeRight,1),{y:canvasHeight+50,alpha:0.9,loop:false,ease:element.getEase(),onComplete:function(e){
			element.remove(e);		
		}});
	},
	stopTween:function(e){
		LTweenLite.remove(e);
	},
	remove:function(e){
		//相应轨道上的数量-1
		LTweenLite.remove(e);
		e.removeEventListener(LMouseEvent.MOUSE_DOWN);
		e.remove();
	},
	getFloorRandom:function(n,m,f){
		var c = m-n+1;  
		return (Math.random() * c + n).toFixed(f);
	},
	getIntRandom:function(n,m){
		var c = m-n+1;  
		return Math.floor(Math.random() * c + n);
	},
	getEase:function(){
		return easeList[this.getIntRandom(0,easeList.length-1)];
	}
}
function main()
{  	
	loadingLayer = new LoadingSample1(); 
    addChild(loadingLayer); 
	LLoadManage.load( 
        loadData, 
        function(progress){ 
            loadingLayer.setProgress(progress); 
         }, 
        canvasInit
    );	
} 
function canvasInit(d)
{
	data = d;
	removeChild(loadingLayer);
	loadingLayer = null;
	container = new LSprite();	
	container.name = "container";
	container.width = canvasWidth;
	container.height = canvasHeight;
	addChild(container);
}
function getPrize() {
    if (countOpen >= countEnd)
        return true;
    else if (element.getIntRandom(0, 100) < probability)
        return true
    return false
}


