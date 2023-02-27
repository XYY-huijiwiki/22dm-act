var MMUILayer = cc.Layer.extend({
    Role        :  null,
    ctor : function () {
        this._super();
    },
    onEnter : function () {
        this._super();
        this.loadButtonLayer();
    },
    loadButtonLayer : function(){
        this.loadTitle();
        this.loadRole();
        this.loadButtonStart();
        this.loadButtonMusic();
        this.loadButtonRule();
        this.loadButtonRanking();
        this.loadButtonJuji();
    },
    loadTitle : function(){
        var node = new cc.Sprite(res.mm_title);
        this.addChild(node);
        node.setPosition(winSize.width / 2, 770);
        node.runAction(ActionManager.MM_TITLE_FLOAT());
    },
    loadRole : function(){
        var node = new cc.Sprite(res.mm_role);
        this.addChild(node);
        node.setPosition(winSize.width / 2, 450);
        node.runAction(ActionManager.MM_ROLE_FLOAT());
    },
    loadButtonStart : function(){
        var node = new ccui.Button(res.mm_btn_start,res.mm_btn_start,res.mm_btn_start);
        node.setPressedActionEnabled(true);
        node.attr({
            x : winSize.width / 2,
            y : 160
        });
        node.addTouchEventListener(function(sender,type){
            if(type==ccui.Widget.TOUCH_ENDED && sender.pressedActionEnabled)
            {
                cc.audioEngine.playEffect(res.audio_button,false);
                sender.setPressedActionEnabled(false);
                var event = new cc.EventCustom(jf.EventName.MM_RUN_GP);
                cc.eventManager.dispatchEvent(event);
            }
        },this);
        this.addChild(node);
    },
    loadButtonMusic : function(){
        var node = new ccui.Button(res.pb_btn_music_2,res.pb_btn_music_2,res.pb_btn_music_1);
        node.setPressedActionEnabled(true);
        node.attr({
            anchorX : 1,
            anchorY : 1,
            x : winSize.width-23,
            y : winSize.height-20
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
        var node = new ccui.Button(res.mm_btn_rule,res.mm_btn_rule,res.mm_btn_rule);
        node.setPressedActionEnabled(true);
        node.attr({
            anchorX : 0,
            anchorY : 1,
            x : 20,
            y : winSize.height-20
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
        var node = new ccui.Button(res.mm_btn_ranking,res.mm_btn_ranking,res.mm_btn_ranking);
        node.setPressedActionEnabled(true);
        node.attr({
            x : winSize.width - 115,
            y : 110
        });
        node.addTouchEventListener(function(sender,type){
            if(type==ccui.Widget.TOUCH_ENDED)
            {
                cc.audioEngine.playEffect(res.audio_button,false);
                dialogs.open("dialogs_ranking");
            }
        },this);
        this.addChild(node);
    },
    loadButtonJuji : function(){
        var node = new ccui.Button(res.mm_btn_juji,res.mm_btn_juji,res.mm_btn_juji);
        node.setPressedActionEnabled(true);
        node.attr({
            x : 115,
            y : 110
        });
        node.addTouchEventListener(function(sender,type){
            if(type==ccui.Widget.TOUCH_ENDED)
            {
                cc.audioEngine.playEffect(res.audio_button,false);
                dialogs.open("dialogs_juji");
            }
        },this);
        this.addChild(node);
    }
});
