var act_id = 101, debug = 0, tt = false;
var v_main;
var lotterytimer = null;
var map = [[0, -1], [0, -1], [0, -1], [0, -1], [0, -1], [0, -1], [0, -1], [0, -1], [1, 0], [1, 0], [0, -1], [0, -1], [1, 0], [1, 0], [1, 0], [0, 1], [0, 1], [-1, 0], [0, 1], [0, 1], [0, 1], [1, 0], [0, 1], [0, 1], [0, 1], [0, 1], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]];
var map2 = [[0, -1], [0, -1], [0, -1], [0, -1], [0, -1], [0, -1], [0, -1], [0, -1], [1, 0], [1, 0], [0, 1], [0, 1], [0, 1], [0, 1], [0, 1], [1, 0], [1, 0], [1, 0], [0, 1], [0, 1], [-1, 0], [-1, 0], [-1, 0], [-1, 0], [-1, 0]];
var question = [
  {
    name: "爱情",
    id: 0,
    wish: [7, 8, 9],
    map: 2,
    initstep: 2,
    special: { q: 1, a: 2 },
    item: [
      {
        q: "假如给你一个花园，你会在里面种上怎样的植物？",
        a: ["茂盛的树木", "拥有累累果实的植物", "芳香的花朵"],
        n: [4, 4, 5]
      },
      {
        q: "对于建筑物的赞美，你更喜欢用以下哪个词？",
        a: ["气势磅礴", "精雕细刻", "美轮美奂"],
        n: [4, 4, 5]
      },
      {
        q: "心目中想去的地方是...",
        a: ["海边", "草原", "高山"],
        n: [3, 3, 3]
      },
      {
        q: "你最不喜欢的事情是...",
        a: ["当单身狗", "当电灯泡"],
        n: [4, 5]
      },
      {
        q: "你喜欢去吃饭地方是... ",
        a: ["浪漫的西餐厅", "温馨的家"],
        n: [4, 4]
      }
    ]
  },
  {
    name: "家庭",
    id: 1,
    wish: [1, 2, 3],
    map: 1,
    initstep: 4,
    special: { q: 1, a: 1 },
    item: [
      {
        q: "你希望实现的事情是...",
        a: ["搬进新房子", "养只小宠物", "去一趟旅游"],
        n: [5, 5, 6]
      },
      {
        q: "春节期间你会做些什么事情...",
        a: ["看一场电影", "放一次烟花", "拍一张全家福"],
        n: [4, 3, 3]
      },
      {
        q: "春节做哪一件事年味最浓？",
        a: ["逛花市", "吃年夜饭", "贴春联"],
        n: [5, 5, 6]
      },
      {
        q: "亲戚来你家，你会怎么接待？ ",
        a: ["热情交流", "多吃水果少说话", "乖巧地坐着"],
        n: [5, 4, 4]
      },
      {
        q: "最喜欢吃餐桌上的...",
        a: ["饺子年糕", "坚果瓜子", "大鱼大肉"],
        n: [4, 5, 4]
      }
    ]
  },
  {
    name: "事业",
    id: 2,
    wish: [4, 5, 6],
    map: 1,
    initstep: 5,
    special: { q: 3, a: 1 },
    item: [
      {
        q: "在工作中，你想拥有什么技能？...",
        a: ["分身术", "快速无影手", "控制时间的沙漏"],
        n: [4, 4, 5]
      },
      {
        q: "在新一年的工作里，你希望...",
        a: ["不加班不熬夜", "应酬少福利多", "甲方对我好一点"],
        n: [5, 4, 5]
      },
      {
        q: "你捡到一个金色盒子，你打开一看是...",
        a: ["满满金币", "高薪升职信", "珍贵古董"],
        n: [5, 4, 4]
      },
      {
        q: "2020年第一个“金”喜，你希望是...",
        a: ["赚到第一桶金", "出门遇贵人", "收获大红包"],
        n: [4, 5, 4]
      },
      {
        q: "最幸福的是哪一刻？",
        a: ["吃得饱睡得好", "拆礼物", "完成任务下班回家"],
        n: [5, 4, 4]
      }
    ]
  }
]
var card = {
  used: [],
  goods: 0,
  cover: 0
}
var weixinData = {
  shareTitle: '国潮有喜，转“鼠”好运',
  shareDesc: '让大家来获取新年好福气吧~',
  shareLink: 'https://act.22dm.com/act/h5/2020/index.html',
  shareImg: 'https://act.22dm.com/act/h5/2020/res/icon.jpg',
  loginUrl: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb61fdb0e387cbcc4&redirect_uri=http%3a%2f%2fact.22dm.com%2fact%2fh5%2f2020%2findex.html&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect',
  jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage']
};
var userInfo = {
  from: "",
  openid: "openid",
  unionid: "unionid",
  name: "lllzc",
  face: weixinData.shareImg
};
var winSize = {
  height: 1400,
  width: 640,
  scale: 1,
  loadcount: 0,
  loadres: [],
  loadtag: "dialogs_preload",
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
    let minHeight = 1300;
    if (height < minHeight) {
      this.scale = (height / minHeight).toFixed(4);
      $("#gs_main,#shop_main,#wish_main,#prize_inner,.map_bottom_role").css({
        'transform': 'scale(' + this.scale + ')',
        '-webkit-transform ': 'scale(' + this.scale + ')',
      })
      if (height < 1100) {
        let scale = (height / 1100).toFixed(4);
        $("#tips_main,#rule_main,#award_main").css({
          'transform': 'scale(' + scale + ')',
          '-webkit-transform ': 'scale(' + scale + ')',
        })
      }
      $("#prize_inner").css({
        'marginTop': -310 * this.scale
      })
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
    cc.spriteFrameCache.addSpriteFrames(res.mm_plist, res.mm_png);

    v_main.Game_home();
  }
}
function vueInit() {
  v_main = new Vue({
    el: '#all',
    data: {
      from: "",
      debug: false,
      music: true,
      scene: '',
      active: '',
      shop: { "type": "navigation", "img": "/img/index/dialogs/0110.jpg", "url": "/pages/shop/emoji/emoji?emoji_url=https://mp.weixin.qq.com/s/y8AxlggK7eJUWjsVIbQdiQ" },
      facetoken: ['aass', 'vjsk', 'oosp', 'ppsd', 'iuwj', 'pask', 'mcns', 'paos'],
      card: card,

      hp: 0,
      map: map2,
      wish: -1,
      wishlist: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      question: question[0],
      qusetioned: [],
      questionnum: ['A. ', 'B. ', 'C. '],
      step: 0,
      stepneed: 0,
      steped: 0,
      theme1: 1,
      theme2: 1,
      award: -1,
      prizeid: 0,
      lottery_item: 0,

      alertContent: "",
      alertCallBack: "",
      lotterytimercount: 0,
      canlottery: true,
      hidden: false,
      record: false,
      wallpaper: false,
      share: false,
      prizetips: false,
      prize: false,
      cover: false,
      tt: tt
    },
    watch: {
      hidden: function (newValue, oldValue) {
        if (newValue) {
          if (this.music) {
            this.onPlayMusic();
          }
        }
      },
      step: function (newValue, oldValue) {
        if (newValue > 0) {
          var event = new cc.EventCustom(jf.EventName.GP_ROLE_RUN);
          event.setUserData({
            deltaX: this.map[newValue][0] * GameManager.rowX,
            deltaY: this.map[newValue][1] * GameManager.rowY
          });
          cc.eventManager.dispatchEvent(event);
          this.steped++;
        }
      },
      stepneed: function (newValue, oldValue) {
        if (newValue != this.steped) {
          if (this.steped == 0)
            this.step++;
        }
      }
    },
    methods: {
      Game_reset: function () {
        this.wish = -1;
        this.wishlist = this.wishlist.sort(() => Math.random() - 0.5);
        this.active = 'wish';
      },
      Game_start: function (wish) {
        this.qusetioned = [];
        this.step = 0;
        this.steped = 0;
        this.stepneed = 0;
        this.active = '';
        let wishid = 0;
        for (let i = 0; i < question.length; i++) {
          for (let j = 0; j < question[i].wish.length; j++) {
            if (question[i].wish[j] == wish) {
              wishid = question[i].id;
            }
          }
        }
        this.wish = wishid;
        this.question = question[wishid];
        this.map = this.question.map == 2 ? map2 : map;
        cc.director.runScene(new GamePlayScene());
      },
      Game_home: function () {
        this.active = "";
        cc.director.runScene(new MainMenuScene())
      },
      onNextQuestion: function () {
        winSize.playEffect("foot");
        if (this.stepneed != this.steped) {
          this.step++;
        }
        else {
          this.steped = 0;
          this.stepneed = 0;
          if (this.qusetioned.length < this.question.item.length) {
            this.active = 'question';
            winSize.playEffect("select");
          }
          else {
            if (this.qusetioned[this.question.special.q] != this.question.special.a) {
              this.theme1 = this.question.id;
              this.theme2 = Math.random() > 0.5 ? 1 : 2;
            }
            else {
              this.theme1 = 3;
              this.theme2 = 1;
            }
            setTimeout(function () {
              this.active = 'gs';
              winSize.playEffect("gs");
            }.bind(this), 700)
          }
        }
      },
      onSelectQuestion: function (index) {
        if (!$("#question_inner .item_a").hasClass("active")) {
          $("#question_inner .item_a").eq(index).addClass("active");
          setTimeout(function () {
            this.active = "";
            this.stepneed = this.question.item[this.qusetioned.length].n[index];
            this.qusetioned.push(index);
            $("#question_inner .item_a").removeClass("active");
          }.bind(this), 500)
        }
      },
      onStopLottery: function () {
        clearInterval(lotterytimer);
        var that = this;
        this.hp--;
        this.lotterytimercount = 0;
        this.canlottery = true;
        var random = Math.random();
        var code = new Date().getTime();
        var prizeid = 0;

        if (random < GameManager.lotteryRandom) {
          var dt = new Date().getTime();
          var hasgoods = false;
          var hascover = (dt > Date.parse("2020/01/22 20:00:00")) ? false : true;
          var flag = true;
          for (let i = 0; i < this.card.used.length; i++) {
            if (this.card.used[i].id == 53) {
              hasgoods = true;
            }
            if (this.card.used[i].id < 10) {
              hascover = true;
            }
          }
          if (random < GameManager.lotteryGoods && !hasgoods && this.card.goods > 0) {
            prizeid = 53;
          }
          else if (random < GameManager.lotteryCover && !hascover && this.card.cover > 0) {
            prizeid = 9;
          }
          else {
            prizeid = Math.ceil(Math.random() * 8) + 100;
            for (let i = 0; i < this.card.used.length; i++) {
              if (this.card.used[i].id == prizeid) {
                flag = false;
                this.card.used.splice(i, 1);
                this.card.used.unshift({
                  id: prizeid,
                  code: code,
                  state: 0
                });
                this.prizeid = prizeid;
                break;
              }
            }
          }
          if (flag) {
            $.ajax({
              cache: false,
              async: false,
              type: "POST",
              url: '/act/h5/2020/getInitData.ashx',
              data: {
                "type": "onExchangeGoods",
                "unionid": userInfo.unionid,
                "goods_id": prizeid,
                "code": code
              },
              success: function (response) {
                //console.log(response);
                var json = JSON.parse(response);
                var showprize = true;
                if (json.success) {
                  if (prizeid == 9) {
                    if (json.code != "none") {
                      prizeid = json.tid;
                      code = json.code;
                      that.card.cover--;
                    }
                    else {
                      showprize = false;
                      that.onAddMagicLog("none");
                      that.alertContent = "再接再厉~下次一定会中奖!";
                      return;
                    }
                  }
                  if (showprize) {
                    that.card.used.unshift({
                      id: prizeid,
                      code: code,
                      state: 0
                    });
                    that.prizeid = prizeid;
                  }
                }
              }
            });
          }
          this.onAddMagicLog("normal");
          winSize.playEffect("success");
        }
        else {
          this.onAddMagicLog("none");
          this.alertContent = "再接再厉~下次一定会中奖!";
        }
      },
      onOpenPrize: function (index) {
        let id = this.card.used[index].id;
        if (id > 100) {
          this.wallpaper = id;
        }
        else if (id == 53) {
          if (this.card.used[index].state == 0) {
            this.award = index;
          }
          else {
            this.alertContent = "收货信息已填写<br/>请耐心等待收货哦！";
          }
        }
        else if (id < 10) {
          var cover = `https://support.weixin.qq.com/cgi-bin/mmsupport-bin/showredpacket?receiveuri=${this.card.used[index].code}&check_type=2#wechat_redirect`;
          if (userInfo.from == "wx") {
            location.href = cover;
          }
          else {
            $("#cover_ercode").empty();
            new QRCode('cover_ercode', {
              text: cover,
              width: 400,
              height: 400,
              colorDark: '#000000',
              colorLight: '#ffffff',
              correctLevel: QRCode.CorrectLevel.L
            });
            this.cover = this.card.used[index].code;
          }
        }


      },
      onShowPrizeDialogs: function () {
        setTimeout(function () {
          if (this.active == 'gs')
            this.prizetips = true;
        }.bind(this), 7000)
      },
      onBeginLottery: function () {
        if (!tt) {
          if (this.hp > 0) {
            if (this.canlottery) {
              var now = new Date().getTime();
              if (now < Date.parse("2020/03/01 00:00:00")) {
                this.canlottery = false;
                clearInterval(lotterytimer);
                lotterytimer = setInterval(function () {
                  v_main.lottery_item = v_main.lottery_item < 8 ? v_main.lottery_item + 1 : 1;
                  this.lotterytimercount++;
                  if (this.lotterytimercount > 24 + Math.ceil(Math.random() * 24)) {
                    v_main.onStopLottery();
                  }
                }.bind(this), 130);
                winSize.playEffect('button');
              }
              else {
                this.alertContent = "活动已结束";
              }
            }
          }
          else {
            this.alertContent = '您今天的抽奖机会用完啦~';
          }
        }
        else {
          this.alertContent="更多功能请微信搜索小程序: i喜羊羊与灰太狼";
        }
      },
      onAddMagicLog: function (magic) {
        var that = this;
        $.ajax({
          cache: false,
          async: false,
          type: "POST",
          url: '/act/h5/2020/getInitData.ashx',
          data: {
            "type": "onAddLog",
            "unionid": userInfo.unionid,
            "magic": magic
          },
          success: function (response) {
            var json = JSON.parse(response);
            if (!json.success) {
              that.alertContent = json.res;
            }
          }
        });
      },
      onAwardPost: function (info) {
        var that = this;
        var item = this.card.used[that.award];
        $.ajax({
          cache: false,
          async: false,
          type: "POST",
          url: '/act/h5/2020/getInitData.ashx',
          data: {
            "type": "onAwardPost",
            "unionid": userInfo.unionid,
            "goods_id": item.id,
            "code": item.code,
            "info": info
          },
          success: function (response) {
            var json = JSON.parse(response);
            that.award = -1;
            that.alertContent = json.res;
            if (json.success && item.id < 100) {
              item.state = 1;
            }
          }
        });
      },
      onAlertSure: function () {
        if (typeof (this.alertCallBack) != "function") {
          this.alertContent = "";
        }
        else {
          this.alertCallBack();
        }
      },
      onGoShop: function () {
        if (userInfo.from == "wx") {
          location.href = this.shop.url.substr(this.shop.url.indexOf("emoji_url=") + 10);
        }
        else {
          wx.miniProgram.navigateTo({
            url: this.shop.url
          });
        }
      },
      onPlayMusic: function () {
        winSize.setEffectsVolume(this.music ? 0 : 1);
        this.music = !this.music;
      },
      button_public: function (active) {
        winSize.playEffect('button');
        this.active = active;
      },
      getInitData: function () {
        var that = this;
        $.ajax({
          cache: false,
          async: false,
          type: "POST",
          url: '/act/h5/2020/getInitData.ashx',
          data: {
            "type": "getUserData",
            "unionid": userInfo.unionid
          },
          success: function (response) {
            var res = JSON.parse(response);
            console.log(response);
            if (res.success) {
              that.hp = res.hp;
              that.card.used = res.used;
              that.card.goods = res.goods;
              that.card.cover = res.cover;
            }
            else {
              that.alertContent = "Sorry~服务器开小差了<br/>请稍等片刻再来试试";
            }
          }
        });
      }
    },
    mounted: function () {
      if(!tt)
        this.getInitData();
      this.active = 'preload';
      cc.game.run();
      this.$nextTick(function () {
        this.debug = getQueryString("debug") != null ? true : false;
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
        document.addEventListener("visibilitychange", () => {
          this.hidden = document.hidden;
        });
        document.getElementById("all").addEventListener("touchmove", function (event) {
          if (!this.record)
            event.preventDefault();
        }.bind(this));
      }.bind(this))
    }
  });
}
$(function () {
  if (getQueryString("tt") == null) {
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
            tt = true;
            winSize.resize();
            //$("#ercode").show();
          }
        }
      }
    })
  }
  else {
    tt = true;
    winSize.resize();
  }
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