var GameResultScene = cc.Scene.extend({
  ctor: function () {
    this._super();
  },
  onEnter: function () {
    this._super();
    this.loadMainLayer();
    v_main.scene = "GameResultScene";
  },
  loadMainLayer: function () {
    let layer = new GSMainLayer();
    this.addChild(layer);
  }
});