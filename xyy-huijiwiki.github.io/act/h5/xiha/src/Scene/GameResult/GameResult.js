var GameResultScene = cc.Scene.extend({
    data            : null,
    backgroundLayer : null, // 背景层
    mainLayer       : null, 
    ctor:function(data){
        this._super();
        this.data = data;
    },
    onEnter : function () {
        this._super();
        this.loadBackgroundLayer();
        this.loadMainLayer();
        this.registerEvent(); 
        winSize.runingLayer = 'GameResultScene_index'; 
    },
    registerEvent : function(){
        var a = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GS_SELECT,
            callback    : this.onMenuSelect
        });
        cc.eventManager.addListener(a, this);

        var b = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GS_CLICK,
            callback    : this.onMenuClick
        });
        cc.eventManager.addListener(b, this);
    },
    onMenuSelect : function(event){
        var self = event.getCurrentTarget();
        var value = event.getUserData().value;
        var menu = self.mainLayer._children[0];
        var total = menu.childrenCount;
        var index;
        for(var i=0;i<total;i++){
            if(menu.children[i].isSelected())
                index = i;
            menu.children[i].unselected();
        }
        if(value>0){ //下
            index = index >= total-1 ? 0 : index+1;
        }
        else{
            index = index <= 0 ? total-1 : index-1;
        }   
        menu.children[index].selected();
    },
    onMenuClick : function(event){
        var self = event.getCurrentTarget();
        var menu = self.mainLayer._children[0];
        var index;
        for(var i=0;i<menu.childrenCount;i++){
            if(menu.children[i].isSelected()){
                menu.children[i].activate();
                break;
            }
        }  
    },
    loadBackgroundLayer : function(){
        this.backgroundLayer = new GSBackgroundLayer();
        this.addChild(this.backgroundLayer);
    },
    loadMainLayer : function(){
        this.mainLayer = new GSMainLayer(this.data);
        this.addChild(this.mainLayer);
    }
});