var GamePlayScene = cc.Scene.extend({
    level           : 12,
    IsStart         : false,
    UILayer         : null, // UI层
    ctor : function(){
        this._super();
    },
    onEnter : function () {
        this._super();
        this.loadUILayer();
        if(!cc.audioEngine.isMusicPlaying())
            cc.audioEngine.playMusic(res.audio_music, true);  
    },
    onExit : function(){
        this._super();
    },
    loadUILayer : function(){
        this.UILayer = null;
        this.UILayer = new GPUILayer();
        this.addChild(this.UILayer,20);
    }
});