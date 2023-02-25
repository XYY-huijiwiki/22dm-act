var GSBackgroundLayer = cc.Layer.extend({
    onEnter : function () {
        this._super();
        this.loadBackground();
    },
    loadBackground : function(){
        var node = new cc.Sprite(res.gp_bg_index_1);
        var bg = new cc.Sprite(res.gp_bg_index_2);
        node.setPosition(winSize.width / 2, winSize.height / 2);
        bg.setPosition(winSize.width / 2, winSize.height / 2);
        this.addChild(node);
        this.addChild(bg);
    }
});