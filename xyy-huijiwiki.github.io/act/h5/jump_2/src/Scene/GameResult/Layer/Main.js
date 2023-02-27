var GSMainLayer = cc.Layer.extend({
    theme    : 0,
    ctor:function(theme){
        this._super();
        this.theme = theme;
    },
    onEnter : function () {
        this._super();
        this.loadRole();
        this.loadTitle();
        this.loadButton();
    },
    loadRole : function(){
        if(this.theme*1==0||this.theme*1==1){
            var light = new cc.Sprite(res["gs_light_"+this.theme]);
            light.attr({
                anchorX : 0,
                anchorY : 1,
                x : 0,
                y : winSize.height - winSize.topOffset/2 + 10
            });
            this.addChild(light);
        }
        var node = new cc.Sprite("#theme_"+this.theme+"_1.png");
        node.attr({
            anchorX : 0,
            anchorY : 1,
            x : 0,
            y : winSize.height - winSize.topOffset/2,
            visible : false
        });
        this.addChild(node);
        setTimeout(function(){
            node.visible = true;
            node.runAction(ActionManager.GS_THEME(this.theme));
        }.bind(this),1000)
    },
    loadTitle : function(){
        var node = new cc.Sprite("#title_bg.png");
        node.attr({
            anchorX : 0.5,
            anchorY : 1,
            x : winSize.width/2,
            y : winSize.height + node.height,
            deltaY : winSize.height - winSize.topOffset / 2 - 60
        });
        var title = new cc.Sprite("#gs_"+this.theme+".png");
        node.addChild(title);
        title.attr({
            anchorX : 0.5,
            anchorY : 0.5,
            x : node.width/2,
            y : node.height/2 - 27
        });
        this.addChild(node);
        node.runAction(ActionManager.GS_TITLE_RUN(node.x,node.deltaY));
    },
    loadButton : function(){
        var play = new ccui.Button(res.gs_play_1,res.gs_play_2,res.gs_play_2);
        var share = new ccui.Button(res.gs_share_1,res.gs_share_2,res.gs_share_2);
        play.setPressedActionEnabled(true);
        share.setPressedActionEnabled(true);
        play.attr({
            anchorX : 0,
            anchorY : 0,
            x : winSize.width/2 - share.width/2 - 100,
            y : 30 - winSize.topOffset <0 ?  winSize.topOffset / 2 : 0,
            opacity : 0
        });
        share.attr({
            anchorX : 0,
            anchorY : 0,
            x : winSize.width/2 - share.width/2 + 100,
            y : 30 - winSize.topOffset <0 ?  winSize.topOffset / 2 : 0 ,
            opacity : 0
        });
        share.addTouchEventListener(function(sender,type){
            if(type==ccui.Widget.TOUCH_ENDED)
            {
                winSize.playEffect('button');
                v_main.active = 'share';
            }
        },this);
        play.addTouchEventListener(function(sender,type){
          if(type==ccui.Widget.TOUCH_ENDED)
          {
            winSize.playEffect('button');
            v_main.Game_resert();
          }
        },this);
        this.addChild(share);
        this.addChild(play);
        share.runAction(ActionManager.GS_BUTTON_FADE());
        play.runAction(ActionManager.GS_BUTTON_FADE());
    }
});