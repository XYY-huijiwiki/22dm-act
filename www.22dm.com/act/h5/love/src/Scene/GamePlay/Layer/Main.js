var GPMainLayer = cc.Layer.extend({
    scene      : 1,
    player     : 1,
    male       : null,
    female     : null,
    UIListener : null,
    ctor:function(scene,player){
        this._super(); 
        this.scene = scene;
        this.player = player;
    },
    onEnter : function(){
        this._super();     
        this.loadPlist();
        if(this.scene==1)
            this.loadFemale();
        else
            this.loadMale();
        this.registerEvent();
    },
    registerEvent : function(){
        var b = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_FEMALE_A_2,
            callback    : this.femaleAnction_2
        });
        cc.eventManager.addListener(b, this);
        var c = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_FEMALE_A_3,
            callback    : this.femaleAnction_3
        });
        cc.eventManager.addListener(c, this);
        var d = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_FEMALE_A_4,
            callback    : this.femaleAnction_4
        });
        cc.eventManager.addListener(d, this);
  
        var f = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_MALE_A_1,
            callback    : this.maleAnction_1
        });
        cc.eventManager.addListener(f, this);
        var g = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_MALE_A_2,
            callback    : this.maleAnction_2
        });
        cc.eventManager.addListener(g, this);
        var h = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_MALE_A_3,
            callback    : this.maleAnction_3
        });
        cc.eventManager.addListener(h, this);

        this.UIListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan:function(touch,event){
                var target = event.getCurrentTarget(); 
                cc.eventManager.removeListener(target.UIListener);
                if(target.scene==1)
                    cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_FEMALE_A_2));  
                else
                    cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_MALE_A_1));
            }
        });
        if(this.scene==2 && this.player==1){
           cc.eventManager.addListener(this.UIListener,this); 
        }
    },
    loadPlist:function(){
        if(this.scene==1){
            if(this.player==1){
                cc.spriteFrameCache.addSpriteFrames(res_female.player_one.gp_female_plist_1_0,res_female.player_one.gp_female_png_1_0);
                cc.spriteFrameCache.addSpriteFrames(res_female.player_one.gp_female_plist_1_1,res_female.player_one.gp_female_png_1_1);
                cc.spriteFrameCache.addSpriteFrames(res_female.player_one.gp_female_plist_1_2,res_female.player_one.gp_female_png_1_2);
                
            }
            else{
                cc.spriteFrameCache.addSpriteFrames(res_female.player_two.gp_female_plist_2_0,res_female.player_two.gp_female_png_2_0);
                cc.spriteFrameCache.addSpriteFrames(res_female.player_two.gp_female_plist_2_1,res_female.player_two.gp_female_png_2_1);
                cc.spriteFrameCache.addSpriteFrames(res_female.player_two.gp_female_plist_2_2,res_female.player_two.gp_female_png_2_2);
                cc.spriteFrameCache.addSpriteFrames(res_female.player_two.gp_female_plist_2_3,res_female.player_two.gp_female_png_2_3); 
                cc.spriteFrameCache.addSpriteFrames(res_female.player_two.gp_female_plist_2_4,res_female.player_two.gp_female_png_2_4);
                cc.spriteFrameCache.addSpriteFrames(res_female.player_two.gp_female_plist_2_5,res_female.player_two.gp_female_png_2_5);
                cc.spriteFrameCache.addSpriteFrames(res_female.player_two.gp_female_plist_2_6,res_female.player_two.gp_female_png_2_6);     
            }
        }
        else{
            if(this.player==1){
                cc.spriteFrameCache.addSpriteFrames(res_male.player_one.gp_male_plist_1_0,res_male.player_one.gp_male_png_1_0);
                cc.spriteFrameCache.addSpriteFrames(res_male.player_one.gp_male_plist_1_1,res_male.player_one.gp_male_png_1_1);
                cc.spriteFrameCache.addSpriteFrames(res_male.player_one.gp_male_plist_1_2,res_male.player_one.gp_male_png_1_2);  
            }
            else{
                cc.spriteFrameCache.addSpriteFrames(res_male.player_two.gp_male_plist_2_0,res_male.player_two.gp_male_png_2_0);
                cc.spriteFrameCache.addSpriteFrames(res_male.player_two.gp_male_plist_2_1,res_male.player_two.gp_male_png_2_1);
                cc.spriteFrameCache.addSpriteFrames(res_male.player_two.gp_male_plist_2_2,res_male.player_two.gp_male_png_2_2);
                cc.spriteFrameCache.addSpriteFrames(res_male.player_two.gp_male_plist_2_3,res_male.player_two.gp_male_png_2_3);
                cc.spriteFrameCache.addSpriteFrames(res_male.player_two.gp_male_plist_2_4,res_male.player_two.gp_male_png_2_4);
                cc.spriteFrameCache.addSpriteFrames(res_male.player_two.gp_male_plist_2_5,res_male.player_two.gp_male_png_2_5);
                cc.spriteFrameCache.addSpriteFrames(res_male.player_two.gp_male_plist_2_6,res_male.player_two.gp_male_png_2_6);
                cc.spriteFrameCache.addSpriteFrames(res_male.player_two.gp_male_plist_2_7,res_male.player_two.gp_male_png_2_7);
                cc.spriteFrameCache.addSpriteFrames(res_male.player_two.gp_male_plist_2_8,res_male.player_two.gp_male_png_2_8);
                cc.spriteFrameCache.addSpriteFrames(res_male.player_two.gp_male_plist_2_9,res_male.player_two.gp_male_png_2_9);
                cc.spriteFrameCache.addSpriteFrames(res_male.player_two.gp_male_plist_2_10,res_male.player_two.gp_male_png_2_10);
                cc.spriteFrameCache.addSpriteFrames(res_male.player_two.gp_male_plist_2_11,res_male.player_two.gp_male_png_2_11);
                cc.spriteFrameCache.addSpriteFrames(res_male.player_two.gp_male_plist_2_12,res_male.player_two.gp_male_png_2_12);
                cc.spriteFrameCache.addSpriteFrames(res_male.player_two.gp_male_plist_2_13,res_male.player_two.gp_male_png_2_13);
                cc.spriteFrameCache.addSpriteFrames(res_male.player_two.gp_male_plist_2_14,res_male.player_two.gp_male_png_2_14);
                cc.spriteFrameCache.addSpriteFrames(res_male.player_two.gp_male_plist_2_15,res_male.player_two.gp_male_png_2_15);
                cc.spriteFrameCache.addSpriteFrames(res_male.player_two.gp_male_plist_2_16,res_male.player_two.gp_male_png_2_16);
                cc.spriteFrameCache.addSpriteFrames(res_male.player_two.gp_male_plist_2_17,res_male.player_two.gp_male_png_2_17);    
            }
        }
    },
    loadMale : function(){
        if(this.player==1){
            var node = new cc.Sprite("#male_1_1.png");
            this.male = node;
            this.addChild(node);
            node.attr({
                x : winSize.width / 2,
                y : winSize.height / 2
            });
            
        }
        else{
            var node = new cc.Sprite("#male_5_1.png");
            this.male = node;
            this.addChild(node);
            node.attr({
                x : winSize.width / 2,
                y : winSize.height / 2
            });
            heartbeat.state = 3;
            player_two.sendStatu();
            this.maleAnction_4(node);
        }
    },
    loadFemale : function(){
        if(this.player==1){  //红莉走进来
            var node = new cc.Sprite("#female_1_1.png");
            this.female = node;
            this.addChild(node);
            node.attr({
                x : winSize.width / 2,
                y : winSize.height / 2
            });
            this.femaleAnction_1(node);
        }
        else{  //胡飞玩手机
            var node = new cc.Sprite("#female_5_1.png");
            this.female = node;
            this.addChild(node);
            node.attr({
                x : winSize.width / 2,
                y : winSize.height / 2
            });
            heartbeat.state = 3;
            player_two.sendStatu();
            this.femaleAnction_5(node);
        }
    },
    maleAnction_1:function(event){  //弄头发
        var self = event.getCurrentTarget();
        self.male.runAction(AnctionManager.GP_MALE_A_1(self.male));
        heartbeat.ercodeShow();
    },
    maleAnction_2:function(event){  //走路
        var self = event.getCurrentTarget();
        var node = self.male;
        node.runAction(AnctionManager.GP_MALE_A_2(node,self.getParent().backgroundLayer,function(){
            node.removeFromParent();
            node.stopAction(AnctionManager._gp_female_a_1);
            player_one.sendStatu();
            setTimeout(function(){
                heartbeat.shareShow();
            },11000)
        }));
    },
    maleAnction_3:function(event){  //给玫瑰
        var self = event.getCurrentTarget();
        var node = self.male;
        node.stopAction(AnctionManager._gp_female_a_4);
        node.runAction(AnctionManager.GP_MALE_A_3(node,function(){
            heartbeat.shareShow();
        }));
    },
    maleAnction_4:function(node){  //红莉发呆等
        node.runAction(AnctionManager.GP_MALE_A_4(node,function(){
            player_two.getStatu();
        }));
    },
    femaleAnction_1:function(node){  //走进来
        node.runAction(AnctionManager.GP_FEMALE_A_1(node)); 
    },
    femaleAnction_2:function(event){  //捂嘴笑
        var self = event.getCurrentTarget();
        if(self.player==1){
            var node = self.female;
            node.stopAction(AnctionManager._gp_female_a_1);
            node.runAction(AnctionManager.GP_FEMALE_A_2(node));
            heartbeat.ercodeShow();
        }
    },
    femaleAnction_3:function(event){  //走出去
        var self = event.getCurrentTarget();
        if(self.player==1){
            var node = self.female;
            node.runAction(AnctionManager.GP_FEMALE_A_3(node,function(){
                node.removeFromParent();
                player_one.sendStatu();
                setTimeout(function(){
                    heartbeat.shareShow();
                },6000)
            }));      
        }
    },
    femaleAnction_4:function(event){  //跳过去拥抱
        var self = event.getCurrentTarget();
        var node = self.female;
        node.stopAction(AnctionManager._gp_female_a_5);
        node.runAction(AnctionManager.GP_FEMALE_A_4(node,function(){
            heartbeat.shareShow();
        }));      
    },
    femaleAnction_5:function(node){  //胡飞玩手机
        node.runAction(AnctionManager.GP_FEMALE_A_5(node));  
        player_two.getStatu(); 
    }
});