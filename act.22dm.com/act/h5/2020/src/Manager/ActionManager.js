// 动作管理对象
var ActionManager = {
  MM_NODE_MOVE : function(duration,deltaX,deltaY,callback){
    let move = cc.moveBy(duration,deltaX,deltaY);
    let cb = cc.callFunc(() => { callback() || null; });
    return cc.sequence(move, cb);
  },
  MM_XI_IN : function(deltaX,deltaY,callback){
    let fadeIn = cc.fadeIn(0.5);
    let move = cc.moveBy(0.8,deltaX,deltaY);
    let cb = cc.callFunc(() => { callback() || null; });
    return cc.sequence(cc.spawn(fadeIn,move),cb);
  },
  MM_LIGHT_IN : function(){
    let rotate = cc.rotateBy(10,360);
    return rotate.repeatForever();
  },
  MM_LANTERN_ROTATE : function(duration){
    let right = cc.rotateBy(duration, GameManager.maxRotationLantern);
    let center1 = cc.rotateBy(duration, -GameManager.maxRotationLantern);
    let left = cc.rotateBy(duration, -GameManager.maxRotationLantern);
    let center2 = cc.rotateBy(duration, GameManager.maxRotationLantern);
    return cc.sequence(right, center1, left, center2).repeatForever();
  },
  GP_LANTERN_ROTATE : function(duration){
    let rotation = 3.5;
    let right = cc.rotateBy(duration, rotation);
    let center1 = cc.rotateBy(duration, -rotation);
    let left = cc.rotateBy(duration, -rotation);
    let center2 = cc.rotateBy(duration, rotation);
    return cc.sequence(right, center1, left, center2).repeatForever();
  },
  GP_MAP_SCALE : function(scale,callback){
    let scaleTo = new cc.scaleTo(0.5,scale,scale);
    let cb = cc.callFunc(() => { callback() || null; });
    return cc.sequence(cc.delayTime(0.3),scaleTo,cc.delayTime(0.5),cb);
  },
  FADE_IN : function(duration,callback){
    let fadeIn = cc.fadeIn(duration);
    let cb = cc.callFunc(() => { callback() || null; });
    return cc.sequence(fadeIn, cb);
  }
};