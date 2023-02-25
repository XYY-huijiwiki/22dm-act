var GPUILayer = cc.Layer.extend({
    hpLayer   : null,
    topBar    : null,
    hp        : 3,
    scoreText : null,
    levelText : null,
    pauseBtn  : null,
    tips      : [],
    tipsCount : [0,0,0],
    onEnter : function(){
        this._super();
        this.loadHP();
        this.loadTopBar();
        this.loadPauseButton();
        this.loadTips();
        this.registerEvent();
        this.tipsCount = [0,0,0];
    },
    registerEvent : function(){
        var a = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_UPDATE_SCORE,
            callback    : this.onUpdateScore
        });
        cc.eventManager.addListener(a, this);

        var b = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_UPDATE_LEVEL,
            callback    : this.onUpdateLevel
        });
        cc.eventManager.addListener(b, this);

        var c = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_UPDATE_HP,
            callback    : this.onUpdateHP
        });
        cc.eventManager.addListener(c, this);
    },
    loadTips : function(){
        var tips_ice = new cc.Sprite("#tip_2.png");
        var tips_music = new cc.Sprite("#tip_3.png");
        var tips_moon = new cc.Sprite("#tip_4.png");
        tips_ice.attr({
            x : winSize.width/2,
            y : tips_ice.height/2+80,
            opacity : 0
        });
        tips_music.attr({
            x : winSize.width/2,
            y : tips_music.height/2+80,
            opacity : 0
        });
        tips_moon.attr({
            x : winSize.width/2,
            y : tips_moon.height/2+80,
            opacity : 0
        });
        this.tips = [];
        this.tips.push(tips_ice);
        this.tips.push(tips_music);
        this.tips.push(tips_moon);
        this.addChild(tips_ice);
        this.addChild(tips_music);
        this.addChild(tips_moon);
    },
    loadTopBar : function(){
        var node = new cc.Sprite("#ui_score.png");
        this.addChild(node);
        this.topBar = node;
        node.setAnchorPoint(0,1);
        node.setPosition(5,winSize.height-5);
        this.loadScoreText();
        this.loadLevelText();
    },
    loadHP : function(){
        var loop = this.hp;
        var bg = new cc.Sprite("#ui_blood_bg.png");
        for(var i=0;i<loop;i++){
            var hp = new cc.Sprite("#ui_blood_inner.png");
            hp.attr({
                x: 73 + i*30,
                y: 33
            });
            bg.addChild(hp);
        }
        bg.attr({
            x:90,
            y:40
        });
        this.hpLayer = bg;
        this.addChild(bg);
    },
    loadPauseButton : function () {
        var node = new ccui.Button("btn_pause.png","btn_pause.png","btn_pause.png",ccui.Widget.PLIST_TEXTURE);
        this.addChild(node);
        this.pauseBtn = node;
        node.setPressedActionEnabled(true);
        node.setZoomScale(0.1);
        node.x = 600;
        node.y = 968;
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
        var node = new ccui.Text(0, "Microsoft YaHei", 36);
        node.setTextColor(cc.color(2,203,255,1));
        this.topBar.addChild(node);
        this.scoreText = node;
        node.setAnchorPoint(0.5, 0.5);
        node.setPosition(153, 33);
    },
    loadLevelText : function(){
        var node = new ccui.Text(1, "Microsoft YaHei", 34);
        this.topBar.addChild(node);
        this.levelText = node;
        node.setAnchorPoint(0.5, 0.5);
        node.setPosition(38, 33);
    },
    onUpdateHP : function(event){
        var self = event.getCurrentTarget();
        var hp = self.hpLayer;
        if(hp.childrenCount>0){
            var node = hp.children[hp.childrenCount-1];
            node.runAction(AnctionManager.onUpdateHP(node));
            
        }
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
    }
});

