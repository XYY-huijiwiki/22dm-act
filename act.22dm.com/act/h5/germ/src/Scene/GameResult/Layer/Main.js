var GSMainLayer = cc.Layer.extend({
  theme: 0,
  ctor: function () {
    this._super();
  },
  onEnter: function () {
    this._super();
    this.loadBackGrouond();
    if (v_main.Game_theme == 1) {
      this.loadSnow();
    }
    this.loadRole();
  },
  loadBackGrouond: function () {
    let background = new cc.Sprite(res.background);
    background.attr({
      anchorX: 0.5,
      anchorY: 1,
      x: 320,
      y: winSize.height
    });
    this.addChild(background);
  },
  loadSnow: function () {
    let snow = new cc.Sprite("#gs_snow.png");
    snow.attr({
      anchorX: 0.5,
      anchorY: 1,
      x: 320,
      y: winSize.height - 100
    });
    this.addChild(snow);
  },
  loadRole: function () {
    var that = this;
    let setting = [
      {
        titleX: 95,
        titleY: 270
      },
      {
        titleX: -140,
        titleY: 410
      },
      {
        titleX: -70,
        titleY: 395
      }
    ];
    let role = new cc.Sprite(`#gs_role_${v_main.Game_theme}.png`);
    let title = new cc.Sprite(`#gs_word_${v_main.Game_theme}.png`);
    role.attr({
      anchorX: 0.5,
      anchorY: 0,
      x: 320,
      y: v_main.Game_theme == 2 ? winSize.height : - role.height
    });
    title.attr({
      anchorX: 0.5,
      anchorY: 0.5,
      x: role.width / 2 + setting[v_main.Game_theme - 1].titleX,
      y: role.height / 2 + setting[v_main.Game_theme - 1].titleY,
      opacity: 0
    });
    role.addChild(title);
    this.addChild(role);
    let deltaY = v_main.Game_theme == 2 ? -winSize.height : role.height;
    deltaY = deltaY - (winSize.scale < 0.99 ? 40 : 0);
    role.runAction(ActionManager.MM_ROLE_IN(0.8, 0, deltaY, function () {
      title.runAction(ActionManager.GS_TITLE_IN());
      title.runAction(ActionManager.MM_ROLE_FLOAT(2, 0, -15));
      that.loadTitle();
    }.bind(this)))
  },
  loadTitle: function () {
    let title = new cc.Sprite(`#gs_title_${v_main.Game_theme}.png`);
    let play = new cc.Sprite(res.btn_back);
    let share = new cc.Sprite(res.btn_share);
    title.attr({
      anchorX: 0.5,
      anchorY: 1,
      x: 320,
      y: winSize.height - (winSize.scale < 0.99 ? 5 : 30),
      scale: winSize.scale,
      opacity: 0
    });
    if (winSize.scale > 0.99) {
      play.attr({
        x: title.width / 2 - 80,
        y: -50,
        scale: winSize.scale,
        opacity: 0
      });
      share.attr({
        x: title.width / 2 + 80,
        y: -50,
        scale: winSize.scale,
        opacity: 0
      });
      title.addChild(share);
      title.addChild(play);
      GameManager.setButton({ name: "gs_play", x: (640 - title.width) / 2 + play.x, y: title.y - title.height + play.y, w: play.width, h: play.height });
      GameManager.setButton({ name: "gs_share", x: (640 - title.width) / 2 + share.x, y: title.y - title.height + share.y, w: share.width, h: share.height });
    }
    else {
      play.attr({
        x: 320 - 80,
        y: play.height / 2 + 8,
        opacity: 0
      });
      share.attr({
        x: 320 + 80,
        y: share.height / 2 + 8,
        opacity: 0
      });
      this.addChild(share);
      this.addChild(play);
      GameManager.setButton({ name: "gs_play", x: play.x, y: play.y, w: play.width, h: play.height });
      GameManager.setButton({ name: "gs_share", x: share.x, y: share.y, w: share.width, h: share.height });
    }
    this.addChild(title);
    title.runAction(ActionManager.GS_TITLE_IN());
    play.runAction(ActionManager.GS_BUTTON_FADE(0.8));
    share.runAction(ActionManager.GS_BUTTON_FADE(1.5));
  }
});