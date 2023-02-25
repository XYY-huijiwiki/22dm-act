var MMGuideLayer = ccui.Layout.extend({
    onEnter:function(){
        this._super();
        this.loadConfig();
        this.loadBackgound();
        this.loadCloseButton();
        this.registerEvent();
    },
    loadConfig : function(){
        //this.setTouchEnabled(true);
        this.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        this.setContentSize(winSize);
        this.setBackGroundColorOpacity(220);
        this.setBackGroundColor(cc.color(0, 0, 0));
    },
    registerEvent : function(){
        gamepad.bind(Gamepad.Event.BUTTON_DOWN, function(e) {
            if(e.control=="FACE_2" || e.control=="START_FORWARD"){
                var event = new cc.EventCustom(jf.EventName.MM_REMOVE_GUIDE_LAYER);
                cc.eventManager.dispatchEvent(event);             
            }
        });
    },
    loadBackgound : function(){
        if(isPC)
            var node = new cc.Sprite(res.mm_guide_1);
        else
            var node = new cc.Sprite(res.mm_guide_2);
        this.addChild(node);
        node.setPosition(winSize.width / 2, winSize.height / 2);
    },
    loadCloseButton:function(){
        var node = new ccui.Button(res.mm_btn_xx_1,res.mm_btn_xx_2);
        this.addChild(node);
        node.setPosition(winSize.width / 2+230, winSize.height / 2 +350);
        node.addTouchEventListener(function(sender, type) {
            switch (type) {
                case ccui.Widget.TOUCH_ENDED:
                    var event = new cc.EventCustom(jf.EventName.MM_REMOVE_GUIDE_LAYER);
                    cc.eventManager.dispatchEvent(event);
                    break;
                default:
                    break;
            }
        }.bind(this));
    }
});