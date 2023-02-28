// 游戏管理对象
var GameManager = {
  speedMoonDuration: 5,
  speedMoonMax: 4.2,
  speedMoonMin: 1,
  speedMoonOffset: -0.07,
  speedBeltDuration: 6,
  speedBeltMax: 1.1,
  speedBeltMin: 0.2,
  speedBeltOffset: -0.02,
  currMoonPool: [],
  spriteBelt: null,
  spriteGuide : null,
  moonSetting: {
    y: {
      bx: 457 + 45,
      by: 539 + 80,
      bs: 0.3 - 0.15,
      tx: 230,
      ty: 143,
      ts: 1
    },
    b: {
      bx: 531 + 8,
      by: 557 + 62,
      bs: 0.3 - 0.15,
      tx: 472,
      ty: 143,
      ts: 1
    },
    r: {
      bx: 592 - 16,
      by: 558 + 62,
      bs: 0.3 - 0.15,
      tx: 713,
      ty: 143,
      ts: 1
    },
    g: {
      bx: 654 - 40,
      by: 562 + 58,
      bs: 0.3 - 0.15,
      tx: 951,
      ty: 143,
      ts: 1
    }
  },
  belt: {
    sequence: "ybrg",
    downOffsetY: 20,
    downDuration: 0.075,
    laser: [
      {
        x: 369,
        y: 377,
        s: 0.68,
      },
      {
        x: 499,
        y: 349,
        s: 0.75,
      },
      {
        x: 655,
        y: 327,
        s: 0.83,
      },
      {
        x: 795,
        y: 355,
        s: 0.76,
      }
    ],
    btn: [
      {
        x: 180,
        y: 0,
        z: 100
      },
      {
        x: 455,
        y: 0,
        z: 110
      },
      {
        x: 740,
        y: 0,
        z: 110
      },
      {
        x: 1010,
        y: 0,
        z: 100
      }
    ]
  },
  reset: function () {
    this.currMoonPool = [];
    this.spriteBelt = null;
    this.spriteGuide = null;
  },
  setButton: function (setting) {
    if (setting) {
      if(typeof(setting.s)=="undefined"){
        $("#" + setting.name).css({
          width: setting.w,
          height: setting.h,
          top: 640 - setting.y - setting.h / 2,
          left: setting.x - setting.w / 2
        });
      }
      else{
        $("#" + setting.name).css({
          width: setting.w,
          height: setting.h,
          top: 640 - setting.y - setting.h / 2,
          left: setting.x - setting.w / 2,
          "transform-origin":"left center",
          "transform" : "scale("+setting.s+")",
          "-webkit-transform" : "scale("+setting.s+")"
        });
      }
    }
  }
};