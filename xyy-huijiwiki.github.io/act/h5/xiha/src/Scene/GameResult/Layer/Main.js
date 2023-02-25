var GSMainLayer = cc.Layer.extend({
    data     : null,
    tipPanel : null,
    menu  : null,
    isNew : false,
    title : "小菜鸟",
    score : 0,
    ctor:function(data){
        this._super();
        this.data = data;
    },
    onEnter : function () {
        this._super();
        this.loadData();
        this.loadMenu();
        this.loadTipPanel();
    },
    loadData:function(){
        this.title = this.data.title;
        this.score = this.data.score;
        this.isNew = this.data.isNew;
    },
    loadTipPanel:function(){
        this.tipPanel = new cc.Sprite(res.gs_ui_title);
        this.addChild(this.tipPanel);
        this.tipPanel.setAnchorPoint(0.5, 0.5);
        this.tipPanel.setPosition(winSize.width / 2, winSize.height / 2+290);
        if(this.isNew){
            userInfo.hightest=this.score;
            var newTip = new cc.Sprite(res.gs_ui_new);
            this.tipPanel.addChild(newTip);
            newTip.setPosition(this.tipPanel.width /2,-20);      
        }
        this.loadTitleText();
        this.loadScoreText();
    },
    loadTitleText:function(){
        var node = new ccui.Text(this.title, "Arial", 32);
        node.setTextColor(cc.color(38,199,245,1));
        node.setAnchorPoint(0.5, 0.5);
        node.setPosition(this.tipPanel.width /2-10,132);   
        this.tipPanel.addChild(node);
    },
    loadScoreText:function(){
        var node = new ccui.Text(this.score, "Arial", 60);
        node.setAnchorPoint(0.5, 0.5);
        node.setPosition(this.tipPanel.width /2,57);   
        this.tipPanel.addChild(node);
    },
    loadMenu : function(){
        var restartNormal = new cc.Sprite("#btn_restart_normal.png");
        var restartPress = new cc.Sprite("#btn_restart_press.png");
        var restartDisabled = new cc.Sprite("#btn_restart_normal.png");
        var homeNormal = new cc.Sprite("#btn_home_normal.png");
        var homePress = new cc.Sprite("#btn_home_press.png");
        var homeDisabled = new cc.Sprite("#btn_home_normal.png");
        var rankingNormal = new cc.Sprite("#btn_ranking_normal.png");
        var rankingPress = new cc.Sprite("#btn_ranking_press.png");
        var rankingDisabled = new cc.Sprite("#btn_ranking_normal.png");
        var a = new cc.MenuItemSprite(
            restartNormal,
            restartPress,
            restartDisabled,
            function(){
                cc.director.runScene(new GamePlayScene(0));
            }.bind(this));
        var b = new cc.MenuItemSprite(
            homeNormal,
            homePress,
            homeDisabled,
            function(){
                cc.director.runScene(new MainMenuScene());
            }.bind(this));
        var c = new cc.MenuItemSprite(
            rankingNormal,
            rankingPress,
            rankingDisabled,
            function(){
                winSize.runingLayer = "GameResultScene_ranking";  
                xiha.ranking.open();
            }.bind(this));
        a.attr({
            x: winSize.width / 2, 
            y: winSize.height / 2 + 50
        });
        b.attr({
            x: winSize.width / 2, 
            y:winSize.height / 2 -100
        });
        c.attr({
            x: winSize.width / 2, 
            y: winSize.height / 2 - 250
        });
        var menu = new cc.Menu(a, b,c);
        this.addChild(menu);
        menu.setPosition(0, 0);
        this.menu = menu;
        if(isPC)
            a.selected();
    }
});