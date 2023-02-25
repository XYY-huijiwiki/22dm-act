var MMBackgroundLayer = cc.Layer.extend({
    ctor : function () {
        this._super();
        // 加载[背景]
        this.loadBackgound();
    },
    loadBackgound : function(){
        var node = new cc.Sprite(res.mm_bg);
        this.addChild(node);
        node.setPosition(winSize.width / 2, winSize.height / 2);
    }
});