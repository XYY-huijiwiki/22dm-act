var GPUILayer = cc.Layer.extend({
    topBar    : null,
    scoreText : null,
    pauseBtn  : null,
    onEnter : function(){
        this._super();
        this.loadPauseButton();
        this.loadTopBar();
        this.registerEvent();
    },
    registerEvent : function(){
        var a = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_UPDATE_SCORE,
            callback    : this.onUpdateScore
        });
        cc.eventManager.addListener(a, this);
    },
    loadPauseButton : function () {
        var node = new ccui.Button("btn_pause_1.png","btn_pause_1.png","btn_pause_2.png",ccui.Widget.PLIST_TEXTURE);
        this.addChild(node);
        this.pauseBtn = node;
        node.setPressedActionEnabled(true);
        node.setZoomScale(0.1);
        node.x = 600;
        node.y = 964;
        node.addTouchEventListener(function(sender,type){
            if(type == ccui.Widget.TOUCH_ENDED)
            {
                sender.setTouchEnabled(false);
                var event = new cc.EventCustom(jf.EventName.GP_CREATE_MENU_LAYER);
                cc.eventManager.dispatchEvent(event);
            }
        },this);
    },
    loadTopBar:function(){
        var node = new cc.Sprite("#score_bar.png");
        this.addChild(node);
        this.topBar = node;
        node.setAnchorPoint(0.5,1);
        node.setPosition(winSize.width/2,winSize.height-5);
        this.loadScoreText();
    },
    loadScoreText : function(){
        var node = new ccui.Text(0, "Arial", 42);
        node.setTextColor(cc.color(239,255,6,1));
        this.topBar.addChild(node);
        this.scoreText = node;
        node.setAnchorPoint(0, 0);
        node.setPosition(this.topBar.width+5, -8);
    },
    onUpdateScore:function(event){
        var self = event.getCurrentTarget();
        var score = event.getUserData().score;
        self.scoreText.setString(score + "");
    }
});

