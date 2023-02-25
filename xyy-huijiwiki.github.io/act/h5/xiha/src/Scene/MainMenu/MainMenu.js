var MainMenuScene = cc.Scene.extend({
    backgroundLayer : null,
    mainLayer       : null,
    ruleLayer      : null,
    ctor : function(){
        this._super();
        if(cc.audioEngine.getMusicVolume()>0.3){
            cc.audioEngine.setMusicVolume(winSize.audioVolume);
            cc.audioEngine.setEffectsVolume(winSize.audioVolume);
        }
    },
    onEnter : function () {
        this._super();
        this.loadBackgroundLayer(); 
        this.loadMainLayer();         
        this.registerEvent(); 
        winSize.runingLayer = 'MainMenuScene_index';   
    },
    registerEvent : function(){
        var a = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.MM_CREATE_RULE_LAYER,
            callback    : this.onCreateRuleLayer
        });
        cc.eventManager.addListener(a, this);

        var b = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.MM_REMOVE_RULE_LAYER,
            callback    : this.onRemoveRuleLayer
        });
        cc.eventManager.addListener(b, this);

        var c = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.MM_SELECT,
            callback    : this.onMenuSelect
        });
        cc.eventManager.addListener(c, this);

        var d = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.MM_CLICK,
            callback    : this.onMenuClick
        });
        cc.eventManager.addListener(d, this);
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
        for(var i=0;i<menu.childrenCount;i++){
            if(menu.children[i].isSelected()){
                menu.children[i].activate();
                break;
            }
        }  
    },
    loadBackgroundLayer : function(){
        this.backgroundLayer = new MMBackgroundLayer();
        this.addChild(this.backgroundLayer);
    },
    loadMainLayer : function(){
        this.mainLayer = new MMMainLayer();
        this.addChild(this.mainLayer);
    },
    loadRuleLayer : function(){
        this.ruleLayer = new MMRuleLayer();
        this.addChild(this.ruleLayer); 
        winSize.runingLayer = 'MainMenuScene_rule'; 
    },
    onCreateRuleLayer : function(event) {
        var self = event.getCurrentTarget();
        self.loadRuleLayer();
    },
    onRemoveRuleLayer : function(event){
        var self = event.getCurrentTarget();
        self.removeChild(self.ruleLayer);
        winSize.runingLayer = 'MainMenuScene_index'; 
    }
});