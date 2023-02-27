var MainMenuScene = cc.Scene.extend({
    backgroundLayer : null,
    UILayer         : null,
    ctor : function(){
        this._super();
    },
    onEnter : function () {
        this._super();
        this.loadBackgroundLayer(); 
        this.loadUILayer();         
        this.registerEvent();   
        if(!cc.audioEngine.isMusicPlaying())
            cc.audioEngine.playMusic(res.audio_music, true);   
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
    runGamePlayScene:function(event){
        GameManager.restart();
        cc.director.runScene(new GamePlayScene());
    }
});