// 动作管理对象
var AnctionManager = {
    fadeOutSpeed   : 0.3,
    fadeInSpeed    : 0.3, 
    onUpdateHP : function(node){
        var fade = cc.fadeOut(0.5);
        var cb = cc.callFunc(function(){
            node.removeFromParent();
        }.bind(this));
        var animate = cc.sequence(fade, cb);
        return animate;
    },
    onRemoveMonster : function(node){
        var frames = [];
        node.stopAllActions();
        var cb = cc.callFunc(function(){
            node.removeFromParent(); 
        }.bind(this));
        var str = 'bomb_' + (node.type<3?'s':'b');
        frames.push(cc.spriteFrameCache.getSpriteFrame(str+'_1.png'));
        frames.push(cc.spriteFrameCache.getSpriteFrame(str+'_2.png'));
        var animation = cc.animate(new cc.Animation(frames,0.01));
        var animate = cc.sequence(animation,cb);
        return animate;
    },
    onTransFromMoon : function(node,time){ 
        // var random = Math.floor(Math.random()*13+6);
        // node.mold = "moon";
        // console.info(random);
        node.stopAllActions();
        winSize.globalSpeed = 1;
        var frames = [];
        var cb = cc.callFunc(function(){
            node.runAction(this.onTransFromNormal(node));
        }.bind(this));
        var fadeOut = cc.fadeOut(this.fadeOutSpeed);
        var fadeIn =  cc.fadeIn(this.fadeInSpeed);
        frames.push(cc.spriteFrameCache.getSpriteFrame('ship_4.png'));
        var animation = cc.animate(new cc.Animation(frames,0.01));
        var delay = cc.delayTime(time);
        var animate = cc.sequence(fadeOut,animation,fadeIn,delay,cb);
        if(node.mold=="ice")
            cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_REMOVE_ICE_LAYER));
        node.mold = "moon";
        return animate;
    },
    onTransFromIce : function(node,time){ 
        node.stopAllActions();
        winSize.globalSpeed = winSize.iceSpeed;
        var frames = [];
        var cb = cc.callFunc(function(){
            node.runAction(this.onTransFromNormal(node));
        }.bind(this));
        var fadeOut = cc.fadeOut(this.fadeOutSpeed);
        var fadeIn =  cc.fadeIn(this.fadeInSpeed);
        frames.push(cc.spriteFrameCache.getSpriteFrame('ship_2.png'));
        var animation = cc.animate(new cc.Animation(frames,0.01));
        var delay = cc.delayTime(time);
        var animate = cc.sequence(fadeOut,animation,fadeIn,delay,cb);
        node.mold = "ice";
        return animate;
    },
    onTransFromMusic : function(node,time){ 
        node.stopAllActions();
        winSize.globalSpeed = 1;
        var frames = [];
        var cb = cc.callFunc(function(){
            node.runAction(this.onTransFromNormal(node));
        }.bind(this));
        var fadeOut = cc.fadeOut(this.fadeOutSpeed);
        var fadeIn =  cc.fadeIn(this.fadeInSpeed);
        frames.push(cc.spriteFrameCache.getSpriteFrame('ship_3.png'));
        var animation = cc.animate(new cc.Animation(frames,0.01));
        var delay = cc.delayTime(time);
        var animate = cc.sequence(fadeOut,animation,fadeIn,delay,cb);
        if(node.mold=="ice")
            cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_REMOVE_ICE_LAYER));
        node.mold = "music";
        return animate;
    },
    onTransFromNormal : function(node){
        node.stopAllActions();
        winSize.globalSpeed = 1;
        var frames = [];
        var cb = cc.callFunc(function(){
            if(node.mold=="ice")
                cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_REMOVE_ICE_LAYER));
            node.mold = "normal"; 
        }.bind(this)); 
        var fadeOut = cc.fadeOut(this.fadeOutSpeed);
        var fadeIn =  cc.fadeIn(this.fadeInSpeed);
        frames.push(cc.spriteFrameCache.getSpriteFrame('ship_1.png'));
        var animation = cc.animate(new cc.Animation(frames,0.01));
        var animate = cc.sequence(fadeOut,animation,fadeIn,cb);
        return animate;
    }
};
