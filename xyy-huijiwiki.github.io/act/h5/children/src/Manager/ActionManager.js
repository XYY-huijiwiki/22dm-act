// 动作管理对象
var ActionManager = {
    GP_ROLE_UP : function(speed,height,upDelay,downDelay,callback){
        var up = cc.moveBy(speed,0,height);
        var down = up.clone().reverse();
        var cb = cc.callFunc(function(event){
            callback();
        }); 
        if(upDelay==0)
            return cc.sequence(up,cc.delayTime(downDelay),down,cb);
        else
            return cc.sequence(cc.delayTime(upDelay),up,cc.delayTime(downDelay),down,cb);
    },
    GP_ROLE_COLLIDE : function(type,by,y,up,callback){
        var length = [14,26,13,13,2];
        var name = ['mouse','bomb','xi','mei','wolf'];
        var s = [0.025,0.02,0.025,0.025,0.25];
        var speed = s[type]*(y/(by+up));
        var cb = cc.callFunc(function(event){
            callback();
        }); 
        var frames = [];
        for(var i=1;i<=length[type];i++){
            var str = name[type]+'_'+i+".png";
            frames.push(cc.spriteFrameCache.getSpriteFrame(str));
        }
        var animate = cc.animate(new cc.Animation(frames,speed));
        var down = cc.moveBy(speed*length[type]-0.1,0,by-y);
        //return cc.sequence(animate,cb);
        //return cc.sequence(cc.spawn(animate,down),cb);
        return cc.sequence(cc.spawn(animate,cc.sequence(cc.delayTime(0.1),down)),cb);
    },
    GP_SKILL_TEXT : function(){
        var speed = 1;
        var frames = [];
        for(var i=0;i<=9;i++){
            var str = "sn_"+i+".png";
            frames.push(cc.spriteFrameCache.getSpriteFrame(str));
        }
        var animate = cc.animate(new cc.Animation(frames,speed));
        return animate;
    },
    GP_SKILL_FORBID : function(callback){
        var speed = 0.1;
        var fadeOut = new cc.FadeOut(speed);
        var cb = cc.callFunc(function(event){
            callback();
        }); 
        return cc.sequence(cc.delayTime(0.2),fadeOut,cb);
    },
    GP_SKILL_COLLIDE : function(x,callback){
        var speed = 0.5;
        var scale = new cc.ScaleBy(0.5, speed);
        var move = new cc.MoveTo(speed,x,195);
        var fadeOut = new cc.FadeOut(speed);
        var cb = cc.callFunc(function(event){
            callback();
        }); 
        return cc.sequence(cc.spawn(scale,move,fadeOut),cb);
    },
    GP_SKILL_BOMB : function(callback){
        var speed = 0.02;
        var frames = [];
        for(var i=0;i<=19;i++){
            var str = "skill_b_"+i+".png";
            frames.push(cc.spriteFrameCache.getSpriteFrame(str));
        }
        var animate = cc.animate(new cc.Animation(frames,speed));
        var cb = cc.callFunc(function(event){
            callback();
        }); 
        return cc.sequence(animate,cb);
    },
    GP_SKILL_ICE : function(callback){
        var speed = 0.25;
        var fadeIn = new cc.FadeIn(speed);
        var fadeOut = new cc.FadeOut(speed);
        var cb = cc.callFunc(function(event){
            callback();
        }); 
        return cc.sequence(fadeIn,cc.delayTime(winSize.IceTime),fadeOut,cb);
    },
    GP_SCORE_TIP : function(callback){
        var speed = 0.1;
        var fadeOut = cc.fadeOut(speed);
        var cb = cc.callFunc(function(event){
            callback();
        }); 
        return cc.sequence(cc.delayTime(0.3),fadeOut,cb);
    },
    GP_COMBO_TIP : function(callback){
        var speed = 0.6;
        var move = cc.moveBy(speed,0,60);
        var fadeOut = new cc.FadeOut(speed);
        var cb = cc.callFunc(function(event){
            callback();
        }); 
        return cc.sequence(cc.spawn(fadeOut,move),fadeOut,cb);
    },
    BALL_FLOAT : function(delay,height){
        var speed = 2;
        var move1 = cc.moveBy(speed,0,height);
        var move2 = cc.moveBy(speed,0,-height);
        return (cc.sequence(move1,move2).repeatForever());
    },
    MM_START_FLOAT : function(height){
        var speed = 2;
        var move1 = cc.moveBy(speed,0,30);
        var move2 = cc.moveBy(speed,0,-30);
        return cc.sequence(move1,move2).repeatForever();
    },
    MM_RULE_FLOAT : function(delay,height){
        var speed = 2;
        var move1 = cc.moveBy(speed,0,15);
        var move2 = cc.moveBy(speed,0,-15);
        return cc.sequence(move1,move2).repeatForever();
    },
    MM_RECORD_FLOAT : function(delay,height){
        var speed = 2;
        var move1 = cc.moveBy(speed,0,5);
        var move2 = cc.moveBy(speed,0,-5);
        return cc.sequence(move1,move2).repeatForever();
    },
    GP_RUN_TIMER_TEXT : function(time,callback){
        var cb = cc.callFunc(function(event){
            callback();
        }); 
        return cc.sequence(cc.delayTime(1),cb).repeatForever();
    }, 
    GP_HP_RUN : function(isAdd){
        var fade = new cc.FadeIn(0.5);
        return isAdd ? fade : fade.reverse();
    },
    GP_ADD_TIP : function(callback){
        var speed = 0.5;
        var move = cc.moveBy(speed,0,50);
        var fade = new cc.FadeOut(speed);
        var cb = cc.callFunc(function(event){
            callback();
        }); 
        return cc.sequence(cc.spawn(move,fade),cb);
    },
    GP_ADD_HAMMER : function(callback){
        var cb = cc.callFunc(function(event){
            callback();
        }); 
        var frames = [];
        var length = 13;
        for(var i=1;i<=length;i++){
            var str = 'hammer_'+i+".png";
            frames.push(cc.spriteFrameCache.getSpriteFrame(str));
        }
        var animate = cc.animate(new cc.Animation(frames,0.02));
        return cc.sequence(animate,cb);
    },
    MM_TITLE_FLOAT : function(){
        var speed = 1;
        var fadeOut = cc.fadeTo(speed,150);
        var fadeIn = cc.fadeTo(speed*2,255);
        return cc.sequence(fadeOut,fadeIn,cc.delayTime(1)).repeatForever();
    }
};