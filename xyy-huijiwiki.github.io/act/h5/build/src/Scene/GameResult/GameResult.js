var GameResultScene = cc.Scene.extend({
  data: null,
  backgroundLayer: null, // 背景层
  mainLayer: null,
  ctor: function (data) {
    this._super();
    this.data = data;
  },
  onEnter: function () {
    this._super();
    this.loadMainLayer();
    v_main.scene = "GameResultScene";
  },
  loadMainLayer: function () {
    this.mainLayer = new GSMainLayer(this.data.theme);
    this.addChild(this.mainLayer);
  }
});