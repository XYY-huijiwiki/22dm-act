var GPMainLayer = ccui.Layout.extend({
    guideLayer   : null,
    isMoving     : false,
    isSkillMoving : false,
    ctor:function(){
        this._super(); 
    },
    onEnter : function(){
        this._super();
        this.loadConfig();
        this.property();     
        this.loadArticles();
        this.loadRuleTips();
        this.registerEvent();
        //this.loadParticleSnow();
    },
    onExit : function(){
        this._super();
    },
    loadConfig : function(){
        this.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        this.setBackGroundColorOpacity(70);
        this.attr({
            anchorX : 0,
            anchorY : 0,
            width : winSize.TmxWidth,
            height : winSize.TmxHeight,
            x : 20,
            y : 117
        });
    },
    property:function(){
        this.isMoving = false;
        this.isSkillMoving = false;
    },
    registerEvent : function(){
        var a = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();
                if(!target.isSkillMoving && !GameManager.isGameOver){
                    var locationInNode = target.convertToNodeSpace(touch.getLocation());
                    var s = target.getContentSize();
                    var rect = cc.rect(0, 0, s.width, s.height);
                    if (cc.rectContainsPoint(rect, locationInNode)) {               
                        return true;
                    } 
                } 
                else if(target.guideLayer!=null){
                    target.onRemoveRuleTips();
                }
                return false;
            },
            onTouchMoved:function(touch,event){
                var target = event.getCurrentTarget(); 
                if(!target.isSkillMoving){
                    var delta = touch.getDelta();
                    if( Math.abs(delta.x)>5){
                        target.isMoving = true;
                        var dx = Math.round(target.x + delta.x);
                        if(dx>=-(target.width-640+20) && dx<=20){
                            target.x += delta.x;
                        }      
                    }        
                }
            },
            onTouchEnded:function(touch,event){
                var target = event.getCurrentTarget(); 
                if(!target.isMoving && !target.isSkillMoving){
                    target.checkCollide(touch.getLocation());
                }
                target.isMoving = false;
            }
        });
        cc.eventManager.addListener(a,this);

        // [事件监听]加减分提示
        var b = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_CREATE_ARTICLE_TIP,
            callback    : this.onCreateArticleTips
        });
        cc.eventManager.addListener(b, this);

        // [事件监听]使用技能
        var c = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_SKILL_USE,
            callback    : this.onSkillUse
        });
        cc.eventManager.addListener(c, this);

        // [事件监听]游戏结束事件
        var d = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_GAME_OVER,
            callback    : this.onGameOver
        });
        cc.eventManager.addListener(d, this);

    },
    loadParticleSnow : function(){
        var particle1 = new cc.ParticleSystem(res.gp_snow_plist);
        var particleBatchNode = new cc.ParticleBatchNode(particle1.texture);
        this.addChild(particleBatchNode);
        particleBatchNode.addChild(particle1);
        particle1.x = 320;
        particle1.y = 850;
    },
    loadArticles : function(){
        var tmx_random = Math.round(Math.random()*(GP_TMX.length-1));
        var timerCount = Math.round(Math.random()*winSize.TimerMax);
        var src;
        GameManager.currArticlePool = [];
        for(var i=0;i<winSize.ArtRows;i++){
            for(var j=0;j<winSize.ArtColumn;j++){
                var random = winSize.ArtSequence[Math.round(Math.random()*(winSize.ArtSequence.length-1))];
                var e = "lose";
                src = random;
                if(timerCount>0&&Math.random()>=winSize.ProbabilityTimer){
                    random = 100;
                    src = "time";
                    e = "timer";
                    timerCount--;
                }
                for(var k=0;k<GameManager.currArticleTarget.length;k++){
                    for (var z = 0; z < GameManager.currArticleTarget[k].total; z++) {
                        if(i==GameManager.currArticleTarget[k].position[z].x && j==GameManager.currArticleTarget[k].position[z].y){
                            random = GameManager.currArticleTarget[k].target;
                            src = GameManager.currArticleTarget[k].brother?random+"_1":random;
                            e = "find";
                        }
                        if(GameManager.currArticleTarget[k].isRearrange){
                            if(i==GameManager.currArticleTarget[k].positionRearrange[z].x && j==GameManager.currArticleTarget[k].positionRearrange[z].y){
                                random = GameManager.currArticleTarget[k].target;
                                src = GameManager.currArticleTarget[k].brother?random:random+"_1";
                                e = "rearrange";
                            }
                        }  
                    }
                }
                var node = new cc.Sprite("#dj_"+src+".png");
                node.attr({
                    anchorX : 0.5,
                    anchorY : 0.5,
                    x : GP_TMX[tmx_random][i][j].x+65,
                    y : GP_TMX[tmx_random][i][j].y+65,
                    random : random,
                    rotation : Math.round(Math.random()*360),
                    scale : (Math.random() * (1.2 - 0.6) + 0.6).toFixed(2)*1,
                    isClicking : false,
                    effect : e
                });
                //e=="find"?console.info(i+","+j+": random"+random+" effect:"+e):null; 
                if(e=="timer"){
                    node.attr({
                        scale : 1,
                        rotation : 0
                    });
                    node.runAction(ActionManager.GP_TIMER_ROTATE());
                }
                this.addChild(node);
                GameManager.currArticlePool.push(node); 
            }
        }
    },
    checkCollide : function(location){
        var article = null;
        var articleRect = null;
        for(var i=0;i<GameManager.currArticlePool.length;i++){
            article = GameManager.currArticlePool[i];
            articleRect = article.getBoundingBox();
            articleRect.x = article.x+this.x-winSize.CCricle/2; 
            articleRect.y = article.y+this.y-winSize.CCricle/2;
            articleRect.width = winSize.CCricle;
            articleRect.height = winSize.CCricle;
            if(cc.rectContainsPoint(articleRect,cc.p(location.x,location.y))){
                if(!article.isClicking && !this.isSkillMoving){
                    article.isClicking = true;
                    //console.info(article.random);
                    for(var j=0;j<GameManager.currArticleTarget.length;j++){
                        if(article.random==GameManager.currArticleTarget[j].target){
                            //console.info(article.effect);
                            if(article.effect!="rearrange"){
                                this.onFindArticle(i,j);
                                return; 
                            }
                            else{
                                this.isSkillMoving = true;
                                this.onRearrange(i);
                                return; 
                            }
                        }
                    }
                    switch(article.effect){
                        case "lose":
                            this.onLoseArticle(i);
                            return; 
                            break;
                        case "timer":
                            this.onFindTimer(i);
                            return; 
                            break;
                    }
                }
                return;       
            }
        }
    },
    onArticleRemove:function(article){
        article.removeFromParent();
        for(i in GameManager.currArticlePool){
            if(article==GameManager.currArticlePool[i])
                GameManager.currArticlePool.splice(i, 1);
        }
        var aaaa = 0;
        for(z in GameManager.currArticlePool){
            if(GameManager.currArticlePool[z].effect=="find")
                aaaa++;
        }  
        console.info(aaaa);
    },
    onFindArticle : function(i,j){
        var article = GameManager.currArticlePool[i];
        GameManager.currArticleTarget[j].total--;
        GameManager.currArticleTargetTotal--;
        if(GameManager.currArticleTargetTotal==0){
            GameManager.currTimer.pause();
            GameManager.currTimerText.pause();
            GameManager.currSkill++;
        }
        article.runAction(ActionManager.GP_ARTICLE_FIND(function(){
            this.onArticleRemove(article);
            if(GameManager.currArticleTargetTotal==0)
                cc.director.runScene(new GamePlayScene());

        }.bind(this)));
        GameManager.currScore += 100; 
        var a = new cc.EventCustom(jf.EventName.GP_CREATE_ARTICLE_TIP);
        var b = new cc.EventCustom(jf.EventName.GP_UPDATE_SCORE_TEXT);
        var c = new cc.EventCustom(jf.EventName.GP_UPDATE_ARTICLE_TEXT);
        a.setUserData({
            text : "+100",
            location : article.getBoundingBox(),
            find : true
        });
        c.setUserData({
            target : article.random,
            total : GameManager.currArticleTarget[j].total
        })
        cc.eventManager.dispatchEvent(a); 
        cc.eventManager.dispatchEvent(b);
        cc.eventManager.dispatchEvent(c);       
        cc.audioEngine.playEffect(res.audio_find,false);
    },
    onLoseArticle : function(i){
        var article = GameManager.currArticlePool[i];
        article.runAction(ActionManager.GP_ARTICLE_LOSE(function(){
            article.isClicking = false;
        }));
        var a = new cc.EventCustom(jf.EventName.GP_CREATE_ARTICLE_TIP);
        a.setUserData({
            text : "-100",
            location : article.getBoundingBox(),
            find : false
        });
        if(GameManager.currScore>=100){
            GameManager.currScore -= 100;
            var b = new cc.EventCustom(jf.EventName.GP_UPDATE_SCORE_TEXT);
            cc.eventManager.dispatchEvent(a);  
            cc.eventManager.dispatchEvent(b);      
        }
        cc.audioEngine.playEffect(res.audio_lose,false);  
    },
    onFindTimer : function(i){
        var article = GameManager.currArticlePool[i];
        article.runAction(ActionManager.GP_ARTICLE_FIND(function(){
            this.onArticleRemove(article);
        }.bind(this)));
        var addTimerTip = new cc.EventCustom(jf.EventName.GP_ADD_TIMER);
        cc.eventManager.dispatchEvent(addTimerTip); 
        cc.audioEngine.playEffect(res.audio_timer,false);  
    },
    onRearrange : function(index){
        GameManager.currTimer.pause();
        GameManager.currTimerText.pause();
        var article = GameManager.currArticlePool[index];
        var position = [];
        var random = [];
        for(var i=0;i<GameManager.currArticlePool.length;i++){
            if(!GameManager.currArticlePool[i].isClicking){
                random.push(i);
            }
        }
        while(random.length!=0){
            var r = Math.round(Math.random()*(random.length-1));
            position.push({x:GameManager.currArticlePool[random[r]].x,y:GameManager.currArticlePool[random[r]].y});
            random.splice(r,1);
        }
        for(var i=0;i<GameManager.currArticlePool.length;i++){
            if(!GameManager.currArticlePool[i].isClicking){
                GameManager.currArticlePool[i].runAction(ActionManager.GP_ARTICLE_REARRANGE_MOVE(position[0]));
                position.splice(0,1);
            }
        }
        article.runAction(ActionManager.GP_ARTICLE_REARRANGE(function(){
            article.isClicking = false;
            this.isSkillMoving = false;
            GameManager.currTimer.resume();
            GameManager.currTimerText.resume();
        }.bind(this)));
        var a = new cc.EventCustom(jf.EventName.GP_CREATE_ARTICLE_TIP);
        a.setUserData({
            text : "-100",
            location : article.getBoundingBox(),
            find : false
        });
        if(GameManager.currScore>=100){
            GameManager.currScore -= 100;
            var b = new cc.EventCustom(jf.EventName.GP_UPDATE_SCORE_TEXT);
            cc.eventManager.dispatchEvent(a);  
            cc.eventManager.dispatchEvent(b);      
        }
        cc.audioEngine.playEffect(res.audio_rearrange,false);
    },
    onSkillUse : function(event){
        var self = event.getCurrentTarget();
        if(GameManager.currSkill>0 && GameManager.currArticleTargetTotal>0 && !self.isSkillMoving && !self.isMoving){
            var hasTarget = false,target;
            for(var i=0;i<GameManager.currArticleTarget.length;i++){
                if(GameManager.currArticleTarget[i].total>0){
                    target = GameManager.currArticleTarget[i].target;
                    console.info("skill find: "+target+" , total: "+GameManager.currArticleTarget[i].total);
                    hasTarget = true;                   
                    break;
                }
            }
            if(hasTarget){
                self.onSkillMove(target);
            }
        }
        else{
            var b = new cc.EventCustom(jf.EventName.GP_CREATE_FORBID_TIP);
            b.setUserData({
                location : {x:580,y:35}
            })
            cc.eventManager.dispatchEvent(b);
        }
    },
    onSkillMove : function(target){
        var position,article=null,locationX=null;
        for(var i=0;i<GameManager.currArticlePool.length;i++){
            if(GameManager.currArticlePool[i].random==target && !GameManager.currArticlePool[i].isClicking && GameManager.currArticlePool[i].effect=="find"){
                article = GameManager.currArticlePool[i];
                position = article.getBoundingBox();
                break;
            }
        }
        if(article!=null){
            article.stopAllActions();
            article.runAction(ActionManager.GP_ARTICLE_BLINK());
            GameManager.currSkill--;
            var updateSkillText = new cc.EventCustom(jf.EventName.GP_UPDATE_SKILL_TEXT);
            cc.eventManager.dispatchEvent(updateSkillText);
            cc.audioEngine.playEffect(res.audio_button,false);
            var mapX=Math.abs(this.x);
            if(position.x<mapX-90){ //向左移动
                locationX = position.x-255 > 0 ? position.x-255 : 0;
            } 
            else if(position.x>mapX+550){  //向右移动
                locationX = position.x-255 < this.width-winSize.width ? position.x-255 : this.width-winSize.width;
            }
            if(locationX!=null){
                this.isSkillMoving = true;
                GameManager.currTimer.pause();
                GameManager.currTimerText.pause();
                this.runAction(ActionManager.GP_MOVE_MAP(-locationX,this.y,function(){
                    this.isSkillMoving = false;
                    GameManager.currTimer.resume();
                    GameManager.currTimerText.resume();
                }.bind(this)));
            }        
        }
    },
    loadArticleTips : function(text,location,find){
        var node = new ccui.Text(text, "Arial", 40);
        node.setTextColor(find?cc.color(0,255,0):cc.color(255,0,0));
        this.addChild(node);
        node.attr({
            anchorX : 0.5,
            anchorY : 0,
            x : location.x + (node.width+winSize.ArtMargin) / 2,
            y : location.y + this.y
        });
        node.runAction(ActionManager.GP_ARTICLE_TIP(function(){
            node.removeFromParent();
        }));
    },
    onCreateArticleTips : function(event){
        var self = event.getCurrentTarget();
        var text = event.getUserData().text;
        var location = event.getUserData().location;
        var find = event.getUserData().find;
        self.loadArticleTips(text,location,find);
    },
    loadRuleTips : function(){
        this.isSkillMoving = true;
        if(winSize.isFirstTime){
            var node = new cc.Sprite(res.gp_guide);
            node.attr({
                anchorX : 0,
                anchorY : 0,
                x : -20,
                y : -117
            });
            this.guideLayer = node;
            this.addChild(node);   
            winSize.isFirstTime = false; 
        }
        else{
            var event = new cc.EventCustom(jf.EventName.GP_CREATE_DIALOGS_LAYER);
            event.setUserData({
                text:"关卡 "+GameManager.currLevel,
                cb:function(){
                    this.isSkillMoving = false;
                    cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_TIMER_START));
                }.bind(this)
            });
            cc.eventManager.dispatchEvent(event);
        }
    },
    onRemoveRuleTips:function(){
        var node = this.guideLayer;
        node.removeFromParent();
        this.guideLayer = null;
        var event = new cc.EventCustom(jf.EventName.GP_CREATE_DIALOGS_LAYER);
        event.setUserData({
            text:"关卡 1",
            cb:function(){
                this.isSkillMoving = false;
                cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_TIMER_START));
            }.bind(this)
        });
        cc.eventManager.dispatchEvent(event);
    },
    onGameOver : function(event){
        if(GameManager.currArticleTargetTotal!=0){
            GameManager.isGameOver = true;
            if(userInfo.hightest<GameManager.currScore)
                dialogs.ranking.addScore(GameManager.currScore);
            var data ={
                theme : dialogs.getTheme(GameManager.currScore),
                score : GameManager.currScore
            };
            var event = new cc.EventCustom(jf.EventName.GP_CREATE_DIALOGS_LAYER);
            event.setUserData({
                text:"时间到了!",
                cb:function(){
                    cc.director.runScene(new GameResultScene(data));      
                }.bind(this)
            });
            cc.eventManager.dispatchEvent(event);
            cc.audioEngine.playEffect(res.audio_faile,false);   
        }
        else{
            GameManager.currSkill++;
            cc.director.runScene(new GamePlayScene());
        }
    }
});