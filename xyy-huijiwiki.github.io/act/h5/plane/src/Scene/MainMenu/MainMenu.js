var MainMenuScene = cc.Scene.extend({
    backgroundLayer : null,
    mainLayer       : null,
    guideLayer      : null,
    recordLayer     : null,
    ctor : function(){
        this._super();
        //cc.audioEngine.playMusic(res.sd_mm_BGMusic_mp3, true);
    },
    onEnter : function () {
        this._super();
        this.loadBackgroundLayer();
        this.loadMainLayer();
        this.registerEvent();
    },
    registerEvent : function(){
        var a = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.MM_CREATE_GUIDE_LAYER,
            callback    : this.onCreateGuideLayer
        });
        cc.eventManager.addListener(a, this);
        var b = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.MM_REMOVE_GUIDE_LAYER,
            callback    : this.onRemoveGuideLayer
        });
        cc.eventManager.addListener(b, this);
        var c = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.MM_CREATE_RECORD_LAYER,
            callback    : this.onCreateRecordLayer
        });
        cc.eventManager.addListener(c, this);
        var d = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.MM_REMOVE_RECORD_LAYER,
            callback    : this.onRemoveRecordLayer
        });
        cc.eventManager.addListener(d, this);
        var e = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.MM_CREATE_GAMEPAD,
            callback    : this.onCreateGamePad
        });
        cc.eventManager.addListener(e, this);
        var f = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.MM_REOMVE_GAMEPAD,
            callback    : this.onRemoveGamePad
        });
        cc.eventManager.addListener(f, this);
        cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.MM_CREATE_GAMEPAD));
    },
    onCreateGamePad:function(s){
        var mainLayer = s._currentTarget.mainLayer.children[0];
        var total = mainLayer.childrenCount;
        gamepad.bind(Gamepad.Event.AXIS_CHANGED, function(e) {
            if(e.axis=="LEFT_STICK_Y" && Math.abs(e.value)>=0.95){
                //console.info(e.value);
                var index;
                for(var i=0;i<total;i++){
                    if(mainLayer.children[i].isSelected())
                        index = i;
                    mainLayer.children[i].unselected();
                }
                if(e.value>0){ //下
                    index = index >= total-1 ? 0 : index+1;
                }
                else{
                    index = index <= 0 ? total-1 : index-1;
                }   
                mainLayer.children[index].selected();
            }
        });
        gamepad.bind(Gamepad.Event.BUTTON_DOWN, function(e) {
            if(e.control=="FACE_2"){
                for(var i=0;i<total;i++){
                    if(mainLayer.children[i].isSelected()){
                        gamepad.unbind(Gamepad.Event.BUTTON_DOWN);
                        gamepad.unbind(Gamepad.Event.AXIS_CHANGED);
                        mainLayer.children[i].activate();
                        break;
                    }
                }
            }
            else if(e.control=="SELECT_BACK"){
                location.href = loginUrl;
            }
        });
    },
    onRemoveGamePad:function(){
        console.info("unbind");
        gamepad.unbind(Gamepad.Event.AXIS_CHANGED);
        gamepad.unbind(Gamepad.Event.BUTTON_DOWN);
    },
    loadBackgroundLayer : function(){
        this.backgroundLayer = new MMBackgroundLayer();
        this.addChild(this.backgroundLayer);
    },
    loadMainLayer : function(){
        this.mainLayer = new MMMainLayer();
        this.addChild(this.mainLayer);
    },
    loadGuideLayer : function(){
        var node = new MMGuideLayer();
        this.addChild(node);
        this.guideLayer = node;
    },
    onCreateGuideLayer : function(event) {
        cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.MM_REOMVE_GAMEPAD));
        var self = event.getCurrentTarget();
        self.loadGuideLayer();
    },
    onRemoveGuideLayer : function(event){
        var self = event.getCurrentTarget();
        self.removeChild(self.guideLayer);
        gamepad.unbind(Gamepad.Event.BUTTON_DOWN);
        cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.MM_CREATE_GAMEPAD));
    },
    loadRecordLayer : function(){
        var node = new MMRecordLayer();
        this.addChild(node);
        this.recordLayer = node;
    },
    onCreateRecordLayer : function(event) {
        cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.MM_REOMVE_GAMEPAD));
        var self = event.getCurrentTarget();
        self.loadRecordLayer();
    },
    onRemoveRecordLayer : function(event){
        var self = event.getCurrentTarget();
        self.removeChild(self.recordLayer);
        gamepad.unbind(Gamepad.Event.BUTTON_DOWN);
        cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.MM_CREATE_GAMEPAD));
    },
});