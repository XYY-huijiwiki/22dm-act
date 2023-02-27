var act_id=40,debug=1,isPc=false,offset;
var v_main,book_swiper;
var gamepad;
var userInfo={
	openid    : "test_"+act_id,
	name      : "test",
	face      : "res/Public/icon.jpg",
	hightest  : 0
}
var winSize = {
	width       : 1400,
  height      : 640,
  scale       : 1,
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
          var result = JSON.parse(response);
          console.log(result);
          userInfo.hightest = result.score;
          v_main.recordList = result.scoreList;        
        }
      });
	  },
		addScore : function(score){
			var json = '{"addtime":"str_addtime","score":"'+score+'","name":"'+userInfo.name+'","img":"'+userInfo.face+'","sex":"'+userInfo.sex+'","country":"'+userInfo.country+'","province":"'+userInfo.province+'"}';
      console.info(json);
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
      if (now > Date.parse("2019/02/28 00:00:00")){
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
        alert('排行榜截止于2019-02-28,请于结束后再来领取奖品!');
        return false;
      }
    }
  },
  playMusic : function(){
    if(!cc.audioEngine.isMusicPlaying())
      cc.audioEngine.playMusic(res.audio_music, true); 
  },
	playEffect : function(effect){
		cc.audioEngine.playEffect(res["audio_"+effect],false);
	},
	setEffectsVolume : function(volume){
    v_main.volume = volume;
    cc.audioEngine.setEffectsVolume(volume);
    cc.audioEngine.setMusicVolume(volume);
	},
	resize : function(){
    var isPc = IsPC();
    var width = isPc ? $(window).width() : $(window).height();
    if(width<1400){
      winSize.width = width;
      winSize.scale = (width/1400).toFixed(4);
      console.log("width: "+width);
      console.log("scale: "+winSize.scale);
    }
    if(isPc){
      $("#all").css({
        width : winSize.width,
        height : winSize.height,
        top : $(window).width()>640?($(window).height()-640)/2 : 0,
        left : $(window).width()>1400?($(window).width()-1400)/2 : 0
      }).show();
    }
    else{
      offset = winSize.width/2-320;
      $("#all").css({
        width : winSize.width,
        height : winSize.height,
        'transform':'rotate(89.99deg)',
        '-webkit-transform ':'rotate(89.99deg)',
        top : offset,
        left : -offset
      }).show();
    }
    $("#book_container").css({
        'webkitTransform':'scale('+winSize.scale+')',
			  'transform':'scale('+winSize.scale+')'
    });
    var gameCanvas = document.getElementById("gameCanvas");
    gameCanvas.width = winSize.width;
    gameCanvas.height = winSize.height;   
	}
}
var dialogs = {
	loadcount : 0, 
	loadres   : [],
	loadtag   : "dialogs_preload",
	precentHeight : 335,
	loadResFinish:function(){
    cc.spriteFrameCache.addSpriteFrames(res.gp_main_plist_0,res.gp_main_png_0);
    cc.spriteFrameCache.addSpriteFrames(res.gp_main_plist_1,res.gp_main_png_1);
    cc.spriteFrameCache.addSpriteFrames(res.gs_main_plist,res.gs_main_png);

    v_main.active="";
    
		//cc.director.runScene(new MainMenuScene());
		
		v_main.Game_resert();

    //cc.director.runScene(new GameResultScene({theme:3})); 
  
	}
}
function vueInit(){
  v_main = new Vue({
    el: '#all',
    data: {
      scene : "",
      active   : '',
      tips     : {tid : 1,	did:1,rid:1},
      recordList : [],
      guide    : 10,
      canPlay : false,
      Game_strength : 0,
      Game_score : 0,
      Game_hp : 3,
      Game_touch : false,
      Game_over : false,
      volume : 1,
      book : 1,
      role : null
    },
    watch : {
      Game_score : function(newValue,oldValue){
        if(!this.Game_over){
          GameManager.totalScore = newValue;
          cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_UPDATE_SCORE_TEXT));
        }
      },
      Game_hp : function(newValue,oldValue){
        if(!this.Game_over){
          GameManager.currentHp += newValue-oldValue;
          cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_UPDATE_HP));
          if(GameManager.currentHp==0){
            this.Game_over=true;
          }
        }
      },
      Game_touch : function(newValue,oldValue){
        if(newValue==true){
          cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_ROLE_ATTACK_BEFORE));
        }
        else{
          cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_ROLE_ATTACK_AFTER));
          this.Game_strength = 0;
        }
      },
      Game_over : function(newValue,oldValue){
        if(newValue){
          this.canPlay = false;
          var theme = this.Game_score<50?1:this.Game_score<200?2:3;
          cc.director.runScene(new GameResultScene({theme:theme}));
          if(this.Game_score>userInfo.hightest)
          {
            winSize.ranking.addScore(this.Game_score);
          }
        }
      }
    },
    methods:{
      Game_resert : function(){
        this.Game_over = false;
        this.canPlay = false;
        this.Game_hp = 3;
        this.Game_score = 0;
        this.book=1;
        GameManager.reset();
        cc.director.runScene(new GamePlayScene());
      },
      Game_pause : function(){
        cc.director.pause();
      },
      Game_home : function(){
        v_main.active='';
        cc.director.resume();
        cc.director.runScene(new MainMenuScene());
      },
      Game_continue : function(){
        v_main.active='';
        cc.director.resume();
      },
      Game_replay : function(){
        v_main.active='';
        cc.director.resume();
        v_main.Game_resert();
      },
      guideLeave : function(){
        if(this.guide!=4){
          this.guide++;
        }
        else{
          this.guide=10;
          v_main.active="";
          GameManager.createWolfPoor();
        }
      },
      tipsLeave : function(){
        if(GameManager.level!=1){
          GameManager.level++;
          GameManager.createWolfPoor();
        }
        else{
          this.canPlay = true;
        }
      },
      Book_role:function(){
        GameManager.currentRoleId = this.role;
        this.active="";
        this.Game_resert();
      },
      mm_music : function(){
        var sender = GameManager.button.mm_music;
        if(sender._bright){  //静音
          sender.setBright(false);
          winSize.setEffectsVolume(0);
        }
        else{   //开启声音
          sender.setBright(true);
          winSize.setEffectsVolume(1);
        }
      },
      gp_music : function(){
        var sender = GameManager.button.gp_music;
        if(sender._bright){  //静音
          sender.setBright(false);
          winSize.setEffectsVolume(0);
        }
        else{   //开启声音
          sender.setBright(true);
          winSize.setEffectsVolume(1);
        }
      },
      button_public : function(active){
        winSize.playEffect('button');
        v_main.active=active;
      }
    },
    mounted : function(){
      this.active='preload';
      cc.game.run();
    }
  });
  //winSize.ranking.getRankingList();
}
$(function(){
	doUserLogin();
})
function doUserLogin(){
		winSize.resize();
    vueInit();
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
			var loading = $("#"+dialogs.loadtag+" .precent_progress");
			var precent = (dialogs.loadcount/(dialogs.loadres.length-1)).toFixed(2);
			$("#"+dialogs.loadtag+" .precent_word").text(Math.ceil(precent*100)+"%");
			if(!$(loading).is(":animated"))
      loading.animate({height:(dialogs.precentHeight)*dialogs.loadcount/(dialogs.loadres.length-1)+"px"});
			else
      loading.stop().animate({height:(dialogs.precentHeight)*dialogs.loadcount/(dialogs.loadres.length-1)+"px"});
      loadGameResources();
		}
	})
}
function getQueryString(name){
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r!=null)return (r[2]); return null;
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
function gamePadInit(){
	gamepad = new Gamepad();
  gamepad.init();
  gamepad.bind(Gamepad.Event.BUTTON_DOWN, function(e) {
    var ctr = e.control;
    //console.info(ctr);
    if(ctr=="FACE_2"){
      if(v_main.scene=="MainMenuScene"){
        v_main.Game_resert();
      }
      if(v_main.scene=="GamePlayScene"){
        v_main.guide ?  cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_ROLE_JUMP)) : v_main.active = "";
      }
      if(v_main.scene=="GameResultScene"){
        cc.director.runScene(new MainMenuScene());
      }
    }
    else if(ctr=="SELECT_BACK"){
      location.href = location.href;
    }
    else if(ctr=="START_FORWARD"){
      v_main.Game_resert();
    }
});
}