var GPMainLayer = cc.Layer.extend({
  top: null,
  role: null,
  zIndexOrder: {
    germ: 80,
    role: 100
  },
  ctor: function ctor() {
    this._super();
  },
  onEnter: function onEnter() {
    this._super();
    this.loadBackground();
    this.loadTop();
    this.loadBottom();
    this.loadMap();
    this.registerEvent();
    this.onRunAction();
  },
  onExit: function onExit() {
    this._super();
  },
  registerEvent: function () {
    let a = cc.EventListener.create({
      event: cc.EventListener.CUSTOM,
      target: this,
      eventName: jf.EventName.GP_ROLE_RUN,
      callback: this.onRoleRun
    });
    cc.eventManager.addListener(a, this);
  },
  onRunAction : function(){
    var that = this;
    let top = this.top;
    top.runAction(ActionManager.MM_NODE_MOVE(0.5, 0, -top.height, () => { 
      that.map.runAction(ActionManager.GP_MAP_SCALE(that.map.tscale,() => {
        v_main.stepneed = v_main.question.initstep;
      }));
    }));
  },
  onRoleRun: function (event) {
    let self = event.getCurrentTarget();
    let data = event.getUserData();
    self.role.runAction(ActionManager.MM_NODE_MOVE(GameManager.rowD, data.deltaX, data.deltaY, () => {
      v_main.onNextQuestion();
    }));
  },
  loadMap: function () {
    let map = new cc.Sprite(res.gp_map);
    let role = new cc.Sprite(res.gp_role);
    let marroon = new cc.Sprite(res.gp_marroon);
    let scale = ((winSize.height - 400) / 937);
    map.attr({
      x: 320,
      y: winSize.height / 2 - 85,
      scale: 0,
      tscale: scale > 1 ? 1 : scale
    });
    role.attr({
      x: 55,
      y: map.height - 60
    });
    marroon.attr({
      anchorX: 0.5,
      anchorY: 1,
      x: 105,
      y: 200.5
    });
    this.role = role;
    this.map = map;
    map.addChild(role);
    map.addChild(marroon);
    this.addChild(map);
    marroon.runAction(ActionManager.GP_LANTERN_ROTATE(1));
  },
  loadBackground: function () {
    let drawNode = new cc.DrawNode();
    drawNode.drawRect(cc.p(0, 0), cc.p(640, winSize.height), cc.color(255, 77, 89, 255));
    this.addChild(drawNode);
    let rows = [];
    for (let i = 0; i < Math.ceil(winSize.height / 449); i++) {
      rows.push(new cc.Sprite(res.gp_bg));
    }
    rows.forEach((item, index) => {
      item.attr({
        anchorX: 0,
        anchorY: 1,
        x: 0,
        y: winSize.height - 449 * index
      });
      this.addChild(item);
    })
  },
  loadTop: function () {
    let top = new cc.Sprite(res.gp_top);
    let title = new cc.Sprite(res.gp_title);
    top.attr({
      anchorX: 0,
      anchorY: 1,
      x: 0,
      y: winSize.height + (winSize.height < 1300 ? 35 : 0) + top.height
    });
    title.attr({
      x: top.width / 2,
      y: 155
    });
    this.top = top;
    top.addChild(title);
    this.addChild(top);
  },
  loadBottom: function () {
    let bottom = new cc.Sprite(res.gp_bottom);
    bottom.attr({
      anchorX: 0,
      anchorY: 0,
      x: 0,
      y: 0 - (winSize.height < 1300 ? 60 : 0)
    });
    this.addChild(bottom);
  }
});
