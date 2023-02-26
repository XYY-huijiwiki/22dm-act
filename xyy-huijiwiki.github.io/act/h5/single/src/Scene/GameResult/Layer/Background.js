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
        var src = [res.gs_bg_bad,res.gs_bg_soso,res.gs_bg_good,res.gs_bg_best];
        var node = new cc.Sprite(src[this.theme]);
        node.setPosition(winSize.width / 2, winSize.height / 2);
        this.addChild(node);
    }
});