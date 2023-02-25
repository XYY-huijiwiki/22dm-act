var GameResultScene = cc.Scene.extend({
    data            : null,
    backgroundLayer : null, // 背景层
    mainLayer       : null, // 玩法层
    rankingLayer    : null,
    ctor:function(data){
        this._super();
        this.data = data;
    },
    onEnter : function () {
        this._super();
        this.loadBackgroundLayer();
        this.loadMainLayer();
        this.registerEvent();
    },
    registerEvent : function(){
        var onCreateRankingLayerListener = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GS_CREATE_RANKING_LAYER ,
            callback    : this.onCreateRankingLayer
        });
        cc.eventManager.addListener(onCreateRankingLayerListener, this);
        var onRemoveRankingLayerListener = cc.EventListener.create({
            event       : cc.EventListener.CUSTOM,
            target      : this,
            eventName   : jf.EventName.GS_REMOVE_RANKING_LAYER ,
            callback    : this.onRemoveRankingLayer
        });
        cc.eventManager.addListener(onRemoveRankingLayerListener, this);
    },
    loadBackgroundLayer : function(){
        var node = new GSBackgroundLayer();
        this.addChild(node);
        this.backgroundLayer = node;
    },
    loadMainLayer : function(){
        this.mainLayer = new GSMainLayer(this.data);
        this.addChild(this.mainLayer);
    },
    loadRankingLayer : function(){
        this.mainLayer.setVisible(false);
        plane.openRankingList();
    },
    onCreateRankingLayer : function(event) {
        var self = event.getCurrentTarget();
        if(self.mainLayer.isVisible()){
            self.mainLayer.setVisible(false);
            plane.openRankingList();
        }
        else{
            cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GS_REMOVE_RANKING_LAYER));
        }
    },
    onRemoveRankingLayer : function(event){
        var self = event.getCurrentTarget();
        self.mainLayer.setVisible(true);
        $("#ranking").hide();
    }
});