// 动作管理对象
var ActionManager = {
    GP_RUN_TIMER : function(time,width,callback){
        var move = cc.moveBy(time,-width,0);
        var cb = cc.callFunc(function(event){
            callback();
        }.bind(this)); 
        var animate = cc.sequence(cc.delayTime(1),move,cb);
        animate.setTag("timer_sequence");
        return animate;
    }, 
    GP_RUN_TIMER_TEXT : function(time,callback){
        var cb = cc.callFunc(function(event){
            callback();
        }.bind(this)); 
        return cc.sequence(cc.delayTime(1),cb).repeatForever();
    }, 
    MM_ROLE_FLOAT : function(){
        var speed = 2;
        var move1 = cc.moveBy(speed,0,10);
        var move2 = cc.moveBy(speed,0,-10);
        return cc.sequence(move1,move2).repeatForever();
    },
    MM_TITLE_FLOAT : function(){
        var speed = 1;
        var fadeOut = cc.fadeTo(speed,200);
        var fadeIn = cc.fadeTo(speed*2,255);
        return cc.sequence(fadeOut,fadeIn,cc.delayTime(1)).repeatForever();
    },
    MM_ROLE_ROTATE : function(){
        var rotate = new cc.RotateBy(60, 360);
        return rotate.repeatForever();
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
    GP_ARTICLE_BLINK : function(){
        var speed = 1;
        var fadeOut = cc.fadeTo(speed,100);
        var fadeIn = cc.fadeTo(speed,255);
        return cc.sequence(fadeOut,fadeIn,cc.delayTime(1)).repeatForever();
    }
};