var Monster = cc.Sprite.extend({
    action  : 0,    // 动作
    data    : {},   // 数据
    speed   : 0,    // 速度
    index   : 0,    // 索引
    start   : {},
    end     : {},
    blood   : 1,
    jump    : false,
    ctor : function(src,data){
        this._super(src);
        // 加载[属性配置]
        this.loadProperty(data);
    },
    // 加载[属性配置]
    loadProperty : function(data){
        this.data = data;
        //this.action = data.action;
        this.type = data.type;
        this.speed = data.speed;
        this.index = data.index;
        this.start = data.start,
        this.end   = data.end;
        this.blood = data.blood;
        this.jump  = data.jump;
    },
    run : function(){
        this.runNextRoad();
    },
    // 跑到下一个标记点上
    runNextRoad : function(){
        var distance = cc.pDistance(cc.p(this.start.x,this.start.y),cc.p(this.end.x,this.end.y));
        var time = distance / this.speed;
        var moveTo;
        if(this.jump){
            var x1 = this.start.x;
            var y1 = this.start.y;
            var x2 = this.end.x;
            var y2 = this.end.y; 
            var bezierToConfig = [
                cc.p(x2,y1),
                cc.p(x1,y2),
                cc.p(x2,y2)
            ],
            moveTo = cc.bezierTo(time,bezierToConfig);
        }
        else
            moveTo = cc.moveTo(time,cc.p(this.end.x,this.end.y));
        var callback = cc.callFunc(function(){
            this.removeFromParent();
        }.bind(this));
        var seq = cc.sequence(moveTo, callback);
        if(this.type<=3)
            this.runAction(seq);
        else{
            var a = cc.rotateTo(time/2,30);
            var b = cc.rotateTo(time/2,-30);
            var c = cc.sequence(a,b);
            this.runAction(cc.spawn(c,seq));
        }
    },
    getRoad : function(){
        return this.road;
    },
    setRoad : function(road){
        this.road = road;
    },
    getData : function(){
        return this.data;
    },
    getSpeed : function () {
        return this.speed;
    },
    setSpeed : function(speed){
        this.speed = speed;
    },
    getIndex : function () {
        return this.index;
    },
    setIndex : function(index){
        this.index = index;
    }
});