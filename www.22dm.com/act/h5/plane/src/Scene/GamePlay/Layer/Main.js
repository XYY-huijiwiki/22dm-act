var GPMainLayer = cc.Layer.extend({
    ZOrderEnum          : {},   // 对象层级枚举

    carrot              : null,   // 萝卜对象
    carrotHpBg          : {},   // 萝卜[血量背景]
    carrotHp            : [],   // 萝卜[血量]

    score               : 0,
    bulletCount         : 0,
    level               : 0,

    fire                : false,
    timespan            : 0,
    flagGameOver        : false,
    ctor:function(level){
        this._super(); 
        this.level = level;
        GameManager.loadLevelData(level);
    },
    onEnter : function(){
        this._super();     
        this.property();
        this.loadCarrot();
        this.loadNextGroupMonster();
        this.scheduleUpdate();
        this.registerEvent();
    },
    property:function(){
        this.score = 0;
        this.bulletCount = 0;
        this.carrotHp = [];
        this.carrotHpBg = {};
        this.carrot = null;
        this.timespan = 0;
    },
    registerEvent : function(){
        // [事件监听]怪物吃到萝卜事件
        var onMonsterEatCarrotListener = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_MONSTER_EAT_CARROT,
            callback    : this.onMonsterEatCarrot
        });
        cc.eventManager.addListener(onMonsterEatCarrotListener, this);

        // [事件监听]游戏结束事件
        var onGameOverListener = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_GAME_OVER,
            callback    : this.onGameOver
        });
        cc.eventManager.addListener(onGameOverListener, this);

        // [事件监听]萝卜血量更新
        var onUpdateCarrotBloodListener = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_UPDATE_CARROT_BLOOD,
            callback    : this.onUpdateCarrotBlood
        });
        cc.eventManager.addListener(onUpdateCarrotBloodListener, this);

        // [事件监听]移除子弹
        var onRemoveBulletListener = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_REMOVE_BULLET,
            callback    : this.onRemoveBullet
        });
        cc.eventManager.addListener(onRemoveBulletListener, this);

        // [事件监听]手柄事件
        var onCreateGamePadListener = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_CREATE_GAMEPAD,
            callback    : this.onCreateGamePad
        });
        cc.eventManager.addListener(onCreateGamePadListener, this);
        // [事件监听]手柄事件
        var onRemoveGamePadListener = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_REMOVE_GAMEPAD,
            callback    : this.onRemoveGamePad
        });
        cc.eventManager.addListener(onRemoveGamePadListener, this);
        cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_CREATE_GAMEPAD));
    },
    // 加载[属性]
    loadProperty : function(){
        this.ZOrderEnum.CARROT       = 0;    // 萝卜
        this.ZOrderEnum.MONSTER      = 20;   // 怪物
    },
    loadCarrot:function(){
        var p = new cc.Sprite(res.gg_plane_normal);
        this.addChild(p,this.ZOrderEnum.CARROT);
        this.carrot = p;
        p.attr({
            x:winSize.width/2,
            y:p.height,
            blood:3,
            protect:false,
            moveable:false
        })
        this.loadCarrotHp();
        if(!isPC){
            var pListen = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: function (touch, event) {
                    var target = event.getCurrentTarget(); 
                    var locationInNode = target.convertToNodeSpace(touch.getLocation());
                    var s = target.getContentSize();
                    var rect = cc.rect(0, 0, s.width, s.height);
                    if (cc.rectContainsPoint(rect, locationInNode)) { // 判断触摸点是否在按钮范围内      
                        target.moveable = true;                  
                    } 
                    return true;
                },
                onTouchMoved:function(touch,event){
                    var target = event.getCurrentTarget(); 
                    if(target.moveable){
                        var delta = touch.getDelta();
                        var dx = target.x + delta.x;
                        var dy = target.y + delta.y;                    
                        if(dx>p.width/2 && dx<winSize.width-p.width/2){
                            target.x = dx;
                        }
                        if(dy>p.height/2 && dy<winSize.height-p.height/2){
                            target.y = dy;
                        }
                    }
                },
                onTouchEnded:function(touch,event){
                    var target = event.getCurrentTarget(); 
                    target.moveable = false;
                }
            });
            cc.eventManager.addListener(pListen,p);
        }
    },
    // 加载[血量]
    loadCarrotHp : function(){
        this.loadBloodBg();
        this.loadBlood();
    },
    // 加载[萝卜血量背景]
    loadBloodBg : function(){
        var node = new cc.Sprite(res.gg_blood_bg);
        this.addChild(node);
        this.carrotHpBg = node;
        node.setPosition(node.width/2,node.height/2);
    },
    // 加载[萝卜血量]
    loadBlood : function () {
        var a = new cc.Sprite(res.gg_blood_1);
        var b = new cc.Sprite(res.gg_blood_2);
        var c = new cc.Sprite(res.gg_blood_3);
        var p =this.carrotHpBg.getPosition();
        a.setPosition(p);
        b.setPosition(p);
        c.setPosition(p);
        this.addChild(a);
        this.addChild(b);
        this.addChild(c);
        this.carrotHp.push(a,b,c);
    },
    // 加载[怪物]
    loadNextGroupMonster : function(){
        if(!this.flagGameOver){
            var a = new cc.EventCustom(jf.EventName.GP_CREATE_LEVEL_LAYER);
            a.setUserData({
                gameOver:false,
                level:this.level+1,
                cb:function(){
                    if (GameManager.getGroup() > GameManager.getMaxGroup()) {
                        cc.log("GPMainLayer.loadNextGroupMonster() : 怪物添加完毕");
                        return;
                    }
                    GameManager.currMonsterDataPool = GameManager.popNextMonsterGroupData();
                    GameManager.currMonsterPool[GameManager.getGroup() - 1] = [];

                    this.currGroupCreatedMonsterCount = 0;
                    // 怪物总数统计
                    this.currGroupCreatedMonsterSum = GameManager.getCurrGroupMonsterSum();

                    var groupDelay = cc.delayTime(GameManager.getGroupInterval());
                    // 延迟时间
                    var enemyDelay = cc.delayTime(GameManager.getEnemyInterval());
                    var callback = cc.callFunc(this.createMonster.bind(this));
                    var createMonsterAction = cc.sequence(enemyDelay.clone(), callback).repeat(this.currGroupCreatedMonsterSum);
                    var finalAction = cc.sequence(groupDelay, createMonsterAction);
                    this.runAction(finalAction);
                }.bind(this)
            });
            cc.eventManager.dispatchEvent(a);
        }
    },
    createMonster : function(){
        var data = GameManager.currMonsterDataPool[0];
        // 创建怪物数量+1
        this.currGroupCreatedMonsterCount++;
        var monsterData = {
            type  : data.type,
            speed : data.speed,
            index : data.index,
            start : data.start,
            end   : data.end,
            blood : data.type,
            jump  : data.jump
        };
        var node = new Monster(res['gg_monster_'+data.type],monsterData);
        this.addChild(node, this.ZOrderEnum.MONSTER);
        GameManager.currMonsterPool[GameManager.getGroup() - 1].push(node);
        node.attr({
            type:data.type,
            x:data.start.x,
            y:winSize.height+data.start.y
        });
        node.run();
        GameManager.currMonsterDataPool.splice(0, 1);
       if(GameManager.currMonsterDataPool.length==0){      
            if(this.level<LevelData.length-1){
                GameManager.loadLevelData(this.level++);
                var event = new cc.EventCustom(jf.EventName.GP_UPDATE_LEVEL);
                event.setUserData({
                    level : this.level+1
                });
                var delay = cc.delayTime(3);
                var callback = cc.callFunc(function(){
                    this.loadNextGroupMonster();  
                    cc.eventManager.dispatchEvent(event);
                }.bind(this));
                this.runAction(cc.sequence(delay,callback));                              
            }
            else{
                this.flagGameOver = true;
                var delay = cc.delayTime(3);
                var callback = cc.callFunc(function(){
                    var a = new cc.EventCustom(jf.EventName.GP_CREATE_LEVEL_LAYER);
                    a.setUserData({
                        gameOver:true,
                        level:this.level+1,
                        cb:function(){
                            var gameOverEvent = new cc.EventCustom(jf.EventName.GP_GAME_OVER);
                            cc.eventManager.dispatchEvent(gameOverEvent);
                        }.bind(this)
                    });
                    cc.eventManager.dispatchEvent(a);
                }.bind(this));
                this.runAction(cc.sequence(delay,callback)); 
            }
       }
    },
    // 根据数组下标删除怪物
    removeMonsterByIndex : function(i, j,score){
        this.removeChild(GameManager.currMonsterPool[i][j]);
        GameManager.currMonsterPool[i].splice(j, 1);
        this.score += score;
        var event = new cc.EventCustom(jf.EventName.GP_UPDATE_SCORE);
        event.setUserData({
            score : this.score
        });
        cc.eventManager.dispatchEvent(event);     
    },
    // 移除子弹
    removeBullet : function(obj){
        var bullet = null;
        for (var i = 0; i < GameManager.currBulletPool.length; i++) {
            bullet = GameManager.currBulletPool[i];
            if (bullet == obj) {
                this.removeBulletByIndex(i);
            }
        }
    },
    // 根据数组下标删除子弹
    removeBulletByIndex : function(index){
        this.removeChild(GameManager.currBulletPool[index]);
        GameManager.currBulletPool.splice(index, 1);
    },
    update : function(dt){
        this.timespan += dt;
        if (this.fire || !isPC) {  
            if(this.timespan >= timer.fireLoop && !this.flagGameOver){
                this.createBullet(); 
                this.timespan = 0;             
            }
        };
        if(!this.flagGameOver)
            this.checkCollide();
    },
    //发射子弹
    createBullet:function(){
        var a = new cc.Sprite(res.gg_fire_normal);
        this.addChild(a);
        GameManager.currBulletPool.push(a);
        a.attr({
            width:a.width,
            height:a.height,
            x : this.carrot.x,
            y : this.carrot.y+this.carrot.height/2
        });
        var m = cc.moveTo(timer.fireFlight,a.x,winSize.height+a.y);
        var sequence = cc.sequence(m,cc.callFunc(function(){
            a.removeFromParent();
        }.bind(this)));
        a.runAction(sequence);
        this.bulletCount++;
    },
    // 碰撞检测
    checkCollide : function(){
        var bullet = null;
        var enemy = null;
        var enemyRect = null;
        var bulletRect = null;
        for (var y = 0; y < GameManager.currMonsterPool.length; y++) {
            for (var z = 0; z < GameManager.currMonsterPool[y].length; z++) {
                enemy = GameManager.currMonsterPool[y][z];
                enemyRect = enemy.getBoundingBox();//cc.rect(enemy.x - enemy.width / 2, enemy.y - enemy.height / 2, enemy.width, enemy.height);
                bulletRect = this.carrot.getBoundingBox();
                bulletRect.x +=40;
                bulletRect.width -=80;
                bulletRect.height -=30;
                if(cc.rectIntersectsRect(enemyRect, bulletRect)){ //碰撞了
                    if(!this.carrot.protect){
                        this.removeMonsterByIndex(y, z,enemy.type<=3?enemy.type*100:200); 
                        if(enemy.type<=3){ //怪物
                            var event = new cc.EventCustom(jf.EventName.GP_UPDATE_CARROT_BLOOD);
                            cc.eventManager.dispatchEvent(event);                           
                        }
                    }
                    return;
                }
                else if(enemy.type<=3){
                    for (var x = 0; x < GameManager.currBulletPool.length; x++) {
                        bullet = GameManager.currBulletPool[x];
                        if(cc.rectContainsPoint(enemyRect, bullet.getPosition())) {
                            this.removeBulletByIndex(x);
                            if(enemy.blood-1<=0){
                                this.removeMonsterByIndex(y, z,enemy.type*100);                                      
                            }
                            else{
                                enemy.blood--;
                            }
                        }                     
                    }
                }
            }
        }
    },
    //[事件]更新萝卜血量
    onUpdateCarrotBlood : function(event){
        var self = event.getCurrentTarget();
        self.carrot.blood--;
        blood=self.carrot.blood;
        if(blood>=0){
            self.onProtectCarrot();
            self.carrotHp[blood].removeFromParent(); 
        }
        else{
            self.flagGameOver = true;
            self.carrot.removeFromParent();
            var delay = cc.delayTime(1);
                var callback = cc.callFunc(function(){
                    var a = new cc.EventCustom(jf.EventName.GP_CREATE_LEVEL_LAYER);
                    a.setUserData({
                        gameOver:true,
                        level:self.level+1,
                        cb:function(){
                            var gameOverEvent = new cc.EventCustom(jf.EventName.GP_GAME_OVER);
                            cc.eventManager.dispatchEvent(gameOverEvent);
                        }.bind(self)
                    });
                    cc.eventManager.dispatchEvent(a);
                }.bind(self));
            self.runAction(cc.sequence(delay,callback)); 
        }
    }, 
    onProtectCarrot:function(){
        this.carrot.attr({
            x:winSize.width/2,
            y:this.carrot.height,
            protect:true,
            moveable:false
        })
        var a = new cc.Blink(1, 7);
        var callback = cc.callFunc(function(){
            this.carrot.protect = false;
        }.bind(this))
        this.carrot.runAction(cc.sequence(a,callback));
    },
    //[事件]游戏结束
    onGameOver : function(event){
        var self = event.getCurrentTarget();
        var data ={
            bulletCount : self.bulletCount,
            score  : self.score,
            level  : self.level,
            title  : getTitle(self.score),
            isNew  : (userInfo.hightest<self.score? true : false)
        };
        addScore(self.score,self.bulletCount,self.level);
        var scene = new GameResultScene(data);
        cc.director.runScene(scene);
    },
    // [事件]移除子弹
    onRemoveBullet : function(event){
        var self = event.getCurrentTarget();
        var bullet = event.getUserData().target;
        self.removeBullet(bullet);
    },    
    onCreateGamePad:function(s){
        var p = s._currentTarget.carrot;
        gamepad.bind(Gamepad.Event.TICK, function(e) {
            if(!cc.director.isPaused()){
                var x = e[0].axes[0];
                var y = e[0].axes[1];
                if(Math.abs(x)>0.1 || Math.abs(y)>0.1){
                    var dx = p.x+x*timer.planeSpeedX;
                    var dy = p.y-y*timer.planeSpeedY
                    if(dx>p.width/2 && dx<winSize.width-p.width/2){
                        p.x = dx;
                    }
                    if(dy>p.height/2 && dy<winSize.height-p.height/2){
                        p.y = dy;
                    }
                }
            }
        });
        gamepad.bind(Gamepad.Event.BUTTON_DOWN, function(e) {
            if(e.control=="FACE_2"){
                s._currentTarget.fire = true;
            }
            else if(e.control=="START_FORWARD"){
                var event = new cc.EventCustom(jf.EventName.GP_CREATE_MENU_LAYER);
                cc.eventManager.dispatchEvent(event);
            }
        });
        gamepad.bind(Gamepad.Event.BUTTON_UP, function(e) {
            s._currentTarget.timespan = timer.fireLoop;  
            s._currentTarget.fire = false;
        });
    },
    onRemoveGamePad:function(){
        gamepad.unbind(Gamepad.Event.TICK);
        gamepad.unbind(Gamepad.Event.BUTTON_DOWN);
        gamepad.unbind(Gamepad.Event.BUTTON_UP);
    }
});