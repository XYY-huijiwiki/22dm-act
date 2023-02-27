var MMBackgroundLayer = cc.Layer.extend({
  ctor: function () {
    this._super();
    this.loadBackgound();
    this.loadOtherRole(); 
    this.loadRole();
    this.loadTitle();
    v_main.scene = "MainMenuScene";
    cc.director.getScheduler().setTimeScale(1);
  },
  loadBackgound: function () {
    var node = new cc.Sprite(res.mm_bg);
    this.addChild(node);
    node.setPosition(winSize.width / 2, winSize.height / 2);
  },
  loadTitle : function(){
    var title = new cc.Sprite("#mm_title.png");
    title.attr({
      anchorX : 0.5,
      anchorY : 0.5,
      x : winSize.width >> 1,
      y : title.height / 2 + 95
    });
    this.addChild(title);
    title.runAction(ActionManager.MM_TITLE_MOVE());
  },
  loadRole: function () {
    var role = new cc.Sprite("#mm_role_0.png");
    role.attr({
      anchorX : 0.5,
      anchorY : 1,
      x : winSize.width >> 1,
      y : winSize.height-20
    });
    this.addChild(role);
    role.runAction(ActionManager.MM_ROLE_MOVE());
  },
  loadOtherRole: function () {
    var role_1 = new cc.Sprite("#mm_role_1.png");
    var role_2 = new cc.Sprite("#mm_role_2.png");
    var role_3 = new cc.Sprite("#mm_role_3.png");
    var role_4 = new cc.Sprite("#mm_role_4.png");
    role_1.attr({
      anchorX : 0,
      anchorY : 1,
      x : 220*winSize.scale,
      y : winSize.height-65,
      scale : winSize.scale
    });
    role_2.attr({
      anchorX : 0,
      anchorY : 0,
      x : 80*winSize.scale,
      y : 180,
      scale : winSize.scale
    });
    role_3.attr({
      anchorX : 1,
      anchorY : 1,
      x : winSize.width - 200*winSize.scale,
      y : winSize.height-20,
      scale : winSize.scale
    });
    role_4.attr({
      anchorX : 1,
      anchorY : 0,
      x : winSize.width - 50*winSize.scale,
      y : 250,
      scale : winSize.scale
    });
    this.addChild(role_1);
    this.addChild(role_2);
    this.addChild(role_3);
    this.addChild(role_4);
    role_1.runAction(ActionManager.MM_ROLE_FADE(1));
    role_2.runAction(ActionManager.MM_ROLE_FADE(1));
    role_3.runAction(ActionManager.MM_ROLE_FADE(1));
    role_4.runAction(ActionManager.MM_ROLE_FADE(1));
  }
});