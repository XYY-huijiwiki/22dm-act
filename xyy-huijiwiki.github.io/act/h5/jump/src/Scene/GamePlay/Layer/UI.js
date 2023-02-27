var GPUILayer = cc.Layer.extend({
  bottomBar    : null,
  topBar       : null,
  scoreText    : null,
  timerText    : null,
  HP           : [],
  skillText    : [],
  ctor:function(){
    this._super();
  },
  onEnter : function(){
    this._super();
    this.loadButtonPause();
    this.loadScore();
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
  },
  loadButtonPause : function(){
    var node = new ccui.Button("btn_pause.png","btn_pause.png","btn_pause.png",ccui.Widget.PLIST_TEXTURE);
    node.setPressedActionEnabled(true);
    node.attr({
      anchorX : 0,
      anchorY : 0,
      x : 15,
      y : 15
    });
    node.addTouchEventListener(function(sender,type){
      if(type==ccui.Widget.TOUCH_ENDED)
      {
        winSize.playEffect('button');
        v_main.active = 'pause';
      }
    },this);
    this.addChild(node);
  },
  loadScore : function(){
    var node = new cc.Sprite("#score.png");
    var text = new ccui.Text(v_main.Game_score, "Arial", 80);
    node.attr({
      anchorX : 0.5,
      anchorY : 0.5,
      x : winSize.width/2,
      y : winSize.height - node.height/2 - 10
    });
    node.addChild(text);
    text.setTextColor(cc.color(255,255,255,1));
    text.attr({
      anchorX : 0.5,
      anchorY : 0,
      x : node.width/2,
      y : 10
    });
    this.scoreText = text;
    this.addChild(node);
  },
  onUpdateScoreText:function(event){
    var self = event.getCurrentTarget();
    self.scoreText.setString(v_main.Game_score);
  }
});

