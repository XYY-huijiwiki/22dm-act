var MMUILayer = cc.Layer.extend({
    Role        :  null,
    ButtonLayer :  null,
    ctor : function () {
        this._super();
    },
    onEnter : function () {
        this._super();
        cc.spriteFrameCache.addSpriteFrames(res.mm_dance_plist_0,res.mm_dance_png_0);
        cc.spriteFrameCache.addSpriteFrames(res.mm_dance_plist_1,res.mm_dance_png_1);
        cc.spriteFrameCache.addSpriteFrames(res.mm_dance_plist_2,res.mm_dance_png_2);
        this.loadRole();
        this.loadButtonLayer();
        this.registerEvent();
    },
    registerEvent : function(){
        var a = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.MM_ROLE_DANCE,
            callback    : this.onRoleDance
        });
        cc.eventManager.addListener(a, this);
    },
    loadRole : function(){
        var node = new cc.Sprite("#eye_1.png");
        this.Role = node;
        this.addChild(node);
        node.attr({
            x : winSize.width / 2,
            y : winSize.height / 2 - 80
        });
        node.runAction(ActionManager.MM_ROLE_EYE());
    },
    onRoleDance : function(event){
        var self = event.getCurrentTarget();
        var node = self.Role;
        node.stopAction(ActionManager._mm_role_eye);
        node.runAction(ActionManager.MM_ROLE_DANCE(function(){
            var event = new cc.EventCustom(jf.EventName.MM_RUN_GP);
            cc.eventManager.dispatchEvent(event);
        }));
    },
    loadButtonLayer : function(){
        this.ButtonLayer = {};
        this.loadButtonStart();
        this.loadButtonRule();
        this.loadButtonMusic();
        this.loadButtonRanking();
    },
    loadButtonStart : function(){
        var node = new ccui.Button("btn_start.png","btn_start.png","btn_start.png",ccui.Widget.PLIST_TEXTURE);
        node.setPressedActionEnabled(true);
        node.attr({
            x : winSize.width / 2,
            y : 80
        });
        node.addTouchEventListener(function(sender,type){
            if(type==ccui.Widget.TOUCH_ENDED && sender.pressedActionEnabled)
            {
                cc.audioEngine.playEffect(res.audio_button,false);
                sender.setPressedActionEnabled(false);
                var event = new cc.EventCustom(jf.EventName.MM_ROLE_DANCE);
                cc.eventManager.dispatchEvent(event);
            }
        },this);
        this.addChild(node);
    },
    loadButtonMusic : function(){
        var node = new ccui.Button("btn_music_1.png","btn_music_1.png","btn_music_2.png",ccui.Widget.PLIST_TEXTURE);
        node.setPressedActionEnabled(true);
        node.attr({
            x : 50,
            y : 960
        });
        if(cc.audioEngine.getMusicVolume()==0){ //静音了
            node.setBright(false);
        }
        node.addTouchEventListener(function(sender,type){
            if(type == ccui.Widget.TOUCH_ENDED)
            {
                if(sender._bright){  //静音
                    sender.setBright(false);
                    cc.audioEngine.setMusicVolume(0);
                    cc.audioEngine.setEffectsVolume(0);
                }
                else{   //开启声音
                    sender.setBright(true);
                    cc.audioEngine.setMusicVolume(winSize.audioVolume);
                    cc.audioEngine.setEffectsVolume(winSize.audioVolume);
                }
            }
        },this);
        this.addChild(node);
    },
    loadButtonRule : function(){
        var node = new ccui.Button("btn_rule.png","btn_rule.png","btn_rule.png",ccui.Widget.PLIST_TEXTURE);
        node.setPressedActionEnabled(true);
        node.attr({
            x : winSize.width - 60,
            y : 925
        });
        node.addTouchEventListener(function(sender,type){
            if(type==ccui.Widget.TOUCH_ENDED)
            {
                cc.audioEngine.playEffect(res.audio_button,false);
                dialogs.open("dialogs_rule");
            }
        },this);
        this.addChild(node);
    },
    loadButtonRanking : function(){
        var node = new ccui.Button("btn_ranking.png","btn_ranking.png","btn_ranking.png",ccui.Widget.PLIST_TEXTURE);
        node.setPressedActionEnabled(true);
        node.attr({
            x : winSize.width - 180,
            y : 930
        });
        node.addTouchEventListener(function(sender,type){
            if(type==ccui.Widget.TOUCH_ENDED)
            {
                cc.audioEngine.playEffect(res.audio_button,false);
                dialogs.open("dialogs_ranking");
            }
        },this);
        this.addChild(node);
    }   
});
