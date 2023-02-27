var GPMainLayer = cc.Layer.extend({
  background: null,
  role: null,
  germ_r: null,
  germ_b: null,
  germ_l: null,
  skill: null,
  hasGerm: false,
  zIndexOrder: {
    germ: 80,
    role: 100
  },
  ctor: function ctor() {
    this._super();
  },
  onEnter: function onEnter() {
    this._super();
    this.registerEvent();
    this.loadBackground();
    this.loadRole();
    this.scheduleUpdate();
    if(getQueryString("skill") != null){
      cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GAME_ADD_SKILL));
    }
  },
  onExit: function onExit() {
    this._super();
  },
  registerEvent: function () {
    let a = cc.EventListener.create({
      event: cc.EventListener.CUSTOM,
      target: this,
      eventName: jf.EventName.GAME_TOUCH,
      callback: this.onGameTouch
    });
    cc.eventManager.addListener(a, this);

    let b = cc.EventListener.create({
      event: cc.EventListener.CUSTOM,
      target: this,
      eventName: jf.EventName.GAME_ADD_SKILL,
      callback: this.onAddSkill
    });
    cc.eventManager.addListener(b, this);
  },
  loadBackground: function () {
    let background = new cc.Sprite(res.background);
    let b = new cc.Node();
    let r = new cc.Node();
    let l = new cc.Node();
    background.attr({
      anchorX: 0,
      anchorY: 1,
      x: 0,
      y: winSize.height
    })
    this.germ_r = r;
    this.germ_b = b;
    this.germ_l = l;
    this.addChild(background);
    this.addChild(b);
    this.addChild(r);
    this.addChild(l);
    this.background = background;
  },
  loadRole: function () {
    let node = new cc.Sprite("#role.png");
    let ice = new cc.Sprite("#ice_mask.png");
    let double = new cc.Sprite("#double_mask.png");
    let strong = new cc.Sprite("#strong_mask.png");
    node.attr({
      anchorX: 0.5,
      anchorY: 0.5,
      x: 320,
      y: winSize.height / 2,
      skill_ice: ice,
      skill_double: double,
      skill_strong: strong,
      skill: false,
      direction: Math.random() > 0.0 ? 1 : -1,
      jump: false,
      touch: false
    });
    ice.attr({
      x: node.width / 2,
      y: node.height / 2,
      opacity: 0
    })
    double.attr({
      x: node.width / 2,
      y: node.height / 2,
      opacity: 0
    })
    strong.attr({
      x: node.width / 2,
      y: node.height / 2,
      opacity: 0
    })
    node.addChild(ice);
    node.addChild(double);
    node.addChild(strong);
    this.role = node;
    this.addChild(node, this.zIndexOrder.role);
  },
  onLoadGerm: function (direction) {
    var that = this;
    var setting = GameManager.getGermSetting(direction);
    var germ = GameManager.getGermLocation(direction);
    var sequence = [];
    germ.forEach((item, index) => {
      let tmp = new cc.Sprite(`#germ_${direction}.png`);
      tmp.attr({
        x: item.x,
        y: item.y,
        id: setting.id,
        type: "germ",
        setting: setting,
        dead: false
      })
      this[`germ_${direction}`].addChild(tmp);
      GameManager.currNode.push(tmp);
      sequence.push(tmp);
    })
    this[`germ_${direction}`].runAction(ActionManager.GP_GERM_MOVE(setting, function () {
      germ.forEach((item, index) => {
        that.onRemoveNode(sequence[index]);
      })
      that[`germ_${direction}`].removeAllChildren();
      if (!v_main.Game_over) {
        let newdirection = direction == "b" ? "b" : direction == "r" ? "l" : "r";
        that.onLoadGerm(newdirection);
      }
    }));
  },
  onJumpRole: function () {
    var role = this.role;
    role.stopAllActions();
    role.jump = true;
    if (role.touch) {
      role.touch = false;
      role.runAction(ActionManager.GP_ROLE_JUMP(role, function () {
        role.runAction(ActionManager.GP_ROLE_JUMP_DOWN(role.direction, -role.y));
        role.jump = false;
      }))
    }
    else {
      role.runAction(ActionManager.GP_ROLE_BACK(role.direction, function () {
        role.runAction(ActionManager.GP_ROLE_DOWN(role.direction, -role.y));
        role.jump = false;
      }))
    }
  },
  onGameTouch: function (event) {
    let self = event.getCurrentTarget();
    if (!self.hasGerm) {
      self.hasGerm = true;
      Math.random() > 0.5 ? self.onLoadGerm("l") : self.onLoadGerm("r");;
      self.onLoadGerm("b");
    }
    self.role.touch = true;
    // self.role.x = v_main.touchX;
    // self.role.y = winSize.height - v_main.touchY;
    self.onJumpRole();
  },
  update: function (dt) {
    if (v_main.canPlay) {
      this.checkCollide();
    }
  },
  checkCollide: function () {
    let that = this;
    let role = this.role;
    let germ = null;
    let a = role.x > 570 && role.direction == 1;
    let b = role.x < 70 && role.direction == -1;
    let c = role.y < 70 && !role.jump;
    let d = role.y > winSize.height - 70 && role.jump;
    if (a || b || c || d) {
      if (c) {
        this.onJumpRole();
      }
      else {
        if (a || b) {
          role.direction = -role.direction;
          if (role.jump) {
            this.onJumpRole();
          }
          else {
            role.stopAllActions();
            role.runAction(ActionManager.GP_ROLE_DOWN(role.direction, -role.y));
          }
        }
        else {
          role.stopAllActions();
          role.runAction(ActionManager.GP_ROLE_DOWN(role.direction, -role.y));
          role.jump = false;
        }
      }
      if((a || b || c) && !v_main.Game_over)
        v_main.Game_score += role.skill != "double" ? GameManager.eachScore : GameManager.eachScore * 2;
    }
    if(!v_main.Game_over){
      for (let i = 0; i < GameManager.currNode.length; i++) {
        germ = GameManager.currNode[i];
        let box = germ.getBoundingBoxToWorld();
        let a = Math.abs(role.x - (box.x + box.width / 2));
        let b = Math.abs(role.y - (box.y + box.height / 2));
        let c = Math.sqrt(Math.pow(b, 2) + Math.pow(a, 2));
        let r = germ.type == "germ" ? 20 : germ.width / 2 - 10;
        if (c < (role.width / 2 + r) && !germ.dead) {
          germ.dead = true;
          if (germ.type == "germ") {
            germ.runAction(ActionManager.GP_GERM_DEAD(germ.setting));
            if (role.skill != "strong") {
              v_main.Game_HP--;
            }
          }
          else {
            germ.stopAllActions();
            germ.runAction(ActionManager.GP_SKILL_DEAD(function () {
              that.onRemoveNode(germ);
              germ.removeFromParent();
            }))
            this.onEatSkill(germ.type);
            this.onAddSkillTips(box, germ.type);
          }
          break;
        }
      }
    }
  },
  onAddSkill: function (event) {
    var that = event.getCurrentTarget();
    let skill = GameManager.getNextSkill();
    let node = new cc.Sprite(`#${skill.type}.png`);
    node.attr({
      x: skill.x,
      y: skill.y,
      opacity: 0,
      type: skill.type,
      dead: false
    });
    node.runAction(ActionManager.GP_SKILL_IN(function () {
      that.onRemoveNode(node);
      node.removeFromParent();
    }));
    that.addChild(node);
    GameManager.currNode.push(node);
  },
  onEatSkill: function (type) {
    var role = this.role;
    switch (type) {
      case "hp":
        v_main.Game_HP++;
        return;
      case "ice":
        cc.director.getScheduler().setTimeScale(GameManager.speed.iceScheduler);
        break;
      case "double":
        v_main.onGoChristmas();
        break;
    }
    role.skill = type;
    role["skill_" + type].runAction(ActionManager.GP_RUN_SKILL(type, function () {
      if (type == "ice") {
        cc.director.getScheduler().setTimeScale(1);
      }
      role.skill = false;
    }));
    winSize.playEffect("skill");
  },
  onAddSkillTips: function (box, type) {
    let word = new cc.Sprite(`#word_${type}.png`);
    word.attr({
      x: 320,
      y: winSize.height / 2
    });
    this.addChild(word);
    word.runAction(ActionManager.GP_ADD_SKILL_TIPS(function () {
      word.removeFromParent();
    }))
  },
  onRemoveNode: function (node) {
    for (let i = 0; i < GameManager.currNode.length; i++) {
      if (node == GameManager.currNode[i]) {
        GameManager.currNode.splice(i, 1);
        break;
      }
    }
  },
  loadDrawNode: function () {
    let drawNode = new cc.DrawNode();
    let postion1 = cc.p(x, y);
    let postion2 = cc.p(x + w, y + h);
    drawNode.drawRect(postion1, postion2, cc.color(255, 255, 0, 255));
    this.baby.addChild(drawNode, this.zIndexOrder.ball);
  }
});
