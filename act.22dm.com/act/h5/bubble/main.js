var act_id = 48, debug = false;
var v_main;
var weixinData = {
  shareTitle: '“趣”玩跨时空救兵',
  shareDesc: '一起“趣”玩跨时空救兵，让我们一起帮助羊羊们解除危机~',
  shareLink: 'https://act.22dm.com/act/h5/bubble/index.html',
  shareImg: 'https://act.22dm.com/act/h5/bubble/res/icon.jpg'
};
var userInfo = {
  openid: "test_48",
  name: "test",
  face: "res/icon.jpg",
  hightest: 0
}
var winSize = {
  width: 0,
  height: 0,
  topOffset: 0,
  scaleY: 1,
  getTheme: function (score) {
    if (score <= 100)
      return 0;
    else if (score <= 200)
      return 1;
    else
      return 2;
  },
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
          console.log(result);
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
          winSize.ranking.getRankingList();
        }
      });
    },
    getPrize: function () {
      var time = new Date();
      var now = time.getTime();
      if (now > Date.parse("2019/09/01 00:00:00")) {
        var hasPrize = false;
        for (var i = 0; i < v_main.recordList.length; i++) {
          if (v_main.recordList[i].user == userInfo.openid) {
            hasPrize = true;
          }
        }
        if (hasPrize) {
          v_main.active = 'award';
        }
        else {
          alert('您本次没有上榜哦!');
          return false;
        }
      }
      else {
        alert('排行榜截止于2019-08-31,请于结束后再来领取奖品!');
        return false;
      }
    }
  },
  playEffect: function (effect) {
    cc.audioEngine.playEffect(res["audio_" + effect], false);
  },
  setEffectsVolume: function (volume) {
    cc.audioEngine.setEffectsVolume(volume);
    gameMusic.volume = volume;
    v_main.volume = volume;
  },
  resize: function () {
    var width = $(window).width();
    var height = $(window).height();
    var gameCanvas = document.getElementById("gameCanvas");
    gameCanvas.width = width;
    gameCanvas.height = height;
    this.width = width;
    this.height = height > 1400 ? 1400 : height;
    this.scaleY = (height / 1400).toFixed(4);
    console.log(`wodth:${width} , height:${height} , scaleY:${this.scaleY}`);
    $("#all").css({
      width: width,
      height: height
    }).show();
  }
}
var dialogs = {
  loadcount: 0,
  loadres: [],
  loadtag: "dialogs_preload",
  precentWidth: 348,
  loadResFinish: function () {
    cc.spriteFrameCache.addSpriteFrames(res.mm_main_plist, res.mm_main_png);
    cc.spriteFrameCache.addSpriteFrames(res.gp_main_plist, res.gp_main_png);
    cc.spriteFrameCache.addSpriteFrames(res.gs_main_plist, res.gs_main_png);
    v_main.active = '';
    cc.director.runScene(new MainMenuScene());
  }
}
function vueInit() {
  v_main = new Vue({
    el: '#all',
    data: {
      scene: '',
      active: '',
      recordList: [],
      guide: false,
      canPlay: false,
      Game_score: 0,
      Game_over: false,
      currbubble: 1,
      nextbubble: 5,
      music: false
    },
    watch: {
      Game_over: function (newValue, oldValue) {
        if (newValue) {
          console.log("游戏结束");
          this.active = "gameover";
          var theme = winSize.getTheme(this.Game_score);
          if (this.Game_score * 1 > userInfo.hightest) {
            winSize.ranking.addScore(this.Game_score);
          }
          winSize.playEffect('gameover');
          setTimeout(function () {
            this.active = '';
            cc.director.runScene(new GameResultScene({ theme: theme }));
          }.bind(this), 3500)
        }
      }
    },
    methods: {
      Game_resert: function () {
        this.Game_over = false;
        this.Game_score = 0;
        GameManager.reset();
        cc.director.runScene(new GamePlayScene());
        if (!this.guide) {
          this.guide = true;
          this.active = "guide";
        }
      },
      Game_pause: function () {
        cc.director.pause();
      },
      Game_home: function () {
        v_main.active = '';
        cc.director.resume();
        cc.director.runScene(new MainMenuScene());
      },
      Game_continue: function () {
        v_main.active = '';
        cc.director.resume();
      },
      Game_replay: function () {
        v_main.active = '';
        cc.director.resume();
        v_main.Game_resert();
      },
      onPlayMusic: function () {
        var music = document.getElementById("game_music");
        this.music ? music.pause() : music.play();
        this.music = !this.music;
      }
    },
    mounted: function () {
      this.active = 'preload';
      cc.game.run();
    }
  });
  winSize.ranking.getRankingList();
}
$(function () {
  doUserLogin();
  document.getElementById("dialogs").addEventListener("touchmove", function (event) {
    if (event.target.id != "record_list") {
      event.preventDefault();
    }
  });
  initWxJsSdk();
})
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
      var wxData = JSON.parse(res);
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
    document.getElementById('game_music').play();
    var promise = document.querySelector('audio').play();
    if (promise !== undefined) {
      promise.then(function (_) {
        v_main.music = true;
        console.log("Autoplay started!");
      }).catch(function (error) {
        v_main.music = false;
        console.log("Autoplay was prevented");
      });
    }
    wx.onMenuShareTimeline({
      title: weixinData.shareDesc,
      link: weixinData.shareLink,
      imgUrl: weixinData.shareImg,
      success: function success() {
        console.info("onMenuShareTimeline ok");
      },
      cancel: function cancel() {
        console.info("onMenuShareTimeline cancel");
      }
    });
    wx.onMenuShareAppMessage({
      title: weixinData.shareTitle,
      desc: weixinData.shareDesc,
      link: weixinData.shareLink,
      imgUrl: weixinData.shareImg,
      success: function success() {
        console.info("onMenuShareTimeline ok");
      },
      cancel: function cancel() {
        console.info("onMenuShareAppMessage cancel");
      }
    });
  });
}
function doUserLogin() {
  let weddata = decodeURIComponent(getQueryString("webdata"));
  let openid = getQueryString2(weddata, "openid");
  let name = getQueryString2(weddata, "name");
  let face = getQueryString2(weddata, "face");
  if (openid && name && face || getQueryString("debug")) {
    if (openid && name && face) {
      userInfo.openid = openid;
      userInfo.name = name;
      userInfo.face = face;
    }
    winSize.resize();
    vueInit();
  }
  else {
    alert("用户参数错误");
  }
}
cc.game.onStart = function () {
  dialogs.loadres = g_resources;
  dialogs.loadcount = 0;
  loadGameResources();
};
function loadGameResources() {
  cc.loader.load(dialogs.loadres[dialogs.loadcount], function (err) {
    if (dialogs.loadcount >= dialogs.loadres.length - 1) { //全部加载完毕
      dialogs.loadResFinish();
    }
    else {
      dialogs.loadcount++;
      let loading = $("#" + dialogs.loadtag + " .precent_inner");
      let precent = (dialogs.loadcount / (dialogs.loadres.length - 1)).toFixed(2);
      let width = precent * dialogs.precentWidth;
      $("#" + dialogs.loadtag + " .precent_word").text(Math.ceil(precent * 100) + "%");
      if (!$(loading).is(":animated"))
        loading.animate({ width: width + "px" });
      else
        loading.stop().animate({ width: width + "px" });
      loadGameResources();
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