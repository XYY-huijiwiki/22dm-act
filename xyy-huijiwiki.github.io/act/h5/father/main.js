var act_id = 47,
  isWx = false,
  xwz = false;
var v_main = null;
var canvas,
  context,
  canvasWidth = 640,
  canvasHeight = 1300,
  faceWidth = 200,
  faceHeight = 250;
var weixinData = {
  shareTitle: "英雄爸爸教我的二三事！",
  shareDesc: "把爱的心意献给我的超级英雄爸爸",
  shareLink: "https://act.22dm.com/act/h5/father/index.html",
  shareImg: "https://act.22dm.com/act/h5/father/res/icon.jpg",
};
var winSize = {
  width: 640,
  height: 0,
  canvasHeight: 1300,
  userWidth: 200,
  userHeight: 250,
  scaleY: 1,
  imdData: { imgId_1: {}, imgId_2: {} },
  models: "../../../act/h5/mum/js/weights/",
  loadcount: 0,
  loadres: {},
  res: [],
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
    this.imdData.imgId_1 = {
      top: 0,
      left: 0,
      scale: 1,
      rotate: 0,
      deltaX: 0,
      deltaY: 0,
      bscale: 1,
      brotate: 0,
    };
    this.imdData.imgId_2 = {
      top: 0,
      left: 0,
      scale: 1,
      rotate: 0,
      deltaX: 0,
      deltaY: 0,
      bscale: 1,
      brotate: 0,
    };
  },
  loadResFinish: function () {
    cc.director.runScene(new GamePlayScene());
  },
  loadResReset: function () {
    this.loadcount = 0;
    let sharedata = v_main.sharedata;
    this.res = {};
    this.loadres = [];
    this.loadres.push($("#imgId_1").attr("src"));
    this.loadres.push($("#imgId_2").attr("src"));
    this.loadres.push(`res/t/background_canvas.png`);
    this.loadres.push(`res/b/foot.png`);
    this.loadres.push(`res/b/r_${sharedata.word}.png`);
    this.loadres.push(`res/t/main_${sharedata.theme}.png`);

    this.res.background = `res/t/background_canvas.png`;
    this.res.user_1 = $("#imgId_1").attr("src");
    this.res.user_2 = $("#imgId_2").attr("src");
    this.res.foot = `res/b/foot.png`;
    this.res.word = `res/b/r_${sharedata.word}.png`;
    this.res.theme = `res/t/main_${sharedata.theme}.png`;
    this.res.number = [];
    let number = sharedata.caldistance.toString().split("");
    number.forEach((item) => {
      this.res.number.push(`res/word/${item}.png`);
      this.loadres.push(`res/word/${item}.png`);
    });
    this.res.number.push(`res/word/p.png`);
    this.loadres.push(`res/word/p.png`);
  },
};
function vueInit() {
  v_main = new Vue({
    el: "#all",
    data: {
      loadFaceModel: false,
      loadTouchListener: false,
      touch: false,
      distance: 0,
      caldistance: 50,
      descriptor: [null, null],
      imgId_1: "",
      imgId_2: "",
      hasFace_1: false,
      hasFace_2: false,
      recordId: "",
      serverId_record: "",
      recording: false,
      playing: false,
      sharedata: "",
      theme: 0,
      word: 1,
      progress: "p_2",
      active: "chooseImage",
      dialogs: "",
      fromShare: false,
      share: false,
      hasVoice: "",
      word_0: 9,
      word_1: 9,
      caldistancefinish: false,
    },
    methods: {
      onLoadFaceModel: async function () {
        this.dialogs = "onLoadFaceModel";
        this.imgId_1 = "";
        this.imgId_2 = "";
        let w = Math.random();
        let t = Math.random();
        if (!this.loadFaceModel) {
          let dt = new Date().getTime();
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
        this.theme = t > 0.66 ? 1 : t > 0.33 ? 2 : 3;
        this.word = w > 0.66 ? 1 : w > 0.33 ? 2 : 3;
        this.dialogs = "";
      },
      chooseImage: function (id) {
        // Standard-Browser-API für Bildauswahl
        let input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = (e) => {
          const file = e.target.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (event) => {
            v_main["imgId_" + id] = event.target.result;
            v_main.dialogs = "onLoadFaceModel";
            setTimeout(function () {
              v_main.previewImage(id);
            }, 300);
          };
          reader.readAsDataURL(file);
        };
        input.click();
      },
      previewImage: async function (id) {
        let faceimg = await faceapi.fetchImage($("#imgId_" + id).attr("src"));
        let detections = await faceapi.detectAllFaces(faceimg);
        if (detections.length == 1) {
          this.touch = false;
          let descriptor = await faceapi
            .detectAllFaces(faceimg)
            .withFaceLandmarks(true)
            .withFaceDescriptors();
          this.descriptor[id * 1 - 1] = descriptor[0].descriptor;
          //console.log(descriptor[0].descriptor);
          this.setImgPos(id);
          if (this.descriptor[0] && this.descriptor[1]) {
            this.onDistanceImg();
          }
          v_main["hasFace_" + id] = true;
        } else {
          v_main["hasFace_" + id] = false;
          alert("请上传单人图片~");
        }
        this.dialogs = "";
      },
      onDistanceImg: async function () {
        let distance = await faceapi.round(
          faceapi.euclideanDistance(this.descriptor[0], this.descriptor[1])
        );
        await v_main.getDistance(distance);
        this.dialogs = "";
      },
      setImgPos: async function (id) {
        let img = $("#imgId_" + id);
        let width = img.width();
        let height = img.height();
        let scaleX = (winSize.userWidth / width).toFixed(4);
        let scaleY = (winSize.userHeight / height).toFixed(4);
        let scale =
          width / height < winSize.userWidth / winSize.userHeight
            ? scaleX
            : scaleY;
        img.css({
          marginTop: -height >> 1,
          marginLeft: -width >> 1,
          webkitTransform: "scale(" + scale + ")",
          transform: "scale(" + scale + ")",
        });
        winSize.imdData["imgId_" + id].top = -height >> 1;
        winSize.imdData["imgId_" + id].left = -width >> 1;
        winSize.imdData["imgId_" + id].scale = scale * 1;
        winSize.imdData["imgId_" + id].bscale = scale * 1;
        winSize.imdData["imgId_" + id].rotate = 0;
        winSize.imdData["imgId_" + id].brotate = 0;
        this.touch = true;
        if (!this.loadTouchListener) {
          this.loadTouchListener = true;
          onListenerTouch("touch_area");
        }
      },
      getDistance: async function (distance) {
        let caldistance = 1;
        caldistance -= distance;
        if (caldistance < 0.3) caldistance *= 2;
        else if (caldistance < 0.4) caldistance *= 1.75;
        else if (caldistance < 0.5) caldistance *= 1.72;
        else if (caldistance < 0.6) caldistance *= 1.55;
        else if (caldistance < 0.7) caldistance *= 1.45;
        else caldistance *= 1.38;
        caldistance =
          caldistance >= 1 ? 0.99 : caldistance < 0.2 ? 0.4 : caldistance;
        caldistance = Math.ceil(caldistance * 100);
        this.distance = distance;
        this.caldistance = caldistance;
        this.progress = "p_4";
        this.word_0 = "";
        this.word_1 = "";
        this.caldistancefinish = false;
        console.log(`distance:${1 - distance} , caldistance:${caldistance}`);
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
        v_main.recordId = "";
        v_main.active = "startRecord";
      },
      startRecord: function () {
        if (!this.recording) {
          // Browser-API: Audioaufnahme
          if (!navigator.mediaDevices || !window.MediaRecorder) {
            alert("Ihr Browser unterstützt keine Audioaufnahme.");
            return;
          }
          this.recordedChunks = [];
          navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then((stream) => {
              this.mediaRecorder = new MediaRecorder(stream);
              this.mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) this.recordedChunks.push(e.data);
              };
              this.mediaRecorder.onstop = () => {
                const blob = new Blob(this.recordedChunks, {
                  type: "audio/webm",
                });
                const url = URL.createObjectURL(blob);
                v_main.recordId = url;
                v_main.recording = false;
                this.audioBlob = blob;
              };
              this.mediaRecorder.start();
              this.recording = true;
            })
            .catch(() => {
              alert("Audioaufnahme fehlgeschlagen.");
            });
        }
      },
      playVoice: function () {
        if (!this.playing && v_main.recordId) {
          this.playing = true;
          if (this.audio) {
            this.audio.pause();
            this.audio = null;
          }
          this.audio = new Audio(v_main.recordId);
          this.audio.onended = () => {
            v_main.playing = false;
          };
          this.audio.play();
        }
      },
      stopRecord: function () {
        if (this.recording && this.mediaRecorder) {
          this.mediaRecorder.stop();
          this.recording = false;
        }
      },
      uploadVoice: function () {
        if (this.recordId) {
          if (this.playing && this.audio) {
            this.audio.pause();
            this.playing = false;
          }
          if (this.sharedata) {
            if (this.sharedata.recordId == this.recordId) {
              this.onFinish();
              return;
            }
          }
          // Simuliere Upload mit zufälliger Verzögerung
          setTimeout(() => {
            // Simuliere serverId als zufälligen String
            let serverId = "srv_" + Math.random().toString(36).substr(2, 9);
            v_main.serverId_record = serverId;
            v_main.onFinish();
          }, 500 + Math.random() * 500);
        } else {
          this.onFinish();
        }
      },
      onFinish: function () {
        this.dialogs = "onLoadFaceModel";
        if (this.sharedata) {
          if (
            this.sharedata.serverId_record == this.serverId_record &&
            this.sharedata.theme == this.theme &&
            this.sharedata.word == this.word &&
            this.sharedata.caldistance == this.caldistance
          ) {
            let equal = true;
            for (var item in this.sharedata.imdData) {
              for (var itemj in this.sharedata.imdData[item]) {
                if (
                  this.sharedata.imdData[item][itemj] !=
                  winSize.imdData[item][itemj]
                ) {
                  equal = false;
                  break;
                }
              }
            }
            if (equal) {
              v_main.dialogs = "canvasUrlData";
              console.log("canvasUrlData:equal");
              return true;
            }
          }
        }
        let json = {};
        let dt = new Date().getTime();
        let imdData = JSON.stringify(winSize.imdData);
        json.ticket = dt;
        json.theme = this.theme * 1;
        json.word = this.word * 1;
        json.recordId = this.recordId;
        json.serverId_record = this.serverId_record;
        json.caldistance = this.caldistance;
        json.distance = this.distance;
        json.imdData = JSON.parse(imdData);
        json.uploadtime = dt;
        json.sharelink = weixinData.shareLink + `?c=${json.ticket}`;
        this.sharedata = json;
        initWeixinData(true);
        this.create_ercode();
      },
      postImgData: async function (dataUrl) {
        //console.log(JSON.stringify(json));
        // $.ajax({
        //   cache: false,
        //   async: false,
        //   type: "POST",
        //   url: "/act/h5/mum/upload.ashx",
        //   data: {
        //     type: 0,
        //     act_id: act_id,
        //     ticket: v_main.sharedata.ticket,
        //     json: JSON.stringify(v_main.sharedata),
        //     dataUrl: dataUrl,
        //   },
        //   success: function (response) {
        //     console.log(response);
        //     let res = JSON.parse(response);
        //     if (res.success) {
        //       v_main.dialogs = "canvasUrlData";
        //     } else {
        //       alert("服务器繁忙,请刷新页面再试");
        //     }
        //   },
        // });
        // sleep 0.5 - 1.0 seconds
        await new Promise((resolve) =>
          setTimeout(resolve, 500 + Math.random() * 500)
        );
        v_main.dialogs = "canvasUrlData";
      },
      getImgData: function (ticket) {
        // $.ajax({
        //   cache: false,
        //   async: false,
        //   type: "POST",
        //   url: "/act/h5/mum/upload.ashx",
        //   data: {
        //     type: 1,
        //     act_id: act_id,
        //     ticket: ticket,
        //   },
        //   success: function (response) {
        //     console.log(response);
        //     var json = JSON.parse(response);
        //     this.sharedata = JSON.parse(response).result;
        //     winSize.imdData = json.result.imdData;
        //     document.getElementById("canvasUrlData").src =
        //       "upload/" + json.result.ticket + ".jpg";
        //     this.dialogs = "canvasUrlData";
        //     if (json.result.serverId_record) {
        //       this.hasVoice = true;
        //     }
        //   }.bind(this),
        // });
        let simuliereImgUrl = "./Herunterladen.png";
        let simuliereShareData = {
          ticket: ticket,
          theme: 1,
          word: 1,
          recordId: "345",
          serverId_record: "123",
          caldistance: 50,
          distance: 0.5,
          imdData: {},
        };
        this.sharedata = simuliereShareData;
        winSize.imdData = simuliereShareData.imdData;
        document.getElementById("canvasUrlData").src = simuliereImgUrl;
        this.dialogs = "canvasUrlData";
        // this.hasVoice = true;
      },
      downloadVoice: function () {
        // Simuliere Download mit zufälliger Verzögerung
        setTimeout(() => {
          // Simuliere "localId" als Dummy-URL (hier kein echter Download, da keine Server-API)
          this.recordId =
            this.sharedata && this.sharedata.recordId
              ? this.sharedata.recordId
              : "";
        }, 500 + Math.random() * 500);
      },
      create_ercode: function () {
        $("#qrcode").empty();
        winSize.loadResReset();
        let text = this.sharedata.sharelink;
        new QRCode("qrcode", {
          text: text,
          width: 100,
          height: 100,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.L,
        });
        setTimeout(function () {
          HTMLCanvasElement.prototype.requestFullscreen = function () {
            /* blockiert Fullscreen */
          };
          cc.game.run();
        }, 500);
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
  var ua = navigator.userAgent.toLowerCase(); //获取判断用的对象
  // if (ua.match(/MicroMessenger/i) == "micromessenger") { //微信打开
  //   vueInit();
  // }
  // else {
  //   xwz = getQueryString("xwz_debug");
  //   if (xwz != null) {
  //     vueInit();
  //   }
  //   else {
  //     $("#ercode").show();
  //   }
  // }

  vueInit();
});
var touchobj = {};
var start = [],
  moving = false,
  istouch = false;
function onListenerTouch(obj) {
  var box = document.getElementById(obj);
  var boxGesture = setGesture(box);
  boxGesture.gesturescale = function (e) {
    if (v_main.touch) {
      winSize.imdData["imgId_" + currTouch].scale =
        e.scale * winSize.imdData["imgId_" + currTouch].bscale * 1;
      winSize.imdData["imgId_" + currTouch].rotate =
        e.rotation * 1 + winSize.imdData["imgId_" + currTouch].brotate * 1;
      document.getElementById("imgId_" + currTouch).style.transform =
        "scale(" +
        winSize.imdData["imgId_" + currTouch].scale +
        ") rotate(" +
        winSize.imdData["imgId_" + currTouch].rotate +
        "deg)";
    }
  };
  boxGesture.gesturemove = function (e) {
    if (v_main.touch) {
      winSize.imdData["imgId_" + currTouch].top += e.delta.deltaY;
      winSize.imdData["imgId_" + currTouch].left += e.delta.deltaX;
      winSize.imdData["imgId_" + currTouch].deltaY += e.delta.deltaY;
      winSize.imdData["imgId_" + currTouch].deltaX += e.delta.deltaX;
      $("#imgId_" + currTouch).css({
        marginTop: winSize.imdData["imgId_" + currTouch].top,
        marginLeft: winSize.imdData["imgId_" + currTouch].left,
      });
    }
  };
}
function setGesture(el) {
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
      start = e.touches;
      currTouch = e.touches[0].clientX < 320 ? 1 : 2;
      istouch = true;
      moving = false;
    },
    false
  );
  el.addEventListener(
    "touchmove",
    function (e) {
      e.preventDefault();
      if (istouch) {
        let now = e.touches; //得到第二组两个点
        if (e.touches.length >= 2) {
          let scale =
            getTouchScale(now[0], now[1]) / getTouchScale(start[0], start[1]); //得到缩放比例，getTouchScale是勾股定理的一个方法
          let rotation =
            getTouchAngle(now[0], now[1]) - getTouchAngle(start[0], start[1]); //得到旋转角度，getAngle是得到夹角的一个方法
          e.scale = scale.toFixed(2);
          e.rotation = rotation.toFixed(2);
          touchobj.gesturescale && touchobj.gesturescale.call(el, e);
        } else if (e.touches.length == 1) {
          e.delta = getTouchDistance(start[0], now[0]);
          touchobj.gesturemove && touchobj.gesturemove.call(el, e);
          start = e.touches;
        }
        moving = true;
      }
    },
    false
  );
  el.addEventListener(
    "touchend",
    function (e) {
      if (istouch) {
        istouch = false;
        if (!moving) {
          v_main.chooseImage(currTouch);
        } else {
          winSize.imdData["imgId_" + currTouch].bscale =
            winSize.imdData["imgId_" + currTouch].scale * 1;
          winSize.imdData["imgId_" + currTouch].brotate =
            winSize.imdData["imgId_" + currTouch].rotate * 1;
        }
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
function getTouchAngle(p1, p2) {
  let x = p1.pageX - p2.pageX,
    y = p1.pageY - p2.pageY;
  return (Math.atan2(y, x) * 180) / Math.PI;
}
function getTouchDistance(p1, p2) {
  return { deltaX: p2.pageX - p1.pageX, deltaY: p2.pageY - p1.pageY };
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
function initWxJsSdk() {
  // $.ajax({
  //   cache: false,
  //   async: false,
  //   type: "POST",
  //   url: "/act/getWeiXinToken.ashx",
  //   data: {
  //     thisUrl: location.href.split("#")[0],
  //   },
  //   success: function success(res) {
  //     var wxData = JSON.parse(res);
  //     wx.config({
  //       debug: false,
  //       appId: wxData.appId,
  //       timestamp: wxData.timestamp,
  //       nonceStr: wxData.nonceStr,
  //       signature: wxData.signature,
  //       jsApiList: [
  //         "onMenuShareTimeline",
  //         "onMenuShareAppMessage",
  //         "chooseImage",
  //         "previewImage",
  //         "uploadImage",
  //         "downloadImage",
  //         "startRecord",
  //         "stopRecord",
  //         "onVoiceRecordEnd",
  //         "playVoice",
  //         "pauseVoice",
  //         "stopVoice",
  //         "onVoicePlayEnd",
  //         "uploadVoice",
  //         "downloadVoice",
  //       ],
  //     });
  //   },
  // });
  // wx.ready(function () {
  //   isWx = true;
  //   initWeixinData(false);
  //   if (getQueryString("c") != null && v_main.sharedata.serverId_record) {
  //     //有录音
  //     v_main.downloadVoice();
  //   }
  // });
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
