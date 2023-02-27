var GamePlayScene = cc.Scene.extend({
    dialogsLayer    : null, // 关卡提示层
    backgroundLayer : null, // 背景层
    mainLayer       : null, // 玩法层
    UILayer         : null, // UI层
    ctor : function(){
        this._super();
    },
    onEnter : function () {
        this._super();
        this.registerEvent();
        this.loadBackgroundLayer();
        this.loadMainLayer();
        this.loadUILayer();
    },
    onExit : function(){
        this._super();
    },
    registerEvent : function(){
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

        // [事件监听]创建Ice
        var f = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_CREATE_ICE_LAYER,
            callback    : this.onCreateIceLayer
        });
        cc.eventManager.addListener(f, this);

        // [事件监听]移除Ice
        var g = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_REMOVE_ICE_LAYER,
            callback    : this.onRemoveIceLayer
        });
        cc.eventManager.addListener(g, this);
    },
    loadBackgroundLayer : function(){
        this.backgroundLayer = null;
        var node = new GPBackgroundLayer();
        this.addChild(node,0);
        this.backgroundLayer = node;
    },
    loadUILayer : function(){
        this.UILayer = null;
        this.UILayer = new GPUILayer();
        this.addChild(this.UILayer,10);
    },
    loadMainLayer : function(){
        this.mainLayer = null;
        this.mainLayer = new GPMainLayer();
        this.addChild(this.mainLayer,20);
    },
    loadDialogsLayer : function(data){
        this.dialogsLayer = null;
        this.dialogsLayer = new GPDialogsLayer(data);
        this.addChild(this.dialogsLayer,50);
    },
    onCreateDialogsLayer : function(event) {
        var self = event.getCurrentTarget();
        var data = event.getUserData();
        self.loadDialogsLayer(data);
    },
    onRemoveDialogsLayer : function(event){ 
        var self = event.getCurrentTarget();
        self.removeChild(self.dialogsLayer);
        self.dialogsLayer = null;
    },
    loadIceLayer : function(data){
        this.iceLayer = null;
        this.iceLayer = new GPIceLayer();
        this.addChild(this.iceLayer,5000);
    },
    onCreateIceLayer : function(event) {
        var self = event.getCurrentTarget();
        self.loadIceLayer();
    },
    onRemoveIceLayer : function(event){ 
        var self = event.getCurrentTarget();
        self.removeChild(self.iceLayer);
        self.iceLayer = null;
    }
});