var GamePlayScene = cc.Scene.extend({
    backgroundLayer : null, // 背景层
    mainLayer       : null, // 玩法层
    UILayer         : null, // UI层
    menuLayer       : null, // 菜单层
    dialogsLayer    : null,
    iceLayer        : null,
    level           : 0,
    ctor : function(level){
        this._super();
        this.level = level;
        if(!cc.audioEngine.isMusicPlaying())
            cc.audioEngine.playMusic(res.audio_music, true);
    },
    onEnter : function () {
        this._super();
        this.registerEvent();
        this.loadBackgroundLayer();
        this.loadMainLayer();
        this.loadUILayer();
        winSize.runingLayer = 'GamePlayScene_index';
        
    },
    registerEvent : function(){
        // [事件监听]创建菜单层
        var a = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_CREATE_MENU_LAYER ,
            callback    : this.onCreateMenuLayer
        });
        cc.eventManager.addListener(a, this);

        // [事件监听]移除菜单层
        var b = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_REMOVE_MENU_LAYER ,
            callback    : this.onRemoveMenuLayer
        });
        cc.eventManager.addListener(b, this);

        // [事件监听]菜单层选择
        var c = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_SELECT,
            callback    : this.onMenuSelect
        });
        cc.eventManager.addListener(c, this);

        // [事件监听]菜单层点击
        var d = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_CLICK,
            callback    : this.onMenuClick
        });
        cc.eventManager.addListener(d, this);

        // [事件监听]创建Dialogs
        var e = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_CREATE_DIALOGS_LAYER,
            callback    : this.onCreateDialogsLayer
        });
        cc.eventManager.addListener(e, this);

        // [事件监听]移除Dialogs
        var f = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_REMOVE_DIALOGS_LAYER,
            callback    : this.onRemoveDialogsLayer
        });
        cc.eventManager.addListener(f, this);

        // [事件监听]创建Dialogs
        var g = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_CREATE_ICE_LAYER,
            callback    : this.onCreateIceLayer
        });
        cc.eventManager.addListener(g, this);

        // [事件监听]移除Dialogs
        var h = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_REMOVE_ICE_LAYER,
            callback    : this.onRemoveIceLayer
        });
        cc.eventManager.addListener(h, this);
    },
    onMenuSelect : function(event){
        var self = event.getCurrentTarget();
        var value = event.getUserData().value;
        var menu = self.menuLayer._children[0];
        var total = menu.childrenCount;
        var index;
        for(var i=0;i<total;i++){
            if(menu.children[i].isSelected())
                index = i;
            menu.children[i].unselected();
        }
        if(value>0){ //下
            index = index >= total-1 ? 0 : index+1;
        }
        else{
            index = index <= 0 ? total-1 : index-1;
        }   
        menu.children[index].selected();
    },
    onMenuClick : function(event){
        var self = event.getCurrentTarget();
        var menu = self.menuLayer._children[0];
        var index;
        for(var i=0;i<menu.childrenCount;i++){
            if(menu.children[i].isSelected()){
                menu.children[i].activate();
                break;
            }
        }  
    },
    loadBackgroundLayer : function(){
        var node = new GPBackgroundLayer();
        this.addChild(node);
        this.backgroundLayer = node;
    },
    loadMainLayer : function(){
        this.mainLayer = new GPMainLayer(this.level);
        this.addChild(this.mainLayer);
    },
    loadUILayer : function(){
        this.UILayer = new GPUILayer();
        this.addChild(this.UILayer);
    },
    loadMenuLayer : function(){
        this.menuLayer = new GPMenuLayer();
        this.addChild(this.menuLayer);
    },
    loadIceLayer : function(){
        var node = new cc.Sprite(res.gp_bg_ice);
        node.attr({
            x : winSize.width/2,
            y : winSize.height/2,
            opacity : 0
        });
        var fadeIn = cc.fadeIn(1);
        this.iceLayer = node;
        this.addChild(this.iceLayer);
        node.runAction(fadeIn);
    },
    loadDialogsLayer : function(data){
        this.dialogsLayer = new GPDialogsLayer(data.text,data.cb);
        this.addChild(this.dialogsLayer);
    },
    onCreateDialogsLayer : function(event) {
        var self = event.getCurrentTarget();
        var data = event.getUserData();
        self.loadDialogsLayer(data);
    },
    onRemoveDialogsLayer : function(event){ 
        var self = event.getCurrentTarget();
        self.removeChild(self.dialogsLayer);
    },
    onCreateMenuLayer : function(event) {
        var self = event.getCurrentTarget();
        winSize.runingLayer = 'GamePlayScene_menu';
        self.loadMenuLayer();
    },
    onRemoveMenuLayer : function(event){
        var self = event.getCurrentTarget();
        winSize.runingLayer = 'GamePlayScene_index';
        self.UILayer.pauseBtn.setTouchEnabled(true);
        self.removeChild(self.menuLayer);
    },
    onCreateIceLayer : function(event){
        var self = event.getCurrentTarget();
        self.loadIceLayer();
    },
    onRemoveIceLayer : function(event){
        var self = event.getCurrentTarget();
        self.removeChild(self.iceLayer);
    }
});