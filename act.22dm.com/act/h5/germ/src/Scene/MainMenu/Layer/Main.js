var MMUILayer = cc.Layer.extend({
  Role: null,
  ctor: function () {
    this._super();
  },
  onEnter: function () {
    this._super();
    this.loadBackgound();
    this.loadLogo();
    this.loadRole();
  },
  loadBackgound: function () {
    var node = new cc.Sprite(res.mm_bg);
    node.attr({
      anchorX: 0,
      anchorY: 0,
      x: 0,
      y: 0
    })
    this.addChild(node);
  },
  loadRole : function(){
    var that = this;
    var role = new cc.Sprite(res.mm_role);
    role.attr({
      x: 0,
      y: winSize.height + role.height/2,
      scale : winSize.scale
    })
    this.addChild(role);
    role.runAction(ActionManager.MM_ROLE_IN(1.2,340,-(winSize.height/2+role.height/2-140),function(){
      role.runAction(ActionManager.MM_ROLE_FLOAT(3,0,50));
      that.loadTitle();
      that.loadButton();
    }))
  },
  loadTitle: function () {
    let title = new cc.Sprite(res.mm_title);
    title.attr({
      anchorX: 0.5,
      anchorY: 0,
      x: 640,
      y: 180,
      scale: winSize.scale
    });
    title.runAction(ActionManager.MM_TITLE_IN());
    this.addChild(title);
  },
  loadButton: function () {
    let rule = new cc.Sprite(res.btn_rule);
    let start = new cc.Sprite(res.btn_play);
    let record = new cc.Sprite(res.btn_record);
    let startX = 320;
    let startY = 70;
    rule.attr({
      x: startX - start.width / 2 - rule.width / 2 - 30,
      y: rule.height / 2 + startY,
      opacity: 0
    });
    start.attr({
      x: startX,
      y: start.height / 2 + startY,
      opacity: 0
    });
    record.attr({
      x: startX + start.width / 2 + record.width / 2 + 30,
      y: record.height / 2 + startY,
      opacity: 0
    });
    this.addChild(start);
    this.addChild(record);
    this.addChild(rule);
    let delaytime = 1.5;
    let duration = 0.8;
    start.runAction(ActionManager.MM_BUTTON_IN(delaytime));
    rule.runAction(ActionManager.MM_BUTTON_IN(delaytime + duration));
    record.runAction(ActionManager.MM_BUTTON_IN(delaytime + duration * 2));
    setTimeout(function () {
      GameManager.setButton({ name: "mm_start", x: start.x, y: start.y, w: start.width, h: start.height });
      GameManager.setButton({ name: "mm_record", x: record.x, y: record.y, w: record.width, h: record.height });
      GameManager.setButton({ name: "mm_rule", x: rule.x, y: rule.y, w: rule.width, h: rule.height });
    }, delaytime * 1000)
  },
  loadLogo:function(){
    let logo = new cc.Sprite(res.mm_logo);
    logo.attr({
      anchorX : 0,
      anchorY : 1,
      x : 15,
      y : winSize.height - 15
    });
    this.addChild(logo);
  }
});
