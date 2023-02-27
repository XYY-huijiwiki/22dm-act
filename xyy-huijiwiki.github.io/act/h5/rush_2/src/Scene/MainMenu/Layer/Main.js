var MMBackgroundLayer = cc.Layer.extend({
  ctor: function () {
    this._super();
    this.loadBackgound();
    this.loadRole();
    this.loadTitle();
    v_main.scene = "MainMenuScene";
    cc.director.getScheduler().setTimeScale(1);
  },
  loadBackgound: function () {
    var node = new cc.Sprite(`#mm_bg.jpg`);
    this.addChild(node);
    node.attr({
      anchorX: 1,
      anchorY: 0.5,
      x: winSize.width,
      y: winSize.height / 2
    });
  },
  loadTitle: function () {
    var title = new cc.Sprite("#mm_title.png");
    title.attr({
      anchorX: 0.5,
      anchorY: 0.5,
      x: winSize.width >> 1,
      y: winSize.height - title.height / 2 - 10
    });
    this.addChild(title);
    title.runAction(ActionManager.MM_TITLE_MOVE());
  },
  loadRole: function () {
    var glass = new cc.Sprite("#mm_glass.png");
    var role_0 = new cc.Sprite("#mm_role_0.png");
    var role_1 = new cc.Sprite("#mm_role_1.png");
    var role_2 = new cc.Sprite("#mm_role_2.png");
    glass.attr({
      anchorX: 1,
      anchorY: 0,
      x: winSize.width,
      y: 0,
      scale: winSize.width < glass.width ? (winSize.width / glass.width) : 1
    });
    role_0.attr({
      x: glass.width / 2 - 80,
      y: role_0.height / 2 + 65
    });
    role_1.attr({
      x: glass.width / 2 - 365,
      y: role_1.height / 2 + 285
    });
    role_2.attr({
      x: winSize.width - role_2.width / 2 - 100,
      y: role_2.height / 2 + 215,
      scale : glass.scale
    });
    glass.addChild(role_0);
    glass.addChild(role_1);
    this.addChild(role_2);
    this.addChild(glass);
    glass.runAction(ActionManager.MM_GLASS_MOVE());
    role_2.runAction(ActionManager.MM_ROLE_MOVE());
  }
});