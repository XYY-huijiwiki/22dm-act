// 动作管理对象
var ActionManager = {
  GP_ROLE_JUMP : function(role,callback){
    let speed = GameManager.speed.jumpDuration;
    let bezierConfig = [
      cc.p(role.x+60,role.y + GameManager.speed.jumpY-50), //起点控制点
      cc.p(role.x+GameManager.speed.jumpX*role.direction,role.y + GameManager.speed.jumpY),  //终点控制点
      cc.p(role.x+GameManager.speed.jumpX*role.direction,role.y + GameManager.speed.jumpY) //终点
    ];
    let move = cc.bezierTo(speed, bezierConfig);
    move = cc.moveBy(speed, GameManager.speed.jumpX*role.direction,GameManager.speed.jumpY);
    let cb = cc.callFunc(() => {
      callback() || null;
    });
    return cc.sequence(move,cb);
  },
  GP_ROLE_JUMP_DOWN : function(direction,deltaY){
    let speed = Math.abs(GameManager.speed.backDuration*deltaY/GameManager.speed.jumpY);
    let deltaX = GameManager.speed.jumpDownX*direction;
    let move = cc.moveBy(speed, deltaX, deltaY);
    return move;
  },
  GP_ROLE_DOWN : function(direction,deltaY){
    let speed = Math.abs(GameManager.speed.backDuration*deltaY/GameManager.speed.jumpY);
    let deltaX = -deltaY/GameManager.speed.jumpY*GameManager.speed.jumpX*direction;
    let move = cc.moveBy(speed, deltaX, deltaY);
    return move;
  },
  GP_ROLE_BACK : function(direction,callback){
    let deltaX = 640*direction;
    let deltaY = winSize.height;
    let duration = winSize.height/GameManager.speed.jumpY*GameManager.speed.backDuration;
    let move = cc.moveBy(duration, deltaX, deltaY);
    let cb = cc.callFunc(() => {
      callback() || null;
    });
    return cc.sequence(move,cb);
  },
  GP_GERM_MOVE : function(setting,callback){
    let moveup = cc.moveBy(GameManager.speed.germIn, setting.deltaX, setting.deltaY);
    let movedown = cc.moveBy(GameManager.speed.germout, -setting.deltaX, -setting.deltaY);
    let cb = cc.callFunc(() => {
      callback() || null;
    });
    return cc.sequence(moveup,cc.delayTime(GameManager.speed.germNextTime),movedown,cb);
  },
  GP_GERM_DEAD : function(setting){
    let movedown = cc.moveBy(GameManager.speed.germDead, -setting.deltaX, -setting.deltaY);
    return movedown;
  },
  GP_SKILL_IN : function(callback){
    let fadeIn = cc.fadeIn(0.3);
    let fadeOut = cc.fadeOut(0.3);
    let cb = cc.callFunc(() => {
      callback() || null;
    });
    return cc.sequence(fadeIn,cc.delayTime(GameManager.speed.skillDuration),fadeOut,cb);
  },
  GP_SKILL_DEAD : function(callback){
    let fadeOut = cc.fadeOut(0.3);
    let cb = cc.callFunc(() => {
      callback() || null;
    });
    return cc.sequence(fadeOut,cb);
  },
  GP_RUN_SKILL : function(type,callback){
    let fadeIn = cc.fadeIn(0.2);
    let fadeOut = cc.fadeOut(0.2);
    let delay = cc.delayTime(GameManager.speed.skillEffect[type]);
    let cb = cc.callFunc(() => {
      callback() || null;
    });
    return cc.sequence(fadeIn,delay,fadeOut,cb);
  },
  GP_ADD_SKILL_TIPS:function(callback){
    let fadeOut = cc.fadeOut(0.3);
    let cb = cc.callFunc(() => {
      callback() || null;
    });
    return cc.sequence(cc.delayTime(2),fadeOut,cb);
  },
  MM_TITLE_IN: function () {
    let duration = 0.5;
    let move = cc.moveBy(duration, -320, 0);
    return move;
  },
  MM_BUTTON_IN: function (delay) {
    let fadeIn = cc.fadeTo(1, 255);
    return cc.sequence(cc.delayTime(delay), fadeIn);
  },
  MM_ROLE_IN :function(duration,deltaX,deltaY,callback){
    let move = cc.moveBy(duration, deltaX, deltaY);
    let cb = cc.callFunc(() => {
      callback() || null;
    });
    return cc.sequence(move,cc.delayTime(0.3),cb);
  },
  MM_ROLE_FLOAT: function (duration, deltaX, deltaY) {
    let move1 = cc.moveBy(duration, -deltaX, deltaY);
    let move2 = cc.moveBy(duration, deltaX, -deltaY);
    return cc.sequence(move1, move2).repeatForever();
  },
  GS_TITLE_IN: function () {
    let duration = 0.5;
    let fadeIn = cc.fadeIn(duration);
    return fadeIn;
  },
  GS_BUTTON_FADE: function (delay) {
    var fadeIn = cc.fadeTo(1, 255);
    return cc.sequence(cc.delayTime(delay), fadeIn);
  }
};