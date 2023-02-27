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
    this.loadTitle();
    this.loadRole();
    this.loadButtonStart();
    this.loadButtonRule();
    this.loadButtonRecord();
    this.loadButtonMusic();
    this.loadButtonEntry();
  },
  loadTitle : function(){
    var node = new cc.Sprite(res.mm_title);
    this.addChild(node);
    node.setPosition(winSize.width / 2, winSize.height - node.height/2 - 80 - winSize.topOffset / 2);
    node.runAction(ActionManager.MM_TITLE_FLOAT());
  },
  loadRole : function(){
    var role_1 = new cc.Sprite(res.mm_role_1);
    var role_2 = new cc.Sprite(res.mm_role_2);
    var role_3 = new cc.Sprite(res.mm_role_3);
    role_1.setPosition(415, 470 + winSize.topOffset);
    role_2.setPosition(520, 330 + winSize.topOffset);
    role_3.setPosition(70, 310 + winSize.topOffset);
    this.addChild(role_2);
    this.addChild(role_1);
    this.addChild(role_3);
    role_1.runAction(ActionManager.MM_ROLE_FADE(1,1));
    role_2.runAction(ActionManager.MM_ROLE_FADE(1.5,0.5));
    role_3.runAction(ActionManager.MM_ROLE_FADE(3,2));
  },
  loadButtonStart : function(){
    var node = new ccui.Button(res.mm_start,res.mm_start_2,res.mm_start);
    node.setPressedActionEnabled(true);
    node.attr({
      x : 140,
      y : 130 + node.height/2 + winSize.topOffset/2
    });
    node.addTouchEventListener(function(sender,type){
      if(type==ccui.Widget.TOUCH_ENDED && sender.pressedActionEnabled)
      {
        winSize.playEffect('button')
        sender.setPressedActionEnabled(false);
        v_main.Game_resert();
      }
    },this);
    this.addChild(node);
    GameManager.btn.start = node;
  },
  loadButtonRule : function(){
    var node = new ccui.Button(res.mm_rule,res.mm_rule_2,res.mm_rule);
    node.setPressedActionEnabled(true);
    node.attr({
      x : 360,
      y : 80 + node.height/2 + winSize.topOffset/2
    });
    node.addTouchEventListener(function(sender,type){
      if(type==ccui.Widget.TOUCH_ENDED)
      {
        winSize.playEffect('button');
        v_main.active = 'rule';
      }
    },this);
    this.addChild(node);
    GameManager.btn.rule = node;
  },
  loadButtonRecord : function(){
    var node = new ccui.Button(res.mm_record,res.mm_record_2,res.mm_record);
    node.setPressedActionEnabled(true);
    node.attr({
      x : 550,
      y : 100 + node.height/2 + winSize.topOffset/2
    });
    node.addTouchEventListener(function(sender,type){
      if(type==ccui.Widget.TOUCH_ENDED)
      {
        winSize.playEffect('button');
        v_main.active = 'record';
      }
    },this);
    this.addChild(node);
    GameManager.btn.record = node;
  },
  loadButtonEntry : function(){
    var node = new ccui.Button(res.mm_entry,res.mm_entry,res.mm_entry);
    node.setPressedActionEnabled(true);
    node.attr({
      x : 120,
      y : 550 + node.height/2 + winSize.topOffset/2
    });
    node.addTouchEventListener(function(sender,type){
      if(type==ccui.Widget.TOUCH_ENDED)
      {
        location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb61fdb0e387cbcc4&redirect_uri=http%3a%2f%2fwww.22dm.com%2fact%2fh5%2fjump%2findex.html&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
      }
    },this);
    node.runAction(ActionManager.RUN_MM_ENTRY());
    this.addChild(node);
  },
  loadButtonMusic : function(){
    var node = new ccui.Button(res.pb_music_1,res.pb_music_1,res.pb_music_0);
    node.setPressedActionEnabled(true);
    node.attr({
      anchorX : 1,
      anchorY : 1,
      x : winSize.width - 40,
      y : winSize.height - 40 - (winSize.topOffset > 0?winSize.topOffset/2 : 0)
    });
    if(cc.audioEngine.getEffectsVolume()==0){ //静音了
      node.setBright(false);
    }
    this.addChild(node);
    node.addTouchEventListener(function(sender,type){
      if(type == ccui.Widget.TOUCH_ENDED)
      {
        if(sender._bright){  //静音
          sender.setBright(false);
          winSize.setEffectsVolume(0);
        }
        else{   //开启声音
          sender.setBright(true);
          winSize.setEffectsVolume(1);
        }
      }
    },this);
  }
});
