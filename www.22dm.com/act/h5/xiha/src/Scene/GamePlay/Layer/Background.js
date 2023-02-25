var GPBackgroundLayer = cc.Layer.extend({
    onEnter : function () {
        this._super();
        // 加载[背景]
        this.loadBackgound();
    },
    loadBackgound : function(){
        var node = new cc.Sprite(winSize.isMoonDay ? res.gp_bg_index_1_2 : res.gp_bg_index_1);
        var bg = new cc.Sprite(winSize.isMoonDay ? res.gp_bg_index_2_2 : res.gp_bg_index_2);
        this.addChild(node);
        this.addChild(bg);
        node.setPosition(winSize.width / 2, winSize.height / 2);
        bg.setAnchorPoint(0,0);
        bg.setPosition(0, 0);
        var m = cc.moveTo(winSize.backgroundLoopTimer,0,-bg.height+winSize.height+1);
        var sequence = cc.sequence(m,cc.callFunc(function(){
            bg.y=0;
        }.bind(this)));
        sequence.repeatForever();
        bg.runAction(sequence);
    }
});