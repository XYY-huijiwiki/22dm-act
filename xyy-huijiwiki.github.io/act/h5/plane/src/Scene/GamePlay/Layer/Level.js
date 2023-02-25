var GPLevelLayer = ccui.Layout.extend({
    gameOver : false,
    level    : 1,
    str      : '',
    cb       : null,
    ctor:function(gameOver,level,cb){
        this._super();
        this.gameOver = gameOver;
        this.level = level;
        this.cb = cb;
    },
    onEnter : function(){
        this._super();
        this.loadConfig();
        this.loadLayer();
    },
    loadConfig : function(){
        this.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        this.setContentSize(winSize);
        this.setBackGroundColorOpacity(100);
        this.setBackGroundColor(cc.color(0, 0, 0));
        if(this.gameOver)
            this.str = '游戏结束';
        else
            this.str = '第  '+this.level+'  关';
    },
    loadLayer:function(){
        var node = new ccui.Text(this.str, "Arial", 48);
        node.setTextColor(cc.color(255,233,0,1));
        node.setAnchorPoint(0.5, 0.5);
        node.setPosition(winSize.width/2,winSize.height);   
        this.addChild(node);
        var moveTo = cc.moveTo(1,cc.p(winSize.width/2,winSize.height/2));
        var delay = cc.delayTime(2);
        var callback = cc.callFunc(function(){
            var eventRemove = new cc.EventCustom(jf.EventName.GP_REMOVE_LEVEL_LAYER);
            eventRemove.setUserData({
                cb:this.cb
            });
            cc.eventManager.dispatchEvent(eventRemove);
        }.bind(this));
        node.runAction(cc.sequence(moveTo,delay,callback));
    }
});