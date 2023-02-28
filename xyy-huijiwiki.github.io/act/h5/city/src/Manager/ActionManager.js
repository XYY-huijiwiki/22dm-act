// 动作管理对象
var ActionManager = {
    MM_ROLE_RUN : function(type,callback){
        var length = [18,25];
        var name = ['h','l'];
        var speed = 0.04;
        var cb = cc.callFunc(function(event){
            callback();
        }); 
        var frames = [];
        for(var i=1;i<=length[type];i++){
            var str = name[type]+'_'+i+".png";
            frames.push(cc.spriteFrameCache.getSpriteFrame(str));
        }
        var animate = cc.animate(new cc.Animation(frames,speed));
        return cc.sequence(animate,cc.delayTime(0.5),cb);
    },
    MM_TITLE_FLOAT : function(){
        var speed = 2;
        var move1 = cc.moveBy(speed,0,15);
        var move2 = cc.moveBy(speed,0,-15);
        return cc.sequence(move1,move2).repeatForever();
    }
};