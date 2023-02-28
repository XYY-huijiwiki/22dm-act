var GamePlayScene = cc.Scene.extend({
  ctor: function () {
    this._super();
  },
  onEnter: function () {
    this._super();
    this.loadMainLayer();
  },
  onExit: function () {
    this._super();
  },
  loadMainLayer: function () {
    this.addChild(new GPMainLayer(),100);
  }
});