var GPMainLayer = cc.Layer.extend({
    platform : null,
    role : null,
    bullet : null,
    bulletlocation : null,
    strength : null,
    dt : 0,
    ctor:function(){
        this._super(); 
    },
    onEnter : function(){
        this._super();
        this.loadForbiddenLine();
        this.loadPlatform();
        this.loadStrength();
        this.registerEvent();
        this.scheduleUpdate();
        if(v_main.guide<10){
            v_main.active = "guide";
        }
        else{
            GameManager.createWolfPoor();
        }
    },
    onExit : function(){
        this._super();
    },
    registerEvent : function(){
        var a = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                if(!v_main.Game_over && v_main.canPlay){
                    v_main.Game_touch = true;
                    return true;
                }
            },
            onTouchMoved: function (touch, event) {
                var target = event.getCurrentTarget(); 
                var delta = touch.getDelta();
                var newAngle = isPc ? target.platform.rotation-delta.y/5 : target.platform.rotation-delta.x/5;
                //var newAngle = target.platform.rotation-delta.y/5;
                if(newAngle>=0 && newAngle<=GameManager.roleSetting["role_"+GameManager.currentRoleId].maxRotation){
                    target.platform.rotation = newAngle;
                    //console.log(newAngle);
                }
                return true;
            },
            onTouchEnded : function(touch, event){
                v_main.Game_touch = false;
                return true;
            }
        });
        cc.eventManager.addListener(a,this);

        // [事件监听] 角色蓄力动画
        var b = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_ROLE_ATTACK_BEFORE,
            callback    : this.onRoleAttackBefore
        });
        cc.eventManager.addListener(b, this);

        // [事件监听] 角色攻击动画
        var c = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_ROLE_ATTACK_AFTER,
            callback    : this.onRoleAttackAfter
        });
        cc.eventManager.addListener(c, this);
    },
    loadPlatform : function(){
        var stand = new cc.Sprite();
        var pillar = new cc.Sprite(res.gp_pillar);
        var platform = new cc.Sprite(res.gp_platform);     
        var bulletlocation = new cc.Sprite();   
        var location = [[190,130],[150,100]];  
        pillar.attr({
            anchorX : 0.5,
            anchorY : 1,
            x : 170,
            y : 350
        });
        platform.attr({
            anchorX : 0.5,
            anchorY : 0.5,
            x : 200,
            y : 350,
            rotation : 15
        });
        bulletlocation.attr({
            x : location[GameManager.currentRoleId-1][0],
            y : location[GameManager.currentRoleId-1][1]
        });
        this.platform = platform;
        this.bulletlocation = bulletlocation;
        stand.addChild(pillar,5);
        stand.addChild(platform,10);
        platform.addChild(bulletlocation);
        this.loadRole();
        this.addChild(stand);
    },
    loadRole : function(){
        var location = [[0,250],[0,250]];
        var role = new cc.Sprite("#role_"+GameManager.currentRoleId+"_1.png");
        role.attr({
            anchorX : 0,
            anchorY : 1,
            x : location[GameManager.currentRoleId-1][0],
            y : location[GameManager.currentRoleId-1][1],
            active : "normal"
        });
        this.role = role;
        this.platform.addChild(role,20);
    },
    onloadBullet : function(){
        var mask = new cc.Sprite();
        var bullet = new cc.Sprite(res["gp_bullet_"+GameManager.currentRoleId+"_1_1"]);
        var setting = GameManager.getBulletSetting();
        mask.attr({
            anchorX:0.5,
            anchorY:0.5,
            x:this.bulletlocation.getBoundingBoxToWorld().x,
            y:this.bulletlocation.getBoundingBoxToWorld().y,
            rotation : this.platform.rotation
        });
        bullet.attr({
            anchorX : 0.5,
            anchorY : 0.5,
            x : 0+bullet.width/2,
            y : 0+bullet.height/2,
            scale : setting.scale,
            setting : setting
        });
        mask.addChild(bullet);
        this.addChild(mask,1000);
        GameManager.currentBullet.push(bullet);
        bullet.runAction(ActionManager.GP_BULLECT_NORMAL(function(){
            bullet.parent.removeFromParent();
            this.onBulletRemove(bullet);
        }.bind(this)));
        winSize.playEffect('bullet_'+GameManager.currentRoleId);
    },
    onRoleAttackBefore : function(event){
        var self = event.getCurrentTarget();
        self.strength.x=0;
        self.strength.parent.visible=true;
        self.role.stopAllActions();
        self.role.runAction(ActionManager.GP_ROLE_ATTACK_BEFORE(GameManager.currentRoleId));
    },
    onRoleAttackAfter : function(event){
        var self = event.getCurrentTarget();
        self.strength.x=0;
        self.strength.parent.visible=false;
        self.role.stopAllActions();
        var roleSetting = GameManager.roleSetting["role_"+GameManager.currentRoleId];
        if(v_main.Game_strength > roleSetting.action.length[0]*GameManager.roleSetting["role_"+GameManager.currentRoleId].maxStrength/roleSetting.action.length[0]/roleSetting.action.speed){
            self.role.runAction(ActionManager.GP_ROLE_ATTACK_AFTER(GameManager.currentRoleId));
            self.onloadBullet();
        }
        else{
            self.role.runAction(ActionManager.GP_ROLE_ATTACK_RESET(GameManager.currentRoleId));
        }
    },
    loadStrength : function(){
        var strength = new cc.Sprite();
        var bg = new cc.Sprite(res.gp_strength_bg);
        var main = new cc.Sprite(res.gp_strength_main);
        strength.attr({
            anchorX : 0,
            anchorY : 0,
            x : winSize.width/2-62.5,
            y : winSize.height - 210,
            visible : false
        });
        bg.attr({
            anchorX : 0,
            anchorY : 0,
            x : 0,
            y : 0 
        });
        main.attr({
            anchorX : 1,
            anchorY : 0,
            x : 0,
            y : 0
        });
        this.strength = main;
        strength.addChild(bg);
        strength.addChild(main);
        this.addChild(strength);
    },
    loadWolf : function(){
        var pool = GameManager.currentWolfPool[0];
        if(pool.dt<=this.dt){
            var setting = GameManager.getWolfSetting(pool);
            var wolf = new cc.Sprite("#wolf_"+setting.wid+"_1_1.png");
            this.addChild(wolf,pool.z);
            GameManager.currentWolfPool.splice(0,1);
            wolf.attr({
                x:winSize.width+100,
                y:setting.y,
                setting : setting
            });
            wolf.runAction(ActionManager.GP_WOLF_IN(wolf.setting));
            this.loadWolfHP(wolf);
            GameManager.currentWolf.push(wolf);
            this.dt=0;
        }
    },
    loadWolfHP : function(wolf){
        var location = {x:[0,83,83,70],y:[0,165,200,210],offset:15};
        var bg = [];
        var hp = [];
        for(var i=0;i<wolf.setting.blood;i++){
            var a = new cc.Sprite(res.gp_blood_bg);
            var b = new cc.Sprite(res.gp_blood_inner);
            a.attr({x:location.x[wolf.setting.wid]+location.offset*i,y:location.y[wolf.setting.wid]});
            b.attr({x:location.x[wolf.setting.wid]+location.offset*i,y:location.y[wolf.setting.wid]});
            wolf.addChild(a);
            wolf.addChild(b);
            bg.push(a);
            hp.push(b);
        }
        wolf.setting.HP = hp;
    },
    onWolfAttacked:function(wolf,hurt){
        for(var i=0;i<hurt;i++){
            if(wolf.setting.blood>=1){
                wolf.setting.blood--;
                wolf.setting.HP[wolf.setting.blood].runAction(ActionManager.GP_HP_OUT(function(){
                    //console.log("wolfId:"+wolf.setting.id+"血量-1");
                }));
            }
            else{
                break;
            }
        }      
    },
    onWolfOut:function(wolf){
        wolf.stopAllActions();
        wolf.runAction(ActionManager.GP_WOLF_OUT(wolf.setting));
    },
    onWolfDead:function(wolf){
        wolf.setting.active=="dead";
        wolf.stopAllActions();
        wolf.removeAllChildren();
        wolf.runAction(ActionManager.GP_WOLF_DEAD(wolf,function(){
            //console.log("dead: id="+wolf.setting.id);
            this.onWolfRemove(wolf);
        }.bind(this)));
    },
    onWolfRemove : function(node){
        for (var i = 0;i < GameManager.currentWolf.length;i++) { 
            if(node==GameManager.currentWolf[i]){
                GameManager.currentWolf.splice(i, 1);
                break;
            }
        } 
    },
    onBulletRemove : function(node){
        for (var i = 0;i < GameManager.currentBullet.length;i++) { 
            if(node==GameManager.currentBullet[i]){
                GameManager.currentBullet.splice(i, 1);
                break;
            }
        } 
    },
    update : function(dt){
        if(!v_main.Game_over && v_main.canPlay){
            this.dt += dt; 
            v_main.Game_touch ? this.checkStrength(dt) : null;
            GameManager.currentBullet.length!=0 ? this.checkCollideBullet() : null;
            GameManager.currentWolfPool.length!=0 ? this.loadWolf() : null;
            if(GameManager.currentWolf.length!=0){
                this.checkCollideWolf();
            }
            else if(GameManager.currentWolfPool.length==0){
                console.log("下一关");
                GameManager.level++;
                v_main.canPlay = false;
                v_main.active = "tips";
            }
        }
        //console.log(GameManager.currentWolf.length);
    },
    checkStrength : function(dt){
        if(v_main.Game_strength+dt<GameManager.roleSetting["role_"+GameManager.currentRoleId].maxStrength){
            v_main.Game_strength+=dt;
            var precent = (v_main.Game_strength/GameManager.roleSetting["role_"+GameManager.currentRoleId].maxStrength).toFixed(3);
            if(precent>0.98){
                precent=1;
                v_main.Game_strength = GameManager.roleSetting["role_"+GameManager.currentRoleId].maxStrength;
            }
            //console.log((precent*100).toFixed(2)+"%");
            this.strength.x=precent*this.strength.width;        
        }
    },
    checkCollideBullet : function(){
        for (var i=0;i<GameManager.currentBullet.length;i++) { 
            var bullet = GameManager.currentBullet[i];
            var point = bullet.getBoundingBoxToWorld();
            if(!bullet.setting.bomb && point.y>50 && point.x<winSize.width-50){
                for (var j=0;j<GameManager.currentWolf.length;j++){
                    var wolf = GameManager.currentWolf[j];
                    if(wolf.setting.hurt!=bullet.setting.id && (wolf.setting.active=="in" || wolf.setting.active=="out")){
                        var offsetX = GameManager.wolfSetting.rect[wolf.setting.wid][0];
                        var offsetY = GameManager.wolfSetting.rect[wolf.setting.wid][1];
                        var rect = cc.rect(wolf.getBoundingBoxToWorld().x+offsetX/2, wolf.getBoundingBoxToWorld().y+offsetY/2, wolf.width-offsetX, wolf.height-offsetY);
                        if(cc.rectContainsPoint(rect,point)){
                            wolf.setting.hurt = bullet.setting.id;
                            this.onWolfAttacked(wolf,bullet.setting.strength);   
                            this.onLoadIce(wolf,bullet.setting.strength); 
                            v_main.Game_score+=bullet.setting.strength;
                            if(!GameManager.roleSetting["role_"+GameManager.currentRoleId].isBulletThroung){
                                bullet.setting.bomb = true;
                                bullet.stopAllActions();
                                bullet.parent.removeFromParent();
                                this.onBulletRemove(bullet);
                                break;
                            }
                        }
                    }
                }
            }
        } 
    },
    checkCollideWolf : function(){
        for (var i=0;i<GameManager.currentWolf.length;i++) { 
            var wolf = GameManager.currentWolf[i];
            if(wolf.setting.active=="in" && wolf.x<GameManager.screenSetting.forbiddenX-50){
                wolf.setting.active = "out";
                wolf.setting.empty = false;
                this.onWolfOut(wolf);
                //console.log("抓到羊了");
                return;
            }
            else if(wolf.setting.active=="out" && wolf.x>winSize.width+wolf.width){
                //console.log("成功抢走羊了");
                wolf.setting.active = "success";
                wolf.stopAllActions();
                wolf.removeFromParent();
                this.onWolfRemove(wolf);
                v_main.Game_hp--;
            }
        } 
    },
    onLoadIce:function(wolf,strength){
        var type = GameManager.currentRoleId==1 ? 1 : strength!=3 ? 1 : 2;
        var ice = new cc.Sprite("#bullet_"+GameManager.currentRoleId+"_"+type+"_1.png");
        var setting = GameManager.iceSetting["role_"+GameManager.currentRoleId+"_"+type];
        ice.attr({
            x : wolf.getBoundingBoxToWorld().x+setting.offsetX[wolf.setting.wid],
            y : wolf.getBoundingBoxToWorld().y+setting.offsetY[wolf.setting.wid]
        });
        this.addChild(ice,wolf.setting.zIndex+1);
        wolf.pause();
        //一起死了
        if(wolf.setting.blood<=0){
            this.onWolfDead(wolf);
            ice.runAction(ActionManager.GP_BULLET_FLY(GameManager.currentRoleId,type,setting.frames["strength_"+strength],function(){
                ice.removeFromParent();
            }.bind(this)));
            winSize.playEffect('dead_'+wolf.setting.wid);
        }
        else{
            ice.runAction(ActionManager.GP_BULLET_ATTACK(GameManager.currentRoleId,type,setting.frames["strength_"+strength],function(){
                ice.removeFromParent();
                wolf.resume(); 
            }.bind(this)));
            winSize.playEffect('attack_'+wolf.setting.wid);
        }
    },
    loadForbiddenLine : function(){
        var forbiddelLine = new cc.Sprite(res.gp_forbidden);
        forbiddelLine.attr({
            x : GameManager.screenSetting.forbiddenX,
            y : 155
        });
        this.addChild(forbiddelLine);
    }
});