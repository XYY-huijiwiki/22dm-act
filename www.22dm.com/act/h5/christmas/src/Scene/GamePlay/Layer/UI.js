var GPUILayer = cc.Layer.extend({
    topBar       : null,
    bottomBar    : null,
    scoreText    : null,
    skillText    : null,
    timerText    : null,
    timerMove    : null,
    topArticles  : [],
    ctor:function(){
        this._super();
    },
    onEnter : function(){
        this._super();
        this.loadTimer();
        this.loadTopBar();
        this.loadBottomBar();
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

        // [事件监听]更新技能数
        var b = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_UPDATE_SKILL_TEXT,
            callback    : this.onUpdateSkillText
        });
        cc.eventManager.addListener(b, this);

        // [事件监听]更新秒数
        var c = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_UPDATE_TIMER_TEXT,
            callback    : this.onUpdateTimerText
        });
        cc.eventManager.addListener(c, this); 

        // [事件监听]更新顶部物品数
        var d = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_UPDATE_ARTICLE_TEXT,
            callback    : this.onUpdateTopArticle
        });
        cc.eventManager.addListener(d, this);

        // [事件监听]显示禁止符号
        var e = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_CREATE_FORBID_TIP,
            callback    : this.onCreateForbidTips
        });
        cc.eventManager.addListener(e, this);

        // [事件监听]时间轴开始运行
        var f = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_TIMER_START,
            callback    : this.onTimerStart
        });
        cc.eventManager.addListener(f, this);

        // [事件监听]添加时间提示
        var g = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_ADD_TIMER,
            callback    : this.onCreateAddTimerTips
        });
        cc.eventManager.addListener(g, this);
    },
    loadAddTimerTips : function(){
        var node = new ccui.Text("+"+winSize.TimerAdd+"s", "Arial", 40);
        node.setTextColor(cc.color(0,255,0));
        this.bottomBar.addChild(node);
        node.attr({
            anchorX : 0.5,
            anchorY : 0,
            x : 320,
            y : 40
        });
        this.timerText.time += winSize.TimerAdd*1;
        cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_UPDATE_TIMER_TEXT));
        var elapsed = GameManager.currTimer.getActionManager()._arrayTargets[0].actions[0].getElapsed();
        var newTimer = (this.timerText.time-elapsed).toFixed(3);
        GameManager.currTimer.stopAllActions();
        node.runAction(ActionManager.GP_ADD_TIMER_TIP(function(){
            node.removeFromParent();
            GameManager.currTimer.runAction(ActionManager.GP_RUN_TIMER(newTimer,GameManager.currTimer.width-(209-GameManager.currTimer.x),function(){
                cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_GAME_OVER));
            }));
        }));
        //console.info(GameManager.currTimer.getActionManager()._currentTarget.actions[0]._timesForRepeat+=winSize.TimerAdd);
    },
    onCreateAddTimerTips : function(event){
        var self = event.getCurrentTarget();
        self.loadAddTimerTips();
    },
    onTimerStart : function(event){
        var self = event.getCurrentTarget();
        GameManager.currTimer.runAction(ActionManager.GP_RUN_TIMER(winSize.GameTime,GameManager.currTimer.width,function(){
            cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_GAME_OVER));
        }));
        GameManager.currTimerText.runAction(ActionManager.GP_RUN_TIMER_TEXT(winSize.GameTime,function(){
            cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_UPDATE_TIMER_TEXT));
        }));
    },
    loadTopBar : function(){
        var node = new cc.Sprite("#top_bar.png");
        this.addChild(node);
        this.topBar = node;
        node.attr({
            anchorX:0,
            anchorY:1,
            x:0,
            y:winSize.height
        });
        this.loadHomeButton();
        this.loadTopArticle(GameManager.currArticleTarget);
        this.loadMusicButton();
    },
    loadBottomBar:function(){
        var node = new cc.Sprite("#bottom_bar.png");
        this.bottomBar = node;
        this.addChild(node);
        node.attr({
            anchorX:0,
            anchorY:0,
            x:0,
            y:0
        });
        this.loadScoreText();
        this.loadTimerText();
        this.loadSkillButton();
        this.loadSkillText();
    },
    loadTopArticle : function(articleList){
        this.topArticles = [];
        var node,text;
        var offsetX = (winSize.width-articleList.length*100)/2;
        for(var i=0;i<articleList.length;i++){
            node = new cc.Sprite("#dj_"+articleList[i].target+(articleList[i].brother?"_1":"")+".png");
            text = new ccui.Text("x"+articleList[i].total, "Arial", 28);
            text.setTextColor(cc.color(255,255,255,1));
            node.attr({
                anchorX : 0,
                anchorY : 0,
                x : offsetX+100*i,
                y : 3,
                scale   : 0.41
            });
            text.attr({
                anchorX : 0,
                anchorY : 0,
                x : offsetX+100*i+52,
                y : 14,
                random : articleList[i].target
            });
            this.topArticles.push(node);
            this.topArticles.push(text);
        }
        for(var i=0;i<this.topArticles.length;i++){
            this.topBar.addChild(this.topArticles[i]);
        }
    },
    loadHomeButton : function () {
        var node = new ccui.Button("ui_home.png","ui_home.png","ui_home.png",ccui.Widget.PLIST_TEXTURE);
        node.setPressedActionEnabled(true);
        node.setZoomScale(0.2);
        node.attr({
            anchorX:0,
            anchorY:1,
            x:5,
            y:55.5
        });
        node.addTouchEventListener(function(sender,type){
            if(type == ccui.Widget.TOUCH_ENDED)
            {
                sender.setTouchEnabled(false);
                cc.director.runScene(new MainMenuScene());
            }
        },this);
        this.topBar.addChild(node);
    },
    loadMusicButton : function(){
        var node = new ccui.Button(res.pb_btn_music_2,res.pb_btn_music_2,res.pb_btn_music_1);
        node.setPressedActionEnabled(true);
        node.attr({
            anchorX : 1,
            anchorY : 1,
            x : winSize.width-8,
            y : 51,
            scale:0.85
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
        this.topBar.addChild(node);
    },
    loadScoreText : function(){
        var node = new ccui.Text(GameManager.currScore, "Arial", 32);
        node.setTextColor(cc.color(255,250,1,1));
        this.scoreText = node;
        node.attr({
            anchorX : 0,
            anchorY : 0,
            x : 77,
            y : 14
        });
        this.bottomBar.addChild(node);
    },
    loadTimerText : function(){
        var node = new ccui.Text(winSize.GameTime+"s", "Arial", 28);
        node.setTextColor(cc.color(255,255,255));
        node.attr({
            anchorX : 0,
            anchorY : 0,
            x : 451,
            y : 18,
            time : winSize.GameTime
        });
        this.bottomBar.addChild(node);
        this.timerText = node;
        GameManager.currTimerText = node;
    },
    loadSkillText : function(){
        var node = new ccui.Text(GameManager.currSkill, "Arial", 32);
        node.setTextColor(cc.color(255,255,255));
        this.skillText = node;
        node.attr({
            anchorX : 0,
            anchorY : 0,
            x : 595,
            y : 0
        });
        this.bottomBar.addChild(node);
    },
    loadTimer : function(){
        var node = new cc.Sprite("#ui_timer.png");
        node.attr({
            anchorX:0,
            anchorY:0,
            x:209,
            y:21
        });
        this.addChild(node);
        GameManager.currTimer = node;
    },
    loadSkillButton : function(){
        var node = new ccui.Button("ui_skill.png","ui_skill.png","ui_skill.png",ccui.Widget.PLIST_TEXTURE);
        node.setPressedActionEnabled(true);
        node.attr({
            anchorX : 0,
            anchorY : 0,
            x : 555,
            y : 8
        });
        node.addTouchEventListener(function(sender,type){
            if(type == ccui.Widget.TOUCH_ENDED)
            {
                var event = new cc.EventCustom(jf.EventName.GP_SKILL_USE);
                cc.eventManager.dispatchEvent(event);
            }
        },this);
        this.bottomBar.addChild(node);
    },
    loadForbidTips : function(location){
        var node = new cc.Sprite("#ui_forbid.png");
        this.addChild(node);
        node.attr({
            x : location.x,
            y : location.y
        });
        node.runAction(ActionManager.GP_FORBID_TIP(function(){
            node.removeFromParent();
        }));
    },
    updateTopArticle : function(data){
        for(var i=0;i<this.topArticles.length;i++){
            if(typeof(this.topArticles[i].random)!="undefined" && this.topArticles[i].random==data.target){
                this.topArticles[i].setString("x"+data.total);
                break;
            }
        }
    },
    onCreateForbidTips : function(event){
        var self = event.getCurrentTarget();
        var location = event.getUserData().location;
        self.loadForbidTips(location);
    },
    onUpdateTopArticle : function(event){
        var self = event.getCurrentTarget();
        self.updateTopArticle(event.getUserData());
    },
    onUpdateScoreText:function(event){
        var self = event.getCurrentTarget();
        self.scoreText.setString(GameManager.currScore);
    },
    onUpdateSkillText:function(event){
        var self = event.getCurrentTarget();
        self.skillText.setString(GameManager.currSkill);
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
    }
});

