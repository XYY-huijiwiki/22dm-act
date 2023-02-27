var GPUILayer = cc.Layer.extend({
  scoreText    : null,
  HP           : [],
  ctor:function(){
    this._super();
  },
  onEnter : function(){
    this._super();
    this.loadButtonPause();
    this.loadButtonMusic();
    this.loadScore();
    this.loadHp();
    this.loadTree();
    this.loadCheer();
    this.loadStone();
    this.registerEvent();
  },
  registerEvent : function(){
    var a = cc.EventListener.create({
      event       : cc.EventListener.CUSTOM,
      target      : this,
      eventName   : jf.EventName.GP_UPDATE_SCORE_TEXT,
      callback    : this.onUpdateScoreText
    });
    cc.eventManager.addListener(a, this);

    var b = cc.EventListener.create({
      event       : cc.EventListener.CUSTOM,
      target      : this,
      eventName   : jf.EventName.GP_UPDATE_HP,
      callback    : this.onUpdateHP
    });
    cc.eventManager.addListener(b, this);
  },
  loadHp : function(){
    var location = {x:winSize.width/2-300,y:winSize.height-50,offset:45};
    var bg1 = new cc.Sprite(res.gp_hp_bg);
    var bg2 = new cc.Sprite(res.gp_hp_bg);
    var bg3 = new cc.Sprite(res.gp_hp_bg);
    var hp1 = new cc.Sprite(res.gp_hp_inner);
    var hp2 = new cc.Sprite(res.gp_hp_inner);
    var hp3 = new cc.Sprite(res.gp_hp_inner);
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
  loadScore : function(){
    var text = new ccui.Text(GameManager.totalScore, "Arial", 80);
    text.setTextColor(cc.color(255,255,255,1));
    text.attr({
      anchorX : 0.5,
      anchorY : 0.5,
      x : winSize.width/2,
      y : winSize.height-133
    });
    this.scoreText = text;
    this.addChild(text);
  },
  onUpdateScoreText:function(event){
    var self = event.getCurrentTarget();
    self.scoreText.setString(GameManager.totalScore);
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
  loadButtonPause : function(){
    var node = new ccui.Button(res.gp_btn_pause,res.gp_btn_pause,res.gp_btn_pause);
    node.setPressedActionEnabled(true);
    node.attr({
      x : winSize.width/2 + node.width/2 +190,
      y : winSize.height - node.height/2 -8
    });
    this.addChild(node);
    GameManager.button.gp_pause = node;
    GameManager.setButton({name:"gp_pause",x:node.x,y:node.y,w:node.width,h:node.height});
  },
  loadButtonMusic : function(){
    var node = new ccui.Button(res.btn_music_1,res.btn_music_1,res.btn_music_0);
    node.setPressedActionEnabled(true);
    node.attr({
      x : winSize.width/2 + node.width/2 + 290,
      y : winSize.height - node.height/2 - 23
    });
    if(cc.audioEngine.getEffectsVolume()==0){ //静音了
      node.setBright(false);
    }
    this.addChild(node);
    GameManager.button.gp_music = node;
    GameManager.setButton({name:"gp_music",x:node.x,y:node.y,w:node.width,h:node.height});
  },
  loadStone : function(){
    var stone1 = new cc.Sprite(res.gp_stone_1);
    stone1.attr({
      anchorX : 0,
      anchorY : 0,
      x:0,
      y:0,
      scale : winSize.scale
    });
    this.addChild(stone1);
  },
  loadTree : function(){
    var tree1 = new cc.Sprite(res.gp_tree_1);
    var tree2 = new cc.Sprite(res.gp_tree_2);
    tree1.attr({
      anchorX : 0,
      anchorY : 0,
      x:0,
      y:180,
      scale : winSize.scale
    });
    tree2.attr({
      anchorX : 0,
      anchorY : 0,
      x:0,
      y:105,
      scale : winSize.scale
    });
    this.addChild(tree1);
    this.addChild(tree2);
  },
  loadCheer : function(){
    var cheer = new cc.Sprite("#cheer_1.png");
    cheer.attr({
      anchorX : 0,
      anchorY : 0,
      x:0,
      y:50,
      scale : 0.8
    });
    this.addChild(cheer);
    cheer.runAction(ActionManager.GP_CHEER());
  }
});

