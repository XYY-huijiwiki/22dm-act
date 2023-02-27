var MMUILayer = cc.Layer.extend({
  Role: null,
  ctor: function () {
    this._super();
  },
  onEnter: function () {
    this._super();
    this.loadButtonLayer();
  },
  loadButtonLayer: function () {
    this.loadRole();
    this.loadTitle();
    this.loadButtonStart();
    this.loadButtonRule();
    this.loadButtonRecord();
  },
  loadTitle: function () {
    var node = new cc.Sprite("#mm_title.png");
    this.addChild(node);
    node.setPosition(winSize.width / 2, winSize.height-node.height/2 - 50*winSize.scaleY);
    node.runAction(ActionManager.MM_ROLE_FADE(1, 1));
  },
  loadRole: function () {
    var node = new cc.Sprite("#mm_role.png");
    node.attr({
      anchorX : 0,
      anchorY : 0,
      x : -140*winSize.scaleY-300,
      y : 300 *winSize.scaleY+600,
      scale : winSize.scaleY
    });
    this.addChild(node);
    node.runAction(ActionManager.MM_ROLE_FLOATIN(function(){
      node.runAction(ActionManager.MM_TITLE_FLOAT());
    }));
  },
  loadButtonStart: function () {
    var node = new ccui.Button("btn_start.png","btn_start_2.png","btn_start.png",ccui.Widget.PLIST_TEXTURE);
    node.setPressedActionEnabled(true);
    node.attr({
      x: 150,
      y: node.height/2 + 80 * winSize.scaleY,
      scale : winSize.scaleY
    });
    node.addTouchEventListener(function (sender, type) {
      if (type == ccui.Widget.TOUCH_ENDED && sender.pressedActionEnabled) {
        winSize.playEffect('button')
        sender.setPressedActionEnabled(false);
        v_main.Game_resert();
      }
    }, this);
    this.addChild(node);
  },
  loadButtonRule: function () {
    var node = new ccui.Button("btn_rule.png","btn_rule_2.png","btn_rule.png",ccui.Widget.PLIST_TEXTURE);
    node.setPressedActionEnabled(true);
    node.attr({
      x: 340,
      y: node.height/2 + 10 * winSize.scaleY,
      scale : winSize.scaleY
    });
    node.addTouchEventListener(function (sender, type) {
      if (type == ccui.Widget.TOUCH_ENDED) {
        winSize.playEffect('button');
        v_main.active = 'rule';
      }
    }, this);
    this.addChild(node);
  },
  loadButtonRecord: function () {
    var node = new ccui.Button("btn_record.png","btn_record_2.png","btn_record.png",ccui.Widget.PLIST_TEXTURE);
    node.setPressedActionEnabled(true);
    node.attr({
      x: 510,
      y: node.height/2 + 50 * winSize.scaleY,
      scale : winSize.scaleY
    });
    node.addTouchEventListener(function (sender, type) {
      if (type == ccui.Widget.TOUCH_ENDED) {
        winSize.playEffect('button');
        v_main.active = 'record';
      }
    }, this);
    this.addChild(node);
  }
});
