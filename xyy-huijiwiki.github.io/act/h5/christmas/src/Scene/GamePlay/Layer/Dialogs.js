var GPDialogsLayer = ccui.Layout.extend({
    text      : '',
    cb        : null,
    topArticles : [],
    ctor:function(text,cb){
        this._super();
        this.text = text;
        this.cb = cb;
    },
    onEnter : function(){
        this._super();
        this.loadConfig();
        this.loadLayer();
        if(this.text.indexOf("关卡")>=0) //第几关
        {
            this.loadTips();
            cc.audioEngine.playEffect(res.audio_success,false);
        }
    },
    loadConfig : function(){
        this.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        this.setContentSize(640,1008);
        this.setBackGroundColorOpacity(200);
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
            var event = new cc.EventCustom(jf.EventName.GP_REMOVE_DIALOGS_LAYER);
            cc.eventManager.dispatchEvent(event);
        }.bind(this));
        node.runAction(cc.sequence(moveTo,delay,callback));
    },
    loadTips : function(){
       this.topArticles = [];
       var offsetX = [120,330,120,330];
       var offsetY = [400,400,250,250];
       for(var i=0;i<GameManager.currArticleTarget.length;i++){
            node = new cc.Sprite("#dj_"+GameManager.currArticleTarget[i].target+(GameManager.currArticleTarget[i].brother?"_1":"")+".png");
            text = new ccui.Text("x"+GameManager.currArticleTarget[i].total, "Arial", 40);
            text.setTextColor(cc.color(255,239,0,1));
            node.attr({
                anchorX : 0,
                anchorY : 0,
                x : ((i==2&&GameManager.currArticleTarget.length==3)?225:offsetX[i]),
                y : offsetY[i]+30
            });
            text.attr({
                anchorX : 0,
                anchorY : 0,
                x : ((i==2&&GameManager.currArticleTarget.length==3)?225:offsetX[i])+140,
                y : offsetY[i]+65
            });
            this.topArticles.push(node);
            this.topArticles.push(text);
        }
        for(var i=0;i<this.topArticles.length;i++){
            this.addChild(this.topArticles[i]);
        }
    }
});