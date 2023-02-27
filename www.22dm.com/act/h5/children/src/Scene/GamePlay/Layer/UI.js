var GPUILayer = cc.Layer.extend({
    bottomBar    : null,
    topBar       : null,
    scoreText    : null,
    timerText    : null,
    HP           : [],
    skillText    : [],
    ctor:function(){
        this._super();
    },
    onEnter : function(){
        this._super();
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

        // [事件监听]更新秒数
        var b = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_UPDATE_TIMER_TEXT,
            callback    : this.onUpdateTimerText
        });
        cc.eventManager.addListener(b, this); 

        // [事件监听]更新血量
        var c = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_UPDATE_HP,
            callback    : this.onUpdateHP
        });
        cc.eventManager.addListener(c, this); 

        // [事件监听]开始倒计时
        var d = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_TIMER_START,
            callback    : this.onTimerStart
        });
        cc.eventManager.addListener(d, this);

        // [事件监听]分数效果+1
        var e = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_ADD_SCORE_TIP,
            callback    : this.onAddScoreTip
        });
        cc.eventManager.addListener(e, this);

        // [事件监听]时间效果+1
        var f = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_ADD_TIME_TIP,
            callback    : this.onAddTimeTip
        });
        cc.eventManager.addListener(f, this);

        // [事件监听]生命效果+1
        var g = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_ADD_HP_TIP,
            callback    : this.onAddHPTip
        });
        cc.eventManager.addListener(g, this);
        
        // [事件监听]技能数改变
        var h = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_UPDATE_SKILL_NUM,
            callback    : this.onUpdateSkillText
        });
        cc.eventManager.addListener(h, this);

        // [事件监听]爆炸效果
        var i = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_LOAD_SKILL_BOMB,
            callback    : this.onLoadSkillBomb
        });
        cc.eventManager.addListener(i, this);

        // [事件监听]冰封效果
        var j = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_LOAD_SKILL_ICE,
            callback    : this.onLoadSkillIce
        });
        cc.eventManager.addListener(j, this);

        // [事件监听] 操作禁止提示
        var k = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_SKILL_FORBID,
            callback    : this.onLoadForbid
        });
        cc.eventManager.addListener(k, this);

        // [事件监听] Combo提示
        var l = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_ADD_COMBO_TIP,
            callback    : this.onAddComboTip
        });
        cc.eventManager.addListener(l, this);
    },
    onTimerStart : function(event){
        var self = event.getCurrentTarget();
        self.timerText.runAction(ActionManager.GP_RUN_TIMER_TEXT(winSize.GameTime,function(){
            v_main.Game_time--;
        }));
    },
    loadTopBar : function(){
        this.loadLevelText();
        this.loadScoreText();
    },
    loadBottomBar:function(){
        var node = new cc.Sprite("#bottom.jpg");
        this.bottomBar = node;
        this.addChild(node);
        node.attr({
            anchorX:0,
            anchorY:0,
            x:0,
            y:0
        });
        this.loadTimerText();
        this.loadHP();
        this.loadSkill();
    },
    loadLevelText : function(){
        var node = new ccui.Text(v_main.Game_level, "Arial", 60);
        node.setTextColor(cc.color(254,227,198,1));
        node.attr({
            anchorX : 0.5,
            anchorY : 0,
            x : 103,
            y : winSize.height - 205
        });
        this.addChild(node);
    },
    loadScoreText : function(){
        var node = new ccui.Text(v_main.Game_score, "Arial", 90);
        node.setTextColor(cc.color(255,220,86,1));
        this.scoreText = node;
        node.attr({
            anchorX : 0.5,
            anchorY : 0,
            x : 320,
            y : winSize.height - 200
        });
        this.addChild(node);
    },
    loadHP : function(){
        var hp_0_bg = new cc.Sprite("#hp_bg.png");
        var hp_0_main = new cc.Sprite("#hp_main.png");
        var hp_1_bg = new cc.Sprite("#hp_bg.png");
        var hp_1_main = new cc.Sprite("#hp_main.png");
        var hp_2_bg = new cc.Sprite("#hp_bg.png");
        var hp_2_main = new cc.Sprite("#hp_main.png");
        hp_0_bg.attr({ x : 210,y : 237});
        hp_0_main.attr({ x : 210,y : 237,opacity:v_main.Game_hp>=1?255:0});
        hp_1_bg.attr({ x : 260,y : 237});
        hp_1_main.attr({ x : 260,y : 237,opacity:v_main.Game_hp>=2?255:0});
        hp_2_bg.attr({ x : 310,y : 237});
        hp_2_main.attr({ x : 310,y : 237,opacity:v_main.Game_hp==3?255:0});
        this.bottomBar.addChild(hp_0_bg);
        this.bottomBar.addChild(hp_0_main);
        this.bottomBar.addChild(hp_1_bg);
        this.bottomBar.addChild(hp_1_main);
        this.bottomBar.addChild(hp_2_bg);
        this.bottomBar.addChild(hp_2_main);
        this.HP = [hp_0_main,hp_1_main,hp_2_main];
    },
    loadTimerText : function(){
        var node = new ccui.Text(winSize.GameTime, "Arial", 60);
        node.setTextColor(cc.color(255,255,255,1));
        node.attr({
            anchorX : 0.5,
            anchorY : 0,
            x : 265,
            y : 117
        });
        this.bottomBar.addChild(node);
        this.timerText = node;
    },
    loadSkill : function(){
        var ice = new cc.Sprite("#s_ice.png");
        var bomb = new cc.Sprite("#s_bomb.png");
        var sn_ice = new cc.LabelBMFont(v_main.Game_Ice,res.gp_skill_num);
        var sn_bomb = new cc.LabelBMFont(v_main.Game_Bomb,res.gp_skill_num);
        ice.attr({
            x : 400,
            y : 195  
        });
        bomb.attr({
            x : 455,
            y : 195  
        });
        sn_ice.attr({
            anchorX : 1,
            anchorY : 0,
            x : ice.width,
            y : 3
        });
        sn_bomb.attr({
            anchorX : 1,
            anchorY : 0,
            x : bomb.width,
            y : 3
        });
        
        ice.addChild(sn_ice);
        bomb.addChild(sn_bomb);
        this.bottomBar.addChild(ice);
        this.bottomBar.addChild(bomb);
        this.skillText[0]=sn_ice;
        this.skillText[1]=sn_bomb;
    },
    onLoadSkillBomb : function(event){
        var self = event.getCurrentTarget();
        var bomb = new cc.Sprite();
        bomb.attr({
            x : winSize.width / 2,
            y : winSize.height / 2,
            scale : 1.5
        });
        bomb.runAction(ActionManager.GP_SKILL_BOMB(function(){
            bomb.removeFromParent();
            event.getUserData().callback();
        }));
        self.addChild(bomb);
    },
    onLoadSkillIce : function(event){
        var self = event.getCurrentTarget();
        var ice = new cc.Sprite(res.gp_ice_mask);
        ice.attr({
            x : winSize.width / 2,
            y : winSize.height / 2,
            opacity : 0
        });
        ice.runAction(ActionManager.GP_SKILL_ICE(function(){
            ice.removeFromParent();
            event.getUserData().callback();
        }));
        self.addChild(ice);
    },
    onLoadForbid : function(event){
        var self = event.getCurrentTarget();
        var location = event.getUserData();
        var forbid = new cc.Sprite("#s_forbid.png");
        forbid.attr({
            x : location.x,
            y : location.y
        });
        forbid.runAction(ActionManager.GP_SKILL_FORBID(function(){
            forbid.removeFromParent();
        }));
        self.addChild(forbid);
    },
    onUpdateSkillText : function(event){
        var self = event.getCurrentTarget();
        self.skillText[event.getUserData().type].setString(event.getUserData().num);
    },
    onUpdateHP : function(event){
        var self = event.getCurrentTarget();
        var isAdd = event.getUserData().isAdd;
        if(isAdd)
            self.HP[v_main.Game_hp==3?2:v_main.Game_hp-1].runAction(ActionManager.GP_HP_RUN(isAdd));
        else
            self.HP[v_main.Game_hp].runAction(ActionManager.GP_HP_RUN(isAdd));
    },
    onUpdateScoreText:function(event){
        var self = event.getCurrentTarget();
        self.scoreText.setString(v_main.Game_score);
    },
    onUpdateTimerText : function(event){
        var self = event.getCurrentTarget();
        if(v_main.Game_time>=0){
            self.timerText.setString((v_main.Game_time<10?'0':'')+v_main.Game_time);
            if(v_main.Game_time<=5){
                self.timerText.setColor(cc.color(255,232,0,1));
                winSize.playEffect('timer_danger');
            }
        }
    },
    onAddScoreTip : function(event){
        var self = event.getCurrentTarget(); 
        var location = event.getUserData().location;
        var node = new ccui.Text("+"+event.getUserData().score, "Arial", 50);
        node.setTextColor(find?cc.color(0,255,0):cc.color(255,0,0));
        self.addChild(node);
        node.attr({
            x : location.x,
            y : location.y
        });
        node.runAction(ActionManager.GP_SCORE_TIP(function(){
            node.removeFromParent();
        }));
    },
    onAddComboTip : function(event){
        var self = event.getCurrentTarget(); 
        var node = new ccui.Text("Combo x "+GameManager.isCombo, "Arial", 50);
        node.setTextColor(cc.color(255,0,0));
        self.addChild(node);
        node.attr({
            x : winSize.width/2,
            y : 870
        });
        node.runAction(ActionManager.GP_COMBO_TIP(function(){
            node.removeFromParent();
        }));
    },
    onAddTimeTip : function(event){
        var self = event.getCurrentTarget();
        var data = event.getUserData();
        var node = new cc.Sprite("#add_time.png");
        node.attr({
            x : data.x,
            y : data.y
        });
        self.addChild(node);
        node.runAction(ActionManager.GP_ADD_TIP(function(){
            node.removeFromParent();
        }));
    },
    onAddHPTip : function(event){
        var self = event.getCurrentTarget();
        var data = event.getUserData();
        var node = new cc.Sprite("#add_hp.png");
        node.attr({
            x : data.x,
            y : data.y
        });
        self.addChild(node);
        node.runAction(ActionManager.GP_ADD_TIP(function(){
            node.removeFromParent();
        }));
    }
});

