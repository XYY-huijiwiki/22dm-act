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
        cc.spriteFrameCache.addSpriteFrames(res.gs_result_plist_0,res.gs_result_png_0);
        cc.spriteFrameCache.addSpriteFrames(res.gs_result_plist_1,res.gs_result_png_1);
        this.loadData();
        this.loadAnimation();
        this.loadButton();
        this.loadScoreText();
    },
    loadData:function(){
        this.theme = this.data.theme;
        this.score = this.data.score;
    },
    loadAnimation : function(){
        var position = [[153,747],[330,500],[420,230],[330,520]];
        var src = ["bad_","soso_","good_","best_"];
        var length = [14,12,11,14];
        var forever = [1,0,0,0];
        var node = new cc.Sprite("#"+ src[this.theme]+"1.png");
        node.attr({
            x : position[this.theme][0],
            y : position[this.theme][1]
        });
        this.addChild(node);

        var frames = [];
        for(var i=2;i<=length[this.theme];i++){
            var str = src[this.theme]+i+".png";
            frames.push(cc.spriteFrameCache.getSpriteFrame(str));
        }
        var animation = cc.animate(new cc.Animation(frames,0.07));
        if(forever[this.theme])
            animation.repeatForever();
        setTimeout(function(){
            node.runAction(animation);         
        },1000)
    },
    loadScoreText:function(){
        var score = new ccui.Text(this.score, "Arial", 40);
        var text =  new ccui.Text("次", "Arial", 26);
        score.setTextColor(cc.color(226,0,126,1));
        score.setAnchorPoint(0.5, 0.5);
        score.setPosition(winSize.width/2-30,730); 
        text.setTextColor(cc.color(226,0,126,1));
        text.setAnchorPoint(0.5, 0.5);
        text.setPosition(winSize.width/2-30+score.width,730); 
        this.addChild(score);
        this.addChild(text);
    },
    loadButton : function(){
        var share = new ccui.Button("btn_share.png","btn_share.png","btn_share.png",ccui.Widget.PLIST_TEXTURE);
        var restart = new ccui.Button("btn_restart2.png","btn_restart2.png","btn_restart2.png",ccui.Widget.PLIST_TEXTURE);
        share.attr({
            x : 170,
            y : 60
        });
        share.addTouchEventListener(function(sender,type){
            if(type==ccui.Widget.TOUCH_ENDED)
            {
                dialogs.open("dialogs_share");
            }
        },this);
        restart.attr({
            x : 460,
            y : 60
        });
        restart.addTouchEventListener(function(sender,type){
            if(type==ccui.Widget.TOUCH_ENDED)
            {
                restart.setPressedActionEnabled(false);
                cc.director.runScene(new GamePlayScene(true));
            }
        },this);
        this.addChild(share);
        this.addChild(restart); 
    }
});