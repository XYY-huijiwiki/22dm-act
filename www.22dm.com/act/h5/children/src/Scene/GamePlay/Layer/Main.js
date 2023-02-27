var GPMainLayer = cc.Layer.extend({
    z_Index : {hole_1 : 10,hole_2 : 20, hole_3 : 30,hole_4 : 40},
    btn_home : null,
    btn_music : null,
    ctor:function(){
        this._super(); 
    },
    onEnter : function(){
        this._super();
        this.property();     
        this.registerEvent();
        this.loadHole();
        this.loadButton();
    },
    onExit : function(){
        this._super();
    },
    property:function(){
        if(v_main.guide){      
            GameManager.reset();
            var event = new cc.EventCustom(jf.EventName.GP_CREATE_DIALOGS_LAYER);
            event.setUserData({
                text:"关卡 "+ v_main.Game_level,
                tips:"通关条件:  获得 "+GameManager.targetScore+" 分",
                cb:function(){
                    cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_TIMER_START));
                    timer_add = setInterval(function(){
                        if(GameManager.currEmptyHole.length>0){
                            cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_ROLE_START));
                            if(v_main.Game_level>=5){
                                if(Math.random()>0.7)
                                    cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_ROLE_START));
                                if(v_main.Game_level>=20){
                                    if(Math.random()>0.9)
                                        cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_ROLE_START));
                                }
                            }
                        }
                    },1000)		
                }.bind(this)
            });
            cc.eventManager.dispatchEvent(event);
        }
        else{
            v_main.active = 'guide';
        }
    },
    registerEvent : function(){
        var a = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();
                if(!GameManager.isGameOver){ //鼠洞区域
                    var location = {x:touch.getLocation().x/winSize.scale,y:touch.getLocation().y/winSize.scale};
                    if(location.y>=260 && location.y<=830 && !v_main.isHammer){
                        v_main.Game_add_hammer(touch.getLocation().x,touch.getLocation().y);
                    }
                    else if(location.y<230){ //技能区域
                        if(cc.rectContainsPoint(cc.rect(400-24,195-23,48,46),location)){
                            if(!GameManager.isSkilling)
                                v_main.Game_Ice >0 ? v_main.Game_Ice-- : null;
                            else{
                                var forbid = new cc.EventCustom(jf.EventName.GP_SKILL_FORBID);
                                forbid.setUserData({x:400,y:195});
                                cc.eventManager.dispatchEvent(forbid);
                                winSize.playEffect('forbid');
                            }
                        }
                        else if(cc.rectContainsPoint(cc.rect(455-24,195-23,48,46),location)){
                            if(!GameManager.isSkilling)
                                v_main.Game_Bomb >0 ? v_main.Game_Bomb-- : null;
                            else{
                                var forbid = new cc.EventCustom(jf.EventName.GP_SKILL_FORBID);
                                forbid.setUserData({x:455,y:195});
                                cc.eventManager.dispatchEvent(forbid);
                                winSize.playEffect('forbid');
                            }
                        }
                    }
                } 
                return true;
            },
            onTouchEnded:function(touch,event){
                var target = event.getCurrentTarget();
                if(touch.getLocation().y/winSize.scale>=850){
                    var rect_home = cc.rect(target.btn_home.x-target.btn_home.width/2, target.btn_home.y-target.btn_home.height/2, target.btn_home.width, target.btn_home.height);
                    var rect_music = cc.rect(target.btn_music.x-target.btn_music.width/2, target.btn_music.y-target.btn_music.height/2, target.btn_music.width, target.btn_music.height);
                    if(cc.rectContainsPoint(rect_home, {x:touch.getLocation().x/winSize.scale,y:touch.getLocation().y/winSize.scale})){
                        target.btn_home.setTouchEnabled(false);
                        if(!GameManager.isGameOver)
                            cc.director.runScene(new MainMenuScene());
                    }
                    else if(cc.rectContainsPoint(rect_music, {x:touch.getLocation().x/winSize.scale,y:touch.getLocation().y/winSize.scale})){
                        if(target.btn_music._bright){  //静音
                            target.btn_music.setBright(false);
                            winSize.setEffectsVolume(0);
                        }
                        else{   //开启声音
                            target.btn_music.setBright(true);
                            winSize.setEffectsVolume(1);
                        }
                    }
                }
                return true;
            }
        });
        cc.eventManager.addListener(a,this);

        // [事件监听]游戏结束事件
        var b = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_GAME_OVER,
            callback    : this.onGameOver
        });
        cc.eventManager.addListener(b, this);

        // [事件监听]锤子添加
        var c = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_ADD_HAMMER,
            callback    : this.loadHammer
        });
        cc.eventManager.addListener(c, this);

        // [事件监听]角色添加
        var d = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_ROLE_START,
            callback    : this.loadRole
        });
        cc.eventManager.addListener(d, this);

        // [事件监听]炸弹清除
        var e = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_BOMB_RUN,
            callback    : this.loadBomb
        });
        cc.eventManager.addListener(e, this);
    },
    loadRole : function(event){
        var self = event.getCurrentTarget();
        var tr = Math.random();
        var type=0,speed=0.3,downDelay=0.35,upDelay=0;
        if(tr>0.5){
            if(tr>0.95 && (v_main.Game_Ice<4&&v_main.Game_Bomb<4))
                type = Math.round(Math.random()*1+5);
            else
                type = Math.round(Math.random()*4);
        }
        var random = Math.round(Math.random()*(GameManager.currEmptyHole.length-1));
        var hole = GameManager.currEmptyHole[random];
        GameManager.currEmptyHole.splice(random,1);
        var column = Math.round((hole+1)%2);
        var row = Math.ceil(Math.round(hole/2))+1;
        var x = GameManager.rolePos[type].pos[column];
        var y = GameManager.rolePos[type].pos[row];
        if(v_main.Game_level>=10){
            speed =  (Math.random()*0.15+0.2).toFixed(2)*1;
            downDelay = (Math.random()*0.2+0.1).toFixed(2)*1;
            upDelay = (Math.random()*0.3+0.2).toFixed(2)*1;
        }
        var up = GameManager.rolePos[type].up;
        var node = new cc.Sprite("#"+GameManager.rolePos[type].name+".png");
        //console.info("hole:"+hole+",row:"+row+",column:"+column+",x:"+x+",y:"+y+",name:"+GameManager.rolePos[type].name);
        //console.info(GameManager.currEmptyHole);
        node.attr({
            x : x,
            y : y,
            by : y,
            type : type,
            hole : hole,
            up : up,
            alive : true
        });
        self.addChild(node,GameManager.roleIndex[row-2]);
        GameManager.currRolePool.push(node);
        node.runAction(ActionManager.GP_ROLE_UP(speed,up,upDelay,downDelay,function(){
            this.removeRole(node);
        }.bind(self)));
    },
    removeRole : function(node){
        for (var i = 0; i < GameManager.currRolePool.length; i++) {
            if (GameManager.currRolePool[i] == node){
                if(GameManager.currRolePool[i].type==0 && GameManager.currRolePool[i].alive){ 
                    GameManager.isCombo = 0;
                }
                GameManager.currEmptyHole.push(node.hole);
                GameManager.currRolePool.splice(i,1);
                node.removeFromParent();
	            break;
	        }
        }
    },
    checkCollide : function(data){
        var row=0,column=0;
        if(data.x>=GameManager.holeBox[0][0] && data.x<=GameManager.holeBox[0][1])
            column = 1;
        else if(data.x>=GameManager.holeBox[0][2] && data.x<=GameManager.holeBox[0][3])
            column = 2;
        if(data.y<=GameManager.holeBox[1][3] && data.y>=GameManager.holeBox[1][2])
            row = 3;
        if(data.y<=GameManager.holeBox[1][2] && data.y>=GameManager.holeBox[1][1])
            row = 2;
        if(data.y<=GameManager.holeBox[1][1] && data.y>=GameManager.holeBox[1][0])
            row = 1;
        if(row!=0 && column!=0){
            var hole = column + (row-1)*2;
            var node = null;
            for(var i=0;i<GameManager.currRolePool.length;i++){
                if(hole==GameManager.currRolePool[i].hole && GameManager.currRolePool[i].alive){
                    node = GameManager.currRolePool[i];
                    break;
                }
            }
            if(node!=null){
                if((node.y-node.by) > (node.up/2))
                {
                    node.alive = false;
                    node.stopAllActions();
                    if(node.type==0){
                        GameManager.isCombo++;
                        var score = GameManager.isCombo>=3?3:GameManager.isCombo;
                        if(GameManager.isCombo>=2)
                            cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_ADD_COMBO_TIP));
                        v_main.Game_score+=score;
                        var event = new cc.EventCustom(jf.EventName.GP_ADD_SCORE_TIP);
                        event.setUserData({location:data,score:score});
                        cc.eventManager.dispatchEvent(event);
                        winSize.playEffect('mouse');
                    }
                    else if(node.type<4){ 
                        GameManager.isCombo = 0;
                        v_main.Game_hp--;
                        winSize.playEffect('lose');
                    }
                    else if(node.type==4){
                        v_main.Game_wolf(data);
                        winSize.playEffect('prize');
                    }
                    if(node.type<=4){
                        node.runAction(ActionManager.GP_ROLE_COLLIDE(node.type,node.by,node.y,node.up,function(){
                            this.removeRole(node);
                        }.bind(this)));
                    }
                    else{
                        node.type == 5 ? v_main.Game_Ice++:v_main.Game_Bomb++;
                        node.setLocalZOrder(200);
                        node.runAction(ActionManager.GP_SKILL_COLLIDE((node.type==5?400:455),function(){
                            this.removeRole(node);
                        }.bind(this)));
                    }
                }
            }
        }
    },
    onGameOver : function(event){
        clearInterval(timer_add);
        GameManager.isGameOver = true;
        if(v_main.Game_score>=GameManager.targetScore && v_main.Game_hp>=0){
            setTimeout(function(){
                v_main.Game_next();
            },800)
        }
        else{
            if(!v_main.share){
                setTimeout(function(){
                    v_main.tips = '暑期大放送！分享给好友即可获得重新进入下一关机会。';
                },800)
            }
            else{
                var event = new cc.EventCustom(jf.EventName.GP_CREATE_DIALOGS_LAYER);
				event.setUserData({
                    text:"游戏结束",
                    tips:'',
					cb:function(){
                        cc.director.runScene(new GameResultScene({score:GameManager.totalScore,theme:winSize.getTheme(GameManager.totalScore)}));
					}.bind(this)
                });
                setTimeout(function(){
                    cc.eventManager.dispatchEvent(event);
                },800)
            }
        }
    },
    loadHammer : function(event){
        var self = event.getCurrentTarget();
        var data = event.getUserData();
        var node = new cc.Sprite("#hammer_0.png");
        node.attr({
            x : data.x+35,
            y : data.y+170
        });
        self.addChild(node,200);
        GameManager.currHammerPool.push(node);
        node.runAction(ActionManager.GP_ADD_HAMMER(function(){
            this.removeHammer(node);
            v_main.isHammer = false;
        }.bind(self)));
        self.checkCollide(data);
    },
    loadBomb : function(event){
        var self = event.getCurrentTarget();
        for(var i=0;i<GameManager.currRolePool.length;i++){
            if(GameManager.currRolePool[i].type==0 && GameManager.currRolePool[i].alive){
                var node = GameManager.currRolePool[i];
                node.stopAllActions();
                node.runAction(ActionManager.GP_ROLE_COLLIDE(node.type,node.by,node.y,node.up,function(){
                    this.removeRole(node);
                }.bind(self)));
                v_main.Game_score++;
            }
        }
    },
    removeHammer : function(node){
        for (var i = 0; i < GameManager.currHammerPool.length; i++) {
            if (GameManager.currHammerPool[i] == node) {
                node.removeFromParent();
                GameManager.currHammerPool.splice(i,1);
	            break;
	        }
	    }
    },
    loadHole : function(){
        var hole_1 = new cc.Sprite("#hole_1.png");
        var hole_2 = new cc.Sprite("#hole_2.png");
        var hole_3 = new cc.Sprite("#hole_3.png");
        var hole_4 = new cc.Sprite("#hole_4.png");
        hole_4.attr({
            anchorX : 0,
            anchorY : 0,
            x : 0,
            y : 0
        });
        hole_3.attr({
            anchorX : 0,
            anchorY : 0,
            x : 0,
            y : hole_4.height - 25
        });
        hole_2.attr({
            anchorX : 0,
            anchorY : 0,
            x : 0,
            y : hole_3.y + hole_3.height - 28 
        });
        hole_1.attr({
            anchorX : 0,
            anchorY : 0,
            x : 0,
            y : hole_2.y + hole_2.height - 32
        });
        this.addChild(hole_1,this.z_Index.hole_1);
        this.addChild(hole_2,this.z_Index.hole_2);
        this.addChild(hole_3,this.z_Index.hole_3);
        this.addChild(hole_4,this.z_Index.hole_4);
    },
    loadButton : function(){
        var home = new ccui.Button("btn_home.png","btn_home.png","btn_home.png",ccui.Widget.PLIST_TEXTURE);
        home.setPressedActionEnabled(true);
        home.attr({
            x:575,
            y:winSize.height - 110
        });
        var music = new ccui.Button("btn_music_1.png","btn_music_1.png","btn_music_0.png",ccui.Widget.PLIST_TEXTURE);
        music.setPressedActionEnabled(true);
        music.attr({
            x:575,
            y:winSize.height - 220
        });
        if(cc.audioEngine.getEffectsVolume()==0){
            music.setBright(false);
        }
        this.btn_home = home;
        this.btn_music = music;
        this.addChild(home);
        this.addChild(music);
        if(winSize.scale*1>0.97)
        {
            home.setZoomScale(0.15);
            music.setZoomScale(0.15);
            home.addTouchEventListener(function(sender,type){
                if(type == ccui.Widget.TOUCH_ENDED)
                {
                    sender.setTouchEnabled(false);
                    if(!GameManager.isGameOver)
                        cc.director.runScene(new MainMenuScene());
                }
            },this);
            music.addTouchEventListener(function(sender,type){
                if(type == ccui.Widget.TOUCH_ENDED)
                {
                    if(sender._bright){  //静音
                        sender.setBright(false);
                        winSize.setEffectsVolume(0);
                    }
                    else{   //开启声音
                        sender.setBright(true);
                        winSize.setEffectsVolume(1);
                    }
                }
            },this);
        }
    }
});