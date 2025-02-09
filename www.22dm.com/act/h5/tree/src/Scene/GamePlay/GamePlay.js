var GamePlayScene = cc.Scene.extend({
    UILayer         : null, // UI层
    ctor : function(){
        this._super();
    },
    onEnter : function () {
        this._super();
        this.loadUILayer();
    },
    onExit : function(){
        this._super();
    },
    loadUILayer : function(){
        this.UILayer = new GPUILayer();
        this.addChild(this.UILayer);
    }
});
