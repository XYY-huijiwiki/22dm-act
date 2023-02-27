var GSMainLayer = cc.Layer.extend({
    data     : null,
    theme    : 0,
    score    : 0,
    ctor:function(data){
        this._super();
        this.data = data;
    },
    onEnter : function () {
        this._super();
        this.loadData();
        this.loadCH();
        this.loadButton();
        this.loadScoreText();
    },
    loadData:function(){
        this.theme = this.data.theme;
        this.score = this.data.score;
    },
    loadCH : function(){
        var src = [res.gs_ch_1,res.gs_ch_2,res.gs_ch_3,res.gs_ch_4,res.gs_ch_5,res.gs_ch_6];
        var node = new cc.Sprite(src[this.theme]);
        this.addChild(node);
        node.attr({
            x : winSize.width/2,
            y : 470 + node.height/2
        });
    },
    loadScoreText:function(){
        var score = new ccui.Text(this.score, "Arial", 60);
        var text =  new ccui.Text("分", "Arial", 24);
        this.addChild(score);
        this.addChild(text);
        score.setTextColor(cc.color(255,69,12,1));
        score.setAnchorPoint(0.5, 0.5);
        score.setPosition(winSize.width/2-10,485); 
        text.setTextColor(cc.color(255,69,12,1));
        text.setAnchorPoint(0.5, 0.5);
        text.setPosition(winSize.width/2+score.width/2+5,477); 
    },
    loadButton : function(){
        var share = new ccui.Button(res.gs_btn_share,res.gs_btn_share,res.gs_btn_share);
        var restart = new ccui.Button(res.gs_btn_restart,res.gs_btn_restart,res.gs_btn_restart);
        share.setPressedActionEnabled(true);
        restart.setPressedActionEnabled(true);
        share.setZoomScale(0.2);
        restart.setZoomScale(0.2);
        restart.attr({
            x : 200,
            y : 330
        });
        restart.addTouchEventListener(function(sender,type){
            if(type==ccui.Widget.TOUCH_ENDED)
            {
                cc.audioEngine.playEffect(res.audio_button,false);
                sender.setPressedActionEnabled(false);
                GameManager.restart();
                cc.director.runScene(new GamePlayScene());
            }
        },this);
        share.attr({
            x : 460,
            y : 330
        });
        share.addTouchEventListener(function(sender,type){
            if(type==ccui.Widget.TOUCH_ENDED)
            {
                dialogs.open("dialogs_share");
            }
        },this);
        this.addChild(share);
        this.addChild(restart); 
    }
});