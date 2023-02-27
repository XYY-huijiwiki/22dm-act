var MMUILayer = cc.Layer.extend({
  ctor : function () {
    this._super();
  },
  onEnter : function () {
    this._super();
    this.registerEvent();
    this.loadLogo();
    this.loadTitle(); 
    this.loadWolf();
    this.loadButton();
    this.loadButtonMusic();
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
      eventName   : jf.EventName.MM_LUAN_IN,
      callback    : this.onloadLuan
    });
    cc.eventManager.addListener(c, this);

    var d = cc.EventListener.create({
      event       : cc.EventListener.CUSTOM,
      target      : this,
      eventName   : jf.EventName.MM_FEI_IN,
      callback    : this.onloadFei
    });
    cc.eventManager.addListener(d, this);

    var e = cc.EventListener.create({
      event       : cc.EventListener.CUSTOM,
      target      : this,
      eventName   : jf.EventName.MM_LAN_IN,
      callback    : this.onloadLan
    });
    cc.eventManager.addListener(e, this);
  },
  loadTitle : function(){
    var node = new cc.Sprite(res.mm_title_1);
    node.attr({
      anchorX : 0.5,
      anchorY : 1,
      x : winSize.width >> 1,
      y : winSize.height + node.height
    });
    this.addChild(node,10);
    node.runAction(ActionManager.MM_TITLE_IN(0.5,0,-node.height-30,function(){
      cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.MM_FEI_IN));
      cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.MM_LAN_IN));
      cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.MM_XI_IN));
      cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.MM_MEI_IN));
      cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.MM_LUAN_IN));
    }));
  },
  loadWolf : function(){
    var node = new cc.Sprite(res.mm_role_6);
    node.attr({
      x : winSize.width >> 1,
      y : winSize.height >> 1
    });
    this.addChild(node,60);
  },
  onloadLuan : function(event){
    var self = event.getCurrentTarget();
    var role = new cc.Sprite(res.mm_role_1);
    role.attr({
      x : winSize.width/2,
      y : winSize.height/2-30,
      opacity : 0
    });
    self.addChild(role,50);
    role.runAction(cc.sequence(cc.delayTime(1.5),cc.fadeTo(1,255),cc.callFunc(function(){
      role.runAction(ActionManager.MM_XI_LUAN());
    })));
  },
  onloadXi : function(event){
    var self = event.getCurrentTarget();
    var role = new cc.Sprite(res.mm_role_2);
    role.attr({
      x : -role.width/2,
      y : winSize.height/2-50,
      opacity : 0
    });
    self.addChild(role,50);
    role.runAction(ActionManager.MM_ROLE_IN(0.7,winSize.width/2-460,role.y));
  },
  onloadMei : function(event){
    var self = event.getCurrentTarget();
    var role = new cc.Sprite(res.mm_role_3);
    role.attr({
      x : winSize.width+role.width/2,
      y : winSize.height/2-70,
      opacity : 0
    });
    self.addChild(role,50);
    role.runAction(ActionManager.MM_ROLE_IN(0.7,winSize.width/2+430,role.y));
  },
  onloadFei : function(event){
    var self = event.getCurrentTarget();
    var role = new cc.Sprite(res.mm_role_4);
    role.attr({
      x : -role.width/2,
      y : winSize.height/2+105,
      opacity : 0
    });
    self.addChild(role,50);
    role.runAction(ActionManager.MM_ROLE_IN(0,winSize.width/2-440,role.y));
  },
  onloadLan : function(event){
    var self = event.getCurrentTarget();
    var role = new cc.Sprite(res.mm_role_5);
    role.attr({
      x : winSize.width+role.width/2,
      y : winSize.height/2+120,
      opacity : 0
    });
    self.addChild(role,5);
    role.runAction(ActionManager.MM_ROLE_IN(0,winSize.width/2+440,role.y));
  },
  loadButton : function(){
    var start = new cc.Sprite(res.mm_start);
    var record = new cc.Sprite(res.mm_record);
    var rule = new cc.Sprite(res.mm_rule);
    start.attr({
      x : winSize.width/2,
      y : start.height/2+30,
      opacity : 0
    });
    record.attr({
      x : winSize.width/2+210,
      y : start.height/2+20,
      opacity : 0
    });
    rule.attr({
      x : winSize.width/2-210,
      y : start.height/2+20,
      opacity : 0
    });
    this.addChild(start,100);
    this.addChild(record,100);
    this.addChild(rule,100);
    var delaytime = 3.2;
    start.runAction(ActionManager.MM_BUTTON_IN(delaytime));
    rule.runAction(ActionManager.MM_BUTTON_IN(delaytime));
    record.runAction(ActionManager.MM_BUTTON_IN(delaytime));
    GameManager.button.mm_start = start;
    GameManager.button.mm_record = record;
    GameManager.button.mm_rule = rule;
    GameManager.setButton({name:"mm_start",x:start.x,y:start.y,w:start.width,h:start.height});
    GameManager.setButton({name:"mm_record",x:record.x,y:record.y,w:record.width,h:record.height});
    GameManager.setButton({name:"mm_rule",x:rule.x,y:rule.y,w:rule.width,h:rule.height});
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
  },
  loadLogo : function(){
    var node = new cc.Sprite(res.mm_logo);
    node.attr({
      anchorX:0,
      anchorY:1,
      x : 30,
      y : winSize.height-30
    });
    this.addChild(node);
  }
});