var act_id = 100, debug = 0;
var v_main;
var card = {
  collect: { b: 0, g: 0, f: 0, r: 0, z: 0 },
  used: [],
  goods: []
}
var weixinData = {
  shareTitle: '奇趣能量屋',
  shareDesc: '羊羊魔方球，欢乐夹不停！马上来打卡吧！',
  shareLink: 'https://act.22dm.com/act/h5/magic/index.html',
  shareImg: 'https://act.22dm.com/act/h5/magic/res/icon.jpg',
  loginUrl: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb61fdb0e387cbcc4&redirect_uri=http%3a%2f%2fact.22dm.com%2fact%2fh5%2fmagic%2findex.html&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect',
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
  width: 640,
  height: 1200,
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
    let minHeight = 1320;
    if (height < minHeight) {
      this.scale = (height / minHeight).toFixed(4);
      $("#gameplay,#shop_main").css({
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
    //if(userInfo.from != "wx")
    vueInit();
  },
  loadResFinish: function () {
    cc.spriteFrameCache.addSpriteFrames(res.main_plist, res.main_png);
    v_main.onStart();
  }
}
function vueInit() {
  v_main = new Vue({
    el: '#all',
    data: {
      from: "",
      debug: false,
      active: '',
      roleId: 'n',
      music: true,
      guide: true,
      hp: 0,
      pack: 2,
      pack_menu: 3,
      wallpaper: "",
      award: -1,
      shop: false,
      alertContent: '',
      alertCallBack: '',
      gamerun: false,
      card: card,
      hasShare: false,
      hidden: false,
      waiting : false
    },
    watch: {
      hidden: function (newValue, oldValue) {
        if (newValue) {
          if (this.music) {
            this.onPlayMusic();
          }
        }
        if (oldValue && !this.hasShare) {
          this.onAddMagicLog("s");
        }
      }
    },
    methods: {
      onStart: function () {
        this.active = "";
        this.getCardData();
        cc.director.runScene(new GamePlayScene());
      },
      getInitData: function () {
        var that = this;
        $.ajax({
          cache: false,
          async: false,
          type: "POST",
          url: '/act/h5/magic/getInitData.ashx',
          data: {
            "type": "getUserData",
            "unionid": userInfo.unionid
          },
          success: function (response) {
            var res = JSON.parse(response);
            console.log(response);
            if (res.success) {
              card.collect = res.collect;
              that.hp = res.hp;
              that.hasShare = res.hasShare;
            }
            else {
              that.alertContent = "Sorry~服务器开小差了<br/>请稍等片刻再来试试";
            }
          }
        });
      },
      getCardData: function () {
        var that = this;
        $.ajax({
          cache: false,
          async: false,
          type: "POST",
          url: '/act/h5/magic/getInitData.ashx',
          data: {
            "type": "getCardData",
            "unionid": userInfo.unionid
          },
          success: function (response) {
            var res = JSON.parse(response);
            card.used = res.used;
            card.goods = res.goods;
            that.shop = res.shop;
            if(res.shop && that.hp<=0){
              that.active = "shop";
            }
          }
        });
      },
      onGameHand: function () {
        if (!this.gamerun) {
          if(new Date().getTime() < Date.parse("2020/4/1 00:00:00")){
            if (this.hp > 0) {
              cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GAME_HAND));
              winSize.playEffect("hand");
            }
            else {
              this.alertContent = "今天的机会用完啦~<br/>分享给小伙伴可获得额外1次机会哦(每天上限1次)";
            }
          }
          else{
            this.alertContent = "活动已经结束啦~";
          }
        }
      },
      getGoodsName: function (id) {
        for (var i = 0; i < this.card.goods.length; i++) {
          if (this.card.goods[i].id == id)
            return this.card.goods[i].name;
        }
      },
      getGoodsNeed: function (type) {
        let name = { "z": "紫色", "b": "蓝色", "g": "绿色", "f": "粉色", "r": "橙色" };
        return name[type];
      },
      getBlinkFace: function (item) {
        for (let i = 0; i < card.used.length; i++) {
          if (card.used[i].id == item.id) {
            return "res/Goods/2/" + item.id + ".jpg";
          }
        }
        return "res/Goods/2/0.png";
      },
      onAddMagicLog: function (magic) {
        var that = this;
        $.ajax({
          cache: false,
          async: false,
          type: "POST",
          url: '/act/h5/magic/getInitData.ashx',
          data: {
            "type": "onAddMagicLog",
            "unionid": userInfo.unionid,
            "magic": magic
          },
          success: function (response) {
            var json = JSON.parse(response);
            if (!json.success) {
              that.alertContent = json.res;
            }
            else {
              if (magic == "s") {
                that.hasShare = true;
                that.hp++;
              }
            }
          }
        });
      },
      onCollectCard: function () {
        this.pack = 1;
        this.pack_menu = 1;
        this.active = "pack";
      },
      onExchangeGoods: function (index,elindex) {
        var that = this;
        if (card.goods[index].id > 200) {
          let wallindex = [];
          card.goods.forEach((item, index) => {
            if (item.id > 200)
              wallindex.push(index);
          });
          wallindex.sort(() => Math.random() - 0.5);
          index = wallindex[0];
        }
        var item = card.goods[index];
        var code = new Date().getTime();
        if (card.collect[item.uset] < item.usec) {
          this.alertContent = `您的碎片不足<br/>需要:${GameManager.name[item.uset]}碎片 X ${item.usec}`;
        }
        else {
          var walled = false;
          if (item.id > 100) {
            for (let i = 0; i < card.used.length; i++) {
              if (card.used[i].id == item.id) {
                walled = true;
                if (item.id < 200) {
                  this.wallpaper = `${item.id > 200 ? 3 : 2}/${item.id}_${card.used[i].code}.jpg`;
                  return;
                }
                break;
                // let name = item.id > 200 ? "壁纸" : "头像";
                // this.alertContent = `你已经兑换过此${name}<br/>是否前往查看?`;
                // this.alertCallBack = () => {
                //   this.alertContent = "";
                //   this.alertCallBack = "";
                //   this.pack = 1,
                //     this.pack_menu = 2;
                // }
              }
            }
          }
          this.alertContent = `本次${item.id > 200 ? '抽卡' : '兑换'}需要消耗:<br/>${GameManager.name[item.uset]}碎片 X ${item.usec}`;
          this.alertCallBack = () => {
            that.alertContent = "";
            that.alertCallBack = "";
            $.ajax({
              cache: false,
              async: false,
              type: "POST",
              url: '/act/h5/magic/getInitData.ashx',
              data: {
                "type": "onExchangeGoods",
                "unionid": userInfo.unionid,
                "goods_id": item.id,
                "goods_uset": item.uset,
                "code": code
              },
              success: function (response) {
                var json = JSON.parse(response);
                if (json.success) {
                  let used = { id: item.id, code: code };
                  card.collect[item.uset] -= item.usec * 1;
                  item.uset < 100 ? used.state = 0 : used.code = json.code;
                  walled ? null : card.used.unshift(used);
                  if (item.id > 100) {
                    that.waiting=true;
                    $("#pack_item_"+elindex).addClass(item.id > 200 ? "up" : "scale");
                    setTimeout(function(){
                      that.waiting=false;
                      $("#pack_item_"+elindex).removeClass(item.id > 200 ? "up" : "scale");
                      that.wallpaper = `${item.id > 200 ? 3 : 2}/${item.id}_${json.code}.jpg`;
                    },500)
                  }
                  else {
                    that.alertCallBack = () => {
                      that.alertContent = "";
                      that.alertCallBack = "";
                      that.pack = 1;
                      that.pack_menu = 2;
                    }
                    that.alertContent = json.res;
                  }
                }
              }
            });
          }
        }
      },
      onUseGoods: function (index) {
        let item = card.used[index];
        if (item.id < 100) {
          if (item.state == 1) {
            this.alertContent = "收货信息已填写<br/>预计4月2号发货<br/>请耐心等待收货哦！";
          }
          else {
            this.award = index;
          }
        }
        else {
          this.wallpaper = `${item.id > 200 ? '3' : '2'}/${item.id}_${item.code}.jpg`;
        }
      },
      onAwardPost: function (info) {
        var that = this;
        var item = card.used[that.award];
        $.ajax({
          cache: false,
          async: false,
          type: "POST",
          url: '/act/h5/magic/getInitData.ashx',
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
      onCloseWallpaper: function (e) {
        if (e.target.id == "dialogs_wallpaper") {
          this.wallpaper = "";
        }
      },
      onPlayMusic: function () {
        winSize.setEffectsVolume(this.music ? 0 : 1);
        this.music = !this.music;
      }
    },
    mounted: function () {
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
        document.getElementById("all").addEventListener("touchmove", function (event) {
          if (this.active != "pack")
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
        // wx.miniProgram.navigateTo({
        //   url: "/pages/index/game/game?url=magic"
        // });
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