var MMUILayer = cc.Layer.extend({
    Role        :  null,
    ctor : function () {
        this._super();
    },
    onEnter : function () {
        this._super();
        this.loadTitle();
        this.loadBoy();
        this.loadGirl();
    },
    loadTitle : function(){
        var node = new cc.Sprite(res.mm_title);
        this.addChild(node);
        node.setPosition(winSize.width / 2, 950);
        node.runAction(ActionManager.MM_TITLE_FLOAT());
    },
    loadBoy : function(){
        var node = new cc.Sprite("#h_1.png");
        node.attr({
            anchorX:0,
            anchorY:0,
            x:0,
            y:winSize.scaleOffsetY
        });
        GameManager.MM_ROLE_BOY = node;
        this.addChild(node);
    },
    loadGirl : function(){
        var node = new cc.Sprite("#l_1.png");
        node.attr({
            anchorX:0,
            anchorY:0,
            x:winSize.width/2,
            y:winSize.scaleOffsetY
        });
        GameManager.MM_ROLE_GIRL = node;
        this.addChild(node);
    }
});
