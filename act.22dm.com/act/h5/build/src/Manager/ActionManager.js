// 动作管理对象
var ActionManager = {
  GP_ROPE_SWAY: function (rope) {
    let rotate = GameManager.maxRotation / GameManager.speed;
    let duration = 1 * GameManager.speed;
    let swayL = cc.rotateBy(duration, rotate);
    let swayC1 = cc.rotateBy(duration, -rotate);
    let swayR = cc.rotateBy(duration, -rotate);
    let swayC2 = cc.rotateBy(duration, rotate);
    let cbL = cc.callFunc(() => { rope.direction = -0.5; });
    let cbC1 = cc.callFunc(() => { rope.direction = 1; });
    let cbR = cc.callFunc(() => { rope.direction = 0.5; });
    let cbC2 = cc.callFunc(() => { rope.direction = 1; });
    let sway = cc.sequence(cbL, swayL, cbC1, swayC1, cbR, swayR, cbC2, swayC2);
    return sway.repeatForever();
  },
  GP_ROPE_MOVE: function () {
    let delta = 80;
    let duration = 1 * GameManager.speed;
    let deltaL = cc.moveBy(duration, -delta, 0);
    let deltaC1 = cc.moveBy(duration, delta, 0);
    let deltaR = cc.moveBy(duration, delta, 0);
    let deltaC2 = cc.moveBy(duration, -delta, 0);
    let sway = cc.sequence(deltaL, deltaC1, deltaR, deltaC2);
    return sway.repeatForever();
  },
  GP_HOUSE_DROP: function (setting, callback) {
    let duration = Math.abs(setting.deltaY / winSize.height).toFixed(1) * 1;
    let move = cc.moveBy(duration, setting.deltaX, setting.deltaY);
    let rotate = cc.rotateBy(duration, setting.rotation);
    let cb = cc.callFunc(() => { callback() || null; });
    return cc.sequence(cc.spawn(move, rotate), cb);
  },
  GP_FLOOR_MOVE: function (deltaY, duration, callback) {
    let move = cc.moveBy(duration, 0, deltaY);
    let cb = cc.callFunc(() => { callback() || null; });
    return cc.sequence(move, cb);
  },
  GP_HOUSE_MOVE: function () {
    let duration = 40 / GameManager.level;
    let offsetX = 100 * ((GameManager.level > 10 ? 10 : GameManager.level) / 10);
    duration = duration > 2 ? 2 : duration < 0.8 ? 0.8 : duration;
    offsetX = offsetX < 10 ? 10 : offsetX; 
    let move1 = cc.moveBy(duration, offsetX, 0);
    let move2 = cc.moveBy(duration * 2, -offsetX * 2, 0);
    let move3 = cc.moveBy(duration, offsetX, 0);
    return cc.sequence(move1, move2, move3).repeatForever();
  },
  GP_BG_MOVE: function (deltaY, duration) {
    let move = cc.moveBy(duration, 0, deltaY);
    return move;
  },
  GP_MOON_MOVE: function (deltaY, duration) {
    let scale = cc.scaleTo(duration, deltaY, deltaY);
    return scale;
  },
  GP_HOUSE_FAIL: function (direction, callback) {
    let duration1 = 0.3;
    let rotate1 = cc.rotateBy(duration1, direction * 15);
    let move1 = cc.moveBy(duration1, direction * 480, -100);
    let cb = cc.callFunc(() => { callback() || null; });
    return cc.sequence(cc.spawn(rotate1, move1), cb);
  },
  GP_ON_MISS: function (callback) {
    let up = cc.moveBy(0.2, 0, 25);
    let fadeout = cc.fadeOut(0.3);
    let cb = cc.callFunc(() => {
      callback() || null;
    });
    return cc.sequence(up, fadeout, cb);
  },
  GP_BAT_FLY: function (duration, deltaX, deltaY, callback) {
    let move = cc.moveBy(duration, deltaX, deltaY);
    let cb = cc.callFunc(() => {
      callback() || null;
    });
    return cc.sequence(move, cb);
  },
  GP_SWEET_FLY: function (delay,duration, deltaX, deltaY, callback) {
    let move = cc.moveBy(duration, deltaX, deltaY);
    let cb = cc.callFunc(() => {
      callback() || null;
    });
    return cc.sequence(cc.delayTime(delay),move, cb);
  },
  MM_TITLE_IN: function () {
    let duration = 0.5;
    let move = cc.moveBy(duration, -320, 0);
    return move;
  },
  MM_BRANCH_IN: function (callback) {
    let duration = 1;
    let fadeIn = cc.fadeIn(duration);
    let cb = cc.callFunc(() => {
      callback() || null;
    });
    return cc.sequence(cc.delayTime(0.8), fadeIn, cb);
  },
  MM_BUTTON_IN: function (delay) {
    let fadeIn = cc.fadeTo(1, 255);
    return cc.sequence(cc.delayTime(delay), fadeIn);
  },
  MM_ROLE_FLOAT: function (duration, deltaX, deltaY) {
    let move1 = cc.moveBy(duration, -deltaX, deltaY);
    let move2 = cc.moveBy(duration, deltaX, -deltaY);
    return cc.sequence(move1, move2).repeatForever();
  },
  MM_SQUASH_SWAY: function () {
    let rotate = 10;
    let duration = 0.9;
    let swayL = cc.rotateBy(duration, rotate);
    let swayC1 = cc.rotateBy(duration, -rotate);
    let swayR = cc.rotateBy(duration, -rotate);
    let swayC2 = cc.rotateBy(duration, rotate);
    let sway = cc.sequence(swayL, swayC1, swayR, swayC2);
    return sway.repeatForever();
  },
  GS_MOON_MOVE: function (delay, duration, deltaX, deltaY, callback) {
    let move = cc.moveBy(duration, deltaX, deltaY);
    let cb = cc.callFunc(() => {
      callback() || null;
    });
    return cc.sequence(cc.delayTime(delay), move, cb);
  },
  GS_SEAL_BLINK: function () {
    let fadeIn = cc.fadeIn(0.5);
    let blink = new cc.Blink(2, 3);
    return cc.sequence(fadeIn, cc.delayTime(0.3), blink);
  },
  GS_TITLE_IN: function () {
    let duration = 0.5;
    let fadeIn = cc.fadeIn(duration);
    return cc.sequence(cc.delayTime(0.3), fadeIn);
  },
  GS_BUTTON_FADE: function (delay) {
    var fadeIn = cc.fadeTo(1, 255);
    return cc.sequence(cc.delayTime(delay), fadeIn);
  }
};