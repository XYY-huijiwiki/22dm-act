var act_id = 53,dt,dt_audio;
var v_main;
var weixinData = {
  shareTitle: '团圆盖盖乐',
  shareDesc: '专属你口味的月饼~这个中秋盖出你的新意',
  shareLink: 'https://cpeact.gdalpha.com/act/h5/moon/index.html',
  shareImg: 'https://cpeact.gdalpha.com/act/h5/moon/res/icon.jpg'
};
var userInfo = {
  openid: "test_" + act_id,
  name: "test",
  face: "res/Public/icon.jpg",
  hightest: 0
}
var winSize = {
  width: 1400,
  height: 640,
  scale: 1,
  ranking: {
    getRankingList: function () {
      $.ajax({
        cache: false,
        async: false,
        type: "POST",
        url: '/act/h5/getRanking.ashx',
        data: {
          "act_id": act_id,
          "init": "1",
          "user": userInfo.openid
        },
        success: function (response) {
          var result = JSON.parse(response);
          userInfo.hightest = result.score;
          v_main.recordList = result.scoreList;
        }
      });
    },
    addScore: function (score) {
      var json = '{"addtime":"str_addtime","score":"' + score + '","name":"' + userInfo.name + '","img":"' + userInfo.face + '"}';
      console.info(json);
      userInfo.hightest = score;
      $.ajax({
        cache: false,
        async: false,
        type: "POST",
        url: '/act/h5/getRanking.ashx',
        data: {
          "act_id": act_id,
          "init": "0",
          "type": "add",
          "user": userInfo.openid,
          "score": score,
          "json": json
        },
        success: function (response) {
          console.log(response);
          winSize.ranking.getRankingList();
        }
      });
    },
    getPrize: function () {
      var time = new Date();
      var now = time.getTime();
      if (now > Date.parse("2019/10/31 00:00:00")) {
        var hasPrize = false;
        for (var i = 0; i < v_main.recordList.length; i++) {
          if (v_main.recordList[i].user == userInfo.openid) {
            hasPrize = true;
          }
        }
        if (hasPrize) {
          $("#award").show();
        }
        else {
          alert('您本次没有上榜哦!');
          return false;
        }
      }
      else {
        alert('排行榜截止于2019-10-31,请于结束后再来领取奖品!');
        return false;
      }
    }
  },
  playEffect: function (effect) {
    if(v_main.loadaudio && v_main.music)
      cc.audioEngine.playEffect(res_audio["audio_" + effect], false);
  },
  setEffectsVolume: function (volume) {
    cc.audioEngine.setEffectsVolume(volume);
    volume == 1 ?document.getElementById('audio').play() :　document.getElementById('audio').pause();
  },
  resize: function () {
    var width = IsPC() ? $(window).width() : $(window).height();
    if (width < 1400) {
      winSize.width = width;
      winSize.scale = (width / 1400).toFixed(4);
    }
    if (IsPC()) {
      $("#all").css({
        width: winSize.width,
        height: winSize.height,
        top: $(window).width() > 640 ? ($(window).height() - 640) / 2 : 0,
        left: $(window).width() > 1400 ? ($(window).width() - 1400) / 2 : 0
      }).show();
    }
    else {
      offset = winSize.width / 2 - 320;
      $("#all").css({
        width: winSize.width,
        height: winSize.height,
        'transform': 'rotate(89.99deg)',
        '-webkit-transform ': 'rotate(89.99deg)',
        top: offset,
        left: -offset
      }).show();
    }
    var gameCanvas = document.getElementById("gameCanvas");
    gameCanvas.width = winSize.width;
    gameCanvas.height = winSize.height;
    vueInit();
  }
}
var dialogs = {
  loadres: [],
  loadaudio: [],
  loadcount: 0,
  loadaudiocount: 0,
  precentWidth: 250,
  loadResFinish: function () {
    cc.spriteFrameCache.addSpriteFrames(res.mm_main_plist, res.mm_main_png);
    cc.spriteFrameCache.addSpriteFrames(res.gp_main_plist, res.gp_main_png);
    cc.spriteFrameCache.addSpriteFrames(res.gs_main_plist, res.gs_main_png);
    v_main.active = "";
    let s = getQueryString("s");
    if(v_main.debug && s!=null){
      if(s=="gp"){
        v_main.Game_resert(); 
      }
      else if(s=="gs"){
        v_main.onGameResult(getQueryString("t")!=null?getQueryString("t") : "g");
      }
      else{
        cc.director.runScene(new MainMenuScene());
      }
    }
    else{
      cc.director.runScene(new MainMenuScene());
    }
    winSize.ranking.getRankingList();
    initWxJsSdk();
  }
}
function vueInit() {
  v_main = new Vue({
    el: '#all',
    data: {
      debug : false,
      version : "1.1.0",
      width:0,
      height:0,
      scale:0,
      musicpromise:false,
      imgtime : 0,
      audiotime : 0,
      visibilitychange : 0,
      active: '',
      scene: "",
      music : false,
      recordList: [],
      canPlay: false,
      loadaudio : false,
      Game_score: 0,
      Game_HP : 5,
      Game_miss : 0,
      Game_mooncount : 0,
      Game_moonspeed : 3,
      Game_beltspeed : 1.5,
      Game_over: false,
      Game_y : 0,
      Game_b : 0,
      Game_r : 0,
      Game_g : 0,
      Game_perfect : 0,
      Game_good : 0,
      Game_normal : 0,
      Game_combo : 0,
      Game_combomax : 0,
      music: false,
      guide: 0,
      share : false
    },
    watch: {
      Game_miss : function(newValue,oldValue){
        if(newValue>0){
          this.Game_HP--;
          this.Game_combo = 0;
          winSize.playEffect('miss');
        }
      },
      Game_HP : function(newValue,oldValue){
        if(newValue<=0){
          this.canPlay = false;
          this.Game_over = true;
          this.active = "gameover";
          setTimeout(function(){
            this.onGameResult(false);
          }.bind(this),4000);
          if(this.Game_score>userInfo.hightest){
            winSize.ranking.addScore(this.Game_score);
          }
        }
      },
      Game_perfect : function(newValue,oldValue){
        if(newValue>0){
          let add = 20;
          if(newValue >= 5){
            add += newValue*5;
          }
          this.Game_score += add;
          let event = new cc.EventCustom(jf.EventName.GP_ON_COMBO);
          event.setUserData({type: "perfect"});
          cc.eventManager.dispatchEvent(event);
          winSize.playEffect('perfect');
        }
      },
      Game_good : function(newValue,oldValue){
        if(newValue>0){
          let add = 10;
          this.Game_score += add;
          let event = new cc.EventCustom(jf.EventName.GP_ON_COMBO);
          event.setUserData({type: "good"});
          cc.eventManager.dispatchEvent(event);
          winSize.playEffect('normal');
        }
      },
      Game_normal : function(newValue,oldValue){
        if(newValue>0){
          let add = 5;
          this.Game_score += add;
          winSize.playEffect('normal');
        }
      },
      Game_combo : function(newValue,oldValue){
        if(newValue==0){
          if(this.Game_combomax < oldValue){
            this.Game_combomax = oldValue
            //console.log("combomax:"+oldValue);
          }
        }
      },
      Game_mooncount : function(newValue,oldValue){
        if(newValue!=0){
          if(newValue%GameManager.speedMoonDuration == 0){
            if(this.Game_moonspeed>GameManager.speedMoonMin){
              this.Game_moonspeed += GameManager.speedMoonOffset;
              let speed = $("#topbar_speed .inner_bg");
              let precent = (GameManager.speedMoonMax-this.Game_moonspeed) / (GameManager.speedMoonMax-GameManager.speedMoonMin) * 130;
              if (!$(speed).is(":animated"))
                speed.animate({ width: precent + 30 + "px" });
              else
                speed.stop().animate({ width: precent + 30 +"px" });
            }
          }
          if(newValue%GameManager.speedMoonDuration == 0){
            if(this.Game_beltspeed>GameManager.speedBeltMin){
              this.Game_beltspeed += GameManager.speedBeltOffset;
            }        
          }
        }
      },
      loadaudio : function(newValue){
        if(newValue){
          if(this.scene=="GamePlayScene" && this.active=="guide"){
            this.guideLeave(0);
          }
        }
      }
    },
    methods: {
      Game_resert: function () {
        this.canPlay = false;
        this.Game_over = false;
        this.Game_score = 0;
        this.Game_y = 0;
        this.Game_b = 0;
        this.Game_g = 0;
        this.Game_r = 0;
        this.Game_miss = 0;
        this.Game_perfect = 0;
        this.Game_good = 0;
        this.Game_normal = 0;
        this.Game_combo = 0;
        this.Game_combomax = 0;
        this.Game_beltspeed = GameManager.speedBeltMax;
        this.Game_moonspeed =  GameManager.speedMoonMax;
        this.Game_mooncount = 0;
        this.Game_HP = 5;
        GameManager.reset();
        this.scene = "GamePlayScene";
        cc.director.runScene(new GamePlayScene());
        if(this.guide>=3){
          this.active = "";
          this.canPlay = true;
        }
        else{
          this.active = "guide";
        }
      },
      Game_pause: function () {
        cc.director.pause();
      },
      Game_home: function () {
        this.active = '';
        cc.director.resume();
        cc.director.runScene(new MainMenuScene());
      },
      Game_continue: function () {
        this.active = 'topbar';
        cc.director.resume();
      },
      Game_replay: function () {
        this.active = '';
        cc.director.resume();
        this.Game_resert();
      },
      Game_laser : function(type){
        let laserindex =GameManager.belt.sequence.indexOf(type);
        let btn = GameManager.spriteBelt.btn[laserindex];
        if(!btn.working){
          let success = false;
          btn.working = true;
          if(this.canPlay){
            for(let i=0 ; i<GameManager.currMoonPool.length;i++){
              let moon = GameManager.currMoonPool[i];
              if(moon.type == type){
                let lasery = GameManager.belt.laser[laserindex].y;
                //console.log(`moony: ${moon.y} , lasery:${lasery}`);
                //在可激光区域内
                if(moon.y < lasery+90 && moon.y>lasery-25){
                  if(!moon.laser){
                    moon.laser = true;
                    let designOffsetY = 0;
                    if(moon.y > lasery+25){
                      if(moon.y < lasery+70){
                        this.Game_perfect ++;
                      }
                      else{
                        this.Game_good ++;
                        this.Game_perfect=0;
                        designOffsetY = -4;
                      }
                    }
                    else{
                      this.Game_perfect=0;
                      this.Game_good=0;
                      this.Game_normal++;
                      designOffsetY = 8;
                    }
                    this["Game_"+type]++;
                    this.Game_combo ++;
                    moon.design.y += designOffsetY;
                    moon.design.visible = true;
                    btn.working = false;
                    success = true;
                    break;
                  }
                }
              }
            }
          }
          btn.runAction(ActionManager.GP_BTN_DOWN(function(){
            if(!success){
              btn.working = false;
            }
          }));
        }
      },
      onGameResult : function(flag){
        let type = "g";
        let effect = "normal";
        if(!flag){
          type = "g";
          if(this.score > 20000){
            type = "l";
            effect = "best";
          }
          else{
            let arr = [];
            arr.push(this.Game_y);
            arr.push(this.Game_b);
            arr.push(this.Game_r);
            arr.push(this.Game_g);
            let max = arr.reduce( ( p,c,i,a )=> { if( i == 0 ){ return 0; }else{ if( c >= a[p] ) { return i }else { return p } } }, 0 );
            type = GameManager.belt.sequence.split("")[max];
          }
        }
        else{
          type = flag;
          effect = flag == "l" ? "best" : "normal";
        }
        if(GameManager.belt.sequence.split("").indexOf(type) == -1 && type!="l"){
          type = "g";
        }
        cc.director.runScene(new GameResultScene({type:type}));
        winSize.playEffect("gameover_"+effect);
        this.share = false;
        this.active = "";
      },
      toDataUrl : function(){
        setTimeout(function(){
          let dataUrl = document.getElementById('gameCanvas').toDataURL(0,0,640,winSize.width,"image/jpeg",1)
          document.getElementById('wallpaper').src = dataUrl;
        }.bind(this),200)
        this.active = 'wallpaper';
      },
      onPlayMusic : function(){
        winSize.setEffectsVolume(this.music?0:1);
        this.music = !this.music;
      },
      guideLeave: function (isFromPage) {
        if(isFromPage==1){
          if(this.guide <= 2){
            if(this.guide==0){
              cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_LOAD_GUIDE_MOON));
            }
            else if(this.guide==1){
              GameManager.spriteGuide.removeFromParent();
            }
            else if(this.guide==2 && this.loadaudio){
              this.active = "";
              this.canPlay = true;
            }
            this.guide++;
          }
        }
        else{
          if(this.guide==3){
            this.active = "";
            this.canPlay = true;
          }
        }
      },
      button_public: function (active) {
        winSize.playEffect('button');
        v_main.active = active;
      },
      onVisibilityChange : function(hidden){
        if(hidden){
          if(this.music){
            this.onPlayMusic();
          }
          if(this.scene=="GamePlayScene"){
            this.active = "pause";
          }
        }
      }
    },
    mounted: function () {
      this.active = 'preload';
      this.debug = getQueryString("debug") != null ? true : false;
      cc.game.run();
      this.$nextTick(function () {
        document.getElementById("Game_btn").addEventListener(IsPC() ? "mousedown" : "touchstart",function(e){
          let id = e.target.id;
          if(id.indexOf("btn_")!=-1 && id.length==5){
            this.Game_laser(id.substr(4,1));
          }
        }.bind(this));
        if(!IsPC()){
          document.getElementById("all").addEventListener("touchmove",function(e){
            if(this.active!="record"){
              e.preventDefault();
            }
          }.bind(this));
          document.addEventListener("visibilitychange", () => { 
            this.onVisibilityChange(document.hidden);
            this.visibilitychange++;
          });
        }
      })
    }
  });
}

$(function () {
  doUserLogin();
})
function doUserLogin() {
  var weddata = decodeURIComponent(getQueryString("webdata"));
  var openid = getQueryString2(weddata, "openid");
  var name = getQueryString2(weddata, "name");
  var face = getQueryString2(weddata, "face");
  if (openid && name && face) {
    userInfo.openid = openid;
    userInfo.name = name;
    userInfo.face = face;
    winSize.resize();
  }
  else if (getQueryString("debug") != null) {
    winSize.resize();
  }
  else {
    alert("用户参数错误");
  }
}
cc.game.onStart = function () {
  dialogs.loadres = g_resources;
  dialogs.loadaudio = a_resources;
  dialogs.loadcount = 0;
  dialogs.loadaudiocount = 0;
  dt = new Date();
  loadGameResources();
};
function initWxJsSdk() {
  $.ajax({
    cache: false,
    async: false,
    type: "POST",
    url: '/act/getWeiXinToken.ashx',
    data: {
      thisUrl: location.href.split('#')[0]
    },
    success: function success(res) {
      let wxData = JSON.parse(res);
      wx.config({
        debug: false,
        appId: wxData.appId,
        timestamp: wxData.timestamp,
        nonceStr: wxData.nonceStr,
        signature: wxData.signature,
        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage']
      });
    }
  });
  wx.ready(function () {
    document.getElementById('audio').play();
    var promise = document.querySelector('audio').play();
    if (promise !== undefined) {
      promise.then(function (_) {
        v_main.music = true;
        v_main.musicpromise = true;
      }).catch(function (error) {
        v_main.music = false;
      });
    }
    wx.onMenuShareTimeline({
      title: weixinData.shareDesc,
      link: weixinData.shareLink,
      imgUrl: weixinData.shareImg
    });
    wx.onMenuShareAppMessage({
      title: weixinData.shareTitle,
      desc: weixinData.shareDesc,
      link: weixinData.shareLink,
      imgUrl: weixinData.shareImg
    });
  });
}
function loadGameResources() {
  cc.loader.load(dialogs.loadres[dialogs.loadcount], function (err) {
    if (dialogs.loadcount >= dialogs.loadres.length - 1) {
      dialogs.loadResFinish();
      dt_audio = new Date();
      v_main.imgtime  = dt_audio- dt;
      loadAudioResources();
    }
    else {
      dialogs.loadcount++;
      var loading = $("#dialogs_preload .progress_bg");
      var precent = (dialogs.loadcount / (dialogs.loadres.length - 1)).toFixed(2);
      $("#dialogs_preload .precent_word").text(Math.ceil(precent * 100) + "%");
      if (!$(loading).is(":animated"))
        loading.animate({ width: (dialogs.precentWidth) * dialogs.loadcount / (dialogs.loadres.length - 1) + "px" });
      else
        loading.stop().animate({ width: (dialogs.precentWidth) * dialogs.loadcount / (dialogs.loadres.length - 1) + "px" });
      loadGameResources();
    }
  })
}
function loadAudioResources() {
  cc.loader.load(dialogs.loadaudio[dialogs.loadaudiocount], function (err) {
    if (dialogs.loadaudiocount >= dialogs.loadaudio.length - 1) {
      v_main.loadaudio = true;
      v_main.audiotime  = new Date() - dt_audio;
    }
    else {
      dialogs.loadaudiocount++;
      loadAudioResources();
    }
  })
}
function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return (r[2]); return null;
}
function getQueryString2(url, name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = url.match(reg);
  if (r != null) return (r[2]); return null;
}
function IsPC() {
  var userAgentInfo = navigator.userAgent;
  var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
  var flag = true;

  for (var v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false;
      break;
    }
  }
  return flag;
}
var award = {
  close : function(){
    $("#award").hide();
  },
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
      url: '/act/h5/getRanking.ashx',
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
