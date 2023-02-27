// 动作管理对象
var ActionManager = {
  GP_DELAY: function (delay, callback) {
    let cb = cc.callFunc(function () {
      callback() || null;
    });
    return cc.sequence(cc.delayTime(delay), cb);
  },
  GP_PART_CUT: function (speed, delatX, delatY, scale, callback) {
    let m = cc.moveBy(speed, delatX, delatY);
    let s = cc.scaleTo(speed, scale);
    let f = cc.fadeTo(speed, GameManager.cutOpacity);
    let cb = cc.callFunc(function () {
      callback() || null;
    });
    return cc.sequence(cc.spawn(m, s, f), cb);
  },
  GP_NODE_MOVE: function (delay, speed, delatX, delatY, scale, callback) {
    let m = cc.moveBy(speed, delatX, delatY);
    let s = cc.scaleTo(speed, scale);
    let cb = cc.callFunc(function () {
      callback() || null;
    });
    return cc.sequence(cc.delayTime(delay), cc.spawn(m, s), cb);
  },
  GP_NODE_FADE: function (speed, opacity, callback) {
    let f = cc.fadeTo(speed, opacity);
    let cb = cc.callFunc(function () {
      callback() || null;
    });
    return cc.sequence(f, cb);
  },
  GP_NODE_FADE_DELAY: function (delay, speed, opacity, callback) {
    let f = cc.fadeTo(speed, opacity);
    let cb = cc.callFunc(function () {
      callback() || null;
    });
    return cc.sequence(cc.delayTime(delay), f, cb);
  },
  GP_1_ROLEIN: function (speed, delatX, delatY, count, callback) {
    let move = cc.moveBy(speed / count, delatX / count, delatY / count);
    let cb = cc.callFunc(function () {
      callback() || null;
    });
    return cc.sequence(move, cb).repeat(count);
  },
  GP_3_HAND_MOVE: function (speed, delatX, delatY, callback) {
    let move = cc.moveBy(speed, delatX, delatY);
    let cb = cc.callFunc(function () {
      callback() || null;
    });
    return cc.sequence(move, cb);
  },
  GP_4_ROLEIN: function (footTime, moveTime, totalTime, delatX, delatY, callback) {
    let countmove = moveTime / footTime;
    let countrun = (totalTime - 2 * moveTime) / footTime;
    let movein = cc.moveBy(footTime, delatX / countmove, delatY / countmove);
    let moveount = cc.moveBy(footTime, delatX / countmove, delatY / countmove);
    let cb = cc.callFunc(function () {
      callback() || null;
    });
    let ccin = cc.spawn(movein, cb).repeat(countmove);
    let ccrun = cc.spawn(cc.delayTime(footTime), cb).repeat(countrun);
    let ccout = cc.spawn(moveount, cb).repeat(countmove);
    return cc.sequence(ccin, ccrun, ccout);
  },
  GP_7_ROTATE: function (speed, rotate) {
    let a = cc.rotateBy(speed, rotate);
    let b = cc.rotateBy(speed * 2, -rotate * 2);
    let c = cc.rotateBy(speed, rotate);
    return cc.sequence(a, b, c).repeatForever();
  },
  GP_WORD_RUN: function (speed, callback) {
    let fade = cc.fadeIn(speed);
    let cb = cc.callFunc(function () {
      callback() || null;
    });
    return cc.sequence(fade, cb);
  },
  GP_RUN_FRAMES: function (name, imgtype, length, speed) {
    let frames = [];
    for (let i = 1; i <= length; i++) {
      let str = `${name}_${i}.${imgtype}`;
      frames.push(cc.spriteFrameCache.getSpriteFrame(str));
    }
    let animate = cc.animate(new cc.Animation(frames, speed));
    return animate.repeatForever();
  }
};