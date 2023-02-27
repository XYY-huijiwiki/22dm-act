var GameResultScene = cc.Scene.extend({
  mainLayer: null,
  ctor: function () {
    this._super();
  },
  onEnter: function () {
    this._super();
    this.loadMainLayer();
    cc.director.getScheduler().setTimeScale(1);
  },
  loadMainLayer: function () {
    this.mainLayer = new GSMainLayer();
    this.addChild(this.mainLayer);
  }
});