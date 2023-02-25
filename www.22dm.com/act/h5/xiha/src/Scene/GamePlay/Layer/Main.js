var GPMainLayer = cc.Layer.extend({
    ZOrderEnum          : {},   // 对象层级枚举
    ship                : null,   // 萝卜对象
    score               : 0,
    bulletCount         : 0,
    level               : 0,
    timespan            : 0,
    flagGameOver        : false,
    currGroupCreatedMonsterSum   : 0,
    currGroupCreatedMonsterCount : 0,
    isLevelFinish       : null,
    ctor:function(level){
        this._super(); 
        this.level = level;
    },
    onEnter : function(){
        this._super();     
        this.property();
        this.loadShip();
        this.loadNextGroupMonster();
        this.scheduleUpdate();
        this.registerEvent();
    },
    property:function(){
        this.score = 0;
        this.bulletCount = 0;
        this.ship = null;
        this.timespan = 0;
        this.flagGameOver = false;
        this.currGroupCreatedMonsterSum = 0;
        this.currGroupCreatedMonsterCount = 0;
        this.isLevelFinish = null;
    },
    registerEvent : function(){
        // [事件监听]游戏结束事件
        var onGameOverListener = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_GAME_OVER,
            callback    : this.onGameOver
        });
        cc.eventManager.addListener(onGameOverListener, this);

        // [事件监听]血量更新
        var onUpdateCarrotBloodListener = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_UPDATE_SHIP_BLOOD,
            callback    : this.onUpdateShipBlood
        });
        cc.eventManager.addListener(onUpdateCarrotBloodListener, this);
    },
    // 加载[属性]
    loadProperty : function(){
        this.ZOrderEnum.SHIP       = 0;    // 飞船
        this.ZOrderEnum.STARS      = 20;   // 星星
    },
    loadShip:function(){
        var ship = new cc.Sprite("#ship_1.png");
        this.addChild(ship,this.ZOrderEnum.SHIP);
        this.ship = ship;
        winSize.ship = ship;
        ship.attr({
            x : winSize.width/2,
            y : ship.height,
            blood : 3,
            protect : false,
            moveable : false,
            mold   : "normal"
        })
        if(true)
        {
            var listener = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: function (touch, event) {
                    var target = event.getCurrentTarget(); 
                    var locationInNode = target.convertToNodeSpace(touch.getLocation());
                    var s = target.getContentSize();
                    var rect = cc.rect(0, 0, s.width, s.height);
                    if (cc.rectContainsPoint(rect, locationInNode) && !cc.director.isPaused()) { // 判断触摸点是否在按钮范围内      
                        target.moveable = true;
                        target.fire = true;                  
                    } 
                    return true;
                },
                onTouchMoved:function(touch,event){
                    var target = event.getCurrentTarget(); 
                    if(target.moveable){
                        var delta = touch.getDelta();
                        var dx = target.x + delta.x;
                        var dy = target.y + delta.y;                    
                        if(dx>target.width/5 && dx<winSize.width-target.width/5){
                            target.x = dx;
                        }
                        if(dy>target.height/4 && dy<winSize.height-target.height/4){
                            target.y = dy;
                        }
                    }
                },
                onTouchEnded:function(touch,event){
                    var target = event.getCurrentTarget(); 
                    target.moveable = false;
                    target.fire = false;
                }
            });
            cc.eventManager.addListener(listener,ship);
        }
    },
    // 加载[怪物]
    loadNextGroupMonster : function(){
        if(!this.flagGameOver){
            var dialogs = new cc.EventCustom(jf.EventName.GP_CREATE_DIALOGS_LAYER);
            dialogs.setUserData({
                text:"关卡 : "+(this.level*1+1),
                cb:function(){
                    this.createMonstorRepeat();
                }.bind(this)
            });
            cc.eventManager.dispatchEvent(dialogs);
            //this.createMonstorRepeat();
        }
    },
    createMonstorRepeat : function(){
        //console.info("关卡 : "+(this.level*1+1)+" 开始");
        GameManager.currMonsterDataPool = GameManager.loadLevelData(this.level);
        GameManager.currMonsterPool = [];
        this.currGroupCreatedMonsterCount = 0;
        this.currGroupCreatedMonsterSum = GameManager.getCurrGroupMonsterSum();
        var enemyDelay = cc.delayTime(GameManager.getEnemyInterval());
        var callback = cc.callFunc(this.createMonstor.bind(this));
        var createMonsterAction = cc.sequence(enemyDelay.clone(), callback).repeat(this.currGroupCreatedMonsterSum);
        this.runAction(createMonsterAction);
    },
    createMonstor : function(){
        //console.info("createMonstor"+this.currGroupCreatedMonsterCount);
        var data = GameManager.currMonsterDataPool[this.currGroupCreatedMonsterCount];
        this.currGroupCreatedMonsterCount++;
        if(winSize.isMoonDay && data.type>3){
            data.type = Math.floor(Math.random()*7+6);
        }
        var monsterData = {
            type  : data.type,
            speed : data.speed,
            blood : data.type,
            act  : data.act,
            start : data.start,
            end   : data.end,
            index : this.currGroupCreatedMonsterCount
        };
        var node = new Monster("#start_"+data.type+".png",monsterData);
        this.addChild(node, this.ZOrderEnum.MONSTER);
        GameManager.currMonsterPool.push(node);
        node.run();
        if(this.currGroupCreatedMonsterCount==this.currGroupCreatedMonsterSum){
            //console.info("关卡 : "+(this.level*1+1)+" 结束");   
            if(this.level<LevelData.length-1){  //继续下一关
                this.level++;
                this.isLevelFinish = setInterval(function(){
                    if(GameManager.currMonsterPool.length==0){
                        clearInterval(this.isLevelFinish);
                        cc.audioEngine.playEffect(res.audio_next,false);
                        this.loadNextGroupMonster();
                    }
                }.bind(this),500);
            }
            else{  //通过所有关卡了
                var delay = cc.delayTime(1);
                var callback = cc.callFunc(function(){
                    var event = new cc.EventCustom(jf.EventName.GP_CREATE_DIALOGS_LAYER);
                    event.setUserData({
                        text:"完成通关!",
                        cb:function(){
                             cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_GAME_OVER));
                        }.bind(this)
                    });
                    cc.eventManager.dispatchEvent(event);
                }.bind(this));
                this.isLevelFinish = setInterval(function(){
                    if(GameManager.currMonsterPool.length==0){
                        clearInterval(this.isLevelFinish);
                        this.runAction(cc.sequence(delay,callback)); 
                        this.flagGameOver = true;
                    }
                }.bind(this),500);
            }
       }
    },
    //发射子弹
    createBullet:function(){
        var src,audio=res.audio_bullect1;
        var moon = winSize.isMoonDay && this.ship.mold=="moon",sequence2,bullet2;
        switch(this.ship.mold)
        {
            case "normal":
                src = "#shell_1.png";
                break;
             case "ice":
                src = "#shell_2.png";
                break;
             case "music":
                src = "#shell_3.png";
                audio = res.audio_bullect2;
                break;
             case "moon":
                src = "#shell_4.png";             
                break;
        }
        var bullet = new cc.Sprite(src);
        this.addChild(bullet);
        bullet.attr({
            x : moon ? this.ship.x-45 : this.ship.x,
            y : this.ship.y+this.ship.height/2
        });
        if(moon){
            bullet2 = new cc.Sprite(src);
            this.addChild(bullet2);
            bullet2.attr({
                x : this.ship.x+45,
                y : this.ship.y+this.ship.height/2
            });
            GameManager.currBulletPool.push(bullet2);
            var m2 = cc.moveTo(winSize.bulletSpeed,bullet2.x,winSize.height+bullet.y);
            sequence2 = cc.sequence(m2,cc.callFunc(function(){
                this.removeBullet(bullet2);
            }.bind(this)));
        }
        GameManager.currBulletPool.push(bullet);
        var m = cc.moveTo(winSize.bulletSpeed,bullet.x,winSize.height+bullet.y);
        var sequence = cc.sequence(m,cc.callFunc(function(){
            this.removeBullet(bullet);
        }.bind(this)));
        bullet.runAction(sequence);
        if(moon)
            bullet2.runAction(sequence2);
        this.bulletCount++;
        cc.audioEngine.playEffect(audio,false);
    },
    update : function(dt){
        this.timespan += dt;
        if (this.ship.fire) { //开火
            if(this.timespan >= winSize.bulletLoop && !this.flagGameOver){
                this.createBullet(); 
                this.timespan = 0;             
            }
        };
        if(!this.flagGameOver)
            this.checkCollide();
    },
    // 碰撞检测
    checkCollide : function(){
        var bullet = null;
        var enemy = null;
        var enemyRect = null;
        var shipRect = null;
        for (var x = 0; x < GameManager.currMonsterPool.length; x++) {
            enemy = GameManager.currMonsterPool[x];
            enemyRect = enemy.getBoundingBox();
            shipRect = this.ship.getBoundingBox();
            shipRect.width -=20;
            shipRect.height -=20;
            if(cc.rectIntersectsRect(enemyRect, shipRect)){ //碰撞了
                if(!this.ship.protect){
                    this.removeMonsterByIndex(x,1); 
                    if(enemy.type<=3){ //怪物
                        cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_UPDATE_SHIP_BLOOD));                           
                    }
                    else{  //变身
                        this.onShipTransForm(enemy.type);
                    }
                }
                return;
            }
            else if(enemy.type<=3){  //检测子弹有没有打中
                for (var y = 0; y < GameManager.currBulletPool.length; y++) {
                    bullet = GameManager.currBulletPool[y];
                    if(cc.rectIntersectsRect(enemyRect, bullet.getBoundingBox())) {
                        this.removeBulletByIndex(y);
                        enemy.blood--;
                        if(enemy.blood<=0 || this.ship.type=="music"){
                            this.removeMonsterByIndex(x,false); 
                            this.score += enemy.type*100;                                     
                            var event = new cc.EventCustom(jf.EventName.GP_UPDATE_SCORE);
                            event.setUserData({
                                score : this.score
                            });
                            cc.eventManager.dispatchEvent(event);     
                        }
                    }                     
                }
            }
        }
    },
    // 根据数组下标删除怪物 
    removeMonsterByIndex : function(i,isCollide){
        var monster = GameManager.currMonsterPool[i];
        GameManager.currMonsterPool.splice(i, 1);
        if(!isCollide){
            monster.runAction(AnctionManager.onRemoveMonster(monster));
            cc.audioEngine.playEffect(res.audio_die,false);
        }
        else
            monster.removeFromParent();
    },
    // 根据数组下标删除子弹
    removeBulletByIndex : function(index){
        this.removeChild(GameManager.currBulletPool[index]);
        GameManager.currBulletPool.splice(index, 1);
    },
    // 移除子弹
    removeBullet : function(obj){
        var bullet = null;
        for (var i = 0; i < GameManager.currBulletPool.length; i++) {
            bullet = GameManager.currBulletPool[i];
            if (bullet == obj) {
                this.removeChild(bullet);
                GameManager.currBulletPool.splice(i, 1);
            }
        }
    },
    onShipTransForm : function(type){
        cc.audioEngine.playEffect(res.audio_transform,false);
        var tipsIndex;
        if(!winSize.isMoonDay){
            switch(type)
            {
                case 4:
                    cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_CREATE_ICE_LAYER));
                    this.ship.runAction(AnctionManager.onTransFromIce(this.ship,winSize.transformTime));
                    tipsIndex = 0;
                    break;
                case 5:
                    this.ship.runAction(AnctionManager.onTransFromMusic(this.ship,winSize.transformTime));
                    tipsIndex = 1;
                    break;
            }
        }
        else{
            this.ship.runAction(AnctionManager.onTransFromMoon(this.ship,winSize.transformTime));
            tipsIndex = 2;
        }
        if(this.parent.UILayer.tipsCount[tipsIndex]<winSize.transformTipsLimit){
            this.parent.UILayer.tips[tipsIndex].runAction(cc.sequence(cc.fadeIn(1),cc.delayTime(5),cc.fadeOut(1)));
        }
        this.parent.UILayer.tipsCount[tipsIndex]++;
    },
    onUpdateShipBlood : function(event){
        var self = event.getCurrentTarget();
        self.ship.blood--;
        blood=self.ship.blood;
        if(blood>=0){
            self.onProtectCarrot();
            cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_UPDATE_HP));
            cc.audioEngine.playEffect(res.audio_collide,false);
        }
        else{
            self.flagGameOver = true;
            self.ship.removeFromParent();
            var delay = cc.delayTime(1);
                var callback = cc.callFunc(function(){
                    var event = new cc.EventCustom(jf.EventName.GP_CREATE_DIALOGS_LAYER);
                    event.setUserData({
                        text:"游戏结束",
                        cb:function(){
                            cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_GAME_OVER));
                        }.bind(self)
                    });
                    cc.eventManager.dispatchEvent(event);
                    cc.audioEngine.playEffect(res.audio_gameover,false);
                }.bind(self));
            self.runAction(cc.sequence(delay,callback)); 
        }
    }, 
    onProtectCarrot:function(){
        this.ship.attr({
            x:winSize.width/2,
            y:this.ship.height,
            protect:true,
            moveable:false
        })
        var a = new cc.Blink(1.5, 10);
        var callback = cc.callFunc(function(){
            this.ship.protect = false;
        }.bind(this))
        this.ship.runAction(cc.sequence(a,callback));
    },
    //[事件]游戏结束
    onGameOver : function(event){
        cc.audioEngine.stopMusic();
        var self = event.getCurrentTarget();
        var flag = false;
        if(userInfo.hightest<self.score){
            flag = true;
            xiha.ranking.addScore(self.score,self.bulletCount,self.level);
        }
        var data ={
            bulletCount : self.bulletCount,
            score  : self.score,
            level  : self.level,
            title  : xiha.getTitle(self.score),
            isNew  : flag
        };
        //console.info(data);
        cc.director.runScene(new GameResultScene(data));
    }
});
