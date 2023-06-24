var act_id = 50, debug = 0;
var v_main = null;
var weixinData = {
  shareTitle: '保持初心，一路前进',
  shareDesc: '任由时光倒流，依然选择与你相遇',
  shareLink: 'https://cpeact.gdalpha.com/act/h5/space_2/index.html',
  shareImg: 'https://cpeact.gdalpha.com/act/h5/space_2/res/icon.jpg'
};
var winSize = {
  width: 640,
  height: 0,
  scaleY: 1,
  resize: function resize() {
    var width = 640;
    var height = $(window).height() > 1400 ? 1400 : $(window).height();
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
    for (let i = 0; i <= 7; i++) {
      cc.spriteFrameCache.addSpriteFrames(res[`main_${i}_plist`], res[`main_${i}_png`]);
    }
    v_main.onStart();

    //v_main.active='video';
  }
};
function vueInit() {
  v_main = new Vue({
    el: '#all',
    data: {
      active: '',
      canPlay: false,
      guide: false,
      music: false,
      music_id: 'normal',
      video: false,
      video_playing: false,
      hasended: true,
      autoplay: false
    },
    watch: {
      music_id: function (newValue, oldValue) {
        if(oldValue=="normal"){
          let music_old = document.getElementById("music_" + oldValue);
          music_old.pause();
          if(cc.audioEngine.isMusicPlaying())
            cc.audioEngine.stopMusic();
          cc.audioEngine.playMusic(res[`audio_${newValue}`], true);
          cc.audioEngine.setMusicVolume(0);
        }
        else if(newValue!='normal'){
          if(cc.audioEngine.isMusicPlaying())
            cc.audioEngine.stopMusic();
          cc.audioEngine.playMusic(res[`audio_${newValue}`], true);
          cc.audioEngine.setMusicVolume(0);
        }
        if (this.music) {
          if(newValue=='normal'){
            if(cc.audioEngine.isMusicPlaying())
              cc.audioEngine.stopMusic();
            let music_new = document.getElementById("music_" + newValue);
            music_new.play();
          }
          else{
            cc.audioEngine.setMusicVolume(1)
          }
        }
      }
    },
    methods: {
      onStart: function onStart() {
        //alert("测试缓存文件用 上线后不显示: v1.0.0");
        cc.director.runScene(new GamePlayScene());
        this.active = '';
        this.canPlay = true;
      },
      reset: function reset() {
        this.music_id = 'normal';
        this.onStart();
      },
      onPlayMusic: function onPlayMusic() {
        if(this.music_id=='normal'){
          let music = document.getElementById("music_" + this.music_id);
          this.music ? music.pause() : music.play();
        }
        else{
          this.music ? cc.audioEngine.setMusicVolume(0) : cc.audioEngine.setMusicVolume(1);
        }
        this.music = !this.music;
      },
      onPlayVideo: function onPlayMusic() {
        var video = document.getElementById("video");
        if (!this.video_playing) {
          this.video_playing = true;
          video.play();
        }
        if (this.music) {
          if(this.music_id=="normal"){
            let music = document.getElementById("music_" + this.music_id);
            music.pause();
          }
          else{
            cc.audioEngine.setMusicVolume(0);
          }
          this.music = false;
        }
      }
    },
    mounted: function mounted() {
      this.active = 'preload';
      this.autoplay = getQueryString("autoplay") != null ? getQueryString("autoplay") * 1 : false;
      cc.game.run();
      initWxJsSdk();
      document.getElementById("dialogs").addEventListener("touchmove", function (e) {
        e.preventDefault();
      });
      document.addEventListener("pagehide", function(){
        onLeave();
      })
    }
  });
}
$(function () {
  // if (!IsPC()) {
    winSize.resize();
    vueInit();
  // } else {
  //   $("#ercode").show();
  // }
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
      }); else loading.stop().animate({
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
  // $.ajax({
  //   cache: false,
  //   async: false,
  //   type: "POST",
  //   url: '/act/getWeiXinToken.ashx',
  //   data: {
  //     thisUrl: location.href.split('#')[0]
  //   },
  //   success: function success(res) {
  //     var wxData = JSON.parse(res);
  //     wx.config({
  //       debug: false,
  //       appId: wxData.appId,
  //       timestamp: wxData.timestamp,
  //       nonceStr: wxData.nonceStr,
  //       signature: wxData.signature,
  //       jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage']
  //     });
  //   }
  // });
  wx.ready(function () {
    document.getElementById('music_normal').play();
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
function onLeave() {
  if (v_main.video_playing) {
    var video = document.getElementById("video");
    video.pause();
  }
  if (v_main.music) {
    if(v_main.music_id=='normal'){
      let music = document.getElementById("music_" + v_main.music_id);
      music.pause();
    }
    else{
      cc.audioEngine.setMusicVolume(0);
    }
    v_main.music = false;
  }
}