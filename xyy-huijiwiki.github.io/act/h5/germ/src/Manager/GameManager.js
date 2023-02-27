// 游戏管理对象
var GameManager = {
  currNode: [],
  eachScore: 100,
  speed: {
    iceScheduler: 0.5,
    jumpDuration: 1.65,
    backDuration: 1.65,
    jumpX: 320,
    jumpY: winSize.height,
    jumpDownX: 320,
    skillDuration: 5,
    skillEffect: { ice: 2.5, hp: 0, double: 5, strong: 5 },
    germIn: 0.25,
    germout: 0.25,
    germNextTime: 2.2,
    germDead: 0.3
  },
  germ: {
    id: 0,
    width: 69,
    height: 106,
    space: 10,
    count: 1,
    maxcount : 7,
    neighbour: 0.7
  },
  getGermSetting: function (direction) {
    let json = {};
    json.deltaX = direction == "b" ? 0 : direction == "l" ? this.germ.height : -this.germ.height;
    json.deltaY = direction != "b" ? 0 : this.germ.height;
    json.delayNext = this.speed.germNextTime;
    json.durationIn = this.speed.germIn;
    json.durationOut = this.speed.germout;
    json.id = this.germ.id++;
    v_main.Game_germ++;
    return json;
  },
  getGermLocation: function (direction) {
    var germ = [], location = [];
    var count = this.germ.count;
    count = (direction == "b" && count > 5) ? 5 : count;
    var min = direction == "b" ? this.germ.width / 2 + 20 : this.germ.height + this.germ.width / 2;
    var max = (direction == "b" ? 620 : winSize.height - 120);
    if (Math.random() > this.germ.neighbour) {
      max = (direction == "b" ? 620 : winSize.height - 120) - this.germ.width / 2 - (count - 1) * (this.germ.width + this.germ.space);
      location.push(this.getRandomIndex(min, max));
      for (let i = 1; i < count; i++) {
        location.push(location[0] + i * (this.germ.width + this.germ.space));
      }
    }
    else {
      location.push(this.getRandomIndex(min, max));
      location = this.getNeighbourLocation(direction, location, count, min, max);
    }
    for (let i = 0; i < location.length; i++) {
      let item = {};
      item.x = direction == "b" ? location[i] : direction == "r" ? 640 + this.germ.height / 2 : -this.germ.height / 2;
      item.y = direction == "b" ? -this.germ.height / 2 : location[i];
      germ.push(item);
    }
    return germ;
  },
  getNeighbourLocation: function (direction, location, count, min, max) {
    let ccc = 0;
    while (location.length < count) {
      let canAdd = true;
      let tmp = this.getRandomIndex(min, max);
      location.forEach(item => {
        if (Math.abs(item - tmp) < this.germ.space + this.germ.width) {
          canAdd = false;
        }
      });
      if (canAdd) {
        location.push(tmp);
      }
      ccc++;
      if (ccc >= 1000)
        break;
    }
    // 死循环了
    if (ccc >= 1000) {
      location = [];
      max = (direction == "b" ? 620 : winSize.height - 120) - this.germ.width / 2 - (count - 1) * (this.germ.width + this.germ.space);
      location.push(this.getRandomIndex(min, max));
      for (let i = 1; i < count; i++) {
        location.push(location[0] + i * (this.germ.width + this.germ.space));
      }
    }
    return location;
  },
  getNextSkill: function () {
    let skill = {};
    let sequence = [];
    if (v_main.Game_HP < 5) {
      sequence.push("hp");
    }
    sequence.push("strong");
    sequence.push("double");
    sequence.push("ice");
    skill.type = sequence[this.getRandomIndex(0, sequence.length - 1)];
    skill.x = this.getRandomIndex(200, 400);
    skill.y = this.getRandomIndex(300, winSize.height - 300);
    if(getQueryString("skill") != null){
      skill.type = getQueryString("skill");
    }
    return skill;
  },
  getRandomIndex: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
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
  },
  reset: function () {
    this.currNode = [];
    this.germ.id = 0;
    this.germ.count = 2;
  }
};