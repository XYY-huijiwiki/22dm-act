var GPBackgroundLayer = cc.Layer.extend({
  ctor:function(){
    this._super(); 
  },
  onEnter : function () {
    this._super();  
    this.loadBackgound();
  },
  loadBackgound : function(){   
    var node = new cc.Sprite("#bg.jpg");
    node.attr({
      anchorX : 0,
      anchorY : 0,
      x : 0,
      y : 0
    })
    this.addChild(node);          
  }
});