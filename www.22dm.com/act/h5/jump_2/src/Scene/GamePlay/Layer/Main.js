var GPMainLayer = cc.Layer.extend({
    role : null,
    biggertime : 0,
    biggertips : 0,
    ctor:function(){
        this._super(); 
    },
    onEnter : function(){
        this._super();
        if(v_main.guide){
            this.registerEvent();
            this.loadRole();
            this.onAddRope();
            this.loadGuide();
            this.scheduleUpdate();
            indexMusic.pause();
            gameMusic.play();
        }
        else{
            v_main.active = "guide";
        }
    },
    onExit : function(){
        this._super();
    },
    registerEvent : function(){
        var a = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan: function (touch, event) {
                if(GameManager.hasRole){
                    GameManager.jump_direction = touch.getLocation().x>320 ? 1 : 0;
                    cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_ROLE_JUMP));
                }
                return true;
            }
            // onTouchEnded: function (touch, event) {
            //     if(GameManager.hasRole){
            //         GameManager.jump_direction = touch.getLocation().x>320 ? 1 : 0;
            //         cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_ROLE_JUMP));
            //     }
            //     return true;
            // }
        });
        cc.eventManager.addListener(a,this);

        // [事件监听] 跳跃
        var b = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_ROLE_JUMP,
            callback    : this.onRoleJump
        });
        cc.eventManager.addListener(b, this);

        // [事件监听] 下降
        var c= cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_ROLE_DOWN,
            callback    : this.onRoleDown
        });
        cc.eventManager.addListener(c, this);

        // [事件监听] 变身提示
        var c= cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_TIP_BIGGER,
            callback    : this.onLoadTipBigger
        });
        cc.eventManager.addListener(c, this);

        // [事件监听] 
        var d= cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_ROLE_NORMAL,
            callback    : this.onRoleNormal
        });
        cc.eventManager.addListener(d, this);

    },
    onAddRope : function(){
        interval = setInterval(function(){      
            if(!cc.director.isPaused()){
                this.onLoadRope(); 
                v_main.rope++;
            }
        }.bind(this),1120)  
    },
    onLoadRope : function(direction,rotation,speed){
        var rope_type = Math.round(Math.random()*2+1);
        var direction = v_main.rope%2;
        var rotation = direction==1?Math.round(Math.random()*GameManager.maxRotation):-Math.round(Math.random()*GameManager.maxRotation);
        var carX = 640;
        var drop = (v_main.Game_score>200 && Math.random()>0.7) ? true : (Math.random()<0.2 ? true : false);
        var speedX = rope_type==1?GameManager.speedX1 : rope_type==2? (Math.random()*(GameManager.speedX1-GameManager.speedX2)+GameManager.speedX2).toFixed(2)*1 : (Math.random()*(GameManager.speedX2-GameManager.speedX3)+GameManager.speedX3).toFixed(2)*1;
        var speedY = rope_type==1?GameManager.speedY1 : rope_type==2? (Math.random()*(GameManager.speedY1-GameManager.speedY2)+GameManager.speedY2).toFixed(2)*1 : (Math.random()*(GameManager.speedY2-GameManager.speedY3)+GameManager.speedY3).toFixed(2)*1;
        var rope = new cc.Sprite("#rope_1.png");
        var car = new cc.Sprite("#car_"+rope_type+"_1.png");
        rope.attr({
            anchorX : direction,
            anchorY : 0,
            x : direction*winSize.width + 0,
            y : winSize.height - 0,
            type : rope_type,
            rotation : rotation,
            break : drop,
            skill : false,
            direction : direction,
            sit : false,
            speedX : speedX,
            speedY : speedY 
        })
        car.attr({
            anchorX : 0.5,
            anchorY : 1,
            x : carX,
            y : 11
        })
        rope.addChild(car);
        if(Math.round(Math.random()*100)>90 && GameManager.currentRope.length!=0 && v_main.Game_timer<=3)
        {
            var skill = new cc.Sprite("#skill.png");
            skill.attr({
                anchorX : 0.5,
                anchorY : 0,
                x : car.width/2,
                y : car.height-100,
                scale : 0.3
            })
            car.addChild(skill);
            skill.runAction(ActionManager.GP_SKILL_FADE());
            rope.skill = true;
        }
        this.addChild(rope,50); 
        
        rope.runAction(ActionManager.GP_ROPE_RUN(rope.type,rope.speedX,rope.speedY,direction,function(){
            rope.removeFromParent();
            this.onRemoveRope(rope);
        }.bind(this)));
        GameManager.currentRope.push(rope);
        //碰撞检测专用
        if(debug){
            var drawNode =new cc.DrawNode();
            var oY;
            if(direction==1){
                oY = 16*rope.rotation;
                var bX = rope.x-640-80;
                var bY = rope.y-80+oY;
                var eX = bX+160;
                var eY = bY+30;
            }
            else{
                oY = rope.rotation<0? -16*rope.rotation : 16;
                var bX = 640+rope.x-80;
                var bY = rope.y-60+oY;
                var eX = bX+160;
                var eY = bY-30;
            }
            drawNode.drawRect(cc.p(bX,bY),cc.p(eX,eY),cc.color(255,255,0,255));
            this.addChild(drawNode,155);
            drawNode.runAction(ActionManager.GP_ROPE_RUN(rope.type,rope.speedX,rope.speedY,direction,function(){
                rope.removeFromParent();
            }.bind(this)));
        }
        if(GameManager.currentRope.length==3 && !GameManager.hasRole)
        {
            this.onSit(rope);
            GameManager.hasRole = true;
        }
        if(drop){
            var delay = Math.round(Math.random()*2) + 2;
            var warning = new cc.Sprite("#warning.png");
            warning.attr({
                anchorX : 0.5,
                anchorY : 0,
                x : car.width/2,
                y : car.height-190,
                opacity : 0
            })
            car.addChild(warning);
            warning.runAction(ActionManager.GP_WARNING_BLINK(1));
            car.runAction(ActionManager.GP_CAR_BREAK(rope.type,delay,function(){
                rope.break = true;
            }));
        }
    },
    onSit : function(rope){
        var car = rope.children[0];
        var sitnode ;
        if(rope.skill){
            car.children[0].removeFromParent();
            sitnode = new cc.Sprite("#role_2_1.png");
            sitnode.runAction(ActionManager.GP_ROLE_BIGGER());
            rope.skill = false;
            this.role.type = 2;
            this.role.mult = GameManager.mult_2;
            v_main.Game_timer+=8;
            cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_ROLE_BIGGER));
            if(this.biggertips<2){
                cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_TIP_BIGGER));
            }
        }
        else{
            sitnode = new cc.Sprite("#role_"+this.role.type+"_1.png");
        }
        sitnode.attr({
            x:car.width/2,
            y:car.height + 8,
            flippedX : rope.direction
        });
        car.addChild(sitnode);
        rope.sit = true;
    },
    onRemoveRope : function(node){
        for (var i = 0;i < GameManager.currentRope.length;i++) { 
            if(node=GameManager.currentRope[i]){
                GameManager.currentRope.splice(i, 1);
                break;
            }
        } 
    },
    loadRole : function(){
        var node = new cc.Sprite("#role_1_1.png");
        node.attr({
            type:1,
            x : 300,
            y : 500,
            visible : false,
            active : 'normal',
            direction : 0,
            speed : GameManager.speed,
            deltaY : GameManager.deltaY,
            deltaX : GameManager.deltaX,
            mult : GameManager.mult_1
        })
        this.role = node;
        this.addChild(node,100);
        if(debug){
            var drawNode =new cc.DrawNode();
            drawNode.drawRect(cc.p(node.width/2-15,0),cc.p(node.width/2+15,20),cc.color(255,0,45,255));
            node.addChild(drawNode);
        }
    },
    onRoleJump : function(event){
        var self = event.getCurrentTarget();
        var role = self.role;
        if(role.active=="normal")
        {
            var bX,bY,oY;
            for(var i = 0;i < GameManager.currentRope.length;i++)
            {
                if(GameManager.currentRope[i].sit){
                    var rope = GameManager.currentRope[i];
                    rope.sit = false;
                    rope.children[0].removeAllChildren();
                    if(rope.direction==1){
                        oY = rope.rotation*16;
                        bX = rope.x-640;
                        bY = rope.y+oY;
                    }
                    else{
                        oY = rope.rotation<0? -16*rope.rotation : 16;
                        bX = 640+rope.x;
                        bY = rope.y+oY;
                    }
                    role.attr({
                        x:bX,
                        y:bY,
                        visible:true,
                        //flippedX : role.flippedX,
                        flippedX : GameManager.jump_direction,
                        active : "up"
                    });
                    role.runAction(ActionManager.GP_ROLE_JUMP(role,function(){
                        cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_ROLE_DOWN));
                    }.bind(this)))     
                    break;
                }
            }
        }
    },
    onRoleDown : function(event){
        var self = event.getCurrentTarget();
        var role = self.role;
        role.active = "down";
        role.runAction(ActionManager.GP_ROLE_DOWN(role,function(){
            v_main.Game_over = true;
        }))
    },
    update : function(dt){
        if(!v_main.Game_over){
            this.checkCollide();
        }
    },
    checkCollide : function(){
        var role = this.role;
        if(role.active=="down"){
            for (var i = GameManager.currentRope.length-1;i >=0;i--) { 
                var rope = GameManager.currentRope[i];
                var bX,bY,oY;
                if(rope.direction==1){
                    oY = rope.rotation*16;
                    bX = rope.x-640-80;
                    bY = rope.y+oY;
                }
                else{
                    oY = rope.rotation<0? -16*rope.rotation : 16;
                    bX = 640+rope.x-80;
                    bY = rope.y-60+oY;
                }
                var rectA = cc.rect(bX,bY,160,40);
                var rextB = cc.rect(role.x-15,role.y,30,20);
                if(cc.rectOverlapsRect(rectA,rextB))
                {
                    role.active="normal";
                    role.visible = false;
                    role.direction=rope.direction;
                    role.stopAllActions();
                    this.onSit(rope);
                    v_main.Game_score++;
                    break;
                }
            } 
        }
        else if(role.active=="normal"){
            for (var i = 0;i < GameManager.currentRope.length;i++) { 
                if(GameManager.currentRope[i].sit && GameManager.currentRope[i].y < -100){
                    v_main.Game_over = true;
                }
            } 
        }
    },
    onRoleNormal : function(event){
        var self = event.getCurrentTarget();
        self.role.type = 1;
        self.role.mult = GameManager.mult_1;
    },
    onLoadTipBigger : function(event){
        var self = event.getCurrentTarget();
        var node = new cc.Sprite("#tips_bigger.png");
        self.biggertips++;
        node.attr({
            x : winSize.width/2,
            y : node.height/2 +20,
            opacity : 0
        });
        node.runAction(ActionManager.GP_TIP_BIGGER(function(){
            node.removeFromParent();
        }));
        self.addChild(node);
    },
    loadGuide : function(){
        var node = new cc.Sprite("#guide.png");
        node.attr({
            x : winSize.width/2,
            y : node.height/2 +300,
            opacity : 0
        });
        node.runAction(ActionManager.GP_TIP_BIGGER(function(){
            node.removeFromParent();
        }));
        this.addChild(node);
    }
});