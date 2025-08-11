var GSMainLayer = cc.Layer.extend({
  theme: 0,
  ctor: function (theme) {
    this._super();
    this.theme = theme;
  },
  onEnter: function () {
    this._super();
    this.loadRole();
    this.loadButton();
  },
  loadRole: function () {
    var node = new cc.Sprite(`#theme_${this.theme}.png`);
    node.attr({
      x: -winSize.width/2,
      y: winSize.height,
      scale : winSize.scaleY,
      opacity : 0
    });
    this.addChild(node);
    node.runAction(ActionManager.GS_ROLE_IN(winSize.width/2,winSize.height/2));
  },
  loadButton: function () {
    var play = new ccui.Button("btn_replay.png","btn_replay2.png","btn_replay.png",ccui.Widget.PLIST_TEXTURE);
    var share = new ccui.Button("btn_share.png","btn_share2.png","btn_share.png",ccui.Widget.PLIST_TEXTURE);
    play.setPressedActionEnabled(true);
    share.setPressedActionEnabled(true);
    play.attr({
      anchorX: 0,
      anchorY: 0,
      x: winSize.width / 2 - share.width / 2 - 80,
      y: 30,
      opacity: 0
    });
    share.attr({
      anchorX: 0,
      anchorY: 0,
      x: winSize.width / 2 - share.width / 2 + 80,
      y: 30,
      opacity: 0
    });
    share.addTouchEventListener(function (sender, type) {
      if (type == ccui.Widget.TOUCH_ENDED) {
        winSize.playEffect('button');
        v_main.active = 'share';
      }
    }, this);
    play.addTouchEventListener(function (sender, type) {
      if (type == ccui.Widget.TOUCH_ENDED) {
        winSize.playEffect('button');
        v_main.Game_resert();
      }
    }, this);
    this.addChild(share);
    this.addChild(play);
    share.runAction(ActionManager.GS_BUTTON_FADE());
    play.runAction(ActionManager.GS_BUTTON_FADE());
  }
});