var GPBackgroundLayer = cc.Layer.extend({
	scene       : 1,
    player      : 1,
    background  : null,
    ctor:function(scene,player){
        this._super(); 
        this.scene = scene;
        this.player = player;
    },
    onEnter : function (scene,player) {
        this._super();     
        this.loadBackgound();
    },
    loadBackgound : function(){
        var node;
        if(this.scene == 1)
            node = new cc.Sprite(this.player == 1 ? res_female.player_one.gp_female_bg_1 : res_female.player_two.gp_female_bg_2);
        else
            node = new cc.Sprite(this.player == 1 ? res_male.player_one.gp_male_bg_1 : res_male.player_two.gp_male_bg_2);
        this.background = node;
        this.addChild(node);
        if(this.scene==2&&this.player==1){
            node.setAnchorPoint(1,0);
            node.setPosition(640,0);
        }
        else
            node.setPosition(winSize.width / 2, winSize.height / 2);
    }
});