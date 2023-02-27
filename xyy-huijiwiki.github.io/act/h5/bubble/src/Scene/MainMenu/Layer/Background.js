var MMBackgroundLayer = cc.Layer.extend({
  ctor: function () {
    this._super();
    this.loadBackgound();
  },
  loadBackgound: function () {
    var node = new cc.Sprite("#mm_bg.jpg");
    this.addChild(node);
    node.setPosition(winSize.width / 2, winSize.height / 2);
  }
});