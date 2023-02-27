var GPUILayer = cc.Layer.extend({
  scoreText    : null,
  wolfCoutText : null,
  HP           : [],
  ctor:function(){
    this._super();
  },
  onEnter : function(){
    this._super();
    this.registerEvent();
    this.loadGu();
    this.loadButtonPause();
    this.loadButtonMusic();
    this.loadButtonTips();
    this.loadHp();
    this.loadWolfCount();
  },
  registerEvent : function(){
    var a = cc.EventListener.create({
      event       : cc.EventListener.CUSTOM,
      target      : this,
      eventName   : jf.EventName.GP_UPDATE_HP,
      callback    : this.onUpdateHP
    });
    cc.eventManager.addListener(a, this);

    var b = cc.EventListener.create({
      event       : cc.EventListener.CUSTOM,
      target      : this,
      eventName   : jf.EventName.GP_UPDATE_WOLFCOUNT_TEXT,
      callback    : this.onUpdateWolfCount
    });
    cc.eventManager.addListener(b, this);
  },
  loadWolfCount : function(){
    var text_1 = new ccui.Text("剩余进攻者:", "Arial", 24);
    var count = new ccui.Text("", "Arial", 24);
    var color = cc.color(13,82,38,1);
    text_1.setTextColor(color);
    count.setTextColor(color);
    text_1.attr({
      anchorX : 1,
      x : winSize.width/2+text_1.width/2,
      y : text_1.height/2+2
    })
    count.attr({
      anchorX : 0,
      x : text_1.width+3,
      y : count.height/2-1
    })
    text_1.addChild(count);
    this.addChild(text_1);
    this.wolfCoutText = count;
  },
  onUpdateWolfCount:function(event){
    var self = event.getCurrentTarget();
    self.wolfCoutText.setString(GameManager.currentWolfPool.length);
  },
  loadHp : function(){
    var location = {x:winSize.width/2-300,y:winSize.height-50,offset:45};
    var bg1 = new cc.Sprite("#hp_bg.png");
    var bg2 = new cc.Sprite("#hp_bg.png");
    var bg3 = new cc.Sprite("#hp_bg.png");
    var hp1 = new cc.Sprite("#hp_inner.png");
    var hp2 = new cc.Sprite("#hp_inner.png");
    var hp3 = new cc.Sprite("#hp_inner.png");
    bg1.attr({x : location.x,y : location.y});
    hp1.attr({x : location.x,y : location.y});
    bg2.attr({x : location.x + location.offset*1,y : location.y});
    hp2.attr({x : location.x + location.offset*1,y : location.y});
    bg3.attr({x : location.x + location.offset*2,y : location.y});
    hp3.attr({x : location.x + location.offset*2,y : location.y});
    this.HP = [hp1,hp2,hp3];
    this.addChild(bg1);this.addChild(bg2);this.addChild(bg3);
    this.addChild(hp1);this.addChild(hp2);this.addChild(hp3);
  },
  onUpdateHP:function(event){
    var self = event.getCurrentTarget();
    var hp = self.HP[GameManager.currentHp] || false;
    if(hp){
      hp.runAction(ActionManager.GP_HP_OUT(function(){
        console.log("onUpdateHP: "+GameManager.currentHp);
      }));
    }
  },
  loadGu : function(){
    var gu = new cc.Sprite("#gu.png");
    gu.attr({
      anchorX : 0,
      anchorY : 0,
      x: 0,
      y: 100
    });
    this.addChild(gu);
  },
  loadButtonPause : function(){
    var node = new cc.Sprite("#btn_pause.png","#btn_pause.png","#btn_pause.png",ccui.Widget.PLIST_TEXTURE);
    node.attr({
      x : winSize.width/2 + node.width/2 + 290,
      y : winSize.height - node.height/2 -8
    });
    this.addChild(node);
    GameManager.button.gp_pause = node;
    GameManager.setButton({name:"gp_pause",x:node.x,y:node.y,w:node.width,h:node.height});
  },
  loadButtonTips : function(){
    var node = new cc.Sprite("#btn_tips.png","#btn_tips.png","#btn_tips.png",ccui.Widget.PLIST_TEXTURE);
    node.attr({
      x : winSize.width/2 + node.width/2 + 190,
      y : winSize.height - node.height/2 -8
    });
    this.addChild(node);
    GameManager.button.gp_pause = node;
    GameManager.setButton({name:"gp_tips",x:node.x,y:node.y,w:node.width,h:node.height});
  },
  loadButtonMusic : function(){
    var node = new ccui.Button(res.btn_music_1,res.btn_music_1,res.btn_music_0);
    node.setPressedActionEnabled(true);
    node.attr({
      x : winSize.width/2 + node.width/2 + 390,
      y : winSize.height - node.height/2 - 23
    });
    if(cc.audioEngine.getEffectsVolume()==0){ //静音了
      node.setBright(false);
    }
    this.addChild(node);
    GameManager.button.gp_music = node;
    GameManager.setButton({name:"gp_music",x:node.x,y:node.y,w:node.width,h:node.height});
  }
});

