var GPDialogsLayer = ccui.Layout.extend({
    text      : '',
    cb        : null,
    ctor:function(text,cb){
        this._super();
        this.text = text;
        this.cb = cb;
    },
    onEnter : function(){
        this._super();
        this.loadConfig();
        this.loadLayer();
        if(this.text.indexOf("关卡") >= 0) //第几关
            this.loadTips();
    },
    loadConfig : function(){
        this.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        this.setContentSize(640,1008);
        this.setBackGroundColorOpacity(150);
        this.setBackGroundColor(cc.color(0, 0, 0));
    },
    loadLayer:function(){
        var node = new ccui.Text(this.text, "Microsoft YaHei", 52);
        node.setTextColor(cc.color(0,228,255,1));
        node.setAnchorPoint(0.5, 0.5);
        node.setPosition(winSize.width/2,winSize.height);   
        this.addChild(node);
        var moveTo = cc.moveTo(1,cc.p(winSize.width/2,winSize.height/2+30));
        var delay = cc.delayTime(2.5);
        var callback = cc.callFunc(function(){
            this.cb();
            var event = new cc.EventCustom(jf.EventName.GP_REMOVE_DIALOGS_LAYER);
            cc.eventManager.dispatchEvent(event);
        }.bind(this));
        node.runAction(cc.sequence(moveTo,delay,callback));
    },
    loadTips : function(){
        var tips = new cc.Sprite(winSize.isMoonDay ? "#tip_5.png" : "#tip_1.png");
        tips.attr({
            x : winSize.width/2,
            y : winSize.height /2 - 100,
            opacity : 0
        })
        tips.runAction(cc.fadeIn(1));
        this.addChild(tips);
    }
});