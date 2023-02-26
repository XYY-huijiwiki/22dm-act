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
        this.y = -this.parent.y;
    },
    loadMenu:function(){
        var a = new ccui.Button("btn_continue.png","btn_continue.png","btn_continue.png",ccui.Widget.PLIST_TEXTURE);
        var b = new ccui.Button("btn_restart1.png","btn_restart1.png","btn_restart1.png",ccui.Widget.PLIST_TEXTURE);
        var c = new ccui.Button("btn_home.png","btn_home.png","btn_home.png",ccui.Widget.PLIST_TEXTURE);
        this.addChild(a);
        this.addChild(b);
        this.addChild(c);
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
        a.addTouchEventListener(function(sender,type){
            if(type == ccui.Widget.TOUCH_ENDED)
            {
                var event = new cc.EventCustom(jf.EventName.GP_REMOVE_MENU_LAYER);
                cc.eventManager.dispatchEvent(event);
            }
        },this);
        b.addTouchEventListener(function(sender,type){
            if(type == ccui.Widget.TOUCH_ENDED)
            {
                cc.audioEngine.stopMusic();
                cc.director.runScene(new GamePlayScene(true));
            }
        },this);
        c.addTouchEventListener(function(sender,type){
            if(type == ccui.Widget.TOUCH_ENDED)
            {
                cc.audioEngine.stopMusic();
                cc.director.runScene(new MainMenuScene());
            }
        },this);
        a.setPressedActionEnabled(true);
        b.setPressedActionEnabled(true);
        c.setPressedActionEnabled(true);
        a.setZoomScale(0.1);
        b.setZoomScale(0.1);
        c.setZoomScale(0.1);
    },
    loadMusicBtn : function(){
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
    }
});