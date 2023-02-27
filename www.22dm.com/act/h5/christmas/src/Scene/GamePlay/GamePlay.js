var GamePlayScene = cc.Scene.extend({
    level           : 12,
    IsStart         : false,
    backgroundLayer : null, // 背景层
    mainLayer       : null, // 玩法层
    UILayer         : null, // UI层
    dialogsLayer    : null,
    snowLayer       : null,
    ctor : function(){
        this._super();
    },
    onEnter : function () {
        this._super();
        this.registerEvent();
        this.property(); 
        this.loadBackgroundLayer();
        this.loadUILayer();
        this.loadMainLayer();
        //this.loadSnowLayer();
        if(!cc.audioEngine.isMusicPlaying())
            cc.audioEngine.playMusic(res.audio_music, true);  
    },
    onExit : function(){
        this._super();
    },
    loadNextLevel : function(event){
        var self = event.getCurrentTarget();
        self.property();
        self.removeChild(self.UILayer);
        self.removeChild(self.mainLayer);
        self.loadUILayer();
        self.loadMainLayer();
    },
    property:function(){
        GameManager.reset();
        for(var i=0;i<winSize.ArtRows;i++){ 
            GameManager.currArticleSequence[i] = new Array(); 
            for(var j=0;j<winSize.ArtColumn;j++){ 
                GameManager.currArticleSequence[i][j] = new Array(); 
            } 
        }
        var level;
        if(GameManager.currLevel<=5){
            level = 0;
        }
        else if(GameManager.currLevel<=10){
            level = 1;
        }
        else{
            level = 2;
        }
        var count = winSize.ArtLevel[level][0];  //道具种类
        var total = Math.round(Math.random()*(winSize.ArtLevel[level][2]-winSize.ArtLevel[level][1])+winSize.ArtLevel[level][1]);  //道具总数
        var position = this.getRandomPostion(total*2);
        GameManager.currArticleTargetTotal = total;
        var j = total;  //计数器
        console.info("total: "+total);
        for (var i = 0; i < count; i++) {
            var random;
            var tmp = {};
            tmp.isRearrange = false;
            tmp.brother =false;
            if(Math.random()>winSize.ProbabilityRearrange){
                var r = Math.round(Math.random()*(winSize.ArtInterfere.length-1));
                random = winSize.ArtInterfere[r];
                //console.info("rearrange: "+random);
                tmp.isRearrange = true;
                tmp.brother = Math.random()>winSize.ProbabilityBrother?true:false;
                winSize.ArtInterfere.splice(r,1);
                for(var z=0;z<winSize.ArtSequence.length;z++){
                    if(winSize.ArtSequence[z]==random){
                        winSize.ArtSequence.splice(z,1);
                        break;
                    }
                } 
            }
            else{
                var r = Math.round(Math.random()*(winSize.ArtSequence.length-1));
                random = winSize.ArtSequence[r];
                //console.info("normal: "+random);
                winSize.ArtSequence.splice(r,1);
                for(var z=0;z<winSize.ArtInterfere.length;z++){
                    if(winSize.ArtInterfere[z]==random){
                        winSize.ArtInterfere.splice(z,1);
                        break;
                    }
                }
            }
            var num = Math.floor(Math.random()*(j-count+i)+1)*1;
            tmp.target = random;
            tmp.total = i==count-1?j:num;
            tmp.position = [];
            tmp.positionRearrange = [];
            GameManager.currArticleTarget.push(tmp);
            j -= num;
        }
        for (var i = 0; i < count; i++) {
            for (var c = 0; c < GameManager.currArticleTarget[i].total; c++) {
                GameManager.currArticleTarget[i].position.push(position[0]);
                position.splice(0,1);
                if(GameManager.currArticleTarget[i].isRearrange){
                    GameManager.currArticleTarget[i].positionRearrange.push(position[0]);
                    position.splice(0,1);
                }
            }
        }
        console.info(GameManager.currArticleTarget);
        console.info(winSize.ArtSequence);
        GameManager.currLevel++;
    },
    getRandomPostion : function(n){
        var x,y,tmp=[];
        for(var k=0;k<n;k++){
            var isOk = false;
            while (!isOk){
                x = Math.round(Math.random()*5);
                y = Math.round(Math.random()*6);
                if(GameManager.currArticleSequence[x][y].length==0){ 
                    GameManager.currArticleSequence[x][y] = 1;
                    tmp.push({x:x,y:y});
                    isOk=true;
                }
            }
        }
        //console.info(tmp.slice());
        return tmp;
    },
    registerEvent : function(){
        // [事件监听]创建Dialogs
        var d = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_CREATE_DIALOGS_LAYER,
            callback    : this.onCreateDialogsLayer
        });
        cc.eventManager.addListener(d, this);

        // [事件监听]移除Dialogs
        var e = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_REMOVE_DIALOGS_LAYER,
            callback    : this.onRemoveDialogsLayer
        });
        cc.eventManager.addListener(e, this);

        // [事件监听]下一关
        var f = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GP_NEXT_LEVEL,
            callback    : this.loadNextLevel
        });
        cc.eventManager.addListener(f, this);
    },
    loadBackgroundLayer : function(){
        this.backgroundLayer = null;
        var node = new GPBackgroundLayer();
        this.addChild(node,0);
        this.backgroundLayer = node;
    },
    loadUILayer : function(){
        this.UILayer = null;
        this.UILayer = new GPUILayer();
        this.addChild(this.UILayer,20);
    },
    loadSnowLayer : function(){
        this.snowLayer = null;
        var node = new GPSnowLayer();
        this.addChild(node,15);
        this.snowLayer = node;
    },
    loadMainLayer : function(){
        this.mainLayer = null;
        this.mainLayer = new GPMainLayer();
        this.addChild(this.mainLayer,30);
    },
    loadDialogsLayer : function(data){
        this.dialogsLayer = null;
        this.dialogsLayer = new GPDialogsLayer(data.text,data.cb);
        this.addChild(this.dialogsLayer,50);
    },
    onCreateDialogsLayer : function(event) {
        var self = event.getCurrentTarget();
        var data = event.getUserData();
        self.loadDialogsLayer(data);
    },
    onRemoveDialogsLayer : function(event){ 
        var self = event.getCurrentTarget();
        self.removeChild(self.dialogsLayer);
        self.dialogsLayer = null;
    }
});