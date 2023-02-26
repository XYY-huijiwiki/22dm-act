var GameResultScene = cc.Scene.extend({
    data            : null,
    backgroundLayer : null, // 背景层
    mainLayer       : null, 
    ctor:function(data){
        this._super();
        this.data = data;
    },
    onEnter : function () {
        this._super();
        this.loadBackgroundLayer();
        this.loadMainLayer();
        this.registerEvent(); 
    },
    registerEvent : function(){

    },
    loadBackgroundLayer : function(){
        this.backgroundLayer = new GSBackgroundLayer(this.data.theme);
        this.addChild(this.backgroundLayer);
    },
    loadMainLayer : function(){
        this.mainLayer = new GSMainLayer(this.data);
        this.addChild(this.mainLayer);
    }
});