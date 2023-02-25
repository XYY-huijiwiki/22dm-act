var MainMenuScene = cc.Scene.extend({
    backgroundLayer : null,
    UILayer         : null,
    ctor : function(){
        this._super();
    },
    onEnter : function () {
        this._super();
        this.loadBackgroundLayer(); //背景
        this.loadUILayer();         //浮动标题 + 2个人物
        this.registerEvent();       
    },
    registerEvent : function(){
        var a = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.MM_RUN_GP,
            callback    : this.runGamePlayScene
        });
        cc.eventManager.addListener(a, this);
    },
    loadBackgroundLayer : function(){
        this.backgroundLayer = new MMBackgroundLayer();
        this.addChild(this.backgroundLayer);
    },
    loadUILayer : function(){
        this.UILayer = new MMUILayer();
        this.addChild(this.UILayer);
    },
    runGamePlayScene:function(){
        cc.director.runScene(new GamePlayScene(heartbeat.scene,heartbeat.player));
    }
});