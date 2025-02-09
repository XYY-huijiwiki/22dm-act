var GPUILayer = cc.Layer.extend({
    z_Index : {
        title : 100,
        monutSmall : 50,
        treeSmall:40,
        mountBig : 30,
        treeBig  : 20
    },
    treeList     : [],
    treePosition : [[120,330],[335,315],[540,305],[120,570],[330,555],[530,555]],
    water        : null,
    waterPosition : [[-20,380],[170,390],[350,380],[-30,630],[160,640],[350,620]],
    ctor:function(){
        this._super();
    },
    onEnter : function(){
        this._super();
        this.loadBackGround();
        this.loadTitle();
        this.loadMountBig();
        this.loadMountSmall();
        for(var i=0;i<v_main.treeOrder.length;i++){
            this.loadTree(i);
        }
        this.registerEvent();
    },
    registerEvent : function(){
         var a = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_WATER,
            callback    : this.loadWater
        });
        cc.eventManager.addListener(a, this);
    },
    loadTree : function(index){
        var i = v_main.treeOrder[index];
        var node = new cc.Sprite("#tree_"+i+"_"+(v_main.treeGrowed[index]?84:1)+".png");
        node.setPosition(this.treePosition[i][0],this.treePosition[i][1]);
        this.treeList[index]=node;
        this.addChild(node,i<3?this.z_Index.treeSmall:this.z_Index.treeBig);
    },
    loadWater : function(event){
        var self = event.getCurrentTarget();
        var index = event.getUserData().index;
        var i = v_main.treeOrder[index];
        var node = new cc.Sprite("#water_"+(i+1)+".png");
        node.setPosition(self.waterPosition[i][0],self.waterPosition[i][1]);
        self.water = node;
        self.addChild(node,self.z_Index.title);
        node.runAction(ActionManager.Water(function(){
            self.treeList[index].runAction(ActionManager.GrowUp(i,84,function(){
                winSize.hasGrowUp(index);
            }));
            node.removeFromParent();
        }.bind(self)));
    },
    loadBackGround : function(){
        var node = new cc.Sprite(res.gp_bg);
        node.setPosition(winSize.width/2,winSize.height/2);
        this.addChild(node,0);
    },
    loadTitle : function(){
        var node = new cc.Sprite(res.gp_title);
        node.setPosition(winSize.width/2,winSize.height/2+300);
        node.runAction(ActionManager.MM_ROLE_FLOAT());
        this.addChild(node,this.z_Index.title);
    },
    loadMountBig : function(){
        var node = new cc.Sprite(res.gp_mount_big);
        node.attr({
            anchorX : 0,
            anchorY : 0,
            x : 0,
            y : 0
        })
        this.addChild(node,this.z_Index.mountBig);
    },
    loadMountSmall : function(){
        var node = new cc.Sprite(res.gp_mount_small);
        node.attr({
            anchorX : 0,
            anchorY : 0,
            x : 0,
            y : 0
        })
        this.addChild(node,this.z_Index.monutSmall);
    }
});

