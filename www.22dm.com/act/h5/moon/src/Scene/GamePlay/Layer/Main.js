var GPMainLayer = cc.Layer.extend({
  belt: null,
  timer : -1,
  ctor: function () {
    this._super();
  },
  onEnter: function () {
    this._super();
    this.loadBelt();
    this.registerEvent();
    this.scheduleUpdate();
  },
  onExit: function () {
    this._super();
  },
  registerEvent: function () {
    // var a = cc.EventListener.create({
    //   event: cc.EventListener.TOUCH_ONE_BY_ONE,
    //   swallowTouches: false,
    //   onTouchBegan: function (touch, event) {
    //     let target = event.getCurrentTarget();
    //     let location = touch.getLocation();
    //     console.log(location);
    //     // target.moon.x = location.x;
    //     // target.moon.y = location.y;
    //     return true;
    //   }
    // });
    // cc.eventManager.addListener(a, this);

    var b = cc.EventListener.create({
      event: cc.EventListener.CUSTOM,
      target: this,
      eventName: jf.EventName.GP_ON_COMBO,
      callback: this.onLoadCombo
    });
    cc.eventManager.addListener(b, this);

    var c = cc.EventListener.create({
      event: cc.EventListener.CUSTOM,
      target: this,
      eventName: jf.EventName.GP_LOAD_GUIDE_MOON,
      callback: this.onLoadGuideMoon
    });
    cc.eventManager.addListener(c, this);
  },
  loadBelt: function () {
    let belt = new cc.Sprite("#belt.png");
    let scale = 1;
    if(winSize.width<1194){
      scale = (winSize.width /1194).toFixed(4) * 1;
      scale = scale < 0.9125 ? 0.9125 : scale;
    }
    belt.attr({
      anchorX: 0.5,
      anchorY: 0,
      x: winSize.width >> 1,
      y: 0,
      scale : scale,
      btn : [],
      laser : []
    })
    this.belt = belt;
    this.loadBeltLaser(belt);
    this.loadBeltBtn(belt);
    this.loadLan();
    this.addChild(belt);
    GameManager.spriteBelt = belt;
  },
  loadBeltLaser: function (belt) {
    GameManager.belt.sequence.split("").forEach((item,index) => {
      let node = new cc.Sprite(`#laser_${item}.png`);
      let setting = GameManager.belt.laser[index];
      node.attr({
        anchorX: 0.5,
        anchorY: 0,
        x: setting.x,
        y: setting.y,
        scale : setting.s
      })
      belt.addChild(node, 200);
      belt.laser.push(node);
    })
  },
  loadBeltBtn: function (belt) {
    let btn = GameManager.belt.btn;
    GameManager.belt.sequence.split("").forEach((item,index) => {
      let node = new cc.Sprite(`#btn_${item}.png`);
      let setting = GameManager.belt.btn[index];
      node.attr({
        anchorX: 0.5,
        anchorY: 0,
        x: setting.x,
        y: setting.y,
        working : false
      })
      belt.addChild(node, setting.z);
      belt.btn.push(node);
    })
  },
  onLoadMoon: function (type) {
    let setting = GameManager.moonSetting[type];
    let moon = new cc.Node();
    let base = new cc.Sprite(`#m_${type}_1.png`);
    let design = new cc.Sprite(`#m_${type}_2.png`);
    moon.attr({
      anchorX : 0.5,
      anchorY : 0.5,
      width: 144,
      height: 112,
      x: setting.bx,
      y: setting.by,
      scale: setting.bs,
      id : v_main.Game_mooncount++,
      type : type,
      laser : false,
      design : design
    })
    base.attr({
      x: 144 >> 1,
      y: 112 >> 1
    })
    design.attr({
      x: 144 >> 1,
      y: 112 >> 1,
      visible : false
    })
    moon.addChild(base);
    moon.addChild(design);
    this.belt.addChild(moon,10);
    GameManager.currMoonPool.push(moon);
    moon.runAction(ActionManager.GP_MOVE_MOON(setting,function(){
      this.onRemoveMoon(moon);
    }.bind(this)));
  },
  onRemoveMoon : function(moon){
    if(!moon.laser && v_main.canPlay){
      this.onLoadMiss(moon.type);
    }
    for(let i=0;i<GameManager.currMoonPool.length;i++){
      if(moon == GameManager.currMoonPool[i]){
        GameManager.currMoonPool.splice(i,1);
        moon.removeFromParent();
        return;
      }
    }
  },
  onLoadMiss : function(type){
    let locationx = [260,480,700,940];
    let miss = new cc.Sprite(`#miss.png`);
    miss.attr({
      x : locationx[GameManager.belt.sequence.split("").indexOf(type)],
      y : 170
    })
    this.belt.addChild(miss,500);
    miss.runAction(ActionManager.GP_ON_MISS(() => {
      miss.removeFromParent();
    }));
    v_main.Game_miss++;
  },
  onLoadCombo : function(event){
    let self = event.getCurrentTarget();
    let data = event.getUserData();
    let combo = new cc.Sprite(`#${data.type}.png`);
    combo.attr({
      x : self.belt.width>>1,
      y : 530,
      opacity : 0
    });
    self.belt.addChild(combo,500);
    combo.runAction(ActionManager.GP_ON_COMBO(() => {
      combo.removeFromParent();
    }))
  },
  update : function(dt){
    this.timer+= dt;
    if(v_main.canPlay && this.timer>v_main.Game_beltspeed){
      let sequence = GameManager.belt.sequence.split("");
      GameManager.currMoonPool.forEach(item => {
        if(!item.laser && item.y > 250){
          let indexof = sequence.indexOf(item.type);
          if(indexof != -1){
            sequence.splice(indexof,1);
          }
        }
      });
      if(sequence.length==0){
        sequence = GameManager.belt.sequence.split("");
      }
      this.onLoadMoon(sequence[Math.round(Math.random()*(sequence.length-1))]);
      this.timer=0;
    }
  },
  onLoadGuideMoon : function(event){
    let self = event.getCurrentTarget();
    let type = "r";
    let setting = GameManager.moonSetting[type];
    let moon = new cc.Node();
    let base = new cc.Sprite(`#m_${type}_1.png`);
    let design = new cc.Sprite(`#m_${type}_2.png`);
    moon.attr({
      anchorX : 0.5,
      anchorY : 0.5,
      width: 144,
      height: 112,
      x: setting.bx,
      y: setting.by,
      scale: setting.bs
    })
    base.attr({
      x: 144 >> 1,
      y: 112 >> 1
    })
    design.attr({
      x: 144 >> 1,
      y: 112 >> 1,
      visible : false
    })
    moon.addChild(base);
    moon.addChild(design);
    GameManager.spriteGuide = moon;
    self.belt.addChild(moon,10);
    let lasersetting = {};
    lasersetting.tx = 650;
    lasersetting.ty = 327 + 45;
    lasersetting.ts = 0.7;
    moon.runAction(ActionManager.GP_GUIDE_MOON(lasersetting));
  },
  loadLan : function () {
    let lan = new cc.Sprite("#role_l.png");
    lan.attr({
      anchorX : 0.5,
      anchorY : 0,
      x : 80,
      y : 0
    })
    this.belt.addChild(lan,-1);
  }
});