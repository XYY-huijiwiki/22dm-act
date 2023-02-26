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
        this.loadButtonRule();
        this.loadButtonMusic();

        this.loadTitle();
        this.loadRole();

        this.loadButtonSolo();
        this.loadButtonBattle();
        this.loadButtonRanking();
    },
    loadRole : function(){
        var node_0 = new cc.Sprite(res.mm_role_0);
        var node_1 = new cc.Sprite(res.mm_role_1);
        var node_2 = new cc.Sprite(res.mm_role_2);
        var node_3 = new cc.Sprite(res.mm_role_3);
        node_0.setPosition(winSize.width / 2, winSize.height / 2+65);
        node_1.setPosition(winSize.width / 2-50, winSize.height / 2-50);
        node_2.setPosition(winSize.width / 2+80, winSize.height / 2+185);
        node_3.setPosition(winSize.width / 2+190, winSize.height / 2+20);
        node_0.runAction(ActionManager.MM_ROLE_ROTATE());
        node_1.runAction(ActionManager.MM_ROLE_FLOAT());
        this.addChild(node_0);
        this.addChild(node_2);
        this.addChild(node_3);
        this.addChild(node_1);
    },
    loadTitle : function(){
        var node = new cc.Sprite(res.mm_title);
        this.addChild(node,5);
        node.setPosition(winSize.width / 2, 980);
        node.runAction(ActionManager.MM_TITLE_FLOAT());
    },
    loadButtonBattle : function(){
        var node = new ccui.Button(res.mm_btn_battle,res.mm_btn_battle,res.mm_btn_battle);
        node.setPressedActionEnabled(true);
        node.attr({
            x : winSize.width / 2+5,
            y : 170
        });
        node.addTouchEventListener(function(sender,type){
            if(type==ccui.Widget.TOUCH_ENDED && sender.pressedActionEnabled)
            {
                cc.audioEngine.playEffect(res.audio_button,false);
                intellect.btn_waiting();            
            }
        },this);
        this.addChild(node);
    },
    loadButtonMusic : function(){
        var node = new ccui.Button(res.mm_btn_music_2,res.mm_btn_music_2,res.mm_btn_music_1);
        node.setPressedActionEnabled(true);
        node.attr({
            anchorX : 1,
            anchorY : 1,
            x : winSize.width-23,
            y : winSize.height-30
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
            x : 10,
            y : winSize.height-10
        });
        node.addTouchEventListener(function(sender,type){
            if(type==ccui.Widget.TOUCH_ENDED)
            {
                cc.audioEngine.playEffect(res.audio_button,false);
                v_dialogs.active='rule';
            }
        },this);
        this.addChild(node);
    },
    loadButtonRanking : function(){
        var node = new ccui.Button(res.mm_btn_ranking,res.mm_btn_ranking,res.mm_btn_ranking);
        node.setPressedActionEnabled(true);
        node.attr({
            x : winSize.width - 115,
            y : 145
        });
        node.addTouchEventListener(function(sender,type){
            if(type==ccui.Widget.TOUCH_ENDED)
            {
                cc.audioEngine.playEffect(res.audio_button,false);
                v_dialogs.active='ranking';
            }
        },this);
        this.addChild(node);
    },
    loadButtonSolo : function(){
        var node = new ccui.Button(res.mm_btn_solo,res.mm_btn_solo,res.mm_btn_solo);
        node.setPressedActionEnabled(true);
        node.attr({
            x : 115,
            y : 145
        });
        node.addTouchEventListener(function(sender,type){
            if(type==ccui.Widget.TOUCH_ENDED)
            {
                cc.audioEngine.playEffect(res.audio_button,false);
                intellect.btn_select(); 
            }
        },this);
        this.addChild(node);
    }
});
