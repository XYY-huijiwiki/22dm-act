var GPMainLayer = cc.Layer.extend({
    platform : null,
    role : null,
    bullet : null,
    bulletlocation : null,
    strength : null,
    strengthMax : null,
    scoreText : null,
    skill_ice : null,
    skill_bomb : null,
    iceText : null,
    bombText : null,
    dt : 0,
    ctor:function(){
      this._super(); 
    },
    onEnter : function(){
      this._super();
      this.loadStrength();
      this.loadDoor();
      this.loadScore();
      this.loadPlatform();
      this.loadCheer();
      this.loadStone();
      this.loadForbiddenLine();
      this.loadSkill();
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
      clearInterval(GameManager.bosstimer);
    },
    registerEvent : function(){
      var a = cc.EventListener.create({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches: true,
        onTouchBegan: function (touch, event) {
          var target = event.getCurrentTarget();
          if(!v_main.Game_over && v_main.canPlay){
            //target.debugWolfCollide(touch);
            v_main.Game_touch = true;
            return true;
          }
        },
        onTouchMoved: function (touch, event) {
          var target = event.getCurrentTarget(); 
          var delta = touch.getDelta();
          var newAngle = debug ? target.platform.rotation-delta.y/5 : target.platform.rotation-delta.x/5;
          if(newAngle>=0 && newAngle<=GameManager.roleSetting["role_"+GameManager.currentRoleId].maxRotation){
            target.platform.rotation = newAngle;
          }
          return true;
        },
        onTouchEnded : function(touch, event){
          var target = event.getCurrentTarget();
          v_main.Game_touch = false;
          target.strengthMax.stopAllActions();
          target.strengthMax.visible = false;
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

      // [事件监听] 更新分数
      var d = cc.EventListener.create({
        event       : cc.EventListener.CUSTOM,
        target      : this,
        eventName   : jf.EventName.GP_UPDATE_SCORE_TEXT,
        callback    : this.onUpdateScoreText
      });
      cc.eventManager.addListener(d, this);

      // [事件监听] 更新技能冰冻数量
      var e = cc.EventListener.create({
        event       : cc.EventListener.CUSTOM,
        target      : this,
        eventName   : jf.EventName.GP_UPDATE_ICE_TEXT,
        callback    : this.onUpdateIceText
      });
      cc.eventManager.addListener(e, this);

      // [事件监听] 更新技能爆炸数量
      var f = cc.EventListener.create({
        event       : cc.EventListener.CUSTOM,
        target      : this,
        eventName   : jf.EventName.GP_UPDATE_BOMB_TEXT,
        callback    : this.onUpdateBombText
      });
      cc.eventManager.addListener(f, this);

      // [事件监听] 爆炸
      var g = cc.EventListener.create({
        event       : cc.EventListener.CUSTOM,
        target      : this,
        eventName   : jf.EventName.GP_LOAD_BOMB,
        callback    : this.onLoadBomb
      });
      cc.eventManager.addListener(g, this);

      // [事件监听] 禁止操作
      var h = cc.EventListener.create({
        event       : cc.EventListener.CUSTOM,
        target      : this,
        eventName   : jf.EventName.GP_LOAD_SKILL_FORBID,
        callback    : this.onLoadSkillForbid
      });
      cc.eventManager.addListener(h, this);
    
      // [事件监听] 全场加血
      var i = cc.EventListener.create({
        event       : cc.EventListener.CUSTOM,
        target      : this,
        eventName   : jf.EventName.GP_ADD_WOLF_HP,
        callback    : this.onWoldAddHP
      });
      cc.eventManager.addListener(i, this);
    },
    loadPlatform : function(){
        var stand = new cc.Sprite();
        var pillar = new cc.Sprite("#pillar.png");
        platform = new cc.Sprite("#platform.png");     
        //var bulletlocation = new cc.Sprite("#bullet_"+GameManager.currentRoleId+".png");   
        var bulletlocation = new cc.Sprite();   
        var location = [[180,140],[150,100],[180,100],[180,100],[180,100]];  
        pillar.attr({
            anchorX : 0.5,
            anchorY : 1,
            x : 220,
            y : 350
        });
        platform.attr({
            anchorX : 0.5,
            anchorY : 0.5,
            x : 230,
            y : 380,
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
      var location = [[0,250],[0,250],[-30,240],[5,240],[-10,230]];
      var role = new cc.Sprite("#role_"+GameManager.currentRoleId+"_1.png");
      role.attr({
        anchorX : 0.5,
        anchorY : 0.5,
        x : location[GameManager.currentRoleId-1][0]+role.width/2,
        y : location[GameManager.currentRoleId-1][1]-role.height/2,
        active : "normal"
      });
      this.role = role;
      this.platform.addChild(role,20);
    },
    onloadBullet : function(){
        var mask = new cc.Sprite();
        var bullet = new cc.Sprite("#bullet_"+GameManager.currentRoleId+".png");
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
            x : bullet.width/2,
            y : bullet.height/2,
            scale : setting.scale,
            setting : setting,
            opacity : 0
        });
        mask.addChild(bullet);
        this.addChild(mask,1000);
        GameManager.currentBullet.push(bullet);
        bullet.runAction(ActionManager.GP_BULLECT_NORMAL(function(){
          this.onBulletRemove(bullet);
        }.bind(this)));
        winSize.playEffect('bullet');
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
        if(v_main.Game_strength > roleSetting.action.length[0]*roleSetting.maxStrength/roleSetting.action.length[0]/roleSetting.action.speed){
          self.role.runAction(ActionManager.GP_ROLE_ATTACK_AFTER(GameManager.currentRoleId));
          self.onloadBullet();
        }
        else{
          self.role.runAction(ActionManager.GP_ROLE_ATTACK_RESET(GameManager.currentRoleId));
        }
    },
    loadStrength : function(){
        var strength = new cc.Sprite();
        var strength_bg =new cc.DrawNode();
        //var strength_text = new ccui.Text("攻击力:0", "Arial", 14);
        //strength_text.setTextColor(cc.color(255,0,120,1));
        var main = new cc.Sprite("#strength_main.png");
        strength.attr({
          anchorX : 0,
          anchorY : 0,
          x : winSize.width/2-63,
          y : winSize.height - 190,
          visible : false
        });
        main.attr({
          anchorX : 1,
          anchorY : 0,
          x : 0,
          y : 0
        });
        // strength_text.attr({
        //   x : 62.5,
        //   y : 5
        // });
        this.strength = main;
        strength.addChild(main);
        //strength.addChild(strength_text);
        strength_bg.drawRect(cc.p(strength.x-10,strength.y-10),cc.p(strength.x+main.width+10,strength.y+main.height+10),cc.color(44,122,220,255),0);
        this.addChild(strength_bg);
        this.addChild(strength);
    },
    loadDoor :function(){
        var door = new cc.Sprite(res.gp_door);
        var strengthMax = new cc.Sprite("#strength_max.png");
        door.attr({
            anchorX : 0.5,
            anchorY : 1,
            x : winSize.width/2 + 1 ,
            y : winSize.height - 10
        });
        strengthMax.attr({
            x : door.width/2,
            y : 50,
            visible : false
        });
        door.addChild(strengthMax);
        this.addChild(door);
        this.strengthMax = strengthMax;
    },
    loadWolf : function(){
      var pool = GameManager.currentWolfPool[0];
      if(pool.dt<=this.dt)
      {
        var setting = GameManager.getWolfSetting(pool);
        var wolf = new cc.Sprite("#wolf_"+setting.wid+"_1_1.png");
        this.addChild(wolf,pool.z);
        GameManager.currentWolfPool.splice(0,1);
        wolf.attr({
          //x:GameManager.currentWolfPool.length*150+120,
          x:winSize.width+100,
          y:setting.y,
          setting : setting
        });
        if(setting.wid!=5 && setting.wid!=6){
          wolf.runAction(ActionManager.GP_WOLF_NORMAL_IN(wolf.setting));
        }
        else if(setting.wid==5){
          wolf.runAction(ActionManager.GP_WOLF_5_IN(wolf.setting));
        }
        else{
          ActionManager.GP_WOLF_6_IN(wolf);
        }
        this.loadWolfHP(wolf);
        GameManager.currentWolf.push(wolf);
        this.dt=0;
        v_main.Game_wolfCount++;
        if(setting.wid==9){
          this.onWolfBossTips();
          GameManager.bosstimer = setInterval(function(){
            cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_ADD_WOLF_HP));
          },10000)
        }
        //this.onLoadIce(wolf,1); 
        // var offsetX = GameManager.wolfSetting.rect[wolf.setting.wid][0];
        // var offsetY = GameManager.wolfSetting.rect[wolf.setting.wid][1];
        // var rectX = wolf.getBoundingBoxToWorld().x+offsetX/2;
        // var rectY = wolf.getBoundingBoxToWorld().y+offsetY/2;
        // var rectW = wolf.width-offsetX;
        // var rectH = wolf.height-offsetY;
        // var rect_bg =new cc.DrawNode();
        // rect_bg.drawRect(cc.p(rectX,rectY),cc.p(rectX+rectW,rectY+rectH),cc.color(44,122,220,255),0);
        // this.addChild(rect_bg);
      }
    },
    loadWolfHP : function(wolf){
        var location = {x:[0,83,80,70,75,65,60,80,65,60],y:[0,165,200,210,205,220,225,205,225,280],offset:15};
        var bg = [];
        var hp = [];
        for(var i=0;i<wolf.setting.blood;i++){
          var a = new cc.Sprite("#blood_bg.png");
          var b = new cc.Sprite("#blood_inner.png");
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
      var blood = 0;
      var miss = false;
      if(wolf.setting.wid==8){
        miss = Math.random()<0.2? true : false;
      }
      if(!miss){
        for(var i=0;i<hurt;i++){
          wolf.setting.blood--;
          if(wolf.setting.blood>0){
            wolf.setting.HP[wolf.setting.blood].setVisible(false);
            blood++;
          }
          else{
            v_main.Game_score+=(i+1);
            this.onWolfDead(wolf);
            return;
          }
        }      
        if(blood!=0){
          v_main.Game_score+=blood;
          this.onLoadHurtCount(wolf,"-",blood);
        }
      }
      else{
        this.onWolfMiss(wolf);
      }
    },
    onWoldAddHP:function(event){
      var self = event.getCurrentTarget();
      for(var i=0;i<GameManager.currentWolf.length;i++){
        var wolf = GameManager.currentWolf[i];
        if(wolf.x<winSize.width-100 && (wolf.setting.active=="in" || wolf.setting.active=="out")){
          if(wolf.setting.blood<GameManager.wolfSetting.blood[wolf.setting.wid]){
            wolf.setting.HP[wolf.setting.blood].setVisible(true);
            self.onLoadHurtCount(wolf,"+",1);
            wolf.setting.blood++;
          }
        }
      }
    },
    onWolfMiss : function(wolf){
      var miss = new cc. Sprite("#miss.png");
      miss.attr({
        x : wolf.width/2,
        y : wolf.height - 50
      })
      wolf.addChild(miss);
      miss.runAction(ActionManager.GP_HP_OUT(function(){
        miss.removeFromParent();
      }));
    },
    onLoadHurtCount : function(wolf,text,blood){
      var text = new ccui.Text(text+blood, "Arial", 32);
      text.setTextColor(cc.color(254,76,76,1));
      text.attr({
        anchorX : 0.5,
        anchorY : 0.5,
        x : wolf.width/2,
        y : wolf.height
      });
      wolf.addChild(text);
      text.runAction(ActionManager.GP_HP_OUT(function(){
        text.removeFromParent();
      }));
    },
    onWolfBackOff : function(wolf,strength){
      deltaX = strength*100;
      if(wolf.x+deltaX>winSize.width-40)
      {
        deltaX = winSize.width-wolf.x-40;
      }
      wolf.runAction(ActionManager.GP_WOLF_BACK(deltaX,function(){

      }))
    },
    onWolfOut:function(wolf){
      wolf.stopAllActions();
      wolf.runAction(ActionManager.GP_WOLF_OUT(wolf.setting));
    },
    onWolfDead:function(wolf){
      wolf.setting.active="dead";
      wolf.stopAllActions();
      wolf.removeAllChildren();
      wolf.runAction(ActionManager.GP_WOLF_DEAD(wolf,function(){
        this.onWolfRemove(wolf);
      }.bind(this)));
      winSize.playEffect('dead');
      if(wolf.setting.wid==9&&!GameManager.killboss){
        GameManager.killboss = true;
        winSize.ranking.addLottery();
      }
    },
    onWolfRemove : function(node){
      if(node.setting.wid==9){
        clearInterval(GameManager.bosstimer);
      }
      for (var i = 0;i < GameManager.currentWolf.length;i++) { 
        if(node==GameManager.currentWolf[i]){
          GameManager.currentWolf.splice(i, 1);
          break;
        }
      } 
    },
    onBulletRemove : function(bullet){
      bullet.setting.bomb = true;
      bullet.stopAllActions();
      bullet.parent.removeFromParent();
      for (var i = 0;i < GameManager.currentBullet.length;i++) { 
        if(bullet==GameManager.currentBullet[i]){
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
          v_main.Game_touch = false;
          this.strengthMax.visible = false;
          v_main.canPlay = false;
          GameManager.level++;
          GameManager.createWolfPoor();
        }
      }
    },
    checkStrength : function(dt){
      if(v_main.Game_strength+dt<GameManager.roleSetting["role_"+GameManager.currentRoleId].maxStrength){
        v_main.Game_strength+=dt;
        var precent = (v_main.Game_strength/GameManager.roleSetting["role_"+GameManager.currentRoleId].maxStrength).toFixed(3);
        if(precent>0.95){
          precent=1;
          v_main.Game_strength = GameManager.roleSetting["role_"+GameManager.currentRoleId].maxStrength;
          //this.strengthMax.visible = true;
          this.strengthMax.runAction(ActionManager.GP_MAX());
        }
        //console.log((precent*100).toFixed(2)+"%");
        this.strength.x=precent*this.strength.width;        
      }
    },
    checkCollideBullet : function(){
      for (var i=0;i<GameManager.currentBullet.length;i++) { 
        var bullet = GameManager.currentBullet[i];
        var point = bullet.getBoundingBoxToWorld();
        if(!bullet.setting.bomb && point.y>20 && point.x<winSize.width-60){
          for(var j=0;j<GameManager.currentWolf.length;j++){
            var wolf = GameManager.currentWolf[j];
            if(wolf.setting.hurt!=bullet.setting.id && (wolf.setting.active=="in" || wolf.setting.active=="out")){
              var offsetX = GameManager.wolfSetting.rect[wolf.setting.wid][0];
              var offsetY = GameManager.wolfSetting.rect[wolf.setting.wid][1];
              var rectX = wolf.getBoundingBoxToWorld().x+offsetX/2;
              var rectY = wolf.getBoundingBoxToWorld().y+offsetY/2;
              var rectW = wolf.width-offsetX;
              var rectH = wolf.height-offsetY;
              var rect = cc.rect(rectX, rectY,rectW,rectH);
              if(cc.rectContainsPoint(rect,point)){
                wolf.setting.hurt = bullet.setting.id;
                this.onWolfAttacked(wolf,bullet.setting.strength);  
                //不是遇到巫师 有武器特效
                winSize.playEffect('attack');
                if(wolf.setting.wid!=4){
                  this.onLoadIce(wolf,bullet.setting.strength); 
                  //暖羊羊 伤害同一行
                  if(GameManager.currentRoleId==3){
                    for (var z=0;z<GameManager.currentWolf.length;z++){
                      var tmpWolf = GameManager.currentWolf[z]; 
                      if(tmpWolf.setting.zIndex==wolf.setting.zIndex && wolf!=tmpWolf){
                        if(tmpWolf.x<=winSize.width-40)
                        {
                          this.onWolfAttacked(tmpWolf,bullet.setting.strength);  
                        }
                      }
                    }
                  }
                  //沸羊羊 后退
                  if(GameManager.currentRoleId==4){
                    if(wolf.setting.active=="in"){
                      this.onWolfBackOff(wolf,bullet.setting.strength);
                    }
                  }
                  //懒羊羊 伤害一定范围内的
                  if(GameManager.currentRoleId==5){
                    var offsetX = [0,0,150,300];
                    var offsetY = [0,0,120,200];
                    for(var l=0;l<GameManager.currentWolf.length;l++){
                      var tmpWolf = GameManager.currentWolf[l]; 
                      if(tmpWolf.x<=winSize.width-40 && wolf!=tmpWolf){
                        var deltaX = Math.abs(tmpWolf.x-wolf.x);
                        var deltaY = Math.abs(tmpWolf.y-wolf.y);
                        if(deltaX<offsetX[bullet.setting.strength] && deltaY<offsetY[bullet.setting.strength]){
                          this.onWolfAttacked(tmpWolf,bullet.setting.strength); 
                        }
                      }
                    }
                  } 
                  bullet.setting.strength -=1;
                  //没有穿透性的子弹直接消失
                  if(!GameManager.roleSetting["role_"+GameManager.currentRoleId].isBulletThroung){
                    this.onBulletRemove(bullet);
                    break;
                  }
                  //子弹有穿透性 伤害减弱 继续飞行
                  else if(bullet.setting.strength<1){
                    this.onBulletRemove(bullet);
                    break;
                  }
                }
                else{
                  bullet.setting.strength -=1;
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
        if(wolf.setting.active=="in" && wolf.x<GameManager.screenSetting.forbiddenX-20){
          wolf.setting.active = "out";
          this.onWolfOut(wolf);
          return;
        }
        else if(wolf.setting.active=="out" && wolf.x>winSize.width+wolf.width){
          wolf.setting.active = "success";
          wolf.stopAllActions();
          wolf.removeFromParent();
          this.onWolfRemove(wolf);
          v_main.Game_hp--;
        }
      } 
    },
    debugWolfCollide : function(touch){
      for(var j=0;j<GameManager.currentWolf.length;j++){
        var wolf = GameManager.currentWolf[j];
        var offsetX = GameManager.wolfSetting.rect[wolf.setting.wid][0];
        var offsetY = GameManager.wolfSetting.rect[wolf.setting.wid][1];
        var rectX = wolf.getBoundingBoxToWorld().x+offsetX/2;
        var rectY = wolf.getBoundingBoxToWorld().y+offsetY/2;
        var rectW = wolf.width-offsetX;
        var rectH = wolf.height-offsetY;
        var rect = cc.rect(rectX, rectY,rectW,rectH);
        if(cc.rectContainsPoint(rect,touch.getLocation()))
        {
          console.log("collideWolf: "+wolf.setting.wid);
        }
      }
    },
    onLoadIce:function(wolf,strength){
      var roleId = GameManager.currentRoleId;
      if(wolf.setting.active=="dead" && (roleId==1 || roleId==2 || roleId==4)){
        return;
      }
      var type = 1;
      var ice = new cc.Sprite("#bullet_"+roleId+"_"+type+"_1.png");
      var setting = GameManager.iceSetting["role_"+roleId+"_"+type];
      if(roleId<3){
        ice.attr({
          x : wolf.getBoundingBoxToWorld().x+setting.offsetX[wolf.setting.wid],
          y : wolf.getBoundingBoxToWorld().y+setting.offsetY[wolf.setting.wid]
        });
        this.addChild(ice,wolf.setting.zIndex+10);
        wolf.pause();
        ice.runAction(ActionManager.GP_BULLET_ATTACK(roleId,type,setting.frames["strength_"+strength],function(){
          ice.removeFromParent();
          wolf.resume(); 
        }.bind(this)));
      }
      else if(roleId==3){
        ice.attr({
          anchorX : 0.5,
          anchorY : 0.5,
          x : wolf.getBoundingBoxToWorld().x+setting.offsetX[wolf.setting.wid],
          y : wolf.getBoundingBoxToWorld().y+setting.offsetY[wolf.setting.wid]+25*(strength-1),
          scale : 0
        });
        this.addChild(ice,wolf.setting.zIndex+10);
        ice.runAction(ActionManager.GP_BULLET_ATTACK_3(setting.frames["strength_"+strength],function(){
          ice.removeFromParent();
        }.bind(this)));
      }
      else if(roleId==4){
        ice.attr({
          anchorX:0,
          anchorY:0,
          x : wolf.getBoundingBoxToWorld().x,
          y : wolf.getBoundingBoxToWorld().y,
          scale : 0
        });
        this.addChild(ice,wolf.setting.zIndex+10);
        ice.runAction(ActionManager.GP_BULLET_ATTACK_4(strength,setting.frames["strength_"+strength],function(){
          ice.removeFromParent();
        }.bind(this)));
      }
      else if(roleId==5){
        ice.attr({
          x : wolf.getBoundingBoxToWorld().x+setting.offsetX[wolf.setting.wid],
          y : wolf.getBoundingBoxToWorld().y+setting.offsetY[wolf.setting.wid]+(strength-1)*25
        });
        this.addChild(ice,4000);
        ice.runAction(ActionManager.GP_BULLET_ATTACK_5(setting.frames["strength_"+strength],function(){
          ice.removeFromParent();
        }.bind(this)));
      }
    },
    onLoadBomb:function(event){
      var self = event.getCurrentTarget();
      GameManager.isBombing = true;
      var bomb = new cc.Sprite();
      bomb.attr({
        x : winSize.width/2+100,
        y : winSize.height/2,
        scale : 2
      });
      self.addChild(bomb,5000);
      bomb.runAction(ActionManager.GP_BOMB(function(){
        for(var j=0;j<GameManager.currentWolf.length;j++){
          var wolf = GameManager.currentWolf[j];
          if(wolf.x<winSize.width-20&&(wolf.setting.active=="in" || wolf.setting.active=="out"))
          {
            self.onWolfAttacked(wolf,1);
          }
        }
        bomb.removeFromParent();
        GameManager.isBombing = false;
      }));
    },
    onLoadSkillForbid:function(event){
      var self = event.getCurrentTarget();
      var forbid = new cc.Sprite("#forbid.png");
      var skill = event.getUserData().forbidden==1?self.skill_ice:self.skill_bomb;
      forbid.attr({
        x : skill.width/2-5,
        y : skill.height/2+5
      });
      skill.addChild(forbid);
      forbid.runAction(ActionManager.GP_FORBID(function(){
        forbid.removeFromParent();
      }));
      winSize.playEffect("forbid");
    },
    loadForbiddenLine : function(){
      var forbiddelLine = new cc.Sprite("#forbidden.png");
      forbiddelLine.attr({
        x : GameManager.screenSetting.forbiddenX,
        y : 190
      });
      this.addChild(forbiddelLine);
    },
    loadStone : function(){
      var stone = new cc.Sprite("#stone.png");
      stone.attr({
        anchorX : 1,
        anchorY : 0,
        x:winSize.width,
        y:0
      });
      this.addChild(stone);
    },
    loadCheer : function(){
      var cheer = new cc.Sprite("#cheer_1.png");
      cheer.attr({
        anchorX : 0,
        anchorY : 0,
        x:20,
        y:90,
        scale : 0.9
      });
      this.addChild(cheer);
      cheer.runAction(ActionManager.GP_CHEER());
    },
    loadScore : function(){
      var text = new ccui.Text(GameManager.totalScore, "Arial", 80);
      text.setTextColor(cc.color(255,255,255,1));
      text.attr({
        anchorX : 0.5,
        anchorY : 0.5,
        x : winSize.width/2,
        y : winSize.height-115
      });
      this.scoreText = text;
      this.addChild(text);
    },
    onUpdateScoreText:function(event){
      var self = event.getCurrentTarget();
      self.scoreText.setString(GameManager.totalScore);
    },
    loadSkill : function(){
      var ice_bg = new cc.Sprite("#skill_1_bg.png");
      var bomb_bg = new cc.Sprite("#skill_2_bg.png");
      var ice = new cc.Sprite("#skill_1.png");
      var bomb = new cc.Sprite("#skill_2.png");
      var ice_text = new ccui.Text(v_main.Game_ice, "Arial", 32);
      var bomb_text = new ccui.Text(v_main.Game_bomb, "Arial", 32);
      // ice_text.setTextColor(cc.color(255,198,0,1));
      // bomb_text.setTextColor(cc.color(255,198,0,1));
      ice_bg.attr({
        x: ice_bg.width/2 + 20,
        y: ice_bg.height/2 + 0
      });
      bomb_bg.attr({
        x: ice_bg.x + ice_bg.width + 30,
        y: ice_bg.y
      });
      ice.attr({
        x : ice_bg.width/2-5,
        y : ice_bg.height/2+5
      });
      bomb.attr({
        x : bomb_bg.width/2-5,
        y : bomb_bg.height/2+5
      });
      ice_text.attr({
        x : ice_bg.width+5,
        y : ice_text.height/2
      });
      bomb_text.attr({
        x : bomb_bg.width+5,
        y : bomb_text.height/2
      });
      this.addChild(ice_bg);
      this.addChild(bomb_bg);
      ice_bg.addChild(ice);
      bomb_bg.addChild(bomb);
      ice_bg.addChild(ice_text);
      bomb_bg.addChild(bomb_text);
      this.skill_ice=ice_bg;
      this.skill_bomb=bomb_bg;
      this.iceText=ice_text;
      this.bombText=bomb_text;
      GameManager.button.gp_ice = ice_bg;
      GameManager.button.gp_bomb = bomb_bg;
      GameManager.setButton({name:"gp_ice",x:ice_bg.x,y:ice_bg.y,w:ice_bg.width,h:ice_bg.height});
      GameManager.setButton({name:"gp_bomb",x:bomb_bg.x,y:bomb_bg.y,w:bomb_bg.width,h:bomb_bg.height});
    },
    onUpdateIceText:function(event){
        var self = event.getCurrentTarget();
        self.iceText.setString(v_main.Game_ice);
    },
    onUpdateBombText:function(event){
        var self = event.getCurrentTarget();
        self.bombText.setString(v_main.Game_bomb);
    },
    onWolfBossTips:function(){
      var text = new ccui.Text("前方预警:狼将军已到达战场!", "Arial", 32);
      text.setTextColor(cc.color(255,0,0,1));
      text.attr({
        anchorX : 0.5,
        anchorY : 0,
        x : winSize.width/2,
        y : 50
      });
      this.addChild(text);
      text.runAction(ActionManager.GP_BOSS_TIPS(function(){
        text.removeFromParent();
      }))
    }
});