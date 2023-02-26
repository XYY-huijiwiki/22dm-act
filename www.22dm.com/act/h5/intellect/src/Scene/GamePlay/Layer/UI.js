var GPUILayer = cc.Layer.extend({
    timer        : null,
    scoreText    : null,
    timerText    : null,
    ctor:function(){
        this._super();
    },
    onEnter : function(){
        this._super();
        this.loadTimerBg();
        this.loadBackgound();
        if(v_main.isbattle)
            this.loadVS();
        this.registerEvent();
    },
    registerEvent : function(){
        // [事件监听]更新分数
        var a = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_UPDATE_SCORE_TEXT,
            callback    : this.onUpdateScoreText
        });
        cc.eventManager.addListener(a, this);

        // [事件监听]更新秒数
        var c = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_UPDATE_TIMER_TEXT,
            callback    : this.onUpdateTimerText
        });
        cc.eventManager.addListener(c, this); 

        // [事件监听]时间轴开始运行
        var f = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_TIMER_START,
            callback    : this.onTimerStart
        });
        cc.eventManager.addListener(f, this);
        cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_TIMER_START)); 
    },
    onTimerStart : function(event){
        var self = event.getCurrentTarget();
        if(self.timer!=null)
            self.timer.removeFromParent();
        if(self.timerText!=null)
            self.timerText.removeFromParent();
        self.loadTimer();
        self.loadTimerText();
        GameManager.currTimer.runAction(ActionManager.GP_RUN_TIMER(winSize.GameTime,GameManager.currTimer.width,function(){
            GameManager.touch = false;
            if(!v_main.isbattle)
                intellect.next();
            else
                socket.check();
        }));
        GameManager.currTimerText.runAction(ActionManager.GP_RUN_TIMER_TEXT(winSize.GameTime,function(){
            cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_UPDATE_TIMER_TEXT));
        }));
    },
    loadTimerText : function(){
        var node = new ccui.Text(winSize.GameTime+"s", "Arial", 36);
        node.setTextColor(cc.color(230,47,53));
        node.attr({
            anchorX : 0,
            anchorY : 0,
            x:410,
            y:772,
            time : winSize.GameTime
        });
        this.addChild(node,20);
        this.timerText = node;
        GameManager.currTimerText = node;
    },
    loadTimer : function(){
        var node = new cc.Sprite(res.gp_timer);
        node.attr({
            anchorX:0,
            anchorY:0,
            x:231,
            y:816
        });
        this.addChild(node,5);
        this.timer = node;
        GameManager.currTimer = node;
    },
    loadTimerBg : function(){
        var bg = new cc.Sprite(res.gp_timer_bg);
        bg.attr({
            anchorX:0,
            anchorY:0,
            x:231,
            y:820
        });
        this.timer_bg = bg;
        this.addChild(bg,5);
    },
    onUpdateScoreText:function(event){
        var self = event.getCurrentTarget();
        self.scoreText.setString(GameManager.currScore);
    },
    onUpdateTimerText : function(event){
        var self = event.getCurrentTarget();
        self.timerText.time--;
        if(self.timerText.time>=0){
            self.timerText.setString(self.timerText.time+"s");
            if(self.timerText.time<=3){
                self.timerText.setColor(cc.color(255,240,0,1));
                if(self.timerText.time>0)
                    cc.audioEngine.playEffect(res.audio_timer_3,false);
            }
        }
    },
    loadVS : function(){
        var node = new cc.Sprite(res.gp_vs);
        node.setPosition(winSize.width/2,winSize.height/2+380);
        node.runAction(ActionManager.GP_ARTICLE_BLINK());
        this.addChild(node,20);
    },
    loadBackgound : function(){   
        var node = new cc.Sprite(res.gp_bg);
        node.setPosition(winSize.width/2,winSize.height/2);
        this.addChild(node,10);      
    }
});

