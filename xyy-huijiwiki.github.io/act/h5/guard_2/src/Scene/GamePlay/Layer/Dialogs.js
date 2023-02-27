var GPDialogsLayer = ccui.Layout.extend({
  data      : null,
  ctor:function(data){
      this._super();
      this.data = data;
  },
  onEnter : function(){
    this._super();
    this.loadConfig();
    if(v_main.Game_over==true){
      this.loadText();
    }
    this.loadLayer();
  },
  loadConfig : function(){
    this.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
    this.setContentSize(winSize.width,winSize.height);
    this.setBackGroundColorOpacity(v_main.Game_over?230:0);
    this.setBackGroundColor(cc.color(0, 0, 0));
    this.attr({
      anchorX : 0.5,
      anchorY : 0.5,
      x : winSize.width>>1,
      y : winSize.height>>1,
      opacity:0
    });
  },
  loadLayer:function(){
    var fadeIn = cc.fadeIn(1,255);
    var delay = cc.delayTime(GameManager.delayTime.GP.dialogs);
    var cb = cc.callFunc(function(){
      this.data.callback() || null;
      cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_REMOVE_DIALOGS_LAYER));
    }.bind(this));
    this.runAction(cc.sequence(fadeIn,delay,cb));
  },
  loadText : function(){
    var level = new ccui.Text("游戏结束", "Arial", 52);
    level.setTextColor(cc.color(255,239,0,1));
    level.attr({
      x : winSize.width/2,
      y : winSize.height/2
    });
    this.addChild(level);
  }
});