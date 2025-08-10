// 在文件开头添加正态分布随机数生成函数
function normalRandom(mean, stdDev) {
  var u = 0,
    v = 0;
  while (u === 0) u = Math.random(); // 避免0
  while (v === 0) v = Math.random(); // 避免0
  var num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return num * stdDev + mean;
}
let level = new URL(location.href).searchParams.get("level") || 0.7;

var isPC = false,
  token,
  openid,
  debug = true,
  act_id = 34;
var v_dialogs,
  v_main,
  ws = null;
var dt = new Date().toLocaleDateString();
var weixinData = {
  init: false,
  loginUrl:
    "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb61fdb0e387cbcc4&redirect_uri=http%3a%2f%2fwww.22dm.com%2fact%2fh5%2fintellect%2findex.html&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect",
  shareTitle: "智趣大冲关",
  shareDesc:
    "上知天文，下知地理？那么运动知识熟悉吗？各国风土了解吗？秀出你的知识储备吧！",
  shareLink: "http://www.22dm.com/act/h5/intellect/index.html",
  shareImg: "http://www.22dm.com/act/h5/intellect/res/public/icon.jpg",
};

var winSize = {
  ws: "ws://183.6.131.90:8020//matching.ashx",
  ws_spring: "ws://spring.22dm.com:8020/act/h5/intellect/matching.ashx",
  srv: "http://www.22dm.com",
  width: 750,
  height: 1182,
  audioVolume: 1,
  SubjectList: [],
  tvId: 5,
  videoList: null,
  GameTime: 10,
  shareTimeLimit: 2, //有效期2分钟
};
var userInfo = {
  openid: "oTaiPuEUqBR9FQRGw5hvR0oyOAWo",
  balllterid: null,
  name: "玩家1",
  face: "res/public/icon.jpg",
  sex: "1",
  country: "GuangZhou",
  province: "GuangDong",
  solo: 0,
  battle: 0,
  day_solo: 0,
  day_battle: 0,
  json: {},
  rankingList: null,
};
$(function () {
  isPC = IsPC();
  var height = $(window).height() > 1350 ? 1350 : $(window).height();
  var width = $(window).width();
  if (height > winSize.height) {
    $("#all").css({
      top: (height - winSize.height) >> 1,
    });
  }
  if (width > winSize.width) {
    $("#all").css({
      left: (width - winSize.width) >> 1,
    });
  }
  GameLogin();
});
function VueInit() {
  v_dialogs = new Vue({
    el: "#dialogs",
    data: {
      active: "",
      tips: "",
      socket: "",
      user: {
        face: "res/public/icon.jpg",
        name: "玩家1",
        solo: 500,
        battle: 1500,
      },
      tipsBtn: [],
      tipsCallBack: "",
      ercode: false,
      ranking: [],
      rankingIsSelected: [0],
      posterActive: false,
      posterIsSelected: [1, 2],
      posterLimit: 1,
    },
    computed: {
      posterCanSelected: function () {
        return this.posterIsSelected.length > this.posterLimit;
      },
    },
    methods: {
      posterSelect: function (n) {
        if (typeof n == "string") {
          //全选
          this.posterIsSelected = [1, 2, 3, 4, 5, 6];
        } else {
          var i = this.posterIsSelected.indexOf(n);
          if (i > -1) {
            //存在 删除
            if (this.posterCanSelected) {
              this.posterIsSelected.splice(i, 1);
            } else {
              intellect.tips(
                "最少选" + this.posterLimit + "个",
                ["sure"],
                "normal"
              );
            }
          } else {
            //增加
            this.posterIsSelected.push(n);
          }
        }
      },
      rankingSelect: function (n) {
        if (this.rankingIsSelected.indexOf(n) == -1) {
          this.rankingIsSelected = [n];
          this.ranking =
            n == 0 ? userInfo.rankingList.solo : userInfo.rankingList.battle;
        }
      },
      getRankingTitle: function (score) {
        if (score > 10000) return 3;
        else if (score > 5000) return 2;
        else if (score > 800) return 1;
        else return 0;
      },
      sure: function () {
        switch (this.tipsCallBack) {
          case "select":
            this.active = "select";
            break;
          case "waiting":
            if (ws == null) {
              intellect.tips("服务器连接中,请稍后..", ["back"], "refresh");
            } else v_dialogs.active = "waiting";
            var sharelink =
              winSize.srv +
              "/act/h5/intellect/index.html" +
              "?battle=" +
              userInfo.openid +
              "&timespan=" +
              new Date().getTime();
            changeWxJsSdk(
              sharelink,
              "我是" +
                userInfo.name +
                "，我正在智趣大冲关一往无前，敢来和我PK吗？"
            );
            intellect.ercode(sharelink);
            socket.init(userInfo.openid);
            break;
          case "waiting_back":
            this.active = "";
            break;
          case "scoket_check":
            $("#btn_index").click();
            break;
        }
        this.tips = "";
        return true;
      },
      cancel: function () {
        if (this.tipsCallBack != "refresh") this.tips = "";
        return false;
      },
      back: function () {
        if (this.tipsCallBack == "refresh")
          location.href = weixinData.shareLink;
        this.tips = "";
      },
    },
  });
  v_main = new Vue({
    el: "#main",
    data: {
      active: "",
      subject: [],
      isbattle: false,
      isGameOver: false,
      isWinner: false,
      user_one: {
        next: false, //下一题
        face: "res/Public/icon.jpg",
        name: "",
        combo: [],
        gold: 0, //当前获得的金币
      },
      user_two: {
        openid: "",
        next: false, //下一题
        face: "res/public/icon.jpg",
        name: "玩家2",
        combo: [],
        gold: 0, //当前获得的金币
      },
    },
    computed: {
      combomax_one: function () {
        var n = 0;
        var max = 0;
        for (var i = 0; i < this.user_one.combo.length; i++) {
          if (i == 1) {
            n++;
            if (n > max) {
              max = n;
            }
          } else {
            n = 0;
          }
        }
        return max;
      },
      combomax_two: function () {
        var n = 0;
        var max = 0;
        for (var i = 0; i < this.user_one.combo.length; i++) {
          if (i == 1) {
            n++;
            if (n > max) {
              max = n;
            }
          } else {
            n = 0;
          }
        }
        return max;
      },
    },
    methods: {
      titleclass: function (n) {
        var line = Math.ceil(n / 11);
        return "line_" + (line > 3 ? 3 : line);
      },
      lineclass: function (n) {
        var line = Math.ceil(n / 12);
        return "line_" + (line > 3 ? 3 : line);
      },
    },
    watch: {
      subject: function () {
        $("#qs_list").children().attr("class", "");
      },
      "user_one.next": {
        deep: true,
        handler: function (res) {
          if (this.isbattle && this.user_one.next && this.user_two.next) {
            intellect.next();
          }
          if (!this.isbattle && this.user_one.next) {
            intellect.next();
          }
        },
      },
      "user_two.next": {
        deep: true,
        handler: function (res) {
          if (this.user_one.next && this.user_two.next) {
            intellect.next();
          }
        },
      },
      "user_one.gold": {
        deep: true,
        handler: function (res) {
          if (this.user_one.gold != 0) {
            var score = $("#score_solo_box .score_text");
            var mover = $("#score_solo_box .score_inner");
            score.stop().hide().fadeIn();
            mover
              .stop()
              .animate({ top: 85 - (this.user_one.gold / 150) * 85 + "%" });
          }
        },
      },
      "user_two.gold": {
        deep: true,
        handler: function (res) {
          if (this.user_two.gold != 0) {
            var score = $("#score_battle_box .score_text");
            var mover = $("#score_battle_box .score_inner");
            score.stop().hide().fadeIn();
            mover
              .stop()
              .animate({ top: 85 - (this.user_two.gold / 150) * 85 + "%" });
          }
        },
      },
    },
  });
  $("#all").show();
  cc.game.run(); //画面绘制
  intellect.init(); //获取用户数据
  registerEvent(); //
}
var socket = {
  await: null,
  init: function (openid) {
    if (ws == null) {
      // 创建模拟WebSocket对象
      ws = {
        readyState: 1, // OPEN状态
        onopen: null,
        onmessage: function (evt) {
          console.info(evt.data);
          if (evt.data != "") intellect.receive(JSON.parse(evt.data));
        },
        onerror: null,
        onclose: null,
        send: function (data) {
          console.log("模拟发送: " + data);
        },
        close: function () {},
      };

      // 模拟连接成功
      setTimeout(function () {
        console.info("模拟socket onopen:" + openid);
        if (ws.onopen) ws.onopen();

        if (userInfo.balllterid != null) {
          // 挑战者流程
          // 挑战者发送用户信息
          var json =
            '{"active":"userinfo","userinfo":{"openid":"' +
            userInfo.openid +
            '","face":"' +
            userInfo.face +
            '","name":"' +
            userInfo.name +
            '"}}';
          socket.send(json);

          // 一段时间后模拟收到被挑战者的响应
          setTimeout(function () {
            // 生成题目ID
            var subjectIds = intellect.getSubject(false);

            // 构造模拟对手信息
            var opponentData = {
              active: "userinfo",
              userinfo: {
                openid: "simulated_opponent",
                face: "res/public/icon.jpg",
                name: "模拟对手",
                subject: subjectIds,
              },
            };

            // 触发onmessage事件 - 接收对手信息
            if (ws.onmessage) {
              ws.onmessage({ data: JSON.stringify(opponentData) });
            }

            // 再模拟收到readygo消息 - 开始游戏
            setTimeout(function () {
              var readyData = {
                active: "readygo",
                userinfo: {
                  openid: "simulated_opponent",
                },
              };

              if (ws.onmessage) {
                ws.onmessage({ data: JSON.stringify(readyData) });
              }
            }, Math.random() * 2000 + 500);
          }, Math.random() * 2000 + 500);
        } else {
          // 被挑战者流程
          v_dialogs.tips = "";
          v_dialogs.active = "waiting";

          // 一段时间后模拟收到挑战者信息并自动开始游戏
          setTimeout(function () {
            // 生成题目ID
            var subjectIds = intellect.getSubject(false);

            // 构造模拟对手信息
            var opponentData = {
              active: "userinfo",
              userinfo: {
                openid: "simulated_opponent",
                face: "res/public/icon.jpg",
                name: "模拟对手",
                subject: subjectIds,
              },
            };

            // 触发onmessage事件 - 接收对手信息
            if (ws.onmessage) {
              ws.onmessage({ data: JSON.stringify(opponentData) });
            }

            // 模拟发送readygo消息 - 开始游戏
            setTimeout(function () {
              var json =
                '{"active":"readygo","userinfo":{"openid":"' +
                userInfo.openid +
                '"}}';
              socket.send(json);

              // 开始游戏
              setTimeout(function () {
                intellect.start(true);
              }, Math.random() * 2000 + 500);
            }, Math.random() * 2000 + 500);
          }, Math.random() * 2000 + 500);
        }
      }, Math.random() * 2000 + 500);
    }
  },
  send: function (json) {},
  check: function () {
    if (!v_main.user_one.next) {
      //我没有作答
      if (ws.readyState == WebSocket.OPEN) {
        var json =
          '{"active":"playing","userinfo":{"openid":"' +
          userInfo.openid +
          '","score":0,"subjectindex":' +
          (10 - winSize.SubjectList.length) +
          "}}";
        socket.send(json);
        console.info(json);
        intellect.next();
      }
    } else {
      socket.await = setTimeout(function () {
        intellect.tips(
          "对不起，您的好友已断开或网络不佳，本次对战将取消！",
          ["sure"],
          "scoket_check"
        );
      }, 8000);
    }
  },
  onclose: function () {
    // if(v_main.active=="playing"){
    // 	var back = intellect.tips("你确定要离开游戏吗?",['sure','cancel','onclose']);
    // 	if(back){
    // 		if(ws.readyState == WebSocket.OPEN){
    // 			var json = '{"active":"socket","on":"onclose"}';
    // 			socket.send(json);
    // 			ws.close();
    // 		}
    // 	}
    // 	return back;
    // }
    // return true;
  },
};
var intellect = {
  init: function () {
    let res = {
      hasuser: true,
      solo: 330,
      battle: 0,
      json: {
        name: "小康",
        img: "http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLZoI5olaqlJDJ5mXIffzRLJEkftNaAjE4fGMKETajILzgrQTHFqldCAPaBJDAt5jN4Vb31wW6PpA/132",
        sex: "1",
        country: "中国",
        province: "",
        day_solo: 30,
        solo_time: "2018/3/24",
        day_battle: 0,
        battle_time: "2018/3/24",
      },
      ranking: {
        solo: [
          {
            user: "oTaiPuCmkHCuRoKpIXGuqTEM-lI4",
            score: 43290,
            json: {
              name: "沧山月海",
              img: "https://thirdwx.qlogo.cn/mmopen/vi_32/3HYLHV93PJhJo4TQUglMdGiaeibSVaYMw2MUrsxJiaKtBNRicX1vISCKicJnb9g8w9ia4a8MXef0H1PeTgghiaLENz0ow/132",
              sex: "1",
              country: "中国",
              province: "江苏",
              day_solo: 90,
              solo_time: "2021/1/1",
              day_battle: 0,
              battle_time: "2021/1/1",
            },
          },
          {
            user: "oTaiPuK9efbPXEDaezQE8H6QsFRo",
            score: 18100,
            json: {
              name: "0803羊村守护者喜羊羊",
              img: "http://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqPSDAaVSJibHt7x4cPuMtyOZ3MlTAwGSFmRmSqicqXRRku90jibLQrbghsuyFyg2ic0m91xxlDSJ2TPw/132",
              sex: "0",
              country: "",
              province: "",
              day_solo: 100,
              solo_time: "2018/9/3",
              day_battle: 0,
              battle_time: "2018/9/3",
            },
          },
          {
            user: "oTaiPuKkYO2uED10GQyGw9-64KEI",
            score: 15100,
            json: {
              name: "疯狂帝国",
              img: "http://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83ep8O159MOZpZBb4MHTAuWJkwPkR5xHg7Tom2kicdZezEKCqDiblGmAQPKA6HZD4j149onibN4CxMicGuA/132",
              sex: "1",
              country: "",
              province: "",
              day_solo: 100,
              solo_time: "2018/8/30",
              day_battle: 0,
              battle_time: "2018/8/30",
            },
          },
          {
            user: "oTaiPuEIIOFSKKm83r2bRlx137_U",
            score: 4000,
            json: {
              name: "0803",
              img: "http://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83eoCcXYGv7zMT9MY108WC5DjcDsj0U1icicqIlzPLhSkDibLmD2xB5YljljRelR4MMic1msbQ0FQN3ZwnQ/132",
              sex: "2",
              country: "中国",
              province: "山东",
              day_solo: 100,
              solo_time: "2019/3/31",
              day_battle: 0,
              battle_time: "2019/3/31",
            },
          },
          {
            user: "oTaiPuPFpvuNiOCXZTCjA2jExn3E",
            score: 3800,
            json: {
              name: "植物大战僵尸英雄",
              img: "http://thirdwx.qlogo.cn/mmopen/vi_32/GmtqEx7x5hZaLfNC7Hvhicoc6byfnxebGut6xYePJ9zjeVS8oASGbaylW9ibL7or7vygPFNQIQuzsTwiaBoKBwricw/132",
              sex: "0",
              country: "",
              province: "",
              day_solo: 0,
              solo_time: "2018/6/21",
              day_battle: 500,
              battle_time: "2018/6/21",
            },
          },
          {
            user: "oTaiPuOM2el9uYBU-ljmoEOlBQqk",
            score: 2680,
            json: {
              name: "喜羊羊",
              img: "http://thirdwx.qlogo.cn/mmopen/vi_32/dN0Aic5zJhAu2KVfhoTax7yD6A80XuEnNV2M8JBuPpAE6v79TwZFYH31g3M6JO9ibatiapnBoGET7sEKaRu09icgMQ/132",
              sex: "1",
              country: "中国",
              province: "辽宁",
              day_solo: 100,
              solo_time: "2018/8/8",
              day_battle: 0,
              battle_time: "2018/8/8",
            },
          },
          {
            user: "oTaiPuJOvHKMYM2Ibd6dQNtruF04",
            score: 2220,
            json: {
              name: "春天",
              img: "http://thirdwx.qlogo.cn/mmopen/vi_32/vjBI6U2f8xibkz95HHGCfvUnLoDJOichU9FE9qLdiciaPmYrg1x72MBic6Oz1lP3k8V0icOXC0dibbWjgV0XiaplYHCSIw/132",
              sex: "2",
              country: "中国",
              province: "广东",
              day_solo: 100,
              solo_time: "2019/1/27",
              day_battle: 0,
              battle_time: "2019/1/27",
            },
          },
          {
            user: "oTaiPuM6WIjvAZMeTaZJggVclgDw",
            score: 2200,
            json: {
              name: "我爱羊羊",
              img: "http://thirdwx.qlogo.cn/mmopen/vi_32/2J73AoxZ7EFuWGehl1a2xaeQkVylvKnkibJD6YMOAm9S1OnhvAzCwcowBFibTV85eVm1Mn2KJ3rWNmN1wVesriaRA/132",
              sex: "1",
              country: "中国",
              province: "山东",
              day_solo: 100,
              solo_time: "2018/3/10",
              day_battle: 0,
              battle_time: "2018/3/10",
            },
          },
          {
            user: "oTaiPuISvIMS-thzQCunL9mCuc4M",
            score: 1890,
            json: {
              name: "Weslie0803",
              img: "http://thirdwx.qlogo.cn/mmopen/vi_32/CrIUSd73wOjkLdVSaBMZeZTN3aXM48cJU4PnllTxY2u9O585JOUbLVZgticyDPzfVRDVVeuXH7DLEzWiaOydYOPg/132",
              sex: "2",
              country: "中国",
              province: "湖北",
              day_solo: 0,
              solo_time: "2018/6/18",
              day_battle: 500,
              battle_time: "2018/6/18",
            },
          },
          {
            user: "oTaiPuJYKEeZh8pPznfOEFhA5GfM",
            score: 1865,
            json: {
              name: "羊羊乐儿",
              img: "http://thirdwx.qlogo.cn/mmopen/vi_32/CDdMOiayCMfL84tc6xMdMnZ2lPHXjhdghciaCTiaP32d8bgbmsTqmXrkIAMWRSCXwvS0e9fPiaJHBArBN9UjHsibS6g/132",
              sex: "1",
              country: "中国",
              province: "湖北",
              day_solo: 100,
              solo_time: "2018/6/18",
              day_battle: 500,
              battle_time: "2018/6/18",
            },
          },
        ],
        battle: [
          {
            user: "oTaiPuISvIMS-thzQCunL9mCuc4M",
            score: 11180,
            json: {
              name: "Weslie0803",
              img: "http://thirdwx.qlogo.cn/mmopen/vi_32/CrIUSd73wOjkLdVSaBMZeZTN3aXM48cJU4PnllTxY2u9O585JOUbLVZgticyDPzfVRDVVeuXH7DLEzWiaOydYOPg/132",
              sex: "2",
              country: "中国",
              province: "湖北",
              day_solo: 0,
              solo_time: "2018/6/18",
              day_battle: 500,
              battle_time: "2018/6/18",
            },
          },
          {
            user: "oTaiPuJYKEeZh8pPznfOEFhA5GfM",
            score: 8565,
            json: {
              name: "羊羊乐儿",
              img: "http://thirdwx.qlogo.cn/mmopen/vi_32/CDdMOiayCMfL84tc6xMdMnZ2lPHXjhdghciaCTiaP32d8bgbmsTqmXrkIAMWRSCXwvS0e9fPiaJHBArBN9UjHsibS6g/132",
              sex: "1",
              country: "中国",
              province: "湖北",
              day_solo: 100,
              solo_time: "2018/6/18",
              day_battle: 500,
              battle_time: "2018/6/18",
            },
          },
          {
            user: "oTaiPuESctcYvITr236CmHK0TVBU",
            score: 1500,
            json: {
              name: "在风雨中",
              img: "http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKEicNyyxWyRjKOldNe5rSLqRnoQ5lQqCgUVNbXwicKicYyWZkSH4H7wQm6bIn6piaoUTEcjEn0Viaibp2Q/132",
              sex: "2",
              country: "中国",
              province: "湖北",
              day_solo: 100,
              solo_time: "2018/2/22",
              day_battle: 0,
              battle_time: "2018/2/22",
            },
          },
          {
            user: "oTaiPuM6WIjvAZMeTaZJggVclgDw",
            score: 1290,
            json: {
              name: "我爱羊羊",
              img: "http://thirdwx.qlogo.cn/mmopen/vi_32/2J73AoxZ7EFuWGehl1a2xaeQkVylvKnkibJD6YMOAm9S1OnhvAzCwcowBFibTV85eVm1Mn2KJ3rWNmN1wVesriaRA/132",
              sex: "1",
              country: "中国",
              province: "山东",
              day_solo: 100,
              solo_time: "2018/3/10",
              day_battle: 0,
              battle_time: "2018/3/10",
            },
          },
          {
            user: "oTaiPuPFpvuNiOCXZTCjA2jExn3E",
            score: 1000,
            json: {
              name: "植物大战僵尸英雄",
              img: "http://thirdwx.qlogo.cn/mmopen/vi_32/GmtqEx7x5hZaLfNC7Hvhicoc6byfnxebGut6xYePJ9zjeVS8oASGbaylW9ibL7or7vygPFNQIQuzsTwiaBoKBwricw/132",
              sex: "0",
              country: "",
              province: "",
              day_solo: 0,
              solo_time: "2018/6/21",
              day_battle: 500,
              battle_time: "2018/6/21",
            },
          },
          {
            user: "oTaiPuELvQ1y3tpmRobfwWidpY0A",
            score: 500,
            json: {
              name: "Fenys",
              img: "http://thirdwx.qlogo.cn/mmopen/vi_32/xZ1PYrX1IZ0gLQibJ6J1TXia9tvj6B3Nn6G4CyEZYfhxDfLyK0eECLtFb6lqEHVNWY2qtOTbOfpWghpqGrf405NQ/132",
              sex: "1",
              country: "中国",
              province: "上海",
              day_solo: 100,
              solo_time: "2018/6/21",
              day_battle: 500,
              battle_time: "2018/6/21",
            },
          },
          {
            user: "oTaiPuNWXwi6YpgVA9WvFVN6SXFA",
            score: 500,
            json: {
              name: "张大珍",
              img: "http://thirdwx.qlogo.cn/mmopen/vi_32/YwUiaChQk5kMicTvnHkNErzcKpP36eFFZ6TGiaVJQk7cibBg4oneYyejLEiaxCLoWeFDFMdO5ZuLJjvRWNRUugMAVow/132",
              sex: "0",
              country: "",
              province: "",
              day_solo: 100,
              solo_time: "2018/2/14",
              day_battle: 500,
              battle_time: "2018/2/14",
            },
          },
          {
            user: "oTaiPuEUqBR9FQRGw5hvR0oyOAWo",
            score: 500,
            json: {
              name: "lllzc",
              img: "http://thirdwx.qlogo.cn/mmopen/vi_32/wpMrYfXQAg7ibgJZ8zHSS5FetEzic3zZaWPEKd7CKofzcbqnxX7lLV3sf2K2BPblJSJFCaHL5k5bkH16FuCejwVQ/132",
              sex: "1",
              country: "中国",
              province: "广东",
              day_solo: 60,
              solo_time: "2018/3/3",
              day_battle: 0,
              battle_time: "2018/3/3",
            },
          },
          {
            user: "oTaiPuM9fd0kVDrnem9ql580GgnI",
            score: 500,
            json: {
              name: "长风破浪会有时",
              img: "http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJnfLTEOt9lGH4NecBNtcRoslFWyuHcGFAjgKWiciaVticJQ6mrJTbs7nWLgXKABasvExnSdcRldpeIQ/132",
              sex: "1",
              country: "中国",
              province: "河南",
              day_solo: 0,
              solo_time: "2018/3/2",
              day_battle: 500,
              battle_time: "2018/3/2",
            },
          },
          {
            user: "oTaiPuE1V5dwrG3aGunFTQpWtU9w",
            score: 500,
            json: {
              name: "渝小磊磊",
              img: "http://thirdwx.qlogo.cn/mmopen/vi_32/dmr1XEMJicUGFK5166kCRcHxNia4ibGPicgUY1HECYibQhnrdjXo87swtyMamsBJodsEebqMltZuANIPgMArQuoyGSQ/132",
              sex: "1",
              country: "中国",
              province: "重庆",
              day_solo: 100,
              solo_time: "2018/2/14",
              day_battle: 500,
              battle_time: "2018/2/14",
            },
          },
        ],
      },
      usetime: "00:00:00.1406080",
    };

    if (res.hasuser) {
      if (Date.parse(dt) > Date.parse(res.json.solo_time))
        res.json.day_solo = 0;
      if (Date.parse(dt) > Date.parse(res.json.battle_time))
        res.json.day_battle = 0;
      userInfo.solo = res.solo;
      userInfo.battle = res.battle;
      userInfo.day_solo = res.json.day_solo;
      userInfo.day_battle = res.json.day_battle;
      userInfo.json = res.json;
    }
    userInfo.rankingList = res.ranking;
    v_main.user_one.face = userInfo.face;
    v_main.user_one.name = userInfo.name;
    v_dialogs.ranking = res.ranking.solo;
    v_dialogs.user.face = userInfo.face;
    v_dialogs.user.name = userInfo.name;
    v_dialogs.user.solo = userInfo.solo;
    v_dialogs.user.battle = userInfo.battle;
  },
  receive: function (json) {
    if (json.active == "userinfo") {
      //收到用户信息 匹配成功!
      var returnJson = "";
      v_main.user_two.openid = json.userinfo.openid;
      v_main.user_two.face = json.userinfo.face;
      v_main.user_two.name = json.userinfo.name;
      if (userInfo.balllterid != null) {
        //我是挑战者 需要接收题目
        GameManager.reset();
        var target = json.userinfo.subject;
        for (var i = 0; i < target.length; i++) {
          winSize.SubjectList.push(qs.slice(target[i], target[i] + 1)[0]);
        }
        //发送readygo玩家1 并且自己开始游戏
        returnJson =
          '{"active":"readygo","userinfo":{"openid":"' +
          userInfo.openid +
          '"}}';
        v_dialogs.tips = "";
        intellect.start(true);
      } else {
        if (json.userinfo.openid == v_main.user_two.openid) {
          //是挑战者
          //返回我的信息给挑战者 还有题目
          //console.info(v_dialogs.active=='waiting');
          if (v_dialogs.active == "waiting") {
            var subject = intellect.getSubject(false).toString();
            returnJson =
              '{"active":"userinfo","userinfo":{"openid":"' +
              userInfo.openid +
              '","face":"' +
              userInfo.face +
              '","name":"' +
              userInfo.name +
              '","subject":[' +
              subject +
              "]}}";
          } else {
            returnJson = '{"active":"socket","on":"lose"}';
          }
        }
      }
      socket.send(returnJson);
    } else if (json.active == "readygo") {
      //玩家1开始对战
      // if (json.userinfo.openid == v_main.user_two.openid) {
      //   intellect.start(true);
      // }
    } else if (json.active == "playing") {
      //收到的信息来自对战者答案
      if (json.userinfo.openid == v_main.user_two.openid) {
        if (v_main.active == "playing") {
          //确认我在答题状态中
          if (json.userinfo.score > 0) {
            //挑战者答对了
            if (!v_main.user_one.next)
              v_main.user_two.gold += json.userinfo.score + 5;
            else v_main.user_two.gold += json.userinfo.score;
            v_main.user_two.combo.push(1);
          } else {
            v_main.user_two.combo.push(0);
          }
          v_main.user_two.next = true;
        } else {
          //干扰
          socket.send('{"active":"socket","on":"lose"}');
        }
      }
    } else if (json.active == "socket") {
      if (json.on == "lose")
        intellect.tips("对不起，您的好友已断开连接！", ["back"], "refresh");
    }
    if (json.active == "userinfo") {
      // 如果是模拟对手信息，设置对手信息
      v_main.user_two.openid = json.userinfo.openid;
      v_main.user_two.face = json.userinfo.face || "res/Public/icon.jpg";
      v_main.user_two.name = json.userinfo.name || "模拟对手";
    }
  },
  btn_select: function () {
    // if(userInfo.day_solo>=100)
    // 	intellect.tips('您今天在单人游戏中已获满100枚金币,继续答题将不再获得金币!',['sure','cancel'],'select');
    // else
    v_dialogs.active = "select";
  },
  btn_waiting: function () {
    if (userInfo.day_battle >= 500)
      intellect.tips(
        "您今天在好友对战中已获满500枚金币,继续答题将不再获得金币!",
        ["sure", "cancel"],
        "waiting"
      );
    else {
      //userInfo.balllterid = null;
      if (ws == null) {
        intellect.tips("服务器连接中,请稍后..", ["back"], "refresh");
      } else v_dialogs.active = "waiting";
      var sharelink =
        winSize.srv +
        "/act/h5/intellect/index.html" +
        "?battle=" +
        userInfo.openid +
        "&timespan=" +
        new Date().getTime();
      changeWxJsSdk(
        sharelink,
        "我是" + userInfo.name + "，我正在智趣大冲关一往无前，敢来和我PK吗？"
      );
      intellect.ercode(sharelink);
      socket.init(userInfo.openid);
    }
  },
  start: function (isbattle) {
    v_main.isbattle = isbattle;
    if (!isbattle) {
      GameManager.reset();
      intellect.getSubject(true);
    }
    v_main.subject = winSize.SubjectList;
    v_dialogs.active = "";
    v_main.active = "playing";
    cc.director.runScene(new GamePlayScene());

    // +++ 在游戏开始时触发模拟对手答题 +++
    if (isbattle) {
      // 初始化对手状态
      v_main.user_two.next = false;

      // 开始第一题的模拟对手答题
      intellect.simulateOpponentAnswer();
    }
  },
  select: function (i) {
    if (GameManager.touch) {
      if (winSize.SubjectList.length != 0) {
        var score = 0;
        var r = $("#qs_box").attr("item_r") * 1;
        var target = $("#qs_list")
          .children()
          .eq(i - 1);
        if (
          !target.hasClass("selected") &&
          !target.siblings().hasClass("selected")
        ) {
          var tmp = "selected ";
          if (i == winSize.SubjectList[0].r) {
            //答对了
            score = 10;
            tmp += "success";
            v_main.user_one.gold += score;
            v_main.user_one.combo.push(1);
            if (!v_main.user_two.next) v_main.user_one.gold += 5;
            cc.audioEngine.playEffect(res.audio_success, false);
          } else {
            tmp += "error";
            v_main.user_one.combo.push(0);
            cc.audioEngine.playEffect(res.audio_lose, false);
          }
          target.addClass(tmp);
        } else return false;
        v_main.user_one.next = true;
        if (v_main.isbattle) {
          var json =
            '{"active":"playing","userinfo":{"openid":"' +
            userInfo.openid +
            '","score":' +
            score +
            ',"subjectindex":' +
            (10 - winSize.SubjectList.length) +
            "}}";
          socket.send(json);
          //console.info(json);
        }
      }
    }
  },
  next: function () {
    if (GameManager.currTimer != null) {
      GameManager.currTimer.pause();
      GameManager.currTimerText.pause();
    }
    v_main.user_one.next = false;
    v_main.user_two.next = false; // 重置对手状态
    clearTimeout(socket.await);
    GameManager.touch = true;
    setTimeout(function () {
      winSize.SubjectList.splice(0, 1);
      if (winSize.SubjectList.length == 0) {
        GameManager.currTimer.removeFromParent();
        GameManager.currTimerText.removeFromParent();
        intellect.gameover();
      } else {
        cc.eventManager.dispatchEvent(
          new cc.EventCustom(jf.EventName.GP_TIMER_START)
        );

        // +++ 如果是双人对战模式，开始下一题的模拟对手答题 +++
        if (v_main.isbattle) {
          intellect.simulateOpponentAnswer();
        }
      }
    }, 300);
  },
  gameover: function () {
    v_main.isGameOver = true;
    v_main.isWinner = v_main.user_one.gold > v_main.user_two.gold;
    if (v_main.isWinner) {
      v_main.user_one.gold += v_main.user_two.gold;
      v_main.user_two.gold = 0;
      if (!v_main.isbattle) {
        if (v_main.user_one.gold + userInfo.day_solo >= 100) {
          v_main.user_one.gold = 100 - userInfo.day_solo;
          userInfo.day_solo = 100;
          intellect.tips(
            "您今天在单人游戏中已获满100枚金币,本次游戏获得" +
              v_main.user_one.gold +
              "枚!",
            ["back"],
            "normal"
          );
        } else {
          userInfo.day_solo += v_main.user_one.gold;
        }
      } else {
        if (v_main.user_one.gold + userInfo.day_battle >= 500) {
          v_main.user_one.gold = 500 - userInfo.day_battle;
          userInfo.day_battle = 500;
          intellect.tips(
            "您今天在好友对战中已获满500枚金币,本次游戏获得" +
              v_main.user_one.gold +
              "枚!",
            ["back"],
            "normal"
          );
        } else {
          userInfo.day_battle += v_main.user_one.gold;
        }
      }
    } else {
      v_main.user_two.gold += v_main.user_one.gold;
      v_main.user_one.gold = 0;
    }
    if (!v_main.isbattle) {
      userInfo.solo += v_main.user_one.gold;
      if (v_main.user_one.gold != 0) intellect.updateJson(0);
    } else {
      userInfo.battle += v_main.user_one.gold;
      if (v_main.user_one.gold != 0) intellect.updateJson(1);
    }
    changeWxJsSdk(weixinData.sharelink, weixinData.shareDesc);
    // +++ 重置WebSocket状态 +++
    if (ws) {
      ws.close();
      ws = null; // 重置WebSocket对象
    }
  },
  updateJson: function (tmpisBattle) {
    var json =
      '{"name": "' +
      userInfo.name +
      '","img": "' +
      userInfo.face +
      '","sex": "' +
      userInfo.sex +
      '","country": "' +
      userInfo.country +
      '","province": "' +
      userInfo.province +
      '","day_solo":' +
      userInfo.day_solo +
      ',"solo_time": "' +
      dt +
      '","day_battle":' +
      userInfo.day_battle +
      ',"battle_time": "' +
      dt +
      '"}';
    console.info(json);
    $.ajax({
      cache: false,
      async: false,
      type: "POST",
      url: "getUserInfo.ashx",
      data: {
        type: "add",
        act_id: act_id,
        user: userInfo.openid,
        isbattle: tmpisBattle,
        solo: userInfo.solo,
        battle: userInfo.battle,
        json: json,
      },
      success: function (response) {
        console.info(response);
      },
    });
  },
  getSubject: function (isSelect) {
    winSize.SubjectList = [];
    var targrt = [];
    if (!isSelect) {
      var length = qs.length;
      while (winSize.SubjectList.length < 10) {
        var isOk = true;
        var random = Math.round(Math.random() * (length - 1));
        for (var i = 0; i < winSize.SubjectList.length; i++) {
          if (random == winSize.SubjectList[i].id * 1) {
            isOk = false;
            break;
          }
        }
        if (isOk) {
          winSize.SubjectList.push(qs.slice(random, random + 1)[0]);
          targrt.push(qs.slice(random, random + 1)[0].id);
        }
      }
    } else {
      var index = [];
      for (var i = 0; i < v_dialogs.posterIsSelected.length; i++) {
        var begin =
          v_dialogs.posterIsSelected[i] == 1
            ? 0
            : qsf[v_dialogs.posterIsSelected[i] - 2] + 1;
        for (var j = begin; j <= qsf[v_dialogs.posterIsSelected[i] - 1]; j++) {
          index.push(j);
        }
      }
      var length = index.length;
      while (winSize.SubjectList.length < 10) {
        var isOk = true;
        var random = index[Math.round(Math.random() * (length - 1))];
        for (var i = 0; i < winSize.SubjectList.length; i++) {
          if (random == winSize.SubjectList[i].id * 1) {
            isOk = false;
            break;
          }
        }
        if (isOk) {
          winSize.SubjectList.push(qs.slice(random, random + 1)[0]);
          targrt.push(qs.slice(random, random + 1)[0].id);
        }
      }
    }
    return targrt;
    //console.info(winSize.SubjectList);
  },
  tips: function (content, btn, callback) {
    v_dialogs.tips = content;
    v_dialogs.tipsBtn = btn;
    v_dialogs.tipsCallBack = callback;
  },
  ercode: function (link) {
    $("#ercode").empty().qrcode({
      render: "canvas",
      width: 400,
      height: 400,
      text: link,
    });
    $("#ercode_open").empty().qrcode({
      render: "canvas",
      width: 65,
      height: 65,
      text: link,
    });
  },
  simulateOpponentAnswer: function () {
    // log call stack
    console.log(new Error().stack);

    // 如果游戏已结束或没有题目了，不再模拟
    if (v_main.isGameOver || winSize.SubjectList.length === 0) return;

    // 计算正态分布的答题时间 (μ=5±1, σ=2)
    let avg = 5 - (level - 0.5) * 2; // 平均值根据正确率调整
    var answerTime = normalRandom(avg, 2);

    // 确保最小时间为0.5秒
    if (answerTime < 0.5) answerTime = 0.5;

    // 计算超时惩罚
    var adjustedLevel = level; // 初始正确率
    if (answerTime > 10) {
      // 超过10秒后，每多1秒正确率降低100%
      var overtime = answerTime - 10;
      var penalty = 1 * overtime; // 每超时1秒惩罚100%
      adjustedLevel = Math.max(0, level - penalty); // 确保不低于0
    }

    var isCorrect = Math.random() < adjustedLevel;
    console.table({ answerTime, isCorrect });

    // 在答题时间后触发对手答题
    setTimeout(function () {
      // 如果游戏已结束或题目已变化，不再处理
      if (v_main.isGameOver || v_main.subject[0] !== winSize.SubjectList[0])
        return;

      // 随机决定是否答对
      var score = isCorrect ? 10 : 0;

      // 根据原游戏规则计算得分
      // 如果玩家尚未答题，对手答对额外加5分
      if (isCorrect && !v_main.user_one.next) {
        score += 5;
      }

      // 更新对手状态
      if (isCorrect) {
        v_main.user_two.combo.push(1);
        v_main.user_two.gold += score;
      } else {
        v_main.user_two.combo.push(0);
      }
      v_main.user_two.next = true;

      // 触发对手答题效果
      cc.audioEngine.playEffect(
        isCorrect ? res.audio_success : res.audio_lose,
        false
      );

      // // 如果还有下一题，继续模拟对手答题
      // if (winSize.SubjectList.length > 1) {
      //   intellect.simulateOpponentAnswer();
      // }
    }, Math.min(answerTime, 10) * 1000); // 转换为毫秒
  },
};
var dialogs = {
  loadcount: 0,
  loadres: [],
  loadtag: "dialogs_preload",
  precentWidth: 200,
  loadResFinish: function () {
    //首页
    cc.director.runScene(new MainMenuScene());

    //playing
    //intellect.start(false);

    //全局提示
    //intellect.tips('原创内测阶段,单人游戏功能已开放!',['sure'],'normal');

    //select
    //v_dialogs.active='select';

    //battle
    //intellect.btn_waiting();

    //结束页
    //v_main.active='playing';
    //intellect.gameover();

    if (debug) {
      winSize.ws = "ws://localhost:31357/act/h5/intellect/matching.ashx";
      winSize.srv = "localhost:31357";
      if (getQueryString("user") != null)
        userInfo.openid = getQueryString("user");
      if (getQueryString("battle") != null && getQueryString("timespan")) {
        var ts = getQueryString("timespan") * 1;
        // if (new Date().getTime() - ts < 60 * 1000 * 1000000) {
        userInfo.balllterid = getQueryString("battle");
        v_main.user_two.openid = userInfo.balllterid;
        intellect.tips("连接中,请稍后...", ["back"], "refresh");
        socket.init(userInfo.openid);
        //console.info("battler:" + userInfo.balllterid);
        // } else {
        //   intellect.tips("该链接已超时失效!", ["back"], "refresh");
        // }
      }
    } else {
      var state = decodeURIComponent(getQueryString("state"));
      //alert(state);
      if (
        getQueryString2("battle", state) != null &&
        getQueryString2("timespan", state)
      ) {
        var ts = getQueryString2("timespan", state) * 1;
        if (new Date().getTime() - ts < 60 * 1000 * winSize.shareTimeLimit) {
          //2分钟有效
          if (getQueryString2("battle", state) != userInfo.openid) {
            //不是我自己
            userInfo.balllterid = getQueryString2("battle", state);
            v_main.user_two.openid = userInfo.balllterid;
            intellect.tips("连接中,请稍后...", ["back"], "refresh");
            socket.init(userInfo.openid);
          } else {
            //alert("自己不能跟自己对战哦~")
            location.href = weixinData.shareLink;
          }
        } else {
          intellect.tips("该链接已超时失效!", ["back"], "refresh");
        }
      }
    }
  },
};
function registerEvent() {
  initWxJsSdk(); //微信分享初始化
  winSize.videoList = TvList[winSize.tvId];
  creatTvList();
  $(".dialogs_close,#dialogs_share").click(function () {
    if ($(this).attr("tips"))
      intellect.tips(
        "你确定要返回吗？返回后已分享的对战链接将失效！",
        ["sure", "cancel"],
        "waiting_back"
      );
    else v_dialogs.active = "";
  });
  $(".tv_catalog_title").click(function () {
    $(this).addClass("actived").siblings().removeClass("actived");
    var index = $(this).index();
    winSize.videoList = TvList[TvList.length - 1 - index];
    creatTvList();
  });
  $("#tv_play_out_btn").click(function () {
    $("#video_box").fadeOut();
    $("#tv_ifram").empty();
  });
  $("#btn_share").click(function () {
    v_dialogs.active = "share";
    cc.audioEngine.playEffect(res.audio_button, false);
  });
  $("#btn_index").click(function () {
    // +++ 添加状态重置 +++
    // 重置游戏状态
    v_main.isGameOver = false;
    v_main.isWinner = false;

    // 重置玩家状态
    v_main.user_one.next = false;
    v_main.user_one.gold = 0;
    v_main.user_one.combo = [];

    // 重置对手状态
    v_main.user_two.next = false;
    v_main.user_two.gold = 0;
    v_main.user_two.combo = [];

    // 重置题目列表
    winSize.SubjectList = [];

    // ... 原有代码不变 ...
    GameManager.reset();
    v_main.active = "";
    userInfo.balllterid = null;
    cc.director.runScene(new MainMenuScene());
    cc.audioEngine.playEffect(res.audio_button, false);
    changeWxJsSdk(weixinData.sharelink, weixinData.shareDesc);
  });
}
function GameLogin() {
  if (!debug) {
    if (
      getQueryString("battle") != null &&
      getQueryString("timespan") != null
    ) {
      var a = location.href;
      var b = a.indexOf("?");
      var c;
      a = encodeURIComponent(a.substr(b + 1)); //所有参数
      c = weixinData.loginUrl.replace("STATE", a);
      location.href = c;
    } else {
      $.ajax({
        cache: false,
        async: false,
        type: "POST",
        url: "/act/center/openIdCrossDomain.ashx",
        data: {
          type: "GET",
          url:
            "https://api.weixin.qq.com/sns/oauth2/access_token?appid=wxb61fdb0e387cbcc4&secret=2de4747ccccb04312e71e86708bfec66&code=" +
            getQueryString("code") +
            "&grant_type=authorization_code",
        },
        success: function (response) {
          var result = JSON.parse(response);
          token = result.access_token;
          openid = result.openid;
          if (typeof openid == "undefined") {
            location.href = weixinData.loginUrl;
          } else {
            userInfo.openid = openid;
            $.ajax({
              cache: false,
              async: false,
              type: "POST",
              url: "/act/center/openIdCrossDomain.ashx",
              data: {
                type: "GET",
                url:
                  "https://api.weixin.qq.com/sns/userinfo?access_token=" +
                  token +
                  "&openid=" +
                  openid +
                  "&lang=zh_CN",
              },
              success: function (res) {
                var r = JSON.parse(res);
                userInfo.name = r.nickname;
                userInfo.face =
                  r.headimgurl != "" ? r.headimgurl : weixinData.shareImg;
                userInfo.sex = r.sex;
                userInfo.country = r.country;
                userInfo.province = r.province;
                VueInit();
              },
            });
          }
        },
      });
    }
  } else {
    VueInit();
  }
}
cc.game.onStart = function () {
  v_dialogs.active = "preload";
  dialogs.loadres = g_resources;
  dialogs.loadcount = 0;
  loadGameResources();
};
function loadGameResources() {
  cc.loader.load(dialogs.loadres[dialogs.loadcount], function (err) {
    if (dialogs.loadcount >= dialogs.loadres.length - 1) {
      //全部加载完毕
      v_dialogs.active = "";
      dialogs.loadResFinish();
    } else {
      dialogs.loadcount++;
      var loading = $("#" + dialogs.loadtag + " .precent_main");
      var precent = (dialogs.loadcount / (dialogs.loadres.length - 1)).toFixed(
        2
      );
      var width = precent * dialogs.precentWidth;
      $("#" + dialogs.loadtag + " .precent_word").text(
        Math.ceil(precent * 100) + "%"
      );
      if (!$(loading).is(":animated"))
        loading.animate({
          width:
            ((dialogs.precentWidth + 20) * dialogs.loadcount) /
              (dialogs.loadres.length - 1) +
            "px",
        });
      else
        loading.stop().animate({
          width:
            ((dialogs.precentWidth + 20) * dialogs.loadcount) /
              (dialogs.loadres.length - 1) +
            "px",
        });
      loadGameResources();
    }
  });
}
function creatTvList() {
  var html = "";
  for (var i = 0; i < winSize.videoList.length; i++) {
    html += "<li><a>" + (i + 1) + "</a></li>";
  }
  $("#tv_catalog_btn").empty().html(html);
  $("#tv_catalog_btn li a")
    .unbind("click")
    .click(function () {
      if (!$(this).hasClass("selected")) {
        var index = $(this).parent().index();
        playVideo(index);
      }
    });
}
function playVideo(i) {
  var title = winSize.videoList[i].title;
  var src;
  if (winSize.videoList[i].src.indexOf("=") == -1)
    src =
      '<iframe frameborder="0" width="700" height="400" src="https://v.qq.com/iframe/player.html?vid=' +
      winSize.videoList[i].src +
      '&tiny=0&auto=0" allowfullscreen></iframe>';
  else
    src =
      '<iframe width=700 height=400 src="http://player.youku.com/embed/' +
      winSize.videoList[i].src +
      '" frameborder=0 allowfullscreen></iframe>';
  $("#tv_ifram").empty().html(src);
  $("#tv_play_title").empty().text(title);
  $("#tv_catalog_btn li a")
    .eq(i)
    .parent()
    .addClass("selected")
    .siblings()
    .removeClass("selected");
  $("#video_box").fadeIn();
}
function IsPC() {
  var userAgentInfo = navigator.userAgent;
  var Agents = [
    "Android",
    "iPhone",
    "SymbianOS",
    "Windows Phone",
    "iPad",
    "iPod",
  ];
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
  if (r != null) return r[2];
  return null;
}
function getQueryString2(name, link) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = link.match(reg);
  if (r != null) return r[2];
  return null;
}
function initWxJsSdk() {
  $.ajax({
    cache: false,
    async: false,
    type: "POST",
    url: "/act/getWeiXinToken.ashx",
    data: {
      thisUrl: location.href.split("#")[0],
    },
    success: function (res) {
      var wxData = JSON.parse(res);
      wx.config({
        debug: false,
        appId: wxData.appId,
        timestamp: wxData.timestamp,
        nonceStr: wxData.nonceStr,
        signature: wxData.signature,
        jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage"],
      });
      wx.ready(function () {
        wx.onMenuShareTimeline({
          title: weixinData.shareDesc,
          link: weixinData.shareLink,
          imgUrl: weixinData.shareImg,
          success: function () {},
          cancel: function () {},
        });
        wx.onMenuShareAppMessage({
          title: weixinData.shareTitle,
          desc: weixinData.shareDesc,
          link: weixinData.shareLink,
          imgUrl: weixinData.shareImg,
          success: function () {},
          cancel: function () {},
        });
      });
    },
  });
}
function changeWxJsSdk(sharelink, shareDesc) {
  wx.onMenuShareAppMessage({
    title: weixinData.shareTitle,
    desc: shareDesc,
    link: sharelink,
    imgUrl: weixinData.shareImg,
    success: function () {},
    cancel: function () {
      console.info("onMenuShareAppMessage cancel");
    },
  });
  //link: weixinData.shareLink+"?share=1&scene="+heartbeat.scene+"&nf="+encodeURIComponent(heartbeat.nf)+"&nt="+encodeURIComponent(heartbeat.nt)
}
function getSubject() {
  $.ajax({
    cache: false,
    async: false,
    type: "POST",
    url: "getUserInfo.ashx",
    data: {
      type: "subject",
      act_id: act_id,
      user: userInfo.openid,
    },
    success: function (res) {
      console.info(res);
    },
  });
}
var s1 =
  'oTaiPuEUqBR9FQRGw5hvR0oyOAWo@usersplit@{"active":"userinfo","userinfo":{"openid":"' +
  userInfo.openid +
  '","face":"' +
  userInfo.face +
  '","name":"' +
  userInfo.name +
  '"}}';
var s2 = 'oTaiPuEUqBR9FQRGw5hvR0oyOAWo@usersplit@{"active":"ready"}';
