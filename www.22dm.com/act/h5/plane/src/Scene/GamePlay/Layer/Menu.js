var GPMenuLayer = ccui.Layout.extend({
    menu  : null,
    onEnter : function(){
        this._super();
        cc.director.pause();    // 导演暂停
        // 加载[基础配置]
        this.loadConfig();
        this.loadMenu();
        this.onCreateMenuGamePad();
    },
    onExit : function(){
        cc.director.resume();
        this._super();
    },
    loadConfig : function(){
        this.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        this.setContentSize(winSize);
        this.setBackGroundColorOpacity(100);
        this.setBackGroundColor(cc.color(0, 0, 0));
    },
    onCreateMenuGamePad:function(){
        var menu = this.menu;
        var total = menu.childrenCount;
        gamepad.bind(Gamepad.Event.AXIS_CHANGED, function(e) {
            if(e.axis=="LEFT_STICK_Y" && Math.abs(e.value)>=0.95){
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
            if(e.control=="FACE_2"){
                for(var i=0;i<total;i++){
                    if(menu.children[i].isSelected()){
                        gamepad.unbind(Gamepad.Event.BUTTON_DOWN);
                        gamepad.unbind(Gamepad.Event.AXIS_CHANGED);
                        menu.children[i].activate();
                        break;
                    }
                }
            }
            else if(e.control=="START_FORWARD"){
                menu.children[0].activate();
            }
        });
    },
    loadMenu:function(){
        var continueNormal = new cc.Sprite(res.gg_btn_continue_1);
        var continuePress = new cc.Sprite(res.gg_btn_continue_2);
        var continueDisabled = new cc.Sprite(res.gg_btn_continue_1);
        var restartNormal = new cc.Sprite(res.gg_btn_restart_1);
        var restartPress = new cc.Sprite(res.gg_btn_restart_2);
        var restartDisabled = new cc.Sprite(res.gg_btn_restart_1);
        var homeNormal = new cc.Sprite(res.gg_btn_home_1);
        var homePress = new cc.Sprite(res.gg_btn_home_2);
        var homeDisabled = new cc.Sprite(res.gg_btn_home_1);
        var a = new cc.MenuItemSprite(
            continueNormal,
            continuePress,
            continueDisabled,
            function(){
                var event = new cc.EventCustom(jf.EventName.GP_REMOVE_MENU_LAYER);
                cc.eventManager.dispatchEvent(event);
            }.bind(this));
        var b = new cc.MenuItemSprite(
            restartNormal,
            restartPress,
            restartDisabled,
            function(){
                var scene = new GamePlayScene(0);
                cc.director.runScene(scene);
            }.bind(this));
        var c = new cc.MenuItemSprite(
            homeNormal,
            homePress,
            homeDisabled,
            function(){
                var scene = new MainMenuScene();
                cc.director.runScene(scene);
            }.bind(this));
        a.attr({
            x: winSize.width / 2, 
            y: winSize.height / 2 + 100
        });
        b.attr({
            x: winSize.width / 2, 
            y:winSize.height / 2
        });
        c.attr({
            x: winSize.width / 2, 
            y: winSize.height / 2 - 100
        });
        var menu = new cc.Menu(a, b,c);
        this.addChild(menu);
        menu.setPosition(0, 0);
        this.menu = menu;
        if(isPC)
            menu.children[0].selected();
    }
});