// 动作管理对象
var ActionManager = {
    GrowUp : function(index,length,callback){
        var cb = cc.callFunc(function(event){
            callback();
        }.bind(this)); 
        var frames = [];
        for(var i=2;i<=length;i++){
            var str = 'tree_'+index+'_'+i+".png";
            frames.push(cc.spriteFrameCache.getSpriteFrame(str));
        }
        var animate = cc.animate(new cc.Animation(frames,0.03));
        return cc.sequence(animate,cb);
    }, 
    Water : function(callback){
        var cb = cc.callFunc(function(event){
            callback();
        }.bind(this)); 
        var frames = [];
        var length = 60;
        for(var i=2;i<=length;i++){
            var str = 'water_'+i+".png";
            frames.push(cc.spriteFrameCache.getSpriteFrame(str));
        }
        var animate = cc.animate(new cc.Animation(frames,0.04));
        return cc.sequence(animate,cb);
    }, 
    MM_ROLE_FLOAT : function(){
        var speed = 2;
        var move1 = cc.moveBy(speed,0,10);
        var move2 = cc.moveBy(speed,0,-10);
        return cc.sequence(move1,move2).repeatForever();
    }
};