var GPBackgroundLayer = cc.Layer.extend({
    sky : null,
    ground : null,
    sign : null,
    ercode : null,
    ctor:function(){
        this._super(); 
    },
    onEnter : function () {
        this._super();  
        this.loadSky();
        this.loadGround();
        this.registerEvent();
    },
    registerEvent : function(){
         // [事件监听]更换天空
         var a = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_UPDATE_SKY,
            callback    : this.onUpdateSky
        });
        cc.eventManager.addListener(a, this);

        // [事件监听]更换地面
        var b = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_UPDATE_GROUND,
            callback    : this.onUpdateGround
        });
        cc.eventManager.addListener(b, this);
    },
    loadSky : function(){   
        var node = new cc.Sprite(res['gp_sky_'+v_main.decorate.sky]);
        node.setPosition(winSize.width/2,winSize.height/2+winSize.scaleOffsetY/2);
        this.sky = node;
        this.addChild(node,10);      
    },
    loadGround : function(){
        var node = new cc.Sprite(res['gp_ground_'+v_main.decorate.ground]);
        node.attr({
            anchorX : 0,
            anchorY : 0,
            x : 0,
            y : 0+winSize.scaleOffsetY
        });
        this.ground = node;
        this.addChild(node,20);  
    },
    onUpdateSky : function(event){
        var self = event.getCurrentTarget();
        self.sky.removeFromParent();
        self.loadSky();
    },
    onUpdateGround : function(event){
        var self = event.getCurrentTarget();
        self.ground.removeFromParent();
        if(v_main.decorate.ground!=-1)
            self.loadGround();
    }
});