// 游戏管理对象
var GameManager = {
  level: 0,
  speed: 0.8,
  count: 1,
  emptyY: 600,
  emptyY2: 250,
  levelHouse: [5, 5, 8, 10, 12, 15, 18, 20, 25, 30, 35, 40, 50, 80, 99],
  score: { best: 50, normal: 30, soso: 10 },
  maxHouseHeight: 169,
  maxRotation: 8,
  anchor: { ropeAnchorY: 0, floorAnchorY: 0 },
  railHouseOffsetY: -12,
  currLevelMaxHouse: 5,
  currHousePool: [],
  levelEnterTime: 3000,
  levelMove: 3,
  calcAnchor: function () {
    let rope = 346;
    let floor = 474;
    let minfloor = 120;
    let minHeight = rope + this.maxHouseHeight + floor + this.emptyY;
    let anchor = { ropeAnchorY: 0.5, floorAnchorY: 0 };
    let differ = minHeight - winSize.height;
    if (differ > 0) {
      let ropeb = differ > 170 ? 170 : differ;
      let floorb = (differ - ropeb) > minfloor ? minfloor : (differ - ropeb);
      if (differ - ropeb - floorb > 0) {
        ropeb += (differ - ropeb - floorb) > 50 ? 50 : (differ - ropeb - floorb);
        floorb = (differ - ropeb) > minfloor ? minfloor : (differ - ropeb);
      }
      anchor.ropeAnchorY = (1 - (ropeb / rope)).toFixed(3) * 1;
      anchor.floorAnchorY = (floorb / floor).toFixed(3) * 1;
    }
    this.anchor = anchor;
  },
  nextLevel: function () {
    this.currHousePool = [];
    this.level++;
    this.cantype = [1];
    v_main.Game_level = this.level;
    v_main.canPlay = false;
    if (this.level > 1) {
      this.currLevelMaxHouse = this.levelHouse[this.level >= this.levelHouse.length - 1 ? this.levelHouse.length - 1 : this.level];
      this.speed -= this.speed > 0.5 ? 0.05 : 0;
      this.maxRotation += this.maxRotation < 12 ? 0.5 : 0;
      for (var i = 2; i < 5; i++) {
        if (this.level >= i) {
          this.cantype.push(i);
        }
      }
      v_main.Game_houseneed = this.currLevelMaxHouse;
      v_main.active = "level";
    }
  },
  getNextHouse: function () {
    let h = {};
    h.type = this.currHousePool.length >= this.currLevelMaxHouse - 1 ? 5 : this.cantype[Math.floor(Math.random() * (this.cantype.length - 1))];
    h.id = this.count++;
    return h;
  },
  getNetherHouse: function (upper) {
    for (var i = 0; i < this.currHousePool.length; i++) {
      if (this.currHousePool[i] == upper && i != this.currHousePool.length - 1) {
        return this.currHousePool[i + 1];
      }
    }
    return false;
  },
  isHouseOverStep: function (differX, upperbox, netherbox) {
    if (differX / netherbox.width < 0.15) {
      return false;
    }
    return true;
  },
  reset: function () {
    this.level = getQueryString("level") != null ? getQueryString("level") * 1 : 0;
    this.speed = 0.8;
    this.maxRotation = 8;
    this.count = 1;
    this.nextLevel();
    this.calcAnchor();
    //console.log(this);
  },
  setButton: function (setting) {
    if (setting) {
      $("#" + setting.name).css({
        width: setting.w,
        height: setting.h,
        top: winSize.height - setting.y - setting.h / 2,
        left: setting.x - setting.w / 2
      });
    }
  }
};