var GPMainLayer = cc.Layer.extend({
  part7: null,
  pIndex: { part1: 100, part2: 90, part3: 80, part4: 70, part5: 60, part7: 50, partEnd: 500 },
  ctor: function () {
    this._super();
  },
  onEnter: function () {
    this._super();
    this.registerEvent();
    this.loadPart1();
    //vm.end = { id: 3, sex: 1, foot: 1, year: 15, title: 1, word: 1, poster: false, share: false };
    //cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName["GP_BUS"]));
  },
  onExit: function () {
    this._super();
  },
  registerEvent: function () {
    let a = cc.EventListener.create({
      event: cc.EventListener.CUSTOM,
      target: this,
      eventName: jf.EventName.GP_BUS,
      callback: this.onLoadPart7
    });
    cc.eventManager.addListener(a, this);

    let b = cc.EventListener.create({
      event: cc.EventListener.CUSTOM,
      target: this,
      eventName: jf.EventName.GP_BUS_OUT,
      callback: this.onRemovePart7
    });
    cc.eventManager.addListener(b, this);

    let c = cc.EventListener.create({
      event: cc.EventListener.CUSTOM,
      target: this,
      eventName: jf.EventName.GP_END,
      callback: this.onLoadPartEnd
    });
    cc.eventManager.addListener(c, this);
  },
  loadPartNode: function (name) {
    let node = new cc.Node();
    node.attr({
      width: winSize.width,
      height: winSize.height,
      anchorX: 0.5,
      anchorY: 0.5,
      x: winSize.width / 2,
      y: winSize.height / 2,
      cascadeOpacity: true,
      name: name,
      scale: 1
    })
    return node;
  },
  loadPartPile: function (name, count, opacity) {
    let sequence = [];
    let node = new cc.Node();
    for (let i = 1; i <= count; i++) {
      let tmp = new cc.Sprite(`#${name}${i}.png`);
      tmp.opacity = opacity;
      sequence.push(tmp);
    }
    node.attr({
      width: sequence[0].width,
      height: sequence[0].height,
      sequence: sequence
    });
    sequence.forEach(item => {
      node.addChild(item);
    });
    return node;
  },
  loadPart1: function () {
    let part = this.loadPartNode("part1");
    let top = new cc.Sprite("#p1_top.png");
    let floor = new cc.Sprite("#p1_floor.png");
    let role = new cc.Node();
    let role1 = new cc.Sprite("#p1_role_1.png");
    let role2 = new cc.Sprite("#p1_role_2.png");
    let cloud = new cc.Sprite("#p1_cloud.png");
    let word = new cc.Node();
    this.loadWord(word, 1);
    top.attr({
      anchorX: 0,
      anchorY: 1,
      x: 0,
      y: winSize.height * (2 - winSize.scale)
    });
    floor.attr({
      anchorX: 0,
      anchorY: 0,
      x: 0,
      y: 0
    });
    role.attr({
      anchorX: 0.5,
      anchorY: 0,
      y: 50 * winSize.scale
    });
    role1.attr({
      x: winSize.width + role1.width / 2,
      y: role1.height / 2
    })
    role2.attr({
      x: role1.x,
      y: role1.y,
      visible: false
    })
    cloud.attr({
      x: role1.x + 250,
      y: role1.y - 220,
      visible: false
    })
    part.addChild(floor);
    part.addChild(top);
    part.addChild(role);
    role.addChild(role1);
    role.addChild(role2);
    role.addChild(cloud);
    this.addChild(part, this.pIndex.part1);
    this.addChild(word, this.pIndex.part1 + 1);
    this.runAction(ActionManager.GP_DELAY(0.5, () => {
      this.onFadeWord(word, 0, () => { });
      let speed = 5.5;
      let offsetX = -640 - role1.width;
      let offsetY = 350;
      let count = 12;
      role.runAction(ActionManager.GP_1_ROLEIN(speed, offsetX, offsetY, count, () => {
        count--;
        if (role1.visible) {
          role2.visible = true;
          role1.visible = false;
          cloud.visible = true;
        }
        else {
          role1.visible = true;
          role2.visible = false;
          cloud.visible = false;
        }
        if (count == 0) {
          part.runAction(ActionManager.GP_PART_CUT(GameManager.cutDuration, -150, -400 * winSize.scale, 2, () => {
            word.removeFromParent();
            part.removeFromParent();
            this.loadPart2();
          }));
        }
      }));
    }))
    cc.director.pause();
    vm.guide = 1;
  },
  loadPart2: function () {
    let part = this.loadPartNode("part2");
    let top = new cc.Sprite("#p2_top.jpg");
    let floor = new cc.Sprite("#p2_floor.jpg");
    let tv = new cc.Node();
    let tv1 = new cc.Sprite("#p2_tv_0.png");
    let tv2 = new cc.Sprite("#p2_tv_1.png");
    let bag = new cc.Sprite("#p2_bag.png");
    let fire = new cc.Sprite("#p2_fire.png");
    let remote = new cc.Sprite("#p2_remote.png");
    let role_1 = new cc.Sprite("#p2_role_1.png");
    let role_2 = new cc.Sprite("#p2_role_2.png");
    let role_3 = new cc.Sprite("#p2_role_3.png");
    let word = new cc.Node();
    this.loadWord(word, 2);
    top.attr({
      anchorX: 0.5,
      anchorY: 1,
      x: winSize.width / 2,
      y: winSize.height - winSize.offsetTop / winSize.scale,
      cascadeOpacity: true
    });
    floor.attr({
      anchorX: 0.5,
      anchorY: 0,
      x: winSize.width / 2,
      y: 0,
      cascadeOpacity: true
    });
    tv.attr({
      x: top.width / 2,
      y: top.height / 2 - 65,
      cascadeOpacity: true
    });
    tv1.attr({
      x: 0,
      y: 0
    });
    tv2.attr({
      x: tv1.x,
      y: tv1.y,
      opacity: 0
    });
    bag.attr({
      x: 200,
      y: -bag.height,
      scale: winSize.scale
    });
    fire.attr({
      x: 180,
      y: 420,
      scale: winSize.scale
    });
    remote.attr({
      x: floor.width / 2 + 180,
      y: floor.height / 2 + 125
    });
    role_1.attr({
      x: part.width + role_1.width / 2,
      y: part.height / 2 + 300
    });
    role_2.attr({
      x: part.width + role_2.width / 2,
      y: part.height / 2 + 600
    });
    role_3.attr({
      x: part.width + role_3.width / 2,
      y: part.height / 2
    });
    part.addChild(top);
    part.addChild(floor);
    part.addChild(word);
    part.addChild(role_1);
    part.addChild(role_2);
    part.addChild(role_3);
    top.addChild(tv);
    tv.addChild(tv1);
    tv.addChild(tv2);
    floor.addChild(fire);
    floor.addChild(bag);
    floor.addChild(remote);
    this.addChild(part, this.pIndex.part2);
    bag.runAction(ActionManager.GP_NODE_MOVE(GameManager.cutDuration, 0.5, 0, 200 + bag.height, bag.scale, () => {
      winSize.playEffect("bag", false);
      cc.director.pause();
      vm.guide = 2;
      this.onFadeWord(word, 0, () => { });
      remote.runAction(ActionManager.GP_NODE_MOVE(0.5, 0.4, -50, 50, 1.3, () => {
        tv2.runAction(ActionManager.GP_NODE_FADE(0.3, 255, () => {
          let tvtime = 3.5;
          this.runAction(ActionManager.GP_DELAY(tvtime, () => {
            let flytime = 2;
            this.loadPart3();
            role_1.runAction(ActionManager.GP_NODE_MOVE(0, flytime, -winSize.width - role_1.width, -600, 1, () => {
              part.runAction(ActionManager.GP_NODE_FADE(GameManager.cutDuration, 0, () => {
                part.removeFromParent();
              }));
            }))
            role_2.runAction(ActionManager.GP_NODE_MOVE(0.4, flytime, -winSize.width - role_2.width, -600, 1, () => { }))
            role_3.runAction(ActionManager.GP_NODE_MOVE(1, flytime, -winSize.width - role_3.width, -600, 1, () => { }))
            winSize.playEffect("fly", false);
          }))
        }))
      }));
    }));
  },
  loadPart3: function () {
    let part = this.loadPartNode("part3");
    let top = new cc.Sprite("#p3_top.jpg");
    let floor = new cc.Sprite("#p3_floor.png");

    let role = new cc.Sprite("#p3_role_1.png");
    let bag = new cc.Sprite("#p3_bag.png");
    let fire = new cc.Sprite("#p2_fire.png");
    let remote = new cc.Sprite("#p3_remote.png");
    let tu = this.loadPartPile("p3_tu", 5, 0);
    let hand = this.loadPartPile("p3_hand", 3, 255);
    let word = new cc.Node();
    this.loadWord(word, 3);

    top.attr({
      anchorX: 0,
      anchorY: 0,
      x: 0,
      y: 0,
      cascadeOpacity: true
    });
    floor.attr({
      anchorX: 0.5,
      anchorY: 0,
      x: winSize.width / 2,
      y: 0,
      cascadeOpacity: true
    });
    role.attr({
      x: top.width / 2 - 30,
      y: top.height / 2 - 220,
      cascadeOpacity: true
    });
    bag.attr({
      x: top.width / 2 + 320,
      y: top.height / 2 - 420,
    });
    fire.attr({
      x: winSize.width - fire.width / 2 - 20,
      y: 130
    });
    remote.attr({
      x: remote.width / 2 + 10,
      y: 220
    });
    tu.attr({
      anchorX: 0.5,
      anchorY: 0.5,
      x: winSize.width / 2 + (tu.width / 2 + 10),
      y: winSize.height * (2 - winSize.scale) - 80,
      cascadeOpacity: true
    });
    hand.attr({
      anchorX: 0.5,
      anchorY: 0.5,
      x: winSize.width / 2 + hand.width / 2,
      y: winSize.height / 2 + hand.height / 2,
      cascadeOpacity: true
    });
    hand.sequence[0].attr({
      x: -400,
      y: 400
    })
    hand.sequence[1].attr({
      x: 400,
      y: -400
    })
    hand.sequence[2].attr({
      visible: false
    })
    top.addChild(tu);
    top.addChild(role);
    top.addChild(bag);
    floor.addChild(fire);
    floor.addChild(remote);
    part.addChild(top);
    part.addChild(floor);
    part.addChild(hand);
    part.addChild(word);
    this.addChild(part, this.pIndex.part3);

    this.runAction(ActionManager.GP_DELAY(3, () => {
      role.runAction(ActionManager.GP_RUN_FRAMES("p3_role", "png", 2, 0.6));
      tu.sequence.forEach((item, index) => {
        item.runAction(ActionManager.GP_NODE_FADE_DELAY(0.7 * index, 0.5, 255, () => {
          if (index == 1) {
            this.onFadeWord(word, 0, () => { });
          }
          else if (index == tu.sequence.length - 1) {
            hand.sequence[0].runAction(ActionManager.GP_3_HAND_MOVE(1, -hand.sequence[0].x, -hand.sequence[0].y, () => { }))
            hand.sequence[1].runAction(ActionManager.GP_3_HAND_MOVE(1, -hand.sequence[1].x, -hand.sequence[1].y, () => {
              hand.sequence[2].visible = true;
              hand.sequence[1].visible = hand.sequence[0].visible = false;
              this.loadPart4();
              hand.sequence[2].runAction(ActionManager.GP_NODE_MOVE(0.3, 1.2, 0, 0, 3, () => { }))
              part.runAction(ActionManager.GP_NODE_FADE_DELAY(0.8, 0.8, 0, () => {
                part.removeFromParent();
              }))
            }))
          }
        }));
      })
    }))
  },
  loadPart4: function () {
    let part = this.loadPartNode("part4");
    let top = new cc.Sprite("#p4.jpg");
    let role = new cc.Node();
    let role1 = new cc.Sprite("#p4_role_1.png");
    let role2 = new cc.Sprite("#p4_role_2.png");
    let word = new cc.Node();
    this.loadWord(word, 4);
    top.attr({
      anchorX: 1,
      anchorY: 0.5,
      x: winSize.width,
      y: winSize.height / 2,
      cascadeOpacity: true,
      scale: 1.4
    });
    role.attr({
      anchorX: 0.5,
      anchorY: 0,
      y: 150 * winSize.scale
    });
    role1.attr({
      x: winSize.width + role1.width / 2,
      y: role1.height / 2
    })
    role2.attr({
      x: role1.x,
      y: role1.y,
      visible: false
    })
    part.addChild(top);
    role.addChild(role1);
    role.addChild(role2);
    part.addChild(role);
    part.addChild(word);
    this.addChild(part, this.pIndex.part4);

    let totalTime = 12;
    let footTime = 0.4;
    let moveTime = 2;
    let count = totalTime / footTime;
    top.runAction(ActionManager.GP_NODE_MOVE(2, totalTime - moveTime * 2, top.width * top.scale - winSize.width, 0, top.scale, () => { }))
    role.runAction(ActionManager.GP_4_ROLEIN(footTime, moveTime, totalTime, -(winSize.width / 2 + role1.width / 2), 0, () => {
      count--;
      if (role1.visible) {
        role2.visible = true;
        role1.visible = false;
      }
      else {
        role1.visible = true;
        role2.visible = false;
      }
      if (count == 0) {
        part.runAction(ActionManager.GP_NODE_FADE(GameManager.cutDuration, GameManager.cutOpacity, () => {
          part.removeFromParent();
          this.loadPart5();
        }));
      }
      else if (count == (totalTime / footTime) - 4) {
        winSize.playMusic("film");
      }
    }));
    this.onFadeWord(word, 0, () => { });

  },
  loadPart5: function () {
    let part = this.loadPartNode("part5");
    let top = new cc.Sprite(res.public_bg);
    let tu = this.loadPartPile("p5_d", 7, 0);
    let word = new cc.Node();
    this.loadWord(word, 5);
    top.attr({
      x: winSize.width / 2,
      y: winSize.height / 2,
      cascadeOpacity: true
    });
    tu.attr({
      anchorX: 0.5,
      anchorY: 0,
      x: winSize.width / 2 + (tu.width / 2) * winSize.scale,
      y: (tu.height / 2 - 50) * winSize.scale,
      scale: winSize.scale,
      cascadeOpacity: true
    });
    part.addChild(top);
    part.addChild(tu);
    part.addChild(word);
    this.addChild(part, this.pIndex.part5);
    this.onFadeWord(word, 0, () => { });
    let delayTime = 1;
    tu.sequence.forEach((item, index) => {
      item.runAction(ActionManager.GP_NODE_FADE_DELAY(delayTime + 1 * index, 0.5, 255, () => {
        if (index == tu.sequence.length - 1) {
          this.runAction(ActionManager.GP_DELAY(3.5, () => {
            tu.runAction(ActionManager.GP_PART_CUT(GameManager.cutDuration, 100, -200, 1.5, () => {
              winSize.playEffect("camera", false);
              vm.active = "friends";
              part.removeFromParent();
            }))
          }))
        }
      }));
    })
  },
  onLoadPartEnd: function (event) {
    let self = event.getCurrentTarget();
    self.removeAllChildren();
    vm.end.title = Math.floor(Math.random() * 4 + 1);
    vm.end.word = vm.end.id == 7 ? 1 : Math.floor(Math.random() * 2 + 1);
    let s = vm.end;
    let bg = new cc.Sprite(`#end_bg.jpg`);
    let mask = new cc.Sprite(`#end_mask.png`);
    let poster = new cc.Sprite(`#end_${s.id}.jpg`);
    let decorate = new cc.Sprite(`#end_d_${s.sex}.png`);
    let role = new cc.Sprite(`#end_role_${s.sex}.png`);
    let title = new cc.Sprite(`#end_title_${s.title}.png`);
    let word = new cc.Sprite(`#end_w_${s.id}_${s.word}.png`);
    let foot = new cc.Sprite(`#end_foot_${s.foot}.png`);
    let date = new cc.Sprite(`#end_0803.png`);
    let logo = new cc.Sprite(`#s_logo.png`);
    let bottom = new cc.Sprite(`#end_bottom.png`);
    bg.attr({
      x: winSize.width / 2,
      y: winSize.height / 2
    })
    mask.attr({
      x: bg.width / 2,
      y: bg.height / 2 + 20,
      scale: winSize.scale
    });
    poster.attr({
      x: mask.width / 2,
      y: mask.height / 2 + 70
    });
    decorate.attr({
      x: decorate.height / 2 + (s.sex == 1 ? -10 : 20),
      y: mask.height - decorate.height / 2 + + (s.sex == 1 ? 10 : -10)
    });
    role.attr({
      x: role.width / 2 + (s.sex == 1 ? 0 : 20),
      y: 80
    });
    foot.attr({
      anchorX: 1,
      anchorY: 1,
      x: mask.width - 15,
      y: title.height + 30
    });
    word.attr({
      anchorX: 0,
      anchorY: 0
    })
    title.attr({
      anchorX: 0,
      anchorY: 0
    })
    date.attr({
      x: mask.width - date.width / 2 - 13,
      y: mask.height - date.height / 2 + 22
    });
    logo.attr({
      anchorX: 0,
      anchorY: 0,
      x: 30,
      y: mask.height + 30
    });
    bottom.attr({
      anchorX: 0,
      anchorY: 1,
      x: 0,
      y: -60
    })
    mask.addChild(poster, -1);
    mask.addChild(decorate);
    mask.addChild(bottom);
    mask.addChild(role);
    mask.addChild(foot);
    foot.addChild(title);
    foot.addChild(word);
    mask.addChild(date);
    mask.addChild(logo);
    bg.addChild(mask);
    self.addChild(bg, self.pIndex.partEnd);
  },
  onLoadPart7: function (event) {
    let self = event.getCurrentTarget();
    let part = self.loadPartNode("part7");
    let top = new cc.Sprite("#p7_top.jpg");
    let role = new cc.Sprite("#p7_role.png");
    let word = new cc.Node();
    self.loadWord(word, 7);

    top.attr({
      x: winSize.width / 2,
      y: winSize.height / 2,
      cascadeOpacity: true
    });
    role.attr({
      anchorX: 0.14,
      anchorY: 1,
      x: 60,
      y: -70 + role.height,
      rotation: 0
    });
    part.addChild(top);
    part.addChild(word);
    top.addChild(role);
    role.runAction(ActionManager.GP_7_ROTATE(1, 0.5));
    self.onFadeWord(word, 0, () => {
      vm.guide = 3;
      winSize.playEffect("alert", false);
    })
    self.part7 = part;
    self.addChild(part, self.pIndex.part7);
    winSize.playEffect("bus", true);
  },
  onRemovePart7: function (event) {
    let self = event.getCurrentTarget();
    self.part7.removeFromParent();
    vm.guide = 0;
    vm.active = "chatbox";
    cc.audioEngine.stopAllEffects();
  },
  loadWord: function (node, part) {
    let setting = GameManager.getWordSetting(part);
    let wordlist = [];
    let sequence = [];
    setting.s.forEach((itemi, indexi) => {
      itemi.forEach((itemj, indexj) => {
        if (indexj == 0)
          wordlist.push([]);
        let w = new cc.Sprite(`#p${part}_w_${itemj}.png`);
        let x = indexj == 0 ? 0 : wordlist[indexi][indexj - 1].x + wordlist[indexi][indexj - 1].width;
        let y = indexi == 0 ? 0 : wordlist[indexi - 1][0].y - wordlist[indexi - 1][0].height;
        w.attr({
          anchorX: 0,
          anchorY: 1,
          x: x,
          y: y,
          opacity: 0,
          wid: itemj
        })
        wordlist[indexi].push(w);
        sequence.push(w);
        node.addChild(w);
      })
    });
    node.attr({
      x: setting.x,
      y: winSize.height + setting.y * winSize.scale,
      wordlist: sequence,
      worespeed: setting.d
    });
  },
  onFadeWord: function (word, count, callback) {
    let wordlist = word.wordlist;
    wordlist[count].runAction(ActionManager.GP_WORD_RUN(word.worespeed, () => {
      count++
      if (count != wordlist.length) {
        this.onFadeWord(word, count, callback);
      }
      else {
        callback();
      }
    }))
  }
});