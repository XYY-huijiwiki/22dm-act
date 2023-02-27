var MMUILayer = cc.Layer.extend({
    Role        :  null,
    ctor : function () {
        this._super();
    },
    onEnter : function () {
        this._super();
        this.loadButtonLayer();
    },
    loadButtonLayer : function(){
        this.loadTitle();
        this.loadButtonStart();
        this.loadButtonMusic();
        this.loadButtonRule();
        this.loadButtonRecord();
    },
    loadTitle : function(){
        var node = new cc.Sprite(res.mm_title);
        this.addChild(node);
        node.setPosition(winSize.width / 2, 830);
        node.runAction(ActionManager.MM_TITLE_FLOAT());
    },
    loadButtonStart : function(){
        var node = new ccui.Button(res.mm_btn_start,res.mm_btn_start,res.mm_btn_start);
        node.setPressedActionEnabled(true);
        node.attr({
            x : winSize.width / 2,
            y : 530
        });
        node.addTouchEventListener(function(sender,type){
            if(type==ccui.Widget.TOUCH_ENDED && sender.pressedActionEnabled)
            {
                winSize.playEffect('button')
                sender.setPressedActionEnabled(false);
                v_main.Game_resert();
            }
        },this);
        node.runAction(ActionManager.MM_START_FLOAT());
        this.addChild(node);
    },
    loadButtonMusic : function(){
        var node = new ccui.Button(res.pb_btn_music_1,res.pb_btn_music_1,res.pb_btn_music_0);
        node.setPressedActionEnabled(true);
        node.attr({
            anchorX : 1,
            anchorY : 1,
            x : winSize.width-23,
            y : winSize.height - 64
        });
        if(cc.audioEngine.getEffectsVolume()==0){ //静音了
            node.setBright(false);
        }
        this.addChild(node);
        if(winSize.scale>0.97){
            node.addTouchEventListener(function(sender,type){
                if(type == ccui.Widget.TOUCH_ENDED)
                {
                    if(sender._bright){  //静音
                        sender.setBright(false);
                        winSize.setEffectsVolume(0);
                    }
                    else{   //开启声音
                        sender.setBright(true);
                        winSize.setEffectsVolume(1);
                    }
                }
            },this);
        }
        else{
            var a = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: false,
                onTouchBegan:function(touch, event){return true;},
                onTouchEnded: function (touch, event) {
                    var target = event.getCurrentTarget();
                    var rect = cc.rect(node.x-node.width, node.y-node.height, node.width, node.height);
                    if(cc.rectContainsPoint(rect, {x:touch.getLocation().x/winSize.scale,y:touch.getLocation().y/winSize.scale})){
                        if(node._bright){  //静音
                            node.setBright(false);
                            winSize.setEffectsVolume(0);
                        }
                        else{   //开启声音
                            node.setBright(true);
                            winSize.setEffectsVolume(1);
                        }
                    }
                    return;
                }
            });
            cc.eventManager.addListener(a,this);
        }
    },
    loadButtonRule : function(){
        var node = new ccui.Button(res.mm_btn_rule,res.mm_btn_rule,res.mm_btn_rule);
        node.setPressedActionEnabled(true);
        node.attr({
            anchorX : 0,
            anchorY : 1,
            x : 95,
            y : 465
        });
        node.addTouchEventListener(function(sender,type){
            if(type==ccui.Widget.TOUCH_ENDED)
            {
                winSize.playEffect('button');
                v_main.active = 'rule';
            }
        },this);
        node.runAction(ActionManager.MM_RULE_FLOAT());
        this.addChild(node);
    },
    loadButtonRecord : function(){
        var node = new ccui.Button(res.mm_btn_ranking,res.mm_btn_ranking,res.mm_btn_ranking);
        node.setPressedActionEnabled(true);
        node.attr({
            x : 480,
            y : 430
        });
        node.addTouchEventListener(function(sender,type){
            if(type==ccui.Widget.TOUCH_ENDED)
            {
                winSize.playEffect('button');
                v_main.active = 'record';
            }
        },this);
        node.runAction(ActionManager.MM_RECORD_FLOAT());
        this.addChild(node);
    }
});
