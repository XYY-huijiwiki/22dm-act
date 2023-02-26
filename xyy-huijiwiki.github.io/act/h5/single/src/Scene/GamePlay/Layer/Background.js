var GPBackgroundLayer = cc.Layer.extend({
    ctor:function(){
        this._super(); 
    },
    onEnter : function () {
        this._super();  
        //this.loadData();
        this.loadBackgound();
        //this.registerEvent();
    },
    onExit : function(){
        this._super(); 
        this.removeAllChildren();
        //console.info("onExit");
    },
    registerEvent : function(){
        var a = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_CREATE_MAP,
            callback    : this.loadBackgound
        });
        cc.eventManager.addListener(a, this);
        cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_CREATE_MAP));
        //console.info(this);
    },
    loadData : function(){
        var tmx = new cc.TMXTiledMap(res.gp_map_tmx);
        var tmxPoint = tmx.getObjectGroup("point_1").getObjects();
        var tmxRun = tmx.getObjectGroup("run").getObjects();
        for(var i=0;i<tmxPoint.length;i++){
            winSize.RolePotintGroup.push({x:tmxPoint[i].x,y:tmxPoint[i].y});
        }
        for(var i=0;i<tmxRun.length;i++){
            if(i==0)
                winSize.MovePotintGroup.push({x:tmxRun[i].x-winSize.beginX,y:tmxRun[i].y-winSize.beginY});
            else
                winSize.MovePotintGroup.push({x:tmxRun[i].x-tmxRun[i-1].x,y:tmxRun[i].y-tmxRun[i-1].y});
        }
        //console.info(winSize.MovePotintGroup);
    },
    loadBackgound : function(){
        for(var i=0;i<winSize.CreatEach;i++){
            var map = new cc.Sprite("#map.png");
            map.setAnchorPoint(0,0);
            map.setPosition(0,i*2016);
            this.addChild(map);
            //console.info("CreateMap: "+i);
        }
        this.loadTract();
    },
    loadTract : function(){
        for(var j=0;j<winSize.CreatEach;j++){
            for(var i=0;i<winSize.RolePotintGroup.length;i++){
                var random = Math.floor(Math.random()*4+1);
                var random2 = Math.floor(Math.random()*2);
                var role = new cc.Sprite("#r_"+random+"_1_1.png");
                role.attr({
                    x : winSize.RolePotintGroup[i][random2].x,
                    y : j*2016+winSize.RolePotintGroup[i][random2].y,
                    random : random
                });
                this.addChild(role,5);
                GameManager.currMonsterPool.push(role);
                role.runAction(ActionManager.GP_ENEMY_NORMAL(random));
                //console.info("CreateEnemy: "+i*j);
            } 
        }
    }
});