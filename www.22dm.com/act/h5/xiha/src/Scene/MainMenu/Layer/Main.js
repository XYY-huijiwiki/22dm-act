var MMMainLayer = cc.Layer.extend({
    menu : null,
    ctor : function(){
        this._super();
    },
    onEnter : function(){
        this._super();
        this.loadMenu();
        this.loadMusicBtn();     
    },
    loadMenu : function(){
        var startNormal = new cc.Sprite("#btn_start_normal.png");
        var startPress = new cc.Sprite("#btn_start_press.png");
        var startDisabled = new cc.Sprite("#btn_start_normal.png");
        var ruleNormal = new cc.Sprite("#btn_rule_normal.png");
        var rulePress = new cc.Sprite("#btn_rule_press.png");
        var ruleDisabled = new cc.Sprite("#btn_rule_normal.png");
        var rankingNormal = new cc.Sprite("#btn_index_ranking_normal.png");
        var rankingPress = new cc.Sprite("#btn_index_ranking_press.png");
        var rankingDisabled = new cc.Sprite("#btn_index_ranking_normal.png");
        var start = new cc.MenuItemSprite(
            startNormal,
            startPress,
            startDisabled,
            function(){
                cc.director.runScene(new GamePlayScene(0));
            }.bind(this));
        var rule = new cc.MenuItemSprite(
            ruleNormal,
            rulePress,
            ruleDisabled,
            function(){
                var event = new cc.EventCustom(jf.EventName.MM_CREATE_RULE_LAYER);
                cc.eventManager.dispatchEvent(event);
            }.bind(this));
        var ranking = new cc.MenuItemSprite(
            rankingNormal,
            rankingPress,
            rankingDisabled,
            function(){
                winSize.runingLayer = "MainMenuScene_ranking";          
                xiha.ranking.open();
            }.bind(this));
        start.attr({
            x:150, 
            y:690
        });
        rule.attr({
            x:250, 
            y:510
        });
        ranking.attr({
            x:150, 
            y:330
        });
        var menu = new cc.Menu(start, rule,ranking);
        this.addChild(menu);
        menu.setPosition(0, 0);
        if(isPC)
            menu.children[0].selected();
    },
    loadMusicBtn : function(){
        var node = new ccui.Button("btn_music_open.png","btn_music_open.png","btn_music_close.png",ccui.Widget.PLIST_TEXTURE);
        node.setPressedActionEnabled(true);
        node.setZoomScale(0.1);
        node.attr({
            x : 600,
            y : 960
        });
        if(cc.audioEngine.getMusicVolume()<0.3){ //静音了
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
    }
});