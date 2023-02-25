var MMMainLayer = cc.Layer.extend({
    ctor : function(){
        this._super();
        this.loadMenu();
    },
    loadMenu : function(){
        var startNormal = new cc.Sprite(res.mm_btn_1_1);
        var startPress = new cc.Sprite(res.mm_btn_1_2);
        var startDisabled = new cc.Sprite(res.mm_btn_1_1);
        var guideNormal = new cc.Sprite(res.mm_btn_2_1);
        var guidePress = new cc.Sprite(res.mm_btn_2_2);
        var guideDisabled = new cc.Sprite(res.mm_btn_2_1);
        var recordNormal = new cc.Sprite(res.mm_btn_3_2);
        var recordPress = new cc.Sprite(res.mm_btn_3_1);
        var recordDisabled = new cc.Sprite(res.mm_btn_3_2);
        var start = new cc.MenuItemSprite(
            startNormal,
            startPress,
            startDisabled,
            function(){
                cc.director.runScene(new GamePlayScene(0));
            }.bind(this));
        var guide = new cc.MenuItemSprite(
            guideNormal,
            guidePress,
            guideDisabled,
            function(){
                var event = new cc.EventCustom(jf.EventName.MM_CREATE_GUIDE_LAYER);
                cc.eventManager.dispatchEvent(event);
            }.bind(this));
        var record = new cc.MenuItemSprite(
            recordNormal,
            recordPress,
            recordDisabled,
            function(){
                var event = new cc.EventCustom(jf.EventName.MM_CREATE_RECORD_LAYER);
                cc.eventManager.dispatchEvent(event);
            }.bind(this));
        start.attr({
            x:90, 
            y:280
        });
        guide.attr({
            x:90, 
            y:140
        });
        record.attr({
            x:90, 
            y:50
        });
        var menu = new cc.Menu(start, guide,record);
        this.addChild(menu);
        menu.setPosition(0, 0);
        if(isPC)
            menu.children[1].selected();
    }
});