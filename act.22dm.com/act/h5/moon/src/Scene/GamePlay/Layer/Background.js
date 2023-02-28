var GPBackgroundLayer = cc.Layer.extend({
  ctor:function(){
    this._super(); 
  },
  onEnter : function () {
    this._super();  
    this.loadBackgound();
    this.loadRole();
  },
  loadBackgound : function(){   
    var node = new cc.Sprite("#bg_gp.jpg");
    node.attr({
      x : winSize.width>>1,
      y : winSize.height>>1
    })
    this.addChild(node);    
  },
  loadRole : function(){
    var nuan = new cc.Sprite("#role_n.png");
    nuan.attr({
      anchorX : 1,
      anchorY : 1,
      scale : winSize.scale,
      x : winSize.width,
      y : 640
    })
    this.addChild(nuan);
  }
});