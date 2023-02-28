// 游戏管理对象
var GameManager = {
  ball: ['b', 'g', 'f', 'r', 'z'],
  name : {"z":"紫色","b":"蓝色","g":"绿色","f":"粉色","r":"橙色"},
  maxRotationRocker: 8,
  maxRotationFoot: 12,
  maxRotationBeard: 5,
  dropBallDuration: 1,
  ropeDownDuration: 1.2,
  carMinX: -120,
  catchProbability : [
  {
    type : "z",
    p : 0.001
  },
  {
    type : "r",
    p : 0.005
  },
  {
    type : "f",
    p : 0.01
  },
  {
    type : "g",
    p : 0.6
  },
  {
    type : "b",
    p : 0.7
  }],
  getBallId: function () {
    let random = Math.random();
    let success = false;
    let roleId = "b";
    for(let i=0;i<this.catchProbability.length;i++){
      if(random < this.catchProbability[i].p){
        success = true;
        roleId = this.catchProbability[i].type;
        v_main.card.collect[roleId]++;
        v_main.roleId = roleId;
        break;
      }
    }
    success ? null : v_main.roleId = "n";
    let json =  { success: success, id: roleId, type: 1};
    v_main.onAddMagicLog(roleId);
    return json;
  },
  getBalls : function(){
    let balls = [];
    let x1 = 0;
    let y1 = 0;
    let x2 = 50;
    let y2 = 50;
    let x3 = -10;
    let y3 = 15;
    let id = [0,1,2,0,2,1];
    let type = [1,1,1,1,1,2,2,2,2,3,3,3,3,1,2,3];
    for (let i = 0; i < 10; i++) {
      if( Math.random()<this.catchProbability[0].p){
        id.push(4);
      }
      else if( Math.random()<this.catchProbability[1].p){
        id.push(3);
      }
      else if( Math.random()<this.catchProbability[2].p){
        id.push(2);
      }
      else if( Math.random()<this.catchProbability[3].p){
        id.push(1);
      }
      else{
        id.push(0);
      }
    }
    for (let i = 0; i < 5; i++) {
      let r1 = this.getRandomIndex(id.length-1);
      let r2 = this.getRandomIndex(type.length-1);
      balls.push({x:x3+i*75,y:y3,id:id[r1],type:type[r2]})
      id.splice(r1,1);
      type.splice(r2,1);
    }
    for (let i = 0; i < 6; i++) {
      let r1 = this.getRandomIndex(id.length-1);
      let r2 = this.getRandomIndex(type.length-1);
      balls.push({x:x1+i*62,y:y1,id:id[r1],type:type[r2]})
      id.splice(r1,1);
      type.splice(r2,1);
    }
    for (let i = 0; i < 5; i++) {
      let r1 = this.getRandomIndex(id.length-1);
      let r2 = this.getRandomIndex(type.length-1);
      balls.push({x:x2+i*61,y:y2,id:id[r1],type:type[r2]})
      id.splice(r1,1);
      type.splice(r2,1);
    }
    return balls;
  },
  getRandomIndex : function(m){
    return Math.floor(Math.random()*(m+1));
  }
};