// 动作管理对象
var ActionManager = {
  HAND_DOWN: function () {
    let duration = 0.1;
    let deltaY = 20
    let down = cc.moveBy(duration, 0, -deltaY);
    let up = cc.moveBy(duration, 0, deltaY);
    return cc.sequence(down, up);
  },
  CAR_RUN: function (car, direction, callback) {
    let delta = direction == 1 ? car.max - car.x : car.min - car.x;
    let duration = Math.abs(delta) / (car.max - car.min) * 2.5;
    let move = cc.moveBy(duration, delta, 0);
    let cb = cc.callFunc(() => { callback() || null; });
    return cc.sequence(move, cb);
  },
  WOLF_DOWN: function (deltaY, callback1,callback2) {
    let duration = GameManager.ropeDownDuration;
    let down = cc.moveBy(duration, 0, -deltaY);
    let up = cc.moveBy(duration, 0, deltaY);
    let cb1 = cc.callFunc(() => { callback1() || null; });
    let cb2 = cc.callFunc(() => { callback2() || null; });
    return cc.sequence(down, cc.delayTime(0.3), cb1, up, cb2);
  },
  ROPE_DOWN: function (deltaY) {
    let duration = GameManager.ropeDownDuration;
    let down = cc.moveBy(duration, 0, -deltaY);
    let up = cc.moveBy(duration, 0, deltaY);
    return cc.sequence(down, cc.delayTime(0.3), up);
  },
  FOOT_RUN: function (direction) {
    let duration = 0.25;
    let right = cc.rotateBy(duration, GameManager.maxRotationFoot);
    let center1 = cc.rotateBy(duration, -GameManager.maxRotationFoot);
    let left = cc.rotateBy(duration, -GameManager.maxRotationFoot);
    let center2 = cc.rotateBy(duration, GameManager.maxRotationFoot);
    if (direction == 1)
      return cc.sequence(right, center1, left, center2).repeatForever();
    else
      return cc.sequence(left, center2, right, center1).repeatForever();
  },
  FOOT_END : function(direction){
    let duration = 0.5;
    let open = cc.rotateBy(duration, direction*GameManager.maxRotationFoot);
    let delayTime = cc.delayTime(0.5);
    let close = cc.rotateBy(duration, -direction*GameManager.maxRotationFoot);
    return cc.sequence(open,delayTime,close);
  },
  DROP_BALL : function(callback){
    let rotate = cc.rotateBy(GameManager.dropBallDuration,30);
    let down = cc.moveBy(GameManager.dropBallDuration,0,-400);
    let cb = cc.callFunc(() => { callback() || null; });
    return cc.sequence(cc.delayTime(0.25),cc.spawn(rotate,down), cb);
  },
  EXIT_BALL : function(deltaX,deltaY,callback){
    let duration = 0.65;
    let rotate = cc.rotateBy(duration,-300);
    let move = cc.moveBy(duration,deltaX,deltaY);
    let cb = cc.callFunc(() => { callback() || null; });
    return cc.sequence(cc.spawn(rotate,move),cc.delayTime(1.2),cb);
  },
  LIGHT_SEQUENCE : function(callback){
    let fadeOut = cc.fadeOut(0.05);
    let cb = cc.callFunc(() => { callback() || null; });
    let fadeIn = cc.fadeIn(0.05);
    return cc.sequence(fadeOut,cb,fadeIn);
  },
  BEARD_RUN: function (direction) {
    let duration = 1;
    let right = cc.rotateBy(duration, GameManager.maxRotationBeard);
    let center1 = cc.rotateBy(duration, -GameManager.maxRotationBeard);
    let left = cc.rotateBy(duration, -GameManager.maxRotationBeard);
    let center2 = cc.rotateBy(duration, GameManager.maxRotationBeard);
    if (direction == 1)
      return cc.sequence(right, center1, left, center2).repeatForever();
    else
      return cc.sequence(left, center2, right, center1).repeatForever();
  }
};