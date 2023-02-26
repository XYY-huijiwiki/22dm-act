var GPMainLayer = cc.Layer.extend({
    IsStart      : true,
    score        : 0,
    role         : null,
    rule         : null,
    flagGameOver : false,
    ctor:function(IsStart){
        this._super(); 
        this.IsStart = IsStart;
        if(!cc.audioEngine.isMusicPlaying())
            cc.audioEngine.playMusic(res.audio_music, true);
    },
    onEnter : function(){
        this._super();
        this.property();     
        this.loadRole();
        this.loadRuleTips();
        this.scheduleUpdate();
        this.registerEvent();
    },
    property:function(){
        this.score = 0;
        this.flagGameOver = false;
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

        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget(); 
                if(target.IsStart){
                    if(!target.flagGameOver && !cc.director.isPaused()){
                        var location = touch.getLocation();
                        if (!cc.director.isPaused()) {      
                            if(location.x>winSize.width/2){
                                if(target.role.direction!=-1){
                                    target.role.x += winSize.MoveOffset;
                                    target.role.direction = 1;
                                    return true;
                                }
                            }   
                            else{
                                if(target.role.direction!=1){
                                    target.role.x -= winSize.MoveOffset;
                                    target.role.direction = -1;
                                    return true;
                                }
                            }         
                        }     
                    }
                }
                else{
                    target.IsStart = true;
                    target.onRemoveRuleTips();
                }
            },
            onTouchEnded:function(touch,event){
                var target = event.getCurrentTarget();
                if(!target.flagGameOver){
                    target.role.x -= target.role.direction==1 ? winSize.MoveOffset : -winSize.MoveOffset;
                    target.role.direction = 0;
                }
            }
        });
        cc.eventManager.addListener(listener,this);
    },
    loadRole:function(){
        var role = new cc.Sprite("#r_0_1_1.png");
        role.attr({
            x : winSize.beginX,
            y : winSize.beginY,
            direction : 0
        });
        this.role = role;
        this.addChild(role);
    },
    loadRuleTips:function(){
        if(!this.IsStart){
            var node = new cc.Sprite(res.gp_guide);
            node.attr({
                x : winSize.width/2,
                y : winSize.height/2
            });
            this.rule = node;
            this.addChild(node,20);
        }
        else{
            var event = new cc.EventCustom(jf.EventName.GP_CREATE_DIALOGS_LAYER);
            event.setUserData({
                text:"关卡 1 ",
                cb:function(){
                    cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_RUN));
                }.bind(this)
            });
            cc.eventManager.dispatchEvent(event);
        }
    },
    update : function(){
        if(!this.flagGameOver){
            this.checkCollide();  
        }
    },
    checkCollide : function(){
        var enemy = null;
        var enemyRect = null;
        for(var i=0;i<GameManager.currMonsterPool.length;i++){
            enemy = GameManager.currMonsterPool[i];
            enemyRect = enemy.getBoundingBox();
            if(cc.rectContainsPoint(enemyRect,cc.p(this.role.x,this.role.y))){
                //console.info("collide: "+enemy.random);
                this.removeMonsterByIndex(i, 1);
                return;
            }
            else if(enemy.y+90 < this.role.y){
                if(enemy.random==1){
                    GameManager.currMonsterPool.splice(i, 1);
                    // setTimeout(function(){
                    //     enemy.removeFromParent();                  
                    // },500)
                    return;
                }
                else{
                    cc.audioEngine.playEffect(res.audio_failed,false);
                    this.flagGameOver = true;
                    this.parent.stopAllActions();
                    this.role.stopAllActions();
                    var event = new cc.EventCustom(jf.EventName.GP_CREATE_DIALOGS_LAYER);
                    event.setUserData({
                        text:"游戏结束",
                        cb:function(){
                            //console.info("游戏结束");
                            cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_GAME_OVER));
                        }.bind(this)
                    });
                    cc.eventManager.dispatchEvent(event);  
                    return;       
                }
            }
        }
    },
    removeMonsterByIndex : function(i){
        var enemy = GameManager.currMonsterPool[i];
        GameManager.currMonsterPool.splice(i, 1);
        enemy.stopAllActions();
        if(enemy.random>2){
            cc.audioEngine.playEffect(res.audio_die,false);
            enemy.runAction(ActionManager.GP_ENEMY_COLLIDE(enemy.random,enemy.x,null));
        }
        if(enemy.random==2){
            enemy.runAction(ActionManager.GP_ENEMY_COLLIDE(enemy.random,enemy.x,null));
            this.score++;
            var event = new cc.EventCustom(jf.EventName.GP_UPDATE_SCORE);
            event.setUserData({
                score : this.score
            });
            cc.eventManager.dispatchEvent(event); 
            cc.audioEngine.playEffect(res.audio_success,false);
        }
        else if(enemy.random==1){
            cc.audioEngine.playEffect(res.audio_failed,false);
            this.flagGameOver = true;
            this.parent.stopAllActions();
            this.role.stopAllActions();
            enemy.runAction(ActionManager.GP_ENEMY_COLLIDE(enemy.random,enemy.x,function(){
                var event = new cc.EventCustom(jf.EventName.GP_CREATE_DIALOGS_LAYER);
                event.setUserData({
                    text:"游戏结束",
                    cb:function(){
                        //console.info("游戏结束");
                        cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_GAME_OVER));
                    }
                });
                cc.eventManager.dispatchEvent(event);         
            }));
        }   
    },
    onRemoveRuleTips:function(){
        var node = this.rule;
        node.removeFromParent();
        var event = new cc.EventCustom(jf.EventName.GP_CREATE_DIALOGS_LAYER);
        event.setUserData({
            text:"关卡 1 ",
            cb:function(){
                cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_RUN));
            }.bind(this)
        });
        cc.eventManager.dispatchEvent(event);
    },
    onGameOver : function(event){
        cc.audioEngine.stopMusic();
        var self = event.getCurrentTarget();
        if(userInfo.hightest<self.score)
            dialogs.ranking.addScore(self.score);
        var data ={
            theme : dialogs.getTheme(self.score),
            score : self.score
        };
        cc.director.runScene(new GameResultScene(data));
    }
});