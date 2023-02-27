// 动作管理对象
var ActionManager = {
    GP_BULLECT_NORMAL : function(callback){
      var setting = GameManager.bullectSetting["role_"+GameManager.currentRoleId];
      var move = cc.moveBy(setting.speed,setting.distance,0);
      var cb = cc.callFunc(function(event){
        callback() || null;
      });
      var delay = [0,0,0.15,0.2,0.2];
      var fadeIn = cc.fadeTo(0.005,255);
      return cc.sequence(cc.delayTime(delay[GameManager.currentRoleId-1]),fadeIn,move,cb);
    },
    GP_BULLET_ATTACK : function(rid,type,setting,callback){
      var speed = setting[1]/setting[0];
      var frames = [];
      for(var i=1;i<=setting[0];i++){
        var str = "bullet_"+rid+"_"+type+"_"+i+".png";
        frames.push(cc.spriteFrameCache.getSpriteFrame(str));
      }
      var cb = cc.callFunc(function(event){
        callback() || null;
      });
      var animate = cc.animate(new cc.Animation(frames,speed));
      return cc.sequence(animate,cc.delayTime(setting[2]),cb);
    },
    GP_BULLET_ATTACK_3 : function(setting,callback){
      var speedScale = setting[1];
      var speedMove = setting[2];
      var scale = cc.scaleTo(speedScale,setting[0],setting[0]);
      var moveBy = cc.moveBy(speedMove,1400,0);
      var cb = cc.callFunc(function(event){
        callback() || null;
      });
      return cc.sequence(scale,moveBy,cb);
    },
    GP_BULLET_ATTACK_4 : function(strength,setting,callback){
      var speedScale = setting[1];
      var speedMove = setting[2];
      var scale = cc.scaleTo(speedScale,setting[0],setting[0]);
      var moveBy = cc.moveBy(speedMove,100*strength,0);
      var cb = cc.callFunc(function(event){
        callback() || null;
      });
      return cc.sequence(scale,moveBy,cb);
    },
    GP_BULLET_ATTACK_5 : function(setting,callback){
      var speedScale = setting[1];
      var repeat = setting[2];
      var scale = cc.scaleTo(speedScale,setting[0],setting[0]);
      var frames = [];
      for(var i=1;i<=4;i++){
        var str = "bullet_5_1_"+i+".png";
        frames.push(cc.spriteFrameCache.getSpriteFrame(str));
      }
      var cb = cc.callFunc(function(event){
        callback() || null;
      });
      var animate = cc.animate(new cc.Animation(frames,0.03));
      return cc.sequence(scale,animate.repeat(repeat),cb);
    },
    //角色动画:蓄力
    GP_ROLE_ATTACK_BEFORE : function(rid){
      var roleSetting = GameManager.roleSetting["role_"+rid];
      var length = roleSetting.action.length[0];
      var speed = roleSetting.maxStrength/length/roleSetting.action.speed;
      var frames = [];
      for(var i=1;i<=length;i++){
        var str = "role_"+rid+"_"+i+".png";
        frames.push(cc.spriteFrameCache.getSpriteFrame(str));
      }
      var animate = cc.animate(new cc.Animation(frames,speed));
      return animate;
    }, 
    //角色动画:发射
    GP_ROLE_ATTACK_AFTER : function(rid){
      var roleSetting = GameManager.roleSetting["role_"+rid];
      var begin = roleSetting.action.length[0]; 
      var end = roleSetting.action.length[1];
      var speed = [0.005,0.005,0.05,0.02,0.001];
      var frames = [];
      for(var i=begin;i<=end;i++){
        var str = "role_"+rid+"_"+i+".png";
        frames.push(cc.spriteFrameCache.getSpriteFrame(str));
      }
      var animate = cc.animate(new cc.Animation(frames,speed[rid-1]));
      return cc.sequence(cc.delayTime(0.1),animate);
    },
     //角色动画:回位
    GP_ROLE_ATTACK_RESET : function(rid){
      var frames = [cc.spriteFrameCache.getSpriteFrame("role_"+rid+"_1.png")];
      var animate = cc.animate(new cc.Animation(frames,0.05));
      return animate;
    }, 
    //wid_5 突进计时器
    GP_WOLF_5_IN : function(setting){
      var length = 32;
      var frames = [];
      var move = cc.moveBy(setting.speed*length,-setting.deltaX,0);
      for(var i=1;i<=length;i++){
        var str = "wolf_"+setting.wid+"_1_"+i+".png";
        frames.push(cc.spriteFrameCache.getSpriteFrame(str));
      }
      var animate = cc.animate(new cc.Animation(frames,setting.speed));
      var fadeOut = new cc.fadeOut(0.2);
      var fadeIn = new cc.fadeIn(0.3);
      var move2 = cc.moveBy(0.3,-150,0);
      return cc.sequence(cc.spawn(animate,move).repeat(4),fadeOut,cc.spawn(move2,fadeIn)).repeatForever();
    },
    //wid_6 移列计时器
    GP_WOLF_6_IN : function(wolf){
      var length = 32;
      var frames = [];
      var move = cc.moveBy(wolf.setting.speed*length,-wolf.setting.deltaX,0);
      for(var i=1;i<=length;i++){
        var str = "wolf_"+wolf.setting.wid+"_1_"+i+".png";
        frames.push(cc.spriteFrameCache.getSpriteFrame(str));
      }
      var animate = cc.animate(new cc.Animation(frames,wolf.setting.speed));
      var fadeOut = new cc.fadeOut(0.2);
      var cb = cc.callFunc(function(){
        ActionManager.GP_WOLF_6_FLY(wolf);
      });
      wolf.runAction(cc.sequence(cc.spawn(animate,move).repeat(5),fadeOut,cb));
    },
    //wid_6 移列动画
    GP_WOLF_6_FLY : function(wolf){
      var r,y,z;
      do{
        r = Math.ceil(Math.random()*GameManager.zIndexY[0].length-1);
        r <= 0 ? 1 : r;
        y = GameManager.zIndexY[0][r]+20;
        z = GameManager.zIndexY[1][r];
      }while(wolf.setting.zIndex==z){
        wolf.setLocalZOrder(z);
        wolf.setting.zIndex = z;
        var fadeIn = new cc.fadeIn(0.3);
        var move2 = cc.moveTo(0.3,wolf.x,y);
        var cb = cc.callFunc(function(){
            ActionManager.GP_WOLF_6_IN(wolf);
        });
        wolf.runAction(cc.sequence(cc.spawn(fadeIn,move2),cb));
      }
    },
    //wid_6 特技让进攻者后退
    GP_WOLF_BACK : function(deltaX,callback){
      var move = cc.moveBy(0.5,deltaX,0);
      var cb = cc.callFunc(function(event){
        callback() || null;
      });
      return cc.sequence(move,cb);
    },
    //小狼兵进攻
    GP_WOLF_NORMAL_IN : function(setting){
      var length = 32;
      var frames = [];
      var move = cc.moveBy(setting.speed*length,-setting.deltaX,0);
      for(var i=1;i<=length;i++){
        var str = "wolf_"+setting.wid+"_1_"+i+".png";
        frames.push(cc.spriteFrameCache.getSpriteFrame(str));
      }
      var animate = cc.animate(new cc.Animation(frames,setting.speed));
      return cc.spawn(animate,move).repeatForever();
    },
    //越过禁止线返回
    GP_WOLF_OUT : function(setting){
      var length = setting.wid==8?24:32;
      var frames = [];
      var move = cc.moveBy(setting.speed*length,setting.deltaX,0);
      for(var i=1;i<=length;i++){
        var str = "wolf_"+setting.wid+"_2_"+i+".png";
        frames.push(cc.spriteFrameCache.getSpriteFrame(str));
      }
      var animate = cc.animate(new cc.Animation(frames,setting.speed));
      return cc.spawn(animate,move).repeatForever();
    },
    //进攻者被打死,消失
    GP_WOLF_DEAD : function(wolf,callback){
      var fadeOut = cc.fadeOut(0.3);
      var cb = cc.callFunc(function(event){
        callback() || null;
      });
      return cc.sequence(fadeOut,cb);
    },
    //冰冻技能出现
    GP_ICE_FADE:function(){
      var fadeIn = cc.fadeTo(0.5,255);
      return fadeIn;
    },
    //冰冻计时器
    GP_ICE_TIMER:function(callback){
      var cb = cc.callFunc(function(event){
        callback() || null;
      });
      return cc.sequence(cc.delayTime(GameManager.icespeed),cb).repeat(GameManager.icetime);
    },
    //爆破技能动画
    GP_BOMB:function(callback){
      var length = 19;
      var frames = [];
      for(var i=0;i<=length;i++){
        var str = "skill_b_"+i+".png";
        frames.push(cc.spriteFrameCache.getSpriteFrame(str));
      }
      var cb = cc.callFunc(function(){
        callback() || null;
      });
      var fadeOut = cc.fadeOut(0.3);
      var animate = cc.animate(new cc.Animation(frames,0.05));
      return cc.sequence(animate,fadeOut,cb);
    },
    //当前技能禁止使用
    GP_FORBID : function(callback){
      var fadeOut = cc.fadeIn(0.5);
      var cb = cc.callFunc(function(){
        callback() || null;
      });
      return cc.sequence(fadeOut,cb);
    },
    //Max提示
    GP_MAX : function(){
      var blink = new cc.blink(1,3);
      return blink.repeatForever();
    },
    GP_BOSS_TIPS :function(callback){
      var blink = new cc.blink(1,3);
      var cb = cc.callFunc(function(){
        callback() || null;
      });
      return cc.sequence(blink.repeat(5),cb);
    },
    GP_HP_OUT : function(callback){
      var speed = 0.8;
      var fadeOut = cc.fadeTo(speed,0);
      var move = cc.moveBy(speed,0,60);
      var cb = cc.callFunc(function(event){
        callback() || null;
      });
      return cc.sequence(cc.spawn(fadeOut,move),cb);
    },
    GP_CHEER : function(theme){
      var length = 20;
      var speed = 0.05;
      var frames = [];
      for(var i=1;i<=length;i++){
        var str = "cheer_"+i+".png";
        frames.push(cc.spriteFrameCache.getSpriteFrame(str));
      }
      var animate = cc.animate(new cc.Animation(frames,speed));
      return animate.repeatForever();
    },
    GS_THEME : function(theme){
      var length = [0,3,3,3];
      var speed = [0,0.1,0.1,0.1];
      var frames = [];
      for(var i=1;i<=length[theme];i++){
        var str = "theme_"+theme+"_"+i+".png";
        frames.push(cc.spriteFrameCache.getSpriteFrame(str));
      }
      var animate = cc.animate(new cc.Animation(frames,speed[theme]));
      return animate.repeatForever();
    },
    GS_STAR_ADD:function(i,callback){
      var speed = 0.5;
      var move = cc.moveBy(speed,0,-180);
      var cb = cc.callFunc(function(event){
          callback() || null;
      });
      return cc.sequence(cc.delayTime(0.65*i),cb,move);
    },
    GS_BUTTON_FADE:function(deltaX,deltaY){
      var fadeIn = cc.fadeTo(1.5,255);
      return cc.sequence(cc.delayTime(2),fadeIn);
    },
    //MM: 按钮进入
    MM_BUTTON_IN : function(delay){
      var fadeIn = cc.fadeTo(1,255);
      return cc.sequence(cc.delayTime(delay),fadeIn);
    },
    //MM: 其余角色进入
    MM_ROLE_IN : function(delay,x,y){
      var fadeIn = cc.fadeTo(0.5,255);
      var move = cc.moveTo(0.5,x,y);
      return cc.sequence(cc.delayTime(delay),cc.spawn(fadeIn,move));
    },
    //MM: 暖羊羊动画(正中间)
    MM_XI_LUAN : function(){
      var speed = 1.5;
      var move1 = cc.moveBy(speed,0,15);
      var move2 = cc.moveBy(speed,0,-15);
      return cc.sequence(move1,move2).repeatForever();
    },
    //MM: 标题进入
    MM_TITLE_IN : function(speed,deltaX,deltaY,callback){
      var cb = cc.callFunc(function(event){
        callback() || null;
      });
      var move = cc.moveBy(speed,deltaX,deltaY);
      return cc.sequence(move,cc.delayTime(0.1),cb);
    }
};