var MMRuleLayer = ccui.Layout.extend({
    onEnter:function(){
        this._super();
        this.loadConfig();
        this.loadBackgound();
        if(!isPC)
            this.loadCloseButton();
    },
    loadConfig : function(){
        //this.setTouchEnabled(true);
        this.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        this.setContentSize(winSize);
        this.setBackGroundColorOpacity(70);
        this.setBackGroundColor(cc.color(0, 0, 0));
    },
    loadBackgound : function(){
        if(isPC)
            var node = new cc.Sprite(res.mm_bg_rule_1);
        else
            var node = new cc.Sprite(res.mm_bg_rule_2);
        this.addChild(node);
        node.setPosition(winSize.width / 2, winSize.height / 2);
    },
    loadCloseButton:function(){
        var node = new ccui.Button("btn_close_normal.png","btn_close_press.png","btn_close_normal.png",ccui.Widget.PLIST_TEXTURE);
        this.addChild(node);
        node.setPosition(545, 955);
        node.addTouchEventListener(function(sender, type) {
            switch (type) {
                case ccui.Widget.TOUCH_ENDED:
                    var event = new cc.EventCustom(jf.EventName.MM_REMOVE_RULE_LAYER);
                    cc.eventManager.dispatchEvent(event);
                    break;
                default:
                    break;
            }
        }.bind(this));
    }
});