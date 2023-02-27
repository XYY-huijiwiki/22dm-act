// 动作管理对象
var ActionManager = {
    GP_ROPE_RUN : function(speed,direction,callback){
        var deltaX = direction==0 ? -winSize.width : winSize.width;
        var move = cc.moveBy(speed,deltaX ,-winSize.height-300);
        var cb = cc.callFunc(function(event){
            callback();
        });
        return cc.sequence(move,cb);
    },
    GP_CAR_BREAK : function(delay,callback){
        var frames = [];
        for(var i=1;i<=71;i++){
            var str = "car_"+i+".png";
            frames.push(cc.spriteFrameCache.getSpriteFrame(str));
        }
        var animate = cc.animate(new cc.Animation(frames,0.05));
        var cb = cc.callFunc(function(event){
            callback();
        });
        var audio = cc.callFunc(function(){
            winSize.playEffect('break');
        });
        return cc.sequence(cc.delayTime(delay),audio,animate,cb);
    },
    GP_ROLE_JUMP : function(role,callback){
        var moveBy = cc.moveBy(role.speed/role.mult,role.flippedX?role.deltaX*role.mult:-role.deltaX*role.mult,role.deltaY*role.mult);
        var frames = [];
        var length = [16,16,18];
        for(var i=1;i<=length[role.type];i++){
            var str = "role_"+role.type+"_"+i+".png";
            frames.push(cc.spriteFrameCache.getSpriteFrame(str));
        }
        var animate = cc.animate(new cc.Animation(frames,role.speed/role.mult/length[role.type]));
        var cb = cc.callFunc(function(event){
            callback();
        });
        winSize.playEffect('jump');
        return cc.sequence(cc.spawn(moveBy,animate),cb);
    }, 
    GP_ROLE_DOWN : function(role,callback){
        var speed = (role.y+80)*(role.speed/role.mult/role.deltaY)*0.8;
        var moveBy = cc.moveTo(speed,role.flippedX?role.x+role.deltaX*2*role.mult:role.x-role.deltaX*2*role.mult,-80);
        var cb = cc.callFunc(function(event){
            callback();
        });
        return cc.sequence(moveBy,cb);
    },
    GP_ROLE_BIGGER : function(){
        var blink = new cc.blink(0.8,6);
        winSize.playEffect('towolf');
        return blink;
    },
    GP_SKILL_FADE : function(){
        var fadeOut = cc.fadeTo(0.5,150);
        var fadeIn = cc.fadeTo(1,255);
        return cc.sequence(fadeOut,fadeIn).repeatForever();
    },
    GP_TIP_BIGGER : function(callback){
        var fadeIn = cc.fadeTo(1,255);
        var fadeOut = cc.fadeTo(1,0);
        var cb = cc.callFunc(function(event){
            callback();
        });
        return cc.sequence(fadeIn,cc.delayTime(3),fadeOut,cb);
    },
    GS_THEME : function(theme){
        var length = [40,40,16,26];
        var speed = [0.04,0.06,0.04,0.07];
        var frames = [];
        for(var i=1;i<=length[theme];i++){
            var str = "theme_"+theme+"_"+i+".png";
            frames.push(cc.spriteFrameCache.getSpriteFrame(str));
        }
        var animate = cc.animate(new cc.Animation(frames,speed[theme]));
        return animate.repeatForever();
    },
    GS_TITLE_RUN:function(deltaX,deltaY){
        var speed = 0.8;
        var moveTo = cc.moveTo(speed,deltaX,deltaY);
        return moveTo;
    },
    GS_BUTTON_FADE:function(deltaX,deltaY){
        var fadeIn = cc.fadeTo(1.5,255);
        return cc.sequence(cc.delayTime(3),fadeIn);
    },
    MM_TITLE_FLOAT : function(){
        var speed = 2;
        var move1 = cc.moveBy(speed,0,15);
        var move2 = cc.moveBy(speed,0,-15);
        return cc.sequence(move1,move2).repeatForever();
    },
    MM_ROLE_FADE : function(speed,delay){
        var fadeOut = cc.fadeTo(speed,150);
        var fadeIn = cc.fadeTo(speed*2,255);
        return cc.sequence(fadeOut,fadeIn,cc.delayTime(delay)).repeatForever();
    },
    RUN_MM_ENTRY : function(){
        var rotate = new cc.RotateBy(20,360);
        return rotate.repeatForever();
    }
};