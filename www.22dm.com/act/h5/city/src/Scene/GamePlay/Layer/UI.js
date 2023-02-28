var GPUILayer = cc.Layer.extend({
    ctor:function(){
        this._super();
    },
    onEnter : function(){
        this._super();
        this.registerEvent();
    },
    registerEvent : function(){
        Listen_decorate = cc.EventListener.create({
            event:cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan:function(touch,event){
                var target = event.getCurrentTarget(); 
                var locationInNode = target.convertToNodeSpace(touch.getLocation()); // 获取当前触摸点相对于按钮所在的坐标  
                var s = target.moveType=='default' ? target.children[0].getContentSize():target.getContentSize();
                var rect = target.moveType=='default' ? cc.rect(40, 40, s.width, s.height):cc.rect(0, 0, s.width, s.height);
                if (cc.rectContainsPoint(rect, locationInNode)) { // 判断触摸点是否在按钮范围内      
                    //console.info("onTouchBegan");                 
                    target.children[0].opacity = 230;
                    for(var i=0;i<Layer_decorate.childrenCount;i++){
                        Layer_decorate.children[i].setLocalZOrder(target.__instanceId==Layer_decorate.children[i].__instanceId ? 1 : 0) 
                    }
                    return true;
                }
                return false;
            },
            onTouchMoved:function(touch,event){
                var target = event.getCurrentTarget(); 
                var log = touch.getLocation();
                var delta = touch.getDelta();
                switch(target.moveType){
                    case "default":
                        // var rect = camera.limit[v_camera.id-1];
                        // var position = {x:target.getPosition().x+delta.x,y:target.getPosition().y+delta.y};
                        // if(cc.rectContainsPoint(rect, position)){
                        //     target.x += delta.x;
                        //     target.y += delta.y;      
                        // }
                        target.x += delta.x;
                        target.y += delta.y;      
                        break;
                    case 'rotate':
                        if(delta.x!=0&&delta.y!=0){              
                            var a=Math.atan2(log.x,-log.y);
                            var b=Math.atan2(log.x+delta.x,-(log.y+delta.y));
                            var θ=b-a;
                            if(log.x>target.x)
                                target.rotation -= θ*360/Math.PI;
                            else
                                target.rotation += θ*360/Math.PI;              
                        }
                        break;
                    case 'scale':
                        var scale = (delta.x/target.width)*2;
                        target.scale += scale;
                        break;                
                }
            },
            onTouchEnded:function(touch,event){
                var target = event.getCurrentTarget(); 
                for(var i=1;i<target.childrenCount;i++){
                    target.children[i].setTouchEnabled(true);
                }
                if(target.moveType=='default'){
                    if(Math.abs(target.x-target.bx)<=20&&Math.abs(target.y-target.by)<=20){    
                        var flag = true;
                        if(target.children[1].visible){
                            flag = false;
                        }         
                        target.children[1].setVisible(flag);
                        target.children[2].setVisible(flag); 
                        target.children[3].setVisible(flag);                 
                    }
                }
                target.bx = target.x;
                target.by = target.y; 
                target.children[0].opacity = 255;
                target.moveType = 'default';   
            }
        }); 
    }
});

