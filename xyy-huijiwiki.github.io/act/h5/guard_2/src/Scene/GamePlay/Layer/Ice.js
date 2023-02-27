var GPIceLayer = cc.Layer.extend({
  timer      : null,
  timerText  : null,
  ctor:function(){
    this._super();
    GameManager.setWolfIce(true);
  },
  onEnter : function(){
    this._super();
    this.registerEvent();
    this.loadLayer();
    this.loadTimer();
  },
  onExit : function(){
    this.timer.stopAllActions();
    GameManager.setWolfIce(false);
  },
  registerEvent : function(){
    // [事件监听] 更新技能爆炸数量a
    var a = cc.EventListener.create({
      event       : cc.EventListener.CUSTOM,
      target      : this,
      eventName   : jf.EventName.GP_UPDATE_ICE_TIMER,
      callback    : this.onUpdateTimer
    });
    cc.eventManager.addListener(a, this);
  },
  loadLayer:function(){
    var node = new cc.Sprite(res.gp_ice);
    node.attr({
      x:winSize.width>>1,
      y:winSize.height>>1,
      opacity : 0
    });
    this.addChild(node);
    node.runAction(ActionManager.GP_ICE_FADE());
  },
  loadTimer : function(){
    this.timerText = GameManager.icetime;
    var timer = new ccui.Text("冰冻剩余时间:"+this.timerText+"s", "Arial", 28);
    timer.setTextColor(cc.color(44,122,220,1));
    timer.attr({
      anchorX : 1,
      anchorY : 0,
      x : winSize.width - 8,
      y : 0
    });
    this.addChild(timer);
    this.timer = timer;
    timer.runAction(ActionManager.GP_ICE_TIMER(function(){
      cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_UPDATE_ICE_TIMER));
    }));
  },
  onUpdateTimer : function(event){
    var self = event.getCurrentTarget();
    self.timerText--;
    self.timer.setString("冰冻剩余时间:"+self.timerText+"s");
    if(self.timerText<=0){
      self.timer.stopAllActions();
      cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_REMOVE_ICE_LAYER));
    }
  }
});