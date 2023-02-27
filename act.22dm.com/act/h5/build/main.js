var act_id = 54, debug = 0;
var v_main;
var weixinData = {
  shareTitle: '摩天狼堡大挑战',
  shareDesc: '太“南”了，你hold住了吗？',
  shareLink: 'https://act.22dm.com/act/h5/build/index.html',
  shareImg: 'https://act.22dm.com/act/h5/build/res/icon.jpg'
};
var userInfo = {
  openid: "test_" + act_id,
  name: "test",
  face: "res/Public/icon.jpg",
  hightest: 0
}
var winSize = {
  width: 640,
  height: 1400,
  scale: 1,
  topOffset: 0,
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
          console.log(response);
          var result = JSON.parse(response);
          userInfo.hightest = result.score;
          v_main.recordList = result.scoreList;
        }
      });
    },
    addScore: function (score) {
      var json = '{"addtime":"str_addtime","score":"' + score + '","name":"' + userInfo.name + '","img":"' + userInfo.face + '","sex":"' + userInfo.sex + '","country":"' + userInfo.country + '","province":"' + userInfo.province + '"}';
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
      if (now > Date.parse("2019/12/1 00:00:00")) {
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
        alert('排行榜截止于2019-11-30,请于结束后再来领取奖品!');
        return false;
      }
    }
  },
  playEffect: function (effect) {
    if (v_main.music)
      cc.audioEngine.playEffect(res["audio_" + effect], false);
  },
  setEffectsVolume: function (volume) {
    cc.audioEngine.setEffectsVolume(volume);
    volume == 1 ? document.getElementById('audio').play() : document.getElementById('audio').pause();
  },
  resize: function () {
    var width = $(window).width() > 640 ? 640 : $(window).width();
    var height = $(window).height() > 1400 ? 1400 : $(window).height();
    this.width = width;
    this.height = height;
    if (height < 1400) {
      this.scale = (height / 1400).toFixed(4);
    }
    $("#all").css({
      width: width,
      height: height,
      top: $(window).height() > 1400 ? ($(window).height() - 1400) / 2 : 0,
      left: $(window).width() > 640 ? ($(window).width() - 640) / 2 : 0
    }).show();
    var gameCanvas = document.getElementById("gameCanvas");
    gameCanvas.width = winSize.width;
    gameCanvas.height = winSize.height;
    console.log(`width:${width} height:${height} scale:${this.scale}`);
    vueInit();
  }
}
var dialogs = {
  loadcount: 0,
  loadres: [],
  loadtag: "dialogs_preload",
  precentHeight: 452,
  loadResFinish: function () {
    cc.spriteFrameCache.addSpriteFrames(res.gp_main_plist, res.gp_main_png);
    cc.spriteFrameCache.addSpriteFrames(res.gs_main_0_plist, res.gs_main_0_png);
    cc.spriteFrameCache.addSpriteFrames(res.gs_main_1_plist, res.gs_main_1_png);
    v_main.active = '';

    let s = getQueryString("s");
    if (v_main.debug && s != null) {
      if (s == "gp") {
        v_main.Game_resert();
        v_main.Game_HP = getQueryString("h") != null ? getQueryString("h") * 1 : 3;
      }
      else if (s == "gs") {
        v_main.Game_score = getQueryString("c") != null ? getQueryString("c") * 1 : 0;
        v_main.onGameResult();
      }
      else {
        cc.director.runScene(new MainMenuScene());
      }
    }
    else {
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
      debug: false,
      version: "1.1.0",
      active: '',
      scene: "",
      music: false,
      recordList: [],
      canPlay: false,
      Game_level: 0,
      Game_score: 0,
      Game_HP: 3,
      Game_miss: 0,
      Game_over: false,
      Game_housed: 0,
      Game_houseneed: 0,
      Game_theme: 1,
      music: false,
      guide: 0,
      share: false
    },
    watch: {
      Game_HP: function (newValue, oldValue) {
        if (newValue <= 0) {
          this.canPlay = false;
          this.Game_over = true;
          setTimeout(function () {
            this.active = "gameover";
          }.bind(this), 1500)
          setTimeout(function () {
            this.onGameResult(false);
          }.bind(this), 4000);
          if (this.Game_score > userInfo.hightest) {
            winSize.ranking.addScore(this.Game_score);
          }
          winSize.playEffect("gameover");
        }
      }
    },
    methods: {
      Game_resert: function () {
        this.canPlay = false;
        this.Game_over = false;
        this.Game_level = getQueryString("level") != null ? getQueryString("level") * 1 : 0;
        this.Game_score = 0;
        this.Game_HP = 3;
        this.Game_miss = 0;
        this.Game_housed = 0;
        this.Game_houseneed = GameManager.levelHouse[1];
        this.Game_theme = 1;
        GameManager.reset();
        cc.director.runScene(new GamePlayScene());
        if (this.guide > 1) {
          this.active = "level";
        }
        else {
          this.active = "guide";
        }
      },
      Game_nextlevel: function () {
        setTimeout(function () {
          GameManager.nextLevel();
          cc.director.runScene(new GamePlayScene());
          winSize.playEffect("next_level");
        }, 1500)
      },
      Game_touch: function () {
        if (this.canPlay)
          cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_TOUCH));
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
      onGameResult: function () {
        this.active = "";
        let theme = 0;
        if (this.Game_score > 10000) {
          theme = 2;
        }
        else if (this.Game_score > 2000) {
          theme = 1;
        }
        cc.director.runScene(new GameResultScene({ theme: theme }));
      },
      toDataUrl: function () {
        setTimeout(function () {
          let dataUrl = document.getElementById('gameCanvas').toDataURL(0, 0, 640, winSize.width, "image/jpeg", 1)
          document.getElementById('wallpaper').src = dataUrl;
        }.bind(this), 200)
        this.active = 'wallpaper';
      },
      onPlayMusic: function () {
        winSize.setEffectsVolume(this.music ? 0 : 1);
        this.music = !this.music;
      },
      guideLeave: function (isFromPage) {
        if (this.guide >= 1) {
          this.active = "level";
        }
        this.guide++;
      },
      levelEnter: function () {
        setTimeout(function () {
          if (this.active == "level") {
            this.active = "";
          }
        }.bind(this), GameManager.levelEnterTime)
      },
      levelLeave: function () {
        this.canPlay = true;
        cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_ROPE_START));
      },
      button_public: function (active) {
        winSize.playEffect('button');
        v_main.active = active;
      },
      onVisibilityChange: function (hidden) {
        if (hidden) {
          if (this.music) {
            this.onPlayMusic();
          }
          if (this.scene == "GamePlayScene") {
            this.active = "pause";
          }
        }
      },
      onGoShop: function () {
        wx.miniProgram.navigateTo({
          url: "/pages/shop/emoji/emoji?emoji_url=https://mp.weixin.qq.com/s/mQejEh0xQDRoRLw4b4qeug"
        });
      }
    },
    mounted: function () {
      this.active = 'preload';
      this.debug = getQueryString("debug") != null ? true : false;
      cc.game.run();
      this.$nextTick(function () {
        if (!IsPC()) {
          document.getElementById("dialogs").addEventListener("touchmove", function (event) {
            if (this.active != "record")
              event.preventDefault();
          }.bind(this));
          document.addEventListener("visibilitychange", () => {
            this.onVisibilityChange(document.hidden);
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
    alert("获取用户信息失败，请重新返回小程序入口登陆。");
  }
}
cc.game.onStart = function () {
  dialogs.loadres = g_resources;
  dialogs.loadcount = 0;
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
    if (dialogs.loadcount >= dialogs.loadres.length - 1) { //全部加载完毕
      dialogs.loadResFinish();
    }
    else {
      dialogs.loadcount++;
      var precent = (dialogs.loadcount / (dialogs.loadres.length - 1)).toFixed(2);
      $("#" + dialogs.loadtag + " .precent_word").text(Math.ceil(precent * 100) + "%");
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
  check: function (user) {
    $("#award_tips").empty();
    var name = $("#award_name").val();
    var tel = $("#award_tel").val();
    var address = $("#award_address").val();
    var result = "";
    if (name == "") {
      result = "请输入收件人姓名!";
    }
    else if (tel.length != 11) {
      result = "请输入11位收件人手机号码!";
    }
    else if (address == "" || address.length < 8) {
      result = "请输入详细的收件人地址!";
    }
    if (result == "") { //都正确
      var date = new Date();
      var addtime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
      var info = '{"name":"' + name + '","tel":"' + tel + '","address":"' + address + '","addtime":"' + addtime + '"}';
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
