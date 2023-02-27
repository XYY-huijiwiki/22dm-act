var GamePlayScene = cc.Scene.extend({
  ctor: function () {
    this._super();
  },
  onEnter: function () {
    this._super();
    this.loadMainLayer();
    v_main.scene = "GamePlayScene";
  },
  onExit: function () {
    this._super();
  },
  loadMainLayer: function () {
    this.addChild(new GPMainLayer());
  }
});