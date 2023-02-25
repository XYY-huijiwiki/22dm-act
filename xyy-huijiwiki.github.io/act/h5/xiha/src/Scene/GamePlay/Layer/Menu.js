var GPMenuLayer = ccui.Layout.extend({
    menu  : null,
    onEnter : function(){
        this._super();
        cc.director.pause();    // 导演暂停
        this.loadConfig();
        this.loadMenu();
        this.loadMusicBtn();
        
    },
    onExit : function(){
        cc.director.resume();
        this._super();
    },
    loadConfig : function(){
        this.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        this.setContentSize(640,1008);
        this.setBackGroundColorOpacity(150);
        this.setBackGroundColor(cc.color(0, 0, 0));
    },
    loadMenu:function(){
        var continueNormal = new cc.Sprite("#btn_continue_normal.png");
        var continuePress = new cc.Sprite("#btn_continue_press.png");
        var continueDisabled = new cc.Sprite("#btn_continue_normal.png");
        var restartNormal = new cc.Sprite("#btn_restart_normal.png");
        var restartPress = new cc.Sprite("#btn_restart_press.png");
        var restartDisabled = new cc.Sprite("#btn_restart_normal.png");
        var homeNormal = new cc.Sprite("#btn_home_normal.png");
        var homePress = new cc.Sprite("#btn_home_press.png");
        var homeDisabled = new cc.Sprite("#btn_home_normal.png");
        var a = new cc.MenuItemSprite(
            continueNormal,
            continuePress,
            continueDisabled,
            function(){
                var event = new cc.EventCustom(jf.EventName.GP_REMOVE_MENU_LAYER);
                cc.eventManager.dispatchEvent(event);
            }.bind(this));
        var b = new cc.MenuItemSprite(
            restartNormal,
            restartPress,
            restartDisabled,
            function(){
                cc.director.runScene(new GamePlayScene(0));
            }.bind(this));
        var c = new cc.MenuItemSprite(
            homeNormal,
            homePress,
            homeDisabled,
            function(){
                cc.director.runScene(new MainMenuScene());
            }.bind(this));
        a.attr({
            x: winSize.width / 2, 
            y: winSize.height / 2 + 150
        });
        b.attr({
            x: winSize.width / 2, 
            y:winSize.height / 2
        });
        c.attr({
            x: winSize.width / 2, 
            y: winSize.height / 2 - 150
        });
        var menu = new cc.Menu(a,b,c);
        this.addChild(menu);
        menu.setPosition(0, 0);
        this.menu = menu;
        if(isPC)
            a.selected();
    },
    loadMusicBtn : function(){
        var node = new ccui.Button("btn_music_open.png","btn_music_open.png","btn_music_close.png",ccui.Widget.PLIST_TEXTURE);
        node.setPressedActionEnabled(true);
        node.setZoomScale(0.1);
        node.attr({
            x : 600,
            y : 968
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
    }
});