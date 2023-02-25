var GSRankingLayer = cc.Layer.extend({
    onEnter : function () {
        this._super();
        //this.registerEvent();
    },
    registerEvent:function(){
        gamepad.bind(Gamepad.Event.BUTTON_DOWN, function(e) {
            var event = new cc.EventCustom(jf.EventName.GS_REMOVE_RANKING_LAYER);
            cc.eventManager.dispatchEvent(event);   
        });
        plane.openRankingList();
    },
    loadBackground : function(){
        var bg = new cc.Sprite(res.gs_bg);
        this.addChild(bg);
        bg.setPosition(winSize.width / 2, winSize.height / 2);
    },
    loadCloseButton:function(){
        var node = new ccui.Button(res.mm_btn_xx_1,res.mm_btn_xx_2);
        this.addChild(node);
        node.setPosition(winSize.width / 2+230, winSize.height / 2 +370);
        node.addTouchEventListener(function(sender, type) {
            switch (type) {
                case ccui.Widget.TOUCH_ENDED:
                    var event = new cc.EventCustom(jf.EventName.GS_REMOVE_RANKING_LAYER);
                    cc.eventManager.dispatchEvent(event);
                    break;
            }
        }.bind(this));
    }

});