var MainMenuScene = cc.Scene.extend({
  ctor: function () {
    this._super();
  },
  onEnter: function () {
    this._super();
    this.loadMainLayer();
    v_main.scene = "MainMenuScene";
  },
  loadMainLayer: function () {
    let layer = new MMUILayer();
    this.addChild(layer);
  }
});