var act_id = 43,
    debug = 0,
    loadingtimer = null;
var v_main = null;
var weixinData = {
  shareTitle: '你还记得那个时候吗？',
  shareDesc: '即使时光倒流，我们依然牵手前行',
  shareLink: 'http://act.22dm.com/act/h5/space/index.html',
  shareImg: 'http://act.22dm.com/act/h5/space/res/icon.jpg'
};
var winSize = {
  width: 0,
  height: 0,
  scaleY: 1,
  playEffect: function playEffect(effect) {
    cc.audioEngine.playEffect(res["audio_" + effect], false);
  },
  setEffectsVolume: function setEffectsVolume(volume) {
    cc.audioEngine.setEffectsVolume(volume);
  },
  resize: function resize() {
    var width = 640;
    var height = $(window).height() > 1400 ? 1400 : $(window).height(); // height = 1200;

    var gameCanvas = document.getElementById("gameCanvas");
    gameCanvas.width = width;
    gameCanvas.height = height;
    winSize.width = width;
    winSize.height = height;
    winSize.scaleY = height / 1400;
    $("#all").css({
      width: width,
      height: height
    }).show();
    $("#dialogs_icon_inner").css({
      "transformOrigin": "left top",
      '-webkit-transform': 'scale(' + winSize.scaleY + ',' + winSize.scaleY + ')',
      'transform': 'scale(' + winSize.scaleY + ',' + winSize.scaleY + ')',
      'left': 320 * (1 - winSize.scaleY) + 'px'
    });
  }
};
var dialogs = {
  loadcount: 0,
  loadres: [],
  loadtag: "dialogs_preload",
  precentHeight: 452,
  wordloading: false,
  resloading: false,
  loadResFinish: function loadResFinish() {
    cc.spriteFrameCache.addSpriteFrames(res.main_0_plist, res.main_0_png);
    cc.spriteFrameCache.addSpriteFrames(res.main_1_plist, res.main_1_png);

    if (dialogs.wordloading) {
      console.log("字体加载完成,开始运行");
      v_main.onStart();
    } else {
      dialogs.resloading = true; //console.log("等待字体加载完成后自动运行");
    }
  }
};

function vueInit() {
  v_main = new Vue({
    el: '#all',
    data: {
      active: '',
      paint: 1,
      guide: true,
      music: false
    },
    methods: {
      onStart: function onStart() {
        v_main.active = '';
        cc.director.runScene(new GamePlayScene());

        if (getQueryString("speed") != null) {
          v_main.guide = false;
          cc.director.getScheduler().setTimeScale(getQueryString("speed") * 1);
        } else {
          cc.director.getScheduler().setTimeScale(0);
        }
      },
      reset: function reset() {
        this.active = '';
        this.guide = true;
        cc.director.runScene(new GamePlayScene());
        cc.director.getScheduler().setTimeScale(0);
      },
      onPlayMusic: function onPlayMusic() {
        var music = document.getElementById("game_music");
        this.music ? music.pause() : music.play();
        this.music = !this.music;
      }
    },
    mounted: function mounted() {
      this.active = 'preload';
      cc.game.run();
      document.getElementById("dialogs").addEventListener("touchmove", function (e) {
        e.preventDefault();
      });
      loadingtimer = setTimeout(function () {
        dialogs.wordloading = true;

        if (dialogs.resloading) {
          v_main.onStart();
        }
      }, 3000);
      initWxJsSdk();
    }
  });
}

$(function () {
  if (!IsPC()) {
    winSize.resize();
    vueInit();
  } else {
    $("#ercode").show();
  }
});

cc.game.onStart = function () {
  dialogs.loadres = g_resources;
  dialogs.loadcount = 0;
  loadGameResources();
};

function loadGameResources() {
  cc.loader.load(dialogs.loadres[dialogs.loadcount], function (err) {
    if (dialogs.loadcount >= dialogs.loadres.length - 1) {
      //全部加载完毕
      dialogs.loadResFinish();
    } else {
      dialogs.loadcount++;
      var loading = $("#" + dialogs.loadtag + " .precent_progress");
      var precent = (dialogs.loadcount / (dialogs.loadres.length - 1)).toFixed(2);
      $("#" + dialogs.loadtag + " .precent_word").text("" + Math.ceil(precent * 100) + "%");
      if (!$(loading).is(":animated")) loading.animate({
        height: dialogs.precentHeight * dialogs.loadcount / (dialogs.loadres.length - 1) + "px"
      });else loading.stop().animate({
        height: dialogs.precentHeight * dialogs.loadcount / (dialogs.loadres.length - 1) + "px"
      });
      loadGameResources();
    }
  });
}
function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return r[2];
  return null;
}
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