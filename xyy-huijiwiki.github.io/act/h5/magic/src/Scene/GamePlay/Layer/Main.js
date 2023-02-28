var GPMainLayer = cc.Layer.extend({
  baby: null,
  car: null,
  light : null,
  lighting : 0,
  rocker: null,
  hand: null,
  exit: null,
  balls : [],
  touchX: 0,
  touchEnd: 0,
  touchMax: false,
  zIndexOrder: {
    part2: 10,
    car: 15,
    ball: 20,
    tube1: 40,
    carfall: 50,
    tube2: 60,
    part1: 70,
    carangle: 80,
    light: 100,
    part3: 110,
    hand: 120,
    exit: 125,
    part4: 130,
    rocker: 140
  },
  ctor: function ctor() {
    this._super();
  },
  onEnter: function onEnter() {
    this._super();
    this.registerEvent();
    this.loadBackground();
    this.loadBaby();
    this.onLighting();
  },
  onExit: function onExit() {
    this._super();
  },
  registerEvent: function () {
    let b = cc.EventListener.create({
      event: cc.EventListener.CUSTOM,
      target: this,
      eventName: jf.EventName.GAME_HAND,
      callback: this.onGameHand
    });
    cc.eventManager.addListener(b, this);
    document.getElementById("rocker").addEventListener("touchstart", function (event) {
      this.touchX = event.touches[0].clientX;
    }.bind(this));
    document.getElementById("rocker").addEventListener("touchmove", function (event) {
      let delta = event.touches[0].clientX - this.touchX;
      let tr = this.rocker.rotation + delta / 8;
      if (Math.abs(tr) < GameManager.maxRotationRocker) {
        this.rocker.rotation = tr;
        let direction = tr > 0 ? 1 : -1;
        if (!v_main.gamerun) {
          if (direction != this.car.direction) {
            this.onCarMove(direction);
          }
        }
      }
      this.touchX = event.touches[0].clientX;
    }.bind(this));
    document.getElementById("rocker").addEventListener("touchend", function (event) {
      this.rocker.rotation = 0;
      if(!v_main.gamerun){
        this.car.stopAllActions();
        this.car.footl.stopAllActions();
        this.car.footr.stopAllActions();
        this.car.footr.rotation = 0;
        this.car.footr.rotation = 0;
        this.car.move = false;
        this.car.direction = 0;
      }
    }.bind(this));
  },
  loadBackground: function () {
    let floor = new cc.Sprite(`#floor.png`);
    let rows = [];
    for(let i=0;i<Math.ceil(winSize.height/112);i++){
      rows.push(new cc.Sprite(`#rows.jpg`));
    }
    floor.attr({
      anchorX: 0,
      anchorY: 0,
      x: 0,
      y: 0
    });
    rows.forEach((item,index) => {
      item.attr({
        anchorX: 0,
        anchorY: 1,
        x: 0,
        y: winSize.height - 112 * index
      });
      this.addChild(item);
    })
    this.addChild(floor);
  },
  loadBaby: function () {
    let baby = new cc.Node();
    baby.attr({
      x: 320,
      y: winSize.height / 2,
      scale: winSize.scale
    })
    this.baby = baby;
    this.loadBabyBackground();
    this.loadBalls();
    this.loadTube();
    this.loadCar();
    this.loadLight();
    this.loadRocker();
    this.loadHand();
    this.loadBottom();
    this.loadCarTop();
    this.addChild(baby, 100);
  },
  loadBabyBackground : function(){
    let part1 = new cc.Sprite("#baby_1.png");
    let part2 = new cc.Sprite("#baby_2.png");
    let part3 = new cc.Sprite("#baby_3.png");
    let part4 = new cc.Sprite("#baby_4.png");
    let beard_l = new cc.Sprite("#beard_l.png");
    let beard_r = new cc.Sprite("#beard_r.png");
    let round = new cc.Sprite("#round.png");
    part2.attr({
      x: 0,
      y: -20
    })
    part1.attr({
      anchorX: 0.5,
      anchorY: 0,
      x: 0,
      y: part2.y + part2.height / 2
    })
    part3.attr({
      anchorX: 0.5,
      anchorY: 1,
      x: 0,
      y: part2.y - part2.height / 2
    })
    part4.attr({
      anchorX: 0.5,
      anchorY: 1,
      x: 0,
      y: part3.y - part3.height
    });
    beard_l.attr({
      anchorX : 1,
      anchorY : 0.5,
      x : part1.width/2 - 25,
      y : 355
    });
    beard_r.attr({
      anchorX : 0,
      anchorY : 0.5,
      x : part1.width/2 + 25,
      y : 355
    });
    round.attr({
      anchorX : 0.5,
      anchorY : 1,
      x : part1.width/2,
      y : part1.height+390,
      scale : 1.56
    });
    part1.addChild(beard_l,-1);
    part1.addChild(beard_r,-1);
    part2.addChild(round,-1);
    this.baby.addChild(part1, this.zIndexOrder.part1);
    this.baby.addChild(part2, this.zIndexOrder.part2);
    this.baby.addChild(part3, this.zIndexOrder.part3);
    this.baby.addChild(part4, this.zIndexOrder.part4);
    beard_l.runAction(ActionManager.BEARD_RUN(1));
    beard_r.runAction(ActionManager.BEARD_RUN(-1));
  },
  loadCar: function () {
    let car = new cc.Node();
    let car_1 = new cc.Sprite("#car_1.png");
    let car_2 = new cc.Node();
    let rope = new cc.Sprite("#car_2.png");
    let wolf = new cc.Sprite("#wolf_1.png");
    let footl = new cc.Sprite("#wolf_2.png");
    let footr = new cc.Sprite("#wolf_3.png");
    car.attr({
      x: -85,
      y: 164,
      minx: GameManager.carMinX,
      min: -85,
      max: 160,
      rope: rope,
      wolf: wolf,
      footl: footl,
      footr: footr,
      ball: false,
      move: false,
      direction: 0
    })
    wolf.attr({
      x: -40,
      y: -70,
      min: -70,
      max: -250
    })
    rope.attr({
      anchorX: 0.5,
      anchorY: 1,
      x: 0,
      y: 195
    })
    footl.attr({
      anchorX: 0.5,
      anchorY: 0.8,
      x: 92,
      y: 27
    })
    footr.attr({
      anchorX: 0.5,
      anchorY: 0.8,
      x: 121,
      y: 27
    })
    car.addChild(car_2);
    car.addChild(car_1);
    car_2.addChild(rope);
    car_2.addChild(wolf);
    wolf.addChild(footl, 1);
    wolf.addChild(footr, 2);
    this.car = car;
    this.baby.addChild(car, this.zIndexOrder.car);
  },
  onCarMove: function (direction) {
    let car = this.car;
    if ((direction == 1 && car.x < car.max) || (direction == -1 && car.x > car.min)) {
      car.move = true;
      car.direction = direction;
      car.stopAllActions();
      car.footl.stopAllActions();
      car.footr.stopAllActions();
      car.footl.rotation = 0;
      car.footr.rotation = 0;
      car.footl.runAction(ActionManager.FOOT_RUN(-1));
      car.footr.runAction(ActionManager.FOOT_RUN(1));
      car.runAction(ActionManager.CAR_RUN(car, direction, function () {
        car.direction = 0;
        car.footl.stopAllActions();
        car.footr.stopAllActions();
        car.footl.rotation = 0;
        car.footr.rotation = 0;
      }));
    }
  },
  onCatchBall: function (setting) {
    if(setting.success){
      let ball = new cc.Sprite(`#${setting.id}_${setting.type}.png`);
      ball.attr({
        x: 107,
        y: -13
      });
      this.car.ball = ball;
      this.car.footl.rotation = 0;
      this.car.footr.rotation = 0;
      this.car.wolf.addChild(ball, 0);
    }
  },
  onGameHand: function (event) {
    var self = event.getCurrentTarget();
    var car = self.car;
    if (!car.ball) {
      if (self.car.x > self.car.minx) {
        var setting = GameManager.getBallId();
        v_main.gamerun = true;
        v_main.hp--;
        car.ball = true;
        car.footl.rotation = GameManager.maxRotationFoot;
        car.footr.rotation = -GameManager.maxRotationFoot;
        self.hand.runAction(ActionManager.HAND_DOWN());
        car.rope.runAction(ActionManager.ROPE_DOWN(Math.abs(car.wolf.max - car.wolf.min)));
        car.wolf.runAction(ActionManager.WOLF_DOWN(Math.abs(car.wolf.max - car.wolf.min), () => {
          self.onCatchBall(setting);
        }, () => {
          car.runAction(ActionManager.CAR_RUN(car, -1, () => {
            car.footl.runAction(ActionManager.FOOT_END(1));
            car.footr.runAction(ActionManager.FOOT_END(-1));
            if(setting.success){
              car.setLocalZOrder(self.zIndexOrder.carfall);
              car.ball.runAction(ActionManager.DROP_BALL(() => {
                self.onExitBall(setting);
              }))
            }
            else{
              self.onExitBall(setting);
            }
          }));
        }
        ))
      }
      else {
        console.log("请先移动");
      }
    }
  },
  onExitBall: function (setting) {
    var that = this;
    if(setting.success){
      this.car.ball.removeFromParent();
      this.car.setLocalZOrder(this.zIndexOrder.car);
      let ball = new cc.Sprite(`#${setting.id}_${setting.type}.png`);
      ball.attr({
        x: ball.width/2 + this.exit.width/2 + 20,
        y: ball.height/2 + this.exit.height
      });
      this.exit.addChild(ball);
      ball.runAction(ActionManager.EXIT_BALL(-55,-this.exit.height+25,() => {
        ball.removeFromParent();
        v_main.active = "tips";
        that.car.ball = false;
        v_main.gamerun = false;
        winSize.playEffect("success");
      }))
    }
    else{
      this.car.ball = false;
      v_main.gamerun = false;
      setTimeout(function(){
        winSize.playEffect("faile");
      },500)
    }
  },
  loadBalls: function () {
    let node = new cc.Node();
    let sequence = [];
    let balls = GameManager.getBalls();
    let x = -120, y = -180;
    node.attr({
      anchorX: 0,
      anchorY: 0,
      x: x,
      y: y
    });
    balls.forEach((item) => {
      let ball = new cc.Sprite(`#${GameManager.ball[item.id]}_${item.type}.png`);
      ball.attr({
        x : item.x,
        y : item.y
      });
      sequence.push(ball);
      node.addChild(ball);
    })
    this.balls.sequence = sequence;
    this.balls = balls;
    this.baby.addChild(node, this.zIndexOrder.ball);
  },
  loadRocker: function () {
    let rocker = new cc.Node();
    let top = new cc.Sprite("#rocker_1.png");
    let bottom = new cc.Sprite("#rocker_2.png");
    rocker.attr({
      x: -130,
      y: -288
    })
    top.attr({
      anchorX: 0.5,
      anchorY: 0
    })
    rocker.addChild(bottom);
    rocker.addChild(top);
    this.rocker = top;
    this.baby.addChild(rocker, this.zIndexOrder.rocker);
  },
  loadHand: function () {
    let hand = new cc.Sprite("#hand.png");
    hand.attr({
      x: 129,
      y: -259
    })
    this.hand = hand;
    this.baby.addChild(hand, this.zIndexOrder.hand);
  },
  loadTube: function () {
    let a = new cc.Sprite("#tube_1.png");
    let b = new cc.Sprite("#tube_2.png");
    let x = -125;
    let y = -130;
    a.attr({
      x: x,
      y: y
    })
    b.attr({
      x: x,
      y: y
    })
    this.baby.addChild(a, this.zIndexOrder.tube1);
    this.baby.addChild(b, this.zIndexOrder.tube2);
  },
  loadLight: function () {
    let light = new cc.Sprite("#light_mask.png");
    let a = [], b = [], c = [], d = [], sequence = [];
    let ay = 449;
    let rowx = 54.3;
    let rowy = 62.5;
    let bx = 15.5;
    for (let i = 0; i < 9; i++) {
      a.push(new cc.Sprite("#light.png"));
      c.push(new cc.Sprite("#light.png"));
      if (i < 6) {
        b.push(new cc.Sprite("#light.png"));
        d.push(new cc.Sprite("#light.png"));
      }
    }
    a.forEach((item, index) => {
      item.attr({
        x: bx + index * rowx,
        y: ay
      });
      sequence.push(item);
      light.addChild(item);
    })
    b.forEach((item, index) => {
      item.attr({
        x: a[a.length - 1].x,
        y: ay - (index + 1) * rowy
      });
      sequence.push(item);
      light.addChild(item);
    })
    c.forEach((item, index) => {
      item.attr({
        x: a[a.length - 1].x - index * rowx,
        y: 16.5
      });
      sequence.push(item);
      light.addChild(item);
    })
    d.forEach((item, index) => {
      item.attr({
        x: bx,
        y: b[b.length - 1].y + index * rowy
      });
      sequence.push(item);
      light.addChild(item);
    })
    light.attr({
      x: 0,
      y: 5,
      sequence: sequence
    });
    this.light = light;
    this.baby.addChild(light, this.zIndexOrder.light);
  },
  onLighting : function(){
    var that = this;
    var node =  this.light.sequence[this.lighting];
    node.runAction(ActionManager.LIGHT_SEQUENCE(function(){
      that.lighting = that.lighting < that.light.sequence.length-1 ? that.lighting + 1 : 0;
      that.onLighting();
    }))
  },
  loadCarTop: function () {
    let car_left = new cc.Sprite("#car_top.png");
    let car_right = new cc.Sprite("#car_top.png");
    let y = 206;
    car_left.attr({
      anchorX: 0.5,
      anchorY: 1,
      x: -168,
      y: y,
      scale: 0.75
    })
    car_right.attr({
      anchorX: 0.5,
      anchorY: 1,
      x: 170,
      y: y,
      scale: 0.75
    });
    this.baby.addChild(car_left, this.zIndexOrder.carangle);
    this.baby.addChild(car_right, this.zIndexOrder.carangle);
  },
  loadBottom: function () {
    let exit = new cc.Sprite("#exit.png");
    exit.attr({
      x: -185,
      y: -490
    });
    this.exit = exit;
    this.baby.addChild(exit, this.zIndexOrder.exit);
  }
});
