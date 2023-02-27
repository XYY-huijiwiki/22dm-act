var GamePlayScene = cc.Scene.extend({
  mainLayer: null, // 玩法层
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
    this.mainLayer = new GPMainLayer();
    this.addChild(this.mainLayer, 20);
  }
});