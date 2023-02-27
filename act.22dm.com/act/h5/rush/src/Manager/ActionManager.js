// 动作管理对象
var ActionManager = {
  GP_ROLE_IN: function (delatX, callback) {
    let move = cc.moveBy(1.5, delatX, 0);
    let cb = cc.callFunc(function () {
      callback() || null;
    });
    return cc.sequence(move, cb);
  },
  GP_ROLE_RUN: function () {
    var speed = 0.12;
    var frames = [];
    var a = [0, 1, 2];
    for (var i = 0; i < a.length; i++) {
      var str = "role_" + v_main.roleId + "_" + a[i] + ".png";
      frames.push(cc.spriteFrameCache.getSpriteFrame(str));
    }
    var animate = cc.animate(new cc.Animation(frames, speed));
    return animate.repeatForever();
  },
  GP_ROLE_JUMP: function (callback) {
    let moveUp = cc.moveBy(GameManager.jumpS, 0, GameManager.jumpY);
    let cb = cc.callFunc(function () {
      callback() || null;
    });
    return cc.sequence(moveUp, cb);
  },
  GP_ROLE_DROP: function (callback) {
    let moveDown = cc.moveBy(GameManager.jumpS * ((winSize.height + 100) / GameManager.jumpY), 0, -winSize.height);
    let cb = cc.callFunc(function () {
      callback() || null;
    });
    return cc.sequence(moveDown, cb);
  },
  GP_ROLE_DEAD: function () {
    return cc.fadeOut(0.3);
  },
  GP_ROLE_BLINK: function () {
    return cc.blink(0.6, 5);
  },
  GP_BRIDGE_MOVE: function (delatX, callback) {
    let speed = (GameManager.bridgeSpeedEach * delatX / 100) * v_main.Game_speed;
    let move = cc.moveBy(speed, -delatX, 0);
    var cb = cc.callFunc(function () {
      callback() || null;
    });
    return cc.sequence(move, cb);
  },
  GP_BRIDGE_MOVEY: function (delatY) {
    let speed = GameManager.getCeilInt(1, 2);
    let move1 = cc.moveBy(speed, 0, delatY);
    let move2 = cc.moveBy(speed, 0, -delatY);
    return cc.sequence(move1, move2).repeatForever();
  },
  GP_GERM_JUMP: function (item) {
    let min = item.setting.minx - item.x;
    let max = item.setting.maxx - item.setting.minx;
    let move1 = cc.jumpBy(Math.abs(GameManager.germSpeedJ * (min / GameManager.germJumpX)), min, 0, GameManager.germJumpY, Math.abs(Math.floor(min / GameManager.germJumpX)));
    let move2 = cc.jumpBy(GameManager.germSpeedJ * (max / GameManager.germJumpX), max, 0, GameManager.germJumpY, Math.ceil(max / GameManager.germJumpX));
    let move3 = cc.jumpBy(GameManager.germSpeedJ * (max / GameManager.germJumpX), -max, 0, GameManager.germJumpY, Math.ceil(max / GameManager.germJumpX));
    var cb = cc.callFunc(function () {
      item.flippedX = !item.flippedX;
    });
    return cc.sequence(cc.delayTime(0.3), move1, cc.sequence(cb, move2, cb, move3).repeat(10));
  },
  GP_GERM_MOVE: function (item) {
    let min = item.setting.minx - item.x;
    let max = item.setting.maxx - item.setting.minx;
    let move1 = cc.moveBy(Math.abs(GameManager.germSpeedM * (min / 100)), min, 0);
    let move2 = cc.moveBy(GameManager.germSpeedM * (max / 100), max, 0);
    let move3 = cc.moveBy(GameManager.germSpeedM * (max / 100), -max, 0);
    var cb = cc.callFunc(function () {
      item.flippedX = !item.flippedX;
    });
    return cc.sequence(cc.delayTime(0.3), move1, cc.sequence(cb, move2, cb, move3).repeat(10));
  },
  GP_GERM_OUT: function (callback) {
    let fadeOut = cc.fadeOut(0.2);
    var cb = cc.callFunc(function () {
      callback() || null;
    });
    return cc.sequence(fadeOut, cb);
  },
  GP_GOLD_EAT: function (callback) {
    let speed = 0.1;
    let fadeOut = cc.fadeOut(speed);
    let moveup = cc.moveBy(speed, 0, 80);
    var cb = cc.callFunc(function () {
      callback() || null;
    });
    return cc.sequence(cc.spawn(moveup, fadeOut), cb);
  },
  GP_SKILL_EAT: function (callback) {
    let speed = 0.5;
    let fadeOut = cc.fadeOut(speed);
    let move = cc.moveBy(speed, 0, 320);
    let scale = cc.scaleTo(speed, 1.5, 1.5);
    var cb = cc.callFunc(function () {
      callback() || null;
    });
    return cc.sequence(cc.spawn(move, scale, fadeOut), cb);
  },
  GP_SKILL_IN: function (callback) {
    let speed = 0.2;
    let fadeIn = cc.fadeIn(speed);
    let fadeOut = cc.fadeOut(speed);
    var cb = cc.callFunc(function () {
      callback() || null;
    });
    return cc.sequence(fadeIn, cc.delayTime(GameManager.skilltimer - speed * 2), fadeOut, cb);
  },
  GP_SKILL_TIMER: function (callback) {
    var cb = cc.callFunc(function () {
      callback() || null;
    });
    return cc.sequence(cc.delayTime(GameManager.skilltimer), cb);
  },
  MM_ROLE_MOVE: function () {
    var speed = 1.5;
    var move1 = cc.moveBy(speed, 0, 15);
    var move2 = cc.moveBy(speed, 0, -15);
    return cc.sequence(move1, move2).repeatForever();
  },
  MM_TITLE_MOVE: function () {
    var rotate = 5;
    var speed = .1;
    return cc.sequence(cc.delayTime(3), cc.sequence(cc.rotateBy(speed, rotate), cc.rotateBy(speed, -rotate)).repeat(2)).repeatForever();
  },
  MM_ROLE_FADE: function (delayTime) {
    return cc.sequence(cc.fadeTo(0.5, 150), cc.fadeTo(0.5, 255), cc.delayTime(delayTime)).repeatForever();
  },
  GS_ROLE_DOWN: function (deltaY, callback) {
    let speed = 1;
    let fadeIn = cc.fadeIn(speed);
    let move = cc.moveBy(speed, 0, deltaY);
    var cb = cc.callFunc(function () {
      callback() || null;
    });
    return cc.sequence(cc.spawn(move, fadeIn), cc.delayTime(0.3), cb);
  },
  GS_ROLE_BLINK: function () {
    let speed = 1.3;
    let fadeIn = cc.fadeTo(speed, 255);
    let fadeOut = cc.fadeTo(speed, 180);
    return cc.sequence(fadeOut, fadeIn).repeatForever();
  },
  GS_ROLE_FLOAT: function () {
    let speed = 1.5;
    let deltaY = 20;
    let moveUp = cc.moveBy(speed, 0, deltaY);
    let moveDown = cc.moveBy(speed, 0, -deltaY);
    return cc.sequence(moveUp, moveDown).repeatForever();
  },
  GS_TITLE_FADEIN: function () {
    let speed = 0.5;
    let fade = cc.fadeIn(speed);
    return fade;
  },
  GS_WORD_ROTATE : function(){
    var rotate = 5;
    var speed = .1;
    return cc.sequence(cc.delayTime(1.5), cc.sequence(cc.rotateBy(speed, rotate), cc.rotateBy(speed, -rotate)).repeat(2)).repeatForever();
  }
};