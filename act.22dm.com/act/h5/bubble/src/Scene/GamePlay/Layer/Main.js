var GPMainLayer = cc.Layer.extend({
  well: null,
  currbubble: null,
  nextbubble: null,
  shoot: null,
  tiles: [],
  tileslayer: null,
  canupdate: false,
  ctor: function () {
    this._super();
  },
  onEnter: function () {
    this._super();
    this.tileslayer = new cc.Node();
    this.addChild(this.tileslayer);
    this.registerEvent();
    this.onloadInitTile();
    this.loadWellLayer();
    this.loadWell();
    this.scheduleUpdate();
  },
  onExit: function () {
    this._super();
  },
  registerEvent: function () {
    var a = cc.EventListener.create({
      event: cc.EventListener.TOUCH_ONE_BY_ONE,
      swallowTouches: true,
      onTouchBegan: function (touch, event) {
        if (!v_main.Game_over && v_main.canPlay) {
          let location = touch.getLocation();
          let target = event.getCurrentTarget();
          let well = target.well;
          if (location.y > well.y + 50 && location.y < winSize.height - 100) {
            v_main.canPlay = false;
            let dx = Math.abs(location.x - well.x);
            let dy = Math.abs(location.y - well.y);
            let angle = Math.floor(180 / (Math.PI / (Math.acos(dy / (Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)))))));
            well.runAction(ActionManager.GP_WELL_ROTATE(location.x > 320 ? angle : -angle, () => {
              target.onShootBubble({ dx: 640, dy: dy * 640 / dx, direction: location.x > 320 ? 1 : -1, angle: location.x > 320 ? angle : -angle });
            }));
          }
        }
      }
    });
    cc.eventManager.addListener(a, this);
  },
  onloadInitTile: function () {
    let tiles = GameManager.level.tiles;
    this.tiles = [];
    this.tileslayer.removeAllChildren();
    for (let i = 0; i < tiles.length; i++) {
      for (let j = 0; j < tiles[i].length; j++) {
        let t = tiles[i][j];
        if (typeof (t.type) !== "undefined" && t.type > 0) {
          let node = new cc.Sprite(`#tile_${t.type}.png`);
          let offsetX = j % 2 == 0 ? GameManager.tilewidth / 2 : GameManager.tilewidth / 2 + 39;
          t.px = t.x * GameManager.tilewidth + offsetX;
          t.py = winSize.height - 100 - t.y * GameManager.tileheight - GameManager.tileheight / 2 + t.y * 5;
          node.attr({
            x: t.px,
            y: t.py,
            id: t.id,
            type: t.type,
            removed: t.removed,
            processed: t.processed
          })
          this.tiles.push(node);
          this.tileslayer.addChild(node);
        }
      }
    }
    GameManager.turncounter = 0;
    refreshLevelRows();
    v_main.canPlay = true;
    this.canupdate = true;
  },
  onAddTileRows: function () {
    let tiles = GameManager.level.tiles;
    tiles.forEach((item, index) => {
      item.unshift(new Tile(index, 0, randRange(1, GameManager.bubblecolors)));
      GameManager.bubblecounter++;
    })
    for (var i = 0; i < tiles.length; i++) {
      for (var j = 1; j < tiles[i].length; j++) {
        tiles[i][j].y++;
      }
    }
    this.onloadInitTile();
  },
  onShootBubble: function (shootdata) {
    var that = this;
    let shoot = new cc.Sprite(`#tile_${this.currbubble.type}.png`);
    shoot.attr({
      anchorX: 0.5,
      anchorY: 0.5,
      width: GameManager.tilewidth,
      height: GameManager.tileheight,
      x: this.currbubble.getBoundingBoxToWorld().x + this.currbubble.getBoundingBoxToWorld().width / 2,
      y: this.currbubble.getBoundingBoxToWorld().y + this.currbubble.getBoundingBoxToWorld().height / 2,
      shootdata: shootdata,
      type: this.currbubble.type,
      id: GameManager.bubblecounter
    });
    this.currbubble.removeFromParent();
    this.tiles.push(shoot);
    this.tileslayer.addChild(shoot);
    this.shoot = shoot;
    shoot.runAction(ActionManager.GP_SHOOT_BUBBLE(shootdata));
    that.onloadWellMain(v_main.nextbubble);
    GameManager.bubblecounter++;
    winSize.playEffect("shoot");
  },
  loadWellLayer: function () {
    let background = new cc.Sprite("#player_bg.png");
    let role_1 = new cc.Sprite("#role_1.png");
    background.attr({
      anchorX: 0,
      anchorY: 0,
      x: 0,
      y: 0
    });
    role_1.attr({
      anchorX: 1,
      anchorY: 0,
      x: winSize.width - 20,
      y: 20
    });
    background.addChild(role_1);
    this.addChild(background, 100);
  },
  loadWell: function () {
    let well = new cc.Sprite("#well_bg.png");
    let well_mask = new cc.Sprite("#well_mask.png");
    well.attr({
      x: winSize.width / 2,
      y: well.height / 2 + 20,
      rotation: 0,
      mask: well_mask
    });
    well_mask.attr({
      x: well.width / 2,
      y: well.height / 2,
      visible: false
    });
    well.addChild(well_mask, 1);
    this.addChild(well, 150);
    this.well = well;
    this.onloadWellMain(1);
  },
  onloadWellMain: function (type) {
    let bubble = new cc.Sprite(`#tile_${type}.png`);
    bubble.attr({
      x: this.well.width / 2 + 2.25,
      y: this.well.height / 2 + 8.25,
      type: type
    });
    this.well.addChild(bubble, 0);
    this.currbubble = bubble;
    this.well.mask.visible = true;
    v_main.nextbubble = Math.round(Math.random() * 5 + 1);
  },
  update: function (dt) {
    if (!v_main.Game_over && this.canupdate) {
      this.canupdate = false;
      this.checkCollide();
    }
  },
  checkCollide: function () {
    if (this.shoot != null) {
      var shoot = this.shoot;
      var hasCollide = false;
      var level = GameManager.level;
      var box = shoot.getBoundingBoxToWorld();
      var y = Math.abs(Math.floor((winSize.height - 120 - (box.y)) / GameManager.tileheight));
      var offsetrows = y % 2;
      var offsetX = offsetrows == 0 ? GameManager.tilewidth / 2 : GameManager.tilewidth / 2 + 39;
      var x = Math.floor((box.x + box.width / 2 + offsetX) / GameManager.tilewidth) - 1;
      x = x < 0 ? 0 : x >= level.columns ? level.columns - 1 : x;
      var neighbors = getNeighbors2(x, y);
      var neighborsrect = getNeighborsRect(x, y);
      if (y <= 0 || neighbors.length > 0) {
        if (y <= 0 || neighbors.length>=3) {
          hasCollide = true;
        }
        else if (neighbors.length > 0) {
          var wallk = [[['lf'],['rf'],['r']],[['l'],['lf'],['rf']]];
          var wall = shoot.shootdata.direction == 1 ? wallk[0] : wallk[1];
          var wallr = [];
          var angled = 15;
          for(let i=0 ;i<wall.length;i++){
            if(neighborsrect[wall[i]]){
              wallr.push(wall[i]);
            }
          }
          console.log("x:"+x+",y:"+y+",angle:"+shoot.shootdata.angle+",wallr: "+wallr);
          if (wallr.length>=2) {
            hasCollide = true;
          }
          else if(wallr.length>0){
            if (shoot.shootdata.direction == 1) {
              if(x <5 ){
                if(neighborsrect.rf){
                  if(shoot.shootdata.angle>=angled && !neighborsrect.r){
                    x = x +1;
                    hasCollide = true;
                  }
                  else if(shoot.shootdata.angle<angled && !neighborsrect.lf){
                    x = x - (y%2);
                    y = y - 1;
                    hasCollide = true;
                  }
                }
                if(x==4){
                  if(hasTilesGird(5,y-1)){
                    if(hasTilesGird(4,y-1)){
                      hasCollide = true;
                    }
                    else if(shoot.shootdata.angle>=angled){
                      y = y - 1;
                      hasCollide = true;
                    }
                    else{
                      hasCollide = true;
                    }
                  }
                }
              }
              if (x == 5) {
                neighborsrect = getNeighborsRect(x, y);
                if(offsetrows == 0 && neighborsrect.rf){
                  hasCollide = true;
                }
                else if(offsetrows == 0 && !neighborsrect.rf){
                  y = y - 1;
                  hasCollide = true;
                }
                else if(offsetrows != 0 && neighborsrect.lf){
                  hasCollide = true;
                }
                else if(offsetrows != 0 && !neighborsrect.lf){
                  y = y - 1;
                  hasCollide = true;
                }
              }
            }
            if (shoot.shootdata.direction == -1) {
              if(x >0 ){
                if(neighborsrect.lf){
                  if(shoot.shootdata.angle<-angled && !neighborsrect.l){
                    x = x - 1;
                    hasCollide = true;
                  }
                  else if(shoot.shootdata.angle>-angled && !neighborsrect.rf){
                    x = x + (y%2);
                    y = y - 1;
                    hasCollide = true;
                  }
                }
                if(x==1){
                  if(hasTilesGird(0,y-1)){
                    if(hasTilesGird(1,y-1)){
                      hasCollide = true;
                    }
                    else if(shoot.shootdata.angle<-angled){
                      y = y - 1;
                      hasCollide = true;
                    }
                    else{
                      hasCollide = true;
                    }
                  }
                }
              }
              if (x == 0) {
                neighborsrect = getNeighborsRect(x, y);
                if(offsetrows == 0 && neighborsrect.rf){
                  hasCollide = true;
                }
                else if(offsetrows == 0 && !neighborsrect.rf){
                  y = y - 1;
                  hasCollide = true;
                }
                else if(offsetrows != 0 && !neighborsrect.lf){
                  hasCollide = true;
                }
                else if(offsetrows != 0 && !neighborsrect.lf){
                  y = y - 1;
                  hasCollide = true;
                }
              }
            }
          }
        }
        if (hasCollide) {
          this.shoot = null;
          x = x > 0 ? x : 0;
          x = x < 6 ? x : 5;
          y = y > 0 ? y : 0;
          addTiles(x, y, shoot.type, shoot.id);  
          if (checkTilesGird(x, y,shoot.id)) {
            let hasNewGird = getEmptyNeighbors(x, y);
            if (hasNewGird.length > 0) {
              let bindex = getBestEmptyNeighbors(x, y, hasNewGird, shoot);
              x = hasNewGird[bindex][0];
              y = hasNewGird[bindex][1];
              removeTilesById(shoot.id);
              addTiles(hasNewGird[bindex][0], hasNewGird[bindex][1], shoot.type, shoot.id);
              console.log("best girds:"+hasNewGird[bindex][0]+","+hasNewGird[bindex][1]);
            }
            else {
              v_main.Game_over = true;
              return;
            }
          }
          shoot.stopAllActions();
          offsetX = y % 2 == 0 ? GameManager.tilewidth / 2 : GameManager.tilewidth / 2 + 39;
          px = x * GameManager.tilewidth + offsetX;
          py = winSize.height - 100 - y * GameManager.tileheight - GameManager.tileheight / 2 + y * 5;
          shoot.attr({
            x: px,
            y: py
          })
          var clusterids = findClusters(shoot.id, shoot.type, getNeighbors2(x, y))
          if (clusterids.length >= 2) {
            shoot.runAction(ActionManager.GP_BUBBLE_FADE_OUT(function () {
              shoot.removeFromParent();
            }))
            removeTilesById(shoot.id);
            for (var i = 0; i < clusterids.length; i++) {
              removeTilesById(clusterids[i]);
              for (var j = 0; j < this.tiles.length; j++) {
                if (this.tiles[j].id == clusterids[i]) {
                  let ttt = this.tiles[j];
                  ttt.runAction(ActionManager.GP_BUBBLE_FADE_OUT(function () {
                    ttt.removeFromParent();
                  }))
                }
              }
            }
            v_main.Game_score += (clusterids.length + 1) * 5;
            GameManager.turncounter = 0;
            var floatingClusters = findFloatingClusters();
            for (var i = 0; i < floatingClusters.length; i++) {
              for (var j = 0; j < floatingClusters[i].length; j++) {
                for (var k = 0; k < this.tiles.length; k++) {
                  if (this.tiles[k].id == floatingClusters[i][j].id) {
                    let tttt = this.tiles[k];
                    v_main.Game_score += 5;
                    removeTilesById(floatingClusters[i][j].id);
                    tttt.runAction(ActionManager.GP_BUBBLE_DROP_OUT(function () {
                      tttt.removeFromParent();
                    }))
                  }
                }
              }
            }
            if (this.tileslayer.childrenCount == 0) {
              GameManager.reset();
              this.onloadInitTile();
              return;
            }
            winSize.playEffect("find");
            GameManager.turncounter = 0;
          }
          else{
            GameManager.turncounter++;
            if(GameManager.turncounter>=GameManager.turncountermax){
              GameManager.turncounter = 0;
              this.onAddTileRows();
              return;
            }
          }
          v_main.canPlay = true;
          refreshLevelRows();
        }
      }
      else if ((box.x <= 5 && shoot.shootdata.direction == -1) || (box.x + box.width >= 635 && shoot.shootdata.direction == 1)) {
        shoot.stopAllActions();
        shoot.shootdata.direction = shoot.shootdata.direction * -1;
        shoot.runAction(ActionManager.GP_SHOOT_BUBBLE(shoot.shootdata));
      }
    }
    this.canupdate = true;
  }
});