var GSMainLayer = cc.Layer.extend({
    theme    : 0,
    ctor:function(theme){
        this._super();
        this.theme = theme;
    },
    onEnter : function () {
        this._super();
        this.loadTitle();
        this.loadButton();
        this.loadStar();
    },
    loadStar : function(){
      var title = new cc.Sprite();
      for(var i=0;i<this.theme;i++){
        var star = new cc.Sprite("#gs_star.png");
        star.attr({
          anchorX : 0,
          anchorY : 1,
          x:winSize.width/2+180+i*115,
          y:winSize.height+star.height
        });
        title.addChild(star);
        star.runAction(ActionManager.GS_STAR_ADD(i,function(){
          
        }));
      }
      this.addChild(title);
    },
    loadTitle : function(){
        var title = new cc.Sprite("#gs_title_"+this.theme+".png");
        var star = new cc.Sprite("#gs_star_"+this.theme+".png");
        var role = new cc.Sprite("#theme_"+this.theme+"_1.png");
        var starX = [0,0,-35,-20];
        var starY = [0,-60,-103,-130];
        var roleX = [0,30,40,-50];
        var roleY = [0,-140,-155,-120];
        title.attr({
            anchorX : 0.5,
            anchorY : 0,
            x : winSize.width/2-30,
            y : 10
        });
        star.attr({
            anchorX : 0.5,
            anchorY : 0,
            x : title.width/2+starX[this.theme],
            y : title.height+starY[this.theme]
        });
        role.attr({
            anchorX : 0.5,
            anchorY : 0,
            x : title.width/2+roleX[this.theme],
            y : title.height+roleY[this.theme]
        });
        title.addChild(star,-1);
        title.addChild(role,-1);
        if(this.theme==2 || this.theme==3){
            var fly = new cc.Sprite("#gs_fly_"+this.theme+".png");
            var fly2 = new cc.Sprite("#gs_fly_"+this.theme+".png");
            var flyY = [0,0,50,100];
            fly.attr({
                x : -fly.width/2+10,
                y : title.height/2 + flyY[this.theme]
            });
            fly2.attr({
                x : title.width+fly.width/2,
                y : title.height/2 + flyY[this.theme],
                flippedX : 1
            });
            title.addChild(fly,-1);
            title.addChild(fly2,-1);
        }
        this.addChild(title);
        // if(this.theme!=1)
        //   role.runAction(ActionManager.GS_THEME(this.theme));
    },
    loadButton : function(){
        var home = new ccui.Button("gs_btn_back.png","gs_btn_back.png","gs_btn_back.png",ccui.Widget.PLIST_TEXTURE);
        var share = new ccui.Button("gs_btn_share.png","gs_btn_share.png","gs_btn_share.png",ccui.Widget.PLIST_TEXTURE);
        var record = new ccui.Button("gs_btn_record.png","gs_btn_record.png","gs_btn_record.png",ccui.Widget.PLIST_TEXTURE);
        home.setPressedActionEnabled(true);
        share.setPressedActionEnabled(true);
        record.setPressedActionEnabled(true);
        home.attr({
            x : home.width/2 + 50,
            y : winSize.height - home.height/2 -50,
            opacity : 0
        });
        share.attr({
            x : winSize.width/2+160,
            y : 50,
            opacity : 0
        });
        record.attr({
            x : winSize.width/2-200,
            y : 50,
            opacity : 0
        });
        this.addChild(home);
        this.addChild(share);
        this.addChild(record);
        home.runAction(ActionManager.GS_BUTTON_FADE());
        share.runAction(ActionManager.GS_BUTTON_FADE());
        record.runAction(ActionManager.GS_BUTTON_FADE());
        GameManager.button.mm_home = home;
        GameManager.button.mm_share = share;
        GameManager.button.mm_record = record;
        GameManager.setButton({name:"gs_home",x:home.x,y:home.y,w:home.width,h:home.height});
        GameManager.setButton({name:"gs_share",x:share.x,y:share.y,w:share.width,h:share.height});
        GameManager.setButton({name:"gs_record",x:record.x,y:record.y,w:record.width,h:record.height});
    }
});