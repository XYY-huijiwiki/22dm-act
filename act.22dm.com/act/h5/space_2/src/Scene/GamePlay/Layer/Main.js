var Main = cc.Layer.extend({
  controller: {},
  active: "",
  word: null,
  cassette: null,
  space: null,
  wolf_1: null,
  wolf_2: null,
  wolf_3: null,
  wolf_4: null,
  jonie: null,
  dead: null,
  bell: null,
  pushclock: null,
  turnclock: null,
  touch: false,
  deltaY: 0,
  ctor: function ctor() {
    this._super();
  },
  onEnter: function onEnter() {
    this._super();
    this.loadCassette(); //回忆带
    this.loadSpace();    //时空隧道
    this.loadWolf_1();   //红灰太狼分开
    this.loadWolf_2();   //红灰太狼切入
    this.loadWolf_3();   //黑太郎
    this.loadWolf_4();   //灰太狼眼泪
    this.loadJonie();    //暖羊羊
    this.loadDead();     //喜羊羊之死
    this.loadBell();     //掉铃铛
    this.loadPushClock();//推时钟
    if (v_main.hasended) {
      this.loadTurnClock();//时钟转动
    }
    this.registerEvent();
    this.scheduleUpdate();

    this.cassette.visible = true;
    this.active = "cassette";

    // this.active = "wolf_2";
    // this.wolf_2.visible = true;

    if (v_main.autoplay) {
      v_main.canPlay = true;
      setTimeout(function(){
        v_main.guide = false;
        this.touch = true;
        this.deltaY = v_main.autoplay;
      }.bind(this),2500)
    }
    if(winSize.height>=1100){
      GameManager.speed.min = 0.9;
    }
    else if(height>=950){
      GameManager.speed.min = 0.85;
    }
    v_main.guide = true;
  },
  onExit: function onExit() {
    this._super();
  },
  registerEvent: function registerEvent() {
    var a = cc.EventListener.create({
      event: cc.EventListener.TOUCH_ONE_BY_ONE,
      swallowTouches: false,
      onTouchBegan: function onTouchBegan(touch, event) {
        if (v_main.canPlay && !v_main.autoplay) {
          event.getCurrentTarget().touch = true;
          //cc.director.resume();
          v_main.guide = false;
          return true;
        }
      },
      onTouchMoved: function onTouchMoved(touch, event) {
        var target = event.getCurrentTarget();
        if (Math.abs(touch.getDelta().y) > 0.5 && target.touch) {
          let deltaY = touch.getDelta().y * GameManager.speed.min;
          target.deltaY = deltaY;
          return true;
        }
      },
      onTouchEnded: function onTouchEnded(touch, event) {
        event.getCurrentTarget().touch = false;
        if (event.getCurrentTarget() != "video") {
          //cc.director.pause();
        }
        return true;
      }
    });
    cc.eventManager.addListener(a, this);
  },
  update: function update() {
    if (this.touch && this.deltaY != 0 && v_main.canPlay) {
      switch (this.active) {
        case "cassette":
          this.onMoveCassette();
          break;
        case "space":
          this.onMoveSpace();
          break;
        case "wolf_1":
          this.onMoveWolf_1();
          break;
        case "wolf_2":
          this.onMoveWolf_2();
          break;
        case "wolf_3":
          this.onMoveWolf_3();
          break;
        case "wolf_4":
          this.onMoveWolf_4();
          break;
        case "jonie":
          this.onMoveJonie();
          break;
        case "dead":
          this.onMoveDead();
          break;
        case "bell":
          this.onMoveBell();
          break;
        case "pushclock":
          this.onMovePushClock();
          break;
        case "turnclock":
          this.onMoveTurnClock();
          break;
        case "word":
          this.onMoveWordTest();
          break;
      }
      this.deltaY = v_main.autoplay ? v_main.autoplay : 0;
    }
  },
  loadCassette: function loadCassette() {
    let ctor = GameManager.getController("cassette");
    var node = new cc.Node();
    var logo = new cc.Sprite(res.logo);
    node.attr({
      anchorX: 0,
      anchorY: 0,
      cascadeOpacity: true,
      opacity: 255,
      x: 0,
      y: winSize.height - 4960,
      by: winSize.height - 4960,
      endy: 0,
      active: 'map',
      visible: false,
      endopacity: ctor.endopacity
    });
    for (let i = 0; i < ctor.map_pic; i++) {
      let pic = new cc.Sprite(`#map_0_${i + 1}.jpg`);
      pic.attr({
        anchorX: 0,
        anchorY: 0,
        x: 0,
        y: ctor.map_height[i]
      });
      node.addChild(pic);
    }
    node.addChild(logo);
    logo.attr({
      anchorX : 0.5,
      anchorY : 1,
      x : 320,
      y : 4960 - 40
    })
    this.cassette = node;
    this.addChild(node, ctor.zindex);
  },
  onMoveCassette: function () {
    let ctor = GameManager.getController("cassette");
    let node = this.cassette;
    let ty = node.y + this.deltaY * ctor.speed;
    let active = node.active;
    if (active == 'map') {
      if (ty < node.by) {
        node.y = node.by;
        //console.log("cancel");
      }
      else {
        if (ty < node.endy) {
          node.y = ty;
        }
        else {
          node.y = node.endy;
          this.space.visible = true;
          active = "map_out";
        }
      }
    }
    else if (active == 'map_out') {
      let topacity = node.opacity - this.deltaY * ctor.opacityspeed;
      if (topacity > 255) {
        node.opacity = 255;
        active = 'map';
        this.space.visible = false;
      }
      else {
        if (topacity > node.endopacity) {
          node.opacity = topacity;
        }
        else {
          node.opacity = node.endopacity;
          this.space.visible = true;
          node.visible = false;
          this.active = 'space';
          return;
        }
      }
    }
    node.active = active;
  },
  loadSpace: function () {
    let ctor = GameManager.getController("space");
    var node = new cc.Node();
    let car = new cc.Sprite(`#map_1_car.png`);
    let stone = new cc.Sprite(`#map_1_stone.png`);
    let map_1 = new cc.Sprite(`#map_1_1.jpg`);
    let map_2 = new cc.Sprite(`#map_1_2.jpg`);
    let map_3 = new cc.Sprite(`#map_1_3.jpg`);
    let word_1 = this.loadWord(1);
    let word_2 = this.loadWord(2);
    node.addChild(map_1);
    node.addChild(map_2);
    node.addChild(map_3);
    node.addChild(stone);
    node.addChild(car);
    node.addChild(word_1);
    node.addChild(word_2);
    let gird = {
      map_1: {
        deltay: -1700
      },
      car: {
        mapdeltay: -2100,
        deltay: -800,
        ratioy: -800 / 500,
        ratiox: 1280 / 500
      },
      stone: {
        mapdeltay: winSize.height - 4960,
        deltay: 1300,
        ratioy: 1300 / (2860 - winSize.height),
        ratior: 8 / (2860 - winSize.height),
        ratios: 0.15 / (2860 - winSize.height)
      }
    }
    node.attr({
      anchorX: 0,
      anchorY: 0,
      cascadeOpacity: true,
      opacity: 255,
      x: 0,
      y: winSize.height - 4960,
      by: winSize.height - 4960,
      endy: 0,
      gird: gird,
      car: car,
      stone: stone,
      word_1: word_1,
      word_2: word_2,
      visible: false,
      active: 'word_1',
      endopacity: ctor.endopacity
    });
    map_1.attr({
      anchorX: 0,
      anchorY: 0,
      x: 0,
      y: 0
    });
    map_2.attr({
      anchorX: 0,
      anchorY: 0,
      x: 0,
      y: 1653
    });
    map_3.attr({
      anchorX: 0,
      anchorY: 0,
      x: 0,
      y: 3307
    });
    word_1.attr({
      anchorX: 0,
      anchorY: 0,
      x: 0,
      y: 4960 - winSize.height / 2
    });
    word_2.attr({
      anchorX: 0,
      anchorY: 0,
      x: 0,
      y: winSize.height / 2 + 250
    });
    car.attr({
      x: -320,
      y: 2900,
      bx: -320,
      by: 2900,
      endx: 960,
      endy: 2100
    });
    stone.attr({
      anchorX: 0.5,
      anchorY: 1,
      x: 320,
      y: 2200,
      by: 2200,
      endy: 900,
      rotation: 0,
      brotation: 0,
      endrotation: 8,
      scale: 1,
      bscale: 1,
      endscale: 1.15
    });
    this.space = node;
    this.addChild(node, ctor.zindex);
  },
  onMoveSpace: function () {
    let ctor = GameManager.getController("space");
    let node = this.space;
    let car = node.car;
    let stone = node.stone;
    let active = node.active;
    if (active == 'word_1') {
      let deltyopacity = this.deltaY * ctor.word_1speed;
      let flag = this.onFadeWord(node.word_1, deltyopacity*GameManager.wordspeed_n);
      if (flag == 'finished') {
        active = 'map_1';
      }
      else if (flag == 'reback') {
        node.y = node.by;
        this.cassette.visible = true;
        this.active = 'cassette';
        return;
      }
    }
    else if (active == "map_1") {
      let gird = node.gird.map_1;
      let endy = node.by - gird.deltay;
      let ty = node.y + this.deltaY * ctor.map_1speed;
      if (ty < node.by) {
        node.y = node.by;
        active = 'word_1';
      }
      else {
        if (ty < endy) {
          node.y = ty;
        }
        else {
          node.y = endy;
          active = 'car';
        }
      }
    }
    else if (active == "car") {
      let gird = node.gird.car;
      let endy = node.by - gird.mapdeltay;
      let dy = this.deltaY * ctor.carspeed;
      let ty = node.y + dy;
      if (ty < node.by - node.gird.map_1.deltay) {
        node.y = node.by - node.gird.map_1.deltay;
        car.x = car.bx;
        car.y = car.by;
        active = 'map_1';
      }
      else {
        let cary = car.y + dy * gird.ratioy;
        let carx = car.x + dy * gird.ratiox;
        if (ty < endy) {
          node.y = ty;
          car.x = carx;
          car.y = cary;
        }
        else {
          node.y = endy;
          car.x = car.endx;
          car.y = car.endy;
          active = 'stone';
        }
      }
    }
    else if (active == "stone") {
      let gird = node.gird.stone;
      let endy = node.by - gird.mapdeltay;
      let dy = this.deltaY * ctor.stonespeed;
      let ty = node.y + dy;
      if (ty < node.by - node.gird.car.mapdeltay) {
        node.y = node.by - node.gird.car.mapdeltay;
        stone.y = stone.by;
        stone.rotation = stone.brotation;
        stone.scale = stone.bscale;
        active = 'car';
      }
      else {
        let stoney = stone.y - dy * gird.ratioy;
        let stoner = stone.rotation + dy * gird.ratior;
        let stones = stone.scale + dy * gird.ratios;
        if (ty < endy) {
          node.y = ty;
          stone.y = stoney;
          stone.scale = stones;
          stone.rotation = stoner;
        }
        else {
          node.y = 0;
          stone.y = stone.endy;
          stone.scale = stone.endscale;
          stone.rotation = stone.endrotation;
          active = 'word_2';
        }
      }
    }
    else if (active == 'word_2') {
      let deltyopacity = this.deltaY * ctor.word_2speed;
      let flag = this.onFadeWord(node.word_2, deltyopacity*GameManager.wordspeed_f);
      if (flag == 'finished') {
        active = 'map_out';
      }
      else if (flag == 'reback') {
        active = 'stone';
      }
    }
    else if (active == 'map_out') {
      let topacity = node.opacity - this.deltaY * ctor.opacityspeed;
      if (topacity > 255) {
        node.opacity = 255;
        active = 'word_2';
        this.wolf_1.visible = false;
      }
      else {
        if (topacity > node.endopacity) {
          node.opacity = topacity;
        }
        else {
          node.opacity = node.endopacity;
          this.wolf_1.visible = true;
          node.visible = false;
          this.active = 'wolf_1';
          v_main.music_id = 'wolf';
          return;
        }
      }
    }
    node.active = active;
  },
  loadWolf_1: function () {
    let ctor = GameManager.getController("wolf_1");
    var node = new cc.Node();
    let map_1 = new cc.Sprite(`#map_2_0.jpg`);
    let stone_1 = new cc.Sprite(`#map_2_stone_1.png`);
    let stone_2 = new cc.Sprite(`#map_2_stone_2.png`);
    let stone_3 = new cc.Sprite(`#map_2_stone_3.png`);
    let stone_4 = new cc.Sprite(`#map_2_stone_4.png`);
    let role_1 = new cc.Sprite(`#map_2_role_1.png`);
    let role_2 = new cc.Sprite(`#map_2_role_2.png`);
    let light = new cc.Sprite(`#map_2_light.png`);
    let map_2 = new cc.Sprite(`#map_2_1.png`);
    let role_3 = new cc.Sprite(`#map_2_role_3.png`);
    let role_4 = new cc.Sprite(`#map_2_role_4.png`);
    node.addChild(map_1);
    node.addChild(stone_1);
    node.addChild(stone_2);
    node.addChild(stone_3);
    node.addChild(stone_4);
    node.addChild(role_1);
    node.addChild(role_2);
    node.addChild(light);
    node.addChild(map_2);
    map_2.addChild(role_3);
    map_2.addChild(role_4);
    node.attr({
      x: 640 - map_1.width,
      y: winSize.height - map_1.height,
      bx: 640 - map_1.width,
      by: winSize.height - map_1.height,
      cascadeOpacity: true,
      opacity: 255,
      active: 'light',
      map_1: map_1,
      stone_1: stone_1,
      stone_2: stone_2,
      stone_3: stone_3,
      stone_4: stone_4,
      role_1: role_1,
      role_2: role_2,
      light: light,
      map_2: map_2,
      role_3: role_3,
      role_4: role_4,
      visible: false
    });
    map_1.attr({
      anchorX: 0,
      anchorY: 0,
      x: 0,
      y: 0
    });
    stone_1.attr({
      anchorX: 1,
      anchorY: 1,
      x: map_1.width - 60,
      y: map_1.height - 320
    });
    stone_2.attr({
      anchorX: 1,
      anchorY: 1,
      x: map_1.width - 900,
      y: map_1.height - 600
    });
    stone_3.attr({
      x: map_1.width - 800,
      y: map_1.height - 520
    });
    stone_4.attr({
      x: map_1.width - 1000,
      y: map_1.height - 400
    });
    role_1.attr({
      x: map_1.width - 580,
      y: map_1.height - 800,
      bx: map_1.width - 580,
      by: map_1.height - 800
    });
    role_2.attr({
      x: map_1.width - 50,
      y: map_1.height - 700,
      bx: map_1.width - 50,
      by: map_1.height - 700
    });
    light.attr({
      anchorX: 1,
      anchorY: 0,
      scale: ctor.lightscale,
      x: map_1.width,
      y: map_1.height,
      bx: map_1.width,
      by: map_1.height,
      dy: winSize.height - 100
    });
    map_2.attr({
      x: 320,
      y: winSize.height / 2,
      cascadeOpacity: true,
      opacity: 0
    });
    role_3.attr({
      anchorX: 0,
      anchorY: 0.5,
      x: 0,
      y: map_2.height / 2
    });
    role_4.attr({
      anchorX: 1,
      anchorY: 0.5,
      x: 640,
      y: map_2.height / 2
    });
    this.wolf_1 = node;
    this.addChild(node, ctor.zindex);
  },
  onMoveWolf_1: function () {
    let ctor = GameManager.getController('wolf_1');
    let node = this.wolf_1;
    let light = node.light;
    let map_1 = node.map_1;
    let map_2 = node.map_2;
    let role_1 = node.role_1;
    let role_2 = node.role_2;
    let role_3 = node.role_3;
    let role_4 = node.role_4;
    let stone_1 = node.stone_1;
    let active = node.active;
    let movex = this.deltaY;
    let movey = this.deltaY;
    if (active == "light") {
      let lighty = light.y - movey * 2;
      if (lighty > light.by) {
        this.active = "space";
        this.space.visible = true;
        node.visible = false;
        v_main.music_id = 'normal';
        return;
      }
      else if (lighty >= light.by - light.dy) {
        light.y = lighty;
        //红开始飞起移开 镜头左移到灰太狼
        if (light.y <= light.by - 700) {
          role_2.y += movey * 0.5;
          role_2.rotation -= movey * 0.05;
          role_1.x -= movey * 0.1;
          role_1.y -= movey * 0.05;
          stone_1.y -= this.deltaY * 0.5;
        }
      }
      else if (lighty < light.by - light.dy) {
        light.y = light.by - light.dy;
        active = 'wolfleave';
      }
    }
    else if (active == 'wolfleave') {
      let ratioy = (1624 - winSize.height) / 796;
      let nodex = node.x + movex;
      let nodey = node.y + movex * ratioy;
      if (nodex <= 0) {
        if(nodex<-796){
          active = "light";
        }
        else{
          node.x = nodex;
          node.y = nodey;
          if (nodex > -500) {
            role_1.x -= movex;
            role_1.y -= movex * ratioy * 1.5;
          }
          else {
            if (role_1.x != role_1.bx && role_1.y != role_1.by) {
              role_1.x = role_1.bx;
              role_1.y = role_1.by
            }
          }
        }
      }
      else {
        node.x = 0;
        node.y = 0;
        active = "map_2";
      }
    }
    else if (active == 'map_2') {
      let opacitymap2 = map_2.opacity + this.deltaY;
      if (opacitymap2 <= 255) {
        if (opacitymap2 > 0) {
          map_2.opacity = opacitymap2;
        }
        else {
          map_1.opacity = 255;
          map_2.opacity = 0;
          active = 'wolfleave';
        }
      }
      else {
        map_2.opacity = 255;
        active = 'handsleave';
      }
    }
    else if (active == 'handsleave') {
      let handx = role_3.x - this.deltaY * ctor.handspeed;
      if (handx > -role_3.width) {
        if (handx >= 0) {
          active = 'map_2';
        }
        else {
          role_3.x = handx;
          role_4.x += this.deltaY* ctor.handspeed;
        }
      }
      else {
        this.wolf_2.visible = true;
        node.visible = false;
        this.active = 'wolf_2';
        return;
      }
    }
    node.active = active;
  },
  loadWolf_2: function () {
    let ctor = GameManager.getController("wolf_2");
    var node = new cc.Node();
    let map = new cc.Sprite(`#map_1_1.jpg`);
    let role_1 = new cc.Sprite(`#map_3_role_1.png`);
    let role_2 = new cc.Sprite(`#map_3_role_2.png`);
    node.addChild(map);
    node.addChild(role_1);
    node.addChild(role_2);
    node.attr({
      x: 0,
      y: 0,
      cascadeOpacity: true,
      opacity: 255,
      active: 'role_1',
      map: map,
      role_1: role_1,
      role_2: role_2,
      visible: false,
      endopacity : ctor.endopacity
    })
    map.attr({
      x: 320,
      y: winSize.height / 2,
    });
    role_1.attr({
      anchorX: 0,
      anchorY: 1,
      x: 640,
      y: winSize.height - 200,
      bx: 640,
      by: winSize.height - 200,
      dx: -640,
      dy: 200
    });
    role_2.attr({
      anchorX: 1,
      anchorY: 0,
      x: 0,
      y: -180,
      bx: 0,
      by: -180,
      dx: 640,
      dy: 200
    });
    this.wolf_2 = node;
    this.addChild(node, ctor.zindex);
  },
  onMoveWolf_2: function () {
    let ctor = GameManager.getController('wolf_2');
    let node = this.wolf_2;
    let role_1 = node.role_1;
    let role_2 = node.role_2;
    let active = node.active;
    if (active == 'role_1') {
      let tx = role_1.x - this.deltaY;
      let ty = role_1.y - (role_1.dy / role_1.dx) * this.deltaY;
      if (tx >= role_1.bx + role_1.dx) {
        if (tx <= role_1.bx) {
          role_1.x = tx;
          role_1.y = ty;
        }
        else {
          role_1.x = role_1.bx;
          role_1.y = role_1.by;
          this.wolf_1.visible = true;
          this.wolf_2.visible = false;
          this.active = 'wolf_1';
          return;
        }
      }
      else {
        role_1.x = role_1.bx + role_1.dx;
        role_1.y = role_1.by + role_1.dy;
        active = 'role_2';
      }
    }
    else if (active == 'role_2') {
      let tx = role_2.x + this.deltaY;
      let ty = role_2.y + (role_2.dy / role_2.dx) * this.deltaY;
      if (tx <= role_2.bx + role_2.dx) {
        if (tx > 0) {
          role_1.y += (role_2.dy / role_2.dx) * this.deltaY * (320 / role_2.dy) / winSize.scaleY;
          role_2.x = tx;
          role_2.y = ty;
        }
        else {
          role_1.x = role_1.bx + role_1.dx;
          role_1.y = role_1.by + role_1.dy;
          role_2.x = role_2.bx;
          role_2.y = role_2.by;
          active = 'role_1';
        }
      }
      else {
        role_2.x = role_2.bx + role_2.dx;
        role_2.y = role_2.by + role_2.dy;
        this.wolf_3.visible = true;
        active = 'map_out';
      }
    }
    else if (active == 'map_out') {
      let topacity = node.opacity - this.deltaY * ctor.opacityspeed;
      if (topacity > 255) {
        node.opacity = 255;
        active = 'role_2';
        this.wolf_3.visible = false;
      }
      else {
        if (topacity > node.endopacity) {
          node.opacity = topacity;
        }
        else {
          node.opacity = node.endopacity;
          this.wolf_3.visible = true;
          node.visible = false;
          this.active = 'wolf_3';
          return;
        }
      }
    }
    node.active = active;
  },
  loadWolf_3: function () {
    let ctor = GameManager.getController("wolf_3");
    var node = new cc.Node();
    let map = new cc.Sprite(`#map_4.jpg`);
    let role_1 = new cc.Sprite(`#map_4_role_1.png`);
    let role_2 = new cc.Sprite(`#map_4_role_2.png`);
    let smoke_1 = new cc.Sprite(`#map_4_smoke_1.png`);
    let smoke_2 = new cc.Sprite(`#map_4_smoke_2.png`);
    node.addChild(map);
    node.addChild(role_1);
    node.addChild(role_2);
    node.addChild(smoke_1);
    node.addChild(smoke_2);
    node.attr({
      cascadeOpacity: true,
      opacity: 255,
      x: -210,
      y: -2834 + winSize.height,
      bx: -210,
      by: -2834 + winSize.height,
      dx: 210,
      dy1: 2834 - 210 - winSize.height,
      dy2: 2834 - winSize.height,
      map: map,
      role_1: role_1,
      role_2: role_2,
      smoke_1: smoke_1,
      smoke_2: smoke_2,
      active: 'role_1',
      visible: false,
      endopacity : ctor.endopacity
    });
    map.attr({
      anchorX: 0,
      anchorY: 0,
      x: 0,
      y: 0,
      scale: ctor.mapscale
    });
    role_1.attr({
      anchorX: 0,
      anchorY: 0,
      x: -100,
      y: 300
    });
    role_2.attr({
      anchorX: 0,
      anchorY: 0,
      x: -100,
      y: 300,
      visible: false
    })
    smoke_1.attr({
      anchorX: 0,
      anchorY: 0,
      scale: ctor.smokescale,
      x: 0,
      y: 210
    });
    smoke_2.attr({
      scale: ctor.smokescale,
      bscale: ctor.smokescale,
      x: 425,
      y: 764 + 50,
      opacity: 0
    })
    this.wolf_3 = node;
    this.addChild(node, ctor.zindex);
  },
  onMoveWolf_3: function () {
    let ctor = GameManager.getController("wolf_3");
    let node = this.wolf_3;
    let role_1 = node.role_1;
    let role_2 = node.role_2;
    let map = node.map;
    let smoke_2 = node.smoke_2;
    let active = node.active;
    let ty = node.y + this.deltaY * ctor.speed;
    if (active == 'role_1') {
      if (ty <= node.by) {
        node.y = node.by;
        node.x = node.bx;
        this.wolf_2.visible = true;
        this.active = 'wolf_2';
        node.visible = false;
        return;
      }
      else if (ty <= node.by + node.dy1) {
        node.y = ty;
      }
      else if (ty <= node.by + node.dy2) {
        let tx = node.x + this.deltaY * ctor.speed;
        if (tx <= node.bx + node.dx) {
          node.y = ty;
          node.x = tx;
        }
        else {
          node.x = node.bx + node.dx;
          node.y = node.by + node.dy2;
          role_1.visible = false;
          role_2.visible = true;
          active = 'smoke_2';
        }
      }
      else {
        node.x = node.bx + node.dx;
        node.y = node.by + node.dy2;
        role_1.visible = false;
        role_2.visible = true;
        active = 'smoke_2';
      }
    }
    else if (active == 'smoke_2') {
      let topacity = smoke_2.opacity + this.deltaY*0.7;
      if (topacity <= 255) {
        if (topacity > 0) {
          smoke_2.opacity = topacity;
        }
        else {
          smoke_2.opacity = 0;
          role_1.visible = true;
          role_2.visible = false;
          active = 'role_1';
        }
      }
      else {
        smoke_2.opacity = 255;
        this.wolf_4.visible = true;
        node.visible = false;
        this.active = 'wolf_4';
        return;
      }
    }
    else if (active == 'map_out') {
      let topacity = node.opacity - this.deltaY * ctor.opacityspeed;
      if (topacity > 255) {
        node.opacity = 255;
        active = 'smoke_2';
        this.wolf_4.visible = false;
      }
      else {
        if (topacity > node.endopacity) {
          node.opacity = topacity;
        }
        else {
          node.opacity = node.endopacity;
          this.wolf_4.visible = true;
          node.visible = false;
          this.active = 'wolf_4';
          return;
        }
      }
    }
    node.active = active;
  },
  loadWolf_4: function () {
    let ctor = GameManager.getController("wolf_4");
    var node = new cc.Node();
    let map = new cc.Sprite(`#map_5.jpg`);
    let tear_1 = new cc.Sprite(`#map_5_tear_1.png`);
    let tear_2 = new cc.Sprite(`#map_5_tear_2.png`);
    let mapHeight = map.height * ctor.mapscale;
    let offsetY = (mapHeight - 1050) < winSize.height / 1.3 ? 0 : -(winSize.height / 1.3 - mapHeight + 1050) / 2;
    node.addChild(map);
    map.addChild(tear_1);
    node.addChild(tear_2);
    node.attr({
      x: 0,
      y: winSize.height - mapHeight + offsetY,
      by: winSize.height - mapHeight + offsetY,
      endy: 0,
      map: map,
      tear_1: tear_1,
      tear_2: tear_2,
      active: 'tear_1',
      visible: false
    });
    map.attr({
      anchorX: 0,
      anchorY: 0,
      x: 0,
      y: 0,
      scale: ctor.mapscale,
      cascadeOpacity: true,
      opacity: 255
    });
    tear_1.attr({
      anchorX: 0,
      anchorY: 0,
      x: 30,
      y: 1050,
      opacity: 0
    });
    tear_2.attr({
      x: 280,
      y: 1100,
      by: 1100,
      endy: winSize.height / 2 + 100,
      opacity: 0,
      scale: ctor.tearscale,
      bscale: ctor.tearscale,
      endscale: ctor.tearendscale
    });
    this.wolf_4 = node;
    this.addChild(node, ctor.zindex);
  },
  onMoveWolf_4: function () {
    let ctor = GameManager.getController("wolf_4");
    let node = this.wolf_4;
    let tear_1 = node.tear_1;
    let tear_2 = node.tear_2;
    let active = node.active;
    node.active = active;
    if (active == 'tear_1') {
      let topacity = tear_1.opacity + this.deltaY * ctor.tear_1speed;
      if (topacity <= 255) {
        if (topacity < 0) {
          tear_1.opacity = 0;
          this.wolf_3.visible = true;
          node.visible = false;
          this.active = 'wolf_3';
          return;
        }
        else if (topacity > 0) {
          tear_1.opacity = topacity;
        }
      }
      else {
        tear_1.opacity = 255;
        active = 'tear_2_in';
      }
    }
    else if (active == 'tear_2_in') {
      let topacity = tear_2.opacity + this.deltaY * ctor.tear_2speed;
      if (topacity <= 255) {
        if (topacity < 0) {
          tear_2.opacity = 0;
          active = 'tear_1';
        }
        else if (topacity > 0) {
          tear_2.opacity = topacity;
        }
      }
      else {
        tear_2.opacity = 255;
        active = 'tear_2_drop';
      }
    }
    else if (active == 'tear_2_drop') {
      let ty = tear_2.y - this.deltaY * ctor.tear_2_dropspeed;
      if (ty >= tear_2.endy) {
        if (ty > tear_2.by) {
          node.y = node.by;
          tear_2.y = tear_2.by;
          active = 'tear_2_in';
        }
        else {
          const ny = (node.by - node.endy) / (tear_2.by - tear_2.endy) * this.deltaY * ctor.tear_2_dropspeed;
          node.y -= ny;
          tear_2.y = ty;
        }
      }
      else {
        node.y = node.endy;
        tear_2.y = tear_2.endy;
        active = 'tear_2_scale';
      }
    }
    else if (active == 'tear_2_scale') {
      let tscale = tear_2.scale + this.deltaY * ctor.tear_2_scalespeed;
      if (tscale <= tear_2.endscale) {
        if (tscale < tear_2.bscale) {
          tear_2.scale = tear_2.bscale;
          active = 'tear_2_drop';
        }
        else {
          tear_2.scale = tscale;
        }
      }
      else {
        node.map.visible = false;
        this.jonie.visible = true;
        this.active = 'jonie';
        v_main.music_id = 'jonie';
        return;
      }
    }
    node.active = active;
  },
  loadJonie: function () {
    let ctor = GameManager.getController("jonie");
    var node = new cc.Node();
    let runnode = new cc.Node();
    let runinner = new cc.Node();
    let map = new cc.Sprite(`#map_6_2.jpg`);
    let wind = new cc.Sprite(`#map_6_wind.png`);
    let cloud = new cc.Sprite(`#map_6_cloud.png`);
    let jump_1 = new cc.Sprite(`#map_6_jump_1.png`);
    let jump_2 = new cc.Sprite(`#map_6_jump_2.png`);
    let jump_3 = new cc.Sprite(`#map_6_jump_3.png`);
    let role = new cc.Sprite(`#map_6_role_1.png`);
    let runmap = new cc.Sprite(`#map_6_1.jpg`);
    let runmapscale = winSize.height / runmap.height;
    let box = {
      mapWidth: map.width * ctor.mapscale,
      mapHeight: map.height * ctor.mapscale,
      runmapWidth: runmap.width * runmapscale,
      runmapHeight: runmap.height * runmapscale
    };
    let gird = {
      bx: 640 - box.mapWidth,
      by: 0,
      jump_1: {
        endx: 640 - box.mapWidth + 300,
        endy: -300,
        deltax: 300,
        deltay: 300,
        ratiox: 300 / 300
      },
      jump_2: {
        endx: 0,
        endy: -box.mapHeight + winSize.height,
        deltax: box.mapWidth - 640 - 300,
        deltay: winSize.height - box.mapHeight + 300,
        ratiox: (box.mapWidth - 640 - 300) / (winSize.height - box.mapHeight + 300)
      }
    };
    // console.log(box);
    // console.log(gird);
    node.addChild(map);
    node.addChild(jump_1);
    node.addChild(jump_2);
    node.addChild(role);
    node.addChild(cloud);
    node.addChild(wind);
    node.addChild(runnode);

    role.addChild(jump_3);
    runnode.addChild(runmap);
    runnode.addChild(runinner);
    node.attr({
      cascadeOpacity: true,
      opacity: 255,
      x: gird.bx,
      y: gird.by,
      bx: gird.bx,
      by: gird.by,
      gird: gird,
      map: map,
      runnode: runnode,
      jump_1: jump_1,
      jump_2: jump_2,
      jump_3: jump_3,
      role: role,
      active: 'run_in',
      visible: false,
      endopacity: ctor.endopacity
    });
    map.attr({
      anchorX: 0,
      anchorY: 0,
      x: 0,
      y: 0,
      scale: ctor.mapscale
    });
    wind.attr({
      anchorX: 0,
      anchorY: 0,
      x: 0,
      y: 0,
      scale: ctor.windscle
    });
    cloud.attr({
      anchorX: 0,
      anchorY: 0,
      x: 0,
      y: box.mapHeight - 1500,
      scale: ctor.cloudscale
    });
    jump_1.attr({
      anchorX: 1,
      anchorY: 0,
      x: box.mapWidth - 150,
      y: 420,
      bx: box.mapWidth - 150,
      by: 420,
      opacity: 0
    });
    jump_2.attr({
      anchorX: 1,
      anchorY: 0,
      x: box.mapWidth - 450,
      y: 650,
      bx: box.mapWidth - 450,
      by: 650,
      endx: 640,
      endy: box.mapHeight - 1000,
      opacity: 0
    });
    role.attr({
      anchorX: 1,
      anchorY: 0,
      cascadeOpacity: true,
      opacity: 255,
      x: 500,
      y: box.mapHeight - role.height + 100,
      by: box.mapHeight - role.height + 100,
      endy: 600
    });
    jump_3.attr({
      anchorX: 0,
      anchorY: 1,
      x: 247,
      y: 132,
      visible: false
    });
    runnode.attr({
      anchorX: 0,
      anchorY: 0,
      cascadeOpacity: true,
      opacity: 255,
      x: box.mapWidth - box.runmapWidth,
      y: 0,
      bx: box.mapWidth - box.runmapWidth,
      endx: box.mapWidth - 640,
      runinner: runinner
    });
    runmap.attr({
      anchorX: 0,
      anchorY: 0,
      x: 0,
      y: 0,
      scale: runmapscale
    });
    runinner.attr({
      anchorX: 0,
      anchorY: 0,
      cascadeOpacity: true,
      x: box.runmapWidth,
      y: 200,
      bx: box.runmapWidth,
      endx: -320,
      deltax: 0,
      runindex: 0,
      nextindex: 1,
      list: []
    });
    [1, 2, 3].forEach((item) => {
      let s = new cc.Sprite(`#map_6_run_${item}.png`);
      s.attr({
        anchorX: 0,
        anchorY: 0,
        x: 0,
        y: 0,
        visible: false
      });
      runinner.list.push(s);
      runinner.addChild(s);
    })
    runinner.list[0].visible = true;
    this.jonie = node;
    this.addChild(node, ctor.zindex);
  },
  onMoveJonie: function () {
    let ctor = GameManager.getController("jonie");
    let node = this.jonie;
    let jump_1 = node.jump_1;
    let jump_2 = node.jump_2;
    let jump_3 = node.jump_3;
    let role = node.role;
    let runnode = node.runnode;
    let active = node.active;
    if (active == 'run_in') {
      let tx = runnode.x + this.deltaY * ctor.speed_run;
      let runinner = runnode.runinner;
      if (tx < runnode.bx) {
        runnode.x = runnode.bx;
        runinner.x = runinner.bx;
        this.wolf_4.map.visible = true;
        node.visible = false;
        this.active = 'wolf_4';
        v_main.music_id = 'wolf';
        return;
      }
      else {
        let ratiox = (runinner.bx - runinner.endx) / (runnode.endx - runnode.bx);
        let rundeltax = this.deltaY * ctor.speed_run * ratiox;
        if (tx <= runnode.endx) {
          runnode.x = tx;
          runinner.x -= rundeltax;
          runinner.deltax += rundeltax;
          if (Math.abs(runinner.deltax) > 120) {
            let nextindex = 0;
            runinner.list.forEach((item, index) => {
              if (index == runinner.nextindex) {
                item.visible = true;
                runinner.deltax = 0;
                if (index == 0 || index == 2) {
                  nextindex = 1;
                }
                else {
                  if (runinner.runindex < index)
                    nextindex = 2;
                  else
                    nextindex = 0;
                }
                runinner.runindex = index;
              }
              else {
                item.visible = false;
              }
            })
            runinner.nextindex = nextindex;
          }
        }
        else {
          runnode.x = runnode.endx;
          runinner.x = runinner.endx;
          this.wolf_4.tear_2.visible = false;
          active = 'run_out';
        }
      }
    }
    else if (active == 'run_out') {
      let topacity = runnode.opacity - this.deltaY;
      if (topacity >= 0) {
        if (topacity >= 255) {
          runnode.opacity = 255;
          active = 'run_in';
          this.wolf_4.tear_2.visible = true;
        }
        else {
          runnode.opacity = topacity;
        }
      }
      else {
        runnode.opacity = 0;
        jump_1.opacity = 255;
        active = 'jump_1';
      }
    }
    else if (active == 'jump_1') {
      let gird = node.gird.jump_1;
      let dy = node.y - this.deltaY * ctor.speed_jump1;
      if (dy > node.by) {
        node.x = node.bx;
        node.y = node.by;
        jump_1.x = jump_1.bx;
        jump_1.y = jump_1.by;
        jump_1.opacity = 0;
        active = 'run_out';
      }
      else {
        if (dy > gird.endy) {
          node.x += this.deltaY * gird.ratiox * ctor.speed_jump1;
          node.y = dy;
          jump_1.x -= (170 / gird.deltax) * this.deltaY * ctor.speed_jump1;
          jump_1.y += (170 / gird.deltay) * this.deltaY * ctor.speed_jump1;
        }
        else {
          node.x = gird.endx;
          node.y = gird.endy;
          jump_1.x = jump_1.bx - 170;
          jump_1.y = jump_1.by + 170;
          jump_1.opacity = 0;
          jump_2.opacity = 255;
          active = 'jump_2';
        }
      }
    }
    else if (active == 'jump_2') {
      let gird = node.gird.jump_2;
      let dy = node.y - this.deltaY * ctor.speed_jump2;
      if (dy > node.gird.jump_1.endy) {
        node.x = node.gird.jump_1.endx;
        node.y = node.gird.jump_1.endy;
        jump_2.x = jump_2.bx;
        jump_2.y = jump_2.by;
        jump_2.opacity = 0;
        jump_1.opacity = 255;
        active = 'jump_1';
      }
      else {
        if (dy > gird.endy) {
          node.x -= gird.ratiox * this.deltaY * ctor.speed_jump2;
          node.y = dy;
          jump_2.x += (jump_2.bx - jump_2.endx) / gird.deltax * this.deltaY * gird.ratiox * ctor.speed_jump2;
          jump_2.y -= (jump_2.endy - jump_2.by) / gird.deltay * this.deltaY * ctor.speed_jump2;
        }
        else {
          node.x = gird.endx;
          node.y = gird.endy;
          jump_2.opacity = 0;
          jump_2.x = jump_2.endx;
          jump_2.y = jump_2.endy;
          jump_3.visible = true;
          active = 'role_drop';
        }
      }
    }
    else if (active == 'role_drop') {
      let gird = node.gird.jump_2;
      let dy = role.y - this.deltaY * ctor.speed_role;
      if (dy > role.by) {
        jump_2.opacity = 255;
        jump_3.visible = false;
        active = 'jump_2';
      }
      else {
        if (dy > role.endy) {
          role.y = dy;
          node.y += (-gird.endy - 200) / (role.by - role.endy) * this.deltaY * ctor.speed_role;
        }
        else {
          node.y = -200;
          role.y = role.endy;
          this.dead.visible = true;
          active = 'map_out';
        }
      }
    }
    else if (active == 'map_out') {
      let topacity = node.opacity - this.deltaY * ctor.opacityspeed;
      if (topacity > 255) {
        node.opacity = 255;
        active = 'role_drop';
        this.dead.visible = false;
      }
      else {
        if (topacity > node.endopacity) {
          node.opacity = topacity;
        }
        else {
          node.opacity = node.endopacity;
          this.dead.visible = true;
          node.visible = false;
          this.active = 'dead';
          v_main.music_id = 'dead';
          return;
        }
      }
    }
    node.active = active;
  },
  loadDead: function () {
    let ctor = GameManager.getController("dead");
    var node = new cc.Node();
    let map = new cc.Sprite(`#map_7.jpg`);
    let mapscale = 640 / 480;
    node.addChild(map);
    node.attr({
      anchorX: 0,
      anchorY: 0,
      cascadeOpacity: true,
      opacity: 255,
      x: 0,
      y: winSize.height - map.height * mapscale,
      bx: 0,
      by: winSize.height - map.height * mapscale,
      visible: false,
      active: 'map',
      endopacity: ctor.endopacity
    })
    map.attr({
      anchorX: 0,
      anchorY: 0,
      x: 0,
      y: 0,
      scale: mapscale
    });
    this.dead = node;
    this.addChild(node, ctor.zindex);
  },
  onMoveDead: function () {
    let ctor = GameManager.getController('dead');
    let node = this.dead;
    let active = node.active;
    let dy = node.y + this.deltaY * ctor.speed;
    if (active == 'map') {
      if (dy < node.by) {
        node.y = node.by;
        this.jonie.visible = true;
        this.active = 'jonie';
        v_main.music_id = 'jonie';
        return;
      }
      else {
        if (dy <= 0) {
          node.y = dy;
        }
        else {
          node.y = 0;
          active = 'map_out';
          this.bell.visible = true;
        }
      }
    }
    else if (active == 'map_out') {
      let topacity = node.opacity - this.deltaY * ctor.opacityspeed;
      if (topacity > 255) {
        node.opacity = 255;
        active = 'map';
        this.bell.visible = false;
      }
      else {
        if (topacity > node.endopacity) {
          node.opacity = topacity;
        }
        else {
          node.opacity = node.endopacity;
          node.visible = false;
          this.bell.visible = true;
          this.active = 'bell';
          return;
        }
      }
    }
    node.active = active;
  },
  loadBell: function () {
    let ctor = GameManager.getController("bell");
    var node = new cc.Node();
    var xi = new cc.Node();
    var word = new cc.Node();
    let map = new cc.Sprite(`#map_8.jpg`);
    let xi_1 = new cc.Sprite(`#map_8_role_1.png`);
    let xi_2 = new cc.Sprite(`#map_8_role_5.png`);
    let bell = new cc.Sprite(`#map_8_role_2.png`);
    let hand = new cc.Sprite(`#map_8_role_3.png`);
    let bell_mask = new cc.Sprite(`#map_8_role_4.png`);
    let word_1 = this.loadWord(3);
    let word_2 = this.loadWord(4);
    let word_3 = this.loadWord(5);
    let mapscale = 1.6;
    let gird = {
      bell_1: {
        endx: 280,
        endy: -600,
        endrotation: -60,
        ratiox: 120 / 50,
        ratior: 60 / 50
      },
      bell_2: {
        endx: 220,
        endy: -650,
        endrotation: -90,
        ratiox: 60 / 50,
        ratior: 30 / 50
      },
      bell_3: {
        endx: 320,
        endy: -2400,
        endrotation: -720,
        ratiox: 100 / 1750,
        ratior: 630 / 1750
      }
    };
    node.addChild(map);
    node.addChild(xi);
    node.addChild(word);
    xi.addChild(xi_2);
    xi.addChild(xi_1);
    xi.addChild(bell);
    xi.addChild(hand);
    bell.addChild(bell_mask);
    word.addChild(word_1);
    word.addChild(word_2);
    word.addChild(word_3);
    node.attr({
      anchorX: 0,
      anchorY: 0,
      cascadeOpacity: true,
      opacity: 255,
      x: 0,
      y: winSize.height - map.height * mapscale,
      bx: 0,
      by: winSize.height - map.height * mapscale,
      endy: 0,
      xi: xi,
      word_1: word_1,
      word_2: word_2,
      word_3: word_3,
      bell_mask: bell_mask,
      gird: gird,
      active: 'xi_1',
      visible: false,
      endopacity: ctor.endopacity
    })
    map.attr({
      anchorX: 0,
      anchorY: 0,
      x: 0,
      y: 0,
      scale: mapscale
    });
    xi.attr({
      anchorX: 0,
      anchorY: 1,
      cascadeOpacity: true,
      opacity: 255,
      x: 0,
      y: map.height * mapscale - 100,
      xi_1: xi_1,
      xi_2: xi_2,
      bell: bell
    });
    xi_1.attr({
      anchorX: 0,
      anchorY: 1,
      x: 0,
      y: 0,
      opacity: 255
    });
    xi_2.attr({
      anchorX: 0,
      anchorY: 1,
      x: 0,
      y: -20,
      opacity: 255
    });
    hand.attr({
      anchorX: 0,
      anchorY: 0,
      x: 0,
      y: -810,
      by: -810
    });
    bell.attr({
      anchorX: 0.5,
      anchorY: 0.5,
      x: 400,
      y: - 550,
      rotation: 0,
      bx: 400,
      by: - 550,
      brotation: 0,
      bell_mask: bell_mask
    });
    bell_mask.attr({
      anchorX: 0.5,
      anchorY: 0,
      x: 230,
      y: -50,
      opacity: 0
    });
    word.attr({
      x: 0,
      y: 130
    })
    word_1.attr({
      x: 0,
      y: 0
    })
    word_2.attr({
      x: 0,
      y: 15
    })
    word_3.attr({
      x: 0,
      y: 35
    })
    this.bell = node;
    this.addChild(node, ctor.zindex);
  },
  onMoveBell: function () {
    let ctor = GameManager.getController('bell');
    let node = this.bell;
    let active = node.active;
    let xi = node.xi;
    if (active == 'xi_1') {
      let xi_1 = xi.xi_1;
      let topacity = xi_1.opacity - this.deltaY * ctor.opacityspeed;
      if (topacity > 255) {
        xi_1.opacity = 255;
        this.active = 'dead';
        this.dead.visible = true;
        return;
      }
      else {
        if (topacity > 0) {
          xi_1.opacity = topacity;
        }
        else {
          xi_1.opacity = 0;
          active = "bell_1";
        }
      }
    }
    else if (active == 'bell_1') {
      let bell = xi.bell;
      let gird = node.gird.bell_1;
      let dy = this.deltaY * ctor.bell_1speed;
      let ty = bell.y - dy;
      if (ty > bell.by) {
        bell.x = bell.bx;
        bell.y = bell.by;
        bell.rotation = bell.brotation;
        active = 'xi_1';
      }
      else {
        if (ty > gird.endy) {
          bell.y = ty;
          bell.x -= dy * gird.ratiox;
          bell.rotation -= dy * gird.ratior;
        }
        else {
          bell.x = gird.endx;
          bell.y = gird.endy;
          bell.rotation = gird.endrotation;
          active = 'bell_2';
        }
      }
    }
    else if (active == 'bell_2') {
      let bell = xi.bell;
      let gird = node.gird.bell_2;
      let dy = this.deltaY * ctor.bell_2speed;
      let ty = bell.y - dy;
      if (ty > node.gird.bell_1.endy) {
        bell.x = node.gird.bell_1.endx;
        bell.y = node.gird.bell_1.endy;
        bell.rotation = node.gird.bell_1.endrotation;
        active = 'bell_1';
      }
      else {
        if (ty > gird.endy) {
          bell.y = ty;
          bell.x -= dy * gird.ratiox;
          bell.rotation -= dy * gird.ratior;
        }
        else {
          bell.x = gird.endx;
          bell.y = gird.endy;
          bell.rotation = gird.endrotation;
          active = 'bell_3';
        }
      }
    }
    else if (active == 'bell_3') {
      let bell = xi.bell;
      let gird = node.gird.bell_3;
      let dy = this.deltaY * ctor.bell_3speed;
      let ty = bell.y - dy;
      if (ty > node.gird.bell_2.endy) {
        bell.x = node.gird.bell_2.endx;
        bell.y = node.gird.bell_2.endy;
        bell.rotation = node.gird.bell_2.endrotation;
        active = 'bell_2';
      }
      else {
        if (ty > gird.endy) {
          let ny = (node.endy - node.by) / (gird.endy - node.gird.bell_2.endy) * dy;
          node.y -= ny;
          bell.y = ty;
          bell.x += dy * gird.ratiox;
          bell.rotation -= dy * gird.ratior;
        }
        else {
          node.y = node.endy;
          bell.x = gird.endx;
          bell.y = gird.endy;
          bell.rotation = gird.endrotation;
          bell.bell_mask.opacity = 255;
          active = 'word_1';
        }
      }
    }
    else if (active == 'word_1') {
      let deltyopacity = this.deltaY * ctor.word_1speed;
      let flag = this.onFadeWord(node.word_1, deltyopacity*GameManager.wordspeed_s);
      if (flag == 'finished') {
        node.word_1.visible = false;
        active = 'word_2';
      }
      else if (flag == 'reback') {
        xi.bell.bell_mask.opacity = 0;
        active = 'bell_3';
      }
    }
    else if (active == 'word_2') {
      let deltyopacity = this.deltaY * ctor.word_2speed;
      let flag = this.onFadeWord(node.word_2, deltyopacity*GameManager.wordspeed_f);
      if (flag == 'finished') {
        node.word_2.visible = false;
        active = 'word_3';
      }
      else if (flag == 'reback') {
        node.word_1.visible = true;
        active = 'word_1';
      }
    }
    else if (active == 'word_3') {
      let deltyopacity = this.deltaY * ctor.word_3speed;
      let flag = this.onFadeWord(node.word_3, deltyopacity*GameManager.wordspeed_n);
      if (flag == 'finished') {
        this.pushclock.visible = true;
        active = 'map_out';
      }
      else if (flag == 'reback') {
        node.word_2.visible = true;
        active = 'word_2';
      }
    }
    else if (active == 'map_out') {
      let topacity = node.opacity - this.deltaY * ctor.opacityspeed;
      if (topacity > 255) {
        node.opacity = 255;
        active = 'word_3';
        this.pushclock.visible = false;
      }
      else {
        if (topacity > node.endopacity) {
          node.opacity = topacity;
        }
        else {
          node.opacity = node.endopacity;
          this.pushclock.visible = true;
          node.visible = false;
          this.active = 'pushclock';
          return;
        }
      }
    }
    node.active = active;
  },
  loadPushClock: function () {
    let ctor = GameManager.getController("pushclock");
    var node = new cc.Node();
    let map = new cc.Sprite(`#map_9.jpg`);
    let mapscale = 640 / 510;
    node.addChild(map);
    node.attr({
      anchorX: 0,
      anchorY: 0,
      cascadeOpacity: true,
      opacity: 255,
      x: 0,
      y: winSize.height - map.height * mapscale,
      bx: 0,
      by: winSize.height - map.height * mapscale,
      visible: false,
      active: 'map',
      endopacity: ctor.endopacity
    })
    map.attr({
      anchorX: 0,
      anchorY: 0,
      x: 0,
      y: 0,
      scale: mapscale
    });
    this.pushclock = node;
    this.addChild(node, ctor.zindex);
  },
  onMovePushClock: function () {
    let ctor = GameManager.getController('pushclock');
    let node = this.pushclock;
    let active = node.active;
    let dy = node.y + this.deltaY * ctor.speed;
    if (active == 'map') {
      if (dy < node.by) {
        node.y = node.by;
        this.bell.visible = true;
        this.active = 'bell';
        return;
      }
      else {
        if (dy <= 0) {
          node.y = dy;
        }
        else {
          node.y = 0;
          active = 'map_out';
          if (v_main.hasended) {
            this.turnclock.visible = true;
          }
        }
      }
    }
    else if (active == 'map_out') {
      let topacity = node.opacity - this.deltaY * ctor.opacityspeed;
      if (topacity > 255) {
        node.opacity = 255;
        active = 'map';
        if (v_main.hasended) {
          this.turnclock.visible = false;
        }
      }
      else {
        if (topacity > node.endopacity) {
          node.opacity = topacity;
        }
        else {
          if (v_main.hasended) {
            node.opacity = node.endopacity;
            this.turnclock.visible = true;
            node.visible = false;
            this.active = 'turnclock';
            v_main.music_id = 'end';
          }
          else {
            this.touch = false;
            v_main.canPlay = false;
            this.active = 'video';
            this.deltaY = 0;
            v_main.active = "video";
          }
          return;
        }
      }
    }
    node.active = active;
  },
  loadTurnClock: function () {
    let ctor = GameManager.getController("turnclock");
    var node = new cc.Node();
    let map = new cc.Sprite(`#map_10.jpg`);
    let clock_1 = new cc.Sprite(`#map_10_clock_1.png`);
    let clock_2 = new cc.Sprite(`#map_10_clock_2.png`);
    let clock_3 = new cc.Sprite(`#map_10_clock_2.png`);
    let mapscale = 640 / 452;
    node.addChild(map);
    //node.addChild(clock_3);
    node.addChild(clock_2);
    node.addChild(clock_1);
    node.attr({
      anchorX: 0,
      anchorY: 0,
      cascadeOpacity: true,
      opacity: 255,
      x: 0,
      y: winSize.height - map.height * mapscale,
      bx: 0,
      by: winSize.height - map.height * mapscale,
      endy: - map.height * mapscale + winSize.height + 1100 - winSize.height / 2,
      clock_1: clock_1,
      clock_2: clock_2,
      clock_3: clock_3,
      visible: false,
      active: 'map'
    });
    map.attr({
      anchorX: 0,
      anchorY: 0,
      x: 0,
      y: 0,
      scale: mapscale
    });
    clock_1.attr({
      anchorX: 0.5,
      anchorY: 0,
      x: 320,
      y: map.height * mapscale - 1105,
      rotation: 75,
      brotation: 75,
      endrotation: 903,
      scale: 0.75
    });
    clock_2.attr({
      anchorX: 0.5,
      anchorY: 0,
      x: 320,
      y: map.height * mapscale - 1105,
      rotation: 217,
      brotation: 217,
      endrotation: 286
    });
    clock_3.attr({
      anchorX: 0.5,
      anchorY: 0,
      x: 320,
      y: map.height * mapscale - 1105,
      rotation: 0,
      brotation: 0,
      endrotation: 13.8
    });
    this.turnclock = node;
    this.addChild(node, ctor.zindex);
  },
  onMoveTurnClock: function () {
    let ctor = GameManager.getController('turnclock');
    let node = this.turnclock;
    let clock_1 = node.clock_1;
    let clock_2 = node.clock_2;
    let clock_3 = node.clock_3;
    let active = node.active;
    let dy = node.y + this.deltaY * ctor.speed;
    if (active == 'map') {
      if (dy < node.by) {
        node.y = node.by;
        this.pushclock.visible = true;
        this.active = 'pushclock';
        v_main.music_id = 'dead';
        return;
      }
      else {
        if (dy <= node.endy) {
          node.y = dy;
        }
        else {
          node.y = node.endy;
          active = 'turn';
        }
      }
    }
    else if (active == 'turn') {
      let trotate = clock_1.rotation + this.deltaY * ctor.turnspeed;
      if (trotate < clock_1.brotation) {
        clock_1.rotation = clock_1.brotation;
        clock_2.rotation = clock_2.brotation;
        clock_3.rotation = clock_3.brotation;
        active = 'map';
      }
      else {
        if (trotate <= clock_1.endrotation) {
          let trotate2 = clock_2.rotation + this.deltaY * ctor.turnspeed / 12;
          let trotate3 = clock_3.rotation + this.deltaY * ctor.turnspeed / 60;
          clock_1.rotation = trotate;
          clock_2.rotation = trotate2;
          clock_3.rotation = trotate3;
        }
        else {
          this.touch = false;
          v_main.canPlay = false;
          this.active = 'video';
          this.deltaY = 0;
          node.runAction(this.onMoveToTv(function () {
            v_main.active = 'video';
            console.log("all end");
          }));
          node.y = node.endy;
          clock_1.rotation = clock_1.endrotation;
          clock_2.rotation = clock_2.endrotation;
          clock_3.rotation = clock_3.endrotation;
          return;
        }
      }
    }
    node.active = active;
  },
  onFadeWord: function (node, deltyopacity) {
    let wordlist = node.wordlist;
    let count_0 = 0;
    let count_255 = 0;
    let flag = 'ing';
    if (deltyopacity > 0) {
      for (let i = 0; i < wordlist.length; i++) {
        if (wordlist[i].opacity < 255) {
          let topacity = wordlist[i].opacity + deltyopacity;
          wordlist[i].opacity = topacity < 255 ? topacity : 255;
          break;
        }
      }
    }
    else {
      for (let i = wordlist.length - 1; i >= 0; i--) {
        if (wordlist[i].opacity > 0) {
          let topacity = wordlist[i].opacity + deltyopacity;
          wordlist[i].opacity = topacity > 0 ? topacity : 0;
          break;
        }
      }
    }
    wordlist.forEach((item) => {
      if (item.opacity <= 0) {
        item.opacity = 0;
        count_0++;
      }
      else if (item.opacity == 255) {
        item.opacity = 255;
        count_255++;
      }
    })
    if (count_0 == wordlist.length) {
      flag = 'reback';
    }
    else if (count_255 == wordlist.length) {
      flag = 'finished';
    }
    return flag;
  },
  loadWord: function loadWord(word_n) {
    var word = new cc.Node();
    word.wordlist = [];
    var array = [
      [],
      [1, 2, 3, 4, 5, 6],
      [[1, 2], [3, 4, 5, 6, 7, 8, 9, 10, 11, 12], [13, 14, 15, 16, 17, 18]],
      [[1], [2]],
      [[1, 2, 3, 4, 5, 6], [7, 8, 9, 10, 11, 12, 13, 14, 15], [16, 17, 18, 19, 20]],
      [1, 2, 3, 4, 5, 6],
      [],
      [1, 2, 3, 4, 5, 6, 7, 8, 9]
    ];
    var rowy = [[0], [0], [79, 44, 0], [89, 0], [85, 45, 0], [0], [0], [0]];
    var nodei = [];
    var nodej = [];
    var nodek = [];
    array[word_n].forEach(function (item_i, index_i) {
      if (word_n == 2 || word_n == 3 || word_n == 4) {
        item_i.forEach(function (item_j) {
          var a = new cc.Sprite("#word_" + word_n + "_" + item_j + ".png");
          a.attr({
            anchorX: 0,
            anchorY: 0,
            opacity: 0
          });
          index_i == 0 ? nodei.push(a) : index_i == 1 ? nodej.push(a) : nodek.push(a);
          word.addChild(a);
          word.wordlist.push(a);
        });
      } else {
        var a = new cc.Sprite("#word_" + word_n + "_" + item_i + ".png");
        a.attr({
          anchorX: 0,
          anchorY: 0,
          opacity: 0
        });
        nodei.push(a);
        word.addChild(a);
        word.wordlist.push(a);
      }
    });
    nodei.forEach(function (item, index) {
      var x = 0;
      if (index > 0) {
        nodei.forEach(function (items, indexs) {
          if (index > indexs) {
            x += items.width;
          }
        });
      }
      item.attr({
        x: x,
        y: rowy[word_n][0]
      });
    });
    if (word_n == 2 || word_n == 3 || word_n == 4) {
      nodej.forEach(function (item, index) {
        var x = 0;
        if (index > 0) {
          nodej.forEach(function (items, indexs) {
            if (index > indexs) {
              x += items.width;
            }
          });
        }

        item.attr({
          x: x,
          y: rowy[word_n][1]
        });
      });
      if (word_n == 2 || word_n == 4) {
        nodek.forEach(function (item, index) {
          var x = 0;
          if (index > 0) {
            nodek.forEach(function (items, indexs) {
              if (index > indexs) {
                x += items.width;
              }
            });
          }
          item.attr({
            x: x,
            y: rowy[word_n][2]
          });
        });
      }
    }
    return word;
  },
  onMoveToTv: function (callback) {
    let move = cc.moveTo(1.5, 0, 0);
    let cb = new cc.callFunc(() => {
      callback();
    });
    return cc.sequence(move, cb);
  }
});
