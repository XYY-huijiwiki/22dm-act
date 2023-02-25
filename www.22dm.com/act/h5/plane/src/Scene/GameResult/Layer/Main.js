var GSMainLayer = cc.Layer.extend({
    data     : null,
    tipPanel : null,
    menu  : null,
    isNew : true,
    title : "发明大作战",
    score : 50000,
    ctor:function(data){
        this._super();
        this.data = data;
    },
    onEnter : function () {
        this._super();
        this.loadData();
        this.loadTipPanel();
        this.loadMenu();
        this.onCreateMenuGamePad();
    },
    loadData:function(){
        this.title = this.data.title;
        this.score = this.data.score;
        this.isNew = this.data.isNew;
    },
    loadTipPanel:function(){
        this.tipPanel = new cc.Sprite(res.gs_tip_1);
        this.addChild(this.tipPanel);
        this.tipPanel.setAnchorPoint(0.5, 0.5);
        this.tipPanel.setPosition(winSize.width / 2+50, winSize.height / 2+210);
        if(this.isNew){
            userInfo.hightest=this.score;
            var newTip = new cc.Sprite(res.gs_tip_2);
            this.tipPanel.addChild(newTip);
            newTip.setPosition(this.tipPanel.width /2-40,30);      
        }
        this.loadTitleText();
        this.loadScoreText();
    },
    loadTitleText:function(){
        var node = new ccui.Text(this.title, "Arial", 32);
        node.setTextColor(cc.color(255,233,0,1));
        node.setAnchorPoint(0.5, 0.5);
        node.setPosition(this.tipPanel.width /2 -40,200);   
        this.tipPanel.addChild(node);
    },
    loadScoreText:function(){
        var node = new ccui.Text(this.score, "Arial", 60);
        node.setAnchorPoint(0.5, 0.5);
        node.setPosition(this.tipPanel.width /2 -40,110);   
        this.tipPanel.addChild(node);
    },
    onCreateMenuGamePad:function(){
        var menu = this.menu;
        var total = menu.childrenCount;
        gamepad.bind(Gamepad.Event.AXIS_CHANGED, function(e) {
            if(e.axis=="LEFT_STICK_Y" && Math.abs(e.value)>=0.95 && menu.parent.isVisible()){
                var index;
                for(var i=0;i<total;i++){
                    if(menu.children[i].isSelected())
                        index = i;
                    menu.children[i].unselected();
                }
                if(e.value>0){ //下
                    index = index >= total-1 ? 0 : index+1;
                }
                else{
                    index = index <= 0 ? total-1 : index-1;
                }   
                menu.children[index].selected();
            }
        });
        gamepad.bind(Gamepad.Event.BUTTON_DOWN, function(e) {
            if(!menu.parent.isVisible())
                cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GS_REMOVE_RANKING_LAYER));
            else if(e.control=="FACE_2"){
                for(var i=0;i<total;i++){
                    if(menu.children[i].isSelected()){
                        menu.children[i].activate();
                        break;
                    }
                }                  
            }
        });
    },
    loadMenu : function(){
        var restartNormal = new cc.Sprite(res.gg_btn_restart_1);
        var restartPress = new cc.Sprite(res.gg_btn_restart_2);
        var restartDisabled = new cc.Sprite(res.gg_btn_restart_1);
        var homeNormal = new cc.Sprite(res.gg_btn_home_1);
        var homePress = new cc.Sprite(res.gg_btn_home_2);
        var homeDisabled = new cc.Sprite(res.gg_btn_home_1);
        var rankingNormal = new cc.Sprite(res.gs_btn_ranking_1);
        var rankingPress = new cc.Sprite(res.gs_btn_ranking_2);
        var rankingDisabled = new cc.Sprite(res.gs_btn_ranking_1);
        var a = new cc.MenuItemSprite(
            restartNormal,
            restartPress,
            restartDisabled,
            function(){
                cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_REMOVE_GAMEPAD));
                GameManager.loadLevelData(0);
                cc.director.runScene(new GamePlayScene(0));
            }.bind(this));
        var b = new cc.MenuItemSprite(
            homeNormal,
            homePress,
            homeDisabled,
            function(){
                cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GP_REMOVE_GAMEPAD));
                cc.director.runScene(new MainMenuScene());
            }.bind(this));
        var c = new cc.MenuItemSprite(
            rankingNormal,
            rankingPress,
            rankingDisabled,
            function(){
                cc.eventManager.dispatchEvent(new cc.EventCustom(jf.EventName.GS_CREATE_RANKING_LAYER));
            }.bind(this));
        a.attr({
            x: winSize.width / 2, 
            y: winSize.height / 2
        });
        b.attr({
            x: winSize.width / 2, 
            y:winSize.height / 2 - 110
        });
        c.attr({
            x: winSize.width / 2, 
            y: winSize.height / 2 - 220
        });
        var menu = new cc.Menu(a, b,c);
        this.addChild(menu);
        menu.setPosition(0, 0);
        this.menu = menu;
        if(isPC)
            c.selected();
    }
});