// 动作管理对象
var ActionManager = {
    RunSpeed            : 10,
    EnemyLength         :[[12,7],[4,8],[8,23],[5,7],[6,16],[7,15]],
    _mm_role_eye        : null,     
    _mm_role_dance      : null, //首页跳舞动作
    _gp_bg_run          : null,
    GP_BG_RUN :function(ui,speed){
        var animate = cc.moveBy(speed*(winSize.CreatEach-0.5),0,-2016*winSize.CreatEach+winSize.height);
        var reverse = animate.clone().reverse();
        var delay = cc.delayTime(1);
        ui.pauseBtn.runAction(cc.sequence(delay.clone(),reverse));
        ui.topBar.runAction(cc.sequence(delay.clone(),reverse.clone()));
        var cb = cc.callFunc(function(event){
            console.info("下一关");
            cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_NEXT_LEVEL));
        }.bind(this));
        return cc.sequence(delay.clone(),animate,cc.delayTime(winSize.LevelDelayTime),cb);
    },
    GP_ROLE_RUN :function(PointList,speed){
        var frames = [];
        var length = 12;
        var MoveList = [];
        for(var i=2;i<=length;i++){
            var str = 'r_0_1_'+i+".png";
            frames.push(cc.spriteFrameCache.getSpriteFrame(str));
        }
        for(var i=0;i<PointList.length;i++){
            MoveList.push(cc.moveBy((speed/2016)*PointList[i].y,PointList[i].x,PointList[i].y));
        }
        var animation = cc.sequence(MoveList).repeat(winSize.CreatEach);
        // var cb = cc.callFunc(function(event){
        //     console.info("下一关");
        //     cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_NEXT_LEVEL));
        // }.bind(this)); 
        return cc.sequence(cc.delayTime(0.5),animation);
    },
    GP_ENEMY_NORMAL : function(random){
        var frames = [];
        var length = ActionManager.EnemyLength[random][0];
        for(var i=2;i<=length;i++){
            var str = 'r_'+random+"_1_"+i+".png";
            frames.push(cc.spriteFrameCache.getSpriteFrame(str));
        }
        var animation = cc.animate(new cc.Animation(frames,0.08)).repeatForever();
        return animation;
    },
    GP_ENEMY_COLLIDE : function(random,x,callback){
        var frames = [];
        var length = ActionManager.EnemyLength[random][1];
        var speed = length*0.05;
        var locationX = x > winSize.width/2 ? 640-x+80 : -x-80;
        var move;
        for(var i=2;i<=length;i++){
            var str = 'r_'+random+"_2_"+i+".png";
            frames.push(cc.spriteFrameCache.getSpriteFrame(str));
        }
        var animation = cc.animate(new cc.Animation(frames,0.05));
        if(random>2){
            move = cc.moveBy(speed,locationX,0);
        }
        else if(random==2){
            move = cc.spawn(cc.moveBy(speed,0,200),cc.scaleTo(speed,1.2,1.2),cc.fadeOut(speed));
        }
        else{
            move = cc.spawn(cc.moveBy(speed,0,200),cc.scaleTo(speed,1.5,1.5));
        }
        if(callback==null)
            return cc.spawn(animation,move);
        else{
            var cb = cc.callFunc(function(event){
                callback();
            }.bind(this)); 
            return cc.sequence(cc.spawn(animation,move),cb);
        }
    },
    MM_ROLE_EYE:function(){
        var frames = [];
        var length = 9;
        for(var i=2;i<=length;i++){
            var str = 'eye_'+i+".png";
            frames.push(cc.spriteFrameCache.getSpriteFrame(str));
        }
        var animation = cc.animate(new cc.Animation(frames,0.05));
        var animate = cc.sequence(animation,cc.delayTime(3)).repeatForever();
        this._mm_role_eye = animate;
        return animate;
    },
    MM_ROLE_DANCE:function(callback){
        var frames = [];
        var length = 31;
        for(var i=2;i<=length;i++){
            var str = 'dance_'+i+".png";
            frames.push(cc.spriteFrameCache.getSpriteFrame(str));
        }
        var cb = cc.callFunc(function(event){
            callback();
        }.bind(this));
        var animation = cc.animate(new cc.Animation(frames,0.07));
        var animate = cc.sequence(animation,cb);
        this._mm_role_dance = animate;
        return animate;
    }
};