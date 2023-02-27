var GPBackgroundLayer = cc.Layer.extend({
  ctor:function(){
    this._super(); 
  },
  onEnter : function () {
    this._super();  
    this.loadBackgound();
  },
  loadBackgound : function(){   
    var node = new cc.Sprite(res.gp_bg);
    node.attr({
      x : winSize.width>>1,
      y : winSize.height>>1
    })
    this.addChild(node);          
  }
});