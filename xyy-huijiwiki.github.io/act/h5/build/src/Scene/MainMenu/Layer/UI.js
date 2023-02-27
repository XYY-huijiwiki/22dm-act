var MMUILayer = cc.Layer.extend({
  Role: null,
  ctor: function () {
    this._super();
  },
  onEnter: function () {
    this._super();
    this.loadTree();
    this.loadTitle();
    this.loadBranch();
    this.loadButton();
  },
  loadBranch: function () {
    let branch = new cc.Sprite(res.mm_branch);
    let squash = new cc.Sprite(res.mm_squash);
    let mei = new cc.Sprite(res.mm_mei);
    branch.attr({
      anchorX: 1,
      anchorY: 1,
      x: winSize.width,
      y: winSize.height,
      scale: winSize.scale,
      opacity : 0,
      cascadeOpacity: true
    });
    squash.attr({
      anchorX: 0.5,
      anchorY: 1,
      x: branch.width / 2 - 45,
      y: 115
    });
    mei.attr({
      x: branch.width - mei.width / 2 - 30,
      y: -230
    });
    branch.addChild(squash, -1);
    branch.addChild(mei);
    this.addChild(branch);
    branch.runAction(ActionManager.MM_BRANCH_IN(function(){
      squash.runAction(ActionManager.MM_SQUASH_SWAY());
      mei.runAction(ActionManager.MM_ROLE_FLOAT(2,5,20));
    }))
  },
  loadTree: function () {
    let tree = new cc.Sprite(res.mm_tree);
    tree.attr({
      anchorX: 1,
      anchorY: 1,
      x: 660,
      y: winSize.height,
      scale: winSize.scale
    })
    this.addChild(tree);
  },
  loadTitle: function () {
    let title = new cc.Sprite(res.mm_title);
    let xi = new cc.Sprite(res.mm_xi);
    let lan = new cc.Sprite(res.mm_lan);
    let house = new cc.Sprite(res.mm_house);
    xi.attr({
      x: title.width - 130,
      y: title.height + 85
    });
    lan.attr({
      x: 105,
      y: title.height - 10
    });
    house.attr({
      anchorX: 0.5,
      anchorY: 0,
      x: title.width / 2 - 75,
      y: title.height - 65
    });
    title.attr({
      anchorX: 0.5,
      anchorY: 0,
      x: 640,
      y: 130,
      scale: winSize.scale
    });
    title.addChild(house, -1);
    title.addChild(lan);
    title.addChild(xi);
    this.addChild(title);
    title.runAction(ActionManager.MM_TITLE_IN());
    xi.runAction(ActionManager.MM_ROLE_FLOAT(2,0,10));
    lan.runAction(ActionManager.MM_ROLE_FLOAT(2.5,10,0));
  },
  loadButton: function () {
    let rule = new cc.Sprite(res.mm_rule);
    let start = new cc.Sprite(res.mm_start);
    let record = new cc.Sprite(res.mm_record);
    let startX = 320;
    rule.attr({
      x: startX - start.width / 2 - rule.width / 2 - 5,
      y: rule.height / 2 + 90,
      opacity: 0
    });
    start.attr({
      x: startX,
      y: start.height / 2 + 20,
      opacity: 0
    });
    record.attr({
      x: startX + start.width / 2 + record.width / 2,
      y: record.height / 2 + 90,
      opacity: 0
    });
    this.addChild(start);
    this.addChild(record);
    this.addChild(rule);
    let delaytime = 1.8;
    let duration = 0.8;
    start.runAction(ActionManager.MM_BUTTON_IN(delaytime));
    rule.runAction(ActionManager.MM_BUTTON_IN(delaytime + duration));
    record.runAction(ActionManager.MM_BUTTON_IN(delaytime + duration * 2));
    setTimeout(function () {
      GameManager.setButton({ name: "mm_start", x: start.x, y: start.y, w: start.width, h: start.height });
      GameManager.setButton({ name: "mm_record", x: record.x, y: record.y, w: record.width, h: record.height });
      GameManager.setButton({ name: "mm_rule", x: rule.x, y: rule.y, w: rule.width, h: rule.height });
      v_main.scene = "MainMenuScene";
    }, delaytime * 1000)
  }
});
