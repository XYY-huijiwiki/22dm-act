var GameManager = {
  tilewidth: 100,
  tileheight: 100,
  turncountermax: 1000,
  turncounter: 0,
  bubblecounter: 0,
  bubblecolors: 6, //泡泡颜色数量 6个
  initrows: 3,
  maxrows: 8,
  level: {
    columns: 6,    // Number of tile columns
    rows: 3,       // Number of tile rows
    tiles: []      // The two-dimensional tile array
  },
  init: function () {
    let level = this.level;
    level.rows = this.initrows;
    for (var i = 0; i < level.columns; i++) {
      level.tiles[i] = [];
      for (var j = 0; j < level.rows; j++) {
        level.tiles[i][j] = new Tile(i, j, 0, 0);
        this.bubblecounter++;
      }
    }
  },
  createLevel: function () {
    let level = this.level;
    for (let j = 0; j < level.rows; j++) {
      let randomtile = randRange(1, this.bubblecolors);
      for (let i = 0; i < level.columns; i++) {
        let newtile = randRange(1, this.bubblecolors);
        if (newtile == randomtile)
          newtile = randRange(1, this.bubblecolors);
        randomtile = newtile;
        level.tiles[i][j].type = randomtile;
      }
    }
  },
  reset: function () {
    this.turncounter = 0;
    this.bubblecounter = 0;
    this.maxrows = Math.floor((winSize.height - 285) / this.tileheight) - 1;
    if (winSize.height < 950)
      this.initrows = 1;
    else if (winSize.height < 1120)
      this.initrows = 2;
    this.init();
    this.createLevel();
    console.log(this.level.tiles);
  }
};
var neighborsoffsets = [
  [[1, 0], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1]],
  [[1, 0], [1, 1], [0, 1], [-1, 0], [0, -1], [1, -1]]
];
function getNeighborsRect(x, y) {
  let neighbors = getNeighbors(x, y);
  let rect = [['r', 'rr', 'lr', 'l', 'lf', 'rf'], ['r', 'rr', 'lr', 'l', 'lf', 'rf']];
  let rrect = [];
  let tilerow = (y % 2) >= 0 ? (y % 2) : 0;
  let n = neighborsoffsets[tilerow];
  neighbors.forEach((itemi) => {
    n.forEach((itemj, indexj) => {
      if (itemi.x == (x + itemj[0]) && itemi.y == (y + itemj[1])) {
        rrect.push(rect[tilerow][indexj]);
      }
    })
  });
  let right = rrect.includes('r');
  let left = rrect.includes('l');
  let leftfront = rrect.includes('lf');
  let rightfront = rrect.includes('rf');
  let leftrear = rrect.includes('lr');
  let rightrear = rrect.includes('rr');
  return { r: right, l: left, lf: leftfront, rf: rightfront, lr: leftrear, rr: rightrear };;
}
function findClusters(currid, type, neighbors) {
  let alltiles = [];
  let clusters = [];
  var tiles = GameManager.level.tiles;
  tiles.forEach(itemi => {
    itemi.forEach(itemj => {
      if (itemj.type == type && itemj.id != currid) {
        alltiles.push(itemj);
      }
    })
  });
  alltiles.forEach((itemi) => {
    neighbors.forEach((itemj) => {
      if (itemj.x == itemi.x && itemj.y == itemi.y) {
        clusters.push(itemi);
      }
    })
  });
  let flag = false;
  while (!flag) {
    clusters.forEach((itemi) => {
      if (!itemi.processed) {
        let n = getNeighbors(itemi.x, itemi.y);
        n.forEach((itemj) => {
          let t = getTilesByGird(itemj.x, itemj.y);
          if (t.type == type && t.id != currid && !t.processed) {
            clusters.push(t);
          }
        })
        itemi.processed = true;
      }
    })
    let count = 0;
    clusters.forEach((item) => {
      if (item.processed) {
        count++;
      }
    })
    if (count == clusters.length) {
      flag = true;
    }
  }
  let clusterids = [];
  clusters.forEach((item) => {
    clusterids.push(item.id);
  })
  clusterids = clusterids.sort((a, b) => a - b).reduce((p, c) => { if (p == '') { return [c] } if (p[p.length - 1] != c) { p.push(c) } return p }, [])
  resetProcessed();
  return clusterids;
};
function resetProcessed() {
  var tiles = GameManager.level.tiles;
  tiles.forEach((itemi) => {
    itemi.forEach((itemj) => {
      itemj.processed = false;
    })
  })
}
var Tile = function (x, y, type) {
  this.id = GameManager.bubblecounter;
  this.x = x;
  this.y = y;
  this.px = 0;
  this.py = 0;
  this.type = type;
  this.removed = false;
  this.processed = false;
};
function addTiles(x, y, type, id) {
  let tiles = GameManager.level.tiles;
  let newtiles = new Tile(x, y, type);
  tiles[x].push(newtiles);
  tiles[x][tiles[x].length - 1].id = id;
  if (refreshLevelRows() > GameManager.maxrows+1) {
    v_main.Game_over = true;
  }
  GameManager.bubblecounter++;
  resetProcessed();
  return newtiles;
}
function refreshLevelRows() {
  let tiles = GameManager.level.tiles;
  let rows = [];
  for (var i = 0; i < tiles.length; i++) {
    for (var j = 0; j < tiles[i].length; j++) {
      if (!tiles[i][j].removed && tiles[i][j].type > 0) {
        rows.push(tiles[i][j].y);
      }
    }
  }
  if (rows.length > 0) {
    rows.sort((a, b) => b - a);
    GameManager.level.rows = rows[0] + 1;
  }
  else {
    GameManager.level.rows = 1;
  }
  return GameManager.level.rows;
}
function hasTilesGird(x, y) {
  let tiles = GameManager.level.tiles;
  let flag = false;
  for (var i = 0; i < tiles.length; i++) {
    for (var j = 0; j < tiles[i].length; j++) {
      if (tiles[i][j].x == x && tiles[i][j].y == y) {
        if (!tiles[i][j].removed && tiles[i][j].type > 0) {
          flag = true;
          break;
        }
      }
    }
  }
  return flag;
}
function checkTilesGird(x, y,id) {
  let tiles = GameManager.level.tiles;
  let flag = false;
  for (var i = 0; i < tiles.length; i++) {
    for (var j = 0; j < tiles[i].length; j++) {
      if (tiles[i][j].x == x && tiles[i][j].y == y) {
        if (!tiles[i][j].removed && tiles[i][j].type > 0) {
          if(tiles[i][j].id!=id){
            flag = true;
            break;
          }
        }
      }
    }
  }
  return flag;
}
function getTilesByGird(x, y) {
  let tiles = GameManager.level.tiles;
  for (var i = 0; i < tiles.length; i++) {
    for (var j = 0; j < tiles[i].length; j++) {
      if (tiles[i][j].x == x && tiles[i][j].y == y) {
        if (!tiles[i][j].removed && tiles[i][j].type > 0) {
          return tiles[i][j];
        }
      }
    }
  }
};
function getTilesGird(id) {
  let tiles = GameManager.level.tiles;
  for (var i = 0; i < tiles.length; i++) {
    for (var j = 0; j < tiles[i].length; j++) {
      if (tiles[i][j].id == id) {
        return { x: itemj.x, y: itemj.y };
      }
    }
  }
}
function removeTilesById(id) {
  let tiles = GameManager.level.tiles;
  for (var i = 0; i < tiles.length; i++) {
    for (var j = 0; j < tiles[i].length; j++) {
      if (tiles[i][j].id == id) {
        tiles[i].splice(j, 1)
        return true;
      }
    }
  }
}
function randRange(low, high) {
  return Math.floor(low + Math.random() * (high));
}
function findFloatingClusters() {
  resetProcessed();
  var tiles = GameManager.level.tiles;
  var foundclusters = [];
  for (var i = 0; i < tiles.length; i++) {
    for (var j = 0; j < tiles[i].length; j++) {
      var tile = getTilesByGird(tiles[i][j].x, tiles[i][j].y);
      if (!tile.processed) {
        var foundcluster = findCluster(tile.x, tile.y, false, false, true);
        if (foundcluster.length <= 0) {
          continue;
        }
        var floating = true;
        for (var k = 0; k < foundcluster.length; k++) {
          if (foundcluster[k].y == 0) {
            floating = false;
            break;
          }
        }
        if (floating) {
          foundclusters.push(foundcluster);
        }
      }
    }
  }
  return foundclusters;
}
function findCluster(tx, ty, matchtype, reset, skipremoved) {
  if (reset) {
    resetProcessed();
  }
  var targettile = getTilesByGird(tx, ty);
  var toprocess = [targettile];
  targettile.processed = true;
  var foundcluster = [];
  while (toprocess.length > 0) {
    var currenttile = toprocess.pop();
    if (currenttile.type == -1) {
      continue;
    }
    if (skipremoved && currenttile.removed) {
      continue;
    }
    if (!matchtype || (currenttile.type == targettile.type)) {
      foundcluster.push(currenttile);
      var neighbors = getNeighbors(currenttile.x, currenttile.y);
      for (var i = 0; i < neighbors.length; i++) {
        if (!neighbors[i].processed) {
          toprocess.push(neighbors[i]);
          neighbors[i].processed = true;
        }
      }
    }
  }
  return foundcluster;
}
function getNeighbors2(x,y) {
  var tilerow = (y % 2) >= 0 ? (y % 2) : 0;
  var neighbors = [];
  var n = neighborsoffsets[tilerow];
  for (var i = 0; i < n.length; i++) {
    var nx = x + n[i][0];
    var ny = y + n[i][1];
    if (hasTilesGird(nx, ny)) {
      neighbors.push(getTilesByGird(nx, ny));
    }
  }
  return neighbors;
}
function getNeighbors(x, y) {
  let tiles = GameManager.level.tiles;
  let tilerow = (y % 2) >= 0 ? (y % 2) : 0;
  let neighbors = [];
  let n = neighborsoffsets[tilerow];
  for (let i = 0; i < n.length; i++) {
    let nx = x + n[i][0];
    let ny = y + n[i][1];
    if (hasTilesGird(nx, ny)) {
      neighbors.push(getTilesByGird(nx, ny));
    }
  }
  return neighbors;
}
function getEmptyNeighbors(x, y) {
  let tilerow = (y % 2) >= 0 ? (y % 2) : 0;
  let neighbors = [];
  let n = neighborsoffsets[tilerow];
  for (let i = 0; i < n.length; i++) {
    let nx = x + n[i][0];
    let ny = y + n[i][1];
    if (!hasTilesGird(nx, ny)) {
      if (nx >= 0 && nx <= 5 && ny >= 0) {
        neighbors.push([nx, ny]);
      }
    }
  }
  return neighbors;
}
function getBestEmptyNeighbors(x,y,girds,shoot){
  let bkey1 = [
    [[0, 1],[-1, 0],[1,1],[1,0],[0,-1],[1,-1]],
    [[-1,1],[0,1],[-1,0],[1,1],[-1,-1],[0,-1]]
  ];
  let bkey2 = [
    [[1,1],[1,0],[0,1],[-1,0],[1,-1],[0,-1]],
    [[0,1],[1,0],[-1,1],[1,1],[1,-1],[0,-1]]
  ];
  let kk = shoot.shootdata.direction == 1 ? bkey1 : bkey2;
  let k = kk[(y%2)>=0?(y%2):0];
  for (let i = 0; i < k.length; i++) {
    for (let j = 0; j < girds.length; j++) {
      if(girds[j][0]+k[i][0] == x && girds[j][1]+k[i][1] == y){
        return j;
      }
    }
  }
  return 0;
}