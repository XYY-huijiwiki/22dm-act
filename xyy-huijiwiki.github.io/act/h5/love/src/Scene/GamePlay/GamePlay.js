var GamePlayScene = cc.Scene.extend({
    scene           : 1, 
    player          : 1,
    backgroundLayer : null, // 背景层
    mainLayer       : null, // UI层
    ctor : function(scene,player){
        this._super();
        this.scene = scene;
        this.player = player;
        console.info("GamePlayScene_run : scene_"+scene+" & player_"+player);
    },
    onEnter : function () {
        this._super();
        this.registerEvent();
        this.loadBackgroundLayer();
        this.loadMainLayer();
    },
    registerEvent : function(){
        
    },
    loadBackgroundLayer : function(){
        var node = new GPBackgroundLayer(this.scene,this.player);
        this.addChild(node);
        this.backgroundLayer = node;
    },
    loadMainLayer : function(){
        this.mainLayer = new GPMainLayer(this.scene,this.player);
        this.addChild(this.mainLayer);
    }
});