var MMUILayer = cc.Layer.extend({
  Role        :  null,
  ctor : function () {
    this._super();
  },
  onEnter : function () {
    this._super();
    this.loadButtonLayer();
  },
  loadButtonLayer : function(){
    this.registerEvent();
    this.loadTitle(); 
    this.loadButton();
    this.loadButtonMusic();
    cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.MM_XI_IN));
    cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.MM_MEI_IN));
    cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.MM_WOLF_IN));
  },
  registerEvent : function(){
    var a = cc.EventListener.create({
      event       : cc.EventListener.CUSTOM,
      target      : this,
      eventName   : jf.EventName.MM_XI_IN,
      callback    : this.onloadXi
    });
    cc.eventManager.addListener(a, this);

    var b = cc.EventListener.create({
      event       : cc.EventListener.CUSTOM,
      target      : this,
      eventName   : jf.EventName.MM_MEI_IN,
      callback    : this.onloadMei
    });
    cc.eventManager.addListener(b, this);

    var c = cc.EventListener.create({
      event       : cc.EventListener.CUSTOM,
      target      : this,
      eventName   : jf.EventName.MM_WOLF_IN,
      callback    : this.onloadWolf
    });
    cc.eventManager.addListener(c, this);
  },
  loadTitle : function(){
    var node = new cc.Sprite(res.mm_title_1);
    var node2 = new cc.Sprite(res.mm_title_2);
    node.attr({
      anchorX : 0.5,
      anchorY : 1,
      x : winSize.width >> 1,
      y : winSize.height + node.height
    });
    node2.attr({
      anchorX : 0.5,
      anchorY : 0.5,
      x : node.width-node2.width/2,
      y : -10,
      opacity : 0
    });
    node.addChild(node2);
    this.addChild(node,10);
    node.runAction(ActionManager.MM_TITLE_IN(0.5,0,-node.height-45,function(){
      // cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.MM_XI_IN));
      // cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.MM_MEI_IN));
    }));
    node2.runAction(ActionManager.MM_TITLE2_IN(0.8));
  },
  onloadXi : function(event){
    var self = event.getCurrentTarget();
    var xi = new cc.Sprite(res.mm_role_1);
    xi.attr({
      x : winSize.width/2+320,
      y:winSize.height/2+45
    });
    self.addChild(xi,5);
    xi.runAction(ActionManager.MM_XI_IN(1,1));
  },
  onloadMei : function(event){
    var self = event.getCurrentTarget();
    var mei = new cc.Sprite(res.mm_role_2);
    mei.attr({
      x : winSize.width/2-130,
      y : winSize.height/2-10
    });
    self.addChild(mei,5);
    mei.runAction(ActionManager.MM_TITLE_MEI());
  },
  onloadWolf : function(event){
    var self = event.getCurrentTarget();
    var wolf = new cc.Sprite(res.mm_role_3);
    wolf.setPosition(winSize.width>>1, winSize.height>>1);
    self.addChild(wolf,20);
  },
  loadButton : function(){
    var start = new ccui.Button(res.mm_start,res.mm_start,res.mm_start);
    var record = new ccui.Button(res.mm_record,res.mm_record,res.mm_record);
    var rule = new ccui.Button(res.mm_rule,res.mm_rule,res.mm_rule);
    start.setPressedActionEnabled(true);
    record.setPressedActionEnabled(true);
    rule.setPressedActionEnabled(true);
    start.attr({
      x : winSize.width/2,
      y : start.height/2+25,
      opacity : 0
    });
    record.attr({
      x : winSize.width+110,
      y : start.height/2+20
    });
    rule.attr({
      x : -110,
      y : start.height/2+20
    });
    this.addChild(start,50);
    this.addChild(record,50);
    this.addChild(rule,50);
    start.runAction(ActionManager.MM_BUTTON_IN(1.5));
    rule.runAction(ActionManager.MM_BUTTON_MOVE(2,winSize.width/2-260,start.height/2+20));
    record.runAction(ActionManager.MM_BUTTON_MOVE(2,winSize.width/2+260,start.height/2+20));
    GameManager.button.mm_start = start;
    GameManager.button.mm_record = record;
    GameManager.button.mm_rule = rule;
    GameManager.setButton({name:"mm_start",x:start.x,y:start.y,w:start.width,h:start.height});
    GameManager.setButton({name:"mm_record",x:winSize.width/2+260,y:start.height/2+20,w:record.width,h:record.height});
    GameManager.setButton({name:"mm_rule",x:winSize.width/2-260,y:start.height/2+20,w:rule.width,h:rule.height});
  },
  loadButtonMusic : function(){
    var node = new ccui.Button(res.btn_music_1,res.btn_music_1,res.btn_music_0);
    node.setPressedActionEnabled(true);
    node.attr({
      x : winSize.width - node.width/2 - 20, 
      y : winSize.height -node.height/2 - 20
    });
    if(cc.audioEngine.getEffectsVolume()==0){ //静音了
      node.setBright(false);
    }
    this.addChild(node,50);
    GameManager.button.mm_music = node;
    GameManager.setButton({name:"mm_music",x:node.x,y:node.y,w:node.width,h:node.height});
  }
});
