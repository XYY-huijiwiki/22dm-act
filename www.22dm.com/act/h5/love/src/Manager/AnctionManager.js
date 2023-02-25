// 动作管理对象
var AnctionManager = {
    _gp_female_a_1   : null, //红莉走进来
    _gp_female_a_2   : null, //点击红莉 抬手循环笑
    _gp_female_a_3   : null, //玩家二加载完毕 红莉走出去
    _gp_female_a_4   : null, //红莉跳过去抱
    _gp_female_a_5   : null, //胡飞玩手机循环

    _gp_male_a_1  : null, //弄头发
    _gp_male_a_2     : null, //走路
    _gp_male_a_3     : null, //玫瑰惊喜
    _gp_male_a_4     : null, //红莉发呆等

    _mm_male_flowing    : null, //胡飞笑
    _mm_female_flowing  : null, //红莉笑
    _mm_male_drop       : null, //胡飞拿出玫瑰花
    _mm_female_drop     : null, //

    GP_MALE_A_1:function(node){
        var frames = [];
        var length = 46;
        for(var i=2;i<=length;i++){
            var str = 'male_1_'+i+".png";
            frames.push(cc.spriteFrameCache.getSpriteFrame(str));
        }
        var animate = cc.animate(new cc.Animation(frames,0.05));
        this._gp_male_a_1 = animate;
        return animate;
    },
    GP_MALE_A_2:function(node,bg,callback){
        var frames = [];
        var length = 86;
        for(var i=2;i<=length;i++){
            var str = 'male_2_'+i+".png";
            frames.push(cc.spriteFrameCache.getSpriteFrame(str));
        }
        var cb = cc.callFunc(function(event){
            callback();
        }.bind(this));
        var move = cc.moveTo(65*0.05,cc.p(640,0));
        var animation = cc.animate(new cc.Animation(frames,0.05));
        var animate = cc.sequence(animation,cb);
        this._gp_male_a_2 = animate;
        bg.runAction(move);
        return animate;
    },
    GP_MALE_A_3:function(node,callback){
        var frames = [];
        var length = 145;
        for(var i=2;i<=length;i++){
            var str = 'male_4_'+i+".png";
            frames.push(cc.spriteFrameCache.getSpriteFrame(str));
        }
        var cb = cc.callFunc(function(event){
            callback();
        }.bind(this));
        var animation = cc.animate(new cc.Animation(frames,0.05));
        var animate = cc.sequence(animation,cb);
        this._gp_male_a_3 = animate;
        return animate;
    },
    GP_MALE_A_4:function(node,callback){
        var frames = [];
        var length = 88;
        for(var i=2;i<=length;i++){
            var str = 'male_5_'+i+".png";
            frames.push(cc.spriteFrameCache.getSpriteFrame(str));
        }
        var cb = cc.callFunc(function(event){
            callback();
        }.bind(this));
        var animation = cc.animate(new cc.Animation(frames,0.05));
        var animate = cc.sequence(animation,cb);
        this._gp_male_a_4 = animate;
        return animate;
    },

    GP_FEMALE_A_1:function(node){ //走进来
        var frames = [];
        var length = 52;
        for(var i=2;i<=length;i++){
            var str = 'female_1_'+i+".png";
            frames.push(cc.spriteFrameCache.getSpriteFrame(str));
        }
        var cb = cc.callFunc(function(event){
            cc.eventManager.addListener(node.getParent().UIListener,node.getParent())
        }.bind(this));
        var animation = cc.animate(new cc.Animation(frames,0.05));
        var animate = cc.sequence(animation,cb);
        this._gp_female_a_1 = animate;
        return animate;
    },
    GP_FEMALE_A_2:function(node){ //抬手笑
        var frames1 = [];
        var frames2 = [];
        var length1 = 6;
        var length2 = 25;
        for(var i=2;i<length1;i++){
            var str = 'female_2_'+i+".png";
            frames1.push(cc.spriteFrameCache.getSpriteFrame(str));
        }
        for(var j=length1;j<=length2;j++){
            var str = 'female_2_'+j+".png";
            frames2.push(cc.spriteFrameCache.getSpriteFrame(str));
        }
        var animate1 = cc.animate(new cc.Animation(frames1,0.05));
        var animate2 = cc.animate(new cc.Animation(frames2,0.05));
        var animate = cc.sequence(animate1,animate2.repeatForever());
        this._gp_female_a_2 = animate; 
        return animate;
    },
    GP_FEMALE_A_3:function(node,callback){ //走出去
        var frames = [];
        var length = 70;
        for(var i=2;i<=length;i++){
            var str = 'female_3_'+i+".png";
            frames.push(cc.spriteFrameCache.getSpriteFrame(str));
        }
        var cb = cc.callFunc(function(event){
            callback();
        }.bind(this));
        var animation = cc.animate(new cc.Animation(frames,0.05));
        var animate = cc.sequence(animation,cb);
        this._gp_female_a_3 = animate;
        return animate;
    },
    GP_FEMALE_A_4:function(node,callback){ //跳过去抱
        var frames = [];
        var length = 128;
        for(var i=2;i<=length;i++){
            var str = 'female_4_'+i+".png";
            frames.push(cc.spriteFrameCache.getSpriteFrame(str));
        }
        var cb = cc.callFunc(function(event){
            callback();
        }.bind(this));
        var animation = cc.animate(new cc.Animation(frames,0.05));
        var animate = cc.sequence(animation,cb);
        this._gp_female_a_4 = animate;
        return animate;
    },
    GP_FEMALE_A_5:function(node){  //胡飞玩手机
        var frames = [];
        var length = 10;
        for(var i=2;i<=length;i++){
            var str = 'female_5_'+i+".png";
            frames.push(cc.spriteFrameCache.getSpriteFrame(str));
        }
        var animate = cc.animate(new cc.Animation(frames,0.05)).repeatForever();
        this._gp_female_a_5 = animate;
        return animate;
    },



    MM_LOVETITLE:function(node){
        var a = cc.moveTo(2,node.x+ac.mm_ui_love_title_offsetX,node.y);
        var b = cc.moveTo(2,node.x-ac.mm_ui_love_title_offsetX,node.y);
        return cc.sequence(a,b).repeatForever();
    },
    MM_FEMALE_FLOWING:function(node){
        var frames = [];
        var length = 34;
        for(var i=2;i<=length;i++){
            var str = 'female_flowing_'+i+".png";
            frames.push(cc.spriteFrameCache.getSpriteFrame(str));
        }
        var animation = new cc.Animation(frames,0.05);
        var animate = cc.animate(animation).repeatForever();
        this._mm_female_flowing = animate;
        return animate;
    },
    MM_FEMALE_DROP:function(node,callback){
        var frames = [];
        var length = 20;
        for(var i=2;i<=length;i++){
            var str = 'female_drop_'+i+".png";
            frames.push(cc.spriteFrameCache.getSpriteFrame(str));
        }
        var cb = cc.callFunc(function(event){
            callback();
        }.bind(this));
        var animate = cc.animate(new cc.Animation(frames,0.03));
        var animation = cc.sequence(animate,cb);
        this._mm_female_drop = animation;
        return animation;
    },
    MM_MALE_FLOWING:function(node){
        var frames = [];
        var length = 15;
        for(var i=2;i<=15;i++){
            var str = 'meal_flowing_'+i+".png";
            frames.push(cc.spriteFrameCache.getSpriteFrame(str));
        }
        var animation = new cc.Animation(frames,0.05);
        var animate = cc.animate(animation).repeatForever();
        this._mm_male_flowing = animate;
        return animate;
    },
    MM_MALE_DROP:function(node,callback){
        var frames = [];
        var length = 40;
        for(var i=2;i<=length;i++){
            var str = 'male_drop_'+i+".png";
            frames.push(cc.spriteFrameCache.getSpriteFrame(str));
        }
        var cb = cc.callFunc(function(event){
            callback();
        }.bind(this));
        var animate = cc.animate(new cc.Animation(frames,0.04));
        var animation = cc.sequence(animate,cb)
        this._mm_male_drop = animation;
        return animation;
    }
};

var ac = {};
ac.mm_ui_love_title_offsetX=5;
ac.mm_ui_drop_delay=0.1;
ac.mm_ui_drop_time=2;