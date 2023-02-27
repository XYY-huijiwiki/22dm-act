var act_id = 38, debug = true, token, openid;
var v_main, audio_index = null, audio_game = null, interval = null;
var weixinData = {
  loginUrl: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb61fdb0e387cbcc4&redirect_uri=http%3a%2f%2fwww.22dm.com%2fact%2fh5%2fjump%2findex.html&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect',
  shareLink: 'http://www.22dm.com/act/h5/jump/index.html',
  shareTitle: '狼族训练营',
  shareDesc: '测测你是狼还是狗~',
  shareImg: 'http://www.22dm.com/act/h5/jump/res/Public/icon.jpg'
};
var userInfo = {
  openid: "test_38",
  name: "test",
  face: "res/Public/icon.jpg",
  sex: '1',
  country: 'GuangZhou',
  province: 'GuangDong',
  hightest: 0
};
var winSize = {
  width: 0,
  height: 0,
  topOffset: 0,
  maxRotation: 7,
  getTheme: function (score) {
    if (score <= 30)
      return 0;
    else if (score <= 80)
      return 1;
    else if (score <= 200)
      return 2;
    else
      return 3;
  },
  ranking: {
    getRankingList: function () {
      // $.ajax({
      //   cache: false,
      //   async: false,
      //   type: "POST",
      //   url: '/act/h5/deep/doDeepScore.ashx',
      //   data: {
      //     "act_id": act_id,
      //     "init": "1",
      //     "user": userInfo.openid
      //   },
      //   success: function (response) {
      //     var result = JSON.parse(response);
      //     userInfo.hightest = result.score;
      //     v_main.recordList = result.scoreList;
      //   }
      // });
      let result = {
        "time": "2023-02-27",
        "score": "466",
        "count": "0",
        "scoreList": [
          {
            "user": "oTaiPuIAwNsF-6kisjYicXIAHHd4",
            "count": "0",
            "json": {
              "addtime": "2018-10-11",
              "score": "2325",
              "name": "羊羊爱咩",
              "img": "http://thirdwx.qlogo.cn/mmopen/vi_32/x0DfPBlM4c6icnmRd2VDkurMhibsfz21QWQFMibliaYyrVZwUk3832aoCnbev5dzMorPxMiauFZ4WOkmiaOyYwuAkOVA/132",
              "sex": "1",
              "country": "GuangZhou",
              "province": "广东"
            }
          },
          {
            "user": "oTaiPuBk4ZGmR2z7mq7pFaDa272s",
            "count": "0",
            "json": {
              "addtime": "2018-09-29",
              "score": "1030",
              "name": "峻麟",
              "img": "http://thirdwx.qlogo.cn/mmopen/vi_32/DEWicibDQ0g6WyajGfNyPb1BrI54grNibKhX2zHkbjDCI84xicib82lpXyicvYzCqIzByowzCtiaRefLKE2oae6I6w4nQ/132",
              "sex": "1",
              "country": "GuangZhou",
              "province": "北京"
            }
          },
          {
            "user": "oTaiPuN9LkA3rGlCa5SB8lFP257M",
            "count": "0",
            "json": {
              "addtime": "2018-10-02",
              "score": "1025",
              "name": "小王子",
              "img": "http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTL2EaZXTtpNcWibHe4vhBs9zW2MCPZyZH14TuSlHNWzgF3jfFjGMJwuyhDNwuxXmyibCVgYjfqSMrTw/132",
              "sex": "0",
              "country": "GuangZhou",
              "province": ""
            }
          },
          {
            "user": "oTaiPuFJ5hYx3lFC2pVHMQxsktNs",
            "count": "0",
            "json": {
              "addtime": "2018-10-27",
              "score": "789",
              "name": "Milu deer。",
              "img": "http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLaaKPJ25KXuuF0Gcupv1lJIhhRvJ8Sg3wRib1UqYIBRm4Qyq927JZZbkrQRpqBfRffk5UMGicQ8D2A/132",
              "sex": "1",
              "country": "GuangZhou",
              "province": "香港"
            }
          },
          {
            "user": "oTaiPuJOvHKMYM2Ibd6dQNtruF04",
            "count": "0",
            "json": {
              "addtime": "2018-10-02",
              "score": "741",
              "name": "春天",
              "img": "http://thirdwx.qlogo.cn/mmopen/vi_32/vjBI6U2f8xibkz95HHGCfvUnLoDJOichU9FE9qLdiciaPmYrg1x72MBic6Oz1lP3k8V0icOXC0dibbWjgV0XiaplYHCSIw/132",
              "sex": "2",
              "country": "GuangZhou",
              "province": "广东"
            }
          },
          {
            "user": "oTaiPuKkYO2uED10GQyGw9-64KEI",
            "count": "0",
            "json": {
              "addtime": "2018-10-27",
              "score": "593",
              "name": "疯狂帝国",
              "img": "http://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83ep8O159MOZpZBb4MHTAuWJkwPkR5xHg7Tom2kicdZezEKCqDiblGmAQPKA6HZD4j149onibN4CxMicGuA/132",
              "sex": "1",
              "country": "GuangZhou",
              "province": ""
            }
          },
          {
            "user": "oTaiPuKR5Laklpi4fWgf72gfuK_Q",
            "count": "0",
            "json": {
              "addtime": "2018-10-30",
              "score": "540",
              "name": "gjx",
              "img": "http://thirdwx.qlogo.cn/mmopen/vi_32/icHmZWxlnVrDSkKmfVoPVRuHIm4VuNMBmdwncb6lBPDw2wWzV5hgbibUmtsjyDGezlzbrDsXxW7ajEpJGLV1Cg8g/132",
              "sex": "0",
              "country": "GuangZhou",
              "province": ""
            }
          },
          {
            "user": "oTaiPuFx3a-dEEOKUIie22xqgNzA",
            "count": "0",
            "json": {
              "addtime": "2018-10-15",
              "score": "504",
              "name": "一紙繁花葬絆城",
              "img": "http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLjuSjpjA61fgoicicT0kt1XRNXWcalnOnjBicr1npbfyncQVhibrONJgibb1EraPH8ibCJRt01engnosYw/132",
              "sex": "2",
              "country": "GuangZhou",
              "province": "北京"
            }
          },
          {
            "user": "oTaiPuChs7teTaeeelcR_aKUu380",
            "count": "0",
            "json": {
              "addtime": "2018-10-30",
              "score": "497",
              "name": "熊出没",
              "img": "http://thirdwx.qlogo.cn/mmopen/vi_32/EKLoARwx2gB0ba51SrEiaejy0auo6OfjOxaEOayGIyODojfrVgjmXe0w9WdHeos9icw6osibfUeSWNIJjyoOESXkQ/132",
              "sex": "1",
              "country": "GuangZhou",
              "province": ""
            }
          },
          {
            "user": "oTaiPuOGP2U8ALTOHpdpEE8PtPZQ",
            "count": "0",
            "json": {
              "addtime": "2018-10-12",
              "score": "466",
              "name": "宋礼",
              "img": "http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLZoI5olaqlJDJ5mXIffzRLJEkftNaAjE4fGMKETajILzgrQTHFqldCKp7icb4JqG79aUUt9fpOLTw/132",
              "sex": "1",
              "country": "GuangZhou",
              "province": ""
            }
          }
        ]
      };
      userInfo.hightest = result.score;
      v_main.recordList = result.scoreList;
    },
    addScore: function (score) {
      var json = '{"addtime":"str_addtime","score":"' + score + '","name":"' + userInfo.name + '","img":"' + userInfo.face + '","sex":"' + userInfo.sex + '","country":"' + userInfo.country + '","province":"' + userInfo.province + '"}';
      console.info(json);
      userInfo.hightest = score;
      $.ajax({
        cache: false,
        async: false,
        type: "POST",
        url: '/act/h5/deep/doDeepScore.ashx',
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
      if (now > Date.parse("2018/10/31 00:00:00")) {
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
        alert('排行榜截止于2018-10-31,请于结束后再来领取奖品!');
        return false;
      }
    }
  },
  playEffect: function (effect) {
    cc.audioEngine.playEffect(res["audio_" + effect], false);
  },
  setEffectsVolume: function (volume) {
    v_main.volume = volume;
    cc.audioEngine.setEffectsVolume(volume);
    gameMusic.volume = volume;
    indexMusic.volume = volume;
  },
  resize: function () {
    var width = $(window).width();
    var height = $(window).height();
    var gameCanvas = document.getElementById("gameCanvas");
    gameCanvas.width = width;
    gameCanvas.height = height;
    winSize.width = width;
    winSize.height = height;
    winSize.topOffset = height > 1136 ? (height - 1136) / 2 : (height - 1136) / 2;
    $("#all").css({
      width: width,
      height: height
    }).show();
    $(".dialogs_close").css({
      top: -winSize.topOffset + 20
    });
    if (height < 1137) {
      $("#all").css({
        overflow: "hidden"
      });
    }
    console.log("winSize.topOffset:" + winSize.topOffset);
  }
};
var dialogs = {
  loadcount: 0,
  loadres: [],
  loadtag: "dialogs_preload",
  precentHeight: 452,
  loadResFinish: function () {
    cc.spriteFrameCache.addSpriteFrames(res.gp_main_plist, res.gp_main_png);
    for (var i = 0; i <= 6; i++) {
      cc.spriteFrameCache.addSpriteFrames(res["gs_theme_" + i + "_plist"], res["gs_theme_" + i + "_png"]);
    }

    v_main.active = '';

    cc.director.runScene(new MainMenuScene());

    //v_main.Game_resert();

    //cc.director.runScene(new GameResultScene({theme:3}));
  }
};
function vueInit() {
  v_main = new Vue({
    el: '#all',
    data: {
      active: '',
      tips: '',
      recordList: [],
      guide: false,
      isPlay: false,
      Game_score: 0,
      Game_skill: false,
      Game_over: false,
      volume: 1,
      rope: 0
    },
    watch: {
      Game_score: function (newValue, oldValue) {
        if (!GameManager.isGameOver) {
          GameManager.totalScore += newValue - oldValue;
          cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_UPDATE_SCORE_TEXT));
        }
      },
      Game_over: function (newValue, oldValue) {
        if (newValue) {
          var theme = winSize.getTheme(this.Game_score);
          setTimeout(function () {
            clearInterval(interval);
            winSize.playEffect('gameover');
            cc.director.runScene(new GameResultScene({ theme: theme }));
          }, 3000);
          if (this.Game_score > userInfo.hightest) {
            winSize.ranking.addScore(this.Game_score);
          }
          winSize.playEffect('dead');
        }
      }
    },
    methods: {
      Game_resert: function () {
        clearInterval(interval);
        this.Game_over = false;
        this.isPlay = true;
        this.Game_score = 0;
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
        gameMusic.pause();
        indexMusic.play();
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
      guideLeave: function () {
        this.guide = true;
        this.Game_resert();
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
  audio_index = document.getElementById("indexMusic");
  audio_game = document.getElementById("gameMusic");
  doUserLogin();
  //document.getElementById("dialogs").addEventListener("touchmove",function(event){event.preventDefault();});
});
function doUserLogin() {
  if (!debug) {
    $.ajax({
      cache: false,
      async: false,
      type: "POST",
      url: '/act/center/openIdCrossDomain.ashx',
      data: {
        "type": "GET",
        "url": 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=wxb61fdb0e387cbcc4&secret=2de4747ccccb04312e71e86708bfec66&code=' + getQueryString("code") + '&grant_type=authorization_code'
      },
      success: function (response) {
        var result = JSON.parse(response);
        token = result.access_token;
        openid = result.openid;
        if (typeof (openid) == "undefined") {
          location.href = weixinData.loginUrl;
        }
        else {
          $.ajax({
            cache: false,
            async: false,
            type: "POST",
            url: '/act/center/openIdCrossDomain.ashx',
            data: {
              "type": "GET",
              "url": 'https://api.weixin.qq.com/sns/userinfo?access_token=' + token + '&openid=' + openid + '&lang=zh_CN',
            },
            success: function (response) {
              var r = JSON.parse(response);
              userInfo.openid = openid;
              userInfo.name = r.nickname;
              userInfo.face = r.headimgurl != "" ? r.headimgurl : weixinData.shareImg;
              userInfo.sex = r.sex;
              userInfo.ountry = r.country;
              userInfo.province = r.province;
              initWxJsSdk();
            }
          });
        }
      }
    });
  }
  else {
    winSize.resize();
    vueInit();
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
function initWxJsSdk() {
  $.ajax({
    cache: false,
    async: false,
    type: "POST",
    url: '/act/getWeiXinToken.ashx',
    data: {
      thisUrl: (location.href.split('#')[0])
    },
    success: function (res) {
      var wxData = JSON.parse(res);
      wx.config({
        debug: false,
        appId: wxData.appId,
        timestamp: wxData.timestamp,
        nonceStr: wxData.nonceStr,
        signature: wxData.signature,
        jsApiList: [
          'onMenuShareTimeline',
          'onMenuShareAppMessage'
        ]
      });
    }
  });
  wx.ready(function () {
    wx.onMenuShareTimeline({
      title: weixinData.shareTitle,
      link: weixinData.shareLink,
      imgUrl: weixinData.shareImg
    });
    wx.onMenuShareAppMessage({
      title: weixinData.shareTitle,
      desc: weixinData.shareDesc,
      link: weixinData.shareLink,
      imgUrl: weixinData.shareImg,
    });
    winSize.resize();
    vueInit();
  });
}
function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return (r[2]); return null;
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
    // $.ajax({
    //   cache: false,
    //   async: false,
    //   type: "POST",
    //   url: '/act/h5/deep/doDeepScore.ashx',
    //   data: {
    //     "act_id": act_id,
    //     "init": "0",
    //     "type": "award",
    //     "user": userInfo.openid,
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
  }
};
