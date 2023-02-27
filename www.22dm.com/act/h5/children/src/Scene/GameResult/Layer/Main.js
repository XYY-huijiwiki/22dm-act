var GSMainLayer = cc.Layer.extend({
    data     : null,
    theme    : 0,
    score    : 0,
    share    : null,
    restart  : null,
    record   : null,
    ctor:function(data){
        this._super();
        this.data = data;
    },
    onEnter : function () {
        this._super();
        this.loadData();
        this.loadCH();
        this.loadScoreText();
        this.loadButton();
    },
    loadData:function(){
        this.theme = this.data.theme;
        this.score = this.data.score;
    },
    loadCH : function(){
        var node = new cc.Sprite("#theme_"+this.theme+".png");
        this.addChild(node);
        node.attr({
            x : winSize.width/2,
            y : node.height/2
        });
    },
    loadScoreText:function(){
        var score = new ccui.Text(this.score, "Arial", 80);
        this.addChild(score);
        score.setTextColor(cc.color(158,98,37,1));
        score.setAnchorPoint(0.5, 0.5);
        score.setPosition(winSize.width/2-20,610); 
    },
    loadButton : function(){
        var share = new ccui.Button("btn_share.png","btn_share.png","btn_share.png",ccui.Widget.PLIST_TEXTURE);
        var restart = new ccui.Button("btn_restart.png","btn_restart.png","btn_restart.png",ccui.Widget.PLIST_TEXTURE);
        var record = new ccui.Button("btn_record.png","btn_record.png","btn_record.png",ccui.Widget.PLIST_TEXTURE);
        share.setPressedActionEnabled(true);
        restart.setPressedActionEnabled(true);
        record.setPressedActionEnabled(true);
        share.setZoomScale(0.1);
        restart.setZoomScale(0.1);
        record.setZoomScale(0.1);
        restart.attr({
            x : 200,
            y : 355
        });
        
        share.attr({
            x : 460,
            y : 355
        });
        record.attr({
            x : 80,
            y : winSize.height - 150
        });
        this.share = share;
        this.record = record;
        this.restart = restart;
        this.addChild(share);
        this.addChild(restart); 
        share.runAction(ActionManager.BALL_FLOAT(0,30));
        restart.runAction(ActionManager.BALL_FLOAT(1,10));
        restart.addTouchEventListener(function(sender,type){
            if(type==ccui.Widget.TOUCH_ENDED)
            {
                sender.setPressedActionEnabled(false);
                winSize.playEffect('button');
                v_main.Game_resert();
            }
        },this);
        share.addTouchEventListener(function(sender,type){
            if(type==ccui.Widget.TOUCH_ENDED)
            {
                winSize.playEffect('button');
                v_main.active='share';
            }
        },this);
        if(winSize.scale>0.98){
            this.addChild(record); 
            record.addTouchEventListener(function(sender,type){
                //console.info(sender);
                if(type==ccui.Widget.TOUCH_ENDED)
                {
                    winSize.playEffect('button');
                    v_main.active='record';
                }
            },this);
        }
        // else{
        //     var a = cc.EventListener.create({
        //         event: cc.EventListener.TOUCH_ONE_BY_ONE,
        //         swallowTouches: false,
        //         onTouchBegan: function (touch, event) {
        //             var target = event.getCurrentTarget();
        //             var rect = cc.rect(record.x/winSize.scale, record.y/winSize.scale, record.width, record.height);
        //             if (cc.rectContainsPoint(rect, {x:touch.getLocation().x,y:touch.getLocation().y})) {               
        //                 console.info("onTouchBegan");
        //             } 
        //         }
        //     });
        //     cc.eventManager.addListener(a,this);
        // }
    }
});