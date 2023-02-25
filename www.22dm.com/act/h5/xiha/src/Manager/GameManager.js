// 游戏管理对象
var GameManager = {
    level           : 0,        // 关卡[从0开始]
    levelData       : [],       // 关卡[数据]
    monsterGroup    : [],       // 怪物[数据]池
    maxGroup        : 0,        // 组别[最大值]
    enemyInterval   : 0,        // 刷怪时间间隔
    currMonsterDataPool     : [],   // [当前]怪物数据池
    currMonsterPool         : [],   // [当前]怪物节点池
    currBulletPool          : [],   // [当前]子弹节点池
    // 加载[关卡数据]
    loadLevelData : function (level) {
        this.level          = level;
        this.levelData      = LevelData[level];
        this.monsterGroup   = this.levelData.monsterGroup;  //有多少只星星
        this.group          = 0;   //添加了多少只
        this.maxGroup       = this.monsterGroup.length - 1; //有多少只星星
        this.enemyInterval  = this.levelData.enemyInterval;
        this.currMonsterDataPool = this.levelData.monsterGroup;
        this.currMonsterPool     = [];
        this.currBulletPool      = [];
        return this.monsterGroup;
    },
    // getter && setter
    //////////////////////////////
    getCurrGroupMonsterSum : function(){
        return this.monsterGroup.length;
    },
    getLevel : function(){
        return this.level;
    },
    setLevel : function(level){
        this.level = level;
    },
    getLevelData : function(){
        return this.levelData;
    },
    getMonsterGroup : function(){
        return this.monsterGroup;
    },
    getGroup : function(){
        return this.group;
    },
    getMaxGroup : function(){
        return this.maxGroup;
    },
    getEnemyInterval : function(){
        return this.enemyInterval;
    },
    getCurrMonsterDataPool : function(){
        return this.currMonsterDataPool;
    },
    getCurrMonsterPool : function(){
        return this.currMonsterPool;
    },
    getCurrBulletPool : function(){
        return this.currBulletPool;
    },
    getIsWin : function(){
        return this.isWin;
    },
    setIsWin : function(isWin){
        this.isWin = isWin;
    }
};