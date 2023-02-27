var MMBackgroundLayer = cc.Layer.extend({
  ctor: function () {
    this._super();
    this.loadBackgound();
  },
  loadBackgound: function () {
    var node = new cc.Sprite(res.mm_bg);
    this.addChild(node);
    node.attr({
      anchorX: 0,
      anchorY: 0,
      x: 0,
      y: 0
    })
  }
});