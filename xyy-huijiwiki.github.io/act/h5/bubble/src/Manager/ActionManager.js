var ActionManager = {
  GP_DROP_TILES : function(callback){
    let move = cc.moveBy(0.5,0,-100);
    let cb = cc.callFunc(() => {
      callback();
    });
    return cc.sequence(move, cb);
  },
  GP_WELL_ROTATE: function (angle, callback) {
    let rotate = cc.rotateTo(0.08, angle);
    var cb = cc.callFunc(() => {
      callback();
    });
    return cc.sequence(rotate, cb);
  },
  GP_SHOOT_BUBBLE: function (shootdata) {
    let speed = shootdata.dy / winSize.height * 1 * winSize.scaleY;
    let move = cc.moveBy(speed*1, shootdata.dx * shootdata.direction, shootdata.dy);
    return move;
  },
  GP_BUBBLE_FADE_OUT : function(callback){
    let fadeOut = cc.fadeOut(0.5);
    var cb = cc.callFunc(() => {
      callback();
    });
    return cc.sequence(fadeOut,cb)
  },
  GP_BUBBLE_DROP_OUT : function(callback){
    let fadeOut = cc.fadeOut(0.3);
    let moveBy = cc.moveBy(0.3,0,-30);
    var cb = cc.callFunc(() => {
      callback();
    });
    return cc.sequence(new cc.delayTime(0.3),cc.spawn(moveBy,fadeOut),cb)
  },
  GS_ROLE_IN: function (targetX, targetY) {
    let speed = 0.5;
    let move = cc.moveTo(speed, targetX, targetY);
    let fadeIn = cc.fadeTo(speed, 255);
    return cc.spawn(move, fadeIn);
  },
  GS_BUTTON_FADE: function (deltaX, deltaY) {
    var fadeIn = cc.fadeTo(1.5, 255);
    return cc.sequence(cc.delayTime(1), fadeIn);
  },
  MM_TITLE_FLOAT: function () {
    var speed = 2;
    var move1 = cc.moveBy(speed, 0, 15);
    var move2 = cc.moveBy(speed, 0, -15);
    return cc.sequence(move1, move2).repeatForever();
  },
  MM_ROLE_FLOATIN: function (callback) {
    var move1 = cc.moveBy(0.5, 300, -600);
    var cb = cc.callFunc(() => {
      callback();
    });
    return cc.sequence(move1, cc.delayTime(0.5),cb);
  },
  MM_ROLE_FADE: function (speed, delay) {
    var fadeOut = cc.fadeTo(speed, 150);
    var fadeIn = cc.fadeTo(speed * 2, 255);
    return cc.sequence(fadeOut, fadeIn, cc.delayTime(delay)).repeatForever();
  }
};