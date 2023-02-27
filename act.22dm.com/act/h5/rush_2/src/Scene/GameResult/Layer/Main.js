var GSMainLayer = cc.Layer.extend({
  thitle: null,
  ctor: function () {
    this._super();
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
    color = new cc.Sprite(`#color_${v_main.Game_theme}.png`);
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
    let role = new cc.Sprite(`#gs_${v_main.roleId}_${v_main.Game_theme}.png`);
    let title = new cc.Sprite(`#theme_${v_main.Game_theme}.png`);
    let word = new cc.Sprite(`#word_${v_main.Game_theme}.png`);
    let locationX = [
      [-180, 220, 190],
      [-200, 200, 180],
      [-200, 200, 160]
    ]
    let bx = locationX[v_main.roleId - 1][v_main.Game_theme - 1];
    role.attr({
      x: color.width / 2 + bx,
      y: color.height + role.height - 10,
      opacity: 0
    });
    title.attr({
      anchorX: bx > 0 ? 1 : 0,
      anchorY: 0,
      x: role.x + ((title.width + 40) / 2) * (bx > 0 ? -1 : 1),
      y: 170,
      cascadeOpacity: true,
      opacity: 0
    });
    word.attr({
      anchorX: 0.5,
      anchorY: 0,
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
      y: color.height - 12
    });
    color.addChild(bg);
  }
});