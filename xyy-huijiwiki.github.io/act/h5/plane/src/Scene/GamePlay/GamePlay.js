var GamePlayScene = cc.Scene.extend({
    backgroundLayer : null, // 背景层
    mainLayer       : null, // 玩法层
    uiLayer         : null, // UI层
    menuLayer       : null, // 菜单层
    levelLayer      : null,
    level           : 0,
    ctor : function(level){
        this._super();
        this.level = level;
    },
    onEnter : function () {
        this._super();
        this.registerEvent();
        this.loadBackgroundLayer();
        this.loadMainLayer();
        this.loadUILayer();
    },
    registerEvent : function(){
        // [事件监听]创建菜单层
        var onCreateMenuLayerListener = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_CREATE_MENU_LAYER ,
            callback    : this.onCreateMenuLayer
        });
        cc.eventManager.addListener(onCreateMenuLayerListener, this);

        // [事件监听]移除菜单层
        var onRemoveMenuLayerListener = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_REMOVE_MENU_LAYER ,
            callback    : this.onRemoveMenuLayer
        });
        cc.eventManager.addListener(onRemoveMenuLayerListener, this);

        var onCreateLevelLayerListener = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_CREATE_LEVEL_LAYER ,
            callback    : this.onCreateLevelLayer
        });
        cc.eventManager.addListener(onCreateLevelLayerListener, this);

        var onRemoveLevelLayerListener = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_REMOVE_LEVEL_LAYER ,
            callback    : this.onRemoveLevelLayer
        });
        cc.eventManager.addListener(onRemoveLevelLayerListener, this);
        cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_MENU_CREATE_GAMEPAD));
    },
    loadBackgroundLayer : function(){
        var node = new GPBackgroundLayer();
        this.addChild(node);
        this.backgroundLayer = node;
    },
    loadMainLayer : function(){
        this.mainLayer = new GPMainLayer(this.level);
        this.addChild(this.mainLayer);
    },
    loadUILayer : function(){
        this.uiLayer = new GPUILayer();
        this.addChild(this.uiLayer);
    },
    loadMenuLayer : function(){
        this.menuLayer = new GPMenuLayer();
        this.addChild(this.menuLayer);
    },
    loadLevelLayer : function(gameOver,level,cb){
        this.levelLayer = new GPLevelLayer(gameOver,level,cb);
        this.addChild(this.levelLayer);
    },
    onCreateLevelLayer : function(event) {
        var self = event.getCurrentTarget();
        var gameOver = event.getUserData().gameOver;
        var level = event.getUserData().level;
        var cb = event.getUserData().cb;
        self.loadLevelLayer(gameOver,level,cb);
    },
    onRemoveLevelLayer : function(event){ 
        event.getUserData().cb();
        var self = event.getCurrentTarget();
        self.removeChild(self.levelLayer);
    },
    onCreateMenuLayer : function(event) {
        cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_REMOVE_GAMEPAD));
        var self = event.getCurrentTarget();
        self.mainLayer.carrot.moveable = false;
        self.loadMenuLayer();
    },
    onRemoveMenuLayer : function(event){
        cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_REMOVE_GAMEPAD));
        cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_CREATE_GAMEPAD));
        var self = event.getCurrentTarget();
        self.uiLayer.pauseBtn.setTouchEnabled(true);
        self.removeChild(self.menuLayer);
    }
});