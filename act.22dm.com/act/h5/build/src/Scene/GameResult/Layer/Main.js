var GSMainLayer = cc.Layer.extend({
  theme: 0,
  ctor: function (theme) {
    this._super();
    this.theme = theme;
  },
  onEnter: function () {
    this._super();
    this.loadBackGrouond();
    this.loadMoon();
    this.loadRole();
    this.loadButton();
    v_main.Game_theme = this.theme;
  },
  loadBackGrouond: function () {
    let background = new cc.Sprite(`#gs_bg_${this.theme}.jpg`);
    background.attr({
      anchorX: this.theme == 0 ? 0.5 : 0,
      anchorY: this.theme == 0 ? 0.5 : 0,
      x: this.theme == 0 ? 320 : 0,
      y: this.theme == 0 ? winSize.height / 2 : 0
    });
    this.addChild(background);
  },
  loadMoon: function () {
    let setting = [
      {
        y: 200,
        moonX: 20,
        moonY: -5
      },
      {
        y: 150,
        moonX: -680,
        moonY: -5
      },
      {
        y: 150,
        moonX: 30,
        moonY: 0
      }
    ];
    let moon = new cc.Sprite(`#gs_moon.png`);
    let name = new cc.Sprite(`#gs_name_${this.theme}.png`);
    let seal = new cc.Sprite(GameManager.level<=1 ? `#gs_seal_bad.png` : `#gs_seal.png`);
    moon.attr({
      anchorX: this.theme == 1 ? 0 : 1,
      anchorY: 1,
      x: 640 + setting[this.theme].moonX,
      y: winSize.height + setting[this.theme].moonY + moon.height,
      scale: winSize.scale
    });
    name.attr({
      x: moon.width / 2 - 30,
      y: moon.height / 2 + 30
    });
    seal.attr({
      anchorX: 1,
      anchorY: 1,
      x: name.width + 60,
      y: 60,
      opacity: 0
    });
    name.addChild(seal);
    moon.addChild(name);
    this.addChild(moon);
    moon.runAction(ActionManager.GS_MOON_MOVE(0, 1, 0, -moon.height, function () {
      seal.runAction(ActionManager.GS_SEAL_BLINK())
    }))
  },
  loadRole: function () {
    let setting = [
      {
        y: 270,
        titleX: 5,
        titleY: -60
      },
      {
        y: 220,
        titleX: 0,
        titleY: -20
      },
      {
        y: 80,
        titleX: 100,
        titleY: 165
      }
    ];
    let role = new cc.Sprite(`#gs_role_${this.theme}.png`);
    let title = new cc.Sprite(GameManager.level<=1 ? `#gs_title_3.png`:`#gs_title_${this.theme}.png`);
    role.attr({
      anchorX: this.theme == 2 ? 0 : 0.5,
      anchorY: 0,
      x: this.theme == 2 ? -role.width - 20 : 320 + role.width,
      y: setting[this.theme].y,
      scale: winSize.scale
    });
    title.attr({
      anchorX: 0.5,
      anchorY: 0.5,
      x: role.width / 2 + setting[this.theme].titleX,
      y: setting[this.theme].titleY,
      opacity: 0
    });
    role.addChild(title);
    this.addChild(role);
    role.runAction(ActionManager.GS_MOON_MOVE(1.5, 1, this.theme == 2 ? role.width : -role.width, 0, function () {
      role.runAction(ActionManager.MM_ROLE_FLOAT(2, 0, 20));
      title.runAction(ActionManager.GS_TITLE_IN());
    }.bind(this)))
  },
  loadButton: function () {
    let play = new cc.Sprite(`#btn_replay.png`)
    let share = new cc.Sprite(`#btn_share.png`)
    play.attr({
      x: winSize.width / 2 - 60,
      y: 80,
      opacity: 0
    });
    share.attr({
      x: winSize.width / 2 + 60,
      y: 80,
      opacity: 0
    });
    this.addChild(share);
    this.addChild(play);
    play.runAction(ActionManager.GS_BUTTON_FADE(4.5));
    share.runAction(ActionManager.GS_BUTTON_FADE(5.3));
    GameManager.setButton({ name: "gs_play", x: play.x, y: play.y, w: play.width, h: play.height });
    GameManager.setButton({ name: "gs_share", x: share.x, y: share.y, w: share.width, h: share.height });
  }
});