// 游戏管理对象
var GameManager = {
  rowD : 0.4,
  rowX : 90,
  rowY : 90,
  blockDuration : 0.75, //2020进入时间
  maxRotationLantern : 5, // 灯笼摇摆角度
  lanternDuration : 1.5, //灯笼摇摆时间
  lotteryRandom : 0.75,
  lotteryCover : 0.003,
  lotteryGoods : 0.001,
  setButton: function (setting) {
    if (setting) {
      $("#" + setting.name).css({
        width: setting.w,
        height: setting.h,
        top: winSize.height - setting.y - setting.h / 2,
        left: setting.x - setting.w / 2
      });
    }
  }
};