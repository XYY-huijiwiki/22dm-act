var MainMenuScene = cc.Scene.extend({
  backgroundLayer: null,
  UILayer: null,
  ctor: function () {
    this._super();
  },
  onEnter: function () {
    this._super();
    this.loadBackgroundLayer();
    this.loadUILayer();
    v_main.scene = "";
  },
  loadBackgroundLayer: function () {
    this.backgroundLayer = new MMBackgroundLayer();
    this.addChild(this.backgroundLayer);
  },
  loadUILayer: function () {
    this.UILayer = new MMUILayer();
    this.addChild(this.UILayer);
  }
});