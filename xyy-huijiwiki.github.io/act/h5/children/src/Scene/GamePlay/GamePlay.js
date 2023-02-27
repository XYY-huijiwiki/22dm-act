var GamePlayScene = cc.Scene.extend({
    level           : 0,
    backgroundLayer : null, // 背景层
    mainLayer       : null, // 玩法层
    UILayer         : null, // UI层
    dialogsLayer    : null, // 关卡层
    ctor : function(){
        this._super();
    },
    onEnter : function () {
        this._super();
        this.registerEvent();
        this.loadBackgroundLayer();
        this.loadUILayer();
        this.loadMainLayer();
    },
    onExit : function(){
        this._super();
        clearInterval(timer_add);
        GameManager.isGameOver = true;
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

        // [事件监听]下一关
        var f = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_NEXT_LEVEL,
            callback    : this.loadNextLevel
        });
        cc.eventManager.addListener(f, this);
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
        this.addChild(this.UILayer,20);
    },
    loadMainLayer : function(){
        this.mainLayer = null;
        this.mainLayer = new GPMainLayer();
        this.addChild(this.mainLayer,10);
    },
    loadDialogsLayer : function(data){
        this.dialogsLayer = null;
        this.dialogsLayer = new GPDialogsLayer(data.text,data.tips,data.cb);
        this.addChild(this.dialogsLayer,500);
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
    }
});