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
                cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_ROLE_JUMP));
                return true;
            }
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

    },
    onAddRope : function(){
        interval = setInterval(function(){
            if(!cc.director.isPaused()){
                var direction = v_main.rope%2;
                var rotation = direction==1?Math.round(Math.random()*winSize.maxRotation):-Math.round(Math.random()*winSize.maxRotation);
                var speed = 8;
                this.onLoadRope(direction,rotation,speed); 
                v_main.rope++;
            }
        }.bind(this),1300)
    },
    onLoadRope : function(direction,rotation,speed){
        var rope = new cc.Sprite("#rope_1.png");
        var car = new cc.Sprite("#car_1.png");
        var carX = 640;
        var drop = false;
        rope.attr({
            anchorX : direction,
            anchorY : 0,
            x : direction*winSize.width + 0,
            y : winSize.height - 0,
            rotation : rotation,
            break : false,
            skill : false,
            direction : direction,
            sit : false
        })
        car.attr({
            anchorX : 0.5,
            anchorY : 1,
            x : carX,
            y : 11
        })
        rope.addChild(car);
        if(Math.round(Math.random()*100)>87 && GameManager.currentRope.length!=0)
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
        
        rope.runAction(ActionManager.GP_ROPE_RUN(speed,direction,function(){
            rope.removeFromParent();
            this.onRemoveRope(rope);
        }.bind(this)));
        GameManager.currentRope.push(rope);
        //碰撞检测专用
        {
            // var drawNode =new cc.DrawNode();
            // var oY;
            // if(direction==1){
            //     oY = 16*rope.rotation;
            //     var bX = rope.x-640-60;
            //     var bY = rope.y-80+oY;
            //     var eX = bX+120;
            //     var eY = bY+30;
            // }
            // else{
            //     oY = rope.rotation<0? -16*rope.rotation : 16;
            //     var bX = 640+rope.x-60;
            //     var bY = rope.y-60+oY;
            //     var eX = bX+120;
            //     var eY = bY-30;
            // }
            // drawNode.drawRect(cc.p(bX,bY),cc.p(eX,eY),cc.color(255,255,0,255));
            // this.addChild(drawNode,155);
            // drawNode.runAction(ActionManager.GP_ROPE_RUN(speed,direction,function(){
            //     rope.removeFromParent();
            // }.bind(this)));
        }
        if(GameManager.currentRope.length==1)
        {
            this.onSit(rope);
        }
        
        if(v_main.Game_score>200 && Math.random()>0.5){
            drop = true;
        }
        else if(Math.random()<0.3){
            drop = true;
        }
        if(drop){
            var delay = Math.round(Math.random()*2) + 2;
            car.runAction(ActionManager.GP_CAR_BREAK(delay,function(){
                rope.break = true;
            }));
        }
    },
    onSit : function(rope){
        var car = rope.children[0];
        var sitnode ;
        if(rope.skill){
            rope.children[0].children[0].removeFromParent();
            sitnode = new cc.Sprite("#role_2_1.png");
            sitnode.runAction(ActionManager.GP_ROLE_BIGGER());
            rope.skill = false;
            this.role.type = 2;
            this.role.mult = GameManager.mult_2
            this.biggertime = 0;
            if(this.biggertips<3){
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
        // var drawNode =new cc.DrawNode();
        // drawNode.drawRect(cc.p(node.width/2-15,0),cc.p(node.width/2+15,20),cc.color(255,0,45,255));
        // node.addChild(drawNode);
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
                    rope.children[0].children[0].removeFromParent();
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
                        flippedX : rope.direction,
                        active : "up"
                    });
                    role.runAction(ActionManager.GP_ROLE_JUMP(role,function(){
                        cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_ROLE_DOWN));
                    }.bind(this)))     
                    break;
                }
            }
        }
        // role.attr({
        //     visible:true,
        //     active : "up"
        // });
        // role.runAction(ActionManager.GP_ROLE_JUMP(role,function(){
        //     cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_ROLE_DOWN));
        // }.bind(this)))
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
            this.biggertime+=dt;
            if(this.role.type==2 && this.biggertime>8)
            {
                this.role.type = 1;
                this.role.mult = GameManager.mult_1
                this.biggertime = 0;
            }
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
                    bX = rope.x-640-60;
                    bY = rope.y+oY;
                }
                else{
                    oY = rope.rotation<0? -16*rope.rotation : 16;
                    bX = 640+rope.x-60;
                    bY = rope.y-60+oY;
                }
                var rectA = cc.rect(bX,bY,120,40);
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
    onLoadTipBigger : function(event){
        var self = event.getCurrentTarget();
        console.log(self.biggertips);
        var node = new cc.Sprite(res.gp_tips_bigger);
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
    }
});