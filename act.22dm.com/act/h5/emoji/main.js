var act_id = 52;
var v_main = null,canvas_scene = null;
var weixinData = {
  shareTitle: '谁才是你的Mr.right?',
  shareDesc: '想知道国民夫妇是怎样的吗？马上进行甜蜜大考验，看看谁才是你的MR.right？ 快来测测吧~',
  shareLink: 'https://cpeact.gdalpha.com/act/h5/emoji/index.html',
  shareImg: 'https://cpeact.gdalpha.com/act/h5/emoji/res/icon.jpg',
  emojiLink: 'https://w.url.cn/s/A2SMulZ#wechat_redirect'
};
var topic = [
  [
    {
      img: 1,
      title: '看我的新发明!',
      addtime: '8分钟前',
      comm: ['A. 灰太狼你好厉害呀！', 'B. 这发明看起来好帅~', 'C. 这破发明能有什么用！？'],
      score : [2,7,0],
    },
    {
      img: 2,
      title: '三菜一汤哟!',
      addtime: '52分钟前',
      comm: ['A. 灰太狼你好会做饭呀！', 'B. 刚刚尝了几口，真的太好吃了~', 'C. 看起来还没我的蛋炒饭好吃呢'],
      score : [7,2,0]
    }
  ],
  [
    {
      img: 1,
      title: '新的一天，新的自己!',
      addtime: '3分钟前',
      comm: ['A. 老婆你的背景真漂亮！~', 'B. 这美女是谁？我怎么有心动的感觉！', 'C. 我老婆果然是世界上最美丽的女人'],
      score : [0,7,2]
    },
    {
      img: 2,
      title: '谁想要吃蛋炒饭鸭？',
      addtime: '26分钟前',
      comm: ['A. 真的太太太好吃了！我还想吃！', 'B. 真香嗷~', 'C. 这是什么生化武器？！'],
      score : [7,2,0]
    }
  ]
];
var msgword = [
  {
    title: ['红红，今天我为你准备了一个大惊喜', '你知道是什么吗？','9.gif'],
    emoji: ['我好期待你的七夕礼物呀', '我在这里等你来送惊喜噢~'],
    input: ['惊喜？…该不是惊吓吧？', '灰太狼到底准备了什么呢？', '不知道啊…那发个表情好了']
  },
  {
    title: ['14.gif','你记得今天是什么日子吗？', '你有没有为我准备什么啊？','你该不会是忘记吧！！！','？？？？'],
    emoji: ['当然记得呀，今天是七夕嘛', '我早就计划好啦','今晚我们一起去这里吧'],
    input: ['糟糕…今天是什么日子啊', '难道是红红的生日？...', '发个表情总不会错的']
  }
];
var winSize = {
  width: 640,
  height: 0,
  scaleY: 1,
  loadcount: 0,
  loadres: [],
  loadtag: "dialogs_preload",
  initmusic : false,
  playEffect : function(effect){
    cc.audioEngine.playEffect(res["audio_"+effect],false);
	},
	setEffectsVolume : function(volume){
    cc.audioEngine.setEffectsVolume(volume);
    volume == 1 ?document.getElementById('audio').play() :　document.getElementById('audio').pause();
	},
  resize: function resize() {
    let height = $(window).height();
    let scaleY = height > 1300 ? 1 : (height / 1300).toFixed(2);
    this.height = height;
    this.scaleY = scaleY;
    let preloadscale = scaleY * 0.85;
    $("#all").css({
      width: 640,
      height: height
    }).show();
    $("#canvas_layer").css({
      transform: `scale(${scaleY*0.9})`,
      webkitTransform: `scale(${scaleY*0.9})`
    });
    $(".preload_role_1,.preload_role_2").css({
      transform: `scale(${preloadscale})`,
      webkitTransform: `scale(${preloadscale})`
    })
    console.log(`width:${this.width},height:${this.height},scaleY:${this.scaleY}`);
  },
  loadResFinish: function () {
    cc.spriteFrameCache.addSpriteFrames(res.main_0_plist,res.main_0_png);
    cc.spriteFrameCache.addSpriteFrames(res.main_1_plist,res.main_1_png);
    v_main.onStart();
  }
};
function vueInit() {
  v_main = new Vue({
    el: '#all',
    data: {
      active: '',
      dialogs: 'loading',
      music : false,
      gender: 2,
      guide: 0,
      max_emoji: 5,
      heart_show: !true,
      heart: 80,
      score_like : 2,
      score_comm : 3,
      emojilist :[[1,2,4,9,3,6,8,11],[14,15,16,12,5,13,7,10]],

      topic: topic,
      topic_guide: -1,
      topic_more: false,
      topic_refuse: false,
      topic_1_like: false,
      topic_2_like: false,
      topic_1_open: true,
      topic_2_open: true,
      topic_1_comm: 0,
      topic_2_comm: 0,
      topic_msg: false,

      msgword: msgword,
      msg_guide: -1,
      msg_title: -1,
      msg_emoji: -1,
      msg_sende: [],
      input_more: true,
      input_allow: false,
      input_dialogs: 'emoji',
      input_word: -1,
      input_map: -1,

      share: false,
      fromShare: false
    },
    watch: {
      msg_sende: function (newValue, oldValue) {
        if (newValue.length >= this.max_emoji) {
          this.input_allow = false;
          this.msg_guide=-1;
          setTimeout(function () {
            this.msg_emoji = 0;
          }.bind(this), 800)
        }
        if(newValue.length>0 && this.msg_guide==1){
          this.msg_guide = 2;
        }
      },
      topic_1_comm : function(newValue, oldValue){
        if(newValue>0){
          if(oldValue!=0)
            this.heart -= this.topic[this.gender-1][0].score[oldValue-1]
          this.heart += this.topic[this.gender-1][0].score[newValue-1]
        }
      },
      topic_2_comm : function(newValue, oldValue){
        if(newValue>0){
          if(oldValue!=0)
            this.heart -= this.topic[this.gender-1][1].score[oldValue-1]
          this.heart += this.topic[this.gender-1][1].score[newValue-1]
        }
      }
    },
    methods: {
      onStart : function(){
        let g = getQueryString("g");
        let m = getQueryString("m");
        let h = getQueryString("h");
        if(g==null || m==null || h==null){
          v_main.active = '';
          v_main.dialogs = 'preload'; 
          this.$nextTick(() => {
            console.log("initmusic");
            if(!winSize.initmusic){
              document.getElementById("dialogs_preload").addEventListener("touchstart",function(e){
                winSize.playEffect('guide');
              });
              winSize.initmusic = true;
            }
          })
        }
        else{
          this.fromShare = true;
          this.gender = g;
          this.input_map = m;
          this.heart = h;
          this.create_ercode();
        }
        //this.onGender(1); //直接进入朋友圈
        //this.onJump('message'); //直接进入聊天页
        //this.create_ercode(); //直接生成海报图
      },
      onGender: function (gender) {
        setTimeout(function(){
          winSize.playEffect('gender'+gender);
        },80)
        this.gender = gender;
        this.topic_msg = false;
        this.topic_more = false;
        this.topic_refuse = false;
        this.topic_1_like = false;
        this.topic_2_like = false;
        this.topic_1_comm = false;
        this.topic_2_comm = false;
        this.topic_1_open = true;
        this.topic_2_open = true;
        this.heart = 80;

        this.msg_sende = [];
        this.msg_title = -1;
        this.msg_emoji = -1;
        this.msg_guide = -1;
        this.input_word = -1;
        this.input_map = -1;
        this.input_more = true;
        this.input_allow = false;
        this.input_dialogs = 'emoji';

        this.dialogs = '';
        this.active = 'friends';
        this.fromShare = false;
        if (this.topic_guide == -1) {
          this.dialogs = 'guide';
          this.topic_guide = 1;
        }
      },
      onCtorComm: function (rows) {
        this[`topic_${rows}_open`] = !this[`topic_${rows}_open`];
      },
      onCtorLike: function (rows) {
        this[`topic_${rows}_like`] = !this[`topic_${rows}_like`];
        this[`topic_${rows}_like`] ? this.heart += this.score_like : this.heart -= this.score_like ;
        this.checkTopicState();
      },
      onComment: function (rows, columns) {
        this[`topic_${rows}_comm`] = columns;
        this.checkTopicState();
      },
      showMoreTopic: function () {
        if (!this.topic_more && this.topic_1_like && this.topic_1_comm != 0) {
          this.topic_more = true;
        }
        else if (!this.topic_more) {
          this.topic_refuse = true;
        }
      },
      checkTopicState: function () {
        if (this.topic_refuse) {
          if (this.topic_1_comm != 0) {
            this.topic_refuse = false;
            this.topic_more = true;
          }
          return;
        }
        if (this.topic_1_comm != 0 && this.topic_2_comm != 0) {
          if(!this.topic_msg)
            winSize.playEffect('msgalert');
          this.topic_msg = true;
        }
        else if (this.topic_1_comm != 0) {
          this.topic_more = true;
        }
      },
      getLikeState: function (rows) {
        return this[`topic_${rows}_like`] ? '取消' : '赞';
      },
      getCommOpenState: function (rows) {
        return this[`topic_${rows}_open`];
      }, 
      getCommState: function (rows, comm_index) {
        return comm_index == this[`topic_${rows}_comm`] ? 'active' : '';
      },
      onNextMessage: function (from) {
        if(this.topic_msg)
        {
          //console.log(from);
          let m = this[`msg_${from}`];
          if (m < this.msgword[this.gender - 1][from].length - 1) {
            this[`msg_${from}`]++;
          }
          else if (from == "title") {
            setTimeout(function(){
              this.input_word = 0;
              winSize.playEffect('input');
            }.bind(this),1500)
          }
          else if (from == "emoji") {
            this.input_dialogs = 'map';
            setTimeout(function () {
              this.input_more = true;
              this.checkMessageOffsetY();
            }.bind(this), 1500)
          }
          this.checkMessageOffsetY();
          winSize.playEffect('msgsend');
        }
      },
      onNextInput: function () {
        this.checkMessageOffsetY();
        if (this.input_word < this.msgword[this.gender - 1].input.length - 1) {
          this.input_word++;
          winSize.playEffect('input');
        }
        else {
          this.input_more = true;
          this.msg_guide = 1;
          this.input_allow = true;
        }
      },
      onSendEmoji: function (index) {
        if (this.input_allow) {
          if (this.msg_sende.length < 20) {
            Vue.set(v_main, this.msg_sende, this.msg_sende.push(index));
            winSize.playEffect('msgsend');
          }
          else {
            console.log("表情包不是拿来刷屏的哦~");
          }
        }
      },
      checkMessageOffsetY: function () {
        let m = document.getElementById("message_main");
        if (m.scrollHeight > m.clientHeight) {
          m.scrollTop = m.scrollHeight - m.clientHeight;
        }
      },
      onMap: function () {
        v_main.create_ercode();
      },
      onJump: function (path) {
        this.dialogs = '';
        this.active = path;
        if (path == 'message') {
          if (this.msg_title == -1) {
            this.msg_title = 0;
          }
        }
      },
      create_ercode : function(){
        $("#qrcode").empty();
        let link = weixinData.shareLink+`?g=${this.gender}&m=${this.input_map}&h=${this.heart}`;
        new QRCode('qrcode', {
          text: link,
          width: 100,
          height: 100,
          colorDark : '#000000',
          colorLight : '#ffffff',
          correctLevel : QRCode.CorrectLevel.L
        });
        this.dialogs = '';
        this.active = 'canvas';
        cc.director.runScene(new GamePlayScene());
      },
      toDataUrl : function(){
        setTimeout(function(){
          let dataUrl = document.getElementById('gameCanvas').toDataURL(0,0,640,1300,"image/jpeg",1)
          document.getElementById('canvasUrlData').src = dataUrl;
          canvas_scene.removeFromParent();
        }.bind(this),100)
        this.dialogs = 'canvasUrlData';
        this.active = this.fromShare ? '' : 'message';
      },
      onPlayMusic : function(){
        winSize.setEffectsVolume(this.music?0:1);
        this.music = !this.music;
      }
    },
    created: function () {
      winSize.resize(); 
      var ua = navigator.userAgent.toLowerCase();//获取判断用的对象
      if (ua.match(/MicroMessenger/i) == "micromessenger")
        initWxJsSdk();  
      this.$nextTick(function () {
        cc.game.run();
        document.getElementById("friends").addEventListener("scroll", function (e) {
          if (e.target.scrollHeight - e.target.scrollTop == e.target.clientHeight) {
            this.showMoreTopic();
          }
          else {
            if (this.topic_refuse)
              this.topic_refuse = false;
          }
        }.bind(this));
        document.getElementById("dialogs_guide").addEventListener("touchstart",function(e){
          winSize.playEffect('guide');
        }.bind(this));
        document.getElementById("friends").addEventListener("touchstart",function(e){
          winSize.playEffect('guide');
        }.bind(this)); 
      })
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
    initWeixinData(false);
    document.getElementById('audio').play();
    var promise = document.querySelector('audio').play();
    if (promise !== undefined) {
      promise.then(function (_) {
        v_main.music = true;
      }).catch(function (error) {
        v_main.music = false;
      });
    }
  });
}
$(function () {
  if(!IsPC())
  { 
    vueInit();
  }
  else {
    if(getQueryString('debug')!=null){
      vueInit();
    }
    else{
      $("#ercode").show();
    }
  }
});
cc.game.onStart = function () {
  winSize.loadres = g_resources;
  winSize.loadcount = 0;
  loadGameResources();
};
function loadGameResources() {
  cc.loader.load(winSize.loadres[winSize.loadcount], function (err) {
    winSize.loadcount++;
    let precent = (winSize.loadcount / (winSize.loadres.length - 1)).toFixed(2);
    $(".precent_word").text("" + Math.ceil(precent * 100) + "%");
    if (winSize.loadcount >= winSize.loadres.length - 1) {
      winSize.loadResFinish();
    } else {
      loadGameResources();
    }
  })
}
function initWeixinData(hasCode) {
  let link = weixinData.shareLink;
  if (hasCode) {
    link += `?g=${v_main.gender}&m=${v_main.input_map}&h=${v_main.heart}`;
  }
  wx.onMenuShareTimeline({
    title: weixinData.shareDesc,
    link: link,
    imgUrl: weixinData.shareImg
  });
  wx.onMenuShareAppMessage({
    title: weixinData.shareTitle,
    desc: weixinData.shareDesc,
    link: link,
    imgUrl: weixinData.shareImg
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
function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return (r[2]); return null;
}
