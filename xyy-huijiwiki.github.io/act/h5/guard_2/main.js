var act_id = 41, debug = false, offset;
var v_main;
var userInfo = {
  openid: "test_" + act_id,
  name: "test",
  face: "res/Public/icon.jpg",
  hightest: 0,
  showLottery: false,
  lotterypath: "/pages/index/game/game?url=lottery&from=guard"
};
var winSize = {
  width: 1400,
  height: 640,
  scale: 1,
  ranking: {
    addLottery: function () {
      $.ajax({
        cache: false,
        async: false,
        type: "POST",
        url: '/act/h5/doAct.ashx',
        data: {
          "act_id": 41,
          "data_type": "addlottery",
          "user": userInfo.openid,
          "add_from": "guard"
        },
        success: function (response) {
          var result = JSON.parse(response);
          if (result.return_code == "SUCCESS") {
            userInfo.showLottery = true;
          }
        }
      });
    },
    getRankingList: function () {
      // $.ajax({
      //   cache: false,
      //   async: false,
      //   type: "POST",
      //   url: '/act/h5/getRanking.ashx',
      //   data: {
      //     "act_id": act_id,
      //     "init": "1",
      //     "user": userInfo.openid
      //   },
      //   success: function (response) {
      //     var result = JSON.parse(response);
      //     console.log(result);
      //     userInfo.hightest = result.score;
      //     v_main.recordList = result.scoreList;
      //   }
      // });
      let result = {
        "time": "2023-02-27", "score": "0", "count": "0", "scoreList": [
          {
            json: {
              img: './user/羊年喜羊羊_头像_慢羊羊.jpg',
              name: '慢羊羊',
              addtime: '2017-02-10 23:59:59',
              score: '100'
            },
            user: '01'
          }, {
            json: {
              img: './user/羊年喜羊羊_头像_喜羊羊.jpg',
              name: '喜羊羊',
              addtime: '2017-02-10 23:59:59',
              score: '99'
            },
            user: '02'
          }, {
            json: {
              img: './user/羊年喜羊羊_头像_美羊羊.jpg',
              name: '美羊羊',
              addtime: '2017-02-10 23:59:59',
              score: '95'
            },
            user: '03'
          }, {
            json: {
              img: './user/羊年喜羊羊_头像_灰太狼.jpg',
              name: '灰太狼',
              addtime: '2017-02-10 23:59:59',
              score: '94'
            },
            user: '04'
          }, {
            json: {
              img: './user/羊年喜羊羊_头像_暖羊羊.jpg',
              name: '暖羊羊',
              addtime: '2017-02-10 23:59:59',
              score: '90'
            },
            user: '05'
          }, {
            json: {
              img: './user/羊年喜羊羊_头像_小灰灰.jpg',
              name: '小灰灰',
              addtime: '2017-02-10 23:59:59',
              score: '85'
            },
            user: '06'
          }, {
            json: {
              img: './user/羊年喜羊羊_头像_红太狼.jpg',
              name: '红太狼',
              addtime: '2017-02-10 23:59:59',
              score: '80'
            },
            user: '07'
          }, {
            json: {
              img: './user/羊年喜羊羊_头像_沸羊羊.jpg',
              name: '沸羊羊',
              addtime: '2017-02-10 23:59:59',
              score: '70'
            },
            user: '08'
          }, {
            json: {
              img: './user/羊年喜羊羊_头像_懒羊羊.jpg',
              name: '懒羊羊',
              addtime: '2017-02-10 23:59:59',
              score: '60'
            },
            user: '09'
          }, {
            json: {
              img: './user/Karsten.jpg',
              name: 'Karsten',
              addtime: '2017-02-10 23:59:59',
              score: '40'
            },
            user: '10'
          },
        ]
      };
      userInfo.hightest = result.score;
      v_main.recordList = result.scoreList;
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
      if (now > Date.parse("2019/03/01 00:00:00")) {
        var hasPrize = false;
        for (var i = 0; i < v_main.recordList.length; i++) {
          if (v_main.recordList[i].user == userInfo.openid) {
            hasPrize = true;
          }
        }
        if (!hasPrize) {
          v_main.active = 'award';
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
  playMusic: function () {
    if (!cc.audioEngine.isMusicPlaying())
      cc.audioEngine.playMusic(res.audio_music, true);
  },
  playEffect: function (effect) {
    cc.audioEngine.playEffect(res["audio_" + effect], false);
  },
  setEffectsVolume: function (volume) {
    v_main.volume = volume;
    cc.audioEngine.setEffectsVolume(volume);
    cc.audioEngine.setMusicVolume(volume);
  },
  resize: function () {
    var width = debug ? $(window).width() : $(window).height();
    if (width < 1400) {
      winSize.width = width;
      winSize.scale = (width / 1400).toFixed(4);
      console.log("width: " + width);
      console.log("scale: " + winSize.scale);
    }
    if (debug) {
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
    $("#book_container").css({
      'webkitTransform': 'scale(' + winSize.scale + ')',
      'transform': 'scale(' + winSize.scale + ')'
    });
    var gameCanvas = document.getElementById("gameCanvas");
    gameCanvas.width = winSize.width;
    gameCanvas.height = winSize.height;
  }
};
var dialogs = {
  loadcount: 0,
  loadres: [],
  loadtag: "dialogs_preload",
  precentHeight: 335,
  loadResFinish: function () {
    cc.spriteFrameCache.addSpriteFrames(res.gp_main_plist_0, res.gp_main_png_0);
    cc.spriteFrameCache.addSpriteFrames(res.gp_main_plist_1, res.gp_main_png_1);
    cc.spriteFrameCache.addSpriteFrames(res.gp_main_plist_2, res.gp_main_png_2);
    cc.spriteFrameCache.addSpriteFrames(res.gp_main_plist_3, res.gp_main_png_3);
    cc.spriteFrameCache.addSpriteFrames(res.gs_main_plist, res.gs_main_png);

    v_main.active = "";

    cc.director.runScene(new MainMenuScene());

    //v_main.Game_resert(); 
    winSize.playMusic();
    clearInterval(GameManager.bosstimer);
  }
};
function vueInit() {
  v_main = new Vue({
    el: '#all',
    data: {
      scene: "",
      active: '',
      tips_1: 1,
      tips_2: 1,
      recordList: [],
      guide: 1,
      canPlay: false,
      Game_strength: 0,
      Game_score: 0,
      Game_ice: 0,
      Game_bomb: 0,
      Game_wolfCount: 0,
      Game_hp: 3,
      Game_touch: false,
      Game_over: false,
      volume: 1,
      book: 1,
      role: 1,
      leveltext: null
    },
    watch: {
      Game_wolfCount: function (newValue, oldValue) {
        if (newValue != oldValue)
          cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_UPDATE_WOLFCOUNT_TEXT));
      },
      Game_score: function (newValue, oldValue) {
        if (!this.Game_over && this.scene == "GamePlayScene") {
          GameManager.totalScore = newValue;
          cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_UPDATE_SCORE_TEXT));
        }
      },
      Game_ice: function (newValue, oldValue) {
        if (!this.Game_over) {
          cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_UPDATE_ICE_TEXT));
          if (newValue < oldValue) {
            cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_CREATE_ICE_LAYER));
          }
        }
      },
      Game_bomb: function (newValue, oldValue) {
        if (!this.Game_over) {
          cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_UPDATE_BOMB_TEXT));
          if (newValue < oldValue) {
            cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_LOAD_BOMB));
          }
        }
      },
      Game_hp: function (newValue, oldValue) {
        if (!this.Game_over && this.scene == "GamePlayScene") {
          GameManager.currentHp += newValue - oldValue;
          cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_UPDATE_HP));
          if (GameManager.currentHp == 0) {
            this.Game_over = true;
          }
        }
      },
      Game_touch: function (newValue, oldValue) {
        if (newValue == true) {
          cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_ROLE_ATTACK_BEFORE));
        }
        else {
          cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_ROLE_ATTACK_AFTER));
          this.Game_strength = 0;
        }
      },
      Game_over: function (newValue, oldValue) {
        if (newValue) {
          this.canPlay = false;
          var theme = this.Game_score < 1000 ? 1 : this.Game_score < 5000 ? 2 : 3;
          if (v_main.scene == "GamePlayScene") {
            var event = new cc.EventCustom(jf.EventName.GP_CREATE_DIALOGS_LAYER);
            event.setUserData({
              callback: function () {
                cc.director.runScene(new GameResultScene({ theme: theme }));
              }
            });
            cc.eventManager.dispatchEvent(event);
            for (var i = 0; i < GameManager.currentWolf.length; i++) {
              GameManager.currentWolf[i].removeFromParent();
            }
          }
          if (this.Game_score > userInfo.hightest)
            winSize.ranking.addScore(this.Game_score);
        }
      }
    },
    methods: {
      Game_resert: function () {
        this.Game_over = false;
        this.canPlay = false;
        this.Game_hp = 3;
        this.Game_score = 0;
        this.Game_ice = debug ? 50 : 0;
        this.Game_bomb = debug ? 50 : 0;
        //this.book=1;
        GameManager.currentRoleId = this.role;
        GameManager.reset();
        cc.director.runScene(new GamePlayScene());
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
        if (this.scene == "GameLevelSceneTips")
          this.scene = "GameLevelScene";
        cc.director.resume();
      },
      Game_replay: function () {
        v_main.active = '';
        cc.director.resume();
        v_main.Game_resert();
      },
      guideLeave: function () {
        if (this.guide != 3) {
          this.guide++;
        }
        else {
          this.guide = 10;
          v_main.active = "";
          GameManager.createWolfPoor();
        }
      },
      Book_role: function () {
        GameManager.currentRoleId = this.role;
        this.active = "";
        this.Game_resert();
      },
      mm_music: function () {
        var sender = GameManager.button.mm_music;
        if (sender._bright) {  //静音
          sender.setBright(false);
          winSize.setEffectsVolume(0);
        }
        else {   //开启声音
          sender.setBright(true);
          winSize.setEffectsVolume(1);
        }
      },
      gp_music: function () {
        var sender = GameManager.button.gp_music;
        if (sender._bright) {  //静音
          sender.setBright(false);
          winSize.setEffectsVolume(0);
        }
        else {   //开启声音
          sender.setBright(true);
          winSize.setEffectsVolume(1);
        }
      },
      button_public: function (active) {
        winSize.playEffect('button');
        v_main.active = active;
        winSize.playMusic();
      },
      button_skill: function (skill) {
        var forbidden = 0;
        if (!v_main.Game_over && v_main.canPlay) {
          if (skill == "ice") {
            if (!GameManager.isIceing && this.Game_ice > 0) {
              this.Game_ice--;
              winSize.playEffect("ice");
            }
            else {
              forbidden = 1;
            }
          }
          else if (skill == "bomb") {
            if (!GameManager.isBombing && this.Game_bomb > 0) {
              this.Game_bomb--;
              winSize.playEffect("bomb");
            }
            else {
              forbidden = 2;
            }
          }
        }
        if (forbidden != 0) {
          var event = new cc.EventCustom(jf.EventName.GP_LOAD_SKILL_FORBID);
          event.setUserData({
            forbidden: forbidden
          });
          cc.eventManager.dispatchEvent(event);
        }
      },
      button_levelwolf: function () {
        // this.scene = "GameLevelSceneTips";
        // this.active="tips";
      },
      onGoAct: function () {
        v_main.active = '';
        wx.miniProgram.navigateTo({
          url: userInfo.lotterypath
        });
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
});
function doUserLogin() {
  var weddata = decodeURIComponent(getQueryString("webdata"));
  var openid = getQueryString2(weddata, "openid");
  var name = getQueryString2(weddata, "name");
  var face = getQueryString2(weddata, "face");
  // if (openid && name && face) {
  //   userInfo.openid = openid;
  //   userInfo.name = name;
  //   userInfo.face = face;
  //   winSize.resize();
  //   vueInit();
  // }
  // else {
  //   alert("用户参数错误");
  // }

  userInfo.openid = openid;
  userInfo.name = name;
  userInfo.face = face;
  winSize.resize();
  vueInit();
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
      var loading = $("#" + dialogs.loadtag + " .precent_progress");
      var precent = (dialogs.loadcount / (dialogs.loadres.length - 1)).toFixed(2);
      $("#" + dialogs.loadtag + " .precent_word").text(Math.ceil(precent * 100) + "%");
      if (!$(loading).is(":animated"))
        loading.animate({ height: (dialogs.precentHeight) * dialogs.loadcount / (dialogs.loadres.length - 1) + "px" });
      else
        loading.stop().animate({ height: (dialogs.precentHeight) * dialogs.loadcount / (dialogs.loadres.length - 1) + "px" });
      loadGameResources();
    }
  });
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
  check: function () {
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
      var info = {
        name: name,
        tel: tel,
        address: address,
        addtime: new Date().getTime()
      };
      var ask = confirm("请注意：收货信息提交后不能再修改。");
      if (ask) {
        award.post(info);
      }
    }
    else {
      $("#award_tips").text(result);
      return false;
    }
  },
  post: function (info) {
    console.log(info);
    // $.ajax({
    //   cache: false,
    //   async: false,
    //   type: "POST",
    //   url: '/act/h5/getRanking.ashx',
    //   data: {
    //     "act_id": act_id,
    //     "init": "0",
    //     "type": "award",
    //     "user": userInfo.openid,
    //     "info": JSON.stringify(info)
    //   },
    //   success: function (response) {
    //     var result = JSON.parse(response);
    //     if (result.success) {
    //       alert(result.returnStr);
    //     }
    //     else {
    //       alert(result.returnStr);
    //     }
    //   }
    // });
    alert('信息提交成功!奖品于14个工作日内发出。');
  }
};