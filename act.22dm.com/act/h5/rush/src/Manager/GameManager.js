// 游戏管理对象
const goldScore1 = 6;
const goldScore2 = 66;
var GameManager = {
  currBridge: [],
  currGerm: [],
  currGold: [],
  currSkill: [],
  hpMax: 5,
  beginX: 200,
  jumpS: 0.32,
  jumpY: 150,
  footR: [-40, -35],
  bridgeL: [31, 28],
  bridgeR: [0, 0],
  goldScore: [6, 66],
  roadCount: 0,
  roadBasicY: 130,
  roleOnRoadY: 120,
  bridgeMax: 7,
  bridgeMin: 3,
  bridgeStair: 35,
  bridgeSpaceMin: 10,
  bridgeSpaceMax: 80,
  bridgeOffsetX: 92,
  bridgeSpeedEach: 0.28,
  germRamdon: 0.5,
  germSpeedM: 1.5,
  germSpeedJ: 0.4,
  germJumpX: 20,
  germJumpY: 20,
  skillEat: 0,
  skillTotalMax: 20,
  skillRamdon: [0.005, 0.01],
  skilltimer: 10,
  skillMax: 5,
  isAutumm: false,
  reset: function () {
    this.currBridge = [];
    this.currentGerm = [];
    this.currGold = [];
    this.currSkill = [];
    this.roadCount = 0;
    this.skillEat = 0;
    this.jumpY = v_main.roleId == 1 ? 150 : 100;

    this.bridgeMax = 8;
    this.bridgeMin = 3;
    this.germRamdon = 0.5;
    this.bridgeSpaceMin = 10;
    this.bridgeSpaceMax = 80;
    let now = new Date().getTime();
    if (now > Date.parse("2020/06/24 00:00:00") && now < Date.parse("2020/06/28 00:00:00"))
      this.isAutumm = true;
  },
  getBridgeSetting: function (endX) {
    let x = -100, y = this.roadBasicY;
    let length = 15;
    let stair = 0;
    let move = 0;
    if (endX != 0) {
      x = endX + this.getCeilInt(this.bridgeSpaceMax, this.bridgeSpaceMin);
      length = this.getCeilInt(this.bridgeMax, this.bridgeMin);
    }
    if (this.roadCount > 2) {
      stair = this.getCeilInt(1, -1);
      y += stair * this.bridgeStair;
      if (v_main.Game_score >= 6000 && length <= 3 && Math.random() > 0.6) {
        move = this.getCeilInt(30, 50);
      }
    }
    let json = { x: x, y: y, length: length, stair: stair, move: move };
    this.roadCount++;
    //console.log(json)
    return json;
  },
  getGoldSetting: function (road) {
    let sequence = false;
    let hasbest = false;
    if (this.roadCount > 1) {
      let type = 0;
      let w = 80, h = 70;
      let bx = GameManager.getCeilInt(road.width - 200, 150);
      let column = GameManager.getCeilInt((road.width - bx - 50) / w, 2), row = GameManager.getCeilInt(2, 1);
      let by = GameManager.getCeilInt(winSize.height - (road.y + row * h), 230);
      sequence = [];
      for (let i = 0; i < column; i++) {
        type = 0;
        for (let j = 0; j < row; j++) {
          let x = bx + i * w;
          let y = by + j * h;
          if (j != 0 && this.isAutumm && !hasbest && Math.random() < 0.05) {
            hasbest = true;
            type = 1;
          }
          sequence.push({ x: x, y: y, type: type });
        }
      }
    }
    return sequence;
  },
  getSkillSetting: function (road) {
    let json = false;
    let ra = (this.skillTotalMax - this.skillEat) / this.skillTotalMax;
    if (this.roadCount > 5 && Math.random() < this.skillRamdon[v_main.roleId - 1] * ra) {
      let type = this.getCeilInt(2, 1);
      if (type == 1 && v_main.Game_ice < this.skillMax || type == 2 && v_main.Game_strong < this.skillMax || type == 3 && v_main.Game_HP < this.hpMax) {
        let minx = 100;
        let maxx = road.width - 100;
        let x = GameManager.getCeilInt(maxx, minx);
        let y = 145;
        json = { type: type, x: x, y: y };
      }
    }
    return json;
  },
  getGermSetting: function (road) {
    let json = false;
    if (road.setting.length > 2 && this.roadCount > 2 && Math.random() < this.germRamdon) {
      let type = this.getCeilInt(3, 1);
      let minx = 200;
      let maxx = road.width - minx;
      let x = GameManager.getCeilInt(maxx, minx + 200);
      let y = 145;
      let flippedX = false;
      json = { x: x, y: y, type: type, flippedX: flippedX, minx: minx, maxx: maxx };
    }
    return json;
  },
  getCeilInt: function (max, min) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
};