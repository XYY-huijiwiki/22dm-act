var GPSignLayer = cc.Layer.extend({
    sky : null,
    ground : null,
    sign : null,
    ercode : null,
    ctor:function(){
        this._super(); 
    },
    onEnter : function () {
        this._super();  
        this.registerEvent();
        this.loadRect();
        this.loadSign();
        this.loadLogo();
    },
    registerEvent : function(){
        // [事件监听]更换签名
        var c = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_UPDATE_SIGN,
            callback    : this.onUpdateSign
        });
        cc.eventManager.addListener(c, this);

        // [事件监听]更换二维码
        var d = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_UPDATE_ERCODE,
            callback    : this.onUpdateErcode
        });
        cc.eventManager.addListener(d, this);
    },
    loadRect : function(){  
        var rect = new cc.DrawNode();
        rect.drawRect(cc.p(0,0), cc.p(winSize.width,winSize.scaleOffsetY), cc.color(255,255,255), 0, cc.color(255,255,255));
        this.addChild(rect);
    },
    loadSign : function(){
        var node = new cc.Sprite("#bb_"+Math.ceil(Math.random()*11+1)+".png");
        node.attr({
            x : winSize.width/2-50,
            y : 60
        });
        this.sign = node;
        this.addChild(node);
    },
    loadErcode : function(){
        var texture2d = new cc.Texture2D(); 
        texture2d.initWithElement(document.getElementsByTagName("canvas")[1]); 
        texture2d.handleLoadedTexture(); 
        var node = new cc.Sprite(texture2d);
        node.attr({
            x : 570,
            y : 65,
            scale : 0.5
        });
        this.ercode = node;
        this.addChild(node);
    },
    loadLogo : function(){
        var node = new cc.Sprite("#bb_0.png");
        node.attr({
            anchorX : 0,
            anchorY : 1,
            x : 5,
            y : 205
        });
        node.setVisible(false);
        GameManager.GP_LOGO = node;
        this.addChild(node);
    },
    onUpdateSign : function(event){
        var self = event.getCurrentTarget();
        self.sign.removeFromParent();
        self.loadSign();
    },
    onUpdateErcode : function(event){
        var self = event.getCurrentTarget();
        if(self.ercode!=null)
            self.ercode.removeFromParent();
        self.loadErcode();
    }
});