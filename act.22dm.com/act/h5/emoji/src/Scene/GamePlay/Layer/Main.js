var GPMainLayer = cc.Layer.extend({
  backgroundgs: null,
  background: null,
  ctor: function ctor() {
    this._super();
  },
  onEnter: function onEnter() {
    this._super();
    this.loadBackground();
    this.loadMap();
    this.loadTheme();
    this.loadWord();
    this.loadGSMap();
  },
  onExit: function onExit() {
    this._super();
  },
  loadGSMap: function () {
    var that = this;
    let map = v_main.input_map > 0 ? v_main.input_map : 1;
    let node = new cc.Sprite(`#gs_map_${map}.jpg`);
    let role = new cc.Sprite(`#gs_map_${map}_role.png`);
    let y = map == 1 ? 1300 + (1300 - winSize.height) : 1300;
    let speed = map == 1 ? 1.6 : 1;
    node.attr({
      anchorX: 0,
      anchorY: 1,
      x: 0,
      y: y,
      cascadeOpacity: true,
      opacity: 255
    });
    role.attr({
      x: map == 1 ? -320 : 320,
      y: map == 1 ? 730 : 1550,
      opacity : map == 1 ? 255 : 0
    });
    node.addChild(role);
    var callback = new cc.callFunc(() => {
      node.removeFromParent();
      v_main.toDataUrl();
    })
    var action;
    if (map == 1) {
      action = cc.sequence(cc.moveBy(speed, 1280, -550), new cc.callFunc(() => {
        that.loadQRCode();
        node.runAction(cc.sequence(cc.fadeTo(0.3,240),cc.delayTime(0), callback))
      }));
    }
    else {
      action = cc.sequence(cc.spawn(cc.moveBy(speed, 0, -600),cc.fadeIn(speed*0.75)),cc.delayTime(0.3), new cc.callFunc(() => {
        that.loadQRCode();
        node.runAction(cc.sequence(cc.fadeTo(0.3,240),cc.delayTime(0), callback))
      }));
    }
    role.runAction(action);
    winSize.playEffect(`map${map}`);
    this.backgroundgs = node;
    this.addChild(node);
  },
  loadBackground: function () {
    let node = new cc.Sprite("#map_background.jpg");
    node.attr({
      anchorX: 0,
      anchorY: 0,
      x: 0,
      y: 0
    });
    this.background = node;
    this.addChild(node);
  },
  loadMap: function () {
    let map = v_main.input_map > 0 ? v_main.input_map : 1;
    let node = new cc.Sprite(`#map_${map}.png`);
    let reserved = new cc.Sprite(res.reserved);
    node.attr({
      anchorX: 0,
      anchorY: 1,
      x: (640 - node.width) / 2,
      y: 1300 - 70
    });
    reserved.attr({
      anchorX: map ==1 ? 1 : 0.5,
      anchorY: 0,
      x: map==1 ? node.width-5 : node.width/2,
      y: 5
    });
    node.addChild(reserved);
    this.addChild(node);
  },
  loadTheme: function () {
    var node = new cc.Sprite(`#word_${v_main.gender}_${v_main.heart >= 90 ? 2 : 1}.png`);
    node.attr({
      anchorX: 0.5,
      anchorY: 1,
      x: 320,
      y: 1300 - 70 - 852 - 30
    });
    this.addChild(node);
  },
  loadWord: function (theme) {
    let node = new cc.Node();
    let wordlist = (v_main.heart + '').split('');
    let num = [];
    wordlist.forEach(item => {
      num.push(new cc.Sprite(res[`count_${item}`]));
    })
    num.forEach((item, index) => {
      item.attr({
        x: index * 30,
        y: 0,
        scale: 1.2
      });
      node.addChild(item);
    })
    node.attr({
      anchorX: 0,
      anchorY: 0,
      x: 150,
      y: 160
    })
    this.addChild(node);
  },
  loadQRCode: function () {
    var texture2d = new cc.Texture2D();
    texture2d.initWithElement(document.getElementsByTagName("canvas")[1]);
    texture2d.handleLoadedTexture();
    var node = new cc.Sprite(texture2d);
    node.attr({
      anchorX: 0,
      anchorY: 0,
      x: 20,
      y: 43,
      scale: 0.85
    });
    this.ercode = node;
    this.background.addChild(node, 500);
  }
});
