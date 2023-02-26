var GamePlayScene = cc.Scene.extend({
    level           : 0,
    runspeed        : 7,
    IsStart         : false,
    backgroundLayer : null, // 背景层
    mainLayer       : null, // 玩法层
    UILayer         : null, // UI层
    menuLayer       : null, // 菜单层
    ctor : function(IsStart){
        this._super();
        this.IsStart = IsStart;
        this.runspeed = winSize.RunSpeed;
    },
    onEnter : function () {
        this._super();
        cc.spriteFrameCache.addSpriteFrames(res.gp_role_plist,res.gp_role_png);
        this.property(); 
        this.registerEvent();
        this.loadBackgroundLayer();
        this.loadMainLayer();
        this.loadUILayer();
    },
    onExit : function(){
        cc.audioEngine.stopMusic();
        this._super();
    },
    property:function(){
        this.level++;
        this.runspeed -= this.runspeed < 4 ? 0 : 0.50;
        GameManager.currMonsterPool = [];
    },
    registerEvent : function(){
        // [事件监听]创建菜单层
        var a = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_RUN ,
            callback    : this.beginRun
        });
        cc.eventManager.addListener(a, this);
        // [事件监听]创建菜单层
        var b = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_CREATE_MENU_LAYER ,
            callback    : this.onCreateMenuLayer
        });
        cc.eventManager.addListener(b, this);
        // [事件监听]移除菜单层
        var c = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_REMOVE_MENU_LAYER ,
            callback    : this.onRemoveMenuLayer
        });
        cc.eventManager.addListener(c, this);
        // [事件监听]创建Dialogs
        var d = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_CREATE_DIALOGS_LAYER,
            callback    : this.onCreateDialogsLayer
        });
        cc.eventManager.addListener(d, this);

        // [事件监听]移除Dialogs
        var e = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_REMOVE_DIALOGS_LAYER,
            callback    : this.onRemoveDialogsLayer
        });
        cc.eventManager.addListener(e, this);

        // [事件监听]下一关
        var f = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_NEXT_LEVEL,
            callback    : this.loadNextLevel
        });
        cc.eventManager.addListener(f, this);
    },
    beginRun : function(event){
        var self = event.getCurrentTarget();
        self.mainLayer.role.runAction(ActionManager.GP_ROLE_RUN(winSize.MovePotintGroup,self.runspeed));
        self.runAction(ActionManager.GP_BG_RUN(self.UILayer,self.runspeed));       
    },
    loadNextLevel : function(event){
        var self = event.getCurrentTarget();
        self.property(); 
        self.y = 0;
        self.mainLayer.role.attr({
            x : winSize.beginX,
            y : winSize.beginY,
            direction : 0
        });
        self.UILayer.pauseBtn.y = 964;
        self.UILayer.topBar.y = winSize.height-5;
        self.removeChild(self.backgroundLayer);
        self.loadBackgroundLayer();
        var event = new cc.EventCustom(jf.EventName.GP_CREATE_DIALOGS_LAYER);
        event.setUserData({
            text:"关卡 "+self.level,
            cb:function(){
                cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_RUN));
            }
        });
        cc.eventManager.dispatchEvent(event);
    },
    loadBackgroundLayer : function(){
        this.backgroundLayer = null;
        var node = new GPBackgroundLayer();
        this.addChild(node,0);
        this.backgroundLayer = node;
    },
    loadMainLayer : function(){
        this.mainLayer = new GPMainLayer(this.IsStart);
        this.addChild(this.mainLayer,10);
    },
    loadUILayer : function(){
        this.UILayer = new GPUILayer();
        this.addChild(this.UILayer,20);
    },
    loadMenuLayer : function(){
        this.menuLayer = new GPMenuLayer();
        this.addChild(this.menuLayer,20);
    },
    loadDialogsLayer : function(data){
        this.dialogsLayer = new GPDialogsLayer(data.text,data.cb);
        this.addChild(this.dialogsLayer,20);
    },
    onCreateDialogsLayer : function(event) {
        var self = event.getCurrentTarget();
        var data = event.getUserData();
        self.loadDialogsLayer(data);
    },
    onRemoveDialogsLayer : function(event){ 
        var self = event.getCurrentTarget();
        self.removeChild(self.dialogsLayer);
    },
    onCreateMenuLayer : function(event) {
        var self = event.getCurrentTarget();
        self.loadMenuLayer();
    },
    onRemoveMenuLayer : function(event){
        var self = event.getCurrentTarget();
        self.UILayer.pauseBtn.setTouchEnabled(true);
        self.removeChild(self.menuLayer);
    }
});