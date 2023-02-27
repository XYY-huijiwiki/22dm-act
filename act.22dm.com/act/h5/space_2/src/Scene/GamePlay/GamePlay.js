var GamePlayScene = cc.Scene.extend({
  Main: null, // 背景层
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
    this.Main = new Main();
    this.addChild(this.Main);
  }
});