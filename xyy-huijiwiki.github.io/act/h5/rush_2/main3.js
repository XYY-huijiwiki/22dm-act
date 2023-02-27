var act_id = 56, debug = 0;
var v_main;
var weixinData = {
  shareTitle: '探险奇猫国',
  shareDesc: '奇猫国究竟有多神秘？“猫猫姐妹花”带你一起去探险~',
  shareLink: 'https://act.22dm.com/act/h5/rush_2/index.html',
  shareImg: 'https://act.22dm.com/act/h5/rush_2/res/icon.jpg',
  loginUrl: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb61fdb0e387cbcc4&redirect_uri=http%3a%2f%2fact.22dm.com%2fact%2fh5%2frush_2%2findex.html&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect',
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
  width: 1400,
  height: 640,
  scale: 1,
  loadcount: 0,
  loadres: [],
  loadtag: "dialogs_preload",
  ranking: {
    getRankingList: function () {
      // $.ajax({
      //   cache: false,
      //   async: false,
      //   type: "POST",
      //   url: '/act/h5/getRanking.ashx',
      //   data: {
      //     "act_id": act_id,
      //     "init": "1",
      //     "user": userInfo.unionid
      //   },
      //   success: function (response) {
      //     var result = JSON.parse(response);
      //     userInfo.hightest = result.score;
      //     v_main.recordList = result.scoreList;
      //     //console.log(response);
      //   }
      // });
      userInfo.hightest = 20;
      v_main.recordList = [
        {
            "user": "oHKFLv2R-1YheTF9y4p7XQO2J4-8",
            "count": "0",
            "json": {
                "addtime": "2020-06-25",
                "score": "7026",
                "name": "幻羽彩龙",
                "img": "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eoTpKyqofGyn9ZnSCpjNOh2RziabgKiaJzDaAPBLzicriaUib7ZSHc8lNNTDjUm6rsMSDpBPdZh2zgIYAg/132"
            }
        },
        {
            "user": "oHKFLv2gXKX57K5Agx1qoQDM7V8k",
            "count": "0",
            "json": {
                "addtime": "2020-06-19",
                "score": "6666",
                "name": "lllzc",
                "img": "https://wx.qlogo.cn/mmopen/vi_32/uMN9Adxd6POEhAo7L4TwzObBPhgoCZUZojarGiboe5aUgvV8Sict2u7xFIkCZhbz2vMLiazM6O5Ancc4mVU84FUqQ/132"
            }
        },
        {
            "user": "oHKFLv08pWCLAxtF9BB7ecD6ir6s",
            "count": "0",
            "json": {
                "addtime": "2020-06-26",
                "score": "5052",
                "name": "小奶狗D",
                "img": "https://wx.qlogo.cn/mmopen/vi_32/wYPdGBibR1FJWWMzFzYBy4l7LCC5jdl8VTCp85icVg8b7PiaKZr45bicad6ZS56ichbhKPsfRm2vMRlFV88wFQ3iaJxg/132"
            }
        },
        {
            "user": "oHKFLv8zYIMzb-wo2GpvP3kiKUQY",
            "count": "0",
            "json": {
                "addtime": "2020-07-16",
                "score": "4674",
                "name": "悟道",
                "img": "https://wx.qlogo.cn/mmopen/vi_32/ww9BprMJWfJxVlUhKBm0IGb0PkgBzMMmzA1XTlsM4GZamn98Nhv6UaH8KibhLDyRcjuzAAw5Oa7TTwkgSpppickQ/132"
            }
        },
        {
            "user": "oHKFLvzEOHEMAcmQmTSBgIxv3C1Q",
            "count": "0",
            "json": {
                "addtime": "2020-06-27",
                "score": "4452",
                "name": "逆水深流",
                "img": "https://wx.qlogo.cn/mmopen/vi_32/ooYDTtTQHLicSnicMXk7iaCC2t0FOEZic0Pg0h1dnvt7qR3C5wkD75WTvA8TJqefDHO9y0xQtd7miaISHzKWGChQjjw/132"
            }
        },
        {
            "user": "oHKFLv_0bH_8hANpZQdmF1zuD87I",
            "count": "0",
            "json": {
                "addtime": "2020-06-25",
                "score": "4338",
                "name": "落樱雨洛",
                "img": "https://wx.qlogo.cn/mmopen/vi_32/9doFL0ZzcWcogr3okLF29icg4ZM7NOnQYLd3ns95Sm6gNH5YkuARibMDib9yAqKQDPSMFgbyuQ865HZeoa3mfibGow/132"
            }
        },
        {
            "user": "oHKFLv0RDFb4xHo8YROO0CGqgU_Y",
            "count": "0",
            "json": {
                "addtime": "2020-06-26",
                "score": "4284",
                "name": "屿念ヾ",
                "img": "https://wx.qlogo.cn/mmopen/vi_32/JsTl27nENOuygcyBlczd6D2Rwg7iaOM415rANw267yObUjiaiaFeF9Fw3CErjeWHfhqsXW1VHiaW0giboibFv93YZZvQ/132"
            }
        },
        {
            "user": "oHKFLv7AgJD0WQs0Vq5m_GuDelUc",
            "count": "0",
            "json": {
                "addtime": "2020-08-23",
                "score": "4024",
                "name": "Sparkle",
                "img": "https://wx.qlogo.cn/mmopen/vi_32/NvUbnd9bTDILgFgdxwEbEFh2nCO9EkFOzEHp76YibHcQTPnldA8Y5X9oHAuOWbko10GkdureuMeG2XJfpbBD36A/132"
            }
        },
        {
            "user": "oHKFLv9ARpRalKO0_Sgy4hJgGISk",
            "count": "0",
            "json": {
                "addtime": "2020-06-27",
                "score": "3972",
                "name": "萌值担当灰狗狗",
                "img": "https://wx.qlogo.cn/mmopen/vi_32/Y44BhqAUMialupZ3mDJPWyHKYkzMI7AUZgQDky9fAA3YfI29r8u6xj7h1JYDC6jgFc4MUCHPMp9iaia4rbFQ6KibKg/132"
            }
        },
        {
            "user": "oHKFLvx99BVpUfTX7jrTsPL3KEhQ",
            "count": "0",
            "json": {
                "addtime": "2020-07-11",
                "score": "3732",
                "name": "郑建廷",
                "img": "https://wx.qlogo.cn/mmopen/vi_32/iaKHPgibIl8RyQQmwVhKzBQdm5IwylTeJRlK9d0KIFVv1IIbLrwFP7RnXKibjruXXhajLKC2jExrhOicDVMIH7ICDA/132"
            }
        }
    ];
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
      if (now > Date.parse("2020/09/01 00:00:00")) {
        var hasPrize = false;
        for (var i = 0; i < v_main.recordList.length; i++) {
          if (v_main.recordList[i].user == userInfo.unionid) {
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
        alert('排行榜截止于2020-08-31,请于结束后再来领取奖品!');
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
    var width = debug ? $(window).width() : $(window).height();
    if (width < 1400) {
      this.width = width;
      this.scale = (width / 1400).toFixed(4);
    }
    if (debug) {
      $("#all").css({
        width: this.width,
        height: this.height,
        top: $(window).width() > 640 ? ($(window).height() - 640) / 2 : 0,
        left: $(window).width() > 1400 ? ($(window).width() - 1400) / 2 : 0
      }).show();
    }
    else {
      var offset = this.width / 2 - 320;
      $("#all").css({
        width: this.width,
        height: this.height,
        'transform': 'rotate(89.9999deg)',
        '-webkit-transform ': 'rotate(89.9999deg)',
        top: offset + ($(window).height() > 1400 ? ($(window).height() - 1400) / 2 : 0),
        left: -offset
      }).show();
    }
    $("#select_role").css({
      'webkitTransform': 'scale(' + this.scale + ')',
      'transform': 'scale(' + this.scale + ')'
    });
    var gameCanvas = document.getElementById("gameCanvas");
    gameCanvas.width = this.width;
    gameCanvas.height = this.height;
    console.log(`width:${this.width} height:${this.height} scale:${this.scale}`);
    vueInit();
  },
  loadResFinish: function () {
    cc.spriteFrameCache.addSpriteFrames(res.mm_main_plist, res.mm_main_png);
    cc.spriteFrameCache.addSpriteFrames(res.gp_main_plist, res.gp_main_png);
    cc.spriteFrameCache.addSpriteFrames(res.gs_main_plist_0, res.gs_main_png_0);
    cc.spriteFrameCache.addSpriteFrames(res.gs_main_plist_1, res.gs_main_png_1);

    v_main.active = "";
    cc.director.runScene(new MainMenuScene());
    //v_main.Game_reset();
    //v_main.onGameResult();
    winSize.ranking.getRankingList();
  }
};
function vueInit() {
  v_main = new Vue({
    el: '#all',
    data: {
      scene: '',
      active: '',
      Game_speed: 1,
      Game_score: 0,
      Game_HP: 3,
      Game_ice: 1,
      Game_strong: 1,
      Game_over: false,
      Game_theme: 1,
      roleId: 1,
      canPlay: false,
      jump: false,
      ice: false,
      music: false,
      guide: 0,
      share: false,
      hidden: false,
      recordList: [],
      isFilter: ['rule', 'record', 'award', 'shop'],
      shop: { "type": "navigation", "img": "/img/index/dialogs/0705.jpg", "url": "/pages/shop/emoji/emoji?emoji_url=https://mp.weixin.qq.com/s/uL4-SeT6WNHVYVDNH10-bA" }
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
        if (newValue <= 0 && !this.Game_over) {
          this.Game_over = true;
          this.canPlay = false;
          cc.director.getScheduler().setTimeScale(1);
          winSize.playEffect("gameover");
          setTimeout(function () {
            this.active = "gameover";
            setTimeout(function () {
              this.scene = "";
              this.onGameResult();
            }.bind(this), 3500);
          }.bind(this), 1200);
          if (this.Game_score > userInfo.hightest) {
            winSize.ranking.addScore(this.Game_score);
          }
        }
      },
      Game_score: function (newValue, oldValue) {
        if (newValue % 450 == 0) {
          if (this.Game_speed > 0.65) {
            this.Game_speed -= 0.01;
          }
          if (GameManager.bridgeMin > 1) {
            GameManager.bridgeMin -= 1;
          }
          if (GameManager.bridgeMax > 5) {
            GameManager.bridgeMax -= 1;
          }
          if (GameManager.germRamdon < 0.65) {
            GameManager.germRamdon += 0.03;
          }
          if (GameManager.bridgeSpaceMax < 130) {
            GameManager.bridgeSpaceMax += 5;
          }
        }
      },
      guide: function (newValue, oldValue) {
        if (newValue > 3) {
          this.Game_continue();
          this.guide = -1;
        }
      }
    },
    methods: {
      Game_reset: function () {
        GameManager.reset();
        this.Game_over = false;
        this.Game_speed = 1;
        this.Game_HP = this.roleId == 1 ? 5 : 3;
        this.Game_ice = this.roleId == 2 ? 2 : 1;
        this.Game_strong = this.roleId == 2 ? 2 : 1;
        this.Game_score = 0;
        this.jump = false;
        this.ice = false;
        this.canPlay = false;
        this.active = "";
        this.scene = "";
        cc.director.runScene(new GamePlayScene());
      },
      Game_jump: function () {
        if (!this.Game_over && this.canPlay)
          cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GAME_JUMP));
      },
      Game_skill: function (skillName) {
        if (!this.Game_over && this.canPlay) {
          if (skillName == "strong" && this.Game_strong > 0) {
            cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GAME_STRONG));
          }
          if (skillName == "ice" && this.Game_ice > 0) {
            cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GAME_ICE));
          }
        }
      },
      Game_pause: function () {
        cc.director.pause();
      },
      Game_home: function () {
        this.active = "";
        cc.director.resume();
        cc.director.runScene(new MainMenuScene());
        winSize.playEffect('button');
      },
      Game_continue: function () {
        this.active = "";
        cc.director.resume();
      },
      Game_replay: function () {
        this.active = "";
        cc.director.resume();
        this.Game_reset();
        winSize.playEffect('button');
      },
      onShowGuide: function () {
        if (this.guide == 0) {
          this.guide = 1;
          cc.director.pause();
          this.canPlay = true;
        }
        else {
          this.canPlay = true;
        }
      },
      onGameResult: function () {
        this.active = "";
        let theme = 1;
        if (this.Game_score > 6000) {
          theme = 3;
        }
        else if (this.Game_score > 3000) {
          theme = 2;
        }
        this.Game_theme = theme;
        cc.director.runScene(new GameResultScene());
      },
      onAwardPost: function (info) {
        // $.ajax({
        //   cache: false,
        //   async: false,
        //   type: "POST",
        //   url: '/act/h5/getRanking.ashx',
        //   data: {
        //     "act_id": act_id,
        //     "init": "0",
        //     "type": "award",
        //     "user": userInfo.unionid,
        //     "info": info
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
        alert('信息提交成功!奖品于14个工作日内发出。')
      },
      onCheckGold: function () {
        const g = [6, 66];
        if ((this.canPlay && !this.Game_over) && (GameManager.goldScore[0] != g[0] || GameManager.goldScore[1] != g[1])) {
          //作弊 录入黑名单
          // $.ajax({
          //   cache: false,
          //   async: false,
          //   type: "POST",
          //   url: '/act/h5/getRanking.ashx',
          //   data: {
          //     "act_id": act_id,
          //     "init": "0",
          //     "type": "cheat",
          //     "user": userInfo.unionid
          //   }
          // });
        }
      },
      button_public: function (active) {
        winSize.playEffect('button');
        this.active = active;
      },
      onPlayMusic: function () {
        winSize.setEffectsVolume(this.music ? 0 : 1);
        this.music = !this.music;
        if (!this.music)
          document.getElementById('audio').pause();
        else
          document.getElementById('audio').play();
      },
      onGoShop: function () {
        if (userInfo.from == "wx") {
          location.href = "https://mp.weixin.qq.com/s/pIf1pO1pt0kKCOygLnuhhg";
        }
        else {
          wx.miniProgram.navigateTo({
            url: this.shop.url
          });
        }
      }
    },
    mounted: function () {
      this.active = 'preload';
      cc.game.run();
      this.$nextTick(function () {
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
          if (this.active != "" && this.active != "record")
            event.preventDefault();
        }.bind(this));
        document.addEventListener("visibilitychange", () => {
          this.hidden = document.hidden;
        });
      }.bind(this));
    }
  });
}
Vue.component('record-list', {
  props: ['item', 'index'],
  data: function () {
    return {
      items: this.item
    };
  },
  computed: {
    json: function () {
      return this.item.json;
    },
    score: function () {
      return this.json.score;
    },
    number: function () {
      return (this.index + 1) + "";
    }
  },
  template: '<li><img class="face" :src="`${item.json.img}`" width="64" height="64" /><span class="name flex">{{item.json.name}}</span><span class="rank flex"><img v-for="item_rank in number" :src="`res/Public/record/num/${item_rank}.png`" height="60" /></span><span class="record_num flex"> <img v-for="item_score in score" :src="`res/Public/topbar/num/${item_score}.png`" height="53" /></span></li>'
});
$(function () {
  onInitPage(userInfo, function (success) {
    userInfo.unionid = '1';
    if (userInfo.unionid == "undefined" || typeof (userInfo.unionid) == "undefined") {
      alert("载入失败,请移除小程序后重新进入试试~");
      if (userInfo.from == "wx") {
        location.href = weixinData.loginUrl;
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
        if (!success == 0) {
          doUserLogin(userInfo, function () {
            setTimeout(function () {
              winSize.resize();
            }, 50);
          });
        }
        else {
          $("#ercode").show();
        }
      }
    }
  });
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
  });
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
};