var MainMenuScene = cc.Scene.extend({
  backgroundLayer: null,
  UILayer: null,
  ctor: function () {
    this._super();
  },
  onEnter: function () {
    this._super();
    this.loadBackgroundLayer(); 
  },
  loadBackgroundLayer: function () {
    this.backgroundLayer = new MMBackgroundLayer();
    this.addChild(this.backgroundLayer);
  }
});