var Monster = cc.Sprite.extend({
    data    : {},   // 数据
    type    : null,
    speed   : 0,    // 速度
    act     : 0,    // 动作
    index   : 0,    // 索引
    start   : {},
    end     : {},
    blood   : 1,
    ctor : function(src,data){
        this._super(src);
        // 加载[属性配置]
        this.loadProperty(data);
    },
    // 加载[属性配置]
    loadProperty : function(data){
        this.data = data;
        this.type = data.type;
        this.speed = data.speed;
        this.act = data.act;
        this.index = data.index;
        this.start = data.start,
        this.end   = data.end;
        this.blood = data.blood;
    },
    run : function(){
        this.runNextRoad();
    },
    runNextRoad : function(){
        this.attr({
            type:this.data.type,
            x:this.data.start.x,
            y:winSize.height+this.data.start.y
        });
        var distance = cc.pDistance(cc.p(this.start.x,this.start.y),cc.p(this.end.x,this.end.y));
        var time = distance/this.speed/winSize.globalSpeed;
        var action;
        if(this.act == "bezier"){
            var x1 = this.start.x;
            var y1 = this.start.y;
            var x2 = this.end.x;
            var y2 = this.end.y; 
            var bezierToConfig = [
                cc.p(x2,y1),
                cc.p(x1,y2),
                cc.p(x2,y2)
            ],
            action = cc.bezierTo(time,bezierToConfig);
        }
        else
            action = cc.moveTo(time,this.end.x,this.end.y);
        var callback = cc.callFunc(function(){
            this.removeMonster(this);
        }.bind(this));
        var seq = cc.sequence(action, callback);
        if(this.type<=3)
            this.runAction(seq);
        else{
            var a = cc.rotateTo(time/2,30);
            var b = cc.rotateTo(time/2,-30);
            var c = cc.sequence(a,b);
            this.runAction(cc.spawn(c,seq));
        }
    },
    // 移除怪物
    removeMonster : function(obj){
        var monster = null;
        for (var i = 0; i < GameManager.currMonsterPool.length; i++) {
            monster = GameManager.currMonsterPool[i];
            if (monster == obj) {
                monster.removeFromParent();
                GameManager.currMonsterPool.splice(i, 1);
            }
        }
    },
});