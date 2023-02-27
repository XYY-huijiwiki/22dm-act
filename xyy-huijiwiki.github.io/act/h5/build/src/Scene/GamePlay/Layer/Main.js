var GPMainLayer = cc.Layer.extend({
  background: null,
  moon: null,
  floor: null,
  rope: null,
  arrivalY: null,
  rail: null,
  bat: null,
  sweet: null,
  ctor: function () {
    this._super();
  },
  onEnter: function () {
    this._super();
    this.registerEvent();
    this.loadBackgound();
    this.loadMoon();
    this.loadFloor();
    this.loadRope();
  },
  onExit: function () {
    this._super();
  },
  registerEvent: function () {
    var a = cc.EventListener.create({
      event: cc.EventListener.CUSTOM,
      target: this,
      eventName: jf.EventName.GP_TOUCH,
      callback: this.onGameTouch
    });
    cc.eventManager.addListener(a, this);
    var b = cc.EventListener.create({
      event: cc.EventListener.CUSTOM,
      target: this,
      eventName: jf.EventName.GP_ROPE_START,
      callback: this.onRopeSway
    });
    cc.eventManager.addListener(b, this);
  },
  onGameTouch: function (event) {
    let self = event.getCurrentTarget();
    if (self.rope.house) {
      self.onDropHouse();
    }
  },
  onRopeSway: function (event) {
    let self = event.getCurrentTarget();
    self.rope.runAction(ActionManager.GP_ROPE_SWAY(self.rope));
    self.rope.runAction(ActionManager.GP_ROPE_MOVE());
    if (GameManager.level >= GameManager.levelMove)
      self.floor.runAction(ActionManager.GP_HOUSE_MOVE());
  },
  loadBackgound: function () {
    let background = new cc.Sprite("#background.jpg");
    background.attr({
      anchorX: 0,
      anchorY: 0,
      x: 0,
      y: 0
    })
    this.addChild(background, 0);
    this.background = background;
  },
  loadMoon: function () {
    let moon = new cc.Sprite("#moon.png");
    let offsetY = 100;
    moon.attr({
      anchorX: 1,
      anchorY: 1,
      x: 640,
      y: winSize.height + offsetY,
      scale: winSize.scale,
      offsetY: offsetY
    })
    this.addChild(moon, 10);
    this.moon = moon;
  },
  loadFloor: function () {
    let floor = new cc.Node();
    let house = new cc.Sprite("#floor.png");
    floor.attr({
      anchorX: 0,
      anchorY: 0,
      x: 0,
      y: -GameManager.anchor.floorAnchorY * floor.height,
      moveY: 0,
      house: house
    })
    house.attr({
      anchorX: 0,
      anchorY: 0,
      x: -150,
      y: 0
    });
    this.addChild(floor, 100);
    this.floor = floor;
    floor.addChild(house, 1000);
    this.resetRail(floor);
  },
  loadRope: function () {
    let rope = new cc.Sprite("#rope.png");
    rope.attr({
      anchorX: 0.5,
      anchorY: GameManager.anchor.ropeAnchorY,
      x: 320,
      y: winSize.height,
      direction: -0.5
    })
    this.rope = rope;
    this.addChild(rope, 500);
    this.onAddRopeHouse();
  },
  onAddRopeHouse: function () {
    let setting = GameManager.getNextHouse();
    let h = new cc.Sprite(`#h_${setting.type}.png`);
    h.attr({
      anchorX: 0.5,
      anchorY: 1,
      x: this.rope.width / 2,
      y: 15,
      type: setting.type,
      id: setting.id
    })
    this.rope.house = h;
    this.rope.addChild(h);
  },
  onDropHouse: function () {
    let h = this.rope.house;
    let box = h.getBoundingBoxToWorld();
    this.onLoadWorldHouse(h.type, box, this.rope.rotation);
    h.removeFromParent();
    this.rope.house = false;
  },
  onLoadWorldHouse: function (type, box, rotation) {
    let h = new cc.Sprite(`#h_${type}.png`);
    h.attr({
      anchorX: 0.5,
      anchorY: 0.5,
      x: box.x + box.width / 2 - (150 - Math.abs(this.floor.house.getBoundingBoxToWorld().x)),
      y: box.y + box.height / 2 - this.floor.getBoundingBoxToWorld().y,
      rotation: rotation,
      arrival: false,
      build: false
    })
    let deltaX = this.rope.direction * 20 * GameManager.speed * Math.abs(rotation / GameManager.maxRotation);
    let deltaY = -((box.y + box.height / 2 - h.height / 2) - this.arrivalY);
    let setting = { deltaX: deltaX.toFixed(2) * 1, deltaY: deltaY.toFixed(2) * 1, rotation: -rotation.toFixed(2) * 1 };
    h.runAction(ActionManager.GP_HOUSE_DROP(setting, function () {
      h.arrival = true;
      GameManager.currHousePool.unshift(h);
      this.getArrivalAnchor(h);
    }.bind(this)));
    this.floor.addChild(h, -1 * GameManager.count);
  },
  resetRail: function (node) {
    if (this.rail != null)
      this.rail.removeFromParent();
    let box = node.getBoundingBoxToWorld();
    box.y = box.y + box.height + (GameManager.currHousePool.length == 0 ? -80 : GameManager.railHouseOffsetY);
    box.height = 0.5;
    this.arrivalY = box.y;
    v_main.Game_housed = GameManager.currHousePool.length;
    //this.rail = v_main.debug ? this.drawRect(box) : null;
  },
  drawRect: function (box) {
    let drawNode = new cc.DrawNode();
    drawNode.drawRect(cc.p(box.x, box.y), cc.p(box.x + box.width, box.y + box.height), cc.color(255, 255, 0, 255));
    this.addChild(drawNode, 10000);
    return drawNode;
  },
  getArrivalAnchor: function (upper) {
    var nether = GameManager.getNetherHouse(upper);
    var upperbox = upper.getBoundingBoxToWorld();
    var fail = false;
    var netherbox;
    if (nether) {
      netherbox = nether.getBoundingBoxToWorld();
      let C1 = upperbox.x + upperbox.width / 2;
      let C2 = netherbox.x + netherbox.width / 2;
      let differX = Math.abs(C1 - C2);
      let faultAllow = netherbox.width / (upperbox.width-5 > netherbox.width? 9 : 15);
      if (differX <= faultAllow) {
        v_main.Game_score += GameManager.score.best;
        upper.direction = 0;
        this.onLoadSweet(upperbox);
        this.onLoadMiss(upperbox, "perfect");
      }
      else if (upperbox.x < netherbox.x) {
        if (!GameManager.isHouseOverStep(differX, upperbox,netherbox)) {
          v_main.Game_score += GameManager.score.normal;
        }
        else {
          upper.direction = -1;
          fail = true;
        }
      }
      else {
        differX = (upperbox.x + upperbox.width) - (netherbox.x + netherbox.width);
        if (differX< 0) {
          v_main.Game_score += GameManager.score.normal;
        }
        else if(!GameManager.isHouseOverStep(differX, upperbox,netherbox)){
          v_main.Game_score += GameManager.score.normal;
        }
        else {
          upper.direction = 1;
          fail = true;
        }
      }
    }
    else {
      netherbox = this.floor.house.getBoundingBoxToWorld();
      let houseL = netherbox.x + 220;
      let houseR = netherbox.x + 690;
      let dropX = upperbox.x + upperbox.width / 2;
      if (Math.abs(dropX - (netherbox.x + 470)) < 20) {
        v_main.Game_score += GameManager.score.best;
        upper.direction = 0;
        this.onLoadSweet(upperbox);
        this.onLoadMiss(upperbox, "perfect");
      }
      else if (upperbox.x < houseL) {
        if (upperbox.x > houseL) {
          v_main.Game_score += GameManager.score.normal;
        }
        else {
          upper.direction = -1;
          fail = true;
        }
      }
      else {
        if (upperbox.x + upperbox.width < houseR) {
          v_main.Game_score += GameManager.score.normal;
        }
        else {
          upper.direction = 1;
          fail = true;
        }
      }
    }
    if (fail) {
      this.onFailHouse(upper, 0);
      this.onLoadMiss(upperbox, "miss");
    }
    else {
      this.checkDistance();
    }
  },
  onFailHouse: function (house) {
    v_main.Game_HP--;
    house.runAction(ActionManager.GP_HOUSE_FAIL(house.direction, function () {
      this.removeHouse(house);
      if (!v_main.Game_over)
        this.onAddRopeHouse();
      else
        this.rope.visible = false;
    }.bind(this)));
  },
  checkDistance: function () {
    if (GameManager.currHousePool.length == GameManager.currLevelMaxHouse) {
      this.rope.visible = false;
      v_main.Game_housed = GameManager.currHousePool.length
      v_main.Game_nextlevel();
      return;
    }
    let upper = GameManager.currHousePool[0];
    let distance = this.calcDistance(upper);
    if (distance.move) {
      let duration = Math.abs(0.5 * (distance.move / 300));
      this.floor.runAction(ActionManager.GP_FLOOR_MOVE(distance.move, duration, function () {
        this.floor.moveY += distance.move;
        this.resetRail(upper);
        this.onAddRopeHouse();
      }.bind(this)));
      var surplus = this.background.height - winSize.height + this.background.y;
      let moveY = surplus / GameManager.currLevelMaxHouse;
      moveY > 30 ? 15 : moveY;
      if (surplus - moveY > 0) {
        this.background.runAction(ActionManager.GP_BG_MOVE(-moveY, duration));
        this.onLoadBat();
        if (this.moon.y > winSize.height - 10) {
          this.moon.runAction(ActionManager.GP_BG_MOVE(-3, duration));
        }
      }
    }
    else {
      this.resetRail(upper);
      this.onAddRopeHouse();
    }
  },
  calcDistance: function (house) {
    let upper = house.getBoundingBoxToWorld();
    let aY = (upper.y + upper.height);
    let bY = this.rope.getBoundingBoxToWorld().y - GameManager.maxHouseHeight;
    let differ = Math.abs(bY - aY).toFixed(1) * 1;
    let distance = { move: differ < GameManager.emptyY2 ? (differ - GameManager.emptyY2).toFixed(1) * 1 : 0, aY: aY.toFixed(1) * 1, bY: bY.toFixed(1) * 1, differ: differ }
    //console.log(distance);
    return distance;
  },
  onLoadBat: function () {
    if (this.bat == null) {
      let bat = new cc.Sprite(`#bat.png`);
      let offsetY = Math.random() * 350;
      let duration = Math.random() * 5 + 2;
      let rotation = Math.random() * -35;
      bat.attr({
        x: 640 + bat.width,
        y: winSize.height / 2,
        rotation: rotation
      });
      this.addChild(bat, 50);
      this.bat = bat;
      bat.runAction(ActionManager.GP_BAT_FLY(duration, -640 - bat.width * 2, offsetY, function () {
        bat.removeFromParent();
        this.bat = null;
      }.bind(this)));
    }
  },
  onLoadSweet: function (box) {
    if (this.sweet == null) {
      let xi = new cc.Sprite(`#sweet_xi.png`);
      let mei = new cc.Sprite(`#sweet_mei.png`);
      let lan = new cc.Sprite(`#sweet_lan.png`);
      let x = [Math.random() * 150 + 50];
      lan.attr({
        x: Math.random() * 150 + 50,
        y: winSize.height + lan.height / 2
      });
      xi.attr({
        x: Math.random() * 50 + 300,
        y: winSize.height + xi.height / 2
      });
      mei.attr({
        x: Math.random() * 100 + 500,
        y: winSize.height + mei.height / 2
      });
      this.addChild(lan, 2000);
      this.addChild(xi, 2000);
      this.addChild(mei, 2000);
      let delay = [Math.random(), Math.random(), Math.random()];
      let duration = Math.random() + 1.3;
      let deltaY = -winSize.height - 100;
      this.sweet = lan;
      lan.runAction(ActionManager.GP_SWEET_FLY(delay[0], duration + delay[0], Math.random() * 70, deltaY, function () {
        lan.removeFromParent();
        this.sweet = null;
      }.bind(this)));
      xi.runAction(ActionManager.GP_SWEET_FLY(delay[1], duration + delay[1], 0, deltaY, function () {
        xi.removeFromParent();
      }));
      mei.runAction(ActionManager.GP_SWEET_FLY(delay[2], duration + delay[2], -Math.random() * 70, deltaY, function () {
        mei.removeFromParent();
      }));
    }
  },
  onLoadMiss: function (box, type) {
    let node = new cc.Sprite(`#${type}.png`);
    node.attr({
      x: box.x + box.width / 2,
      y: box.y + (type == "perfect" ? 100 : 0)
    })
    this.addChild(node, 500);
    node.runAction(ActionManager.GP_ON_MISS(() => {
      node.removeFromParent();
    }));
    v_main[`Game_${type}`]++;
    winSize.playEffect(type == "perfect" ? "perfect" : "dead");
  },
  removeHouse: function (house) {
    for (var i = 0; i < GameManager.currHousePool.length; i++) {
      if (GameManager.currHousePool[i] == house) {
        GameManager.currHousePool.splice(i, 1);
        house.removeFromParent();
      }
    }
  }
});