// 动作管理对象
var ActionManager = {
  GP_MOVE_MOON: function (setting, callback) {
    let duration = (setting.by- setting.ty)/640 * v_main.Game_moonspeed;
    let move = cc.moveTo(duration, setting.tx, setting.ty).easing(cc.easeSineIn());
    let scale = cc.scaleTo(duration, setting.ts).easing(cc.easeSineIn());
    var cb = cc.callFunc(() => {
      callback() || null;
    });
    return cc.sequence(cc.spawn(move, scale), cb);
  },
  GP_GUIDE_MOON: function (setting) {
    let duration = 0.8;
    let move = cc.moveTo(duration, setting.tx, setting.ty).easing(cc.easeSineIn());
    let scale = cc.scaleTo(duration, setting.ts).easing(cc.easeSineIn());
    let bink = new cc.Blink(2,4);
    return cc.sequence(cc.spawn(move, scale),cc.delayTime(0.3),bink);
  },
  GP_BTN_DOWN: function (callback) {
    let down = cc.moveBy(GameManager.belt.downDuration, 0, -GameManager.belt.downOffsetY);
    let up = cc.moveBy(GameManager.belt.downDuration, 0, GameManager.belt.downOffsetY);
    var cb = cc.callFunc(() => {
      callback() || null;
    });
    return cc.sequence(down, up, cb);
  },
  GP_ON_COMBO: function (callback) {
    let fadeIn = cc.fadeIn(0.25);
    let up = cc.moveBy(0.25, 0, 15);
    let fadeOut = cc.fadeOut(0.15);
    var cb = cc.callFunc(() => {
      callback() || null;
    });
    return cc.sequence(cc.spawn(fadeIn, up), fadeOut, cb);
  },
  GP_ON_MISS: function (callback) {
    let up = cc.moveBy(0.15, 0, 15);
    let fadeout = cc.fadeOut(0.25);
    var cb = cc.callFunc(() => {
      callback() || null;
    });
    return cc.sequence(up, fadeout, cb);
  },
  MM_TITLE_FLYIN: function (callback) {
    var speed = 1;
    var down = cc.moveBy(speed, 0, -400);
    var fadeIn = cc.fadeIn(speed);
    var cb = cc.callFunc(() => {
      callback() || null;
    });
    return cc.sequence(cc.spawn(down, fadeIn), cc.delayTime(2), cb);
  },
  MM_TITLE_FLOAT: function () {
    var speed = 2;
    var move1 = cc.moveBy(speed, 0, 15);
    var move2 = cc.moveBy(speed, 0, -15);
    return cc.sequence(move1, move2).repeatForever();
  },
  MM_BUTTON_IN: function (delay) {
    var fadeIn = cc.fadeTo(1, 255);
    return cc.sequence(cc.delayTime(delay), fadeIn);
  },
  GS_ROLE_DOWN: function (offsetY) {
    var speed = 0.8;
    var down = cc.moveBy(speed, 0, offsetY);
    var fadeIn = cc.fadeIn(speed);
    return cc.spawn(down, fadeIn);
  },
  GS_TITLE_IN: function (callback) {
    var speed = 0.8;
    var fadeIn = cc.fadeIn(speed);
    var cb = cc.callFunc(() => {
      callback() || null;
    });
    return cc.sequence(cc.delayTime(1.1), fadeIn,cb);
  }
};