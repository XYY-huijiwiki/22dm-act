// 动作管理对象
var ActionManager = {
    MM_ROLE_FLOAT : function(){
        var speed = 2;
        var move1 = cc.moveBy(speed,0,10);
        var move2 = cc.moveBy(speed,0,-10);
        return cc.sequence(move1,move2).repeatForever();
    },
    MM_TITLE_FLOAT : function(){
        var speed = 1;
        var fadeOut = cc.fadeTo(speed,130);
        var fadeIn = cc.fadeTo(speed*2,255);
        return cc.sequence(fadeOut,fadeIn,cc.delayTime(1)).repeatForever();
    },
    GP_TIMER_ROTATE : function(){
        var speed = 0.045;
        var offset = 10;
        var left = new cc.RotateBy(speed, -offset);
        var double = new cc.RotateBy(2*speed, offset*2);
        var right = new cc.RotateBy(speed, -offset);
        var delay = cc.delayTime(3);
        return cc.sequence(delay,cc.sequence(left,double,right).repeat(5)).repeatForever();
    },
    GP_RUN_TIMER : function(time,width,callback){
        var move = cc.moveBy(time,-width,0);
        var cb = cc.callFunc(function(event){
            callback();
        }.bind(this)); 
        var animate = cc.sequence(move,cb);
        animate.setTag("timer_sequence");
        return animate;
    }, 
    GP_RUN_TIMER_TEXT : function(time,callback){
        var cb = cc.callFunc(function(event){
            callback();
        }.bind(this)); 
        return cc.sequence(cc.delayTime(1),cb).repeatForever();
    }, 
    GP_ARTICLE_FIND : function(callback){
        var speed = 0.5;
        var fadeOut = cc.fadeOut(speed);
        var scaleTo = cc.scaleTo(speed,0.5,0.5);
        var cb = cc.callFunc(function(event){
            callback();
        }.bind(this)); 
        return cc.sequence(cc.spawn(fadeOut,scaleTo),cb);
    },
    GP_ARTICLE_LOSE : function(callback){
        var speed = 0.06;
        var deltaX = 5;
        var moveLeft1 = cc.moveBy(speed,-deltaX,0);
        var moveRight2 = cc.moveBy(speed*2,deltaX*2,0);
        var moveLeft2 = cc.moveBy(speed*2,-deltaX*2,0);
        var moveRight1 = cc.moveBy(speed,deltaX,0);
        var cb = cc.callFunc(function(event){
            callback();
        }.bind(this)); 
        return cc.sequence(moveLeft1,moveRight2,moveLeft2,moveRight1,cc.delayTime(1),cb);
    },
    GP_ARTICLE_REARRANGE : function(callback){
        var speed = 0.6;
        var rotate = new cc.RotateBy(speed, 360);
        var cb = cc.callFunc(function(event){
            callback();
        }.bind(this)); 
        return cc.sequence(rotate,cb);
    },
    GP_ARTICLE_REARRANGE_MOVE : function(position){
        var speed = 0.5;
        return cc.moveTo(speed,position.x,position.y);
    },
    GP_ARTICLE_TIP : function(callback){
        var speed = 0.5;
        var fadeOut = cc.fadeOut(speed);
        var cb = cc.callFunc(function(event){
            callback();
        }.bind(this)); 
        return cc.sequence(cc.delayTime(0.5),fadeOut,cb);
    },
    GP_ARTICLE_BLINK : function(){
        var speed = 0.5;
        var fadeOut = cc.fadeTo(speed,80);
        var fadeIn = cc.fadeTo(speed,255);
        return cc.sequence(fadeOut,fadeIn).repeatForever();
    },
    GP_ADD_TIMER_TIP : function(callback){
        var speed = 0.5;
        var move = cc.moveBy(speed,0,50);
        var fadeOut = cc.fadeOut(speed);
        var cb = cc.callFunc(function(event){
            callback();
        }.bind(this)); 
        return cc.sequence(cc.delayTime(0.5),cc.spawn(fadeOut,move),cb);
    },
    GP_MOVE_MAP : function(x,y,callback){
        var speed = 0.5;
        var move = cc.moveTo(speed,x,y);
        var cb = cc.callFunc(function(event){
            callback();
        }.bind(this)); 
        return cc.sequence(move,cc.delayTime(0.1),cb);
    },
    GP_FORBID_TIP : function(callback){
        var speed = 1;
        var fadeOut = cc.fadeOut(speed);
        var cb = cc.callFunc(function(event){
            callback();
        }.bind(this)); 
        return cc.sequence(fadeOut,cb);
    }
};