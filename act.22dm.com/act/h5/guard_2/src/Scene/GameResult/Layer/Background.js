var GSBackgroundLayer = cc.Layer.extend({
    ctor:function(){
        this._super();
    },
    onEnter : function () {
        this._super();
        this.loadBackground();
    },
    loadBackground : function(){
        var node = new cc.Sprite("#gs_background.jpg");
        node.setPosition(winSize.width / 2, winSize.height / 2);
        this.addChild(node);
    }
});