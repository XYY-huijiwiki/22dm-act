// 动作管理对象
var ActionManager = {
    //GP: 子弹射出
    GP_BULLECT_NORMAL : function(callback){
        var setting = GameManager.bullectSetting["role_"+GameManager.currentRoleId];
        var move = cc.moveBy(setting.speed,setting.distance,0);
        var cb = cc.callFunc(function(event){
            callback() || null;
        });
        return cc.sequence(move,cb);
    },
    //GP: 子弹
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
    //GP: 子弹
    GP_BULLET_FLY : function(rid,type,setting,callback){
        var speed = 0.01;
        var frames = [];
        for(var i=1;i<=setting[0];i++){
            var str = "bullet_"+rid+"_"+type+"_"+i+".png";
            frames.push(cc.spriteFrameCache.getSpriteFrame(str));
        }
        var cb = cc.callFunc(function(event){
            callback() || null;
        });
        var animate = cc.animate(new cc.Animation(frames,speed));
        return cc.sequence(animate,cb);
    },
    //GP: 角色蓄力
    GP_ROLE_ATTACK_RESET : function(wid){
        var frames = [cc.spriteFrameCache.getSpriteFrame("role_"+wid+"_1.png")];
        var animate = cc.animate(new cc.Animation(frames,0.05));
        return animate;
    },
    GP_ROLE_ATTACK_BEFORE : function(wid){
        var length = GameManager.roleSetting["role_"+wid].action.length[0];
        var speed = GameManager.roleSetting["role_"+wid].maxStrength/length/GameManager.roleSetting["role_"+wid].action.speed;
        var frames = [];
        for(var i=1;i<=length;i++){
            var str = "role_"+wid+"_"+i+".png";
            frames.push(cc.spriteFrameCache.getSpriteFrame(str));
        }
        var animate = cc.animate(new cc.Animation(frames,speed));
        return animate;
    }, 
    //GP: 角色发射
    GP_ROLE_ATTACK_AFTER : function(wid){
        var begin = GameManager.roleSetting["role_"+wid].action.length[0]; 
        var end = GameManager.roleSetting["role_"+wid].action.length[1];
        var speed = 0.005;
        var frames = [];
        for(var i=begin;i<=end;i++){
            var str = "role_"+wid+"_"+i+".png";
            frames.push(cc.spriteFrameCache.getSpriteFrame(str));
        }
        var animate = cc.animate(new cc.Animation(frames,speed));
        return cc.sequence(cc.delayTime(0.1),animate);
    },
    //GP: 血滴消失
    GP_HP_OUT : function(callback){
        var speed = 0.5;
        var fadeOut = cc.fadeTo(speed,0);
        var move = cc.moveBy(speed,0,100);
        var cb = cc.callFunc(function(event){
            callback() || null;
        });
        return cc.sequence(cc.spawn(fadeOut,move),cb);
    },
    //GP: 杂羊助威
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
    //GP: 小狼兵进攻
    GP_WOLF_IN : function(setting){
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
    //GP: 小狼兵抢走羊跑路
    GP_WOLF_OUT : function(setting){
        var length = 32;
        var frames = [];
        var move = cc.moveBy(setting.speed*length,setting.deltaX,0);
        for(var i=1;i<=length;i++){
            var str = "wolf_"+setting.wid+"_2_"+i+".png";
            frames.push(cc.spriteFrameCache.getSpriteFrame(str));
        }
        var animate = cc.animate(new cc.Animation(frames,setting.speed));
        return cc.spawn(animate,move).repeatForever();
    },
    //GP: 小狼兵被打死
    GP_WOLF_DEAD : function(wolf,callback){
        var move = cc.moveTo(0.5,winSize.width+wolf.width/2,wolf.y);
        var cb = cc.callFunc(function(event){
            callback() || null;
        });
        return cc.sequence(move,cb);
    },
    //GS: 结束标题动画
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
    //MM: 主按钮进入
    MM_BUTTON_IN : function(delay){
        var fadeIn = cc.fadeTo(1,255);
        return cc.sequence(cc.delayTime(delay),fadeIn);
    },
    //MM: 其余2个按钮进入
    MM_BUTTON_MOVE : function(delay,x,y){
        var move = cc.moveTo(0.8,x,y);
        return cc.sequence(cc.delayTime(delay),move);
    },
    //MM: 标题浮动
    MM_TITLE_FLOAT : function(){
        var speed = 2;
        var move1 = cc.moveBy(speed,0,15);
        var move2 = cc.moveBy(speed,0,-15);
        return cc.sequence(move1,move2).repeatForever();
    },
    //MM: 喜羊羊动画
    MM_XI_IN : function(speed,delay){
        var fadeOut = cc.fadeTo(speed,180);
        var fadeIn = cc.fadeTo(speed*2,255);
        return cc.sequence(fadeOut,fadeIn,cc.delayTime(delay)).repeatForever();
    },
    //MM: 美羊羊动画
    MM_TITLE_MEI : function(){
        var speed = 2;
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
        return cc.sequence(move,cc.delayTime(1.5),cb);
    },
    //MM: 首播标题进入
    MM_TITLE2_IN : function(delay){
        var fadeIn = cc.fadeTo(0.5,255);
        var move1 = cc.moveBy(0.1,30,0);
        var move2 = cc.moveBy(0.1,-30,0);
        return cc.sequence(cc.delayTime(delay),fadeIn,move1,move2);
    }
};