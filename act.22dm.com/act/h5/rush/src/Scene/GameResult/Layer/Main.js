var GSMainLayer = cc.Layer.extend({
  thitle: null,
  ctor: function (theme) {
    this._super();
    this.theme = theme;
  },
  onEnter: function () {
    this._super();
    this.loadBackground();
    this.loadColor();
  },
  loadBackground: function () {
    let bg = new cc.Sprite(res.public_bg);
    bg.attr({
      x: winSize.width / 2,
      y: winSize.height / 2
    });
    this.addChild(bg);
  },
  loadColor: function () {
    let color;
    if (v_main.Game_theme == 1)
      color = new cc.Sprite(`#color_1.png`);
    else
      color = new cc.Sprite(`#color_${v_main.roleId}_${v_main.Game_theme}.png`);
    color.attr({
      x: winSize.width / 2,
      y: winSize.height / 2,
      scale: winSize.width > color.width ? 1 : winSize.width / color.width
    });
    this.loadScore(color);
    this.loadRole(color);
    this.addChild(color);
  },
  loadRole: function (color) {
    let type = v_main.roleId == 1 ? 'x' : 'z';
    let node = new cc.Node();
    let role = new cc.Sprite(`#gs_${type}yy_${v_main.Game_theme}.png`);
    let title = new cc.Sprite(`#theme_${v_main.Game_theme}.png`);
    let word = new cc.Sprite(`#word_${v_main.Game_theme}.png`);
    let locationX = {
      xyy: [-180, -200, 210],
      zyy: [-230, 200, -220]
    }
    let bx = locationX[type + "yy"][v_main.Game_theme - 1];
    let tx = v_main.roleId == 1 ? 50 : 10;
    role.attr({
      x: color.width / 2 + bx,
      y: color.height + role.height,
      opacity: 0
    });
    title.attr({
      anchorX: bx > 0 ? 1 : 0,
      anchorY: 0,
      x: role.width + (bx > 0 ? -tx : tx),
      y: 170,
      cascadeOpacity: true,
      opacity: 0
    });
    word.attr({
      anchorX : 0.5,
      anchorY : 0,
      x: title.width / 2,
      y: -50
    });
    node.addChild(role);
    title.addChild(word);
    node.addChild(title);
    color.addChild(node);
    role.runAction(ActionManager.GS_ROLE_DOWN(-(role.height + color.height / 2 + 15), () => {
      title.runAction(ActionManager.GS_TITLE_FADEIN());
      role.runAction(v_main.Game_theme < 2 ? ActionManager.GS_ROLE_BLINK() : ActionManager.GS_ROLE_FLOAT())
      word.runAction(ActionManager.GS_WORD_ROTATE());
      v_main.scene = "GameResultScene";
    }))
  },
  loadScore: function (color) {
    let bg = new cc.Sprite(`#gs_score_${v_main.Game_theme}.png`);
    bg.attr({
      anchorX: 0,
      anchorY: 1,
      x: 18,
      y: color.height + 5
    });
    color.addChild(bg);
  }
});