var GPDialogsLayer = ccui.Layout.extend({
    text      : '',
    tips      : '',
    cb        : null,
    ctor:function(text,tips,cb){
        this._super();
        this.text = text;
        this.tips = tips;
        this.cb = cb;
    },
    onEnter : function(){
        this._super();
        this.loadConfig();
        this.loadLayer();
        if(this.text.indexOf('游戏结束')!=-1){
            winSize.playEffect('game_over');
        }
        else{
            this.loadTips();
            if(v_main.Game_level>1)
                winSize.playEffect('next_level');
        }
    },
    loadConfig : function(){
        this.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        this.setContentSize(winSize.width,winSize.height);
        this.setBackGroundColorOpacity(220);
        this.setBackGroundColor(cc.color(0, 0, 0));
        this.y = -this.parent.y;
    },
    loadLayer:function(){
        var node = new ccui.Text(this.text, "Arial", 52);
        node.setTextColor(cc.color(11,255,80,1));
        node.setAnchorPoint(0.5, 0.5);
        node.setPosition(winSize.width/2,winSize.height/2+100); 
        node.opacity = 0;  
        this.addChild(node);
        var moveTo;
        moveTo = cc.fadeIn(1);
        var delay = cc.delayTime(2);
        var callback = cc.callFunc(function(){
            this.cb();
            cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_REMOVE_DIALOGS_LAYER));
        }.bind(this));
        node.runAction(cc.sequence(moveTo,delay,callback));
    },
    loadTips : function(){
        var tips = new ccui.Text(this.tips, "Arial", 40);
        tips.setTextColor(cc.color(255,255,80,1));
        tips.setAnchorPoint(0.5, 0.5);
        tips.setPosition(winSize.width/2,winSize.height/2); 
        
        var skilltips = new ccui.Text("提示：击中以下道具可获得特殊技能！", "Arial", 28);
        skilltips.setTextColor(cc.color(255,255,80,1));
        skilltips.attr({
            anchorX : 0.5,
            anchorY : 0.5,
            x : winSize.width/2,
            y : winSize.height/2 - tips.height -20
        });
        
        var ice = new cc.Sprite("#role_ice.png");
        var bomb = new cc.Sprite("#role_bomb.png");
        ice.attr({
            x : winSize.width/2 - 70,
            y : skilltips.y - 80
        });
        bomb.attr({
            x : winSize.width/2 + 70,
            y : skilltips.y - 80
        });
        this.addChild(tips);
        this.addChild(skilltips);
        this.addChild(ice);
        this.addChild(bomb);
    }
});