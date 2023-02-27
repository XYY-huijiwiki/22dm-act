var GPMainLayer = cc.Layer.extend({
  bg: null,
  role: null,
  road: null,
  bridge: null,
  ctor: function () {
    this._super();
  },
  onEnter: function () {
    this._super();
    this.loadBackground();
    this.loadBridge(0);
    this.loadRole();
    this.registerEvent();
    this.scheduleUpdate();
    cc.director.getScheduler().setTimeScale(1);
    v_main.scene = "GamePlayScene";
  },
  onExit: function () {
    this._super();
  },
  registerEvent: function () {
    let a = cc.EventListener.create({
      event: cc.EventListener.CUSTOM,
      target: this,
      eventName: jf.EventName.GAME_JUMP,
      callback: this.onRoleJump
    });
    cc.eventManager.addListener(a, this);

    let b = cc.EventListener.create({
      event: cc.EventListener.CUSTOM,
      target: this,
      eventName: jf.EventName.GAME_STRONG,
      callback: this.onRoleStrong
    });
    cc.eventManager.addListener(b, this);

    let c = cc.EventListener.create({
      event: cc.EventListener.CUSTOM,
      target: this,
      eventName: jf.EventName.GAME_ICE,
      callback: this.onRoleIce
    });
    cc.eventManager.addListener(c, this);
  },
  loadRole: function () {
    let node = new cc.Node();
    let role = new cc.Sprite(`#role_${v_main.roleId}_0.png`);
    let double = new cc.Sprite(`#role_${v_main.roleId}_0.png`);
    let strong = new cc.Sprite(`#protect.png`);
    node.attr({
      x: -role.width,
      y: GameManager.roadBasicY + GameManager.roleOnRoadY,
      cascadeOpacity: true,
      strong: strong,
      drop: false
    });
    role.attr({
      anchorX: 0,
      anchorY: 0,
      jump: 0,
      double: double,
      strong: false
    });
    double.attr({
      anchorX: 0,
      anchorY: 0,
      visible: false
    });
    strong.attr({
      anchorX: 0,
      anchorY: 0,
      x: -110,
      y: -60,
      opacity: 0
    })
    this.role = role;
    node.addChild(role);
    node.addChild(double);
    node.addChild(strong);
    this.addChild(node, 100);
    this.onRoleRush();
    node.runAction(ActionManager.GP_ROLE_IN(role.width + GameManager.beginX, () => {
      v_main.onShowGuide();
    }))
  },
  loadBridge: function (endX) {
    let road = new cc.Node();
    let setting = GameManager.getBridgeSetting(endX);
    let bridge = new cc.Sprite(`#road_${setting.length}.png`);
    bridge.attr({
      anchorX: 0,
      anchorY: 0,
      x: -GameManager.bridgeOffsetX,
      y: 0,
      name: "bridge"
    });
    road.addChild(bridge);
    road.attr({
      width: bridge.width,
      x: setting.x,
      y: setting.y,
      setting: setting
    })
    this.addChild(road);
    this.onBridgeMove(road);
    this.bridge = bridge;
    GameManager.currBridge = GameManager.currBridge.concat(bridge);
    if (!v_main.Game_over) {
      this.loadGold(road);
      this.loadGerm(road);
      this.loadSkill(road);
    }
  },
  loadGerm: function (road) {
    let setting = GameManager.getGermSetting(road);
    if (setting) {
      let germ = new cc.Sprite(`#germ_${setting.type}.png`);
      germ.attr({
        x: setting.x,
        y: setting.y,
        flippedX: setting.flippedX,
        setting: setting
      })
      road.addChild(germ);
      GameManager.currGerm.push(germ);
      if (setting.type == 1)
        germ.runAction(ActionManager.GP_GERM_MOVE(germ));
      if (setting.type == 2)
        germ.runAction(ActionManager.GP_GERM_JUMP(germ));
    }
  },
  loadGold: function (road) {
    let sequence = GameManager.getGoldSetting(road);
    if (sequence) {
      sequence.forEach((item, index) => {
        let g = new cc.Sprite(`#gold_${item.type}.png`);
        g.attr({
          x: item.x,
          y: item.y,
          name: "gold",
          type: item.type
        });
        road.addChild(g);
        GameManager.currGold.push(g);
      })
    }
  },
  loadSkill: function (road) {
    let setting = GameManager.getSkillSetting(road);
    if (setting) {
      let s = new cc.Sprite(`#skill_${setting.type}.png`);
      s.attr({
        x: setting.x,
        y: setting.y,
        type: setting.type,
        name: "skill"
      });
      road.addChild(s);
      GameManager.currSkill.push(s);
    }
  },
  update: function (dt) {
    this.checkBridgeCollide();
    if (v_main.canPlay) {
      this.checkGermCollide();
      this.checkRoleCollide();
      this.checkGoldCollide();
      this.checkSkillCollide();
    }
  },
  checkRoleCollide: function () {
    let role = this.role;
    let roleBox = role.double.getBoundingBoxToWorld();
    let bodyR = roleBox.x + this.role.width + GameManager.footR[v_main.roleId - 1];
    if (role.jump == 0) {
      let upstair = false;
      for (let i = 0; i < GameManager.currBridge.length; i++) {
        let b = GameManager.currBridge[i];
        let bx = b.getBoundingBoxToWorld().x;
        let ex = bx + b.width + GameManager.bridgeR[v_main.roleId - 1];
        if ((bx < bodyR && ex > bodyR)) {
          upstair = true;
          v_main.jump = false;
          break;
        }
      }
      if (!upstair) {
        role.jump = -1;
        if (role.rush)
          role.stopAction(role.rush);
        role.parent.drop = role.parent.runAction(ActionManager.GP_ROLE_DROP(() => {
          this.onGameOver();
        }));
        return;
      }
    }
    else if (role.jump == -1) {
      for (let i = 0; i < GameManager.currBridge.length; i++) {
        let b = GameManager.currBridge[i];
        let bBox = b.getBoundingBoxToWorld();
        let bx = bBox.x;
        let ex = bx + b.width + GameManager.bridgeR[v_main.roleId - 1];
        if (roleBox.y <= (bBox.y + GameManager.roleOnRoadY) && roleBox.y > (bBox.y + GameManager.roleOnRoadY - 20)) {
          if ((bx + GameManager.bridgeL[v_main.roleId - 1] < bodyR && ex > bodyR)) {
            this.onRoleStair();
            break;
          }
        }
      }
    }
  },
  checkGermCollide: function () {
    for (let i = 0; i < GameManager.currGerm.length; i++) {
      let germ = GameManager.currGerm[i];
      let boxA = this.role.getBoundingBoxToWorld();
      let boxB = germ.getBoundingBoxToWorld();
      if (cc.rectOverlapsRect(cc.rect(boxA.x + boxA.width / 2, boxA.y + 10, boxA.width / 2 - 20, boxA.height - 80), cc.rect(boxB.x + 10, boxB.y, boxB.width - 20, boxB.height / 2))) {
        if (!this.role.strong) {
          v_main.Game_HP--;
          winSize.playEffect("germ");
          if (v_main.Game_HP <= 0) {
            this.role.parent.runAction(ActionManager.GP_ROLE_DEAD());
          }
          else {
            this.role.parent.runAction((ActionManager.GP_ROLE_BLINK()));
          }
        }
        germ.runAction(ActionManager.GP_GERM_OUT(() => {
          germ.removeFromParent();
        }));
        this.onRemoveGerm(germ);
        break;
      }
    }
  },
  checkGoldCollide: function () {
    for (let i = 0; i < GameManager.currGold.length; i++) {
      let gold = GameManager.currGold[i];
      let boxA = this.role.getBoundingBoxToWorld();
      let boxB = gold.getBoundingBoxToWorld();
      if (cc.rectContainsPoint(cc.rect(boxA.x, boxA.y, boxA.width, boxA.height), new cc.Point(boxB.x, boxB.y + 20))) {
        v_main.Game_score += gold.type == 0 ? goldScore1 : goldScore2;
        gold.runAction(ActionManager.GP_GOLD_EAT(() => {
          gold.removeFromParent();
        }));
        this.onRemoveGold(gold);
        winSize.playEffect("gold");
        break;
      }
    }
  },
  checkSkillCollide: function () {
    for (let i = 0; i < GameManager.currSkill.length; i++) {
      let skill = GameManager.currSkill[i];
      let boxA = this.role.getBoundingBoxToWorld();
      let boxB = skill.getBoundingBoxToWorld();
      if (cc.rectOverlapsRect(cc.rect(boxA.x, boxA.y, boxA.width, boxA.height), cc.rect(boxB.x, boxB.y, boxB.width, boxB.height))) {
        if (skill.type == 1) {
          v_main.Game_ice++;
        }
        else if (skill.type == 2) {
          v_main.Game_strong++;
        }
        else {
          v_main.Game_HP++;
        }
        skill.runAction(ActionManager.GP_SKILL_EAT(() => {
          skill.removeFromParent();
        }));
        GameManager.skillEat++;
        this.onRemoveSkill(skill);
        winSize.playEffect("skill");
        break;
      }
    }
  },
  checkBridgeCollide: function () {
    if (this.bridge != null) {
      let bridge = this.bridge;
      if (bridge.getBoundingBoxToWorld().x < winSize.width) {
        this.loadBridge(bridge.getBoundingBoxToWorld().x + bridge.width);
      }
    }
  },
  onRoleRush: function () {
    this.role.rush = this.role.runAction(ActionManager.GP_ROLE_RUN());
  },
  onRoleJump: function (event) {
    let self = event.getCurrentTarget();
    let role = self.role;
    role.visible = false;
    role.double.visible = true;
    if (role.jump == 0) {
      if (role.rush)
        role.stopAction(role.rush);
      role.jump = 1;
      role.parent.runAction(ActionManager.GP_ROLE_JUMP(() => {
        role.jump = -1;
        role.parent.drop = role.parent.runAction(ActionManager.GP_ROLE_DROP(() => {
          self.onGameOver();
        }))
      }))
      winSize.playEffect("jump");
      v_main.jump = true;
    }
  },
  onRoleStair: function () {
    let role = this.role;
    if (role.parent.drop)
      role.parent.stopAction(role.parent.drop);
    role.jump = 0;
    role.visible = true;
    role.double.visible = false;
    role.parent.visible = true;
    role.parent.opacity = 255;
    this.onRoleRush();
  },
  onBridgeMove: function (road) {
    road.runAction(ActionManager.GP_BRIDGE_MOVE(road.x + road.width, () => {
      road.children.forEach((item) => {
        if (item.name = "bridge")
          this.onRemoveBridge(item);
        if (item.name = "germ")
          this.onRemoveGerm(item);
        if (item.name = "gold")
          this.onRemoveGold(item);
        if (item.name = "skill")
          this.onRemoveSkill(item);
      });
      road.removeFromParent();
    }));
    if (road.setting.move != 0) {
      road.runAction(ActionManager.GP_BRIDGE_MOVEY(road.setting.move))
    }
  },
  onRoleIce: function (event) {
    let self = event.getCurrentTarget();
    let bg = self.bg;
    if (!bg.ice) {
      bg.ice = true;
      v_main.Game_ice--;
      v_main.ice = true;
      cc.director.getScheduler().setTimeScale(0.7);
      self.runAction(ActionManager.GP_SKILL_TIMER(() => {
        bg.ice = false;
        cc.director.getScheduler().setTimeScale(1);
        v_main.ice = false;
      }))
      winSize.playEffect("ice");
    }
  },
  onRoleStrong: function (event) {
    let self = event.getCurrentTarget();
    let role = self.role;
    if (!role.strong) {
      role.strong = true;
      v_main.Game_strong--;
      role.parent.strong.runAction(ActionManager.GP_SKILL_IN(() => {
        role.strong = false;
      }));
      winSize.playEffect("strong");
    }
  },
  onRemoveBridge: function (item) {
    for (let i = 0; i < GameManager.currBridge.length; i++) {
      if (GameManager.currBridge[i] == item) {
        GameManager.currBridge.splice(i, 1);
        break;
      }
    }
  },
  onRemoveGold: function (item) {
    for (let i = 0; i < GameManager.currGold.length; i++) {
      if (GameManager.currGold[i] == item) {
        GameManager.currGold.splice(i, 1);
        break;
      }
    }
  },
  onRemoveGerm: function (item) {
    for (let i = 0; i < GameManager.currGerm.length; i++) {
      if (GameManager.currGerm[i] == item) {
        GameManager.currGerm.splice(i, 1);
        break;
      }
    }
  },
  onRemoveSkill: function (item) {
    for (let i = 0; i < GameManager.currSkill.length; i++) {
      if (GameManager.currSkill[i] == item) {
        GameManager.currSkill.splice(i, 1);
        break;
      }
    }
  },
  onGameOver: function () {
    v_main.Game_HP = 0;
  },
  loadBackground: function () {
    let background = new cc.Sprite("#gp_bg.jpg");
    background.attr({
      anchorX: 0,
      anchorY: 0,
      x: 0,
      y: 0,
      ice: false
    })
    this.bg = background;
    this.addChild(background);
  }
});