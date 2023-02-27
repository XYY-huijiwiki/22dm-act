var act_id = 58;
var vm;
var weixinData = {
  shareTitle: '《喜羊羊与灰太狼》十五周年',
  shareDesc: '创造回忆，收获成长的新惊喜',
  shareLink: 'https://act.22dm.com/act/h5/15th/index.html',
  shareImg: 'https://act.22dm.com/act/h5/15th/res/icon.jpg',
  loginUrl: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb61fdb0e387cbcc4&redirect_uri=http%3a%2f%2fact.22dm.com%2fact%2fh5%2f15th%2findex.html&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect',
  jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage']
};
var winSize = {
  width: 640,
  height: 1400,
  scale: 1,
  offsetTop: 0,
  loadcount: 0,
  loadres: [],
  loadtag: "dialogs_preload",
  music: "default",
  playEffect: function (effect, loop) {
    if (vm.music)
      cc.audioEngine.playEffect(res["audio_" + effect], loop);
  },
  playMusic: function (music) {
    if (cc.audioEngine.isMusicPlaying()) {
      cc.audioEngine.stopMusic();
    }
    cc.audioEngine.playMusic(res["audio_" + music], true);
    this.music = music;
  },
  setEffectsVolume: function (volume) {
    cc.audioEngine.setMusicVolume(volume);
    cc.audioEngine.setEffectsVolume(volume);
  },
  resize: function () {
    let height = $(window).height();
    if (height < 1400) {
      this.height = height * 1;
      this.scale = (height / 1400).toFixed(4) * 1;
      this.offsetTop = ((height - 1400) / 2) * 1;
    }
    if (height < 1000) {
      $("#select_main,#douyin_main").css({
        'webkitTransform': 'scale(' + (height / 1000).toFixed(4) * 1 + ')',
        'transform': 'scale(' + (height / 1000).toFixed(4) * 1 + ')'
      });
    }
    $("#all").css({
      width: this.width,
      height: this.height
    }).show();
    var gameCanvas = document.getElementById("gameCanvas");
    gameCanvas.width = this.width;
    gameCanvas.height = this.height;
    console.log(`width:${this.width} height:${this.height} scale:${this.scale}`);
    vueInit();
  },
  loadResFinish: function () {
    cc.spriteFrameCache.addSpriteFrames(res.main_plist_0, res.main_png_0);
    cc.spriteFrameCache.addSpriteFrames(res.main_plist_1, res.main_png_1);
    cc.spriteFrameCache.addSpriteFrames(res.main_plist_2, res.main_png_2);
    cc.spriteFrameCache.addSpriteFrames(res.main_plist_3, res.main_png_3);
    cc.spriteFrameCache.addSpriteFrames(res.main_plist_4, res.main_png_4);

    vm.active = "";
    vm.Game_reset();
  }
}
function vueInit() {
  vm = new Vue({
    el: '#all',
    data: {
      active: '',
      guide: 0,
      canPlay: false,
      music: false,
      share: false,
      hidden: false,
      isFilter: ['shop'],
      friends: friends,
      chatbox: { room: "青青草原我最帅(9)", msg: [] },
      douyin: { play: false, ercode: false, like: false, msg: false },
      bilibili: { play: false, danmu: danmu, ercode: false, rocket: false, rocketend: false },
      end: { id: 0, sex: 0, foot: 0, year: 15, title: 1, word: 1, poster: false, share: false },
      shop: { "type": "navigation", "img": "/img/index/dialogs/0705.jpg", "url": "/pages/shop/emoji/emoji?emoji_url=https://mp.weixin.qq.com/s/uL4-SeT6WNHVYVDNH10-bA" }
    },
    watch: {
      hidden: function (newValue, oldValue) {
        if (newValue) {
          if (this.music) {
            this.onPlayMusic();
          }
        }
      }
    },
    methods: {
      Game_reset: function () {
        GameManager.reset();
        this.active = "";
        this.canPlay = false;
        this.guide = 0;
        cc.director.runScene(new GamePlayScene());
        if (!this.music) {
          winSize.setEffectsVolume(0);
        }
      },
      onCCResume: function (part) {
        this.guide = 0;
        cc.director.resume();
        if (part == 1) {
          this.music ? null : this.onPlayMusic();
          winSize.playEffect("alert", false);
        }
        else if (part == 2) {
          winSize.playMusic("xyy");
          winSize.playEffect("remote", false);
        }
      },
      onCCLoad: function (part) {
        cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName[part]));
      },
      onPlayMusic: function () {
        this.music = !this.music;
        winSize.setEffectsVolume(this.music ? 1 : 0);
        if (!this.music) {
          cc.audioEngine.stopMusic();
        }
        else {
          winSize.playMusic(winSize.music);
        }
      },
      onGoShop: function () {
        // location.href = "https://mp.weixin.qq.com/s/pIf1pO1pt0kKCOygLnuhhg";
        // wx.miniProgram.navigateTo({
        //   url: this.shop.url
        // });
      },
      toDataUrl: function () {
        this.active = "select2";
        cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_END));
        setTimeout(function () {
          if (vm.active == "select2") {
            let dataUrl = document.getElementById('gameCanvas').toDataURL("image/jpeg", 1);
            document.getElementById('poster').src = dataUrl;
            vm.end.poster = true;
            winSize.playEffect("camera");
          }
        }, 100)
      },
      onLoadMsg: function () {
        this.douyin.msg = false;
        this.douyin.play = false;
        setTimeout(() => {
          if (vm.active == "douyin") {
            vm.douyin.msg = true;
            winSize.playEffect("alert", false);
          }
        }, 7000)
      },
      onLoadFire: function () {
        this.bilibili.play = false;
        setTimeout(() => {
          if (vm.active == "bilibili") {
            vm.bilibili.rocket = true;
            setTimeout(() => {
              if (vm.active == "bilibili") {
                vm.bilibili.rocketend = true;
              }
            }, 1500)
          }
        }, 15000)
      },
      onPlayVideo: function (name) {
        if (cc.audioEngine.isMusicPlaying()) {
          cc.audioEngine.stopMusic();
        }
        let v = document.getElementById(`video_${name}`);
        v.play();
        this[name].play = true;
      },
      initChatBox: function () {
        setTimeout(() => {
          if (this.active == "chatbox" && this.chatbox.msg.length < chatbox.msg.length) {
            this.chatbox.msg.push(chatbox.msg[this.chatbox.msg.length]);
            winSize.playEffect("message", false);
            this.initChatBox();
            let m = document.getElementById("chatbox_main");
            if (m.scrollHeight > m.clientHeight) {
              m.scrollTop = m.scrollHeight - m.clientHeight;
            }
          }
        }, 1000)
      }
    },
    mounted: function () {
      this.active = 'preload';
      cc.game.run();
      this.$nextTick(function () {
        // initWxJsSdk(weixinData.jsApiList, function () {
        //   //this.onPlayMusic();
        // }.bind(this));
        document.addEventListener("visibilitychange", () => {
          this.hidden = document.hidden;
        });
      }.bind(this))
    }
  });
}

$(function () {
  winSize.resize();
});
cc.game.onStart = function () {
  winSize.loadres = g_resources;
  winSize.loadcount = 0;
  loadGameResources();
};
function loadGameResources() {
  cc.loader.load(winSize.loadres[winSize.loadcount], function (err) {
    if (winSize.loadcount >= winSize.loadres.length - 1) {
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