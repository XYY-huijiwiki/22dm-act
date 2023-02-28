var GamePlayScene = cc.Scene.extend({
  backgroundLayer: null, // 背景层
  mainLayer: null, // 玩法层
  ctor: function () {
    this._super();
  },
  onEnter: function () {
    this._super();
    this.loadBackgroundLayer();
    this.loadMainLayer();
  },
  onExit: function () {
    this._super();
  },
  loadBackgroundLayer: function () {
    this.backgroundLayer = null;
    var node = new GPBackgroundLayer();
    this.addChild(node, 0);
    this.backgroundLayer = node;
  },
  loadMainLayer: function () {
    this.mainLayer = null;
    this.mainLayer = new GPMainLayer();
    this.addChild(this.mainLayer, 20);
  }
});