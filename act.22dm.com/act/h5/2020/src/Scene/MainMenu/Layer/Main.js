var MMUILayer = cc.Layer.extend({
  baby: null,
  zIndexOrder: {
    light: 40,
    block_1: 50,
    role: 60,
    block_2: 100
  },
  ctor: function () {
    this._super();
  },
  onEnter: function () {
    this._super();
    this.loadBackgound();
    this.loadBaby();
    this.onRunAction();
  },
  onRunAction: function () {
    var that = this;
    var block_1 = this.baby.block_1;
    var block_2 = this.baby.block_2;
    var xi = this.baby.xi;
    var light = this.baby.light;
    var hong = this.baby.hong;
    var hui = this.baby.hui;
    block_1.runAction(ActionManager.MM_NODE_MOVE(GameManager.blockDuration, block_1.tx - block_1.x, 0, () => { }))
    block_2.runAction(ActionManager.MM_NODE_MOVE(GameManager.blockDuration, block_2.tx - block_2.x, 0, () => {
      block_2.lantern_l.runAction(ActionManager.MM_LANTERN_ROTATE(GameManager.lanternDuration));
      block_2.lantern_r.runAction(ActionManager.MM_LANTERN_ROTATE(GameManager.lanternDuration));
      block_2.block_3.visible = true;
      xi.runAction(ActionManager.MM_XI_IN(0, xi.ty - xi.y, () => {
        block_2.block_3.visible = false;
        block_2.block_4.visible = false;
        light.visible = true;
        light.runAction(ActionManager.MM_LIGHT_IN());
        hong.runAction(ActionManager.MM_NODE_MOVE(0.5,hong.tx - hong.x, 0, () => {}))
        hui.runAction(ActionManager.MM_NODE_MOVE(1,hui.tx - hui.x, 0, () => {
          that.loadButton();
        }))
      }))
    }))
  },
  loadBackgound: function () {
    let drawNode = new cc.DrawNode();
    drawNode.drawRect(cc.p(0, 0), cc.p(640, winSize.height), cc.color(255, 205, 88, 255));
    this.addChild(drawNode);
  },
  loadBaby: function () {
    let baby = new cc.Node();
    baby.attr({
      x: 320,
      y: winSize.height / 2,
      scale: winSize.scale
    });
    this.baby = baby;
    this.loadBlock();
    this.loadRole();
    this.loadLantern();
    this.addChild(baby);
  },
  loadBlock: function () {
    let block_1 = new cc.Sprite(`#mm_block_1.png`);
    let block_2 = new cc.Sprite(`#mm_block_2.png`);
    let block_3 = new cc.Sprite(`#mm_block_2_1.png`);
    let block_4 = new cc.Sprite(`#mm_block_2_2.jpg`);
    let title = new cc.Sprite(`#mm_title.png`);
    let word = new cc.Sprite(`#mm_word.png`);
    block_1.attr({
      anchorX: 0,
      anchorY: 0,
      x: 320 / winSize.scale,
      y: 0,
      tx: -290
    });
    block_2.attr({
      anchorX: 1,
      anchorY: 1,
      x: -320 / winSize.scale,
      y: block_1.y + 203,
      tx: 290,
      block_3: block_3,
      block_4: block_4
    });
    block_3.attr({
      anchorX: 0,
      anchorY: 1,
      x: 185,
      y: block_2.height,
      visible: false
    });
    block_4.attr({
      anchorX: 0,
      anchorY: 1,
      x: 185,
      y: block_2.height - 203
    });
    title.attr({
      x: block_2.width / 2,
      y: 102
    });
    word.attr({
      x: block_1.width - 105,
      y: block_1.height / 2
    });
    block_1.addChild(word);
    block_2.addChild(title);
    block_2.addChild(block_3);
    block_2.addChild(block_4,-1);
    this.baby.block_1 = block_1;
    this.baby.block_2 = block_2;
    this.baby.addChild(block_1, this.zIndexOrder.block_1);
    this.baby.addChild(block_2, this.zIndexOrder.block_2);
  },
  loadRole: function () {
    let xi = new cc.Sprite(`#mm_xi.png`);
    let light = new cc.Sprite(`#mm_xi_light.png`);
    let hui = new cc.Sprite(`#mm_hui.png`);
    let hong = new cc.Sprite(`#mm_hong.png`);
    xi.attr({
      anchorX: 0,
      anchorY: 0,
      x: -245,
      y: -120,
      ty: 194.5,
      opacity: 0,
      light: light
    });
    hong.attr({
      anchorX: 0,
      anchorY: 0,
      x: 320/winSize.scale,
      y: -210,
      tx : -83
    });
    hui.attr({
      anchorX: 0,
      anchorY: 0,
      x: 320/winSize.scale,
      y: -220,
      tx : 70
    });
    light.attr({
      x: -90,
      y: 300,
      scale: 1.55,
      visible: false
    })
    this.baby.xi = xi;
    this.baby.hui = hui;
    this.baby.hong = hong;
    this.baby.light = light;
    this.baby.addChild(light, this.zIndexOrder.light);
    this.baby.addChild(xi, this.zIndexOrder.role);
    this.baby.addChild(hong, this.zIndexOrder.role);
    this.baby.addChild(hui, this.zIndexOrder.role);
  },
  loadLantern: function () {
    let lantern_l = new cc.Sprite(`#mm_lantern.png`);
    let lantern_r = new cc.Sprite(`#mm_lantern.png`);
    lantern_l.attr({
      anchorX: 0.5,
      anchorY: 1,
      x: 48,
      y: 42,
      opacity: 255
    });
    lantern_r.attr({
      anchorX: 0.5,
      anchorY: 1,
      x: this.baby.block_2.width - 48,
      y: 42,
      opacity: 255
    });
    this.baby.block_2.lantern_l = lantern_l;
    this.baby.block_2.lantern_r = lantern_r;
    this.baby.block_2.addChild(lantern_l, -1);
    this.baby.block_2.addChild(lantern_r, -1);
  },
  loadButton: function () {
    let start = new cc.Sprite(`#btn_start.png`);
    let rule = new cc.Sprite(`#btn_rule.png`);
    start.attr({
      x: this.baby.block_2.width / 2,
      y: -60,
      opacity: 0
    });
    rule.attr({
      x: this.baby.block_2.width / 2,
      y: -170,
      opacity: 0
    });
    start.runAction(ActionManager.FADE_IN(0.5, () => { }));
    rule.runAction(ActionManager.FADE_IN(0.5, () => { }));
    this.baby.block_2.addChild(start);
    this.baby.block_2.addChild(rule);
    let box = start.getBoundingBoxToWorld();
    GameManager.setButton({
      name: "mm_start",
      w: box.width,
      h: box.height,
      x: box.x + box.width / 2,
      y: box.y + box.height / 2
    });
    box = rule.getBoundingBoxToWorld();
    GameManager.setButton({
      name: "mm_rule",
      w: box.width,
      h: box.height,
      x: box.x + box.width / 2,
      y: box.y + box.height / 2
    });
  }
});
