var GSBackgroundLayer = cc.Layer.extend({
    onEnter : function () {
        this._super();
        this.loadForeground();
    },
    loadForeground : function(){
        var node = new cc.Sprite(res.gg_bg_1);
        var bg = new cc.Sprite(res.gg_bg_2);
        this.addChild(node);
        this.addChild(bg);
        node.setPosition(winSize.width / 2, winSize.height / 2);
        bg.setPosition(winSize.width / 2, winSize.height / 2);
    }
});