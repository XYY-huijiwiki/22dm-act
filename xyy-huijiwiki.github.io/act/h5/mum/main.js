var act_id = 46,
  isWx = false;
var v_main = null;
var canvas,
  context,
  canvasWidth = 640,
  canvasHeight = 1300;
var weixinData = {
  shareTitle: "确认过眼神，是亲生的！",
  shareDesc: "“亲生相”测试，发现你们的相似度有多少？",
  shareLink: "http://act.22dm.com/act/h5/mum/index.html",
  shareImg: "http://act.22dm.com/act/h5/mum/res/icon.jpg",
};
var winSize = {
  width: 640,
  height: 0,
  userWidth: 550,
  userHeight: 570,
  scaleY: 1,
  imdData: {},
  models: "js/weights/",
  loadcount: 0,
  loadres: [],
  resize: function resize() {
    let height = $(window).height() > 1300 ? 1300 : $(window).height();
    let scaleY = (height / 1450).toFixed(2);
    this.height = height;
    this.scaleY = scaleY;
    $("#all")
      .css({
        width: 640,
        height: height,
      })
      .show();
    $("#canvas_layer").css({
      transform: `scale(${scaleY})`,
      webkitTransform: `scale(${scaleY})`,
    });
    console.log(
      `width:${this.width},height:${this.height},scaleY:${this.scaleY}`
    );
    this.resetImgData();
  },
  resetImgData: function () {
    this.imdData = {
      top: 0,
      left: 0,
      scale: 1,
      rotate: 0,
      deltaX: 0,
      deltaY: 0,
    };
  },
  loadResFinish: function () {
    cc.director.runScene(new GamePlayScene());
  },
  loadResReset: function () {
    this.loadcount = 0;
    this.loadres = [];

    let sharedata = v_main.sharedata;
    this.loadres.push(`res/t/background_${sharedata.theme}.jpg`); //背景底图
    //this.loadres.push(`${imgId}`); //用户头像
    this.loadres.push($("#imgId").attr("src")); //用户头像
    this.loadres.push(`res/t/main_${sharedata.theme}.png`); //相框
    this.loadres.push(`res/b/r_${sharedata.word}.png`); //印章
    let number = sharedata.caldistance.toString().split("");
    number.forEach((item) => {
      this.loadres.push(`res/word/y/${item}.png`);
    });
    this.loadres.push(`res/word/y/p.png`);
  },
};
function vueInit() {
  v_main = new Vue({
    el: "#all",
    data: {
      loadFaceModel: false,
      loadTouchListener: false,
      touch: false,
      hasFace: false,
      distance: 0,
      caldistance: 0,
      imgId: "",
      recordId: "",
      serverId_img: "",
      serverId_record: "",
      sharedata: "",
      theme: 0,
      word: 1,
      progress: "p_2",
      active: "chooseImage",
      recording: false,
      playing: false,
      dialogs: "",
      fromShare: false,
      share: false,
      hasVoice: "",
      word_0: 0,
      word_1: 0,
      caldistancefinish: false,
      file: [],
    },
    methods: {
      onLoadFaceModel: async function () {
        let dt = new Date().getTime();
        this.dialogs = "onLoadFaceModel";
        this.imgId = "";
        if (!this.loadFaceModel) {
          //await faceapi.loadTinyFaceDetectorModel(winSize.models); //轻量化识别模块(区域)
          await faceapi.loadSsdMobilenetv1Model(winSize.models); //SSD1识别模块(区域)
          await faceapi.loadFaceLandmarkTinyModel(winSize.models); //68坐标模块(描点)
          await faceapi.loadFaceRecognitionModel(winSize.models); //对比模块
          this.loadFaceModel = true;
          console.log(
            "初始化FaceModel完成,耗时:" +
              (new Date().getTime() - dt) / 1000 +
              "s"
          );
        }
        this.theme = 1;
        this.dialogs = "";
      },
      chooseImage: function () {
        // 使用普通浏览器API选择图片
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = (event) => {
          const file = event.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
              v_main.imgId = e.target.result; // base64图片数据
              // 设置图片src
              $("#imgId").attr("src", v_main.imgId);
              v_main.dialogs = "onLoadFaceModel";
              setTimeout(function () {
                v_main.onDistanceImg();
              }, 300);
            };
            reader.readAsDataURL(file);
          }
        };
        input.click();
      },
      onDistanceImg: async function (src) {
        let dt = new Date().getTime();
        this.touch = false;
        await this.setImgPos();
        let faceimg = await faceapi.fetchImage($("#imgId").attr("src"));
        let detections = await faceapi.detectAllFaces(faceimg);
        this.hasFace = detections.length;
        console.log(`hasFace:${detections.length}`);
        if (detections.length == 0) {
          this.progress = "p_1";
        } else if (detections.length == 1) {
          this.progress = "p_2";
        } else {
          let resdouble = await faceapi
            .detectAllFaces(faceimg)
            .withFaceLandmarks(true)
            .withFaceDescriptors();
          let distance = await faceapi.round(
            faceapi.euclideanDistance(
              resdouble[0].descriptor,
              resdouble[1].descriptor
            )
          );
          await v_main.getDistance(distance);
          console.log(
            "相似度:" +
              v_main.caldistance +
              "% 结束识别,耗时:" +
              (new Date().getTime() - dt) / 1000 +
              "s"
          );
        }
        this.dialogs = "";
      },
      setImgPos: async function () {
        let img = $("#imgId");
        let width = img.width();
        let height = img.height();
        let scaleX = (winSize.userWidth / width).toFixed(4);
        img.css({
          webkitTransform: "scale(" + scaleX + ")",
          transform: "scale(" + scaleX + ")",
          marginTop: -height >> 1,
          marginLeft: -width >> 1,
        });
        winSize.imdData.top = -height >> 1;
        winSize.imdData.left = -width >> 1;
        winSize.imdData.scale = scaleX;
        winSize.imdData.rotate = 0;
        v_main.touch = true;
        if (!this.loadTouchListener) {
          this.loadTouchListener = true;
          onListenerTouch("touch_area");
        }
      },
      getDistance: async function (distance) {
        let caldistance = 1;
        caldistance -= distance;
        caldistance /= 0.72;
        caldistance =
          caldistance > 1 ? 0.99 : caldistance < 0.3 ? 0.4 : caldistance;
        caldistance = (caldistance * 100).toFixed(0);
        this.distance = distance;
        this.caldistance = caldistance;

        // let html ='';
        // let number = caldistance.toString().split('');
        // number.forEach((item) => {
        //   html += `<img src="res/word/b/${item}.png"/>`;
        // })
        // html += `<img src="res/word/b/p.png"/>`;
        // $("#progress_p_4").empty().html(html);

        this.progress = "p_4";
        this.word = caldistance > 80 ? 1 : caldistance > 50 ? 3 : 2;
        this.word_0 = "";
        this.word_1 = "";
        this.caldistancefinish = false;
        this.showProgressWord(0);
        return caldistance;
      },
      showProgressWord: function (caldistance) {
        if (caldistance <= this.caldistance) {
          const number = caldistance.toString().split("");
          number.forEach((item, index) => {
            if (index == 0) this.word_0 = item;
            if (index == 1) this.word_1 = item;
          });
          setTimeout(() => {
            this.showProgressWord(caldistance + 1);
          }, 30);
        } else {
          this.caldistancefinish = true;
        }
      },
      uploadImage: function () {
        // if(isWx){
        //   wx.uploadImage({
        //     localId: v_main.imgId,
        //     isShowProgressTips: 1,
        //     success: function (res) {
        //       let serverId = res.serverId;
        //       v_main.serverId_img = serverId;
        //       v_main.active = "startRecord";
        //     }
        //   });
        // }
        // else{
        // }
        v_main.recordId = "";
        v_main.active = "startRecord";
      },
      startRecord: function () {
        if (!this.recording) {
          // Browser-API: Audio aufnehmen
          navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then((stream) => {
              this.mediaStream = stream;
              this.mediaRecorder = new MediaRecorder(stream);
              this.audioChunks = [];
              this.mediaRecorder.ondataavailable = (e) => {
                this.audioChunks.push(e.data);
              };
              this.mediaRecorder.onstop = () => {
                this.recording = false;
                const audioBlob = new Blob(this.audioChunks, {
                  type: "audio/webm",
                });
                this.recordId = URL.createObjectURL(audioBlob);
                this.audioBlob = audioBlob;
              };
              this.mediaRecorder.start();
              this.recording = true;
            });
        }
      },
      playVoice: function () {
        if (!this.playing && this.recordId) {
          this.playing = true;
          if (this.audio) {
            this.audio.pause();
            this.audio = null;
          }
          this.audio = new Audio(this.recordId);
          this.audio.onended = () => {
            this.playing = false;
          };
          this.audio.play();
        }
      },
      stopRecord: function () {
        if (this.recording && this.mediaRecorder) {
          this.mediaRecorder.stop();
          if (this.mediaStream) {
            this.mediaStream.getTracks().forEach((track) => track.stop());
            this.mediaStream = null;
          }
        }
      },
      uploadVoice: function () {
        if (this.recordId) {
          if (this.playing && this.audio) {
            this.audio.pause();
            this.playing = false;
          }
          // Simuliere Upload mit Timeout
          setTimeout(() => {
            // Erzeuge eine zufällige ID als "serverId"
            let serverId = Math.random().toString(36).substr(2, 9);
            this.serverId_record = serverId;
            this.onFinish();
          }, Math.random() * 500 + 500);
        } else {
          this.onFinish();
        }
      },
      onFinish: function () {
        //if(serverId_img&&serverId_record)
        {
          this.dialogs = "onLoadFaceModel";
          let json = {};
          let dt = new Date().getTime();
          json.ticket = dt;
          json.theme = this.theme;
          json.word = this.word;
          json.serverId_img = this.serverId_img;
          json.serverId_record = this.serverId_record;
          json.caldistance = this.caldistance;
          json.distance = this.distance;
          json.imdData = winSize.imdData;
          json.uploadtime = dt;
          json.sharelink = weixinData.shareLink + `?c=${json.ticket}`;
          this.sharedata = json;
          initWeixinData(true);
          this.create_ercode();
        }
      },
      postImgData: function (dataUrl) {
        //console.log(JSON.stringify(json));
        // $.ajax({
        //   cache: false,
        //   async: false,
        //   type: "POST",
        //   url: "upload.ashx",
        //   data: {
        //     type: 0,
        //     act_id: act_id,
        //     ticket: v_main.sharedata.ticket,
        //     json: JSON.stringify(v_main.sharedata),
        //     dataUrl: dataUrl
        //   },
        //   success: function (response) {
        //     console.log(response);
        //     let res = JSON.parse(response);
        //     if (res.success) {
        //       v_main.dialogs = 'canvasUrlData';
        //     }
        //     else {
        //       alert("服务器繁忙,请刷新页面再试");
        //     }
        //   }
        // });
        setTimeout(
          () => (v_main.dialogs = "canvasUrlData"),
          Math.random() * 1000 + 500
        );
      },
      getImgData: function (ticket) {
        // $.ajax({
        //   cache: false,
        //   async: false,
        //   type: "POST",
        //   url: "upload.ashx",
        //   data: {
        //     type: 1,
        //     act_id: act_id,
        //     ticket: ticket,
        //   },
        //   success: function (response) {
        //     var json = JSON.parse(response);
        //     this.sharedata = json.result;
        //     winSize.imdData = json.result.imdData;
        //     document.getElementById("canvasUrlData").src =
        //       "upload/" + json.result.ticket + ".jpg";
        //     this.dialogs = "canvasUrlData";
        //     if (json.result.serverId_record) {
        //       this.hasVoice = true;
        //     }
        //   }.bind(this),
        // });

        // simulated result
        this.sharedata = {
          ticket: ticket,
          theme: 1,
          word: 1,
          serverId_img: "simulated_server_id_img",
          serverId_record: "simulated_server_id_record",
          caldistance: 85,
          distance: 0.5,
          imdData: {},
        };
        document.getElementById("canvasUrlData").src = "./Herunterladen.png";
        this.dialogs = "canvasUrlData";
      },
      downloadVoice: function () {
        wx.downloadVoice({
          serverId: this.sharedata.serverId_record,
          isShowProgressTips: 1,
          success: function (res) {
            this.recordId = res.localId;
          }.bind(this),
        });
      },
      create_ercode: function () {
        $("#qrcode").empty();
        winSize.loadResReset();
        let text = this.sharedata.sharelink;
        new QRCode("qrcode", {
          text: text,
          width: 200,
          height: 200,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.L,
        });
        setTimeout(function () {
          cc.game.run();
        }, 300);
      },
      toDataUrl: function () {
        setTimeout(function () {
          let dataUrl = document
            .getElementById("gameCanvas")
            .toDataURL(0, 0, 640, 1300, "image/jpeg", 1);
          document.getElementById("canvasUrlData").src = dataUrl;
          v_main.postImgData(dataUrl);
        }, 300);
      },
    },
    created: function () {
      winSize.resize();
      initWxJsSdk();
      //this.onLoadFaceModel();
      var c = getQueryString("c");
      if (c != null) {
        this.dialogs = "onLoadFaceModel";
        this.fromShare = true;
        this.getImgData(c);
      }
    },
  });
}
$(function () {
  // if (!IsPC()) {
  //   //vueInit();
  //   var ua = navigator.userAgent.toLowerCase();//获取判断用的对象
  //   if (ua.match(/MicroMessenger/i) == "micromessenger") { //微信打开
  //     vueInit();
  //   }
  //   else {
  //     $("#ercode").show();
  //   }
  // }
  // else {
  //   $("#ercode").show();
  // }
  vueInit();
});
function initWxJsSdk() {
  $.ajax({
    cache: false,
    async: false,
    type: "POST",
    url: "/act/getWeiXinToken.ashx",
    data: {
      thisUrl: location.href.split("#")[0],
    },
    success: function success(res) {
      var wxData = JSON.parse(res);
      wx.config({
        debug: false,
        appId: wxData.appId,
        timestamp: wxData.timestamp,
        nonceStr: wxData.nonceStr,
        signature: wxData.signature,
        jsApiList: [
          "onMenuShareTimeline",
          "onMenuShareAppMessage",
          "chooseImage",
          "previewImage",
          "uploadImage",
          "downloadImage",
          "startRecord",
          "stopRecord",
          "onVoiceRecordEnd",
          "playVoice",
          "pauseVoice",
          "stopVoice",
          "onVoicePlayEnd",
          "uploadVoice",
          "downloadVoice",
        ],
      });
    },
  });
  wx.ready(function () {
    isWx = true;
    initWeixinData(false);
    if (getQueryString("c") != null && v_main.sharedata.serverId_record) {
      //有录音
      v_main.downloadVoice();
    }
  });
}
function initWeixinData(hasCode) {
  // if (!hasCode) {
  //   wx.onMenuShareTimeline({
  //     title: weixinData.shareDesc,
  //     link: weixinData.shareLink,
  //     imgUrl: weixinData.shareImg,
  //   });
  //   wx.onMenuShareAppMessage({
  //     title: weixinData.shareTitle,
  //     desc: weixinData.shareDesc,
  //     link: weixinData.shareLink,
  //     imgUrl: weixinData.shareImg,
  //   });
  // } else {
  //   wx.onMenuShareTimeline({
  //     title: weixinData.shareDesc,
  //     link: v_main.sharedata.sharelink,
  //     imgUrl: weixinData.shareImg,
  //   });
  //   wx.onMenuShareAppMessage({
  //     title: weixinData.shareTitle,
  //     desc: weixinData.shareDesc,
  //     link: v_main.sharedata.sharelink,
  //     imgUrl: weixinData.shareImg,
  //   });
  // }
}
function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return r[2];
  return null;
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
function onListenerTouch(obj) {
  var box = document.getElementById(obj);
  var boxGesture = setGesture(box);
  var deltaScale = 1;
  var deltaRotate = 0;
  boxGesture.gesturescale = function (e) {
    if (v_main.touch) {
      // deltaScale = e.scale - oldscale;
      // deltaRotate = e.scale - rotation;
      // winSize.imdData.scale+=deltaScale;
      // winSize.imdData.rotate+=deltaRotate;
      winSize.imdData.scale = e.scale;
      winSize.imdData.rotate = e.rotation;
      document.getElementById("imgId").style.transform =
        "scale(" +
        winSize.imdData.scale +
        ") rotate(" +
        winSize.imdData.rotate +
        "deg)";
      // deltaScale = e.scale;
      // deltaRotate = e.rotation;
    }
  };
  boxGesture.gesturemove = function (e) {
    if (v_main.touch) {
      winSize.imdData.top += e.delta.deltaY;
      winSize.imdData.left += e.delta.deltaX;
      winSize.imdData.deltaY += e.delta.deltaY;
      winSize.imdData.deltaX += e.delta.deltaX;
      $("#imgId").css({
        marginTop: winSize.imdData.top,
        marginLeft: winSize.imdData.left,
      });
    }
  };
}
function setGesture(el) {
  var touchobj = {}; //定义一个对象
  var istouch = false;
  var start = [];
  document.getElementById("main").addEventListener(
    "touchmove",
    function (e) {
      e.preventDefault();
    },
    true
  );
  el.addEventListener(
    "touchstart",
    function (e) {
      e.preventDefault();
      istouch = true;
      start = e.touches;
    },
    false
  );
  document.addEventListener(
    "touchmove",
    function (e) {
      // e.preventDefault();
      let now = e.touches; //得到第二组两个点
      if (e.touches.length >= 2 && istouch) {
        let scale =
          getTouchScale(now[0], now[1]) / getTouchScale(start[0], start[1]); //得到缩放比例，getDistance是勾股定理的一个方法
        let rotation =
          getTouchAngle(now[0], now[1]) - getTouchAngle(start[0], start[1]); //得到旋转角度，getAngle是得到夹角的一个方法
        e.scale = scale.toFixed(2);
        e.rotation = rotation.toFixed(2);
        touchobj.gesturescale && touchobj.gesturescale.call(el, e);
        start = e.touches;
      } else if (e.touches.length == 1 && istouch) {
        e.delta = getTouchDistance(start[0], now[0]);
        touchobj.gesturemove && touchobj.gesturemove.call(el, e);
        start = e.touches;
      }
    },
    false
  );
  document.addEventListener(
    "touchend",
    function (e) {
      if (istouch) {
        istouch = false;
      }
    },
    false
  );
  return touchobj;
}
function getTouchScale(p1, p2) {
  let x = p2.pageX - p1.pageX,
    y = p2.pageY - p1.pageY;
  return Math.sqrt(x * x + y * y);
}
function getTouchDistance(p1, p2) {
  return { deltaX: p2.pageX - p1.pageX, deltaY: p2.pageY - p1.pageY };
}
function getTouchAngle(p1, p2) {
  let x = p1.pageX - p2.pageX,
    y = p1.pageY - p2.pageY;
  return (Math.atan2(y, x) * 180) / Math.PI;
}
cc.game.onStart = function () {
  loadGameResources();
};
function loadGameResources() {
  cc.loader.load(winSize.loadres[winSize.loadcount], function (err) {
    if (winSize.loadcount >= winSize.loadres.length - 1) {
      winSize.loadResFinish();
    } else {
      winSize.loadcount++;
      loadGameResources();
    }
  });
}
