var MMUILayer = cc.Layer.extend({
    LoveTitle :  null,
    Male      :  null,
    Female    :  null,
    UIListener:  null,
    ctor : function () {
        this._super();
        cc.spriteFrameCache.addSpriteFrames(res_index.mm_male_plist_0,res_index.mm_male_png_0);
        cc.spriteFrameCache.addSpriteFrames(res_index.mm_male_plist_1,res_index.mm_male_png_1);
        cc.spriteFrameCache.addSpriteFrames(res_index.mm_male_plist_2,res_index.mm_male_png_2);
        this.loadLoveTitle();
        this.loadFemale();
        this.loadMale();
        this.registerEvent();
    },
    registerEvent : function(){
        var a = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.MM_FEMALE_A_2,
            callback    : this.femaleAnction_2
        });
        cc.eventManager.addListener(a, this);

        var b = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.MM_MALE_A_2,
            callback    : this.maleAnction_2
        });
        cc.eventManager.addListener(b, this);

        this.UIListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan:function(touch,event){
                var target = event.getCurrentTarget(); 
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var sMale = target.Male.getContentSize();
                var sFemale = target.Female.getContentSize();
                sMale.x = target.Male.x - sMale.width/2;  
                sMale.y = target.Male.y - sMale.height/2;  
                sFemale.x = target.Female.x - sFemale.width/2;  
                sFemale.y = target.Female.y - sFemale.height/2; 
                var rectMale = cc.rect(sMale.x, sMale.y, sMale.width, sMale.height);
                var rectFemale = cc.rect(sFemale.x, sFemale.y, sFemale.width, sFemale.height);
                if(cc.rectContainsPoint(rectFemale, locationInNode)){
                    cc.eventManager.removeListener(target.UIListener);  
                    heartbeat.scene = 1;
                    cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.MM_FEMALE_A_2));
                }
                else if (cc.rectContainsPoint(rectMale, locationInNode)) {   
                    cc.eventManager.removeListener(target.UIListener);
                    heartbeat.scene = 2;
                    cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.MM_MALE_A_2));  
                }
                else{
                    return;
                }
            }
        });
        cc.eventManager.addListener(this.UIListener,this);
    },
    loadLoveTitle : function(){
        var node = new cc.Sprite(res_index.mm_ui_love_title);
        this.LoveTitle = node;
        this.addChild(node);
        node.attr({
            x : winSize.width / 2,
            y : winSize.height / 2+300,
            name : 'lovetitle'
        });
        node.runAction(AnctionManager.MM_LOVETITLE(node)); 
    },
    loadFemale:function(){
        var node = new cc.Sprite("#female_flowing_1.png");
        this.Female = node;
        this.addChild(node);
        node.attr({
            x : winSize.width / 2 - 185,
            y : winSize.height / 2 - 190
        });
        this.femaleAnction_1(node);
    },
    loadMale:function(){
        var node = new cc.Sprite("#meal_flowing_1.png");
        this.Male = node;
        this.addChild(node);
        node.attr({
            x : winSize.width / 2 + 110,
            y : winSize.height / 2 - 180
        });
    },
    femaleAnction_1:function(node){
        node.runAction(AnctionManager.MM_FEMALE_FLOWING(node));
    },
    femaleAnction_2:function(event){
        var self = event.getCurrentTarget();
        var node = self.Female;
        node.stopAction(AnctionManager._mm_female_flowing);
        node.runAction(AnctionManager.MM_FEMALE_DROP(node,function(){
            self.loadGamePlayResources();
        }));
    },
    maleAnction_1:function(node){
        node.runAction(AnctionManager.MM_MALE_FLOWING(node));       
    },
    maleAnction_2:function(event){
        var self = event.getCurrentTarget();
        var node = self.Male;
        node.stopAction(AnctionManager._mm_male_flowing);
        node.runAction(AnctionManager.MM_MALE_DROP(node,function(){
            self.loadGamePlayResources();
        }));
    },
    loadGamePlayResources:function(){
        heartbeat.loadcount=0;
        heartbeat.loadtag = 'dialogs_guide_2';
        dialogs.open(heartbeat.loadtag);
        if(heartbeat.scene==1)
            heartbeat.loadres = heartbeat.player == 1 ? g_resources_female_one :g_resources_female_two;
        else
            heartbeat.loadres = heartbeat.player == 1 ? g_resources_male_one :g_resources_male_two;
        loadGamePlayResources();
    }
});
