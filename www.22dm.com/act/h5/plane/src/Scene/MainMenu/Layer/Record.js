var MMRecordLayer = ccui.Layout.extend({
    data:[],
    onEnter:function(){
        this._super();
        this.loadData();
        this.loadBackgound();
        this.loadCloseButton();
        this.loadLogs();
        this.registerEvent();
    },
    loadData : function(){
        //this.setTouchEnabled(true);
        this.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        this.setContentSize(winSize);
        this.setBackGroundColorOpacity(220);
        this.setBackGroundColor(cc.color(0, 0, 0));
    },
    registerEvent : function(){
        gamepad.bind(Gamepad.Event.BUTTON_DOWN, function(e) {
            if(e.control=="FACE_2" || e.control=="START_FORWARD"){
                var event = new cc.EventCustom(jf.EventName.MM_REMOVE_RECORD_LAYER);
                cc.eventManager.dispatchEvent(event);             
            }
        });
    },
    loadBackgound : function(){
        var node = new cc.Sprite(res.mm_recode);
        this.addChild(node);
        node.setPosition(winSize.width / 2, winSize.height / 2);
    },
    loadCloseButton:function(){
        var node = new ccui.Button(res.mm_btn_xx_1,res.mm_btn_xx_2);
        this.addChild(node);
        node.setPosition(winSize.width / 2+230, winSize.height / 2 +350);
        node.addTouchEventListener(function(sender, type) {
            switch (type) {
                case ccui.Widget.TOUCH_ENDED:
                    var event = new cc.EventCustom(jf.EventName.MM_REMOVE_RECORD_LAYER);
                    cc.eventManager.dispatchEvent(event);
                    break;
            }
        }.bind(this));
    },
    loadLogs:function(){
        var data = userInfo.recordList;
        for(var i=0;i<data.length && i<10;i++){
            this.loadItem(i,data[i].score,data[i].addtime);
        }
    },
    loadItem:function(index,score,addtime){
        var a = new ccui.Text(index+1, "Arial", 28);
        a.setAnchorPoint(0, 1);
        a.setPosition(110,730-index*60);   
        this.addChild(a);
        var b = new ccui.Text(score, "Arial", 28);
        b.setAnchorPoint(0, 1);
        b.setPosition(210,730-index*60); 
        b.setTextColor(cc.color(255,233,0,1));  
        this.addChild(b);
        var c = new ccui.Text(addtime, "Arial", 28);
        c.setAnchorPoint(0, 1);
        c.setPosition(370,730-index*60);   
        this.addChild(c);
    }
});