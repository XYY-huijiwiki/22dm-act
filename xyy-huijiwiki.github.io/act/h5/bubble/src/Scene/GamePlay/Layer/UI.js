var GPUILayer = cc.Layer.extend({
  bottomBar: null,
  topBar: null,
  scoreText: null,
  timerText: null,
  HP: [],
  skillText: [],
  ctor: function () {
    this._super();
  },
  onEnter: function () {
    this._super();
    this.loadTopLayer();
  },
  onExit: function () {
    this._super();
  },
  loadTopLayer: function () {
    let background = new cc.Sprite("#score_bg.png");
    let score = new cc.Sprite("#score.png");
    background.attr({
      anchorX: 0,
      anchorY: 1,
      x: 0,
      y: winSize.height
    })
    score.attr({
      x: score.width / 2 + 20,
      y: background.height / 2
    })
    background.addChild(score);
    this.addChild(background);
  }
});

