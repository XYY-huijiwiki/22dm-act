var GPUILayer = cc.Layer.extend({
    topBar : null,
    scoreText : null,
    levelText : null,
    pauseBtn  : null,
    onEnter : function(){
        this._super();
        this.loadTopBar();
        if(!isPC)
            this.loadPauseButton();
        this.registerEvent();
    },
    registerEvent : function(){
        var onUpdateScoreListener = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_UPDATE_SCORE,
            callback    : this.onUpdateScore
        });
        cc.eventManager.addListener(onUpdateScoreListener, this);
        var onUpdateLevelListener = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_UPDATE_LEVEL,
            callback    : this.onUpdateLevel
        });
        cc.eventManager.addListener(onUpdateLevelListener, this);
    },
    loadTopBar:function(){
        var node = new cc.Sprite(res.gg_score_bg);
        this.addChild(node);
        this.topBar = node;
        node.setAnchorPoint(0,1);
        node.setPosition(0,winSize.height);
        this.loadScoreText();
        this.loadLevelText();
    },
    loadPauseButton : function () {
        var node = new ccui.Button(res.gg_btn_pause_1,res.gg_btn_pause_1,res.gg_btn_pause_2);
        this.addChild(node,-1);
        this.pauseBtn = node;
        node.setPressedActionEnabled(true);
        node.setZoomScale(0.1);
        node.x = winSize.width - node.width/2-30;
        node.y = winSize.height - node.height/2-30;
        node.addTouchEventListener(function(sender,type){
            if(type == ccui.Widget.TOUCH_ENDED)
            {
                sender.setTouchEnabled(false);
                var event = new cc.EventCustom(jf.EventName.GP_CREATE_MENU_LAYER);
                cc.eventManager.dispatchEvent(event);
            }
        },this);
    },
    loadScoreText : function(){
        var node = new ccui.Text(0, "Arial", 32);
        node.setTextColor(cc.color(232,254,0,1));
        this.topBar.addChild(node);
        this.scoreText = node;
        node.setAnchorPoint(0.5, 0.5);
        node.setPosition(153, 45);
    },
    loadLevelText : function(){
        var node = new ccui.Text(1, "Arial", 28);
        this.topBar.addChild(node);
        this.levelText = node;
        node.setAnchorPoint(0.5, 0.5);
        node.setPosition(53, 45);
    },
    onUpdateScore:function(event){
        var self = event.getCurrentTarget();
        var score = event.getUserData().score;
        self.scoreText.setString(score + "");
    },
    onUpdateLevel:function(event){
        var self = event.getCurrentTarget();
        var level = event.getUserData().level;
        self.levelText.setString(level + "");
    },
});

