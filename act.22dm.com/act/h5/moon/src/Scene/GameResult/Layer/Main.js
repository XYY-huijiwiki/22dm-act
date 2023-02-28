var GSMainLayer = cc.Layer.extend({
  data: { type: "g" },
  role: null,
  wallscale : 1,
  ctor: function (data) {
    this._super();
    this.data = data;
  },
  onEnter: function () {
    this._super();
    let type = this.data.type;
    this.loadRole(type);
    this.loadErcode();
    this.loadReserved();
  },
  loadRole: function (type) {
    let role = new cc.Sprite(`#gs_r_${type}.png`);
    let mask = new cc.Sprite(`#gs_w_mask.png`);
    let word = new cc.Sprite(`#gs_w_${type}.png`);
    let offsetTitleX = 30;
    let offsetMapXRight = 50;
    let offsetMapXLeft = 80;
    this.wallscale = winSize.width/(role.width+mask.width+offsetTitleX+offsetMapXRight+offsetMapXLeft);
    role.attr({
      anchorX : 0,
      anchorY : 0.5,
      x: offsetMapXRight,
      y: 320 + 640,
      scale: this.wallscale,
      opacity : 255
    });
    mask.attr({
      anchorX: 0,
      anchorY: 0.5,
      cascadeOpacity: true,
      x: role.width + offsetTitleX,
      y: role.height/2 ,
      opacity : 0
    });
    word.attr({
      x: mask.width / 2,
      y: mask.height / 2 + 10
    });

    this.role = role;
    role.addChild(mask);
    mask.addChild(word);
    this.loadButton(mask);
    this.addChild(role);
    mask.runAction(ActionManager.GS_TITLE_IN(function(){
      v_main.toDataUrl();
    }.bind(this)));
    role.runAction(ActionManager.GS_ROLE_DOWN(-640));
  },
  loadButton: function (mask) {
    let title = new cc.Sprite("#gs_w_title.png");
    let share = new cc.Sprite(res.btn_share);
    let replay = new cc.Sprite(res.btn_replay);
    title.attr({
      anchorX : 0,
      anchorY : 0,
      x : 0 - 12,
      y : mask.height + 10
    });
    share.attr({
      x: mask.width / 2 - share.width / 2 - 10,
      y: 0 - 8,
      opacity:0
    });
    replay.attr({
      x: mask.width / 2 + replay.width / 2 + 10,
      y: 0 - 8,
      opacity:0
    });
    mask.addChild(title);
    mask.addChild(share);
    mask.addChild(replay);
    GameManager.setButton({ name: "gs_share", s : this.wallscale,x: share.getBoundingBoxToWorld().x+share.width/2, y: share.getBoundingBoxToWorld().y-640+share.height/2*this.wallscale, w: share.width, h: share.height});
    GameManager.setButton({ name: "gs_replay", s : this.wallscale,x: replay.getBoundingBoxToWorld().x+replay.width/2, y: replay.getBoundingBoxToWorld().y-640+replay.height/2*this.wallscale, w: replay.width, h: replay.height});
  },
  loadErcode: function () {
    let ercode = new cc.Sprite(res.ercode);
    ercode.attr({
      anchorX: 1,
      anchorY: 0,
      x: winSize.width - 25,
      y: 25,
      scale: 0.8
    });
    this.addChild(ercode);
  },
  loadReserved: function () {
    let reserved = new cc.Sprite(res.reserved);
    reserved.attr({
      x: winSize.width / 2,
      y: 20
    });
    this.addChild(reserved);
  }
});