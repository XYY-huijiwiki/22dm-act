var GPUILayer = cc.Layer.extend({
  timer        : null,
  scoreText    : null,
  timerText    : null,
  skillText    : null,
  ctor:function(){
    this._super();
  },
  onEnter : function(){
    this._super();
    this.loadButtonPause();
    this.loadScore();
    this.loadTimer();
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
      eventName   : jf.EventName.GP_UPDATE_TIMER_TEXT,
      callback    : this.onUpdateTimerText
    });
    cc.eventManager.addListener(b, this);
  },
  loadButtonPause : function(){
    var node = new ccui.Button("btn_pause.png","btn_pause.png","btn_pause.png",ccui.Widget.PLIST_TEXTURE);
    node.setPressedActionEnabled(true);
    node.attr({
      anchorX : 0,
      anchorY : 0,
      x : 40,
      y : 40
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
    text.setTextColor(cc.color(255,240,4,1));
    text.attr({
      anchorX : 0.5,
      anchorY : 0,
      x : node.width/2,
      y : 14
    });
    this.scoreText = text;
    this.addChild(node);
  },
  loadTimer : function(){
    var node = new cc.Sprite("#timer.png");
    var text = new ccui.Text("变身:8s", "Microsoft YaHei", 28);
    node.attr({
      anchorX : 1,
      anchorY : 0,
      x : winSize.width - 30,
      y : 52,
      visible : false
    });
    node.addChild(text);
    text.setTextColor(cc.color(255,240,4,1));
    text.attr({
      anchorX : 0.5,
      anchorY : 0,
      x : node.width/2,
      y : 20
    });
    this.timer = node;
    this.timerText = text;
    this.addChild(node);
  },
  onUpdateScoreText:function(event){
    var self = event.getCurrentTarget();
    self.scoreText.setString(v_main.Game_score);
  },
  onUpdateTimerText:function(event){
    var self = event.getCurrentTarget();
    self.timer.stopAllActions();
    if(v_main.Game_timer!=0){
      self.timer.visible = true;
      self.timerText.setString("变身:"+v_main.Game_timer+"s");
      self.timer.runAction(ActionManager.GP_ROLE_TIMER(function(){
        v_main.Game_timer--;
      }));
    }
    else{
      cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_ROLE_NORMAL));
      self.timer.visible = false;
    }
  }
});

