var GamePlayScene = cc.Scene.extend({
    backgroundLayer : null, // 背景层
    UILayer         : null, // UI层
    SignLayer         : null, // UI层
    ctor : function(){
        this._super();
    },
    onEnter : function () {
        this._super();
        this.loadBackgroundLayer();
        this.loadUILayer();
        this.loadSignLayer();
    },
    onExit : function(){
        this._super();
    },
    loadBackgroundLayer : function(){
        this.backgroundLayer = null;
        this.backgroundLayer = new GPBackgroundLayer();
        this.addChild(this.backgroundLayer,0);
    },
    loadUILayer : function(){
        this.UILayer = null;
        Layer_decorate = new GPUILayer();
        this.UILayer = Layer_decorate;
        this.addChild(Layer_decorate,100);
    },
    loadSignLayer : function(){
        this.SignLayer = null;
        this.SignLayer = new GPSignLayer();
        this.addChild(this.SignLayer,200);
    }
});