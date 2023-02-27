var GSBackgroundLayer = cc.Layer.extend({
    theme : 0,
    ctor:function(theme){
        this._super();
        this.theme = theme;
    },
    onEnter : function () {
        this._super();
        this.loadBackground();
    },
    loadBackground : function(){
        var node = new cc.Sprite(res.gs_bg);
        node.setPosition(winSize.width / 2, winSize.height / 2);
        this.addChild(node);
    }
});