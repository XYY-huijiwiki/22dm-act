var GPBackgroundLayer = cc.Layer.extend({
    ctor:function(){
        this._super(); 
    },
    onEnter : function () {
        this._super();  
        this.loadBackgound();
    },
    loadBackgound : function(){   
        var node = new cc.Sprite("#background.jpg");
        node.setPosition(winSize.width/2,winSize.height/2);
        this.addChild(node);      
    }
});