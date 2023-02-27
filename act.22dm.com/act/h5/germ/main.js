var act_id = 55, debug = 0;
var v_main;
var weixinData = {
  shareTitle: '《奇趣外星客》礼物保卫战',
  shareDesc: '这是一个不平凡的圣诞节，与羊羊一起保卫圣诞礼物吧！',
  shareLink: 'https://act.22dm.com/act/h5/germ/index.html',
  shareImg: 'https://act.22dm.com/act/h5/germ/res/icon.jpg',
  loginUrl: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb61fdb0e387cbcc4&redirect_uri=http%3a%2f%2fact.22dm.com%2fact%2fh5%2fgerm%2findex.html&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect',
  jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage']
};
var userInfo = {
  from: "",
  openid: "openid",
  unionid: "unionid",
  name: "lllzc",
  face: weixinData.shareImg,
  hightest: 0
};
var winSize = {
  width: 640,
  height: 1200,
  scale: 1,
  loadcount: 0,
  loadres: [],
  loadtag: "dialogs_preload",
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
          "user": userInfo.unionid
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
          "user": userInfo.unionid,
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
      if (now > Date.parse("2020/1/31 00:00:00")) {
        var hasPrize = false;
        for (var i = 0; i < v_main.recordList.length; i++) {
          if (v_main.recordList[i].user == userInfo.unionid) {
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
        alert('排行榜截止于2020-1-31,请于结束后再来领取奖品!');
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
    let minHeight = 1200;
    if (height < minHeight) {
      this.scale = (height / minHeight).toFixed(4);
    }
    $("#all").css({
      width: width,
      height: height,
      top: ($(window).height() > 1400 ? ($(window).height() - 1400) / 2 : 0),
      left: $(window).width() > 640 ? ($(window).width() - 640) / 2 : 0
    }).show();
    var gameCanvas = document.getElementById("gameCanvas");
    gameCanvas.width = width;
    gameCanvas.height = height;
    console.log(`width:${width} height:${height} scale:${this.scale}`);
    vueInit();
  },
  loadResFinish: function () {
    cc.spriteFrameCache.addSpriteFrames(res.gs_main_plist, res.gs_main_png);
    cc.spriteFrameCache.addSpriteFrames(res.gp_main_plist, res.gp_main_png);

    v_main.active = "";
    var s = getQueryString("s");
    if (s != null) {
      if (s == "gp") {
        v_main.Game_resert();
      }
      else if (s == "gs") {
        cc.director.runScene(new GameResultScene());
      }
      else {
        cc.director.runScene(new MainMenuScene());
      }
      v_main.Game_theme = getQueryString("theme") == null ? 1 : getQueryString("theme")*1;
    }
    else {
      cc.director.runScene(new MainMenuScene());
      //v_main.Game_resert();
      //cc.director.runScene(new GameResultScene());
    }
    winSize.ranking.getRankingList();
  }
}
function vueInit() {
  v_main = new Vue({
    el: '#all',
    data: {
      scene: '',
      active: '',
      canPlay: false,
      Game_score: 0,
      Game_HP: 3,
      Game_over: false,
      Game_theme: 1,
      Game_germ: 0,
      touchX: 0,
      touchY: 0,
      recordList: [],
      music: true,
      guide: 0,
      share: false,
      hidden: false,
      waiting: false,
      hasMagic: false,
      christmas: 0,
      isFilter: ['rule', 'record', 'award', 'shop'],
      shop: { "type": "navigation", "img": "/img/index/dialogs/0117.png", "url": "/pages/index/game/game?url=magic" }
    },
    watch: {
      hidden: function (newValue, oldValue) {
        if (newValue) {
          if (this.music) {
            this.onPlayMusic();
          }
        }
      },
      Game_HP: function (newValue, oldValue) {
        if (newValue < oldValue) {
          winSize.playEffect("faile");
        }
        if (newValue <= 0 && !this.Game_over) {
          this.Game_over = true;
          setTimeout(function () {
            this.active = "gameover";
            winSize.playEffect("gameover");
          }.bind(this), 1500)
          setTimeout(function () {
            this.canPlay = false;
            this.onGameResult(false);
          }.bind(this), 5000);
          if (this.Game_score > userInfo.hightest) {
            winSize.ranking.addScore(this.Game_score);
          }
        }
      },
      Game_germ: function (newValue, oldValue) {
        if (newValue % 14 == 0 && newValue != 0) {
          cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GAME_ADD_SKILL));
        }
      },
      Game_score: function (newValue, oldValue) {
        if (GameManager.germ.count < GameManager.germ.maxcount) {
          let length = (newValue + '').length - 1;
          length = length < 2 ? length : length > GameManager.germ.maxcount ? GameManager.germ.maxcount : length;
          GameManager.germ.count = length;
        }
      }
    },
    methods: {
      Game_resert: function () {
        GameManager.reset();
        cc.director.runScene(new GamePlayScene());
        this.Game_over = false;
        this.canPlay = true;
        this.Game_HP = 3;
        this.Game_score = getQueryString("score") == null ? 0 : getQueryString("score")*1;;
        this.Game_germ = 0;
      },
      Game_touch: function () {
        if (!this.Game_over)
          cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GAME_TOUCH));
      },
      Game_pause: function () {
        cc.director.pause();
      },
      Game_home: function () {
        this.active = "";
        cc.director.resume();
        cc.director.runScene(new MainMenuScene());
      },
      Game_continue: function () {
        this.active = "";
        cc.director.resume();
      },
      Game_replay: function () {
        this.active = "";
        cc.director.resume();
        this.Game_resert();
      },
      onGameResult: function () {
        this.active = "";
        let theme = 1;
        if (this.Game_score > 20000) {
          theme = 3;
        }
        else if (this.Game_score > 5000) {
          theme = 2;
        }
        this.Game_theme = theme;
        cc.director.runScene(new GameResultScene());
        if (this.Game_score >= 2000 && !this.hasMagic) {
          this.hasMagic = true;
          $.ajax({
            cache: false,
            async: false,
            type: "POST",
            url: '/act/h5/magic/getInitData.ashx',
            data: {
              "type": "onAddMagicLog",
              "unionid": userInfo.unionid,
              "magic": "germ"
            },
            success: function (response) {
              var json = JSON.parse(response);
              console.log(response);
            }
          });
        }
      },
      onAwardPost: function (info) {
        $.ajax({
          cache: false,
          async: false,
          type: "POST",
          url: '/act/h5/getRanking.ashx',
          data: {
            "act_id": act_id,
            "init": "0",
            "type": "award",
            "user": userInfo.unionid,
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
      button_public: function (active) {
        winSize.playEffect('button');
        this.active = active;
      },
      onPlayMusic: function () {
        winSize.setEffectsVolume(this.music ? 0 : 1);
        this.music = !this.music;
      },
      onGoShop: function () {
        if (userInfo.from == "wx") {
          location.href = "https://act.22dm.com/act/h5/magic/index.html";
        }
        else {
          wx.miniProgram.navigateTo({
            url: this.shop.url
          });
        }
      },
      onGoMagic: function () {
        if (userInfo.from == "wx") {
          location.href = "https://act.22dm.com/act/h5/magic/index.html";
        }
        else {
          wx.miniProgram.navigateTo({
            url: "/pages/index/game/game?url=magic"
          });
        }
      },
      onGoChristmas: function () {
        if (this.christmas < 3) {
          this.christmas++;
          $.ajax({
            cache: false,
            async: false,
            type: "POST",
            url: '/act/h5/magic/getInitData.ashx',
            data: {
              "type": "onAddChristmas",
              "unionid": userInfo.unionid,
              "magic": "germ_sd"
            },
            success: function (response) {
              console.log(response);
            }
          });
        }
      }
    },
    mounted: function () {
      this.active = 'preload';
      cc.game.run();
      this.$nextTick(function () {
        document.getElementById("touch_area").addEventListener("touchstart", function (event) {
          this.touchX = event.touches[0].clientX;
          this.touchY = event.touches[0].clientY;
          this.Game_touch();
        }.bind(this));
        initWxJsSdk(weixinData.jsApiList, function () {
          document.getElementById('audio').play();
          var promise = document.querySelector('audio').play();
          if (promise !== undefined) {
            promise.then(function (_) {
              this.music = true;
            }).catch(function (error) {
              this.music = false;
            });
          }
        }.bind(this));
        document.getElementById("all").addEventListener("touchmove", function (event) {
          if (this.active != "record")
            event.preventDefault();
        }.bind(this));
        document.addEventListener("visibilitychange", () => {
          this.hidden = document.hidden;
        });
      }.bind(this))
    }
  });
}
$(function () {
  onInitPage(userInfo, function (success) {
    if (userInfo.unionid == "undefined" || typeof (userInfo.unionid) == "undefined") {
      alert("Sorry~服务器开小差了,请重新打开试试~");
      if (userInfo.from == "wx") {
        location.href = weixinData.loginUrl
      }
      else {
        wx.switchTab({ "url": "pages/index/index" });
      }
    }
    else {
      if (success == 1) {
        winSize.resize();
      }
      else {
        if (success == 0) {
          doUserLogin(userInfo, function () {
            setTimeout(function () {
              winSize.resize();
            }, 50)
          });
        }
        else {
          $("#ercode").show();
        }
      }
    }
  })
});
cc.game.onStart = function () {
  winSize.loadres = g_resources;
  winSize.loadcount = 0;
  loadGameResources();
};
function loadGameResources() {
  cc.loader.load(winSize.loadres[winSize.loadcount], function (err) {
    if (winSize.loadcount >= winSize.loadres.length - 1) { //全部加载完毕
      winSize.loadResFinish();
    }
    else {
      winSize.loadcount++;
      var precent = (winSize.loadcount / (winSize.loadres.length - 1)).toFixed(2);
      $("#" + winSize.loadtag + " .precent_word").text(Math.ceil(precent * 100) + "%");
      loadGameResources();
    }
  })
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
      v_main.onAwardPost(info);
    }
    else {
      $("#award_tips").text(result);
      return false;
    }
  }
}