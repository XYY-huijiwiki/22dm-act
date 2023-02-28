var MMUILayer = cc.Layer.extend({
  ctor: function () {
    this._super();
  },
  onEnter: function () {
    this._super();
    this.loadTitle();
    this.loadButton();
  },
  loadTitle: function () {
    var node = new cc.Sprite("#mm_title.png");
    node.attr({
      anchorX: 1,
      anchorY: 1,
      x: winSize.width - 20,
      y: 640 + 378,
      scale: winSize.scale,
      opacity: 0
    });
    this.addChild(node);
    node.runAction(ActionManager.MM_TITLE_FLYIN(() => {
      node.runAction(ActionManager.MM_TITLE_FLOAT());
    }));
  },
  loadButton: function () {
    var start = new cc.Sprite("#btn_start.png");
    var record = new cc.Sprite("#btn_record.png");
    var rule = new cc.Sprite("#btn_rule.png");
    start.attr({
      x: winSize.width - start.width / 2 - 60,
      y: start.height / 2 + 30,
      opacity: 0
    });
    record.attr({
      x: start.x - start.width / 2 - record.width / 2,
      y: record.height / 2 + 5,
      opacity: 0
    });
    rule.attr({
      x: record.x - record.width / 2 - rule.width / 2 - 5,
      y: rule.height / 2 + 10,
      opacity: 0
    });
    this.addChild(start);
    this.addChild(record);
    this.addChild(rule);
    let delaytime = 1.3;
    let duration = 0.8;
    start.runAction(ActionManager.MM_BUTTON_IN(delaytime));
    record.runAction(ActionManager.MM_BUTTON_IN(delaytime+duration));
    rule.runAction(ActionManager.MM_BUTTON_IN(delaytime+duration*2));
    setTimeout(function(){
      GameManager.setButton({ name: "mm_start", x: start.x, y: start.y, w: start.width, h: start.height });
      GameManager.setButton({ name: "mm_record", x: record.x, y: record.y, w: record.width, h: record.height });
      GameManager.setButton({ name: "mm_rule", x: rule.x, y: rule.y, w: rule.width, h: rule.height });
    },delaytime*1000)
  }
});